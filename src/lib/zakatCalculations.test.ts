
import { describe, it, expect } from 'vitest';
import {
    calculateZakat,
    calculateTotalAssets,
    calculateTotalLiabilities,
    defaultFormData,
    ZakatFormData,
    SOLAR_ZAKAT_RATE,
    ZAKAT_RATE
} from './zakatCalculations';

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
            // Silver Nisab is approx $475 (595g * $0.80/g) - strictly strictly speaking depends on price
            // Let's assume price is passed or default. 
            // Default Silver Price = $24.50/oz ~ $0.79/g. Nisab ~ $470.
            const data: ZakatFormData = { ...defaultFormData, cashOnHand: 100 }; // Clearly below
            const result = calculateZakat(data);
            expect(result.isAboveNisab).toBe(false);
            expect(result.zakatDue).toBe(0);
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
            const data = { ...retirementData, calculationMode: 'bradford' as const };
            const assets = calculateTotalAssets(data);
            expect(assets).toBe(0); // Fully exempt due to lack of accessibility
        });

        it('Hanafi Mode: Should apply full value', () => {
            const data = { ...retirementData, calculationMode: 'hanafi' as const };
            const assets = calculateTotalAssets(data);
            expect(assets).toBe(100000);
        });
    });

    describe('3. Investments (30% Rule)', () => {
        const investData: ZakatFormData = {
            ...defaultFormData,
            passiveInvestmentsValue: 100000
        };

        it('Bradford Mode: 100% Zakatable', () => {
            const data = { ...investData, calculationMode: 'bradford' as const };
            const assets = calculateTotalAssets(data);
            expect(assets).toBe(100000);
        });

        it('Hanafi Mode: 30% Zakatable (Proxy for underlying assets)', () => {
            const data = { ...investData, calculationMode: 'hanafi' as const };
            const assets = calculateTotalAssets(data);
            expect(assets).toBe(30000);
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

        it('should deduct 1 month of living expenses and 12 months of mortgage', () => {
            const liabilities = calculateTotalLiabilities(liabData);
            // 2000 (living) + 1000 (CC) + (3000 * 12) (Mortgage)
            // 2000 + 1000 + 36000 = 39000
            expect(liabilities).toBe(39000);
        });
    });
});
