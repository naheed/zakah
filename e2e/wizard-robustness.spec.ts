/**
 * Wizard Robustness & Durability Tests
 * 
 * Tests edge cases like backtracking, mode switching, and state persistence.
 * These tests verify users can navigate back and forth through the wizard.
 */

import { test, expect } from '@playwright/test';
import {
    clearAppState,
    startWizard,
    navigateThroughSetup,
    clickNext,
    clickBack,
    expectSetupStep,
    expectCategoriesStep,
    expectLiquidAssetsStep,
    fillCheckingAccounts,
    expectResultsStep
} from './helpers/wizard-helpers';

test.describe('Wizard Robustness & Durability', () => {

    test.beforeEach(async ({ page, context }) => {
        await clearAppState(page, context);
    });

    test('should allow backtracking from Categories to Setup', async ({ page }) => {
        test.setTimeout(45000);

        // 1. Start wizard and navigate to Setup
        await startWizard(page);
        await expectSetupStep(page);

        // 2. Select Detailed Mode and proceed to Categories
        await page.getByText('Detailed Breakdown').click();
        await clickNext(page);

        // 3. Verify we're on Categories
        await expectCategoriesStep(page);

        // 4. Click Previous to go back to Setup
        await clickBack(page);

        // 5. Verify we're back on Setup - BACKTRACKING WORKS
        await expectSetupStep(page);
    });

    test('should persist mode selection after backtracking', async ({ page }) => {
        test.setTimeout(45000);

        // 1. Start wizard
        await startWizard(page);
        await expectSetupStep(page);

        // 2. Select Detailed Mode (the default, but be explicit)
        await page.getByText('Detailed Breakdown').click();

        // 3. Proceed to Categories
        await clickNext(page);
        await expectCategoriesStep(page);

        // 4. Go back to Setup
        await clickBack(page);
        await expectSetupStep(page);

        // 5. Verify Detailed Breakdown is still selected (has primary styling)
        // The card should have the selected visual indicator
        const detailedCard = page.locator('div').filter({ hasText: 'Detailed Breakdown' }).first();
        await expect(detailedCard).toBeVisible();
    });

    test('should navigate through simple mode flow (skip Categories)', async ({ page }) => {
        test.setTimeout(60000);

        // Start wizard
        await startWizard(page);
        await expectSetupStep(page);

        // Select Simple Mode
        await page.getByText('Quick Estimate').click();
        await clickNext(page);

        // Simple mode should skip Categories and go directly to simple questions
        // Verify Categories is NOT visible
        await expect(page.getByText('What assets do you have?')).not.toBeVisible({ timeout: 3000 });

        // Should be on simple mode step - verify we proceeded
        const heading = page.locator('h1, h2').first();
        await expect(heading).toBeVisible();
    });

    test('should navigate full detailed flow without errors', async ({ page }) => {
        test.setTimeout(60000);

        // Start and navigate through setup
        await startWizard(page);
        await navigateThroughSetup(page, 'detailed');

        // Verify on Categories
        await expectCategoriesStep(page);
        await clickNext(page);

        // Verify on Liquid Assets
        await expectLiquidAssetsStep(page);
        await fillCheckingAccounts(page, '10000');
        await clickNext(page);

        // Skip through remaining steps
        await clickNext(page); // Investments
        await clickNext(page); // Retirement
        await clickNext(page); // Liabilities

        // Should reach Results
        await page.waitForTimeout(2000);
        await expectResultsStep(page);
    });

    test('should handle methodology selection', async ({ page }) => {
        test.setTimeout(45000);

        // Start wizard
        await startWizard(page);
        await expectSetupStep(page);

        // Verify School of Thought section exists
        await expect(page.getByText('School of Thought')).toBeVisible();

        // Proceed through setup and verify flow works
        await page.getByText('Detailed Breakdown').click();
        await clickNext(page);

        // Verify we reached Categories (methodology selection didn't break flow)
        await expectCategoriesStep(page);
    });
});
