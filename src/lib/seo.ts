import type { Site } from '@config/site';

export interface Crumb {
  name: string;
  path: string;
}

export function absoluteUrl(origin: string, path: string): string {
  return new URL(path, origin).toString().replace(/\/$/, '') || origin;
}

export function personJsonLd(
  site: Site,
  origin: string,
  knowsAbout: readonly string[],
) {
  const sameAs = [site.linkedin, site.github].filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    jobTitle: `${site.role} (${site.specialty})`,
    description: site.description,
    url: origin,
    image: absoluteUrl(origin, '/profile.webp'),
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.city,
      addressRegion: site.region,
      addressCountry: site.country,
    },
    sameAs,
    knowsAbout,
  };
}

export function websiteJsonLd(site: Site, origin: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${site.name} | Portfólio`,
    url: origin,
    inLanguage: site.locale,
    author: { '@type': 'Person', name: site.name },
  };
}

export function serviceJsonLd(site: Site, origin: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `${site.name} | Sites para pequenos negócios`,
    description,
    url: absoluteUrl(origin, '/sites'),
    areaServed: { '@type': 'Country', name: site.country },
    inLanguage: site.locale,
    provider: { '@type': 'Person', name: site.name, url: origin },
  };
}

export function breadcrumbJsonLd(origin: string, crumbs: readonly Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(origin, c.path),
    })),
  };
}

/** Serializes JSON-LD safely for inlining inside a <script> tag (no `</script>` break-out). */
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
