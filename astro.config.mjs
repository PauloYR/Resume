// @ts-check
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// Public production origin (canonical, sitemap, Open Graph). Not a secret.
const site = process.env.SITE_URL ?? 'http://localhost:4321';

export default defineConfig({
  site,
  devToolbar: { enabled: false },
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
