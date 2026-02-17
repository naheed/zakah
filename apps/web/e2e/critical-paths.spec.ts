import { test, expect } from '@playwright/test';
import {
    clearAppState,
    startWizard,
    expectSetupStep,
    clickNext
} from './helpers/wizard-helpers';

test.describe('Guest User Flow', () => {
    test.beforeEach(async ({ page, context }) => {
        await clearAppState(page, context);
    });

    test('should navigate from landing to calculation wizard', async ({ page }) => {
        // Verify landing page loads with key heading
        await expect(page.getByRole('heading', { name: /Zakat/i })).toBeVisible({ timeout: 10000 });

        // Start wizard
        await startWizard(page);

        // Should navigate to Setup (Preferences) step - NEW FLOW
        await expectSetupStep(page);
    });

    test('should show Privacy Shield in wizard after starting calculation', async ({ page }) => {
        // Start calculation
        await startWizard(page);

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

        // Privacy Shield should be visible - use first() to avoid strict mode
        const privacyShield = page.locator('button').filter({ hasText: /Device Only|Local|Encrypted/i }).first();
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
    test.beforeEach(async ({ page, context }) => {
        await clearAppState(page, context);
    });

    test('should show Privacy Shield in wizard header', async ({ page }) => {
        // Start calculation
        await startWizard(page);

        // Privacy Shield should be visible in wizard
        await page.waitForTimeout(1000);
        const privacyShield = page.locator('button').filter({ hasText: /Device Only|Local/i });
        await expect(privacyShield).toBeVisible({ timeout: 5000 });
    });
});
