/**
 * Comprehensive E2E Calculation Tests
 * 
 * Tests the full wizard flow with various madhab and asset combinations.
 * CORRECTED: Uses "Continue" button (not "Next")
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8081';

test.describe('Calculation Flow - Complete Suite', () => {

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
        test.setTimeout(60000);

        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Start wizard
        await page.getByRole('button', { name: /Start Calculating/i }).click();
        await page.waitForTimeout(2000);

        // Categories - Continue
        await expect(page.getByText('What assets do you have?')).toBeVisible({ timeout: 10000 });
        await page.getByRole('button', { name: /Continue/i }).click();
        await page.waitForTimeout(1500);

        // Liquid Assets
        await expect(page.getByText('What are your liquid assets?')).toBeVisible({ timeout: 10000 });
        await page.getByTestId('checking-accounts-input').fill('10000');
        await page.getByRole('button', { name: /Continue/i }).click();
        await page.waitForTimeout(1500);

        // Skip Investments
        await page.getByRole('button', { name: /Continue/i }).click();
        await page.waitForTimeout(1500);

        // Skip Retirement
        await page.getByRole('button', { name: /Continue/i }).click();
        await page.waitForTimeout(1500);

        // Skip Liabilities
        await page.getByRole('button', { name: /Continue/i }).click();
        await page.waitForTimeout(2000);

        // Results
        await expect(page.getByText(/Zakat|Results/i).first()).toBeVisible({ timeout: 10000 });
        await page.waitForTimeout(2000);

        const zakatText = await page.locator('text=/\\$[\\d,]+\\.?\\d*/').first().innerText();
        const zakatValue = parseFloat(zakatText.replace(/[$,]/g, ''));

        expect(zakatValue).toBeGreaterThanOrEqual(249);
        expect(zakatValue).toBeLessThanOrEqual(251);
    });

    test('With Debt: $10K - $5K = $125 Zakat', async ({ page }) => {
        test.setTimeout(60000);

        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: /Start Calculating/i }).click();
        await page.waitForTimeout(2000);

        // Categories
        await page.getByRole('button', { name: /Continue/i }).click();
        await page.waitForTimeout(1500);

        // Liquid Assets - $10K
        await page.getByTestId('checking-accounts-input').fill('10000');
        await page.getByRole('button', { name: /Continue/i }).click();
        await page.waitForTimeout(1500);

        // Skip Investments, Retirement
        await page.getByRole('button', { name: /Continue/i }).click();
        await page.waitForTimeout(1500);
        await page.getByRole('button', { name: /Continue/i }).click();
        await page.waitForTimeout(1500);

        // Liabilities - $5K debt
        const debtInput = page.getByTestId('credit-card-debt-input');
        await debtInput.waitFor({ state: 'visible', timeout: 5000 });
        await debtInput.fill('5000');
        await page.getByRole('button', { name: /Continue/i }).click();
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

        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: /Start Calculating/i }).click();
        await page.waitForTimeout(2000);

        // Categories
        await page.getByRole('button', { name: /Continue/i }).click();
        await page.waitForTimeout(1500);

        // Liquid - $10K
        await page.getByTestId('checking-accounts-input').fill('10000');
        await page.getByRole('button', { name: /Continue/i }).click();
        await page.waitForTimeout(1500);

        // Investments - $20K passive
        const passiveInput = page.getByTestId('passive-investments-value-input');
        await passiveInput.waitFor({ state: 'visible', timeout: 5000 });
        await passiveInput.fill('20000');
        await page.getByRole('button', { name: /Continue/i }).click();
        await page.waitForTimeout(1500);

        // Skip Retirement, Liabilities
        await page.getByRole('button', { name: /Continue/i }).click();
        await page.waitForTimeout(1500);
        await page.getByRole('button', { name: /Continue/i }).click();
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

        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: /Start Calculating/i }).click();
        await page.waitForTimeout(2000);

        // Categories - select Precious Metals
        await expect(page.getByText('What assets do you have?')).toBeVisible();
        await page.getByText('Precious Metals', { exact: true }).click();
        await page.waitForTimeout(500);
        await page.getByRole('button', { name: /Continue/i }).click();
        await page.waitForTimeout(1500);

        // Liquid - $20K
        await page.getByTestId('checking-accounts-input').fill('20000');
        await page.getByRole('button', { name: /Continue/i }).click();
        await page.waitForTimeout(1500);

        // Investments - $30K
        const passiveInput = page.getByTestId('passive-investments-value-input');
        await passiveInput.waitFor({ state: 'visible', timeout: 5000 });
        await passiveInput.fill('30000');
        await page.getByRole('button', { name: /Continue/i }).click();
        await page.waitForTimeout(1500);

        // Skip Retirement
        await page.getByRole('button', { name: /Continue/i }).click();
        await page.waitForTimeout(1500);

        // Gold - $5K (exempt in Balanced)
        const goldInput = page.getByTestId('gold-value-input');
        await goldInput.waitFor({ state: 'visible', timeout: 5000 });
        await goldInput.fill('5000');
        await page.getByRole('button', { name: /Continue/i }).click();
        await page.waitForTimeout(1500);

        // Liabilities - $10K
        const debtInput = page.getByTestId('credit-card-debt-input');
        await debtInput.waitFor({ state: 'visible', timeout: 5000 });
        await debtInput.fill('10000');
        await page.getByRole('button', { name: /Continue/i }).click();
        await page.waitForTimeout(2000);

        // Results - ($20K + $9K - $10K) * 2.5% = $475
        await page.waitForTimeout(2000);
        const zakatText = await page.locator('text=/\\$[\\d,]+\\.?\\d*/').first().innerText();
        const zakatValue = parseFloat(zakatText.replace(/[$,]/g, ''));

        expect(zakatValue).toBeGreaterThanOrEqual(470);
        expect(zakatValue).toBeLessThanOrEqual(480);
    });
});
