// =============================================================================
// Fiqh Explanations — User-Facing Scholarly Content
// =============================================================================
//
// This module centralizes all inline fiqh explanations displayed via WhyTooltip
// throughout the calculator. Content is separated from the visualization layer
// (WhyTooltip.tsx) to maintain a clean content/component boundary.
//
// ARCHITECTURE:
//   - `staticExplanations`: Content that is universally true across all
//     ZMCS methodologies (e.g., why cash is zakatable, milk tām definition).
//   - `getFiqhExplanations(config)`: Factory function returning methodology-aware
//     explanations. ~7 entries adapt their title/explanation based on the active
//     ZMCS configuration (liabilities method, passive rate, jewelry ruling, etc.).
//
// CONTENT STANDARDS:
//   - Follow the "Dignified Guide" persona (see docs/CONTENT_STANDARDS.md)
//   - Use "This methodology..." not "We..." for methodology-specific text
//   - Keep explanations ESL-friendly: Subject + Verb + Object
//   - Cite scholarly sources where possible without being academic
//
// ZMCS INTEGRATION:
//   The following config paths trigger text variations:
//   - `config.liabilities.method` → monthlyLiving, mortgageDeduction, deductibleDebts
//   - `config.assets.investments.passive_investments.rate` → thirtyPercentRule
//   - `config.assets.precious_metals.jewelry.zakatable` → jewelryExemption
//   - `config.assets.retirement.zakatability` → retirementAccounts, traditional401k
//   - `config.meta.name` → calculationModes
//

import { ZakatMethodologyConfig } from '@/lib/config/types';

// =============================================================================
// Types
// =============================================================================

/** A single fiqh explanation entry displayed in a WhyTooltip. */
export interface FiqhExplanation {
    title: string;
    explanation: string;
}

/** Complete set of fiqh explanations used across the calculator. */
export interface FiqhExplanations {
    // ── General Legal Principles ──
    milkTam: FiqhExplanation;
    qudrahTasarruf: FiqhExplanation;
    malDimar: FiqhExplanation;
    nama: FiqhExplanation;

    // ── Methodology ──
    calculationModes: FiqhExplanation;
    bradfordExclusion: FiqhExplanation;

    // ── Liquid Assets ──
    checkingAccounts: FiqhExplanation;
    interestEarned: FiqhExplanation;

    // ── Investments ──
    activeInvestments: FiqhExplanation;
    passiveInvestments: FiqhExplanation;
    thirtyPercentRule: FiqhExplanation;

    // ── Retirement ──
    retirementAccounts: FiqhExplanation;
    rothIRA: FiqhExplanation;
    rothContributions: FiqhExplanation;
    rothEarnings: FiqhExplanation;
    traditional401k: FiqhExplanation;
    hsaAccount: FiqhExplanation;

    // ── Precious Metals ──
    goldSilver: FiqhExplanation;
    jewelryExemption: FiqhExplanation;

    // ── Liabilities ──
    deductibleDebts: FiqhExplanation;
    daynMustaghriq: FiqhExplanation;
    monthlyLiving: FiqhExplanation;
    mortgageDeduction: FiqhExplanation;
    studentLoans: FiqhExplanation;

    // ── Crypto ──
    cryptoCurrency: FiqhExplanation;
    cryptoTrading: FiqhExplanation;
    stakedAssets: FiqhExplanation;
    defiLiquidity: FiqhExplanation;

    // ── Trusts ──
    revocableTrust: FiqhExplanation;
    irrevocableTrust: FiqhExplanation;
    clatTrust: FiqhExplanation;

    // ── Nisab & Calendar ──
    silverNisab: FiqhExplanation;
    lunarYear: FiqhExplanation;
}

// =============================================================================
// Static Explanations — Universal across all methodologies
// =============================================================================

const staticExplanations = {
    // ── General Legal Principles ──
    milkTam: {
        title: "Milk Tām (Complete Ownership)",
        explanation: "Full, unrestricted ownership with legal title (raqabah) and ability to dispose (yad). Required for Zakat liability on any asset.",
    },
    qudrahTasarruf: {
        title: "Qudrah 'ala al-Tasarruf",
        explanation: "The legal and practical ability to dispose of wealth freely. Without this capacity, wealth may be exempt from Zakat.",
    },
    malDimar: {
        title: "Māl Ḍimār (Inaccessible Wealth)",
        explanation: "Wealth that is out of hand and may not return—like seized property or contested inheritance. Classical exemption applies.",
    },
    nama: {
        title: "Namā' (Growth Potential)",
        explanation: "Assets must have potential for growth to be zakatable. Personal items like furniture lack namā' and are exempt.",
    },

    // ── Liquid Assets ──
    checkingAccounts: {
        title: "Why is cash zakatable?",
        explanation: "Fiat currency takes the ruling of gold and silver as a store of value. The full closing balance is zakatable.",
    },
    interestEarned: {
        title: "Why purify interest?",
        explanation: "Interest (riba) is impure money that does not belong to you. It must be donated to charity without reward expectation.",
    },

    // ── Investments ──
    activeInvestments: {
        title: "Mudir (Active Trader)",
        explanation: "One who trades frequently with short-term intent. Stocks are commercial merchandise (ʿurūḍ al-tijārah)—100% of market value is zakatable.",
    },
    passiveInvestments: {
        title: "Muḥtakir (Long-Term Investor)",
        explanation: "One who holds for appreciation/dividends. Zakat shifts to the company's zakatable assets—approximately 30% of market value (AAOIFI Standard 35).",
    },

    // ── Retirement (static entries) ──
    rothIRA: {
        title: "Roth IRA Treatment",
        explanation: "Contributions: accessible tax-free anytime, fully zakatable. Earnings: subject to penalty under 59½, exempt until you reach that age.",
    },
    rothContributions: {
        title: "Roth Contributions (Principal)",
        explanation: "Your after-tax contributions can be withdrawn anytime without penalty. This represents complete ownership—fully zakatable regardless of methodology.",
    },
    hsaAccount: {
        title: "Why is HSA zakatable?",
        explanation: "HSA funds are fully yours and accessible for qualified medical expenses at any time. Complete ownership (milk tām) applies.",
    },
    bradfordExclusion: {
        title: "Bradford Exclusion Rule",
        explanation: "Traditional 401(k)/IRA under 59½ lack milk tām and qudrah 'ala al-tasarruf. The 10% penalty plus taxes create a barrier similar to māl ḍimār.",
    },

    // ── Precious Metals ──
    goldSilver: {
        title: "Why melt value only?",
        explanation: "Zakat is due on the metal content only. Gemstones and craftsmanship are not zakatable unless the jewelry is trade inventory.",
    },

    // ── Liabilities (static entries) ──
    daynMustaghriq: {
        title: "Dayn al-Mustaghriq",
        explanation: "Overwhelming debt that consumes all assets. Classical scholars debated whether this eliminates Zakat—the modern synthesis limits deduction to current obligations.",
    },
    studentLoans: {
        title: "Why only current payment?",
        explanation: "Like mortgages, only the installment due now is deductible. Future payments are not yet owed and do not reduce current wealth.",
    },

    // ── Crypto ──
    cryptoCurrency: {
        title: "Why is crypto zakatable?",
        explanation: "Major cryptocurrencies function as currency/store of value, taking the ruling of gold and silver (medium of exchange). Full market value is zakatable.",
    },
    cryptoTrading: {
        title: "Trading vs. holding crypto",
        explanation: "Actively traded tokens are commercial goods (ʿurūḍ al-tijārah). Even NFTs held for flipping are zakatable at full value.",
    },
    stakedAssets: {
        title: "Staking and Zakat",
        explanation: "Your staked principal remains your wealth and is fully zakatable. Locked staking affects accessibility, not ownership.",
    },
    defiLiquidity: {
        title: "DeFi liquidity pools",
        explanation: "LP tokens represent redeemable value. Calculate based on what you could withdraw now, accounting for impermanent loss.",
    },

    // ── Trusts ──
    revocableTrust: {
        title: "Why revocable = zakatable?",
        explanation: "You retain full control (milk tām) and can dissolve the trust anytime. The assets remain yours legally and Islamically.",
    },
    irrevocableTrust: {
        title: "Why control matters?",
        explanation: "Zakat requires milk tām (complete possession). If you irrevocably transferred assets and cannot access principal, you lack this requirement.",
    },
    clatTrust: {
        title: "CLAT treatment",
        explanation: "During the annuity term, the charity owns the income stream (usufruct). The remainder interest is contingent until the term ends.",
    },

    // ── Nisab & Calendar ──
    silverNisab: {
        title: "Why silver standard?",
        explanation: "Silver captures more Muslims in the obligation (anfa' li'l-fuqarā'—most beneficial for the poor). Gold standard is valid for those holding wealth exclusively in gold.",
    },
    lunarYear: {
        title: "Why adjust for solar year?",
        explanation: "The solar year is 11 days longer. Rate is adjusted to 2.577% to prevent shortchanging recipients over a lifetime.",
    },
} as const satisfies Record<string, FiqhExplanation>;

// =============================================================================
// Factory Function — Returns ZMCS-aware explanations
// =============================================================================

/**
 * Returns a complete set of fiqh explanations, with dynamic entries adapted
 * to the active ZMCS methodology configuration.
 *
 * **Dynamic entries and their ZMCS triggers:**
 *
 * | Entry              | Config Path                                        | Variations                              |
 * |--------------------|----------------------------------------------------|-----------------------------------------|
 * | `calculationModes` | `config.meta.name`                                 | Methodology name in title               |
 * | `thirtyPercentRule` | `config.assets.investments.passive_investments.rate`| Actual rate percentage                  |
 * | `retirementAccounts`| `config.assets.retirement.zakatability`            | exempt / conditional / full treatment   |
 * | `rothEarnings`     | `config.assets.retirement.roth_earnings_follow_traditional` | Follows traditional or always zakatable |
 * | `traditional401k`  | `config.assets.retirement.zakatability`            | exempt / net_accessible / full          |
 * | `jewelryExemption` | `config.assets.precious_metals.jewelry.zakatable`  | Zakatable vs exempt                     |
 * | `monthlyLiving`    | `config.liabilities.method`                        | 12-month annualized vs current month    |
 * | `mortgageDeduction`| `config.liabilities.method`                        | 12-month rule vs current due            |
 * | `deductibleDebts`  | `config.liabilities.method`                        | Methodology-specific debt approach      |
 *
 * @example
 * ```ts
 * // 1. Add key to FiqhExplanations interface
 * // 2. For static content, add to staticExplanations object
 * // 3. For dynamic content, add inside getFiqhExplanations return:
 * myNewEntry: {
 *   title: config.someFlag ? "Title A" : "Title B",
 *   explanation: `This methodology uses ${config.someValue}...`,
 * },
 * // 4. Set helpText: "myNewEntry" on the matching ZMCSField in zmcs-docs.ts
 * ```
 */
export function getFiqhExplanations(config: ZakatMethodologyConfig): FiqhExplanations {
    const liabMethod = config.liabilities.method;
    const passiveRate = config.assets.investments.passive_investments.rate;
    const passivePercent = Math.round(passiveRate * 100);
    const jewelryZakatable = config.assets.precious_metals.jewelry.zakatable;
    const retirementMethod = config.assets.retirement.zakatability;
    const methodologyName = config.meta.name;

    return {
        ...staticExplanations,

        // ── Methodology (dynamic) ──
        calculationModes: {
            title: `${methodologyName}`,
            explanation: `This methodology sets passive investments at ${passivePercent}%, ${jewelryZakatable ? 'treats jewelry as zakatable' : 'exempts personal-use jewelry'
                }, and uses the ${liabMethod === '12_month_rule' ? '12-month debt deduction rule'
                    : liabMethod === 'full_deduction' ? 'full debt deduction approach'
                        : liabMethod === 'no_deduction' ? 'no debt deduction approach'
                            : 'current-due-only debt deduction'
                }.`,
        },

        // ── Investments (dynamic) ──
        thirtyPercentRule: {
            title: `The ${passivePercent}% Rule Derivation`,
            explanation: `Research on Shariah-compliant indices shows ~${passivePercent}% of market cap consists of liquid/zakatable assets. This proxy gives an effective rate of ${(passiveRate * 2.5).toFixed(2)}%.`,
        },

        // ── Retirement (dynamic) ──
        retirementAccounts: {
            title: "Retirement Account Approach",
            explanation: retirementMethod === 'conditional_age'
                ? `Traditional 401(k)/IRA under ${config.assets.retirement.exemption_age ?? 59.5} are exempt (lack complete ownership). After that age, the net accessible or proxy rate applies.`
                : retirementMethod === 'exempt'
                    ? "Under this methodology, retirement accounts are fully exempt from Zakat."
                    : retirementMethod === 'full'
                        ? "Under this methodology, 100% of your vested retirement balance is zakatable."
                        : retirementMethod === 'net_accessible'
                            ? "Zakatable at net accessible value: vested balance minus applicable taxes and early withdrawal penalties."
                            : "Retirement accounts are subject to Zakat only when funds are actually withdrawn (deferred approach).",
        },
        rothEarnings: {
            title: "Roth Earnings (Growth)",
            explanation: config.assets.retirement.roth_earnings_follow_traditional
                ? "Investment gains are subject to 10% penalty plus taxes if withdrawn before 59½. Under this methodology, earnings follow the same treatment as traditional retirement accounts."
                : "Investment gains in a Roth IRA are always fully zakatable under this methodology, regardless of age.",
        },
        traditional401k: {
            title: "Traditional 401(k)/403(b)",
            explanation: retirementMethod === 'conditional_age'
                ? `Pre-tax contributions with 10% penalty plus income tax on early withdrawal. Under this methodology, fully exempt below age ${config.assets.retirement.exemption_age ?? 59.5}.`
                : retirementMethod === 'net_accessible'
                    ? "Zakatable at net accessible value (balance minus applicable taxes and penalties)."
                    : retirementMethod === 'full'
                        ? "Under this methodology, 100% of the vested balance is zakatable."
                        : "Under this methodology, retirement accounts are exempt until funds are withdrawn.",
        },

        // ── Precious Metals (dynamic) ──
        jewelryExemption: {
            title: "The jewelry debate",
            explanation: jewelryZakatable
                ? "This methodology treats all gold and silver jewelry as zakatable, following the precautionary (Ahwat) position that gold and silver retain their monetary nature regardless of form."
                : "This methodology exempts personal-use jewelry from Zakat. The majority scholarly view treats worn jewelry like clothing—exempt from Zakat.",
        },

        // ── Liabilities (dynamic) ──
        deductibleDebts: {
            title: liabMethod === '12_month_rule'
                ? "The 12-Month Middle Path"
                : liabMethod === 'full_deduction'
                    ? "Full Debt Deduction"
                    : liabMethod === 'no_deduction'
                        ? "No Debt Deduction"
                        : "Current Due Only",
            explanation: liabMethod === '12_month_rule'
                ? "Only immediate debts reduce zakatable wealth: current bills, credit cards, and 12 months of installments. This avoids the extremes of full deduction or no deduction."
                : liabMethod === 'full_deduction'
                    ? "All outstanding debts are fully deductible from zakatable wealth. This includes mortgages, student loans, and all other obligations."
                    : liabMethod === 'no_deduction'
                        ? "Debts do not reduce your zakatable wealth under this methodology. Zakat is calculated on gross assets."
                        : "Only debts currently due (this month's payments) are deductible. Future obligations do not reduce current wealth.",
        },
        monthlyLiving: {
            title: liabMethod === '12_month_rule' || liabMethod === 'full_deduction'
                ? "Annualized automatically (×12)"
                : liabMethod === 'no_deduction'
                    ? "Not deductible"
                    : "Current month only",
            explanation: liabMethod === '12_month_rule' || liabMethod === 'full_deduction'
                ? "Enter your monthly amount. This methodology annualizes it (×12) since living expenses are treated as a 12-month obligation. Do not multiply yourself."
                : liabMethod === 'no_deduction'
                    ? "Under this methodology, living expenses are not deductible from zakatable wealth."
                    : "Enter just this month's amount. This methodology only deducts current-month obligations.",
        },
        mortgageDeduction: {
            title: liabMethod === '12_month_rule'
                ? "12 months of mortgage deductible"
                : liabMethod === 'full_deduction'
                    ? "Full mortgage deductible"
                    : liabMethod === 'no_deduction'
                        ? "Mortgage not deductible"
                        : "Current month's mortgage only",
            explanation: liabMethod === '12_month_rule'
                ? "Only the next 12 installments are deductible, not the full balance. This balances debt relief with Zakat obligations to the poor."
                : liabMethod === 'full_deduction'
                    ? "The full outstanding mortgage balance is deductible from zakatable wealth under this methodology."
                    : liabMethod === 'no_deduction'
                        ? "Mortgage payments do not reduce zakatable wealth under this methodology."
                        : "Only this month's mortgage payment is deductible. Future installments do not reduce current wealth.",
        },
    };
}
