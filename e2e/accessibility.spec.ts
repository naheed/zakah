import { test } from '@playwright/test';
import { checkA11y } from './utils/a11y-helper';

test.describe('Accessibility (A11y)', () => {
    test('Settings Page', async ({ page }) => {
        await page.goto('/settings');
        await checkA11y(page, 'Settings - Light Mode');

        // Toggle Dark Mode
        await page.getByLabel('Dark Mode').click();
        await page.waitForTimeout(500); // Wait for transition
        await checkA11y(page, 'Settings - Dark Mode');
    });
});
