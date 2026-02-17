/**
 * Simple E2E Calculation Test - Smoke Test
 * 
 * Verifies the basic calculation flow works end-to-end.
 * Flow: Welcome → Setup → Categories → Assets → Results
 */

import { test, expect } from '@playwright/test';
import {
  clearAppState,
  completeMinimalCalculation
} from './helpers/wizard-helpers';

test.describe('Calculation Flow - Smoke Tests', () => {

  test.beforeEach(async ({ page, context }) => {
    await clearAppState(page, context);
  });

  test('Baseline: $10,000 cash produces $250 Zakat', async ({ page }) => {
    test.setTimeout(60000);

    // Use the helper to complete a minimal calculation
    const zakatValue = await completeMinimalCalculation(page, '10000');

    console.log(`Zakat calculated: $${zakatValue}`);

    // Expected: $10,000 * 2.5% = $250
    expect(zakatValue).toBeGreaterThanOrEqual(249);
    expect(zakatValue).toBeLessThanOrEqual(251);
  });

  test('Smaller amount: $1,000 cash produces $25 Zakat', async ({ page }) => {
    test.setTimeout(60000);

    const zakatValue = await completeMinimalCalculation(page, '1000');

    console.log(`Zakat calculated: $${zakatValue}`);

    // Expected: $1,000 * 2.5% = $25
    expect(zakatValue).toBeGreaterThanOrEqual(24);
    expect(zakatValue).toBeLessThanOrEqual(26);
  });
});
