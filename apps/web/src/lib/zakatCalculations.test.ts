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


import { describe, it, expect } from 'vitest';
import {
    calculateZakat,
    calculateTotalAssets,
    calculateTotalLiabilities,
    defaultFormData,
    ZakatFormData,
    SOLAR_ZAKAT_RATE,
    ZAKAT_RATE,
    calculateNisab,
    SILVER_PRICE_PER_OUNCE,
    GOLD_PRICE_PER_OUNCE
} from '@zakatflow/core';

describe('Zakat Calculation Engine', () => {

    describe('1. Nisab & Hawl Rules', () => {
        it('should use 2.5% rate for Lunar calendar', () => {
            const data: ZakatFormData = { ...defaultFormData, calendarType: 'lunar', cashOnHand: 10000 };
            const result = calculateZakat(data);
            expect(result.zakatRate).toBe(ZAKAT_RATE);
            expect(result.zakatDue).toBe(10000 * 0.025);
        });

        it('should use 2.577% rate for Solar calendar', () => {
            const data: ZakatFormData = { ...defaultFormData, calendarType: 'solar', cashOnHand: 10000 };
            const result = calculateZakat(data);
            expect(result.zakatRate).toBe(SOLAR_ZAKAT_RATE);
            expect(result.zakatDue).toBe(10000 * 0.02577);
        });

        it('should result in 0 Zakat if Net Wealth < Nisab', () => {
            // Silver Nisab is approx $475
            const data: ZakatFormData = { ...defaultFormData, cashOnHand: 100 }; // Clearly below
            const result = calculateZakat(data);
            expect(result.isAboveNisab).toBe(false);
            expect(result.zakatDue).toBe(0);
        });
    });

    describe('Super Ahmed Benchmark', () => {
        // Super Ahmed has:
        // - $100,000 Cash
        // - $100,000 401k (Age 30)
        // - $100,000 Investments (Stocks)

        // Balanced: 
        // Cash: 100k
        // 401k: 0 (Exempt)
        // Inv: 30k (30%)
        // Total: 130k -> Zakat: 3,250

        // Hanafi:
        // Cash: 100k
        // 401k: 65k (Net)
        // Inv: 100k
        // Total: 265k -> Zakat: 6,625

        // Shafii/Maliki/Hanbali: similar to Hanafi generally for these assets in this simple model if no deductions

        const superAhmed: ZakatFormData = {
            ...defaultFormData,
            cashOnHand: 100000,
            fourOhOneKVestedBalance: 100000,
            passiveInvestmentsValue: 100000,
            age: 30
        };

        it('Calculates correctly for bradford', () => {
            const data: ZakatFormData = { ...superAhmed, madhab: 'bradford' };
            const result = calculateZakat(data);
            // 100k + 0 + 30k = 130k
            expect(result.netZakatableWealth).toBe(130000);
        });

        it('Calculates correctly for hanafi', () => {
            const data: ZakatFormData = { ...superAhmed, madhab: 'hanafi' };
            const result = calculateZakat(data);
            // 100k + 65k + 100k = 265k
            expect(result.netZakatableWealth).toBe(265000);
        });

        it('Calculates correctly for shafii', () => {
            const data: ZakatFormData = { ...superAhmed, madhab: 'shafii' };
            const result = calculateZakat(data);
            // Shafii: 100k + 65k (Net 401k typically) + 100k = 265k
            expect(result.netZakatableWealth).toBe(265000);
        });

        it('Calculates correctly for maliki', () => {
            const data: ZakatFormData = { ...superAhmed, madhab: 'maliki' };
            const result = calculateZakat(data);
            expect(result.netZakatableWealth).toBe(265000);
        });

        it('Calculates correctly for hanbali', () => {
            const data: ZakatFormData = { ...superAhmed, madhab: 'hanbali' };
            const result = calculateZakat(data);
            expect(result.netZakatableWealth).toBe(265000);
        });
    });

    describe('2. Retirement Logic (The "Bradford" Rule)', () => {
        const retirementData: ZakatFormData = {
            ...defaultFormData,
            age: 40, // Under 59.5
            fourOhOneKVestedBalance: 100000,
            estimatedTaxRate: 0.25, // 25% tax
        };

        it('Bradford Mode: Should exempt 401k completely if < 59.5', () => {
            const data: ZakatFormData = { ...retirementData, madhab: 'bradford' };
            const assets = calculateTotalAssets(data);
            expect(assets).toBe(0); // Fully exempt due to lack of accessibility
        });

        it('Hanafi Mode: Should apply net accessible value (after tax/penalty)', () => {
            const data: ZakatFormData = { ...retirementData, madhab: 'hanafi' };
            const assets = calculateTotalAssets(data);
            // Net accessible = 100000 * (1 - 0.25 tax - 0.10 penalty) = 65000
            expect(assets).toBe(65000);
        });
    });

    describe('3. Investments (30% Rule)', () => {
        const investData: ZakatFormData = {
            ...defaultFormData,
            passiveInvestmentsValue: 100000
        };

        it('Bradford Mode: 30% Zakatable (Proxy for underlying assets)', () => {
            const data: ZakatFormData = { ...investData, madhab: 'bradford' };
            const assets = calculateTotalAssets(data);
            expect(assets).toBe(30000); // Bradford uses 30% rule
        });

        it('Hanafi Mode: 100% Zakatable', () => {
            const data: ZakatFormData = { ...investData, madhab: 'hanafi' };
            const assets = calculateTotalAssets(data);
            expect(assets).toBe(100000); // Hanafi uses 100%
        });
    });

    describe('4. Liabilities (Deducations)', () => {
        const liabData: ZakatFormData = {
            ...defaultFormData,
            monthlyLivingExpenses: 2000,
            monthlyMortgage: 3000,
            creditCardBalance: 1000,
            cashOnHand: 100000 // Ensure above nisab
        };

        it('should deduct 12 months of living expenses and 12 months of mortgage', () => {
            // Note: The UI field captures MONTHLY amount, but calculation annualizes it.
            // User enters: $2,000/month → Calculation: $2,000 × 12 = $24,000 deducted
            const liabilities = calculateTotalLiabilities(liabData);
            // (2000 * 12) (living) + 1000 (CC) + (3000 * 12) (Mortgage)
            // 24000 + 1000 + 36000 = 61000
            expect(liabilities).toBe(61000);
        });
    });
});

// =============================================================================
// Edge Case Tests
// =============================================================================

describe('Zakat Calculations - Edge Cases', () => {

    it('Zero assets should return zero zakat', () => {
        // Feature: CALC-08 (Zero State)
        const data: ZakatFormData = {
            ...defaultFormData,
            madhab: 'bradford'
        };
        const result = calculateZakat(data);

        expect(result.totalAssets).toBe(0);
        expect(result.zakatDue).toBe(0);
        expect(result.isAboveNisab).toBe(false);
    });

    it('Below nisab should return zero zakat', () => {
        // Feature: CALC-01 (Nisab Threshold)
        const nisab = calculateNisab(SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, 'silver');

        const data: ZakatFormData = {
            ...defaultFormData,
            madhab: 'bradford',
            cashOnHand: Math.floor(nisab * 0.5) // Half of nisab
        };
        const result = calculateZakat(data);

        expect(result.isAboveNisab).toBe(false);
        expect(result.zakatDue).toBe(0);
    });

    it('Exactly at nisab should be zakatable', () => {
        // Feature: CALC-01 (Nisab Threshold)
        const nisab = calculateNisab(SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, 'silver');

        const data: ZakatFormData = {
            ...defaultFormData,
            madhab: 'bradford',
            cashOnHand: Math.ceil(nisab) // Exactly at nisab
        };
        const result = calculateZakat(data);

        expect(result.isAboveNisab).toBe(true);
        expect(result.zakatDue).toBeGreaterThan(0);
    });

    // Super Ahmed base used for age tests
    const ahmedBase: ZakatFormData = {
        ...defaultFormData,
        cashOnHand: 10000,
        goldJewelryValue: 5000, // Personal Jewelry
        hasPreciousMetals: true,
        fourOhOneKVestedBalance: 100000, // 401k
        age: 40, // Under 59.5
        passiveInvestmentsValue: 50000, // Passive Stocks
        activeInvestments: 0,
        creditCardBalance: 2000, // Immediate debt
        monthlyMortgage: 2000,
        monthlyLivingExpenses: 1000,
        hasCrypto: false,
        hasRealEstate: true,
        hasBusiness: false,
    };

    it('Age 59.5+ should make 401k fully zakatable', () => {
        // Feature: CALC-09 (Retirement Age Threshold)
        const data: ZakatFormData = {
            ...ahmedBase,
            madhab: 'bradford',
            age: 60, // Over 59.5
            isOver59Half: true
        };
        const result = calculateZakat(data);

        // At age 60, 401k is fully accessible (no penalty)
        // With 25% tax rate: $100,000 * 0.75 = $75,000
        expect(result.enhancedBreakdown.retirement.zakatableAmount).toBe(75000);
    });

    it('Roth contributions are always zakatable, earnings exempt under 59.5 in Balanced', () => {
        // Feature: CALC-10 (Roth IRA Rules)
        const data: ZakatFormData = {
            ...defaultFormData,
            madhab: 'bradford',
            age: 40,
            rothIRAContributions: 20000, // Contributions (always zakatable)
            rothIRAEarnings: 10000, // Earnings (exempt under 59.5 in Balanced)
        };
        const result = calculateZakat(data);

        // Contributions should be included, earnings exempt
        expect(result.totalAssets).toBe(20000);
    });

    it('Roth earnings are zakatable at age 59.5+', () => {
        const data: ZakatFormData = {
            ...defaultFormData,
            madhab: 'bradford',
            age: 60,
            isOver59Half: true,
            rothIRAContributions: 20000,
            rothIRAEarnings: 10000,
        };
        const result = calculateZakat(data);

        // Both contributions and earnings should be included
        expect(result.totalAssets).toBe(30000);
    });

});

describe('Zakat Calculations - Single Source of Truth', () => {

    it('Solar vs Lunar year rate difference', () => {
        // Feature: CALC-11 (Calendar Types)
        const dataLunar: ZakatFormData = {
            ...defaultFormData,
            madhab: 'bradford',
            calendarType: 'lunar',
            cashOnHand: 100000
        };
        const dataSOlar: ZakatFormData = {
            ...dataLunar,
            calendarType: 'solar'
        };

        const resultLunar = calculateZakat(dataLunar);
        const resultSolar = calculateZakat(dataSOlar);

        expect(resultLunar.zakatRate).toBe(0.025); // 2.5%
        expect(resultSolar.zakatRate).toBeCloseTo(0.02577, 4); // ~2.577%
        expect(resultSolar.zakatDue).toBeGreaterThan(resultLunar.zakatDue);
    });

    it('Gold vs Silver nisab standard', () => {
        // Feature: CALC-12 (Nisab Standards)
        const silverNisab = calculateNisab(SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, 'silver');
        const goldNisab = calculateNisab(SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, 'gold');

        // Gold nisab should be significantly higher than silver
        expect(goldNisab).toBeGreaterThan(silverNisab * 5);
    });

});
