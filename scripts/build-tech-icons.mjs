// Copies the Simple Icons SVGs used by the stack section into src/assets/tech.
// Source of truth for which icons exist: techIconSlugs in src/lib/tech-icons.ts.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import * as simpleIcons from 'simple-icons';

const mapSource = readFileSync('src/lib/tech-icons.ts', 'utf8');
const slugs = [
  ...new Set([...mapSource.matchAll(/:\s*'([a-z0-9]+)',/g)].map((m) => m[1])),
];
const bySlug = new Map(
  Object.values(simpleIcons)
    .filter((icon) => icon && typeof icon === 'object' && icon.slug)
    .map((icon) => [icon.slug, icon]),
);

mkdirSync('src/assets/tech', { recursive: true });
let missing = 0;
for (const slug of slugs) {
  const icon = bySlug.get(slug);
  if (!icon) {
    console.error(`missing icon: ${slug}`);
    missing += 1;
    continue;
  }
  writeFileSync(`src/assets/tech/${slug}.svg`, `${icon.svg}\n`);
}
console.log(`wrote ${slugs.length - missing} icons to src/assets/tech`);
if (missing) process.exit(1);
