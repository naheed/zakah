
import { describe, it, expect } from 'vitest';
import {
    calculateZakat,
    calculateNisab,
    calculateTotalAssets,
    calculateTotalLiabilities,
    GOLD_NISAB_GRAMS,
    SILVER_NISAB_GRAMS,
    defaultFormData,
    ZakatFormData
} from '../zakatCalculations';

// Mock data helper
const createEmptyForm = (): ZakatFormData => ({
    ...defaultFormData
});

describe('Zakat Calculations', () => {
    describe('calculateNisab', () => {
        it('should return the lower value between gold and silver thresholds for default check', () => {
            // Nisab calculations actually depend on the standard chosen (gold/silver)
            const silverPrice = 0.80;
            const goldPrice = 65;

            // Default is silver standard
            const silverNisab = (SILVER_NISAB_GRAMS / 31.1035) * silverPrice;
            expect(calculateNisab(silverPrice, goldPrice, 'silver')).toBeCloseTo(silverNisab);
        });

        it('should correctly calculate gold nisab when specified', () => {
            const silverPrice = 0.80;
            const goldPrice = 65;
            const goldNisab = (GOLD_NISAB_GRAMS / 31.1035) * goldPrice;

            expect(calculateNisab(silverPrice, goldPrice, 'gold')).toBeCloseTo(goldNisab);
        });
    });

    describe('calculateTotalAssets', () => {
        it('should sum up simple liquid assets', () => {
            const form = createEmptyForm();
            form.checkingAccounts = 1000;
            form.savingsAccounts = 5000;
            form.cashOnHand = 1000;

            const total = calculateTotalAssets(form);
            expect(total).toBe(7000);
        });

        it('should handle stock calculation modes', () => {
            const form = createEmptyForm();
            form.activeInvestments = 0;
            form.passiveInvestmentsValue = 10000;

            // Conservative: 100% of passive
            form.calculationMode = 'conservative';
            expect(calculateTotalAssets(form)).toBe(10000);

            // Optimized: 30% of passive
            form.calculationMode = 'optimized';
            expect(calculateTotalAssets(form)).toBe(3000);
        });
    });

    describe('calculateZakat', () => {
        it('should return 0 zakat if total wealth is below Nisab', () => {
            // Nisab (silver) ~ 595g / 31.1 * $25.00  = approx $478
            const silverPrice = 25.00;
            const goldPrice = 2500;

            const form = createEmptyForm();
            form.checkingAccounts = 50; // Below 478

            const result = calculateZakat(form, silverPrice, goldPrice);
            expect(result.zakatDue).toBe(0);
            expect(result.isAboveNisab).toBe(false);
        });

        it('should return 2.5% zakat if total wealth is above Nisab', () => {
            const silverPrice = 0.80;
            const goldPrice = 65;

            const form = createEmptyForm();
            form.checkingAccounts = 20000; // Well above nisab

            const result = calculateZakat(form, silverPrice, goldPrice);
            expect(result.zakatDue).toBe(20000 * 0.025);
            expect(result.isAboveNisab).toBe(true);
        });

        it('should deduct immediate liabilities', () => {
            const form = createEmptyForm();
            form.checkingAccounts = 20000;
            form.creditCardBalance = 5000; // Deductible
            form.unpaidBills = 1000; // Deductible

            // Net = 14000. Zakat = 14000 * 0.025 = 350
            const result = calculateZakat(form);
            expect(result.netZakatableWealth).toBe(14000);
            expect(result.zakatDue).toBe(350);
        });

        it('should deduct only 12 months of mortgage payments, not the principal', () => {
            const form = createEmptyForm();
            form.checkingAccounts = 100000;
            form.monthlyMortgage = 2000;

            // Deductible = 2000 * 12 = 24000
            // Net = 76000
            const result = calculateZakat(form);
            expect(result.totalLiabilities).toBe(24000);
            expect(result.netZakatableWealth).toBe(76000);
        });
    });
});
