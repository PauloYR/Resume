// Renders one 1200x630 Open Graph image per page into public/og/ using Chromium.
// Usage: node scripts/build-og.mjs   (independent of dist; fonts come from node_modules)
import { mkdirSync, readFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const font = (pkg, file) =>
  `data:font/woff2;base64,${readFileSync(`node_modules/@fontsource-variable/${pkg}/files/${file}`).toString('base64')}`;

const photo = `data:image/webp;base64,${readFileSync('public/profile.webp').toString('base64')}`;
const display = font(
  'bricolage-grotesque',
  'bricolage-grotesque-latin-wght-normal.woff2',
);
const text = font('hanken-grotesk', 'hanken-grotesk-latin-wght-normal.woff2');

const pages = [
  {
    slug: 'default',
    photo: true,
    title: 'Paulo Rocha',
    accent: 'Engenheiro de Software Sênior, Backend em Go',
    line: '588 eventos por segundo · Microsserviços · Pagamentos · AWS',
  },
  {
    slug: 'home',
    photo: true,
    title: 'Paulo Rocha',
    accent: 'Engenheiro de Software Sênior, Backend em Go',
    line: 'Fortaleza, CE · Remoto ou híbrido · Início imediato',
  },
  {
    slug: 'projetos',
    title: 'Cases e resultados',
    accent: 'Backend em Go em produção',
    line: 'De 15–25 s para ≤ 1 s · 98,1% de sucesso · 588 eventos/s',
  },
  {
    slug: 'curriculo',
    title: 'Currículo',
    accent: 'Paulo Rocha, Backend em Go',
    line: '8 anos de experiência · Go · AWS · Temporal',
  },
];

const html = (
  p,
) => `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
@font-face{font-family:D;src:url(${display}) format('woff2');font-weight:200 800}
@font-face{font-family:T;src:url(${text}) format('woff2');font-weight:100 900}
:root{--bg:#15131f;--fg:#f3f1ff;--muted:#aeaacd;--a:#a58bff;--b:#5ba2ff}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:var(--bg);color:var(--fg);font-family:T,sans-serif;padding:72px;display:flex;flex-direction:column;justify-content:space-between;
background-image:radial-gradient(circle at 85% 10%,rgba(91,162,255,.22),transparent 45%),radial-gradient(circle at 10% 100%,rgba(165,139,255,.2),transparent 45%)}
.brand{font:600 28px D;display:flex;align-items:center;gap:12px;color:var(--muted)}
.me{width:84px;height:84px;border-radius:99px;border:3px solid var(--a);object-fit:cover}
.dot{width:14px;height:14px;border-radius:99px;background:linear-gradient(90deg,var(--a),var(--b))}
h1{font:700 104px/1.02 D;letter-spacing:-.03em}
h2{margin-top:20px;font:600 44px/1.15 D;background:linear-gradient(90deg,var(--a),var(--b));-webkit-background-clip:text;color:transparent;max-width:1000px}
p{font-size:30px;color:var(--muted)}
</style></head><body>
<div class="brand">${p.photo ? `<img class="me" src="${photo}" alt="">` : '<span class="dot"></span>'}paulo rocha | portfólio</div>
<div><h1>${p.title}</h1><h2>${p.accent}</h2></div>
<p>${p.line}</p></body></html>`;

mkdirSync('public/og', { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
  });
  for (const p of pages) {
    await page.setContent(html(p), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `public/og/${p.slug}.png` });
  }
  console.log(`og images written: ${pages.length}`);
} finally {
  await browser.close();
}
