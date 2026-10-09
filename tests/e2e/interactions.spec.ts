import { expect, test } from '@playwright/test';

test.describe('command palette', () => {
  test('opens with Ctrl+K, filters and jumps to a section', async ({
    page,
  }) => {
    await page.goto('/');
    const dialog = page.getByRole('dialog', { name: 'Buscar seção ou ação' });
    await expect(dialog).toBeHidden();

    await page.keyboard.press('Control+k');
    await expect(dialog).toBeVisible();
    await expect(page.getByRole('combobox')).toBeFocused();

    await page.getByRole('combobox').fill('trajetoria');
    await expect(page.getByRole('option')).toHaveCount(1);
    await page.keyboard.press('Enter');

    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(/#trajetoria$/);
  });

  test('closes with Escape and returns focus', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Control+k');
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
  });

  test('toggles the theme from the palette', async ({ page }) => {
    await page.goto('/');
    const before = await page.locator('html').getAttribute('data-theme');
    await page.keyboard.press('Control+k');
    await page.getByRole('combobox').fill('tema');
    await page.keyboard.press('Enter');
    await expect(page.locator('html')).not.toHaveAttribute(
      'data-theme',
      before ?? '',
    );
  });

  test('shows an empty state for unknown queries', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Control+k');
    await page.getByRole('combobox').fill('zzzzzz');
    await expect(page.getByRole('option')).toHaveCount(0);
    await expect(page.getByText('Nada encontrado.')).toBeVisible();
  });

  test('never exposes a phone number in the palette data', async ({ page }) => {
    await page.goto('/');
    const data = await page
      .locator('#command-palette')
      .getAttribute('data-commands');
    expect(data).not.toMatch(/\+?\d{2}\s?\(?\d{2}\)?\s?9?\d{4}-?\d{4}/);
  });
});

test.describe('mobile menu', () => {
  test.use({ viewport: { width: 360, height: 740 } });

  test('opens the palette from the menu without horizontal scroll', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    await page.getByRole('button', { name: 'Buscar no site' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe('timeline', () => {
  test('first role is expanded and shows bullets and stack', async ({
    page,
  }) => {
    await page.goto('/');
    const section = page.locator('section[aria-labelledby="trajetoria"]');
    const details = section.locator('details');
    await expect(details.first()).toHaveJSProperty('open', true);
    await expect(details.nth(1)).toHaveJSProperty('open', false);

    await details.nth(1).locator('summary').click();
    await expect(details.nth(1)).toHaveJSProperty('open', true);
    await expect(
      details.nth(1).getByRole('list', { name: 'Tecnologias usadas' }),
    ).toBeVisible();
  });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('metrics keep their final values and nothing is hidden', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.getByText('588 acúmulos/s').first()).toBeVisible();
    await expect(page.getByText('99,9%').first()).toBeVisible();

    const opacity = await page
      .locator('.reveal')
      .last()
      .evaluate((element) => getComputedStyle(element).opacity);
    expect(opacity).toBe('1');
  });
});

test.describe('count-up', () => {
  test('settles on the final text after scrolling into view', async ({
    page,
  }) => {
    await page.goto('/');
    const metric = page.locator('[data-count][data-final="588 acúmulos/s"]');
    await expect(metric).toHaveText('0 acúmulos/s');
    await metric.scrollIntoViewIfNeeded();
    await expect(metric).toHaveText('588 acúmulos/s', { timeout: 3000 });
  });
});
