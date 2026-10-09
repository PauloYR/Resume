// Captures full-page screenshots of every route at 3 widths and both themes.
// Usage: node scripts/screenshots.mjs [outDir] (expects `npm run preview` on :4321)
import { mkdirSync } from 'node:fs';
import { chromium } from '@playwright/test';

const out = process.argv[2] ?? '.impeccable/review';
const base = process.env.PREVIEW_URL ?? 'http://localhost:4321';
const routes = ['/', '/projetos', '/curriculo'];
const widths = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
];
const themes = ['dark', 'light'];

mkdirSync(out, { recursive: true });
const browser = await chromium.launch();

for (const { name, width, height } of widths) {
  for (const theme of themes) {
    const context = await browser.newContext({
      viewport: { width, height },
      colorScheme: theme,
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    for (const route of routes) {
      await page.goto(base + route, { waitUntil: 'networkidle' });
      const slug = route === '/' ? 'home' : route.slice(1);
      await page.screenshot({
        path: `${out}/${slug}-${name}-${theme}.png`,
        fullPage: true,
      });
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      if (overflow > 0)
        console.log(
          `OVERFLOW ${overflow}px on ${route} at ${width}px (${theme})`,
        );
    }
    await context.close();
  }
}
await browser.close();
console.log(`screenshots written to ${out}`);
