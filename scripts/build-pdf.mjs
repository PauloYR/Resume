// Generates the resume PDF from the site's own /curriculo route (single source of truth).
// Usage: npm run build && npm run pdf   -> writes dist/curriculo-paulo-rocha.pdf (+ public/ for dev)
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
} from 'node:fs';
import { chromium } from '@playwright/test';
import { serveDist } from './serve-dist.mjs';

if (!existsSync('dist/curriculo.html')) {
  console.error('dist/curriculo.html not found. Run `npm run build` first.');
  process.exit(1);
}

const server = await serveDist('dist');
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.emulateMedia({ media: 'print', colorScheme: 'light' });
  await page.goto(`${server.url}/curriculo`, { waitUntil: 'networkidle' });
  const out = 'dist/curriculo-paulo-rocha.pdf';
  await page.pdf({
    path: out,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
  });

  const raw = readFileSync(out, 'latin1');
  const pages = (raw.match(/\/Type\s*\/Page[^s]/g) ?? []).length;
  if (pages > 2)
    throw new Error(`resume PDF has ${pages} pages, expected at most 2`);
  if (statSync(out).size < 10_000) throw new Error('resume PDF looks empty');

  mkdirSync('public', { recursive: true });
  copyFileSync(out, 'public/curriculo-paulo-rocha.pdf');
  console.log(
    `resume PDF written (${pages} page(s), ${Math.round(statSync(out).size / 1024)} KB)`,
  );
} finally {
  await browser.close();
  server.close();
}
