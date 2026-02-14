
import { test, expect } from '@playwright/test';
import { checkA11y } from './utils/a11y-helper';

const themes = ['light', 'dark'] as const;

test.describe('Methodology Pages Accessibility', () => {

    themes.forEach(theme => {
        /**
         * Test 1: Main Methodology Page
         */
        test(`Methodology Hub (${theme})`, async ({ page }) => {
            await page.goto('/methodology');

            // Force Theme
            await page.evaluate((t) => localStorage.setItem('theme', t), theme);
            await page.reload();
            await page.waitForLoadState('networkidle');

            // Wait for interactive elements to ensure fullness
            await expect(page.getByText('Explore by Methodology')).toBeVisible();

            // Wait for animations (Methodology page has heavy framer-motion)
            await page.waitForTimeout(2000);

            await checkA11y(page, `Methodology Hub - ${theme}`);
        });

        /**
         * Test 2: ZMCS Specification Page
         */
        test(`ZMCS Specification (${theme})`, async ({ page }) => {
            await page.goto('/methodology/zmcs');

            // Force Theme
            await page.evaluate((t) => localStorage.setItem('theme', t), theme);
            await page.reload();
            await page.waitForLoadState('networkidle');

            // Verification
            await expect(page.getByText('ZMCS Specification')).toBeVisible();
            await expect(page.getByText('Schema Structure')).toBeVisible();

            // Wait for any potential animations
            await page.waitForTimeout(1000);

            await checkA11y(page, `ZMCS Spec - ${theme}`);
        });

        /**
         * Test 3: Navigation Flow
         * Verify we can get from Hub -> ZMCS
         */
        test(`Navigation Flow: Hub to ZMCS (${theme})`, async ({ page }) => {
            await page.goto('/methodology');

            // Click the new button we just added
            await page.click('text=View ZMCS Specification');

            await expect(page).toHaveURL(/.*\/methodology\/zmcs/);
            await expect(page.getByRole('heading', { level: 1, name: 'ZMCS Specification' })).toBeVisible();
        });
    });

});
