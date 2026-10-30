
import { test, expect } from '@playwright/test';

test('homepage displays the main IP lookup interface', async ({ page }) => {
  await page.goto('/');

  // Check the main heading
  await expect(
    page.getByRole('heading', {
      name: 'Trace any IP address in seconds.'
    })
  ).toBeVisible();

  // Check the search input
  await expect(
    page.getByRole('textbox', {
      name: 'IP address or domain'
    })
  ).toBeVisible();

  // Check the Search button
  await expect(
    page.getByRole('button', {
      name: /^Search/
    })
  ).toBeVisible();

  // Check the IP summary labels
  await expect(page.getByText(/^IP Address$/i)).toBeVisible();
  await expect(page.getByText(/^Location$/i).first()).toBeVisible();
  await expect(page.getByText(/^Timezone$/i).first()).toBeVisible();
  await expect(page.getByText(/^ISP$/i).first()).toBeVisible();
});
