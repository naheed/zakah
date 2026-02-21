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
// CALCULATION PERMUTATION MATRIX
// =============================================================================
// Replaces the 96-scenario Playwright E2E matrix with sub-second Vitest assertions.
// Tests 8 madhabs × 4 asset mixes × 3 liability states = 96 cases.
//
// This validates that calculateZakat() produces correct results across the full
// methodology × asset × debt permutation space — the same verification that
// previously required 18 minutes of browser automation.

type Madhab = keyof typeof ZAKAT_PRESETS;

// ---------------------------------------------------------------------------
// Methodology-specific rates (from ZAKAT_PRESETS configs)
// ---------------------------------------------------------------------------
const STOCK_RATES: Partial<Record<Madhab, number>> = {
    bradford: 0.30,    // underlying_assets proxy
    qaradawi: 0.30,    // underlying_assets proxy
    amja: 0.0,         // income_only — passive investments NOT zakatable
    // All others: 1.0 (market_value)
};

// Liability handling: Shafii = no_deduction; all others deduct credit card
const NO_DEDUCTION_MADHABS: Madhab[] = ['shafii'];

// ---------------------------------------------------------------------------
// Oracle: simplified Zakat calculator matching app logic
// ---------------------------------------------------------------------------
function calculateExpected(
    madhab: Madhab,
    assets: { cash: number; gold: number; stock: number; crypto: number },
    liabilities: { creditCard: number }
): number {
    let zakatableAssets = 0;

    // Cash: always 100%
    zakatableAssets += assets.cash;

    // Gold (investment value): always 100% across all methodologies
    // (jewelry exemption only applies to goldJewelryValue, not goldInvestmentValue)
    zakatableAssets += assets.gold;

    // Stocks: rate varies by methodology
    const stockRate = STOCK_RATES[madhab] ?? 1.0;
    zakatableAssets += assets.stock * stockRate;

    // Crypto: always 100%
    zakatableAssets += assets.crypto;

    // Liabilities
    let deductible = 0;
    if (!NO_DEDUCTION_MADHABS.includes(madhab)) {
        deductible = liabilities.creditCard;
    }

    const net = Math.max(0, zakatableAssets - deductible);

    // Nisab check (use silver standard, ~$400)
    if (net < 400) return 0;

    return Math.round(net * 0.025 * 100) / 100;
}

// ---------------------------------------------------------------------------
// Permutation dimensions
// ---------------------------------------------------------------------------
const MADHABS: Madhab[] = [
    'bradford', 'hanafi', 'shafii', 'maliki',
    'hanbali', 'amja', 'tahir_anwar', 'qaradawi'
];

const ASSET_MIXES = [
    { name: 'Cash', assets: { cash: 10000, gold: 0, stock: 0, crypto: 0 } },
    { name: 'Cash+Gold', assets: { cash: 5000, gold: 5000, stock: 0, crypto: 0 } },
    { name: 'Cash+Stock', assets: { cash: 5000, gold: 0, stock: 10000, crypto: 0 } },
    { name: 'CryptoHigh', assets: { cash: 0, gold: 0, stock: 0, crypto: 20000 } },
];

const LIABILITY_MIXES = [
    { name: 'None', liabilities: { creditCard: 0 } },
    { name: 'LowDebt', liabilities: { creditCard: 2000 } },
    { name: 'HighDebt', liabilities: { creditCard: 15000 } },
];

// ---------------------------------------------------------------------------
// Build the matrix
// ---------------------------------------------------------------------------
interface MatrixCase {
    madhab: Madhab;
    assetName: string;
    debtName: string;
    cash: number;
    goldInvestmentValue: number;
    passiveInvestmentsValue: number;
    cryptoCurrency: number;
    creditCardBalance: number;
    expectedZakat: number;
}

const MATRIX: MatrixCase[] = [];

for (const madhab of MADHABS) {
    for (const am of ASSET_MIXES) {
        for (const lm of LIABILITY_MIXES) {
            MATRIX.push({
                madhab,
                assetName: am.name,
                debtName: lm.name,
                cash: am.assets.cash,
                goldInvestmentValue: am.assets.gold,
                passiveInvestmentsValue: am.assets.stock,
                cryptoCurrency: am.assets.crypto,
                creditCardBalance: lm.liabilities.creditCard,
                expectedZakat: calculateExpected(madhab, am.assets, lm.liabilities),
            });
        }
    }
}

// ---------------------------------------------------------------------------
// Matrix Runner
// ---------------------------------------------------------------------------
describe('Calculation Permutation Matrix (8×4×3 = 96 cases)', () => {

    // Sanity: we have exactly 96 cases
    it('has 96 permutation cases', () => {
        expect(MATRIX.length).toBe(96);
    });

    it.each(MATRIX)(
        '$madhab | $assetName | Debt: $debtName → $expectedZakat',
        (tc) => {
            const config = ZAKAT_PRESETS[tc.madhab];
            const data: ZakatFormData = {
                ...defaultFormData,
                madhab: tc.madhab,
                cashOnHand: tc.cash,
                goldInvestmentValue: tc.goldInvestmentValue,
                hasPreciousMetals: tc.goldInvestmentValue > 0,
                passiveInvestmentsValue: tc.passiveInvestmentsValue,
                cryptoCurrency: tc.cryptoCurrency,
                hasCrypto: tc.cryptoCurrency > 0,
                creditCardBalance: tc.creditCardBalance,
            };

            const result = calculateZakat(data, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);

            expect(result.zakatDue).toBeCloseTo(tc.expectedZakat, 0);
        }
    );
});

// ---------------------------------------------------------------------------
// Stock Rate Isolation Tests
// ---------------------------------------------------------------------------
describe('AMJA Passive Investment Rate = 0% (income_only)', () => {
    it('AMJA ignores passive investments entirely', () => {
        const config = ZAKAT_PRESETS['amja'];
        const data: ZakatFormData = {
            ...defaultFormData,
            cashOnHand: 5000,
            passiveInvestmentsValue: 100000,
        };
        const result = calculateZakat(data, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);
        // Only cash should be zakatable: 5000 * 0.025 = 125
        expect(result.zakatDue).toBe(125);
    });
});

describe('Qaradawi Passive Investment Rate = 30% (underlying_assets)', () => {
    it('Qaradawi applies 30% proxy to passive investments', () => {
        const config = ZAKAT_PRESETS['qaradawi'];
        const data: ZakatFormData = {
            ...defaultFormData,
            cashOnHand: 5000,
            passiveInvestmentsValue: 100000,
        };
        const result = calculateZakat(data, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);
        // Cash 5000 + Passive 100000*0.30=30000 = 35000 * 0.025 = 875
        expect(result.zakatDue).toBe(875);
    });
});

describe('Bradford Passive Investment Rate = 30% (underlying_assets)', () => {
    it('Bradford applies 30% proxy to passive investments', () => {
        const config = ZAKAT_PRESETS['bradford'];
        const data: ZakatFormData = {
            ...defaultFormData,
            cashOnHand: 5000,
            passiveInvestmentsValue: 100000,
        };
        const result = calculateZakat(data, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);
        // Cash 5000 + Passive 100000*0.30=30000 = 35000 * 0.025 = 875
        expect(result.zakatDue).toBe(875);
    });
});

describe('Classical Madhabs use 100% market value for passive investments', () => {
    for (const madhab of ['hanafi', 'shafii', 'maliki', 'hanbali', 'tahir_anwar'] as Madhab[]) {
        it(`${madhab} uses 100% passive investment rate`, () => {
            const config = ZAKAT_PRESETS[madhab];
            const data: ZakatFormData = {
                ...defaultFormData,
                cashOnHand: 5000,
                passiveInvestmentsValue: 100000,
            };
            const result = calculateZakat(data, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);
            // Cash 5000 + Passive 100000*1.0=100000 = 105000 * 0.025 = 2625
            expect(result.zakatDue).toBe(2625);
        });
    }
});
