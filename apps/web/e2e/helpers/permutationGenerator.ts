/**
 * Permutation Generator for Zakat Calculation Tests
 * 
 * Generates a matrix of scenarios covering:
 * - 5 Madhabs
 * - 4 Asset Mixes (Cash only, +Gold, +Stocks, +Crypto)
 * - 3 Liability States (None, Debt < Assets, Debt > Assets)
 */

export type Madhab = 'bradford' | 'hanafi' | 'shafii' | 'maliki' | 'hanbali' | 'amja' | 'tahir_anwar' | 'qaradawi';

export interface ScenarioAssets {
    cash: number;
    gold: number;
    stock: number;
    crypto: number;
}

export interface ScenarioLiabilities {
    creditCard: number; // Immediate debt
    mortgage: number; // Long-term debt
}

export interface PermutationScenario {
    id: string;
    madhab: Madhab;
    assets: ScenarioAssets;
    liabilities: ScenarioLiabilities;
    expectedZakat: number;
    description: string;
    tags: string[]; // e.g. ['CALC-01', 'CALC-03']
}

// Constants
const MADHABS: Madhab[] = ['bradford', 'hanafi', 'shafii', 'maliki', 'hanbali', 'amja', 'tahir_anwar', 'qaradawi'];
const NISAB_SILVER_EST = 400; // Approx $400-500 usually
const NISAB_GOLD_EST = 6000;  // Approx $6000+

/**
 * Calculates expected Zakat based on simplified rules for the generator.
 * This acts as an "Oracle" for the test. 
 * IMPORTANT: This logic mimics the actual app logic but is simplified for verification.
 */
function calculateExpected(madhab: Madhab, assets: ScenarioAssets, liabilities: ScenarioLiabilities): number {
    let zakatableAssets = 0;

    // 1. Assets
    zakatableAssets += assets.cash;

    // Gold:
    // Confirmed via E2E testing: the app includes gold entered via 'Enter USD Value' 
    // as zakatable across ALL methodologies. The jewelry exemption only applies to
    // items explicitly categorized as jewelry, not the investment gold USD field.
    zakatableAssets += assets.gold;

    // Stocks (passive_investments.rate from ZAKAT_PRESETS):
    // bradford:    0.30 (underlying_assets proxy)
    // qaradawi:    0.30 (underlying_assets proxy)
    // amja:        0.00 (income_only — passive investments NOT zakatable)
    // hanafi:      1.00 (market_value)
    // shafii:      1.00 (market_value)
    // maliki:      1.00 (market_value)
    // hanbali:     1.00 (market_value)
    // tahir_anwar: 1.00 (market_value)
    const stockRates: Record<string, number> = {
        bradford: 0.30,
        qaradawi: 0.30,
        amja: 0.0,
    };
    const stockRate = stockRates[madhab] ?? 1.0;
    zakatableAssets += assets.stock * stockRate;

    // Crypto:
    // All: 100%
    zakatableAssets += assets.crypto;

    // 2. Liabilities (liabilities.method from ZAKAT_PRESETS):
    // no_deduction:   shafii
    // full_deduction:  hanafi, hanbali, tahir_anwar
    // 12_month_rule:  bradford, maliki, qaradawi
    // current_due_only: amja
    let deductibleLiabilities = 0;

    // For our E2E tests, we ONLY input credit card balance (immediate debt).
    // So the relevant distinction is: does this methodology deduct immediate debts?
    // - no_deduction (shafii): NO
    // - all others: YES (credit card is immediate/current debt)
    if (madhab === 'shafii') {
        deductibleLiabilities = 0;
    } else {
        // full_deduction, 12_month_rule, current_due_only all deduct credit card
        deductibleLiabilities = liabilities.creditCard;
    }

    const net = Math.max(0, zakatableAssets - deductibleLiabilities);

    // Nisab check (Silver standard approx $400)
    // If net > nisab, 2.5%
    if (net < NISAB_SILVER_EST) return 0;

    return net * 0.025;
}

export function generateScenarios(): PermutationScenario[] {
    const scenarios: PermutationScenario[] = [];

    // Dimensions
    const assetMixes = [
        { name: 'Cash', assets: { cash: 10000, gold: 0, stock: 0, crypto: 0 } },
        { name: 'Cash+Gold', assets: { cash: 5000, gold: 5000, stock: 0, crypto: 0 } }, // Gold impact depends on Madhab
        { name: 'Cash+Stock', assets: { cash: 5000, gold: 0, stock: 10000, crypto: 0 } }, // Stock impact (30% vs 100%)
        { name: 'CryptoHigh', assets: { cash: 0, gold: 0, stock: 0, crypto: 20000 } }, // All same
    ];

    const liabilityMixes = [
        { name: 'None', liabilities: { creditCard: 0, mortgage: 0 } },
        { name: 'LowDebt', liabilities: { creditCard: 2000, mortgage: 0 } },
        { name: 'HighDebt', liabilities: { creditCard: 15000, mortgage: 0 } }, // Can wipe out assets
    ];

    let idCounter = 1;

    for (const madhab of MADHABS) {
        for (const assetMix of assetMixes) {
            for (const liabilityMix of liabilityMixes) {

                // Skip redundant "None" debt checks if we want to save time? 
                // No, fast enough.

                const expected = calculateExpected(madhab, assetMix.assets, liabilityMix.liabilities);

                scenarios.push({
                    id: `GEN-${idCounter++}`,
                    madhab,
                    assets: assetMix.assets,
                    liabilities: liabilityMix.liabilities,
                    expectedZakat: expected,
                    description: `${madhab} | ${assetMix.name} | Debt: ${liabilityMix.name}`,
                    tags: ['MATRIX']
                });
            }
        }
    }

    return scenarios;
}
