/**
 * Maps a skill item (as written in skills.json) to the Simple Icons slug used for its logo.
 * Items without an entry render as text-only chips. The SVGs are copied to
 * src/assets/tech by scripts/build-tech-icons.mjs, which reads this same map.
 */
export const techIconSlugs: Readonly<Record<string, string>> = {
  Go: 'go',
  Kotlin: 'kotlin',
  Java: 'openjdk',
  'TypeScript/Node.js': 'typescript',
  'REST (OpenAPI/Swagger)': 'swagger',
  Temporal: 'temporal',
  PostgreSQL: 'postgresql',
  MySQL: 'mysql',
  MongoDB: 'mongodb',
  Redis: 'redis',
  Elasticsearch: 'elasticsearch',
  'Keycloak (OAuth2/OIDC)': 'keycloak',
  Docker: 'docker',
  Nginx: 'nginx',
  Envoy: 'envoyproxy',
  OpenTelemetry: 'opentelemetry',
  Prometheus: 'prometheus',
  Grafana: 'grafana',
  'GitHub Actions': 'githubactions',
  'Bitbucket Pipelines': 'bitbucket',
  Jenkins: 'jenkins',
  'Noções de Terraform/OpenTofu': 'terraform',
  'Android (Kotlin, Java, MVVM, Jetpack Compose)': 'android',
  Flutter: 'flutter',
  SAP: 'sap',
  Trello: 'trello',
};

export interface TechChip {
  /** Name shown in the chip. */
  name: string;
  /** Text that was in parentheses in the source item, if any. */
  detail?: string;
  /** Simple Icons slug, when the technology has a logo (file: src/assets/tech/<slug>.svg). */
  slug?: string;
}

/** "AWS (EC2, S3)" -> { name: "AWS", detail: "EC2, S3" }. */
export function toChip(item: string): TechChip {
  const match = /^(.+?)\s*\((.+)\)$/.exec(item);
  const slug = techIconSlugs[item];
  return {
    name: match?.[1] ?? item,
    ...(match?.[2] ? { detail: match[2] } : {}),
    ...(slug ? { slug } : {}),
  };
}
