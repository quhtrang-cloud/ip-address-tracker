
import { test, expect } from '@playwright/test';

test('shows an error when the network request fails', async ({ page }) => {
  await page.route('**/api/lookup?**', async (route) => {
    await route.abort('failed');
  });

  await page.goto('/');

  const input = page.getByRole('textbox', {
    name: 'IP address or domain'
  });

  await input.fill('8.8.4.4');

  await page.getByRole('button', {
    name: /^Search/
  }).click();

  // Verify the application displays a useful error
  await expect(
    page.getByRole('alert').getByText(
      'Could not connect to the lookup service.'
    )
  ).toBeVisible();

  // Verify the interface remains usable
  await expect(input).toBeEnabled();

  await expect(
    page.getByRole('button', { name: /^Search/ })
  ).toBeEnabled();
});
