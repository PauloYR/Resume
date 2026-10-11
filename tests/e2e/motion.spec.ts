import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

/** Samples a numeric computed value while a transition runs. */
async function sample(
  target: Locator,
  read: (element: Element) => number,
  count = 6,
  gap = 40,
): Promise<number[]> {
  const values: number[] = [];
  for (let i = 0; i < count; i += 1) {
    values.push(await target.evaluate(read));
    await target.page().waitForTimeout(gap);
  }
  return values;
}

const detailsHeight = (element: Element) =>
  element.getBoundingClientRect().height;
const opacityOf = (element: Element) =>
  Number(getComputedStyle(element).opacity);

async function openSecondRole(page: Page) {
  await page.goto('/');
  const section = page.locator('section[aria-labelledby="trajetoria"]');
  return section.locator('details').nth(1);
}

test.describe('state changes are animated', () => {
  test('timeline details grows through intermediate heights', async ({
    page,
  }) => {
    const details = await openSecondRole(page);
    await details.scrollIntoViewIfNeeded();
    const closed = await details.evaluate(detailsHeight);

    await details.locator('summary').click();
    const heights = await sample(details, detailsHeight, 12, 25);
    const final = heights[heights.length - 1] ?? 0;
    expect(final).toBeGreaterThan(closed + 40);
    expect(
      heights.some((height) => height > closed + 1 && height < final - 1),
    ).toBe(true);
  });

  test('timeline details collapses gradually and keeps both labels in sync', async ({
    page,
  }) => {
    const details = await openSecondRole(page);
    await details.locator('summary').click();
    await expect(details.getByText('Ocultar detalhes')).toBeVisible();

    const open = await details.evaluate(detailsHeight);
    await details.locator('summary').click();
    const heights = await sample(details, detailsHeight, 12, 25);
    const closed = heights[heights.length - 1] ?? 0;
    expect(
      heights.some((height) => height > closed + 1 && height < open - 1),
    ).toBe(true);
    await expect(details.getByText('Ver realizações e stack')).toBeVisible();
    await expect(details.getByText('Ocultar detalhes')).toBeHidden();
  });

  test('command palette fades out instead of vanishing', async ({ page }) => {
    await page.goto('/');
    const dialog = page.getByRole('dialog', { name: 'Buscar seção ou ação' });
    await page.keyboard.press('Control+k');
    await expect(dialog).toBeVisible();
    await expect
      .poll(() => dialog.evaluate(opacityOf), { timeout: 1000 })
      .toBe(1);

    await page.keyboard.press('Escape');
    // getByRole stops matching once the dialog is hidden, so sample by id.
    const seen = await sample(
      page.locator('#command-palette'),
      opacityOf,
      8,
      15,
    );
    await expect(dialog).toBeHidden();
    expect(seen.some((value) => value > 0 && value < 1)).toBe(true);
  });

  test('toast fades in and out after copying the email', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/');
    await page.keyboard.press('Control+k');
    await page.getByRole('combobox').fill('copiar');
    await page.keyboard.press('Enter');
    const toast = page.locator('[data-palette-toast]');
    await expect(toast).toBeVisible();
    await expect(toast).toHaveCSS('opacity', '1');
    await expect(toast).toBeHidden({ timeout: 4000 });
  });

  test('theme toggle swaps the sun and moon icons with a fade', async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    const moon = page.locator('.theme-icon-light').first();
    const sun = page.locator('.theme-icon-dark').first();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(moon).toHaveCSS('opacity', '0');
    await expect(sun).toHaveCSS('opacity', '1');
    await page.locator('[data-theme-toggle]').first().click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(sun).toHaveCSS('opacity', '0');
    await expect(moon).toHaveCSS('opacity', '1');
  });

  test('mobile menu expands with a height transition', async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, 'mobile only');
    await page.goto('/');
    const menu = page.locator('#mobile-menu');
    await expect(menu).toBeHidden();
    await page.locator('[data-menu-button]').click();
    const heights = await sample(menu, detailsHeight, 12, 25);
    const final = heights[heights.length - 1] ?? 0;
    expect(final).toBeGreaterThan(100);
    expect(heights.some((h) => h > 1 && h < final - 1)).toBe(true);
    await expect(menu).toBeVisible();
    await expect(page.locator('[data-menu-button]')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });
});

test.describe('reduced motion reaches final state at once', () => {
  test.use({ reducedMotion: 'reduce' });

  test('hero gradient stays static', async ({ page }) => {
    await page.goto('/');
    const brand = page.locator('h1 .text-brand');
    const read = (el: Element) => getComputedStyle(el).animationName;
    expect(await brand.evaluate(read)).toBe('none');
  });

  test('details open without an intermediate height', async ({ page }) => {
    const details = await openSecondRole(page);
    await details.scrollIntoViewIfNeeded();
    await details.locator('summary').click();
    await page.waitForTimeout(60);
    const settled = await details.evaluate(detailsHeight);
    await page.waitForTimeout(250);
    expect(await details.evaluate(detailsHeight)).toBe(settled);
  });

  test('palette opens and closes immediately', async ({ page }) => {
    await page.goto('/');
    const dialog = page.getByRole('dialog', { name: 'Buscar seção ou ação' });
    await page.keyboard.press('Control+k');
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden({ timeout: 300 });
  });
});

test.describe('no horizontal scroll while animating', () => {
  for (const width of [320, 375, 414]) {
    test(`${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      const details = await openSecondRole(page);
      await details.locator('summary').click();
      await page.waitForTimeout(400);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      );
      expect(overflow).toBe(false);
    });
  }
});

test('hero gradient flows left to right on a loop', async ({ page }) => {
  await page.goto('/');
  const brand = page.locator('h1 .text-brand');
  const pos = (el: Element) =>
    parseFloat(getComputedStyle(el).backgroundPositionX);
  const values = await sample(brand, pos, 6, 120);
  expect(new Set(values).size).toBeGreaterThan(3);
  expect(
    await brand.evaluate((el) => getComputedStyle(el).animationIterationCount),
  ).toBe('infinite');
});
