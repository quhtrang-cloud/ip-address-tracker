
import { test, expect } from '@playwright/test';

test('displays an error when IP lookup API fails', async ({ page }) => {
  await page.route('**/api/lookup?**', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({
        error: 'Unable to retrieve IP information.'
      })
    });
  });

  await page.goto('/');

  await page.getByRole('textbox', {
    name: 'IP address or domain'
  }).fill('8.8.8.8');

  await page.getByRole('button', {
    name: /^Search/
  }).click();

  // The application should display an error message
  await expect(page.getByRole('alert')).toBeVisible();

  // The user should be able to try again
  await expect(
    page.getByRole('button', { name: /^Search/ })
  ).toBeEnabled();
});
