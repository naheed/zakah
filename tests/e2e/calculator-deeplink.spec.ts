
import { test, expect } from '@playwright/test';

test.describe('Calculator Deep Linking', () => {

    test('should load methodology preset from URL', async ({ page }) => {
        // Navigate to calculator with Hanafi preset
        await page.goto('/?methodology=hanafi');

        // Wait for the methodology indicator to update
        // Note: The specific selector might need adjustment based on ActiveMethodologyIndicator implementation
        // Looking for text "Hanafi" or similar in the header
        await expect(page.getByText('Hanafi')).toBeVisible();

        // Check page title update (SEO feature)
        await expect(page).toHaveTitle(/Hanafi/);

        // Verify URL parameter cleanup
        await expect(page).toHaveURL(/^(?!.*methodology=hanafi).*/);
    });

    test('should jump to specific step from URL', async ({ page }) => {
        // Navigate to Liquid Assets step
        await page.goto('/?step=liquid-assets');

        // Should skip welcome step and land on Liquid Assets
        await expect(page.getByText('Liquid Assets', { exact: true })).toBeVisible();

        // Verify step navigation by checking for unique content on that page
        await expect(page.getByText('Cash on Hand')).toBeVisible();

        // Verify URL parameter cleanup
        await expect(page).toHaveURL(/^(?!.*step=liquid-assets).*/);
    });

    test('should handle combined parameters (Methodology + Step)', async ({ page }) => {
        // Navigate with both params
        await page.goto('/?methodology=shafii&step=gold-silver'); // using an alias if mapped, or standard id
        // Note: 'gold-silver' isn't in our map, let's use a known one like 'precious-metals'
        await page.goto('/?methodology=shafii&step=precious-metals');

        // Verify Methodology
        await expect(page.getByText("Shafi'i")).toBeVisible();

        // Verify Step
        await expect(page.getByText('Gold & Silver')).toBeVisible();
    });

    test('should gracefully handle invalid parameters', async ({ page }) => {
        // Navigate with invalid methodology
        await page.goto('/?methodology=invalid_madhab_name');

        // Should load default (Bradford) or existing state without crashing
        // For a fresh session, Bradford is default
        await expect(page.getByText('Bradford')).toBeVisible();

        // Should NOT have updated title to "Invalid..."
        await expect(page).not.toHaveTitle(/Invalid/);
    });
});
