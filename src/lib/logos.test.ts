import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  buildClientItems,
  buildCompanyItems,
  findLogo,
  shortName,
  slugify,
} from './logos';

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'logos-'));
  writeFileSync(join(root, 'gft.webp'), 'x');
  writeFileSync(join(root, 'banco-original.webp'), 'x');
  const sizes = join(root, 'sizes.json');
  writeFileSync(sizes, JSON.stringify({ gft: { width: 321, height: 148 } }));
  return { root, sizes };
}

describe('logos', () => {
  it('slugifies names with accents and spaces', () => {
    expect(slugify('Banco Original')).toBe('banco-original');
    expect(slugify('Itaú S.A.')).toBe('itau-s-a');
  });

  it('finds a logo with its real size, or undefined when the file is missing', () => {
    const { root, sizes } = fixture();
    expect(findLogo('gft', root, sizes)).toEqual({
      src: '/logos/gft.webp',
      width: 321,
      height: 148,
    });
    expect(findLogo('g4f', root, sizes)).toBeUndefined();
  });

  it('falls back to a default size when the manifest has no entry', () => {
    const { root, sizes } = fixture();
    expect(findLogo('banco-original', root, sizes)).toMatchObject({
      width: 404,
      height: 148,
    });
  });

  it('builds company items by job id and keeps the full company name', () => {
    const { root } = fixture();
    const items = buildCompanyItems(
      [
        { id: 'mobiup', company: 'Mobiup – Beyond Digital' },
        { id: 'gft', company: 'Grupo GFT' },
      ],
      root,
    );
    expect(items[0]).toEqual({ name: 'Mobiup – Beyond Digital' });
    expect(items[1]?.logo?.src).toBe('/logos/gft.webp');
  });

  it('builds client items by client id and names the company they came through', () => {
    const { root } = fixture();
    const items = buildClientItems(
      [
        { id: 'banco-original', name: 'Banco Original', via: 'gft' },
        { id: 'orfao', name: 'Sem empresa' },
      ],
      [{ id: 'gft', company: 'Grupo GFT' }],
      root,
    );
    expect(items[0]?.logo?.src).toBe('/logos/banco-original.webp');
    expect(items[0]?.via).toBe('Grupo GFT');
    expect(items[1]).toEqual({ name: 'Sem empresa' });
  });

  it('shortens company names with a trade suffix', () => {
    expect(shortName('Mobiup – Beyond Digital')).toBe('Mobiup');
    expect(shortName('G4F')).toBe('G4F');
  });
});
