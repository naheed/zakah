/**
 * Permutation Generator for Zakat Calculation Tests
 * 
 * Generates a matrix of scenarios covering:
 * - 5 Madhabs
 * - 4 Asset Mixes (Cash only, +Gold, +Stocks, +Crypto)
 * - 3 Liability States (None, Debt < Assets, Debt > Assets)
 */

export type Madhab = 'balanced' | 'hanafi' | 'shafii' | 'maliki' | 'hanbali';

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
const MADHABS: Madhab[] = ['balanced', 'hanafi', 'shafii', 'maliki', 'hanbali'];
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
    // Balanced: Exempt if personal jewelry (assuming input effectively treats 'Gold Value' as potentially jewelry context or not).
    // For the purpose of these tests, we assume "Gold Value" input in the wizard is treated as Zakatable Gold unless it's Jewelry.
    // The app logic says: if (jewelryZakatable) include goldValue.
    // Balanced/Shafii/Maliki/Hanbali: Jewelry Exempt. Hanafi: Zakatable.
    // HOWEVER, 'Gold Value' field often implies investment gold if not specified as jewelry.
    // Let's look at `zakatCalculations.ts` logic: 
    // "if (jewelryZakatable) { total += goldValue } else { ... }"
    // "Conservative: if mode exempts jewelry, exclude gold/silver values"
    // So 'Gold Value' is effectively treated as Jewelry for the sake of the 'Conservative' check in the code.
    // Thus:
    const isJewelryZakatable = madhab === 'hanafi';
    if (isJewelryZakatable) {
        zakatableAssets += assets.gold;
    }

    // Stocks:
    // Balanced: 30% of Passive. (We treat `stock` input as Passive in E2E mapper).
    // Others: 100%.
    const stockRate = madhab === 'balanced' ? 0.30 : 1.0;
    zakatableAssets += assets.stock * stockRate;

    // Crypto:
    // All: 100%
    zakatableAssets += assets.crypto;

    // 2. Liabilities
    let deductibleLiabilities = 0;

    // Hanafi/Hanbali: Full deduction (immediate + long term)
    // Maliki/Balanced: 12-month deduction. 
    // Shafii: No deduction.

    // Note: The app logic for 'Balanced' uses '12-month'.

    if (madhab === 'shafii') {
        deductibleLiabilities = 0;
    } else if (madhab === 'hanafi' || madhab === 'hanbali') {
        // Full deduction
        deductibleLiabilities = liabilities.creditCard + liabilities.mortgage; // Mortgage assumed total
    } else {
        // Balanced / Maliki : 12-month rule
        // We need to know monthly payment. For E2E tests, we'll input mortgage as a total but 
        // the test input mapping needs to define if it's monthly or total.
        // In the app, user inputs "Monthly Mortgage". 
        // Our ScenarioLiabilities `mortgage` implies a total debt amount for simplicity in the struct,
        // BUT for the mapping to app inputs, we usually put money in "Monthly Mortgage" field?
        // Wait, `zakatCalculations.ts`: `total += data.monthlyMortgage * 12`.
        // So if we have a debt of $240,000, and 12-months is $24,000.
        // Let's assume our `liabilities.mortgage` number represents the *Deductible Amount* 
        // or we handle the calculation here.

        // Let's refine: `liabilities.mortgage` in this helper will represent "Monthly Payment" x 12 for Balanced/Maliki,
        // and "Total Balance" for Hanafi.
        // This gets complex. Let's simplify:
        // We will only test Immediate Debt (Credit Card) to avoid the Mortgage complexity in the generated matrix for now,
        // Or we standardize: `liabilities.mortgage` = The total outstanding.
        // And we assert the app inputs Monthly = Total / 20 (assuming 20 yr term)?? No to complex.

        // Decision: For automated matrix, use Credit Card (Immediate Debt) only.
        // It distinguishes Shafii (0) vs Others (100%).
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
