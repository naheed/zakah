import { test, expect } from '@playwright/test';
import { checkA11y } from './utils/a11y-helper';

const themes = ['light', 'dark'] as const;

/* 
  Static Pages Accessibility Test Suite
  Covers public pages that are reachable without authentication.
*/

const pagesToTest = [
    { path: '/auth', name: 'Auth / Sign In' },
    { path: '/methodology', name: 'Methodology' },
    { path: '/privacy', name: 'Privacy Policy' },
    { path: '/terms', name: 'Terms of Service' },
    { path: '/about', name: 'About' },
];

test.describe('Static Pages Accessibility', () => {

    themes.forEach(theme => {
        pagesToTest.forEach(({ path, name }) => {
            test(`${name} Page (${theme} mode)`, async ({ page }) => {
                // 1. Visit Page
                await page.goto(path);

                // 2. Force Theme
                await page.evaluate((t) => {
                    localStorage.setItem('theme', t);
                }, theme);
                await page.reload();
                await page.waitForLoadState('networkidle'); // Wait for content

                // 3. Verify Theme
                if (theme === 'dark') {
                    await expect(page.locator('html')).toHaveClass(/dark/);
                } else {
                    await expect(page.locator('html')).not.toHaveClass(/dark/);
                }

                // 4. Custom Wait Steps (if needed for specific pages)
                if (path === '/methodology') {
                    await expect(page.getByText('Explore by Methodology')).toBeVisible();
                } else if (path === '/privacy') {
                    await expect(page.getByText('Key Privacy Highlights')).toBeVisible();
                } else if (path === '/terms') {
                    await expect(page.getByText(/Last updated/i).first()).toBeVisible();
                } else if (path === '/about') {
                    await expect(page.getByText('Islam is beautiful')).toBeVisible();
                }

                // 5. Scan
                await checkA11y(page, `${name} Page - ${theme} mode`);
            });
        });
    });

});
