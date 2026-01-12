/**
 * Simple E2E Calculation Test - ULTRA SIMPLE VERSION
 * 
 * Simplified approach:
 * 1. Clear state
 * 2. Start wizard naturally
 * 3. Use Next button navigation with explicit visibility waits
 * 4. Use default madhab (balanced)
 * 5. Fill only required inputs
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';

test.describe('Calculation Flow - Smoke Tests', () => {

  test.beforeEach(async ({ page, context }) => {
    // Clear all state
    await context.clearCookies();
    await page.goto('about:blank');
    await page.evaluate(() => {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        // Ignore
      }
    });
  });

  test('Baseline: $10,000 cash produces $250 Zakat', async ({page}) => {
    test.setTimeout(60000); // 1min timeout

    // Land on homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click Start button
    const startButton = page.getByRole('button', { name: /Start Calculating/i });
    await expect(startButton).toBeVisible({ timeout: 10000 });
    await startButton.click();
    await page.waitForTimeout(1500); // Animation

    // Should be on Categories step
    await expect(page.getByText('What assets do you have?')).toBeVisible({ timeout: 10000 });
    
    // Make sure we're in Detailed Mode (not Simple)
    const switchBtn = page.getByRole('switch');
    if (await switchBtn.isVisible()) {
      const ariaChecked = await switchBtn.getAttribute('aria-checked');
      if (ariaChecked === 'false') {
        await switchBtn.click();
        await page.waitForTimeout(500);
      }
    }

    // Click Next to proceed (use defaults)
    await page.getByRole('button', { name: /Next/i }).click();
    await page.waitForTimeout(1000);

    // Should be on Liquid Assets
    await expect(page.getByText('What are your liquid assets?')).toBeVisible({ timeout: 10000 });
    
    // Fill checking account
    const checkingInput = page.getByTestId('checking-accounts-input');
    await checkingInput.waitFor({ state: 'visible', timeout: 5000 });
    await checkingInput.fill('10000');
    
    // Next to Investments
    await page.getByRole('button', { name: /Next/i }).click();
    await page.waitForTimeout(1000);

    // Skip Investments
    await page.getByRole('button', { name: /Next/i }).click();
    await page.waitForTimeout(1000);

    // Skip Retirement
    await page.getByRole('button', { name: /Next/i }).click();
    await page.waitForTimeout(1000);

    // Skip Liabilities
    await page.getByRole('button', { name: /Next/i }).click();
    await page.waitForTimeout(1000);

    // Should be on Results or need to click Calculate
    const calculateBtn = page.getByRole('button', { name: /Calculate/i });
    if (await calculateBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await calculateBtn.click();
      await page.waitForTimeout(1500);
    }

    // Verify we're on results
    await expect(page.getByText(/Zakat/i).and(page.getByText(/Results|Due/i)).first()).toBeVisible({ timeout: 10000 });
    
    // Let charts/animations settle
    await page.waitForTimeout(2000);

    // Find the Zakat amount
    const zakatLocator = page.locator('text=/\\$[\\d,]+\\.?\\d*/').first();
    await zakatLocator.waitFor({ state: 'visible', timeout: 5000 });
    const zakatText = await zakatLocator.innerText();
    const zakatValue = parseFloat(zakatText.replace(/[$,]/g, ''));

    console.log(`Zakat calculated: $${zakatValue}`);

    // Expected: $10,000 * 2.5% = $250
    expect(zakatValue).toBeGreaterThanOrEqual(249);
    expect(zakatValue).toBeLessThanOrEqual(251);
  });
});
