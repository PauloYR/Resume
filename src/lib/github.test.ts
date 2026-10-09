import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildActivity, loadGithubActivity, toLevel } from './github';

const payload = {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: 15,
          weeks: [
            {
              contributionDays: [
                { date: '2026-01-01', contributionCount: 0 },
                { date: '2026-01-02', contributionCount: 3 },
                { date: '2026-01-03', contributionCount: 12 },
              ],
            },
          ],
        },
      },
      repositories: {
        totalCount: 2,
        nodes: [
          {
            stargazerCount: 4,
            languages: {
              edges: [
                { size: 900, node: { name: 'Go' } },
                { size: 100, node: { name: 'Shell' } },
              ],
            },
          },
          {
            stargazerCount: 1,
            languages: { edges: [{ size: 1000, node: { name: 'Go' } }] },
          },
        ],
      },
    },
  },
};

function tempCache(): string {
  return join(mkdtempSync(join(tmpdir(), 'gh-')), 'github.json');
}

describe('github activity', () => {
  it('maps counts to relative levels', () => {
    expect(toLevel(0, 10)).toBe(0);
    expect(toLevel(1, 10)).toBe(1);
    expect(toLevel(10, 10)).toBe(4);
    expect(toLevel(5, 0)).toBe(0);
  });

  it('aggregates languages by size and sums stars', () => {
    const activity = buildActivity(
      'someone',
      payload,
      new Date('2026-01-05T00:00:00Z'),
    );
    expect(activity.total).toBe(15);
    expect(activity.stars).toBe(5);
    expect(activity.languages[0]).toEqual({ name: 'Go', percent: 95 });
    expect(activity.weeks[0]?.map((d) => d.level)).toEqual([0, 1, 4]);
  });

  it('returns null without a user', async () => {
    expect(await loadGithubActivity({ user: '' })).toBeNull();
  });

  it('writes the cache on success and reads it when the fetch fails', async () => {
    const cachePath = tempCache();
    const ok = (async () =>
      new Response(JSON.stringify(payload))) as unknown as typeof fetch;
    const fresh = await loadGithubActivity({
      user: 'someone',
      token: 'x',
      cachePath,
      fetchImpl: ok,
    });
    expect(fresh?.total).toBe(15);
    expect(JSON.parse(readFileSync(cachePath, 'utf8')).user).toBe('someone');

    const broken = (async () =>
      new Response('nope', { status: 500 })) as unknown as typeof fetch;
    const cached = await loadGithubActivity({
      user: 'someone',
      token: 'x',
      cachePath,
      fetchImpl: broken,
    });
    expect(cached?.total).toBe(15);
  });

  it('falls back when the payload does not match the schema', async () => {
    const cachePath = tempCache();
    const bad = (async () =>
      new Response(
        JSON.stringify({ data: { user: null } }),
      )) as unknown as typeof fetch;
    expect(
      await loadGithubActivity({
        user: 'someone',
        token: 'x',
        cachePath,
        fetchImpl: bad,
      }),
    ).toBeNull();
  });

  it('ignores a cache that belongs to another user', async () => {
    const cachePath = tempCache();
    writeFileSync(
      cachePath,
      JSON.stringify({
        user: 'other',
        total: 1,
        weeks: [],
        languages: [],
        repos: 0,
        stars: 0,
        fetchedAt: 'x',
      }),
    );
    expect(await loadGithubActivity({ user: 'someone', cachePath })).toBeNull();
  });
});
