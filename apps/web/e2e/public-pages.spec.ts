import { test } from '@playwright/test';
import { checkA11y } from './utils/a11y-helper';

test.describe('Public Pages Accessibility', () => {
    test('Auth Page', async ({ page }) => {
        await page.goto('/auth');
        await checkA11y(page, 'Auth Page');

        // Scan Sign Up view if toggleable (assuming standard Auth component behavior)
        // If there's a "Sign Up" tab/link, we would click it here:
        // await page.getByText('Sign Up').click();
        // await checkA11y(page, 'Auth Page - Sign Up');
    });

    test('Methodology Page', async ({ page }) => {
        await page.goto('/methodology');
        await checkA11y(page, 'Methodology Page');
    });

    test('Landing Page', async ({ page }) => {
        await page.goto('/');
        await checkA11y(page, 'Landing Page');
    });
});
