/**
 * E2E Calculation Tests - WORKING VERSION
 * 
 * Key fixes:
 * 1. Use "Continue" button (not "Next")
 * 2. Verify button is enabled before clicking
 * 3. Longer waits for wizard state updates
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8081';

test.describe('Calculation E2E Tests', () => {

    test.beforeEach(async ({ page, context }) => {
        await context.clearCookies();
        await page.goto('about:blank');
        await page.evaluate(() => {
            try {
                localStorage.clear();
                sessionStorage.clear();
            } catch (e) { }
        });
    });

    test('Baseline: $10K cash = $250 Zakat', async ({ page }) => {
        test.setTimeout(90000);

        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Start wizard
        const startBtn = page.getByRole('button', { name: /Start Calculating/i });
        await startBtn.waitFor({ state: 'visible', timeout: 15000 });
        await startBtn.click();
        await page.waitForTimeout(3000);

        // Categories - verify heading visible
        await expect(page.getByText('What assets do you have?')).toBeVisible({ timeout: 15000 });
        await page.waitForTimeout(2000);

        // Click Continue - wait for it to be enabled
        const continueBtn = page.getByRole('button', { name: /Continue/i });
        await continueBtn.waitFor({ state: 'visible', timeout: 10000 });
        await expect(continueBtn).toBeEnabled({ timeout: 5000 });
        await continueBtn.click();
        await page.waitForTimeout(3000);

        // Liquid Assets - verify step loaded
        await expect(page.getByText('What are your liquid assets?')).toBeVisible({ timeout: 15000 });
        await page.waitForTimeout(1500);

        const checkingInput = page.getByTestId('checking-accounts-input');
        await checkingInput.waitFor({ state: 'visible', timeout: 10000 });
        await checkingInput.fill('10000');
        await page.waitForTimeout(1000);

        const continueBtn2 = page.getByRole('button', { name: /Continue/i });
        await expect(continueBtn2).toBeEnabled();
        await continueBtn2.click();
        await page.waitForTimeout(3000);

        // Skip Investments
        await page.getByRole('button', { name: /Continue/i }).click();
        await page.waitForTimeout(3000);

        // Skip Retirement
        await page.getByRole('button', { name: /Continue/i }).click();
        await page.waitForTimeout(3000);

        // Skip Liabilities
        await page.getByRole('button', { name: /Continue/i }).click();
        await page.waitForTimeout(4000);

        // Results
        await expect(page.getByText(/Zakat/i).first()).toBeVisible({ timeout: 15000 });
        await page.waitForTimeout(3000);

        const zakatText = await page.locator('text=/\\$[\\d,]+\\.?\\d*/').first().innerText();
        const zakatValue = parseFloat(zakatText.replace(/[$,]/g, ''));

        console.log(`Zakat calculated: $${zakatValue}`);
        expect(zakatValue).toBeGreaterThanOrEqual(249);
        expect(zakatValue).toBeLessThanOrEqual(251);
    });

    test('With Debt: $10K - $5K = $125 Zakat', async ({ page }) => {
        test.setTimeout(90000);

        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: /Start Calculating/i }).click();
        await page.waitForTimeout(3000);

        // Categories
        const continueBtn = page.getByRole('button', { name: /Continue/i });
        await expect(continueBtn).toBeEnabled();
        await continueBtn.click();
        await page.waitForTimeout(3000);

        // Liquid - $10K
        await page.getByTestId('checking-accounts-input').fill('10000');
        await page.getByRole('button', { name: /Continue/i }).click();
        await page.waitForTimeout(3000);

        // Skip Investments, Retirement
        await page.getByRole('button', { name: /Continue/i }).click();
        await page.waitForTimeout(3000);
        await page.getByRole('button', { name: /Continue/i }).click();
        await page.waitForTimeout(3000);

        // Liabilities - $5K
        const debtInput = page.getByTestId('credit-card-debt-input');
        await debtInput.waitFor({ state: 'visible', timeout: 10000 });
        await debtInput.fill('5000');
        await page.getByRole('button', { name: /Continue/i }).click();
        await page.waitForTimeout(4000);

        // Results
        await page.waitForTimeout(3000);
        const zakatText = await page.locator('text=/\\$[\\d,]+\\.?\\d*/').first().innerText();
        const zakatValue = parseFloat(zakatText.replace(/[$,]/g, ''));

        expect(zakatValue).toBeGreaterThanOrEqual(124);
        expect(zakatValue).toBeLessThanOrEqual(126);
    });
});
