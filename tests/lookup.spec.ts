
import { test, expect } from '@playwright/test';

test('updates IP information after a successful lookup', async ({ page }) => {
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

  await page.getByRole('textbox', {
    name: 'IP address or domain'
  }).fill('1.1.1.1');

  await page.getByRole('button', {
    name: /^Search/
  }).click();

  await expect(page.getByText('Brisbane, Queensland').first()).toBeVisible();
  await expect(page.getByText('Cloudflare', { exact: true })).toBeVisible();
  await expect(page.getByText('AS13335')).toBeVisible();
});
