
import { test, expect } from '@playwright/test';

test('theme preference persists after reload', async ({ page }) => {
  await page.goto('/');

  // Start with a known theme
  await page.evaluate(() => localStorage.setItem('theme', 'light'));
  await page.reload();

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  await page.getByRole('button', {
    name: 'Switch to dark mode'
  }).click();

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.reload();

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('About modal opens and closes with Escape', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'About' }).click();

  const dialog = page.getByRole('dialog', { name: 'About IPTracker' });
  await expect(dialog).toBeVisible();

  await page.keyboard.press('Escape');

  await expect(dialog).not.toBeVisible();
});
