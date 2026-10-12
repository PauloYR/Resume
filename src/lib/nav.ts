export interface NavItem {
  href: string;
  label: string;
}

export const nav: readonly NavItem[] = [
  { href: '/', label: 'Início' },
  { href: '/projetos', label: 'Cases' },
  { href: '/sites', label: 'Sites' },
  { href: '/curriculo', label: 'Currículo' },
] as const;

export function isCurrent(current: string, href: string): boolean {
  const clean = current.replace(/\/$/, '') || '/';
  return href === '/'
    ? clean === '/'
    : clean === href || clean.startsWith(`${href}/`);
}
