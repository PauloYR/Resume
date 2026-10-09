import { existsSync, readFileSync } from 'node:fs';

const extensions = ['webp', 'svg', 'png'] as const;
const FALLBACK_SIZE = { width: 404, height: 148 };

export interface Logo {
  src: string;
  width: number;
  height: number;
}

export interface CarouselItem {
  name: string;
  logo?: Logo;
  /** Short name of the company the client was served through. */
  via?: string;
}

/** "Banco Original" -> "banco-original". */
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function readSizes(
  path: string,
): Record<string, { width: number; height: number }> {
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return {};
  }
}

/**
 * Returns the logo for `public/logos/<slug>.(webp|svg|png)` when the file exists.
 * Dimensions come from the manifest written by scripts/optimize-logos.mjs.
 */
export function findLogo(
  slug: string,
  root = 'public/logos',
  sizesPath = 'src/content/logo-sizes.json',
): Logo | undefined {
  for (const ext of extensions) {
    if (!existsSync(`${root}/${slug}.${ext}`)) continue;
    const size = readSizes(sizesPath)[slug] ?? FALLBACK_SIZE;
    return { src: `/logos/${slug}.${ext}`, ...size };
  }
  return undefined;
}

interface Job {
  id: string;
  company: string;
}

interface Client {
  id: string;
  name: string;
  via?: string | undefined;
}

function toItem(
  name: string,
  logo: Logo | undefined,
  via?: string,
): CarouselItem {
  return { name, ...(logo ? { logo } : {}), ...(via ? { via } : {}) };
}

/** "Mobiup – Beyond Digital" -> "Mobiup". */
export function shortName(company: string): string {
  return company.split(' – ')[0] ?? company;
}

/** Companies the user worked for, in the order given. The logo file is named after the job id. */
export function buildCompanyItems(
  jobs: readonly Job[],
  root?: string,
): CarouselItem[] {
  return jobs.map((job) => toItem(job.company, findLogo(job.id, root)));
}

/** Clients served through those companies. The logo file is named after the client id. */
export function buildClientItems(
  clients: readonly Client[],
  jobs: readonly Job[],
  root?: string,
): CarouselItem[] {
  const companyById = new Map(
    jobs.map((job) => [job.id, shortName(job.company)]),
  );
  return clients.map((client) =>
    toItem(
      client.name,
      findLogo(client.id, root),
      client.via ? companyById.get(client.via) : undefined,
    ),
  );
}
