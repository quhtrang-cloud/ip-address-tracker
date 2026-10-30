
import { test, expect } from '@playwright/test';

test('recent searches persist after page reload', async ({ page }) => {
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

  // Clear history from previous sessions
  await page.evaluate(() => {
    localStorage.removeItem('iptracker-recent-searches');
  });
  await page.reload();

  const input = page.getByRole('textbox', {
    name: 'IP address or domain'
  });

  await input.fill('1.1.1.1');
  await page.getByRole('button', { name: /^Search/ }).click();

  // Confirm search appears in history
  const history = page.locator('.recent-searches');

  await expect(
    history.getByText('1.1.1.1', { exact: true })
  ).toBeVisible();

  // Reload and check persisted history
  await page.reload();

  await expect(
    history.getByText('1.1.1.1', { exact: true })
  ).toBeVisible();
});
