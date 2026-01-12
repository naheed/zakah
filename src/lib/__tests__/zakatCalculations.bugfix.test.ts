/**
 * TEST FOR LIVING EXPENSES BUG FIX
 * 
 * Regression test to ensure living expenses are properly annualized.
 * Bug was: monthlyLivingExpenses added directly without × 12
 * Fix: Now multiplied by 12 to get annual deduction
 */

import { describe, it, expect } from 'vitest';
import { calculateZakat, defaultFormData, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE } from '../zakatCalculations';

describe('Living Expenses Annualization - Bug Fix Test', () => {

    it('Monthly living expenses should be multiplied by 12', () => {
        const result = calculateZakat({
            ...defaultFormData,
            madhab: 'balanced',
            cashOnHand: 15000,
            monthlyLivingExpenses: 1000, // $1K/month
        }, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE);

        // Liabilities should be $12K (1000 × 12), not $1K
        expect(result.totalLiabilities).toBe(12000);

        // Net: $15K - $12K = $3K
        expect(result.netZakatableWealth).toBe(3000);

        // Zakat: $3K × 2.5% = $75
        expect(result.zakatDue).toBe(75);
    });

    it('Bug would have calculated incorrectly (only $1K deducted)', () => {
        // This test documents the BUG behavior (for historical reference)
        // If monthly expenses were NOT multiplied, we'd get:
        // $15K - $1K = $14K → $350 zakat (WRONG)

        const result = calculateZakat({
            ...defaultFormData,
            madhab: 'balanced',
            cashOnHand: 15000,
            monthlyLivingExpenses: 1000,
        }, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE);

        // Should NOT be $350 (the bug result)
        expect(result.zakatDue).not.toBe(350);

        // Should be $75 (correct result after fix)
        expect(result.zakatDue).toBe(75);
    });

    it('Mortgage already correctly annualized (for comparison)', () => {
        const result = calculateZakat({
            ...defaultFormData,
            madhab: 'balanced',
            cashOnHand: 30000,
            monthlyMortgage: 2000, // $2K/month
        }, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE);

        // Mortgage correctly multiplied by 12 = $24K
        expect(result.totalLiabilities).toBe(24000);
        expect(result.netZakatableWealth).toBe(6000);
        expect(result.zakatDue).toBe(150);
    });

    it('Combined: Living + Mortgage both annualized', () => {
        const result = calculateZakat({
            ...defaultFormData,
            madhab: 'balanced',
            cashOnHand: 50000,
            monthlyLivingExpenses: 1000, // $12K/year
            monthlyMortgage: 2000, // $24K/year
        }, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE);

        // Total liabilities: $12K + $24K = $36K
        expect(result.totalLiabilities).toBe(36000);

        // Net: $50K - $36K = $14K
        expect(result.netZakatableWealth).toBe(14000);

        // Zakat: $14K × 2.5% = $350
        expect(result.zakatDue).toBe(350);
    });
});
