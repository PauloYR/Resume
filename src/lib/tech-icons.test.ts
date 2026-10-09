import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { techIconSlugs, toChip } from './tech-icons';

describe('toChip', () => {
  it('splits the parenthesised detail from the name', () => {
    expect(toChip('AWS (EC2, S3)')).toEqual({ name: 'AWS', detail: 'EC2, S3' });
  });

  it('adds the slug only when the technology has a logo', () => {
    expect(toChip('Go')).toEqual({ name: 'Go', slug: 'go' });
    expect(toChip('Scrum')).toEqual({ name: 'Scrum' });
  });
});

describe('techIconSlugs', () => {
  it('has a bundled SVG for every mapped slug', () => {
    for (const slug of new Set(Object.values(techIconSlugs))) {
      expect([slug, existsSync(`src/assets/tech/${slug}.svg`)]).toEqual([
        slug,
        true,
      ]);
    }
  });

  it('only maps items that exist in skills.json', () => {
    const groups: { items: string[] }[] = JSON.parse(
      readFileSync('src/content/skills.json', 'utf8'),
    );
    const items = new Set(groups.flatMap((group) => group.items));
    for (const item of Object.keys(techIconSlugs)) {
      expect([item, items.has(item)]).toEqual([item, true]);
    }
  });
});
