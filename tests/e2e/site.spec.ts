import { expect, test } from '@playwright/test';

const routes = ['/', '/projetos', '/curriculo'];

for (const route of routes) {
  test.describe(route, () => {
    test('has one h1, meta tags and valid JSON-LD', async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);

      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');

      const title = await page.title();
      expect(title.length).toBeGreaterThan(20);
      expect(title.length).toBeLessThanOrEqual(75);

      const description = await page
        .locator('meta[name="description"]')
        .getAttribute('content');
      expect(description?.length ?? 0).toBeGreaterThan(60);
      expect(description?.length ?? 0).toBeLessThanOrEqual(200);

      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);

      const blocks = await page
        .locator('script[type="application/ld+json"]')
        .allTextContents();
      expect(blocks.length).toBeGreaterThan(0);
      for (const block of blocks) expect(() => JSON.parse(block)).not.toThrow();
    });

    test('has no horizontal overflow and no phone number', async ({ page }) => {
      await page.goto(route);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
      const html = await page.content();
      expect(html).not.toMatch(/98620|\(85\)\s*9/);
    });
  });
}

test('theme toggle switches and persists without flash', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const root = page.locator('html');
  await expect(root).toHaveAttribute('data-theme', 'dark');

  await page.locator('[data-theme-toggle]').first().click();
  await expect(root).toHaveAttribute('data-theme', 'light');

  await page.reload();
  await expect(root).toHaveAttribute('data-theme', 'light');
});

test('home exposes contact and resume links', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('link', { name: /Falar comigo/ }),
  ).toHaveAttribute('href', /^mailto:/);
  await expect(
    page.getByRole('link', { name: /Baixar currículo/ }),
  ).toHaveAttribute('href', '/curriculo-paulo-rocha.pdf');
  const linkedin = page.getByRole('link', { name: /LinkedIn/ }).first();
  await expect(linkedin).toHaveAttribute('href', /linkedin\.com\/in\//);
  await expect(linkedin).toHaveAttribute('rel', /noopener/);
});

test('carousels render each item once for assistive tech', async ({ page }) => {
  await page.goto('/');
  const cases = [
    { name: 'Empresas onde trabalhei', count: 4 },
    { name: 'Clientes que atendi', count: 7 },
  ];
  for (const { name, count } of cases) {
    const region = page.getByRole('region', { name });
    await expect(
      region.locator('ul:not([aria-hidden])').first().locator('li'),
    ).toHaveCount(count);
    await expect(region.locator('ul[aria-hidden="true"]')).toHaveCount(1);
  }
});

test('mobile menu opens and closes with Escape', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile only');
  await page.goto('/');
  const button = page.locator('[data-menu-button]');
  await button.click();
  await expect(page.locator('#mobile-menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#mobile-menu')).toBeHidden();
});

test('mobile menu button shows a visible icon', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile only');
  await page.goto('/');
  const icon = page.locator('[data-menu-button] svg').first();
  const box = await icon.boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(16);
  expect(box?.height).toBeGreaterThanOrEqual(16);
  await expect(icon).toHaveCSS('opacity', '1');
});

test.describe('stack section', () => {
  test('shows tech chips with names and an interactive gopher', async ({
    page,
  }) => {
    await page.goto('/');
    const stack = page.locator('section[aria-labelledby="stack"]');
    await expect(stack.getByText('PostgreSQL')).toBeVisible();
    await expect(stack.locator('.tech-icon').first()).toBeVisible();

    const line = stack.locator('[data-gopher-line]');
    const before = await line.textContent();
    await stack.getByRole('button', { name: /gopher/i }).click();
    await expect(line).not.toHaveText(before ?? '');
  });

  test('has no horizontal scroll at 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto('/');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
