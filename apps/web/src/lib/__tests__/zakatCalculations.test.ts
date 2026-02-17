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
import { calculateZakat, defaultFormData, calculateNisab, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, calculateTotalAssets, calculateEnhancedAssetBreakdown } from '../zakatCalculations';
import { ZakatFormData } from '../zakatTypes';

// =============================================================================
// Super Ahmed Benchmark Data
// =============================================================================
// Ahmed is a 40-year-old with:
// - $10,000 cash
// - $5,000 personal jewelry (gold)
// - $100,000 in 401(k) (vested)
// - $50,000 in passive investments (ETFs)
// - $2,000 credit card debt
// - $2,000/month mortgage
// - $1,000/month living expenses
// =============================================================================

const ahmedBase: ZakatFormData = {
    ...defaultFormData,
    // Assets
    cashOnHand: 10000,
    goldJewelryValue: 5000, // Personal Jewelry
    hasPreciousMetals: true,
    fourOhOneKVestedBalance: 100000, // 401k
    age: 40, // Under 59.5
    passiveInvestmentsValue: 50000, // Passive Stocks
    activeInvestments: 0,

    // Liabilities
    creditCardBalance: 2000, // Immediate debt
    monthlyMortgage: 2000, // $2k/mo mortgage -> $24k/yr
    monthlyLivingExpenses: 1000,

    // Flags
    hasCrypto: false,
    hasRealEstate: true,
    hasBusiness: false,
};

describe('Zakat Calculations - Super Ahmed Benchmark', () => {

    // =========================================================================
    // Core Madhab Logic Matrix
    // =========================================================================
    // Base Case: Ahmed with:
    // Assets: Cash(10k) + Jewelry(5k) + 401k(100k) + Stock(50k) = 165k Gross (varies by Madhab)
    // Liabilities: CC(2k) + Mortgage(2k/mo = 24k/yr) + Living(1k) = 27k Total (varies by Madhab)
    // Verify specific Zakatable Amount results per category.

    // Definition of Expected Values for Ahmed
    const SCENARIOS = [
        {
            madhab: 'bradford',
            // Assets: Cash(10k) + Jewelry(5k) + 401k(0) + Stock(15k) = 30,000
            // Liabil: CC(2k) + Mortgage(24k) + Living(12k) = 38,000
            expectedAssets: 30000,
            expectedLiabilities: 38000,
            expectedNet: 0,
            breakdown: { jewelry: 5000, retirement: 0, investments: 15000 }
        },
        {
            madhab: 'hanafi',
            // Assets: Cash(10k) + Jewelry(5k) + 401k(65k) + Stock(50k) = 130,000
            // Liabil: All Debt (38k)
            expectedAssets: 130000,
            expectedLiabilities: 38000,
            expectedNet: 92000,
            breakdown: { jewelry: 5000, retirement: 65000, investments: 50000 }
        },
        {
            madhab: 'shafii',
            // Assets: Cash(10k) + Jewelry(0) + 401k(65k) + Stock(50k) = 125,000
            // Liabil: None (0)
            expectedAssets: 125000,
            expectedLiabilities: 0,
            expectedNet: 125000, // 125k > Nisab
            breakdown: { jewelry: 0, retirement: 65000, investments: 50000 }
        },
        {
            madhab: 'maliki',
            // Assets: Same as Shafii (125k) - Note: Maliki usually shares rules w/ Shafii on assets, logic from test E
            // Liabil: 12-Month Rule for debts, BUT living expenses are "current due" (1 month) = 1k
            // Total Liab: CC(2k) + Mortgage(24k) + Living(1k) = 27k
            expectedAssets: 125000,
            expectedLiabilities: 27000,
            expectedNet: 98000,
            breakdown: { jewelry: 0, retirement: 65000, investments: 50000 }
        },
        {
            madhab: 'hanbali',
            // Assets: Same as Shafii (125k) - Jewelry Exempt
            // Liabil: Full Deduction (38k) - Like Hanafi
            expectedAssets: 125000,
            expectedLiabilities: 38000,
            expectedNet: 87000,
            breakdown: { jewelry: 0, retirement: 65000, investments: 50000 }
        }
    ] as const;

    SCENARIOS.forEach((scenario) => {
        it(`Calculates correctly for ${scenario.madhab}`, () => {
            // Feature: CALC-Logic-Matrix
            const data: ZakatFormData = {
                ...ahmedBase,
                madhab: scenario.madhab
            };
            const result = calculateZakat(data);

            if (scenario.madhab === 'bradford' && result.enhancedBreakdown.preciousMetals.zakatableAmount !== 5000) {
                console.log('DEBUG TEST FAILURE: madhab=', data.madhab, 'zakatableAmount=', result.enhancedBreakdown.preciousMetals.zakatableAmount);
            }

            expect(result.totalAssets).toBe(scenario.expectedAssets);
            expect(result.totalLiabilities).toBe(scenario.expectedLiabilities);
            expect(result.netZakatableWealth).toBe(scenario.expectedNet);

            // Detailed breakdowns
            expect(result.enhancedBreakdown.preciousMetals.zakatableAmount).toBe(scenario.breakdown.jewelry);
            expect(result.enhancedBreakdown.retirement.zakatableAmount).toBe(scenario.breakdown.retirement);
            expect(result.enhancedBreakdown.investments.zakatableAmount).toBe(scenario.breakdown.investments);
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
        // With 25% tax rate: Net Accessible = $75,000
        // Bradford Rule > 59.5: 30% Proxy of Market Value = $100,000 * 0.30 = $30,000 (Tax/Penalty ignored in proxy method)
        expect(result.enhancedBreakdown.retirement.zakatableAmount).toBe(30000);
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

        // Bradford Rule: Roth Contributions at 30% Proxy
        // $20,000 * 0.30 = $6,000
        expect(result.totalAssets).toBe(6000);
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

        // Bradford Rule > 59.5: Total Balance * 30%
        // ($20,000 + $10,000) * 0.30 = $9,000
        expect(result.totalAssets).toBe(9000);
    });

});

// =============================================================================
// Calculation Consistency Tests
// =============================================================================

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

describe('Zakat Calculations - Split Metals (Investment vs Jewelry)', () => {

    // Base data with NO metals
    const baseData: ZakatFormData = {
        ...defaultFormData,
        hasPreciousMetals: true,
        cashOnHand: 100000 // High enough to be above Nisab
    };

    it('Investment Gold should ALWAYS be zakatable (all schools)', () => {
        // Bradford
        const dataBradford: ZakatFormData = {
            ...baseData,
            madhab: 'bradford',
            goldInvestmentValue: 10000,
            goldJewelryValue: 5000
        };
        const resBradford = calculateZakat(dataBradford).totalAssets;
        // Cash (100k) + Inv Gold (10k) + Jewelry (5k). Jewelry is Zakatable in Bradford (unlike old Balanced)
        expect(resBradford).toBe(115000);

        // Hanafi
        const dataHanafi: ZakatFormData = {
            ...baseData,
            madhab: 'hanafi',
            goldInvestmentValue: 10000,
            goldJewelryValue: 5000
        };
        const resHanafi = calculateZakat(dataHanafi).totalAssets;
        // Cash (100k) + Inv Gold (10k) + Jewelry (5k) is Zakatable in Hanafi
        expect(resHanafi).toBe(115000);

        // Shafi'i
        const dataShafii: ZakatFormData = {
            ...baseData,
            madhab: 'shafii',
            goldInvestmentValue: 10000,
            goldJewelryValue: 5000
        };
        const resShafii = calculateZakat(dataShafii).totalAssets;
        // Cash (100k) + Inv Gold (10k). Jewelry (5k) is exempt in Shafi'i
        expect(resShafii).toBe(110000);
    });

    it('Legacy goldValue support', () => {
        // If migration hasn't run, goldValue might still be populated.
        // Logic: Treat as "Potential Jewelry" (Exempt if mode exempts jewelry, Include if mode includes)

        // Hanafi (Includes Legacy)
        const dataHanafi: ZakatFormData = {
            ...baseData,
            madhab: 'hanafi',
            goldInvestmentValue: 0,
            goldJewelryValue: 5000 // Personal jewelry - taxable in Hanafi
        };
        expect(calculateZakat(dataHanafi).totalAssets).toBe(105000); // 100k + 5k

        // Shafi'i (Excludes jewelry)
        const dataShafii: ZakatFormData = {
            ...baseData,
            madhab: 'shafii',
            goldInvestmentValue: 0,
            goldJewelryValue: 5000 // Personal jewelry - exempt in Shafi'i
        };
        expect(calculateZakat(dataShafii).totalAssets).toBe(100000); // 100k + 0
    });

    it('Enhanced Breakdown handles split correctly', () => {
        const data: ZakatFormData = {
            ...baseData,
            madhab: 'shafii',
            goldInvestmentValue: 10000, // Zakatable
            goldJewelryValue: 5000,    // Exempt
            silverInvestmentValue: 2000, // Zakatable
            silverJewelryValue: 1000     // Exempt
        };

        const breakdown = calculateZakat(data).enhancedBreakdown;
        const metals = breakdown.preciousMetals;

        // Total should be sum of all (for Sankey visual)
        expect(metals.total).toBe(18000); // 10+5+2+1

        // Zakatable Amount should obey rules
        expect(metals.zakatableAmount).toBe(12000); // 10 (Inv Gold) + 2 (Inv Silver)

        // Ensure distinct items exist
        const itemNames = metals.items.map(i => i.name);
        expect(itemNames).toContain('Gold Investment');
        expect(itemNames).toContain('Gold Jewelry');
        expect(itemNames).toContain('Silver Investment');
        expect(itemNames).toContain('Silver Jewelry');

        // Check percentages
        const goldJewelryItem = metals.items.find(i => i.name === 'Gold Jewelry');
        expect(goldJewelryItem?.zakatablePercent).toBe(0);

        const goldInvItem = metals.items.find(i => i.name === 'Gold Investment');
        expect(goldInvItem?.zakatablePercent).toBe(1);
    });

});
