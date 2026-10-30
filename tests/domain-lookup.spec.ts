
import { test, expect } from '@playwright/test';

test('looks up a domain and displays its IP information', async ({ page }) => {
  await page.route('**/api/lookup?**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ip: '93.184.215.14',
        location: {
          country: 'United States',
          region: 'California',
          city: 'Los Angeles',
          lat: 34.0522,
          lng: -118.2437,
          timezone: '-07:00',
          postalCode: '90001'
        },
        isp: 'Example Network',
        as: { asn: 64500 }
      })
    });
  });

  await page.goto('/');

  await page.getByRole('textbox', {
    name: 'IP address or domain'
  }).fill('example.com');

  await page.getByRole('button', {
    name: /^Search/
  }).click();

  await expect(
    page.getByText('Example Network', { exact: true })
  ).toBeVisible();

  await expect(
    page.getByText('Los Angeles, California').first()
  ).toBeVisible();
});
