/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * TEST FOR LIVING EXPENSES BUG FIX
 * 
 * Regression test to ensure living expenses are properly annualized.
 * Bug was: monthlyLivingExpenses added directly without × 12
 * Fix: Now multiplied by 12 to get annual deduction
 */

import { describe, it, expect } from 'vitest';
import { calculateZakat, defaultFormData, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE } from "@zakatflow/core";

describe('Living Expenses Annualization - Bug Fix Test', () => {

    it('Monthly living expenses should be multiplied by 12', () => {
        const result = calculateZakat({
            ...defaultFormData,
            madhab: 'bradford',
            cashOnHand: 15000,
            monthlyLivingExpenses: 1000,
        }, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE);

        expect(result.totalLiabilities).toBe(12000);
        expect(result.netZakatableWealth).toBe(3000);
        expect(result.zakatDue).toBe(75);
    });

    it('Bug would have calculated incorrectly (only $1K deducted)', () => {
        const result = calculateZakat({
            ...defaultFormData,
            madhab: 'bradford',
            cashOnHand: 15000,
            monthlyLivingExpenses: 1000,
        }, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE);

        expect(result.zakatDue).not.toBe(350);
        expect(result.zakatDue).toBe(75);
    });

    it('Mortgage already correctly annualized (for comparison)', () => {
        const result = calculateZakat({
            ...defaultFormData,
            madhab: 'bradford',
            cashOnHand: 30000,
            monthlyMortgage: 2000,
        }, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE);

        expect(result.totalLiabilities).toBe(24000);
        expect(result.netZakatableWealth).toBe(6000);
        expect(result.zakatDue).toBe(150);
    });

    it('Combined: Living + Mortgage both annualized', () => {
        const result = calculateZakat({
            ...defaultFormData,
            madhab: 'bradford',
            cashOnHand: 50000,
            monthlyLivingExpenses: 1000,
            monthlyMortgage: 2000,
        }, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE);

        expect(result.totalLiabilities).toBe(36000);
        expect(result.netZakatableWealth).toBe(14000);
        expect(result.zakatDue).toBe(350);
    });
});
