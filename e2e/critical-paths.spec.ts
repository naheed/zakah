import { test, expect } from '@playwright/test';

test.describe('Guest User Flow', () => {
    test('should navigate from landing to calculation wizard', async ({ page }) => {
        // Start at landing page
        await page.goto('/');

        // Verify landing page loads with key heading
        await expect(page.getByRole('heading', { name: /Zakat/i })).toBeVisible({ timeout: 10000 });

        // Click "Start Calculating" button
        const startButton = page.getByRole('button', { name: /Start Calculating/i });
        await expect(startButton).toBeVisible();
        await startButton.click();

        // Should navigate to category selection
        await expect(page.locator('text=What assets do you have')).toBeVisible({ timeout: 5000 });
    });

    test('should show Privacy Shield in wizard after starting calculation', async ({ page }) => {
        await page.goto('/');

        // Start calculation first
        const startButton = page.getByRole('button', { name: /Start Calculating/i });
        await expect(startButton).toBeVisible({ timeout: 10000 });
        await startButton.click();

        // Wait for wizard to load
        await page.waitForTimeout(1000);

        // Find Privacy Shield button in wizard header
        const privacyShield = page.locator('button').filter({ hasText: /Device Only|Local Vault/i });
        await expect(privacyShield).toBeVisible({ timeout: 5000 });
        await privacyShield.click();

        // Verify sheet opens with correct content
        await expect(page.locator('text=Your data is on this device')).toBeVisible({ timeout: 3000 });

        // Close the sheet
        await page.getByRole('button', { name: /Got it/i }).click();
    });
});

test.describe('Navigation & Scroll', () => {
    test('should scroll to top when navigating between pages', async ({ page }) => {
        await page.goto('/');

        // Scroll down on home page
        await page.evaluate(() => window.scrollTo(0, 500));

        // Navigate to Settings
        await page.goto('/settings');

        // Verify we're at top of page
        await page.waitForTimeout(500);
        const scrollY = await page.evaluate(() => window.scrollY);
        expect(scrollY).toBe(0);
    });
});

test.describe('Settings Page', () => {
    test('should display Privacy Shield in header', async ({ page }) => {
        await page.goto('/settings');

        // Privacy Shield should be visible (look for the button with lock/cloud icon)
        const privacyShield = page.locator('button').filter({ hasText: /Device Only|Local|Encrypted/i });
        await expect(privacyShield).toBeVisible({ timeout: 10000 });
    });

    test('should have back navigation', async ({ page }) => {
        await page.goto('/settings');

        // Look for the ArrowLeft icon button
        const backButton = page.locator('button').filter({ has: page.locator('svg') }).first();
        await expect(backButton).toBeVisible({ timeout: 5000 });
    });
});

test.describe('Calculation Wizard', () => {
    test('should show Privacy Shield in wizard header', async ({ page }) => {
        await page.goto('/');

        // Start calculation
        const startButton = page.getByRole('button', { name: /Start Calculating/i });
        if (await startButton.isVisible()) {
            await startButton.click();
        }

        // Privacy Shield should be visible in wizard
        await page.waitForTimeout(1000);
        const privacyShield = page.locator('button').filter({ hasText: /Device Only|Local/i });
        await expect(privacyShield).toBeVisible({ timeout: 5000 });
    });
});
