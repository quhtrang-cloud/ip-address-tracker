
import { test, expect } from '@playwright/test';

test('Use My IP displays the detected IP information', async ({ page }) => {
  // Mock a successful API response
  await page.route('**/api/lookup**', async (route) => {
    const url = new URL(route.request().url());

    // Only mock requests without an IP parameter
    if (url.searchParams.has('ip')) {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ip: '8.8.8.8',
        location: {
          country: 'United States',
          region: 'California',
          city: 'Mountain View',
          lat: 37.386,
          lng: -122.0838,
          timezone: '-07:00',
          postalCode: '94035'
        },
        isp: 'Google LLC',
        as: { asn: 15169 }
      })
    });
  });

  await page.goto('/');

  // Click the public IP detection button
  await page.getByRole('button', {
    name: /Use My IP/i
  }).click();

  // Check that the detected IP appears in the results
  await expect(
    page.getByText('8.8.8.8', { exact: true }).first()
  ).toBeVisible();

  await expect(
    page.getByText('Google LLC', { exact: true })
  ).toBeVisible();
});
