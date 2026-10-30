
import { test, expect } from '@playwright/test';

test('saves and clears recent searches', async ({ page }) => {
  // Mock the API to keep tests independent of GeoIPify
  await page.route('**/api/lookup?**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ip: '1.1.1.1',
        location: {
          country: 'Australia',
          region: 'Queensland',
          city: 'Brisbane',
          lat: -27.4698,
          lng: 153.0251,
          timezone: '+10:00',
          postalCode: '4000'
        },
        isp: 'Cloudflare',
        as: { asn: 13335 }
      })
    });
  });

  await page.goto('/');

  // Start with an empty history
  await page.evaluate(() =>
    localStorage.removeItem('iptracker-recent-searches')
  );
  await page.reload();

  // Search for an IP
  await page.getByRole('textbox', {
    name: 'IP address or domain'
  }).fill('1.1.1.1');

  await page.getByRole('button', {
    name: /^Search/
  }).click();

  // Verify the search is saved
  await expect(
    page.locator('.recent-searches').getByText('1.1.1.1')
  ).toBeVisible();

  // Clear history
  await page.getByRole('button', {
    name: /Clear all/i
  }).click();

  await expect(
    page.getByText('No recent searches')
  ).toBeVisible();
});
