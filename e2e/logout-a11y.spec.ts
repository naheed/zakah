import { test, expect } from '@playwright/test';
import { checkA11y } from './utils/a11y-helper';

const themes = ['light', 'dark'] as const;

test.describe('Logout Page Accessibility', () => {

    themes.forEach(theme => {
        test(`Logout Page Accessibility (${theme} mode)`, async ({ page }) => {
            // 1. Visit Logout Page
            // Note: We might need to ensure the route exists. Assuming /logout renders LogoutSuccess.tsx
            // If /logout is an action that redirects, we might need to visit a specific path or simulate a logout state?
            // "LogoutSuccess.tsx" suggests there is a page for it. Let's try '/logout'. 
            // If that redirects to home (because user isn't logged in?), we might need to assume it's publicly viewable 
            // OR checks auth state.
            // Usually "Logout Success" is shown AFTER signing out.

            await page.goto('/logout');

            // Force Theme Preference
            await page.evaluate((t) => {
                localStorage.setItem('theme', t);
            }, theme);
            await page.reload();
            await page.waitForLoadState('networkidle');

            // Verify Theme
            if (theme === 'dark') {
                await expect(page.locator('html')).toHaveClass(/dark/);
            } else {
                await expect(page.locator('html')).not.toHaveClass(/dark/);
            }

            // Verify content exists
            await expect(page.getByText("You're signed out")).toBeVisible();
            await expect(page.getByText("Community Impact")).toBeVisible();

            // Scan
            await checkA11y(page, `Logout Page - ${theme} mode`);
        });
    });

});
