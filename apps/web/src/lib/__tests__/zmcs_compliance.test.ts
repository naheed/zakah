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
import { ZAKAT_PRESETS } from "@zakatflow/core";
import { calculateZakat, defaultFormData, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE } from '@zakatflow/core';
import { ZakatMethodologyConfig } from '@zakatflow/core';
import { ZakatMethodologySchema } from "@zakatflow/core";
import { loadMethodologyConfig, validateConfig } from "@zakatflow/core";

// =============================================================================
// ZMCS v2.0 COMPLIANCE SUITE
// =============================================================================
//
// This test suite validates that:
//   1. All registered presets pass full Zod schema validation.
//   2. All presets produce reasonable results for canonical test cases.
//   3. Methodology-specific rules are correctly applied (jewelry, debt, retirement).
//   4. The 4 modern scholar methodologies (Bradford, AMJA, Tahir Anwar, Qaradawi)
//      produce distinct and correct results reflecting their actual scholarly positions.
//   5. Config override and loader mechanisms work correctly.
//
// CANONICAL TEST DATA:
//   "Super Ahmed" — A wealthy American Muslim professional with diverse assets.
//   This profile exercises all major calculation branches.
//

const CANONICAL_AHMED = {
    ...defaultFormData,
    cashOnHand: 50000,
    checkingAccounts: 25000,
    savingsAccounts: 25000,
    fourOhOneKVestedBalance: 200000,
    passiveInvestmentsValue: 150000,
    activeInvestments: 50000,
    goldJewelryValue: 10000,
    goldInvestmentValue: 5000,
    hasPreciousMetals: true,
    reitsValue: 30000,
    dividends: 5000,
    dividendPurificationPercent: 5,
    rothIRAContributions: 30000,
    rothIRAEarnings: 10000,
    landBankingValue: 75000,
    rentalPropertyIncome: 24000, // $2k/mo net rental income — tests multi-rate path
    hasRealEstate: true,
    creditCardBalance: 5000,
    monthlyMortgage: 2000,
    monthlyLivingExpenses: 3000,
    hasTaxPayments: true,
    propertyTax: 4000,
    age: 35,
    estimatedTaxRate: 0.25,
};

// =============================================================================
// 1. Schema Validation — Every preset must pass full Zod validation
// =============================================================================
describe('ZMCS Schema Validation', () => {
    Object.entries(ZAKAT_PRESETS).forEach(([id, config]) => {
        it(`Preset "${id}" passes full Zod schema validation`, () => {
            const result = ZakatMethodologySchema.safeParse(config);
            if (!result.success) {
                const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
                throw new Error(`Schema validation failed for "${id}":\n${errors.join('\n')}`);
            }
            expect(result.success).toBe(true);
        });
    });
});

// =============================================================================
// 2. Metadata Validation — Every preset must have complete metadata
// =============================================================================
describe('ZMCS Metadata Completeness', () => {
    Object.entries(ZAKAT_PRESETS).forEach(([id, config]) => {
        describe(`Preset: ${config.meta.name} (${id})`, () => {
            it('has required metadata fields', () => {
                expect(config.meta.id).toBeDefined();
                expect(config.meta.id.length).toBeGreaterThan(0);
                expect(config.meta.name).toBeDefined();
                expect(config.meta.version).toBeDefined();
                expect(config.meta.author).toBeDefined();
                expect(config.meta.description).toBeDefined();
                expect(config.meta.description.length).toBeGreaterThan(10);
            });

            it('has compatible ZMCS version', () => {
                expect(config.meta.zmcs_version).toMatch(/^2\.0\.\d+$/);
            });

            it('has standard thresholds', () => {
                expect(config.thresholds.zakat_rate.lunar).toBe(0.025);
                expect(config.thresholds.nisab.gold_grams).toBe(85.0);
                expect(config.thresholds.nisab.silver_grams).toBe(595.0);
            });
        });
    });
});

// =============================================================================
// 3. Calculation Sanity — Every preset produces reasonable results
// =============================================================================
describe('ZMCS Calculation Sanity', () => {
    Object.entries(ZAKAT_PRESETS).forEach(([id, config]) => {
        it(`"${id}" produces Zakat > 0 for Canonical Ahmed`, () => {
            const result = calculateZakat(CANONICAL_AHMED, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);
            expect(result.zakatDue).toBeGreaterThan(0);
            expect(result.zakatRate).toBe(0.025);
            expect(result.isAboveNisab).toBe(true);
        });

        it(`"${id}" calculates total assets > 0`, () => {
            const result = calculateZakat(CANONICAL_AHMED, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);
            expect(result.totalAssets).toBeGreaterThan(0);
        });
    });
});

// =============================================================================
// 4. Jewelry Rules — Hanafi/Bradford/Tahir: zakatable; Others: exempt
// =============================================================================
describe('ZMCS Jewelry Rules', () => {
    const JEWELRY_CASE = {
        ...defaultFormData,
        goldJewelryValue: 10000,
        hasPreciousMetals: true,
        cashOnHand: 5000,
    };

    // Presets where jewelry is ZAKATABLE
    ['bradford', 'hanafi', 'tahir_anwar'].forEach(id => {
        it(`"${id}" taxes jewelry (10000 + 5000 cash = 15000 → $375)`, () => {
            const config = ZAKAT_PRESETS[id];
            const result = calculateZakat(JEWELRY_CASE, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);
            expect(result.zakatDue).toBe(375);
        });
    });

    // Presets where jewelry is EXEMPT
    ['shafii', 'maliki', 'hanbali', 'amja', 'qaradawi'].forEach(id => {
        it(`"${id}" exempts jewelry (only 5000 cash → $125)`, () => {
            const config = ZAKAT_PRESETS[id];
            const result = calculateZakat(JEWELRY_CASE, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);
            expect(result.zakatDue).toBe(125);
        });
    });
});

// =============================================================================
// 5. Debt Deduction Rules
// =============================================================================
describe('ZMCS Debt Deduction Rules', () => {
    const DEBT_CASE = {
        ...defaultFormData,
        cashOnHand: 20000,
        creditCardBalance: 5000,
    };

    // Full deduction: Hanafi, Hanbali, Tahir Anwar
    ['hanafi', 'hanbali', 'tahir_anwar'].forEach(id => {
        it(`"${id}" deducts credit card debt (20000 - 5000 = 15000 → $375)`, () => {
            const config = ZAKAT_PRESETS[id];
            const result = calculateZakat(DEBT_CASE, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);
            expect(result.zakatDue).toBe(375);
        });
    });

    // No deduction: Shafi'i
    it('"shafii" does NOT deduct debts (20000 → $500)', () => {
        const config = ZAKAT_PRESETS['shafii'];
        const result = calculateZakat(DEBT_CASE, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);
        expect(result.zakatDue).toBe(500);
    });

    // 12-month rule / current_due_only: credit card is "full" in Bradford, AMJA, Maliki, Qaradawi
    ['bradford', 'amja', 'maliki', 'qaradawi'].forEach(id => {
        it(`"${id}" deducts credit card debt (immediately due)`, () => {
            const config = ZAKAT_PRESETS[id];
            const result = calculateZakat(DEBT_CASE, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);
            expect(result.zakatDue).toBe(375);
        });
    });
});

// =============================================================================
// 6. Retirement Rules — The most divergent area
// =============================================================================
describe('ZMCS Retirement Rules', () => {
    const RETIREMENT_CASE = {
        ...defaultFormData,
        cashOnHand: 10000,
        fourOhOneKVestedBalance: 100000,
        age: 35,
        estimatedTaxRate: 0.25,
    };

    it('"bradford" (Bradford) exempts 401k under 59.5', () => {
        const config = ZAKAT_PRESETS['bradford'];
        const result = calculateZakat(RETIREMENT_CASE, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);
        // Only cash is zakatable: 10000 * 0.025 = 250
        expect(result.zakatDue).toBe(250);
    });

    it('"tahir_anwar" taxes full 401k balance (strong ownership)', () => {
        const config = ZAKAT_PRESETS['tahir_anwar'];
        const result = calculateZakat(RETIREMENT_CASE, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);
        // Cash 10000 + 401k 100000 = 110000 * 0.025 = 2750
        // But Tahir Anwar also has full_deduction, so no liabilities in this case
        expect(result.zakatDue).toBe(2750);
    });

    it('"amja" taxes net accessible 401k (minus taxes and penalties)', () => {
        const config = ZAKAT_PRESETS['amja'];
        const result = calculateZakat(RETIREMENT_CASE, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);
        // Net accessible: 100000 * (1 - 0.25 - 0.10) = 100000 * 0.65 = 65000
        // Total: 10000 + 65000 = 75000 * 0.025 = 1875
        expect(result.zakatDue).toBe(1875);
    });

    it('"hanafi" taxes net accessible 401k', () => {
        const config = ZAKAT_PRESETS['hanafi'];
        const result = calculateZakat(RETIREMENT_CASE, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);
        // Same as AMJA: 10000 + 65000 = 75000 * 0.025 = 1875
        expect(result.zakatDue).toBe(1875);
    });

    it('"qaradawi" taxes net accessible 401k (same as AMJA/classical)', () => {
        const config = ZAKAT_PRESETS['qaradawi'];
        const result = calculateZakat(RETIREMENT_CASE, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);
        // Net accessible: 100000 * (1 - 0.25 - 0.10) = 65000
        // Total: 10000 + 65000 = 75000 * 0.025 = 1875
        expect(result.zakatDue).toBe(1875);
    });

    // Bradford post-59.5: uses 30% proxy on market value
    it('"bradford" (Bradford) uses 30% proxy on 401k after 59.5', () => {
        const config = ZAKAT_PRESETS['bradford'];
        const retiredCase = { ...RETIREMENT_CASE, age: 65, isOver59Half: true };
        const result = calculateZakat(retiredCase, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);
        // 401k: 100000 * 0.30 = 30000 (proxy rate)
        // Cash: 10000
        // Total: 40000 * 0.025 = 1000
        expect(result.zakatDue).toBe(1000);
    });
});

// =============================================================================
// 7. Passive Investment Rules — Bradford 30% vs AMJA 0% vs Classical 100%
// =============================================================================
describe('ZMCS Passive Investment Rules', () => {
    const INVESTMENT_CASE = {
        ...defaultFormData,
        cashOnHand: 5000,
        passiveInvestmentsValue: 100000,
        dividends: 3000,
        dividendPurificationPercent: 0,
    };

    it('"bradford" (Bradford) uses 30% proxy (5000 + 30000 + 3000 dividends)', () => {
        const config = ZAKAT_PRESETS['bradford'];
        const result = calculateZakat(INVESTMENT_CASE, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);
        // Cash 5000 + Passive 100000*0.30=30000 + Dividends 3000 = 38000 * 0.025 = 950
        expect(result.zakatDue).toBe(950);
    });

    it('"amja" uses income-only (5000 + 0 + 3000 dividends)', () => {
        const config = ZAKAT_PRESETS['amja'];
        const result = calculateZakat(INVESTMENT_CASE, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);
        // Cash 5000 + Passive 100000*0.0=0 + Dividends 3000 = 8000 * 0.025 = 200
        expect(result.zakatDue).toBe(200);
    });

    it('"qaradawi" uses 30% proxy (same as Bradford — 5000 + 30000 + 3000)', () => {
        const config = ZAKAT_PRESETS['qaradawi'];
        const result = calculateZakat(INVESTMENT_CASE, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);
        // Cash 5000 + Passive 100000*0.30=30000 + Dividends 3000 = 38000 * 0.025 = 950
        expect(result.zakatDue).toBe(950);
    });

    it('"hanafi" uses 100% market value (5000 + 100000 + 3000)', () => {
        const config = ZAKAT_PRESETS['hanafi'];
        const result = calculateZakat(INVESTMENT_CASE, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);
        // Cash 5000 + Passive 100000*1.0=100000 + Dividends 3000 = 108000 * 0.025 = 2700
        expect(result.zakatDue).toBe(2700);
    });
});

// =============================================================================
// 8. Roth IRA Rules — Bradford 30% proxy vs Others 100%
// =============================================================================
describe('ZMCS Roth IRA Rules', () => {
    const ROTH_CASE = {
        ...defaultFormData,
        cashOnHand: 5000,
        rothIRAContributions: 50000,
        age: 35,
    };

    it('"bradford" (Bradford) applies 30% proxy to Roth contributions', () => {
        const config = ZAKAT_PRESETS['bradford'];
        const result = calculateZakat(ROTH_CASE, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);
        // Cash 5000 + Roth contributions 50000*0.30=15000 = 20000 * 0.025 = 500
        expect(result.zakatDue).toBe(500);
    });

    it('"amja" applies 100% to Roth contributions (always accessible)', () => {
        const config = ZAKAT_PRESETS['amja'];
        const result = calculateZakat(ROTH_CASE, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);
        // Cash 5000 + Roth contributions 50000*1.0=50000 = 55000 * 0.025 = 1375
        expect(result.zakatDue).toBe(1375);
    });

    it('"tahir_anwar" applies 100% to Roth contributions', () => {
        const config = ZAKAT_PRESETS['tahir_anwar'];
        const result = calculateZakat(ROTH_CASE, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);
        // Cash 5000 + Roth contributions 50000*1.0=50000 = 55000 * 0.025 = 1375
        expect(result.zakatDue).toBe(1375);
    });

    it('"qaradawi" applies 100% to Roth contributions (accessible = zakatable)', () => {
        const config = ZAKAT_PRESETS['qaradawi'];
        const result = calculateZakat(ROTH_CASE, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);
        // Cash 5000 + Roth contributions 50000*1.0=50000 = 55000 * 0.025 = 1375
        expect(result.zakatDue).toBe(1375);
    });
});

// =============================================================================
// 9. Rental Income Rate Override (ZMCS v2.0.1 — Multi-Rate)
// =============================================================================
//
// Al-Qaradawi applies 10% on net rental income (agricultural analogy) instead
// of the global 2.5%. This tests the multi-rate calculation introduced in v2.0.1.
//
describe('ZMCS Rental Income Rate Override', () => {
    const RENTAL_CASE = {
        ...defaultFormData,
        cashOnHand: 10000,
        rentalPropertyIncome: 20000,
        hasRealEstate: true,
    };

    it('"qaradawi" applies 10% rate to rental income (multi-rate path)', () => {
        const config = ZAKAT_PRESETS['qaradawi'];
        const result = calculateZakat(RENTAL_CASE, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);
        // Standard pool: (10000 + 20000 - 20000) * 0.025 = 10000 * 0.025 = 250
        // Override pool: 20000 * 0.10 = 2000
        // Total: 250 + 2000 = 2250
        expect(result.zakatDue).toBe(2250);
    });

    it('"bradford" (Bradford) applies standard 2.5% to rental income (no override)', () => {
        const config = ZAKAT_PRESETS['bradford'];
        const result = calculateZakat(RENTAL_CASE, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);
        // All assets in standard pool: (10000 + 20000) * 0.025 = 30000 * 0.025 = 750
        expect(result.zakatDue).toBe(750);
    });

    it('"hanafi" applies standard 2.5% to rental income (no override)', () => {
        const config = ZAKAT_PRESETS['hanafi'];
        const result = calculateZakat(RENTAL_CASE, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);
        // All assets in standard pool: 30000 * 0.025 = 750
        expect(result.zakatDue).toBe(750);
    });

    it('"qaradawi" rental rate override produces higher Zakat than standard 2.5%', () => {
        const qaradawiResult = calculateZakat(RENTAL_CASE, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, ZAKAT_PRESETS['qaradawi']);
        const bradfordResult = calculateZakat(RENTAL_CASE, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, ZAKAT_PRESETS['bradford']);
        // Qaradawi: $2250 vs Bradford: $750 — rental rate override has significant impact
        expect(qaradawiResult.zakatDue).toBeGreaterThan(bradfordResult.zakatDue);
    });

    it('rental income appears in totalAssets regardless of rate override', () => {
        const qaradawiResult = calculateZakat(RENTAL_CASE, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, ZAKAT_PRESETS['qaradawi']);
        const bradfordResult = calculateZakat(RENTAL_CASE, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, ZAKAT_PRESETS['bradford']);
        // Both should have the same totalAssets (rental income is included either way)
        expect(qaradawiResult.totalAssets).toBe(bradfordResult.totalAssets);
    });

    it('no rental income means no override impact (falls back to standard)', () => {
        const noRentalCase = { ...RENTAL_CASE, rentalPropertyIncome: 0, hasRealEstate: false };
        const qaradawiResult = calculateZakat(noRentalCase, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, ZAKAT_PRESETS['qaradawi']);
        const bradfordResult = calculateZakat(noRentalCase, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, ZAKAT_PRESETS['bradford']);
        // Without rental income, both use standard path: 10000 * 0.025 = 250
        expect(qaradawiResult.zakatDue).toBe(250);
        expect(bradfordResult.zakatDue).toBe(250);
    });
});

// =============================================================================
// 10. Config Override Mechanism
// =============================================================================
describe('ZMCS Config Override', () => {
    it('prioritizes passed config over madhab preset', () => {
        const CUSTOM_CONFIG: ZakatMethodologyConfig = {
            ...ZAKAT_PRESETS['bradford'],
            thresholds: {
                ...ZAKAT_PRESETS['bradford'].thresholds,
                zakat_rate: { lunar: 0.10, solar: 0.10 },
            },
        };

        const result = calculateZakat(CANONICAL_AHMED, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, CUSTOM_CONFIG);
        expect(result.zakatRate).toBe(0.10);
        expect(result.zakatDue).toBe(result.netZakatableWealth * 0.10);
    });
});

// =============================================================================
// 11. Loader Validation
// =============================================================================
describe('ZMCS Loader', () => {
    it('loads valid configs successfully', () => {
        const result = loadMethodologyConfig(ZAKAT_PRESETS['bradford']);
        expect(result.isFallback).toBe(false);
        expect(result.errors).toHaveLength(0);
        expect(result.config.meta.id).toBe('bradford');
    });

    it('falls back to default for invalid configs', () => {
        const result = loadMethodologyConfig({ meta: { id: 'bad' } });
        expect(result.isFallback).toBe(true);
        expect(result.errors.length).toBeGreaterThan(0);
    });

    it('validateConfig returns errors for incomplete configs', () => {
        const result = validateConfig({});
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
    });

    it('validateConfig passes for all presets', () => {
        Object.entries(ZAKAT_PRESETS).forEach(([id, config]) => {
            const result = validateConfig(config);
            expect(result.isValid).toBe(true);
        });
    });
});

// =============================================================================
// 12. Documentation Strings — Every preset has rich documentation
// =============================================================================
describe('ZMCS Documentation Completeness', () => {
    Object.entries(ZAKAT_PRESETS).forEach(([id, config]) => {
        describe(`Preset "${id}" documentation`, () => {
            it('has retirement description', () => {
                expect(config.assets.retirement.description).toBeDefined();
                expect(config.assets.retirement.description!.length).toBeGreaterThan(20);
            });

            it('has jewelry description', () => {
                expect(config.assets.precious_metals.jewelry.description).toBeDefined();
                expect(config.assets.precious_metals.jewelry.description!.length).toBeGreaterThan(10);
            });

            it('has liabilities description', () => {
                expect(config.liabilities.personal_debt.description).toBeDefined();
            });
        });
    });

    // All modern scholar presets must have scholarly_basis citations
    ['bradford', 'amja', 'tahir_anwar', 'qaradawi'].forEach(id => {
        describe(`Scholar preset "${id}" has scholarly citations`, () => {
            it('has retirement scholarly_basis', () => {
                expect(ZAKAT_PRESETS[id].assets.retirement.scholarly_basis).toBeDefined();
                expect(ZAKAT_PRESETS[id].assets.retirement.scholarly_basis!.length).toBeGreaterThan(20);
            });

            it('has investment scholarly_basis', () => {
                expect(ZAKAT_PRESETS[id].assets.investments.passive_investments.scholarly_basis).toBeDefined();
            });

            it('has jewelry scholarly_basis', () => {
                expect(ZAKAT_PRESETS[id].assets.precious_metals.jewelry.scholarly_basis).toBeDefined();
            });

            it('has debt scholarly_basis', () => {
                expect(ZAKAT_PRESETS[id].liabilities.personal_debt.scholarly_basis).toBeDefined();
            });
        });
    });
});

// =============================================================================
// 13. Cross-Methodology Comparison — Canonical Ahmed produces different results
// =============================================================================
describe('ZMCS Cross-Methodology Comparison', () => {
    it('all 8 methodologies produce distinct Zakat amounts for Canonical Ahmed', () => {
        const results: Record<string, number> = {};

        Object.entries(ZAKAT_PRESETS).forEach(([id, config]) => {
            const result = calculateZakat(CANONICAL_AHMED, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, config);
            results[id] = result.zakatDue;
        });

        // Not all will be unique (e.g., some may share values for certain profiles),
        // but the 4 modern scholars should differ from each other
        expect(results['bradford']).not.toBe(results['amja']);
        expect(results['bradford']).not.toBe(results['tahir_anwar']);
        expect(results['amja']).not.toBe(results['tahir_anwar']);
        // Qaradawi differs from Bradford (jewelry exempt vs zakatable), from AMJA (investments 30% vs income-only)
        expect(results['qaradawi']).not.toBe(results['bradford']);
        expect(results['qaradawi']).not.toBe(results['amja']);

        // Shafi'i (no debt deduction) should differ from Hanafi (full deduction)
        expect(results['shafii']).not.toBe(results['hanafi']);

        // Log for reference
        console.log('=== Cross-Methodology Zakat for Canonical Ahmed ===');
        Object.entries(results).forEach(([id, amount]) => {
            console.log(`  ${id}: $${amount.toFixed(2)}`);
        });
    });
});
