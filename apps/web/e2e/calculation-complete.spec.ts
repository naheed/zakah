/**
 * Comprehensive E2E Calculation Tests
 * 
 * Tests the full wizard flow with various madhab and asset combinations.
 * Updated for new flow: Welcome → Setup → Categories → Assets → Results
 */

import { test, expect } from '@playwright/test';
import {
    clearAppState,
    startWizard,
    navigateThroughSetup,
    clickNext,
    expectLiquidAssetsStep,
    fillCheckingAccounts,
    fillCreditCardDebt,
    expectResultsStep
} from './helpers/wizard-helpers';

test.describe('Calculation Flow - Complete Suite', () => {

    test.beforeEach(async ({ page, context }) => {
        await clearAppState(page, context);
    });

    test('Baseline: $10K cash = $250 Zakat', async ({ page }) => {
        test.setTimeout(60000);

        // Start wizard
        await startWizard(page);

        // Navigate through Setup (Preferences)
        await navigateThroughSetup(page, 'detailed');

        // Categories - use defaults, click Next
        await expect(page.getByText('What assets do you have?')).toBeVisible({ timeout: 10000 });
        await clickNext(page);

        // Liquid Assets
        await expectLiquidAssetsStep(page);
        await fillCheckingAccounts(page, '10000');
        await clickNext(page);

        // Skip Investments
        await clickNext(page);

        // Skip Retirement
        await clickNext(page);

        // Skip Liabilities
        await clickNext(page);
        await page.waitForTimeout(2000);

        // Results
        await expectResultsStep(page);
        await page.waitForTimeout(2000);

        const zakatText = await page.locator('text=/\\$[\\d,]+\\.?\\d*/').first().innerText();
        const zakatValue = parseFloat(zakatText.replace(/[$,]/g, ''));

        expect(zakatValue).toBeGreaterThanOrEqual(249);
        expect(zakatValue).toBeLessThanOrEqual(251);
    });

    test('With Debt: $10K - $5K = $125 Zakat', async ({ page }) => {
        test.setTimeout(60000);

        await startWizard(page);
        await navigateThroughSetup(page, 'detailed');

        // Categories
        await clickNext(page);

        // Liquid Assets - $10K
        await fillCheckingAccounts(page, '10000');
        await clickNext(page);

        // Skip Investments, Retirement
        await clickNext(page);
        await clickNext(page);

        // Liabilities - $5K debt
        await fillCreditCardDebt(page, '5000');
        await clickNext(page);
        await page.waitForTimeout(2000);

        // Results
        await page.waitForTimeout(2000);
        const zakatText = await page.locator('text=/\\$[\\d,]+\\.?\\d*/').first().innerText();
        const zakatValue = parseFloat(zakatText.replace(/[$,]/g, ''));

        expect(zakatValue).toBeGreaterThanOrEqual(124);
        expect(zakatValue).toBeLessThanOrEqual(126);
    });

    test('With Investments: 30% rule test', async ({ page }) => {
        test.setTimeout(60000);

        await startWizard(page);
        await navigateThroughSetup(page, 'detailed');

        // Categories
        await clickNext(page);

        // Liquid - $10K
        await fillCheckingAccounts(page, '10000');
        await clickNext(page);

        // Investments - $20K passive
        const passiveInput = page.getByTestId('passive-investments-value-input');
        await passiveInput.waitFor({ state: 'visible', timeout: 5000 });
        await passiveInput.fill('20000');
        await clickNext(page);

        // Skip Retirement, Liabilities
        await clickNext(page);
        await clickNext(page);
        await page.waitForTimeout(2000);

        // Results - ($10K + $6K) * 2.5% = $400
        await page.waitForTimeout(2000);
        const zakatText = await page.locator('text=/\\$[\\d,]+\\.?\\d*/').first().innerText();
        const zakatValue = parseFloat(zakatText.replace(/[$,]/g, ''));

        expect(zakatValue).toBeGreaterThanOrEqual(399);
        expect(zakatValue).toBeLessThanOrEqual(401);
    });

    test('Multi-asset with Precious Metals', async ({ page }) => {
        test.setTimeout(90000);

        await startWizard(page);
        await navigateThroughSetup(page, 'detailed');

        // Categories - select Precious Metals
        await expect(page.getByText('What assets do you have?')).toBeVisible();
        await page.getByText('Precious Metals', { exact: true }).click();
        await page.waitForTimeout(500);
        await clickNext(page);

        // Liquid - $20K
        await fillCheckingAccounts(page, '20000');
        await clickNext(page);

        // Investments - $30K
        const passiveInput = page.getByTestId('passive-investments-value-input');
        await passiveInput.waitFor({ state: 'visible', timeout: 5000 });
        await passiveInput.fill('30000');
        await clickNext(page);

        // Skip Retirement
        await clickNext(page);

        // Gold - $5K
        await page.getByText('Enter USD Value').click();
        const goldInput = page.getByTestId('gold-value-input');
        await goldInput.waitFor({ state: 'visible', timeout: 5000 });
        await goldInput.fill('5000');
        await clickNext(page);

        // Liabilities - $10K
        await fillCreditCardDebt(page, '10000');
        await clickNext(page);
        await page.waitForTimeout(2000);

        // Results
        await page.waitForTimeout(2000);
        const zakatText = await page.locator('text=/\\$[\\d,]+\\.?\\d*/').first().innerText();
        const zakatValue = parseFloat(zakatText.replace(/[$,]/g, ''));

        expect(zakatValue).toBeGreaterThanOrEqual(470);
        expect(zakatValue).toBeLessThanOrEqual(480);
    });
});
