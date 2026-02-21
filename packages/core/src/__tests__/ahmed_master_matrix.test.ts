/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import { describe, it, expect } from 'vitest';
import { calculateZakat, defaultFormData, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE } from '../zakatCalculations';
import { ZAKAT_PRESETS } from '../config/index';
import { ZakatFormData } from '../zakatTypes';

// =============================================================================
// THE AHMED MASTER MATRIX
// =============================================================================
// Ground Truth JSON for Agentic & Native Evaluation.
// This parameterized test suite ensures that across all 8 supported Fiqh
// presets, every major edge case translates to exact, proven mathematical
// outputs. When LLM evaluations run, they must match these outputs.

interface AhmedMatrixCase {
    caseId: string;
    description: string;
    madhab: keyof typeof ZAKAT_PRESETS;
    inputs: Partial<ZakatFormData>;
    expected: {
        totalAssets: number;
        totalLiabilities: number;
        netZakatableWealth: number;
        zakatDue: number;
        breakdown?: {
            jewelry?: number;
            retirement?: number;
            investments?: number;
        };
    };
}

const COMMON_AHMED_INPUTS: Partial<ZakatFormData> = {
    ...defaultFormData,
    cashOnHand: 50000,
    checkingAccounts: 25000,
    savingsAccounts: 25000,
    fourOhOneKVestedBalance: 200000,
    passiveInvestmentsValue: 150000, // Equities
    goldJewelryValue: 10000,
    hasPreciousMetals: true,
    creditCardBalance: 5000,
    monthlyMortgage: 2000,
    monthlyLivingExpenses: 3000,
    age: 35,
    estimatedTaxRate: 0.25,
};

const MASTER_MATRIX: AhmedMatrixCase[] = [
    // -------------------------------------------------------------------------
    // 1. Hanafi Presets (Full deductions, jewelry zakatable, net retirement, full equities)
    // -------------------------------------------------------------------------
    {
        caseId: 'AHMED-HANAFI-01',
        description: 'Super Ahmed Standard Evaluation',
        madhab: 'hanafi',
        inputs: COMMON_AHMED_INPUTS,
        expected: {
            totalAssets: 390000,
            // Liabilities: CC(5k) + 12mo Mort(24k) + 12mo Living(36k) = 65,000
            totalLiabilities: 65000,
            netZakatableWealth: 325000,
            zakatDue: 325000 * 0.025, // 8125
            breakdown: { jewelry: 10000, retirement: 130000, investments: 150000 }
        }
    },
    // -------------------------------------------------------------------------
    // 2. Shafi'i Presets (No debt deduction, jewelry exempt, full equities)
    // -------------------------------------------------------------------------
    {
        caseId: 'AHMED-SHAFII-01',
        description: 'Super Ahmed Standard Evaluation',
        madhab: 'shafii',
        inputs: COMMON_AHMED_INPUTS,
        expected: {
            // Assets: Cash(100k) + Jewelry(0) + Retirement Net(130k) + Stocks(150k) = 380,000
            totalAssets: 380000,
            // Liabilities: 0 (Shafi'i doesn't deduct personal debts)
            totalLiabilities: 0,
            netZakatableWealth: 380000,
            zakatDue: 380000 * 0.025, // 9500
            breakdown: { jewelry: 0 }
        }
    },
    // -------------------------------------------------------------------------
    // 3. Bradford Presets (30% proxy for equities, jewelry zakatable, 401k exempt until 59.5)
    // -------------------------------------------------------------------------
    {
        caseId: 'AHMED-BRADFORD-01',
        description: 'Super Ahmed Bradford Rule',
        madhab: 'bradford',
        inputs: COMMON_AHMED_INPUTS,
        expected: {
            totalAssets: 155000,
            totalLiabilities: 65000,
            netZakatableWealth: 90000,
            zakatDue: 90000 * 0.025, // 2250
            breakdown: { retirement: 0, investments: 45000, jewelry: 10000 }
        }
    },
    {
        caseId: 'AHMED-BRADFORD-RETIRED',
        description: 'Ahmed reaches age 60 (Retirement Proxy activation)',
        madhab: 'bradford',
        inputs: { ...COMMON_AHMED_INPUTS, age: 60, isOver59Half: true },
        expected: {
            // Retirement now uses proxy: 200k * 0.3 = 60k
            // Total: Cash(100k) + Jewelry(10k) + Retirement(60k) + Stocks(45k) = 215,000
            totalAssets: 215000,
            totalLiabilities: 65000,
            netZakatableWealth: 150000,
            zakatDue: 150000 * 0.025,
            breakdown: { retirement: 60000 }
        }
    },
    // -------------------------------------------------------------------------
    // 4. AMJA Presets (Income only for equities, jewelry exempt, retirement net)
    // -------------------------------------------------------------------------
    {
        caseId: 'AHMED-AMJA-01',
        description: 'Super Ahmed AMJA Rules (Equities Income Only)',
        madhab: 'amja',
        inputs: COMMON_AHMED_INPUTS, // Note: no dividends specified, so equities = 0
        expected: {
            totalAssets: 230000,
            totalLiabilities: 10000,
            netZakatableWealth: 220000,
            zakatDue: 220000 * 0.025,
            breakdown: { investments: 0, jewelry: 0 }
        }
    },
    // -------------------------------------------------------------------------
    // 5. Qaradawi (Multi-Rate rental income override, proxy equities, jewelry exempt)
    // -------------------------------------------------------------------------
    {
        caseId: 'AHMED-QARADAWI-RENTAL',
        description: 'Qaradawi Multi-Rate Rental Override',
        madhab: 'qaradawi',
        inputs: {
            ...COMMON_AHMED_INPUTS,
            rentalPropertyIncome: 24000,
            hasRealEstate: true
        },
        expected: {
            totalAssets: 299000,
            totalLiabilities: 65000,
            netZakatableWealth: 234000,
            zakatDue: 7650
        }
    }
];

// =============================================================================
// MATRIX RUNNER
// =============================================================================
describe('Phase 1: ZMCS Ahmed Master Matrix (Core Engine Ground Truth)', () => {

    it.each(MASTER_MATRIX)(
        'evaluates [$caseId] correctly using $madhab',
        ({ madhab, inputs, expected }) => {
            const config = ZAKAT_PRESETS[madhab];
            const data: ZakatFormData = { ...inputs as ZakatFormData, madhab };

            const result = calculateZakat(data, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);

            // Assert Top-Line Financials
            expect(result.totalAssets).toBe(expected.totalAssets);
            expect(result.totalLiabilities).toBe(expected.totalLiabilities);
            expect(result.netZakatableWealth).toBe(expected.netZakatableWealth);
            expect(result.zakatDue).toBeCloseTo(expected.zakatDue, 2);

            // Assert Granular Breakdowns if provided
            if (expected.breakdown) {
                if (expected.breakdown.jewelry !== undefined) {
                    expect(result.enhancedBreakdown.preciousMetals.zakatableAmount).toBe(expected.breakdown.jewelry);
                }
                if (expected.breakdown.retirement !== undefined) {
                    expect(result.enhancedBreakdown.retirement.zakatableAmount).toBe(expected.breakdown.retirement);
                }
                if (expected.breakdown.investments !== undefined) {
                    expect(result.enhancedBreakdown.investments.zakatableAmount).toBe(expected.breakdown.investments);
                }
            }
        }
    );
});
