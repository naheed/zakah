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

import { z } from 'zod';

// =============================================================================
// ZMCS: Zakat Methodology Configuration Standard — Schema Definition v1.0.0
// =============================================================================
//
// PURPOSE:
//   This file defines the canonical Zod schema for ZMCS, the JSON-based
//   standard that encapsulates diverse juristic opinions (Madhahib) and
//   modern scholarly methodologies for Zakat calculation. Any institution,
//   scholar, or community can author a ZMCS configuration to fully describe
//   their approach to Zakat — from asset zakatability to debt deduction
//   philosophy — and the ZakatFlow engine will faithfully execute it.
//
// DESIGN PRINCIPLES:
//   1. Immutability — A configuration defines a fixed, versioned set of rules.
//   2. Portability  — Serializable to JSON for sharing, versioning, and storage.
//   3. Completeness — Every calculation decision point has a corresponding field.
//   4. Documentation — Every section and many fields carry human-readable
//      `description` and `scholarly_basis` strings for UI rendering and transparency.
//
// VERSIONING:
//   Schema changes follow semver. Configs declare their schema version via
//   `meta.zmcs_version` so loaders can detect incompatible changes.
//
// =============================================================================

// ---------------------------------------------------------------------------
// 1. META — Identity, attribution, and certification
// ---------------------------------------------------------------------------
export const MetaSchema = z.object({
    /** Unique slug identifier for this configuration (e.g., 'hanafi-standard'). Must be URL-safe. */
    id: z.string()
        .describe("Unique slug identifier for this configuration (e.g., 'hanafi-standard'). Must be URL-safe."),

    /** Human-readable name of the methodology (e.g., 'Hanafi Standard'). */
    name: z.string()
        .describe("Human-readable display name for the methodology."),

    /** Semantic version of this config file (e.g., '2.0.0'). */
    version: z.string()
        .describe("Semantic version of this specific config file."),

    /** ZMCS schema version this config targets. Enables forward-compatibility checking. */
    zmcs_version: z.string().default('1.0.0')
        .describe("ZMCS schema version this configuration targets (e.g., '1.0.0')."),

    /** Author or organization responsible for this configuration. */
    author: z.string()
        .describe("Author, scholar, or organization responsible for this configuration."),

    /** Brief description of the methodology's key characteristics and approach. */
    description: z.string()
        .describe("Brief summary of the methodology's approach, key rulings, and distinguishing features."),

    /** Short one-liner for UI dropdowns / methodology selectors. */
    ui_label: z.string().optional()
        .describe("Short display label for methodology selector dropdowns (e.g., 'AMJA Compliant')."),

    /** URL to the scholar's or institution's official website or fatwa page. */
    scholar_url: z.string().url().optional()
        .describe("URL to the scholar's website or institution's official page."),

    /** Optional reference information linking to authoritative sources. */
    reference: z.object({
        /** Name of the scholar, body, or text being referenced. */
        authority: z.string().optional()
            .describe("Name of the scholar, body, or text being referenced."),
        /** Date of the ruling or publication. */
        date: z.string().optional()
            .describe("Date of the ruling or publication (ISO 8601)."),
        /** URL to the fatwa, paper, or official source document. */
        url: z.string().url().optional()
            .describe("URL to the fatwa, paper, or official source document."),
    }).optional()
        .describe("Optional reference information linking to authoritative sources."),

    /** Trust tier for the methodology. */
    tier: z.enum(['official', 'community']).default('community')
        .describe("Trust tier: 'official' = built-in ZakatFlow preset. 'community' = user/community contributed."),

    /** Tooltip for the methodology metadata section. */
    tooltip: z.string().optional()
        .describe("User-facing tooltip explaining this section."),
});


// ---------------------------------------------------------------------------
// 2. THRESHOLDS — Nisab and Zakat rates
// ---------------------------------------------------------------------------
export const ThresholdsSchema = z.object({
    /** Nisab (minimum wealth threshold) configuration. */
    nisab: z.object({
        /** Which metal standard to use by default for calculating the poverty threshold. */
        default_standard: z.enum(['gold', 'silver'])
            .describe("Default metal standard for Nisab. Silver (~$400) is safer for the poor; Gold (~$6,000) exempts more people."),

        /** Nisab threshold in grams of gold. Classical: 85g (20 dinars). Some use 87.48g. */
        gold_grams: z.number().min(0)
            .describe("Nisab threshold in grams of gold. Classical consensus: 85g (20 Mithqal/Dinars). Some scholars use 87.48g."),

        /** Nisab threshold in grams of silver. Classical: 595g (200 dirhams). Some use 612.36g. */
        silver_grams: z.number().min(0)
            .describe("Nisab threshold in grams of silver. Classical consensus: 595g (200 Dirhams). Some scholars use 612.36g."),

        /** Methodology-specific notes on Nisab determination. */
        description: z.string().optional()
            .describe("Methodology-specific notes on Nisab standard choice and reasoning."),
        /** Tooltip for the Nisab section. */
        tooltip: z.string().optional()
            .describe("User-facing tooltip explaining this section."),
    }),

    /** Zakat percentage rates for lunar and solar calendar years. */
    zakat_rate: z.object({
        /** Standard 2.5% for lunar (Hijri) year of ~354 days. */
        lunar: z.number().min(0).max(1)
            .describe("Zakat rate for Hijri (Lunar) calendar year. Standard: 0.025 (2.5%)."),

        /** Adjusted rate for Gregorian (Solar) year of ~365 days. Standard: ~2.577%. */
        solar: z.number().min(0).max(1)
            .describe("Adjusted Zakat rate for Gregorian (Solar) year. Standard: 0.02577 (2.577%). Accounts for the 11-day difference."),

        /** Methodology notes on rate calculation. */
        description: z.string().optional()
            .describe("Notes on rate calculation methodology."),
        /** Tooltip for the Zakat rate section. */
        tooltip: z.string().optional()
            .describe("User-facing tooltip explaining this section."),
    }),
});


// ---------------------------------------------------------------------------
// 3. ASSETS — Zakatability rules for each asset class
// ---------------------------------------------------------------------------
export const AssetsSchema = z.object({

    // ── Cash & Liquid Assets ──────────────────────────────────────────────
    cash: z.object({
        /** Whether cash holdings are zakatable. Universally true across all schools. */
        zakatable: z.boolean()
            .describe("Whether cash on hand, checking, savings, and digital wallets are zakatable."),
        /** Rate at which cash is zakatable. Always 1.0 (100%). */
        rate: z.number().min(0).max(1)
            .describe("Rate at which cash holdings are zakatable. Universally 1.0 (100%)."),
        /** Description of cash treatment in this methodology. */
        description: z.string().optional()
            .describe("Methodology notes on treatment of liquid cash assets."),
        /** Scholarly basis for the ruling. */
        scholarly_basis: z.string().optional()
            .describe("Scholarly evidence for cash zakatability ruling."),
        /** Tooltip for the cash section. */
        tooltip: z.string().optional()
            .describe("User-facing tooltip explaining this section."),
    }),

    // ── Precious Metals (Gold & Silver) ───────────────────────────────────
    precious_metals: z.object({
        /** Rate for investment gold (coins, bars, bullion). Always 1.0 across all schools. */
        investment_gold_rate: z.number().min(0).max(1)
            .describe("Zakat rate on investment gold (coins, bars, bullion). Universally 1.0 (100%)."),
        /** Rate for investment silver (coins, bars, bullion). Always 1.0 across all schools. */
        investment_silver_rate: z.number().min(0).max(1)
            .describe("Zakat rate on investment silver (coins, bars, bullion). Universally 1.0 (100%)."),
        /** Jewelry (personal adornment) rules — the primary point of scholarly divergence. */
        jewelry: z.object({
            /** Whether personal-use jewelry is subject to Zakat. Major area of scholarly disagreement. */
            zakatable: z.boolean()
                .describe("Whether personal-use gold/silver jewelry is subject to Zakat. Hanafi: Yes. Majority (Shafi'i/Maliki/Hanbali): No."),
            /** Rate if zakatable. */
            rate: z.number().min(0).max(1)
                .describe("Rate applied to jewelry value if zakatable. Typically 1.0 (100%)."),
            /** Conditions under which jewelry might be exempt or zakatable. */
            conditions: z.array(z.string()).optional()
                .describe("Conditions affecting zakatability (e.g., 'personal_use', 'excessive_amount', 'hoarding')."),
            /** Description of the jewelry ruling. */
            description: z.string().optional()
                .describe("Detailed explanation of the jewelry zakatability ruling in this methodology."),
            /** Scholarly evidence (hadith, fiqh references). */
            scholarly_basis: z.string().optional()
                .describe("Scholarly evidence and references for the jewelry ruling."),
        }),
        /** Section-level description. */
        description: z.string().optional()
            .describe("General notes on precious metals treatment in this methodology."),
        /** Tooltip for the jewelry zakatability field. */
        tooltip: z.string().optional()
            .describe("User-facing tooltip explaining this section."),
    }),

    // ── Cryptocurrency & Digital Assets ────────────────────────────────────
    crypto: z.object({
        /** Rate for cryptocurrency held as currency/store of value (BTC, ETH). */
        currency_rate: z.number().min(0).max(1)
            .describe("Zakat rate on cryptocurrency held as currency/store of value (BTC, ETH, stablecoins). Typically 1.0 (100%)."),
        /** Rate for crypto actively traded or held as trade goods (altcoins, NFTs). */
        trading_rate: z.number().min(0).max(1)
            .describe("Zakat rate on actively traded crypto, altcoins, and NFTs. Typically 1.0 (100%)."),
        /** Staking rules for DeFi / proof-of-stake rewards. */
        staking: z.object({
            /** Rate on staked principal. */
            principal_rate: z.number().min(0).max(1)
                .describe("Zakat rate on principal amount locked in staking."),
            /** Rate on staking rewards earned. */
            rewards_rate: z.number().min(0).max(1)
                .describe("Zakat rate on staking/yield rewards earned."),
            /** Whether only vested (claimable) rewards count. */
            vested_only: z.boolean()
                .describe("If true, only vested (claimable) staking rewards are counted. Unvested/locked rewards excluded."),
        }),
        /** Description of crypto treatment. */
        description: z.string().optional()
            .describe("Methodology notes on cryptocurrency and digital asset treatment."),
        /** Scholarly basis for crypto rulings. */
        scholarly_basis: z.string().optional()
            .describe("Scholarly evidence for crypto zakatability (e.g., analogy to gold, currency, or trade goods)."),
        /** Tooltip for the crypto section. */
        tooltip: z.string().optional()
            .describe("User-facing tooltip explaining this section."),
    }),

    // ── Investments (Stocks, ETFs, Mutual Funds, REITs) ────────────────────
    investments: z.object({
        /** Rate for actively traded investments (day trading, swing trading). */
        active_trading_rate: z.number().min(0).max(1)
            .describe("Zakat rate on actively traded investments (day/swing trading). Treated as trade goods: 1.0 (100%)."),
        /** Passive / long-term investment rules — major area of methodological divergence. */
        passive_investments: z.object({
            /** Zakatable portion of market value. 1.0 = full market value, 0.30 = 30% proxy, 0.0 = income only. */
            rate: z.number().min(0).max(1)
                .describe("Zakatable portion of passive investment market value. 1.0 = full market value (classical). 0.30 = 30% proxy for underlying assets (AAOIFI/Bradford). 0.0 = income/dividends only (exploited asset view)."),
            /**
             * Treatment philosophy for passive investments.
             * - 'market_value': Rate applies to full market value (classical madhabs).
             * - 'underlying_assets': Rate is a proxy for underlying zakatable company assets (AAOIFI 30% rule).
             * - 'income_only': Only dividends/distributions are zakatable; principal market value exempt (AMJA exploited-asset view).
             */
            treatment: z.enum(['market_value', 'underlying_assets', 'income_only'])
                .describe("Treatment philosophy: 'market_value' = rate on full value. 'underlying_assets' = proxy for zakatable company assets. 'income_only' = only dividends/income zakatable."),
            /** Description of passive investment treatment. */
            description: z.string().optional()
                .describe("Detailed explanation of how passive investments are valued for Zakat."),
            /** Scholarly basis for the treatment. */
            scholarly_basis: z.string().optional()
                .describe("Scholarly evidence for the passive investment treatment (e.g., AAOIFI Standard 9, exploited asset analogy)."),
        }),
        /** Rate for REITs (Equity Real Estate Investment Trusts). */
        reits_rate: z.number().min(0).max(1)
            .describe("Zakat rate on Equity REITs. Usually follows passive investment rate. Avoid Mortgage REITs (Shariah compliance concern)."),
        /** Dividend treatment rules. */
        dividends: z.object({
            /** Whether dividend income is zakatable. */
            zakatable: z.boolean()
                .describe("Whether dividend income received is zakatable."),
            /** Whether to deduct haram purification percentage before Zakat. */
            deduct_purification: z.boolean()
                .describe("If true, the haram purification percentage is deducted from dividends before Zakat calculation."),
            /** Description of dividend treatment. */
            description: z.string().optional()
                .describe("Notes on dividend treatment in this methodology."),
            /** Tooltip for the dividends section. */
            tooltip: z.string().optional()
                .describe("User-facing tooltip explaining this section."),
        }),
        /** Section-level description. */
        description: z.string().optional()
            .describe("General notes on investment treatment in this methodology."),
        /** Scholarly basis for investment rulings. */
        scholarly_basis: z.string().optional()
            .describe("Scholarly evidence for investment classification and treatment."),
        /** Tooltip for the investments section. */
        tooltip: z.string().optional()
            .describe("User-facing tooltip explaining this section."),
    }),

    // ── Retirement Accounts (401k, IRA, Roth, Pension) ─────────────────────
    retirement: z.object({
        /**
         * Primary zakatability method for tax-deferred retirement accounts (401k, Traditional IRA).
         * - 'full': 100% of vested balance (strong ownership / Hanafi view).
         * - 'net_accessible': Balance minus taxes and penalties (AMJA/Fiqh Council standard).
         * - 'conditional_age': Exempt below a threshold age, then apply post_threshold_method (Bradford).
         * - 'deferred_upon_access': Zakat due only when funds are withdrawn (Māl ḍimār view).
         * - 'exempt': Fully exempt from Zakat.
         */
        zakatability: z.enum(['full', 'net_accessible', 'deferred_upon_access', 'conditional_age', 'exempt'])
            .describe("Primary method for calculating zakatable amount of tax-deferred retirement accounts (401k, Traditional IRA)."),

        /** Age threshold below which funds are exempt (for 'conditional_age' method). Typically 59.5 (US). */
        exemption_age: z.number().optional()
            .describe("Age threshold for 'conditional_age' method. Below this age, retirement funds are exempt. US standard: 59.5."),

        /**
         * What happens once the age threshold is reached (for 'conditional_age' method).
         * - 'net_accessible': Apply taxes & penalties deduction (standard).
         * - 'proxy_rate': Apply a flat proxy rate on market value (Bradford: 30%).
         * - 'full': Full balance becomes zakatable.
         */
        post_threshold_method: z.enum(['net_accessible', 'proxy_rate', 'full']).optional()
            .describe("Method for 'conditional_age' once age threshold is reached. 'net_accessible' = deduct taxes/penalties. 'proxy_rate' = flat % of market value. 'full' = 100%."),

        /** Proxy rate to apply when post_threshold_method is 'proxy_rate'. E.g., 0.30 for Bradford's 30%. */
        post_threshold_rate: z.number().min(0).max(1).optional()
            .describe("Proxy rate for 'proxy_rate' post-threshold method (e.g., 0.30 for Bradford's 30% rule)."),

        /** Rate applied to vested pension/401k balance. */
        pension_vested_rate: z.number().min(0).max(1).optional()
            .describe("Rate applied to vested pension/401k balance when accessible. Usually 1.0."),

        /** Early withdrawal penalty rate (US standard: 10%). */
        penalty_rate: z.number().min(0).max(1).optional()
            .describe("Early withdrawal penalty rate for retirement accounts. US standard: 0.10 (10%)."),

        /** How to determine the tax deduction for net-accessible calculations. */
        tax_rate_source: z.enum(['user_input', 'flat_rate']).optional()
            .describe("Source for tax rate in net-accessible calculations. 'user_input' = user provides their rate. 'flat_rate' = use a standard flat rate (30%)."),

        /**
         * Rate applied to Roth IRA contributions (principal).
         * Contributions are always accessible tax-free, but methodologies differ on zakatability.
         * - Bradford: 0.30 (30% proxy on contributions)
         * - Most others: 1.0 (fully zakatable since accessible)
         */
        roth_contributions_rate: z.number().min(0).max(1)
            .describe("Zakat rate on Roth IRA contributions (principal). Always accessible tax-free. Bradford: 0.30 (proxy). Most: 1.0 (fully zakatable)."),

        /**
         * Whether Roth IRA earnings follow the same rules as Traditional/401k retirement.
         * - true: Roth earnings use the same zakatability method (subject to age, penalties, etc.)
         * - false: Roth earnings are always fully zakatable (treated as accessible wealth)
         */
        roth_earnings_follow_traditional: z.boolean()
            .describe("If true, Roth earnings follow the same rules as Traditional retirement. If false, Roth earnings are always fully zakatable."),

        /**
         * Whether already-withdrawn distributions are always zakatable regardless of retirement method.
         * Distributions in hand are liquid cash — universally zakatable.
         */
        distributions_always_zakatable: z.boolean()
            .describe("Whether retirement distributions already taken are always zakatable (universally true: cash in hand is zakatable)."),

        /** Description of retirement treatment. */
        description: z.string().optional()
            .describe("Detailed explanation of retirement account Zakat treatment in this methodology."),
        /** Scholarly basis for retirement ruling. */
        scholarly_basis: z.string().optional()
            .describe("Scholarly evidence for the retirement zakatability position (e.g., Māl ḍimār, strong ownership, AMJA fatwas)."),
        /** Tooltip for the retirement section. */
        tooltip: z.string().optional()
            .describe("User-facing tooltip explaining this section."),
    }),

    // ── Real Estate ────────────────────────────────────────────────────────
    real_estate: z.object({
        /** Primary residence (personal home). */
        primary_residence: z.object({
            zakatable: z.boolean().describe("Whether primary residence value is zakatable. Universally: false."),
            description: z.string().optional().describe("Notes on primary residence exemption."),
        }),
        /** Rental/income-producing property. */
        rental_property: z.object({
            /** Whether the property value itself is zakatable. Usually false (exploited asset). */
            zakatable: z.boolean().describe("Whether rental property market value is zakatable. Usually false (exploited asset)."),
            /** Whether rental income received is zakatable. Usually true. */
            income_zakatable: z.boolean().describe("Whether net rental income (in bank) is zakatable. Usually true."),
            /**
             * Optional override Zakat rate for rental income.
             * If set, rental income is taxed at this rate instead of the global Zakat rate (2.5%).
             * This supports Al-Qaradawi's agricultural analogy: 5-10% on net rent.
             * If omitted or undefined, the global Zakat rate is used (standard behavior).
             */
            income_rate: z.number().min(0).max(1).optional()
                .describe("Override Zakat rate for rental income. If set, rental income is taxed at this rate instead of the global 2.5%. Al-Qaradawi: 0.10 (10% agricultural analogy). Omit for standard 2.5%."),
            description: z.string().optional().describe("Notes on rental property treatment."),
        }),
        /** Property held for sale / flipping. */
        for_sale: z.object({
            zakatable: z.boolean().describe("Whether property listed for sale is zakatable. True = trade goods."),
            rate: z.number().min(0).max(1).describe("Rate on property for sale value."),
            description: z.string().optional().describe("Notes on property-for-sale treatment."),
        }),
        /** Land held for long-term appreciation (land banking). */
        land_banking: z.object({
            zakatable: z.boolean().describe("Whether undeveloped land held for appreciation is zakatable."),
            rate: z.number().min(0).max(1).describe("Rate on land banking value."),
            description: z.string().optional().describe("Notes on land banking treatment."),
        }),
        /** Section-level description. */
        description: z.string().optional()
            .describe("General notes on real estate Zakat treatment."),
        /** Tooltip for the real estate section. */
        tooltip: z.string().optional()
            .describe("User-facing tooltip explaining this section."),
    }),

    // ── Business Assets ────────────────────────────────────────────────────
    business: z.object({
        /** Rate on business cash and accounts receivable. Usually 1.0. */
        cash_receivables_rate: z.number().min(0).max(1)
            .describe("Zakat rate on business cash and accounts receivable. Universally 1.0 (100%)."),
        /** Rate on trade inventory. Usually 1.0 (trade goods = zakatable). */
        inventory_rate: z.number().min(0).max(1)
            .describe("Zakat rate on trade inventory (raw materials, finished goods). Usually 1.0 (100%)."),
        /** Rate on fixed assets (equipment, machinery). Usually 0.0 (not zakatable). */
        fixed_assets_rate: z.number().min(0).max(1)
            .describe("Zakat rate on fixed assets (equipment, machinery, vehicles). Usually 0.0 (not zakatable)."),
        /** Description of business treatment. */
        description: z.string().optional()
            .describe("Notes on business asset Zakat treatment."),
        /** Scholarly basis. */
        scholarly_basis: z.string().optional()
            .describe("Scholarly evidence for business asset classification."),
        /** Tooltip for the business section. */
        tooltip: z.string().optional()
            .describe("User-facing tooltip explaining this section."),
    }),

    // ── Debts Owed To You ──────────────────────────────────────────────────
    debts_owed_to_user: z.object({
        /** Rate for good debts (borrower willing and able to repay). Usually 1.0. */
        good_debt_rate: z.number().min(0).max(1)
            .describe("Zakat rate on collectible debts (borrower willing & able to repay). Usually 1.0 (100%)."),
        /** Rate for bad debts (doubtful recovery). Usually 0.0. */
        bad_debt_rate: z.number().min(0).max(1)
            .describe("Zakat rate on bad debts (doubtful recovery). Usually 0.0 (not zakatable until recovered)."),
        /** Whether bad debt is only zakatable upon actual recovery. */
        bad_debt_on_recovery: z.boolean()
            .describe("If true, bad debt only becomes zakatable when actually recovered (pay Zakat on recovery year)."),
        /** Description. */
        description: z.string().optional()
            .describe("Notes on treatment of debts owed to the user."),
        /** Scholarly basis. */
        scholarly_basis: z.string().optional()
            .describe("Scholarly evidence for debt classification (good vs bad debt)."),
        /** Tooltip for the debts section. */
        tooltip: z.string().optional()
            .describe("User-facing tooltip explaining this section."),
    }),

    // ── Illiquid Assets (Optional) ─────────────────────────────────────────
    illiquid_assets: z.object({
        /** Rate on illiquid assets and livestock. */
        rate: z.number().min(0).max(1).default(1.0)
            .describe("Zakat rate on other illiquid assets (e.g., commodities, livestock)."),
        /** Description. */
        description: z.string().optional()
            .describe("Notes on illiquid asset treatment."),
        /** Tooltip for the illiquid assets section. */
        tooltip: z.string().optional()
            .describe("User-facing tooltip explaining this section."),
    }).optional()
        .describe("Optional: Rules for illiquid assets like commodities and livestock."),

    // ── Trusts (Optional) ──────────────────────────────────────────────────
    trusts: z.object({
        /** Rate on revocable trusts (grantor retains control and ownership). Usually 1.0. */
        revocable_rate: z.number().min(0).max(1).default(1.0)
            .describe("Zakat rate on revocable trusts (grantor retains control). Usually 1.0."),
        /** Rate on irrevocable trusts (grantor has relinquished control). Usually 1.0 if accessible. */
        irrevocable_rate: z.number().min(0).max(1).default(1.0)
            .describe("Zakat rate on accessible irrevocable trusts. Usually 1.0 if beneficiary has access."),
        /** Description. */
        description: z.string().optional()
            .describe("Notes on trust Zakat treatment."),
        /** Tooltip for the trusts section. */
        tooltip: z.string().optional()
            .describe("User-facing tooltip explaining this section."),
    }).optional()
        .describe("Optional: Rules for revocable and irrevocable trusts."),
});


// ---------------------------------------------------------------------------
// 4. LIABILITIES — Debt deduction philosophy and rules
// ---------------------------------------------------------------------------
export const LiabilitiesSchema = z.object({
    /**
     * Global debt deduction philosophy.
     * - 'full_deduction': All debts fully deductible from zakatable wealth (Hanafi/Hanbali).
     * - 'no_deduction': Debts do not reduce Zakat liability (Shafi'i — Al-Nawawi's Al-Majmu').
     * - '12_month_rule': Debts due within the coming 12 months reduce liability (Maliki/Bradford modern synthesis).
     * - 'current_due_only': Only payments currently due (this month) are deductible (AMJA strict interpretation).
     */
    method: z.enum(['full_deduction', 'no_deduction', '12_month_rule', 'current_due_only'])
        .describe("Global philosophy on how debts reduce zakatable wealth."),

    /** Treatment of commercial/business debts. */
    commercial_debt: z.enum(['fully_deductible', 'deductible_from_business_assets', 'none'])
        .describe("How business debts are treated: deductible from all wealth, only from business assets, or not deductible."),

    /** Personal debt deduction rules. */
    personal_debt: z.object({
        /** Master switch: are personal debts deductible at all? */
        deductible: z.boolean()
            .describe("Master switch: whether personal debts can be deducted from zakatable wealth."),

        /**
         * Optional cap on total debt deduction.
         * - 'none': No cap (debts can reduce wealth to 0).
         * - 'total_assets': Debts capped at total asset value.
         * - 'total_cash': Debts capped at total liquid cash value.
         */
        cap: z.enum(['none', 'total_assets', 'total_cash']).optional()
            .describe("Optional cap on total deductible debt amount."),

        /** Per-category debt deduction rules. */
        types: z.object({
            /**
             * Housing/mortgage deduction rule.
             * - 'full': 12 months of payments as approximation (full balance requires separate field).
             * - '12_months': 12 months of mortgage payments.
             * - 'current_due': Only current month's payment.
             * - 'none': Not deductible.
             */
            housing: z.enum(['full', '12_months', 'current_due', 'none'])
                .describe("Housing/mortgage deduction: 'full' = annual (approx), '12_months' = annual, 'current_due' = monthly, 'none' = no deduction."),

            /**
             * Student loan deduction rule.
             * - 'full': Total due amount.
             * - 'current_due': Only current payment due.
             * - 'none': Not deductible.
             */
            student_loans: z.enum(['full', 'current_due', '12_months', 'none'])
                .describe("Student loan deduction: 'full' = total due, 'current_due' = monthly payment, 'none' = no deduction."),

            /**
             * Credit card balance deduction rule.
             * - 'full': Full outstanding balance (due immediately by nature).
             * - 'none': Not deductible.
             */
            credit_cards: z.enum(['full', 'none'])
                .describe("Credit card deduction: 'full' = outstanding balance, 'none' = no deduction."),

            /**
             * Living expenses deduction rule.
             * - 'full': 12 months annualized.
             * - '12_months': 12 months of monthly expenses.
             * - 'current_due': Only current month's expenses.
             * - 'none': Not deductible.
             */
            living_expenses: z.enum(['full', '12_months', 'current_due', 'none'])
                .describe("Living expenses deduction: 'full'/'12_months' = annualized, 'current_due' = monthly, 'none' = no deduction."),

            /**
             * Insurance premiums deduction rule.
             * - 'full': Annual premium.
             * - 'current_due': Only current payment due.
             * - 'none': Not deductible.
             */
            insurance: z.enum(['full', 'current_due', 'none'])
                .describe("Insurance premium deduction: 'full' = annual, 'current_due' = monthly, 'none' = no deduction."),

            /**
             * Unpaid bills (utilities, services) deduction rule.
             * - 'full': All outstanding bills.
             * - 'none': Not deductible.
             */
            unpaid_bills: z.enum(['full', 'none'])
                .describe("Unpaid bills deduction: 'full' = all outstanding, 'none' = no deduction."),

            /**
             * Tax payments (property tax, late taxes) deduction rule.
             * - 'full': All due taxes.
             * - 'current_due': Only taxes currently payable.
             * - 'none': Not deductible.
             */
            taxes: z.enum(['full', 'current_due', 'none'])
                .describe("Tax payment deduction: 'full' = all due, 'current_due' = currently payable, 'none' = no deduction."),
        }).optional()
            .describe("Per-category debt deduction rules. If omitted, the global 'method' governs all categories."),

        /** Description of debt deduction approach. */
        description: z.string().optional()
            .describe("Explanation of the debt deduction philosophy in this methodology."),
        /** Scholarly basis for the debt ruling. */
        scholarly_basis: z.string().optional()
            .describe("Scholarly evidence for the debt deduction position."),
    }),



    /** Section-level description. */
    description: z.string().optional()
        .describe("General notes on the liabilities approach."),

    /** Tooltip for the liabilities section. */
    tooltip: z.string().optional()
        .describe("User-facing tooltip explaining this section."),
});


// ---------------------------------------------------------------------------
// 5. ROOT — Complete ZMCS Configuration
// ---------------------------------------------------------------------------
export const ZakatMethodologySchema = z.object({
    /** Optional JSON Schema URI for external validators. */
    $schema: z.string().optional()
        .describe("Optional JSON Schema URI for external validation tools."),

    /** Metadata, identity, and attribution. */
    meta: MetaSchema,

    /** Nisab thresholds and Zakat rates. */
    thresholds: ThresholdsSchema,

    /** Asset zakatability rules for all asset classes. */
    assets: AssetsSchema,

    /** Liability deduction philosophy and per-category rules. */
    liabilities: LiabilitiesSchema,

    /** Placeholder for future custom exemptions (e.g., agricultural output, minerals). */
    exemptions: z.record(z.any()).optional()
        .describe("Reserved: Placeholder for future custom exemption rules (e.g., agriculture, minerals)."),
});
