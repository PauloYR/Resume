import { describe, expect, it } from 'vitest';
import { buildCommands, filterCommands, normalize } from './commands';

const source = {
  nav: [
    { href: '/', label: 'Início' },
    { href: '/projetos', label: 'Cases' },
  ],
  site: {
    email: 'dev@example.com',
    linkedin: 'https://www.linkedin.com/in/dev',
    github: 'https://github.com/dev',
    resumePdf: '/curriculo.pdf',
  },
};

describe('buildCommands', () => {
  const commands = buildCommands(source);

  it('has unique ids and a target for each kind', () => {
    const ids = commands.map((command) => command.id);
    expect(new Set(ids).size).toBe(ids.length);

    const linked = commands.filter(
      (command) => command.kind === 'link' || command.kind === 'external',
    );
    expect(linked.every((command) => Boolean(command.href))).toBe(true);

    const copied = commands.filter((command) => command.kind === 'copy');
    expect(copied.length).toBeGreaterThan(0);
    expect(copied.every((command) => Boolean(command.value))).toBe(true);
  });

  it('opens external profiles outside the page', () => {
    const external = commands.filter((command) => command.kind === 'external');
    expect(external.map((command) => command.href)).toEqual([
      source.site.linkedin,
      source.site.github,
    ]);
  });

  it('omits GitHub when there is no profile url', () => {
    const without = buildCommands({
      ...source,
      site: { ...source.site, github: '' },
    });
    expect(without.some((command) => command.id === 'link:github')).toBe(false);
  });

  it('links sections through the home anchors', () => {
    const section = commands.find(
      (command) => command.id === 'section:trajetoria',
    );
    expect(section?.href).toBe('/#trajetoria');
  });
});

describe('normalize', () => {
  it('strips accents and case', () => {
    expect(normalize('  Trajetória ')).toBe('trajetoria');
  });
});

describe('filterCommands', () => {
  const commands = buildCommands(source);

  it('returns everything for an empty query', () => {
    expect(filterCommands(commands, '  ')).toHaveLength(commands.length);
  });

  it('matches without accents', () => {
    const result = filterCommands(commands, 'trajetoria');
    expect(result[0]?.id).toBe('section:trajetoria');
  });

  it('matches keywords', () => {
    const result = filterCommands(commands, 'pdf');
    expect(result.map((command) => command.id)).toContain('action:resume');
  });

  it('requires every word to match', () => {
    expect(filterCommands(commands, 'copiar email')[0]?.id).toBe(
      'action:copy-email',
    );
    expect(filterCommands(commands, 'copiar zzz')).toEqual([]);
  });

  it('ranks label prefixes first', () => {
    const result = filterCommands(commands, 'abrir');
    expect(result[0]?.label.startsWith('Abrir')).toBe(true);
  });
});
