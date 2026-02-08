/**
 * Ahmed Permutation Tests - Predefined Scenarios
 * 
 * Based on the existing Ahmed benchmark from zakatCalculations.test.ts
 * Shows how different madhabs treat THE SAME financial profile differently.
 * 
 * Each test scenario is MANUALLY VERIFIED - no guessing!
 */

import { describe, it, expect } from 'vitest';
import { calculateZakat, defaultFormData } from '../zakatCalculations';
import { ZakatFormData, Madhab } from '../zakatTypes';

// ============================================================================
// Ahmed's Base Profile (from existing passing tests)
// ============================================================================

const ahmedBase: Partial<ZakatFormData> = {
    age: 40,
    cashOnHand: 10000,
    goldJewelryValue: 5000,
    hasPreciousMetals: true,
    fourOhOneKVestedBalance: 100000,
    passiveInvestmentsValue: 50000,
    creditCardBalance: 2000,
    monthlyMortgage: 2000,
    monthlyLivingExpenses: 1000,
};

describe('Ahmed Benchmark - Madhab Comparisons', () => {

    it('Ahmed - Balanced: Conservative approach = $0 zakat', () => {
        const formData: ZakatFormData = {
            ...defaultFormData,
            ...ahmedBase,
            madhab: 'balanced',
        };

        const result = calculateZakat(formData);

        // From existing test: expectedNet = 0 (liabilities exceed zakatable assets)
        expect(result.zakatDue).toBe(0);
        expect(result.netZakatableWealth).toBe(0);
    });

    it('Ahmed - Hanafi: Includes everything = high zakat', () => {
        const formData: ZakatFormData = {
            ...defaultFormData,
            ...ahmedBase,
            madhab: 'hanafi',
        };

        const result = calculateZakat(formData);

        // Updated after living expenses bug fix: $38K liabilities (was $27K)
        // Assets $130K - Liabilities $38K = $92K
        expect(result.netZakatableWealth).toBe(92000);
        expect(result.zakatDue).toBeGreaterThan(2000); // Should be ~$2,300
    });

    it('Ahmed - Shafii: No debt deduction = highest zakat', () => {
        const formData: ZakatFormData = {
            ...defaultFormData,
            ...ahmedBase,
            madhab: 'shafii',
        };

        const result = calculateZakat(formData);

        // From existing test: expectedNet = 125,000 (no debt deduction)
        expect(result.netZakatableWealth).toBe(125000);
        expect(result.zakatDue).toBeGreaterThan(3000); // Should be ~$3,125
    });

    it('Ahmed - Maliki: 12-month debts = moderate zakat', () => {
        const formData: ZakatFormData = {
            ...defaultFormData,
            ...ahmedBase,
            madhab: 'maliki',
        };

        const result = calculateZakat(formData);

        // Updated after living expenses bug fix: $38K liabilities (was $27K)
        // Assets $125K - Liabilities $38K = $87K
        expect(result.netZakatableWealth).toBe(87000);
        expect(result.zakatDue).toBeGreaterThan(2000); // Should be ~$2,175
    });
});

describe('Simple Scenarios - All Madhabs Agree', () => {

    it('$10K cash only - all madhabs calculate same', () => {
        for (const madhab of ['balanced', 'hanafi', 'shafii', 'maliki', 'hanbali'] as Madhab[]) {
            const formData: ZakatFormData = {
                ...defaultFormData,
                madhab,
                cashOnHand: 10000,
            };

            const result = calculateZakat(formData);

            // $10K * 2.5% = $250
            expect(result.zakatDue).toBe(250);
        }
    });

    it('$20K crypto only - all madhabs treat same', () => {
        for (const madhab of ['balanced', 'hanafi', 'shafii', 'maliki', 'hanbali'] as Madhab[]) {
            const formData: ZakatFormData = {
                ...defaultFormData,
                madhab,
                cryptoCurrency: 20000,
                hasCrypto: true,
            };

            const result = calculateZakat(formData);

            // $20K * 2.5% = $500
            expect(result.zakatDue).toBe(500);
        }
    });
});

describe('Focused Variations - Testing Specific Rules', () => {

    it('Gold Jewelry: Hanafi includes, others exempt', () => {
        const baseData = {
            ...defaultFormData,
            cashOnHand: 5000,
            goldJewelryValue: 5000,
            hasPreciousMetals: true,
        };

        // Hanafi: Includes jewelry
        const hanafiResult = calculateZakat({ ...baseData, madhab: 'hanafi' });
        expect(hanafiResult.zakatDue).toBe(250); // ($5K + $5K) * 2.5%

        // Balanced: Exempts jewelry
        const balancedResult = calculateZakat({ ...baseData, madhab: 'balanced' });
        expect(balancedResult.zakatDue).toBe(125); // $5K * 2.5%
    });

    it('Passive Stocks: Balanced 30%, others 100%', () => {
        const baseData = {
            ...defaultFormData,
            cashOnHand: 10000,
            passiveInvestmentsValue: 20000,
        };

        // Balanced: 30% of stocks
        const balancedResult = calculateZakat({ ...baseData, madhab: 'balanced' });
        expect(balancedResult.zakatDue).toBe(400); // ($10K + $6K) * 2.5%

        // Hanafi: 100% of stocks
        const hanafiResult = calculateZakat({ ...baseData, madhab: 'hanafi' });
        expect(hanafiResult.zakatDue).toBe(750); // ($10K + $20K) * 2.5%
    });

    it('Debt: Shafii never deducts, others do', () => {
        const baseData = {
            ...defaultFormData,
            cashOnHand: 10000,
            creditCardBalance: 5000,
        };

        // Shafii: No deduction
        const shafiiResult = calculateZakat({ ...baseData, madhab: 'shafii' });
        expect(shafiiResult.zakatDue).toBe(250); // $10K * 2.5%

        // Balanced: Deducts 12-month debts
        const balancedResult = calculateZakat({ ...baseData, madhab: 'balanced' });
        expect(balancedResult.zakatDue).toBe(125); // ($10K - $5K) * 2.5%
    });
});

describe('Edge Cases', () => {

    it('Below nisab: $400 cash = $0 zakat', () => {
        const formData: ZakatFormData = {
            ...defaultFormData,
            cashOnHand: 400, // Below ~$514 nisab
        };

        const result = calculateZakat(formData);
        expect(result.zakatDue).toBe(0);
    });

    it('Above nisab: $600 cash = zakatable', () => {
        const formData: ZakatFormData = {
            ...defaultFormData,
            cashOnHand: 600,
        };

        const result = calculateZakat(formData);
        expect(result.zakatDue).toBe(15); // $600 * 2.5%
    });

    it('High debt wipes out assets: $0 zakat', () => {
        const formData: ZakatFormData = {
            ...defaultFormData,
            madhab: 'balanced',
            cashOnHand: 5000,
            creditCardBalance: 10000, // Debt > Assets
        };

        const result = calculateZakat(formData);
        expect(result.zakatDue).toBe(0);
    });
});
