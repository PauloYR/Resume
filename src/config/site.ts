// Single place for identity and contact data. Never repeat these literals in markup.
// The phone number is intentionally absent: it must never reach public HTML.

// Public profile name. GITHUB_USER can override it at build time (e.g. to test with another account).
const githubUser =
  process.env.GITHUB_USER || import.meta.env.GITHUB_USER || 'PauloYR';

export const site = {
  name: 'Paulo Rocha',
  role: 'Engenheiro de Software Sênior',
  specialty: 'Backend em Go',
  city: 'Fortaleza',
  region: 'CE',
  country: 'BR',
  locale: 'pt-BR',
  yearsOfExperience: 8,
  availability: 'Disponível para início imediato, remoto ou híbrido',
  description:
    'Engenheiro de Software Sênior especialista em backend com Go: microsserviços, sistemas orientados a eventos, pagamentos e observabilidade em AWS.',
  email: 'pauloyr@outlook.com',
  linkedin: 'https://www.linkedin.com/in/pauloyr',
  github: githubUser ? `https://github.com/${githubUser}` : '',
  githubUser,
  resumePdf: '/curriculo-paulo-rocha.pdf',
  summary:
    'Engenheiro de Software Sênior com 8 anos de experiência, com foco em backend em Go e trajetória de desenvolvimento Android nativo (Kotlin e Java) a microsserviços em plataforma financeira. Projetei e mantive sistemas distribuídos orientados a eventos, pagamentos (cartão recorrente e PIX), workflows com Temporal e um motor de pontos que sustentou 588 eventos por segundo. Atuo com Clean Architecture, testes automatizados, observabilidade (OpenTelemetry, Grafana), segurança (criptografia com AWS KMS, Keycloak, OPA) e AWS. Em time de 8 devs com 18 microsserviços, tomei decisões técnicas, defini padrões e mentorei devs. Disponível para início imediato; aberto a posições de Software Engineer (Backend/Go), remoto ou híbrido.',
  languages: [
    'Português: nativo',
    'Inglês: intermediário (leitura e comunicação técnica)',
  ],
} as const;

export type Site = typeof site;
