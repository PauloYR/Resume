import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { z } from 'zod';
import { logger } from './logger';

export type HeatLevel = 0 | 1 | 2 | 3 | 4;

export interface GithubDay {
  date: string;
  count: number;
  level: HeatLevel;
}

export interface GithubActivity {
  user: string;
  total: number;
  weeks: GithubDay[][];
  languages: { name: string; percent: number }[];
  repos: number;
  stars: number;
  fetchedAt: string;
}

const responseSchema = z.object({
  data: z.object({
    user: z.object({
      contributionsCollection: z.object({
        contributionCalendar: z.object({
          totalContributions: z.number(),
          weeks: z.array(
            z.object({
              contributionDays: z.array(
                z.object({ date: z.string(), contributionCount: z.number() }),
              ),
            }),
          ),
        }),
      }),
      repositories: z.object({
        totalCount: z.number(),
        nodes: z.array(
          z.object({
            stargazerCount: z.number(),
            languages: z.object({
              edges: z.array(
                z.object({
                  size: z.number(),
                  node: z.object({ name: z.string() }),
                }),
              ),
            }),
          }),
        ),
      }),
    }),
  }),
});

const cacheSchema = z.object({
  user: z.string(),
  total: z.number(),
  weeks: z.array(
    z.array(
      z.object({ date: z.string(), count: z.number(), level: z.number() }),
    ),
  ),
  languages: z.array(z.object({ name: z.string(), percent: z.number() })),
  repos: z.number(),
  stars: z.number(),
  fetchedAt: z.string(),
});

const QUERY = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC) {
      totalCount
      nodes {
        stargazerCount
        languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
          edges { size node { name } }
        }
      }
    }
  }
}`;

/** Maps a day's count to a 0-4 level relative to the busiest day of the window. */
export function toLevel(count: number, max: number): HeatLevel {
  if (count <= 0 || max <= 0) return 0;
  return Math.min(4, Math.max(1, Math.ceil((count / max) * 4))) as HeatLevel;
}

export function buildActivity(
  user: string,
  parsed: z.infer<typeof responseSchema>,
  now: Date = new Date(),
): GithubActivity {
  const { contributionsCollection, repositories } = parsed.data.user;
  const calendar = contributionsCollection.contributionCalendar;
  const max = Math.max(
    0,
    ...calendar.weeks.flatMap((w) =>
      w.contributionDays.map((d) => d.contributionCount),
    ),
  );

  const weeks = calendar.weeks.map((week) =>
    week.contributionDays.map((day) => ({
      date: day.date,
      count: day.contributionCount,
      level: toLevel(day.contributionCount, max),
    })),
  );

  const bytes = new Map<string, number>();
  for (const repo of repositories.nodes) {
    for (const edge of repo.languages.edges) {
      bytes.set(edge.node.name, (bytes.get(edge.node.name) ?? 0) + edge.size);
    }
  }
  const totalBytes = [...bytes.values()].reduce((a, b) => a + b, 0);
  const languages = [...bytes.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, size]) => ({
      name,
      percent: totalBytes === 0 ? 0 : Math.round((size / totalBytes) * 100),
    }));

  return {
    user,
    total: calendar.totalContributions,
    weeks,
    languages,
    repos: repositories.totalCount,
    stars: repositories.nodes.reduce((sum, r) => sum + r.stargazerCount, 0),
    fetchedAt: now.toISOString(),
  };
}

function readCache(path: string, user: string): GithubActivity | null {
  if (!existsSync(path)) return null;
  try {
    const cached = cacheSchema.parse(JSON.parse(readFileSync(path, 'utf8')));
    if (cached.user !== user) return null;
    return {
      ...cached,
      weeks: cached.weeks.map((w) =>
        w.map((d) => ({ ...d, level: d.level as HeatLevel })),
      ),
    };
  } catch {
    logger.warn('github cache unreadable, ignoring', { path });
    return null;
  }
}

export interface LoadOptions {
  user: string;
  token?: string;
  cachePath?: string;
  fetchImpl?: typeof fetch;
}

/**
 * Build-time only. Fetches contributions and languages with the GraphQL API; on any failure
 * (no token, network, schema drift) falls back to the committed cache so the build never breaks.
 */
export async function loadGithubActivity(
  options: LoadOptions,
): Promise<GithubActivity | null> {
  const {
    user,
    token,
    cachePath = 'src/data/github.json',
    fetchImpl = fetch,
  } = options;
  if (!user) return null;

  if (!token) {
    logger.info('no GitHub token configured, using cached activity');
    return readCache(cachePath, user);
  }

  try {
    const response = await fetchImpl('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: QUERY, variables: { login: user } }),
    });
    if (!response.ok) throw new Error(`GitHub responded ${response.status}`);
    const activity = buildActivity(
      user,
      responseSchema.parse(await response.json()),
    );
    mkdirSync(dirname(cachePath), { recursive: true });
    writeFileSync(cachePath, `${JSON.stringify(activity)}\n`);
    return activity;
  } catch (error) {
    logger.warn('github fetch failed, using cached activity', {
      error: error instanceof Error ? error.message : 'unknown',
    });
    return readCache(cachePath, user);
  }
}
