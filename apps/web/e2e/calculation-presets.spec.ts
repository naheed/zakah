/**
 * Calculation Smoke Tests — 1 per ZMCS Preset
 *
 * Validates the UI pipeline: wizard loads → inputs fill → result renders.
 * The full 96-case permutation matrix runs in Vitest (calculation-matrix.test.ts)
 * in < 1 second. These 8 E2E tests verify the browser integration only.
 *
 * Run all:    npx playwright test calculation-presets
 * Run one:    npx playwright test calculation-presets --grep "Preset: bradford"
 */

import { test, expect } from '@playwright/test';
import { PermutationScenario } from './helpers/permutationGenerator';
import {
    startWizard,
    navigateThroughSetup,
    runCalculationScenario,
} from './helpers/wizard-helpers';

const BASE_URL = 'http://localhost:8080';

// One representative smoke scenario per madhab: Cash+Gold, LowDebt.
// This exercises: methodology selection, optional Gold category, liability input,
// and result display in a single test per madhab.
const SMOKE_SCENARIOS: PermutationScenario[] = [
    {
        id: 'SMOKE-01', madhab: 'bradford', description: 'bradford | Cash+Gold | LowDebt',
        assets: { cash: 5000, gold: 5000, stock: 0, crypto: 0 },
        liabilities: { creditCard: 2000, mortgage: 0 },
        expectedZakat: 200, tags: ['SMOKE'],
    },
    {
        id: 'SMOKE-02', madhab: 'hanafi', description: 'hanafi | Cash+Gold | LowDebt',
        assets: { cash: 5000, gold: 5000, stock: 0, crypto: 0 },
        liabilities: { creditCard: 2000, mortgage: 0 },
        expectedZakat: 200, tags: ['SMOKE'],
    },
    {
        id: 'SMOKE-03', madhab: 'shafii', description: 'shafii | Cash+Gold | LowDebt',
        assets: { cash: 5000, gold: 5000, stock: 0, crypto: 0 },
        liabilities: { creditCard: 2000, mortgage: 0 },
        expectedZakat: 250, // no_deduction: ignores credit card
        tags: ['SMOKE'],
    },
    {
        id: 'SMOKE-04', madhab: 'maliki', description: 'maliki | Cash+Gold | LowDebt',
        assets: { cash: 5000, gold: 5000, stock: 0, crypto: 0 },
        liabilities: { creditCard: 2000, mortgage: 0 },
        expectedZakat: 200, tags: ['SMOKE'],
    },
    {
        id: 'SMOKE-05', madhab: 'hanbali', description: 'hanbali | Cash+Gold | LowDebt',
        assets: { cash: 5000, gold: 5000, stock: 0, crypto: 0 },
        liabilities: { creditCard: 2000, mortgage: 0 },
        expectedZakat: 200, tags: ['SMOKE'],
    },
    {
        id: 'SMOKE-06', madhab: 'amja', description: 'amja | Cash+Gold | LowDebt',
        assets: { cash: 5000, gold: 5000, stock: 0, crypto: 0 },
        liabilities: { creditCard: 2000, mortgage: 0 },
        expectedZakat: 200, tags: ['SMOKE'],
    },
    {
        id: 'SMOKE-07', madhab: 'tahir_anwar', description: 'tahir_anwar | Cash+Gold | LowDebt',
        assets: { cash: 5000, gold: 5000, stock: 0, crypto: 0 },
        liabilities: { creditCard: 2000, mortgage: 0 },
        expectedZakat: 200, tags: ['SMOKE'],
    },
    {
        id: 'SMOKE-08', madhab: 'qaradawi', description: 'qaradawi | Cash+Gold | LowDebt',
        assets: { cash: 5000, gold: 5000, stock: 0, crypto: 0 },
        liabilities: { creditCard: 2000, mortgage: 0 },
        expectedZakat: 200, tags: ['SMOKE'],
    },
];

for (const scenario of SMOKE_SCENARIOS) {
    test.describe(`Preset: ${scenario.madhab}`, () => {

        test.beforeEach(async ({ page, context }) => {
            await context.clearCookies();
            await page.goto(BASE_URL);
            await page.evaluate(() => {
                try { localStorage.clear(); sessionStorage.clear(); } catch { }
            });
            await page.waitForTimeout(500);
        });

        test(`[${scenario.id}] ${scenario.description}`, async ({ page }) => {
            test.setTimeout(90000);

            await page.goto(BASE_URL);
            await startWizard(page);
            await navigateThroughSetup(page, 'detailed', scenario.madhab);

            // Run the full wizard flow
            await runCalculationScenario(page, scenario);

            // Extract and validate result
            const zakatDueText = await page.getByTestId('zakat-due-amount').innerText();
            const actualZakat = parseFloat(zakatDueText.replace(/[$,]/g, ''));

            const tolerance = 5;
            const errorMargin = Math.abs(actualZakat - scenario.expectedZakat);

            console.log(`[${scenario.id}] Expected: $${scenario.expectedZakat}, Actual: $${actualZakat}`);
            expect(errorMargin).toBeLessThanOrEqual(tolerance);
        });
    });
}
