
import { test, expect } from '@playwright/test';

test('a newer search replaces an unfinished lookup', async ({ page }) => {
  let releaseFirstRequest!: () => void;

  const firstRequestHeld = new Promise<void>((resolve) => {
    releaseFirstRequest = resolve;
  });

  let firstRequestReceived!: () => void;

  const firstRequestStarted = new Promise<void>((resolve) => {
    firstRequestReceived = resolve;
  });

  await page.route('**/api/lookup?**', async (route) => {
    const url = new URL(route.request().url());
    const query = url.searchParams.get('query');

    if (query === '8.8.8.8') {
      firstRequestReceived();
      await firstRequestHeld;

      try {
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
              timezone: '-07:00'
            },
            isp: 'Old Network'
          })
        });
      } catch {
        // The browser may have cancelled this request
      }
      return;
    }

    if (query === '1.1.1.1') {
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
            timezone: '+10:00'
          },
          isp: 'Cloudflare'
        })
      });
    }
  });

  try {
    await page.goto('/');

    const input = page.getByRole('textbox', {
      name: 'IP address or domain'
    });

    await input.fill('8.8.8.8');

    await page.getByRole('button', {
      name: /^Search/
    }).click();

    await firstRequestStarted;

    await input.fill('1.1.1.1');

    await page.getByRole('button', {
      name: /^Search/
    }).click();

    await expect(
      page.getByText('Cloudflare', { exact: true })
    ).toBeVisible();
  } finally {
    // Always release the pending route
    releaseFirstRequest();
  }

  // The older response must not replace the newer result
  await expect(
    page.getByText('Cloudflare', { exact: true })
  ).toBeVisible();

  await expect(
    page.getByText('Old Network', { exact: true })
  ).not.toBeVisible();
});
