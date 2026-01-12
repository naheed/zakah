
import { describe, it, expect } from 'vitest';
import { calculateZakat, defaultFormData, getCalculationModeForMadhab } from '../zakatCalculations';
import { ZakatFormData } from '../zakatTypes';

// Super Ahmed Benchmark Data
const ahmedBase: ZakatFormData = {
    ...defaultFormData,
    // Assets
    cashOnHand: 10000,
    goldValue: 5000, // Personal Jewelry
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

    it('Scenario A: Bradford (Balanced) Mode', () => {
        // Expectation:
        // Jewelry: Exempt ($0)
        // 401k: Exempt (< 59.5) ($0)
        // Stocks: 30% rule ($15,000)
        // Total Assets: 10k(cash) + 15k(stocks) = 25,000
        // Liabilities: 2k(CC) + 24k(mortgage) + 1k(living) = 27,000
        // Net: 0

        const data: ZakatFormData = {
            ...ahmedBase,
            calculationMode: 'bradford',
            madhab: 'balanced'
        };
        const result = calculateZakat(data);

        expect(result.enhancedBreakdown.preciousMetals.zakatableAmount).toBe(0);
        expect(result.enhancedBreakdown.retirement.zakatableAmount).toBe(0);
        expect(result.enhancedBreakdown.investments.zakatableAmount).toBe(15000);

        expect(result.totalAssets).toBe(25000);
        expect(result.totalLiabilities).toBe(27000);
        expect(result.netZakatableWealth).toBe(0);
    });

    it('Scenario B: Hanafi Mode', () => {
        // Expectation:
        // Jewelry: Zakatable ($5,000)
        // 401k: Net Accessible. 
        //   Tax (25%) + Penalty (10%) = 35% deduction.
        //   $100k * 0.65 = $65,000.
        // Stocks: 100% Market Value ($50,000) - Hanafi strict usually 100% or based on inventory
        // Total Assets: 10k(cash) + 5k(jewelry) + 65k(401k) + 50k(stocks) = 130,000
        // Liabilities: 
        //   Current System Cap: 12 months ($24k) + Immediate ($3k) = $27k.
        //   (Note: Ideally Hanafi subtracts FULL mortgage, but we lack that data field)
        // Net: 130,000 - 27,000 = 103,000.

        const data: ZakatFormData = {
            ...ahmedBase,
            calculationMode: 'hanafi',
            madhab: 'hanafi'
        };
        const result = calculateZakat(data);

        expect(result.enhancedBreakdown.preciousMetals.zakatableAmount).toBe(5000);
        expect(result.enhancedBreakdown.retirement.zakatableAmount).toBe(65000);
        expect(result.enhancedBreakdown.investments.zakatableAmount).toBe(50000);

        expect(result.totalAssets).toBe(130000);
        expect(result.netZakatableWealth).toBe(103000);
    });

    it('Scenario C: Shafi\'i/Maliki Mode', () => {
        // Expectation:
        // Jewelry: Exempt ($0)
        // 401k: Net Accessible ($65,000)
        // Stocks: 100% ($50,000)
        // Total Assets: 10k + 65k + 50k = 125,000
        // Liabilities: 12 months ($27,000)
        // Net: 98,000

        const data: ZakatFormData = {
            ...ahmedBase,
            calculationMode: 'maliki-shafii',
            madhab: 'shafii' // Consolidated: Shafi'i/Maliki/Hanbali
        };
        const result = calculateZakat(data);

        expect(result.enhancedBreakdown.preciousMetals.zakatableAmount).toBe(0);
        expect(result.enhancedBreakdown.retirement.zakatableAmount).toBe(65000);
        expect(result.enhancedBreakdown.investments.zakatableAmount).toBe(50000);

        expect(result.totalAssets).toBe(125000);
        expect(result.netZakatableWealth).toBe(98000);
    });

});

describe('Madhab to Calculation Mode Mapping', () => {
    it('maps correctly', () => {
        expect(getCalculationModeForMadhab('balanced')).toBe('bradford');
        expect(getCalculationModeForMadhab('hanafi')).toBe('hanafi');
        expect(getCalculationModeForMadhab('shafii')).toBe('maliki-shafii');
    });
});
