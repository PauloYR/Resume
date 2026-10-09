// Actions offered by the command palette. Pure data + filtering: the DOM side lives in
// the CommandPalette component. Contact data comes from the caller (src/config/site.ts).

export type CommandKind = 'link' | 'external' | 'theme' | 'copy';

export interface Command {
  id: string;
  label: string;
  hint: string;
  kind: CommandKind;
  keywords: readonly string[];
  href?: string;
  value?: string;
}

interface CommandSource {
  nav: readonly { href: string; label: string }[];
  site: {
    email: string;
    linkedin: string;
    github: string;
    resumePdf: string;
  };
}

// Anchors of the home page, in page order. Kept in sync with the ids in pages/index.astro.
const homeSections = [
  {
    id: 'resultados',
    label: 'Resultados em produção',
    keywords: ['cases', 'metricas', 'numeros'],
  },
  {
    id: 'empresas',
    label: 'Onde já trabalhei',
    keywords: ['empresas', 'clientes'],
  },
  {
    id: 'trajetoria',
    label: 'Trajetória',
    keywords: ['experiencia', 'carreira', 'historia'],
  },
  {
    id: 'stack',
    label: 'O que eu uso',
    keywords: ['tecnologias', 'skills', 'go', 'stack'],
  },
  {
    id: 'github',
    label: 'Atividade no GitHub',
    keywords: ['contribuicoes', 'repositorios'],
  },
  { id: 'contato', label: 'Contato', keywords: ['email', 'falar', 'linkedin'] },
] as const;

export function buildCommands({ nav, site }: CommandSource): Command[] {
  const pages: Command[] = nav.map((item) => ({
    id: `page:${item.href}`,
    label: item.label === 'Início' ? 'Ir para o início' : `Abrir ${item.label}`,
    hint: 'Página',
    kind: 'link',
    keywords: [item.label],
    href: item.href,
  }));

  const sections: Command[] = homeSections.map((section) => ({
    id: `section:${section.id}`,
    label: section.label,
    hint: 'Seção',
    kind: 'link',
    keywords: section.keywords,
    href: `/#${section.id}`,
  }));

  const actions: Command[] = [
    {
      id: 'action:theme',
      label: 'Alternar tema claro e escuro',
      hint: 'Ação',
      kind: 'theme',
      keywords: ['tema', 'dark', 'light', 'escuro', 'claro'],
    },
    {
      id: 'action:resume',
      label: 'Baixar currículo em PDF',
      hint: 'Ação',
      kind: 'link',
      keywords: ['curriculo', 'cv', 'pdf', 'download'],
      href: site.resumePdf,
    },
    {
      id: 'action:copy-email',
      label: 'Copiar e-mail',
      hint: 'Ação',
      kind: 'copy',
      keywords: ['email', 'contato', 'copiar'],
      value: site.email,
    },
    {
      id: 'link:linkedin',
      label: 'Abrir LinkedIn',
      hint: 'Externo',
      kind: 'external',
      keywords: ['perfil', 'rede'],
      href: site.linkedin,
    },
  ];

  if (site.github) {
    actions.push({
      id: 'link:github',
      label: 'Abrir GitHub',
      hint: 'Externo',
      kind: 'external',
      keywords: ['codigo', 'repositorios'],
      href: site.github,
    });
  }

  return [...pages, ...sections, ...actions];
}

// Lowercase and strip accents so "trajetoria" matches "Trajetória".
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

// Every word of the query must appear in the label or keywords. Results whose label
// starts with a query word come first; ties keep the original order.
export function filterCommands(
  commands: readonly Command[],
  query: string,
): Command[] {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [...commands];

  return commands
    .map((command, index) => {
      const label = normalize(command.label);
      const haystack = `${label} ${command.keywords.map(normalize).join(' ')}`;
      const matches = words.every((word) => haystack.includes(word));
      const startsWith = words.some((word) =>
        label.split(/\s+/).some((part) => part.startsWith(word)),
      );
      return { command, index, matches, rank: startsWith ? 0 : 1 };
    })
    .filter((entry) => entry.matches)
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map((entry) => entry.command);
}
