/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

// Unit tests target src/lib (pure TypeScript, no framework). E2E lives in tests/e2e (Playwright).
export default getViteConfig({
  test: {
    include: ['src/**/*.test.ts', 'tests/unit/**/*.test.ts'],
    environment: 'node',
    coverage: { provider: 'v8', include: ['src/lib/**'] },
  },
});
