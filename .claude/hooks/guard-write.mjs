#!/usr/bin/env node
// PreToolUse (Write|Edit|MultiEdit): enforce the project laws (security, mobile-first, theming, SEO, privacy) before code hits disk.
import { block, readInput, writtenText } from './lib.mjs';

const input = await readInput();
const file = String(input.tool_input?.file_path ?? '');
const text = writtenText(input);
const base = file.split('/').pop() ?? '';
const problems = [];

// 1. Real env files never get written by the agent. Only the committed template is allowed.
if (/^\.env(\..+)?$/.test(base) && !/\.(example|sample|template)$/.test(base)) {
  block('env file write', [
    `${base} holds real values and must never be created or edited by the agent.`,
    'Document the variable name (with an empty/placeholder value) in .env.example instead.',
  ]);
}

const rel = file
  .replace(/^.*?\/paulo-rocha\//, '')
  .replace(/^.*?\/src\//, 'src/');

// Skip content scans for this very tooling and for docs that must *describe* the patterns.
const isPolicyFile =
  /^\.claude\/|\.claude\/(hooks|skills)\/|(^|\/)(CLAUDE|AGENTS)\.md$|\.oxlintrc\.json$|^\.agents\//.test(
    rel,
  );
if (!isPolicyFile) {
  const rules = [
    [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'private key material'],
    [/\bAKIA[0-9A-Z]{16}\b/, 'AWS access key id'],
    [/\b(ghp|gho|ghs|github_pat)_[A-Za-z0-9_]{20,}/, 'GitHub token'],
    [/\bxox[abprs]-[A-Za-z0-9-]{10,}/, 'Slack token'],
    [
      /\bsk-(live|test|proj|ant)?[-_]?[A-Za-z0-9]{20,}/,
      'API secret key (sk-...)',
    ],
    [
      /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/,
      'hardcoded JWT',
    ],
    [/\bBearer\s+[A-Za-z0-9._~+/-]{20,}/, 'hardcoded Bearer token'],
    [
      /\b(pass(word)?|secret|api[_-]?key|private[_-]?key|access[_-]?token|auth[_-]?token)\b\s*[:=]\s*['"`][^'"`\s$]{8,}['"`]/i,
      'hardcoded credential literal',
    ],
    [
      /PUBLIC_[A-Z0-9_]*(SECRET|TOKEN|PASSWORD|PASSWD|PRIVATE|API_?KEY|CREDENTIAL|SIGNING)[A-Z0-9_]*/,
      'PUBLIC_ env var that looks sensitive (PUBLIC_ vars are shipped to every browser)',
    ],
    [
      /(localStorage|sessionStorage)\s*\.\s*(set|get)Item\(\s*['"`][^'"`]*(token|jwt|session|auth|password|secret)/i,
      'auth/secret in web storage (this site has no auth; never store credentials in the browser)',
    ],
    [
      /\bdangerouslySetInnerHTML\b|\bset:html\b|\binnerHTML\s*=|\binsertAdjacentHTML\b/,
      'raw HTML injection (XSS). Sanitize first and mark the line with `// security-reviewed: <why>`',
    ],
    [/\beval\s*\(|new\s+Function\s*\(/, 'dynamic code execution'],
  ];
  for (const [re, label] of rules) {
    const m = re.exec(text);
    if (!m) continue;
    // Explicit, reviewed escape hatch only for raw-HTML sinks.
    if (/raw HTML/.test(label) && /security-reviewed:/.test(text)) continue;
    problems.push(`${label} -> "${m[0].slice(0, 40)}"`);
  }

  // 2. Client code must not read server-only env (GITHUB_TOKEN is build-time only).
  const isClient =
    /\.(tsx|jsx)$/.test(file) || /<script(?![^>]*is:inline)[^>]*>/.test(text);
  if (
    isClient &&
    /process\.env\b|import\.meta\.env\.(?!PUBLIC_|MODE|DEV|PROD|SSR|BASE_URL|SITE)\w+/.test(
      text,
    )
  ) {
    problems.push(
      'client code reads a non-PUBLIC_ env var (it would be undefined or leak). Read env in build-time code (src/lib, frontmatter) only',
    );
  }
  if (
    /\bGITHUB_TOKEN\b/.test(text) &&
    !/^src\/lib\/|^scripts\/|^astro\.config\.|^\.github\/|^\.env\.example$|^README\.md$/.test(
      rel,
    )
  ) {
    problems.push(
      'GITHUB_TOKEN referenced outside src/lib, scripts or astro.config. It is build-time only and must never reach components or client code',
    );
  }

  // 3. Layer boundaries (oxlint enforces the full set after the edit; this is the fast pre-check).
  if (
    /^src\/(lib|content)\//.test(rel) &&
    /from\s+['"](astro|astro\/[^'"]*|react|react-dom[^'"]*|@\/(components|layouts|pages)[^'"]*|[^'"]*\/(components|layouts|pages)\/[^'"]*)['"]/.test(
      text,
    )
  ) {
    problems.push(
      'src/lib and src/content are framework-free data/logic: they must not import astro, react, components, layouts or pages (astro:content is allowed)',
    );
  }

  // 4. Privacy: personal contact data lives only in src/config/site.ts and src/content, never in markup.
  if (
    /^src\/(components|layouts|pages)\//.test(rel) &&
    /\(?\d{2}\)?\s*9?\d{4}[-\s]\d{4}|\btel:\+?\d{8,}|\b[\w.+-]+@[\w-]+\.[a-z]{2,}\b/i.test(
      text,
    )
  ) {
    problems.push(
      'personal phone/e-mail literal in markup. Import it from src/config/site.ts (the phone must never be in public HTML)',
    );
  }
}

// 5. Mobile-first: UI source must not use desktop-first or mobile-hostile patterns.
if (/^src\/.*\.(astro|tsx|jsx|css|html)$/.test(rel)) {
  const mobileRules = [
    [
      /\bmax-(sm|md|lg|xl|2xl|\[[^\]]+\]):/,
      'desktop-first Tailwind variant (max-*:). Style the base for mobile and scale up with sm:/md:/lg:',
    ],
    [
      /@media[^{]*\(\s*max-(width|height)\s*:/,
      'desktop-first media query (max-width). Use min-width, or Tailwind breakpoint variants',
    ],
    [
      /user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(\.0)?\b/,
      'viewport that disables pinch-zoom (accessibility)',
    ],
    [
      /\b(min-h|h|max-h)-screen\b|\b100vh\b/,
      '100vh/h-screen breaks under mobile browser bars. Use dvh (min-h-dvh, h-dvh, 100dvh)',
    ],
    [
      /\b(min-w|w)-\[\d{3,}px\]/,
      'fixed pixel width >= 100px can overflow a 320px viewport. Use w-full/max-w-* or fluid units',
    ],
    // 5b. Motion: no dry state changes (AGENTS.md, "Movimento"). Toggling display/hidden snaps.
    [
      /\b\w*\.hidden\s*=[^=]|classList\.(toggle|add|remove)\(\s*['"]hidden['"]/,
      'dry show/hide (.hidden = / classList hidden). Animate the state: toggle data-open and transition opacity/grid-rows/visibility (see AGENTS.md "Movimento")',
    ],
    [
      /\b(group-)?(open|checked):(hidden|block|inline|inline-block|flex|grid)\b/,
      'display swap on a state variant snaps with no transition. Stack both states in a grid and cross-fade opacity (see AGENTS.md "Movimento")',
    ],
  ];
  for (const [re, label] of mobileRules) {
    const m = re.exec(text);
    if (m) problems.push(`${label} -> "${m[0].slice(0, 40)}"`);
  }
}

// 6. Theming: colors come from semantic tokens defined in src/styles/global.css, never literals in components.
if (/^src\/(components|layouts|pages)\/.*\.(astro|tsx|jsx)$/.test(rel)) {
  const m =
    /(?<![&\w-])#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b(?![\w-])|\b(rgb|rgba|hsl|hsla|oklch|oklab)\(/.exec(
      text.replace(/&#\d+;/g, '').replace(/href=["']#[^"']*["']/g, ''),
    );
  if (m)
    problems.push(
      `hardcoded color literal -> "${m[0]}". Use a semantic token (bg-surface, text-fg, text-accent...) defined in src/styles/global.css so both themes work`,
    );
  const palette =
    /\b(bg|text|border|ring|from|to|via|fill|stroke|divide|outline|shadow)-(white|black|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(-\d{2,3})?\b/.exec(
      text,
    );
  if (palette)
    problems.push(
      `raw Tailwind palette class -> "${palette[0]}". Use semantic tokens so the dark/light theme switch works`,
    );
}

// 7. SEO / a11y / safety in markup.
if (/^src\/.*\.(astro|tsx|jsx|html)$/.test(rel)) {
  for (const tag of text.match(/<a\b[^>]*>/g) ?? []) {
    if (
      /target\s*=\s*["']_blank["']/.test(tag) &&
      !/rel\s*=\s*["'][^"']*noopener[^"']*["']/.test(tag)
    )
      problems.push(
        `target="_blank" link without rel="noopener noreferrer" -> "${tag.slice(0, 50)}"`,
      );
  }
  for (const tag of text.match(/<img\b[^>]*>/g) ?? []) {
    if (
      !/\bwidth\s*=/.test(tag) ||
      !/\bheight\s*=/.test(tag) ||
      !/\balt\s*=/.test(tag)
    )
      problems.push(
        `<img> without width, height and alt (CLS/a11y). Prefer <Image> from astro:assets -> "${tag.slice(0, 50)}"`,
      );
  }
  if (
    /<html\b/.test(text) &&
    !/<html\b[^>]*\blang\s*=\s*["']pt-BR["']/.test(text)
  )
    problems.push('<html> must declare lang="pt-BR"');
  if (
    /<(script|link)\b[^>]*(src|href)\s*=\s*["']https?:\/\/(?!www\.linkedin\.com|github\.com)/.test(
      text,
    )
  )
    problems.push(
      'third-party script/stylesheet from a CDN. Self-host fonts/assets (privacy, CSP, performance)',
    );
}

if (problems.length) {
  block(`project rule violated in ${base}`, [
    ...problems,
    'Fix the code, or if this is a genuine false positive, ask the user instead of working around it.',
  ]);
}
