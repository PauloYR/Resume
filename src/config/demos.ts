import { z } from 'zod';

// Live URLs of the demo landing pages. Public values, read at build time only.
// An unset or invalid value yields no link (the card renders without redirect).
// https only, except plain http on localhost so the cards can be previewed in dev.
const httpsUrl = z.url({ protocol: /^https$/ });
const localUrl = z.url({
  protocol: /^http$/,
  hostname: /^(localhost|127\.0\.0\.1)$/,
});

const liveUrl = (value: string | undefined): string | undefined => {
  const parsed = httpsUrl.or(localUrl).safeParse(value?.trim());
  return parsed.success ? parsed.data : undefined;
};

const read = (name: string): string | undefined =>
  process.env[name] || (import.meta.env[name] as string | undefined);

export const demoUrls = {
  veterinary: liveUrl(read('DEMO_VETERINARY_URL')),
  law: liveUrl(read('DEMO_LAW_URL')),
  coffee: liveUrl(read('DEMO_COFFEE_URL')),
} as const;

export type DemoSlug = keyof typeof demoUrls;
