import { test, expect } from '@playwright/test';

test('shows an error for an invalid IP address', async ({ page }) => {
  await page.goto('/');

  const searchInput = page.getByRole('textbox', {
    name: 'IP address or domain'
  });

  await searchInput.fill('999.999.999.999');

  await page.getByRole('button', {
    name: /^Search/
  }).click();

  await expect(page.getByRole('alert')).toBeVisible();
});