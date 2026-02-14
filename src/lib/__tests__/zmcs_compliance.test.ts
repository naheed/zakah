
import { describe, it, expect } from 'vitest';
import { ZAKAT_PRESETS } from '../config/presets';
import { calculateZakat, defaultFormData, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE } from '../zakatCalculations';
import { ZakatMethodologyConfig } from '../config/types';

/**
 * ZMCS COMPLIANCE SUITE
 * 
 * This test suite ensures that all registered methodology configurations:
 * 1. Are valid and loadable.
 * 2. Produce expected results for a canonical test case ("Super Ahmed").
 * 3. Correctly override default behaviors when applied.
 */

const CANONICAL_AHMED = {
    ...defaultFormData,
    cashOnHand: 100000,
    fourOhOneKVestedBalance: 100000,
    passiveInvestmentsValue: 100000,
    goldJewelryValue: 5000,
    hasPreciousMetals: true,
    age: 30
};

describe('ZMCS Compliance - Methodology Validation', () => {

    Object.entries(ZAKAT_PRESETS).forEach(([id, config]) => {

        describe(`Preset: ${config.meta.name} (${id})`, () => {

            it('Should have valid metadata', () => {
                expect(config.meta.id).toBeDefined();
                expect(config.meta.name).toBeDefined();
                expect(config.meta.version).toBeDefined();
            });

            it('Should calculate reasonable Zakat for Canonical Ahmed', () => {
                // Pass the specific config explicitly to ensure it's used
                const result = calculateZakat(CANONICAL_AHMED, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);

                // Sanity check: Zakat should be > 0 for this wealthy profile
                expect(result.zakatDue).toBeGreaterThan(0);

                // Sanity check: Rate should be standard 2.5% (unless specialized)
                expect(result.zakatRate).toBe(0.025);
            });

            // Specific Rule Checks based on Config
            if (config.assets.jewelry.zakatable) {
                it('Should tax jewelry', () => {
                    const result = calculateZakat({
                        ...defaultFormData,
                        goldJewelryValue: 10000,
                        hasPreciousMetals: true,
                        // Force cash to ensure above nisab
                        cashOnHand: 5000
                    }, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);

                    // 10000 + 5000 = 15000 * 0.025 = 375
                    expect(result.zakatDue).toBe(375);
                });
            } else {
                it('Should EXEMPT jewelry', () => {
                    const result = calculateZakat({
                        ...defaultFormData,
                        goldJewelryValue: 10000,
                        hasPreciousMetals: true,
                        cashOnHand: 5000
                    }, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);

                    // Only cash taxed: 5000 * 0.025 = 125
                    expect(result.zakatDue).toBe(125);
                });
            }

            if (config.liabilities.method === 'deduct_all_debts') {
                it('Should deduct personal debts', () => {
                    const result = calculateZakat({
                        ...defaultFormData,
                        cashOnHand: 20000,
                        creditCardBalance: 5000
                    }, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);

                    // 20000 - 5000 = 15000 -> 375
                    expect(result.zakatDue).toBe(375);
                });
            }

            if (config.liabilities.method === 'no_deduction') {
                it('Should NOT deduct personal debts', () => {
                    const result = calculateZakat({
                        ...defaultFormData,
                        cashOnHand: 20000,
                        creditCardBalance: 5000
                    }, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);

                    // 20000 -> 500
                    expect(result.zakatDue).toBe(500);
                });
            }
        });
    });

    describe('Config Override Mechanism', () => {
        it('Should prioritize passed config over madhab default', () => {
            // Create a custom weird config: 10% Zakat Rate
            const CUSTOM_CONFIG: ZakatMethodologyConfig = {
                ...ZAKAT_PRESETS['balanced'],
                thresholds: {
                    ...ZAKAT_PRESETS['balanced'].thresholds,
                    zakat_rate: { lunar: 0.10, solar: 0.10 } // 10%
                }
            };

            const result = calculateZakat(CANONICAL_AHMED, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, CUSTOM_CONFIG);

            expect(result.zakatRate).toBe(0.10);
            expect(result.zakatDue).toBe(result.netZakatableWealth * 0.10);
        });
    });

});
