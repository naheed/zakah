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


import { Coins, Bank, Gavel, Scales, Calculator, Scroll, Buildings, Wallet, UserMinus, Icon, CurrencyBtc, HouseLine, Briefcase, ChartLineUp, PiggyBank, HandCoins } from "@phosphor-icons/react";

// =============================================================================
// ZMCS UI Documentation Content (v1.0)
// =============================================================================
//
// This file defines the structured content for the ZMCS specification page
// (/methodology/zmcs). Each section maps to a top-level ZMCS schema section,
// and each field documents a configurable parameter with its type, description,
// options, and default value.
//
// This is the USER-FACING documentation layer. For the machine-readable schema,
// see src/lib/config/schema.ts.
//

export interface ZMCSField {
    path: string;
    type: string;
    description: string;
    /** Extended scholarly explanation, shown in an expandable "Scholarly detail" section. */
    detail?: string;
    options?: { value: string; label: string }[];
    default?: string;
    required: boolean;
    group?: string;
    groupIcon?: Icon;
    /** Key in fiqhExplanations linking this config field to its user-facing WhyTooltip. */
    helpText?: string;
    /** Field category: 'calculation' (default), 'content' (UI-facing text like tooltips), or 'metadata'. */
    category?: 'calculation' | 'content' | 'metadata';
}

export interface ZMCSSection {
    id: string;
    title: string;
    icon?: Icon;
    description: string;
    fields: ZMCSField[];
}

export const ZMCS_DOCS: ZMCSSection[] = [
    // ─────────────────────────────────────────────────────────────────────
    // 1. METADATA
    // ─────────────────────────────────────────────────────────────────────
    {
        id: "meta",
        title: "Metadata",
        icon: Scroll,
        description: "Identity, versioning, and attribution for the methodology configuration.",
        fields: [
            {
                path: "meta.id",
                type: "string",
                description: "Unique slug identifier for this configuration (e.g., 'hanafi-standard'). Must be URL-safe.",
                required: true,
            },
            {
                path: "meta.name",
                type: "string",
                description: "Human-readable display name for the methodology (e.g., 'Hanafi Standard').",
                required: true,
            },
            {
                path: "meta.version",
                type: "string",
                description: "Semantic version of this config file (e.g., '1.0.0'). Tracks rule changes over time.",
                required: true,
            },
            {
                path: "meta.zmcs_version",
                type: "string",
                description: "ZMCS schema version this config targets. Enables forward-compatibility checking.",
                default: "1.0.0",
                required: true,
            },
            {
                path: "meta.author",
                type: "string",
                description: "Organization or scholar responsible for this configuration.",
                required: true,
            },
            {
                path: "meta.description",
                type: "string",
                description: "Brief summary of the methodology's approach and key rulings.",
                required: true,
            },
            {
                path: "meta.ui_label",
                type: "string",
                description: "Short label for methodology selector dropdowns (e.g., 'AMJA Compliant').",
                required: false,
            },
            {
                path: "meta.scholar_url",
                type: "string (url)",
                description: "Link to the scholar's website or institution's official page.",
                required: false,
            },
            {
                path: "meta.certification.certified_by",
                type: "string",
                description: "Name of the certifying scholar or Shariah board that reviewed and approved this methodology configuration.",
                required: false,
                category: "metadata",
            },
            {
                path: "meta.certification.date",
                type: "string (ISO 8601)",
                description: "Date of the certification or approval (e.g., '2025-01-15').",
                required: false,
                category: "metadata",
            },
            {
                path: "meta.certification.url",
                type: "string (url)",
                description: "Link to the public fatwa, paper, or official ruling document.",
                required: false,
                category: "metadata",
            },
            {
                path: "meta.tooltip",
                type: "string",
                description: "User-facing guidance text displayed in the calculator UI for this section. Config authors should write clear, concise summaries that help end-users understand the ruling.",
                required: false,
                category: "content",
            },
        ],
    },

    // ─────────────────────────────────────────────────────────────────────
    // 2. THRESHOLDS
    // ─────────────────────────────────────────────────────────────────────
    {
        id: "thresholds",
        title: "Thresholds",
        icon: Scales,
        description: "Base constants defining the minimum zakatable wealth (Nisab) and the Zakat tax rates.",
        fields: [
            {
                path: "thresholds.nisab.default_standard",
                type: "enum",
                description: "Which metal price sets the poverty-line threshold (Nisab).",
                options: [
                    { value: "silver", label: "Silver (Preferred). Lower threshold (~$400), safer for the poor — ensures more people fulfill their obligation." },
                    { value: "gold", label: "Gold. Higher threshold (~$6,000), exempts more people from Zakat obligation." },
                ],
                required: true,
                helpText: "silverNisab",
            },
            {
                path: "thresholds.nisab.tooltip",
                type: "string",
                description: "User-facing guidance text displayed in the calculator UI for the Nisab section. Config authors should write clear, concise summaries that help end-users understand the ruling.",
                required: false,
                category: "content",
            },
            {
                path: "thresholds.nisab.gold_grams",
                type: "number",
                description: "Nisab threshold in grams of gold. Classical consensus: 85g (20 Mithqal/Dinars). Some scholars use 87.48g.",
                default: "85.0",
                required: true,
            },
            {
                path: "thresholds.nisab.silver_grams",
                type: "number",
                description: "Nisab threshold in grams of silver. Classical consensus: 595g (200 Dirhams). Some scholars use 612.36g.",
                default: "595.0",
                required: true,
            },
            {
                path: "thresholds.nisab.description",
                type: "string",
                description: "Methodology-specific notes explaining the rationale behind the chosen Nisab standard and values.",
                required: false,
            },
            {
                path: "thresholds.zakat_rate.lunar",
                type: "number (0-1)",
                description: "Zakat rate for Hijri (Lunar) calendar year (~354 days).",
                default: "0.025 (2.5%)",
                required: true,
            },
            {
                path: "thresholds.zakat_rate.solar",
                type: "number (0-1)",
                description: "Adjusted rate for Gregorian (Solar) year (~365 days). Accounts for the 11-day difference.",
                default: "0.02577 (2.577%)",
                required: true,
            },
            {
                path: "thresholds.zakat_rate.description",
                type: "string",
                description: "Notes on how the Zakat rate was derived or any special considerations (e.g., solar year adjustment methodology).",
                required: false,
            },
            {
                path: "thresholds.zakat_rate.tooltip",
                type: "string",
                description: "User-facing guidance text displayed in the calculator UI for the Zakat Rate section. Config authors should write clear, concise summaries that help end-users understand the ruling.",
                required: false,
                category: "content",
            },
        ],
    },

    // ─────────────────────────────────────────────────────────────────────
    // 3. ASSETS
    // ─────────────────────────────────────────────────────────────────────
    {
        id: "assets",
        title: "Assets",
        icon: Coins,
        description: "Rules determining zakatability and valuation for each asset class. This is where methodologies diverge most significantly.",
        fields: [
            // ── Cash ──
            {
                path: "assets.cash.zakatable",
                type: "boolean",
                description: "Whether cash on hand, checking, savings, and digital wallets are zakatable. Universally true.",
                default: "true",
                required: true,
                group: "Cash",
                groupIcon: Wallet,
                helpText: "checkingAccounts",
            },
            {
                path: "assets.cash.rate",
                type: "number (0-1)",
                description: "Rate applied to cash holdings. Universally 1.0 (100% of cash is zakatable).",
                default: "1.0",
                required: true,
                group: "Cash",
            },
            {
                path: "assets.cash.tooltip",
                type: "string",
                description: "User-facing guidance text displayed in the calculator UI for the Cash section. Config authors should write clear, concise summaries that help end-users understand the ruling.",
                required: false,
                group: "Cash",
                category: "content",
            },


            // ── Precious Metals / Jewelry ──
            {
                path: "assets.precious_metals.investment_gold_rate",
                type: "number (0-1)",
                description: "Zakat rate on gold held as investment (bullion, coins, bars). Always 1.0 — investment gold is universally zakatable.",
                default: "1.0",
                required: true,
                group: "Precious Metals",
                groupIcon: Coins,
            },
            {
                path: "assets.precious_metals.investment_silver_rate",
                type: "number (0-1)",
                description: "Zakat rate on silver held as investment. Always 1.0 — investment silver is universally zakatable.",
                default: "1.0",
                required: true,
                group: "Precious Metals",
            },
            {
                path: "assets.precious_metals.jewelry.zakatable",
                type: "boolean",
                description: "Whether personal-use gold and silver jewelry is subject to Zakat.",
                detail: "Hanafi and Bradford methodologies hold all gold and silver as monetary by nature (thaman) and therefore zakatable. The majority view (Shafi'i, Maliki, Hanbali, AMJA) exempts jewelry worn for permissible personal adornment.",
                required: true,
                group: "Precious Metals",
                helpText: "jewelryExemption",
            },
            {
                path: "assets.precious_metals.jewelry.rate",
                type: "number (0-1)",
                description: "Rate applied to jewelry if zakatable. Typically 1.0 (100% of market value).",
                default: "1.0",
                required: true,
                group: "Precious Metals",
            },
            {
                path: "assets.precious_metals.jewelry.conditions",
                type: "string[]",
                description: "Optional conditions affecting zakatability (e.g., 'personal_use', 'excessive_amount'). Empty array means no special conditions.",
                required: false,
                group: "Precious Metals",
            },
            {
                path: "assets.precious_metals.jewelry.description",
                type: "string",
                description: "Methodology-specific explanation of the jewelry ruling and its rationale.",
                required: false,
                group: "Precious Metals",
            },
            {
                path: "assets.precious_metals.jewelry.scholarly_basis",
                type: "string",
                description: "Citation of the scholarly evidence supporting this ruling. Include hadith references, fiqh texts, fatwa numbers, or institutional standards (e.g., AAOIFI Standard No. 9). This field is critical for scholarly audit and verification.",
                required: false,
                group: "Precious Metals",
            },
            {
                path: "assets.precious_metals.tooltip",
                type: "string",
                description: "User-facing guidance text displayed in the calculator UI for the Precious Metals section. Config authors should write clear, concise summaries that help end-users understand the ruling.",
                required: false,
                group: "Precious Metals",
                category: "content",
            },


            // ── Crypto ──
            {
                path: "assets.crypto.currency_rate",
                type: "number (0-1)",
                description: "Zakat rate on cryptocurrency held as currency/store of value (BTC, ETH, stablecoins).",
                default: "1.0",
                required: true,
                group: "Cryptocurrency",
                groupIcon: CurrencyBtc,
                helpText: "cryptoCurrency",
            },
            {
                path: "assets.crypto.trading_rate",
                type: "number (0-1)",
                description: "Zakat rate on actively traded crypto assets and NFTs. Treated as trade goods (ʿurūḍ al-tijārah).",
                default: "1.0",
                required: true,
                group: "Cryptocurrency",
            },
            {
                path: "assets.crypto.staking.principal_rate",
                type: "number (0-1)",
                description: "Zakat rate on the principal amount locked in staking/yield farming.",
                default: "1.0",
                required: true,
                group: "Cryptocurrency",
            },
            {
                path: "assets.crypto.staking.rewards_rate",
                type: "number (0-1)",
                description: "Zakat rate on staking/yield rewards. May differ from principal if rewards are considered separate income.",
                default: "1.0",
                required: true,
                group: "Cryptocurrency",
            },
            {
                path: "assets.crypto.staking.vested_only",
                type: "boolean",
                description: "If true, only vested (claimable) staking rewards are counted. Unvested/locked rewards excluded.",
                default: "true",
                required: true,
                group: "Cryptocurrency",
                helpText: "stakedAssets",
            },
            {
                path: "assets.crypto.description",
                type: "string",
                description: "Methodology-specific notes on the treatment of cryptocurrency and digital assets.",
                required: false,
                group: "Cryptocurrency",
            },
            {
                path: "assets.crypto.scholarly_basis",
                type: "string",
                description: "Scholarly evidence for crypto treatment (e.g., thamaniyya analogy to gold/silver, AAOIFI guidance).",
                required: false,
                group: "Cryptocurrency",
            },
            {
                path: "assets.crypto.tooltip",
                type: "string",
                description: "User-facing guidance text displayed in the calculator UI for the Crypto section. Config authors should write clear, concise summaries that help end-users understand the ruling.",
                required: false,
                group: "Cryptocurrency",
                category: "content",
            },


            // ── Investments ──
            {
                path: "assets.investments.active_trading_rate",
                type: "number (0-1)",
                description: "Zakat rate on actively traded investments (day/swing trading). Treated as trade goods.",
                default: "1.0",
                required: true,
                group: "Investments",
                groupIcon: ChartLineUp,
                helpText: "activeInvestments",
            },
            {
                path: "assets.investments.passive_investments.rate",
                type: "number (0-1)",
                description: "Zakatable portion of passive investment market value.",
                detail: "1.0 = classical (full market value as trade goods). 0.30 = Bradford/AAOIFI proxy for underlying zakatable company assets. 0.0 = AMJA income-only view (only dividends zakatable, not principal).",
                required: true,
                group: "Investments",
                helpText: "thirtyPercentRule",
            },
            {
                path: "assets.investments.passive_investments.treatment",
                type: "enum",
                description: "Treatment philosophy for passive (long-term, buy-and-hold) investments.",
                options: [
                    { value: "market_value", label: "Market Value — Full market value is zakatable (Classical Hanafi/Shafi'i/Maliki/Hanbali)." },
                    { value: "underlying_assets", label: "Underlying Assets — Proxy % represents zakatable company assets (Bradford 30% / AAOIFI Standard 9)." },
                    { value: "income_only", label: "Income Only — Only dividends/distributions are zakatable, NOT principal (AMJA exploited-asset view)." },
                ],
                required: true,
                group: "Investments",
            },
            {
                path: "assets.investments.dividends.zakatable",
                type: "boolean",
                description: "Whether dividend income is zakatable. Universally true across all methodologies.",
                default: "true",
                required: true,
                group: "Investments",
            },
            {
                path: "assets.investments.dividends.deduct_purification",
                type: "boolean",
                description: "If true, the haram purification percentage is deducted from dividends before Zakat calculation.",
                required: true,
                group: "Investments",
            },
            {
                path: "assets.investments.reits_rate",
                type: "number (0-1)",
                description: "Zakat rate on Equity REITs. Usually follows passive investment rate. Avoid Mortgage REITs (Shariah compliance concern).",
                required: true,
                group: "Investments",
            },
            {
                path: "assets.investments.tooltip",
                type: "string",
                description: "User-facing guidance text displayed in the calculator UI for the Investments section. Config authors should write clear, concise summaries that help end-users understand the ruling.",
                required: false,
                group: "Investments",
                category: "content",
            },

            // ── Retirement ──
            {
                path: "assets.retirement.zakatability",
                type: "enum",
                description: "Primary method for calculating the zakatable amount of retirement accounts (401k, IRA).",
                detail: "This is the most divergent parameter across methodologies. Options range from full balance (strong ownership) to complete exemption, with net-accessible and conditional-age approaches in between.",
                options: [
                    { value: "full", label: "Full Balance — 100% of vested balance (Strong Ownership / Imam Tahir Anwar)." },
                    { value: "net_accessible", label: "Net Accessible — Balance minus taxes and penalties (AMJA / Classical majority)." },
                    { value: "conditional_age", label: "Conditional Age — Exempt below threshold (e.g., 59.5), then post_threshold_method applies (Bradford)." },
                    { value: "deferred_upon_access", label: "Deferred — Zakat due only when funds are actually withdrawn (Māl ḍimār strict view)." },
                    { value: "exempt", label: "Exempt — Fully exempt from Zakat." },
                ],
                required: true,
                group: "Retirement",
                groupIcon: PiggyBank,
                helpText: "retirementAccounts",
            },
            {
                path: "assets.retirement.exemption_age",
                type: "number",
                description: "Age threshold for 'conditional_age' rule. Below this age, retirement funds are exempt. US standard: 59.5.",
                required: false,
                group: "Retirement",
            },
            {
                path: "assets.retirement.post_threshold_method",
                type: "enum",
                description: "Calculation method once the age threshold is reached (for 'conditional_age' only).",
                options: [
                    { value: "net_accessible", label: "Net Accessible — Deduct taxes and penalties from balance." },
                    { value: "proxy_rate", label: "Proxy Rate — Apply flat percentage to market value (Bradford: 30%)." },
                    { value: "full", label: "Full — Entire balance becomes zakatable." },
                ],
                required: false,
                group: "Retirement",
            },
            {
                path: "assets.retirement.post_threshold_rate",
                type: "number (0-1)",
                description: "Rate for the 'proxy_rate' post-threshold method (e.g., Bradford uses 0.30 / 30%).",
                default: "0.30",
                required: false,
                group: "Retirement",
            },
            {
                path: "assets.retirement.pension_vested_rate",
                type: "number (0-1)",
                description: "Zakat rate on the vested balance of pension/defined-benefit plans.",
                default: "1.0",
                required: false,
                group: "Retirement",
            },
            {
                path: "assets.retirement.penalty_rate",
                type: "number (0-1)",
                description: "Early withdrawal penalty rate deducted from net-accessible calculation. US standard: 0.10 (10%).",
                default: "0.10",
                required: false,
                group: "Retirement",
            },
            {
                path: "assets.retirement.tax_rate_source",
                type: "enum",
                description: "How the tax rate for net-accessible calculation is determined.",
                options: [
                    { value: "user_input", label: "User Input — User enters their marginal tax rate." },
                    { value: "flat_rate", label: "Flat Rate — Config specifies a fixed tax rate." },
                ],
                required: false,
                group: "Retirement",
            },
            {
                path: "assets.retirement.roth_contributions_rate",
                type: "number (0-1)",
                description: "Zakat rate on Roth IRA contributions (always accessible tax-free). Bradford: 0.30 (proxy). Most others: 1.0 (fully zakatable).",
                required: true,
                group: "Retirement",
                helpText: "rothContributions",
            },
            {
                path: "assets.retirement.roth_earnings_follow_traditional",
                type: "boolean",
                description: "If true, Roth IRA earnings follow the same rules as Traditional/401k retirement. If false, earnings are always fully zakatable.",
                required: true,
                group: "Retirement",
                helpText: "rothEarnings",
            },
            {
                path: "assets.retirement.distributions_always_zakatable",
                type: "boolean",
                description: "Whether retirement distributions already taken (cash in hand) are always zakatable. Universally true.",
                default: "true",
                required: true,
                group: "Retirement",
            },
            {
                path: "assets.retirement.tooltip",
                type: "string",
                description: "User-facing guidance text displayed in the calculator UI for the Retirement section. Config authors should write clear, concise summaries that help end-users understand the ruling.",
                required: false,
                group: "Retirement",
                category: "content",
            },


            // ── Real Estate ──
            {
                path: "assets.real_estate.primary_residence.zakatable",
                type: "boolean",
                description: "Whether the primary residence is zakatable. Always false — personal dwelling is universally exempt.",
                default: "false",
                required: true,
                group: "Real Estate",
                groupIcon: HouseLine,
            },
            {
                path: "assets.real_estate.rental_property.zakatable",
                type: "boolean",
                description: "Whether rental property market value itself is zakatable. Usually false (exploited asset — only income is zakatable).",
                required: true,
                group: "Real Estate",
            },
            {
                path: "assets.real_estate.rental_property.income_zakatable",
                type: "boolean",
                description: "Whether net rental income (in bank) is zakatable. Usually true.",
                required: true,
                group: "Real Estate",
            },
            {
                path: "assets.real_estate.rental_property.income_rate",
                type: "number (0-1)",
                description: "Override Zakat rate for rental income (v1.0.1). If set, rental income uses this rate instead of the global 2.5%. Al-Qaradawi uses 0.10 (10%) based on the agricultural analogy (ʿushr rate). Omit to use the standard global rate.",
                detail: "Al-Qaradawi argues that rental buildings are analogous to land watered by rain — the income produced requires minimal ongoing effort, justifying the higher ʿushr (10%) rate. This is implemented via the ZMCS v1.0.1 multi-rate calculation, which separates override pools from the standard pool.",
                required: false,
                group: "Real Estate",
            },
            {
                path: "assets.real_estate.for_sale.zakatable",
                type: "boolean",
                description: "Whether property listed for sale is zakatable (trade goods).",
                required: true,
                group: "Real Estate",
            },
            {
                path: "assets.real_estate.for_sale.rate",
                type: "number (0-1)",
                description: "Zakat rate on property listed for sale. Typically 1.0 (full market value as trade goods).",
                default: "1.0",
                required: true,
                group: "Real Estate",
            },
            {
                path: "assets.real_estate.land_banking.zakatable",
                type: "boolean",
                description: "Whether undeveloped land held for long-term appreciation is zakatable.",
                required: true,
                group: "Real Estate",
            },
            {
                path: "assets.real_estate.land_banking.rate",
                type: "number (0-1)",
                description: "Zakat rate on land held for appreciation. Typically 1.0 (full market value).",
                default: "1.0",
                required: true,
                group: "Real Estate",
            },
            {
                path: "assets.real_estate.tooltip",
                type: "string",
                description: "User-facing guidance text displayed in the calculator UI for the Real Estate section. Config authors should write clear, concise summaries that help end-users understand the ruling.",
                required: false,
                group: "Real Estate",
                category: "content",
            },

            // ── Business ──
            {
                path: "assets.business.cash_receivables_rate",
                type: "number (0-1)",
                description: "Zakat rate on business cash and accounts receivable. Usually 1.0 (fully zakatable as liquid assets).",
                default: "1.0",
                required: true,
                group: "Business",
                groupIcon: Briefcase,
            },
            {
                path: "assets.business.inventory_rate",
                type: "number (0-1)",
                description: "Zakat rate on business inventory (raw materials, finished goods for sale).",
                default: "1.0",
                required: true,
                group: "Business",
            },
            {
                path: "assets.business.fixed_assets_rate",
                type: "number (0-1)",
                description: "Zakat rate on fixed business assets (equipment, machinery, vehicles). Usually 0.0 (not zakatable).",
                default: "0.0",
                required: true,
                group: "Business",
            },
            {
                path: "assets.business.tooltip",
                type: "string",
                description: "User-facing guidance text displayed in the calculator UI for the Business section. Config authors should write clear, concise summaries that help end-users understand the ruling.",
                required: false,
                group: "Business",
                category: "content",
            },


            // ── Debts Owed ──
            {
                path: "assets.debts_owed_to_user.good_debt_rate",
                type: "number (0-1)",
                description: "Rate for debts owed to you where borrower is willing and able to repay.",
                default: "1.0",
                required: true,
                group: "Debts Owed",
                groupIcon: HandCoins,
            },
            {
                path: "assets.debts_owed_to_user.bad_debt_rate",
                type: "number (0-1)",
                description: "Zakat rate on doubtful/bad debts (borrower unable or unwilling to repay). Usually 0.0.",
                default: "0.0",
                required: true,
                group: "Debts Owed",
            },
            {
                path: "assets.debts_owed_to_user.bad_debt_on_recovery",
                type: "boolean",
                description: "If true, bad debts only become zakatable when actually recovered (pay Zakat on recovery year).",
                required: true,
                group: "Debts Owed",
            },
            {
                path: "assets.debts_owed_to_user.tooltip",
                type: "string",
                description: "User-facing guidance text displayed in the calculator UI for the Debts Owed section. Config authors should write clear, concise summaries that help end-users understand the ruling.",
                required: false,
                group: "Debts Owed",
                category: "content",
            },

            // ── Optional: Illiquid Assets ──
            {
                path: "assets.illiquid_assets.rate",
                type: "number (0-1)",
                description: "Zakat rate on illiquid assets (e.g., livestock, collectibles) not covered by other categories. Default 1.0.",
                default: "1.0",
                required: false,
                group: "Illiquid Assets",
            },


            // ── Optional: Trusts ──
            {
                path: "assets.trusts.revocable_rate",
                type: "number (0-1)",
                description: "Zakat rate on revocable trusts (grantor retains control and ownership).",
                default: "1.0",
                required: false,
                group: "Trusts",
                groupIcon: Buildings,
                helpText: "revocableTrust",
            },
            {
                path: "assets.trusts.irrevocable_rate",
                type: "number (0-1)",
                description: "Zakat rate on accessible irrevocable trusts.",
                default: "1.0",
                required: false,
                group: "Trusts",
                helpText: "irrevocableTrust",
            },
            {
                path: "assets.trusts.tooltip",
                type: "string",
                description: "User-facing guidance text displayed in the calculator UI for the Trusts section. Config authors should write clear, concise summaries that help end-users understand the ruling.",
                required: false,
                group: "Trusts",
                category: "content",
            },
        ],
    },

    // ─────────────────────────────────────────────────────────────────────
    // 4. LIABILITIES
    // ─────────────────────────────────────────────────────────────────────
    {
        id: "liabilities",
        title: "Liabilities",
        icon: UserMinus,
        description: "Rules for deducting debts from zakatable wealth. The second most divergent area across methodologies.",
        fields: [
            {
                path: "liabilities.method",
                type: "enum",
                description: "Global philosophy on how debts reduce zakatable wealth.",
                detail: "Ranges from full deduction (Hanafi/Hanbali) where all debts offset wealth, to no deduction (Shafi'i) where debts have zero effect, with 12-month and current-due rules in between.",
                options: [
                    { value: "full_deduction", label: "Full Deduction — All debts fully offset wealth (Hanafi/Hanbali/Imam Tahir Anwar)." },
                    { value: "no_deduction", label: "No Deduction — Debts do NOT reduce Zakat liability (Shafi'i)." },
                    { value: "12_month_rule", label: "12-Month Rule — Debts due within the coming year (Maliki/Bradford)." },
                    { value: "current_due_only", label: "Current Due Only — Only this month's payments are deductible (AMJA strict)." },
                ],
                required: true,
                group: "Deduction Method",
                groupIcon: Gavel,
                helpText: "deductibleDebts",
            },
            {
                path: "liabilities.commercial_debt",
                type: "enum",
                description: "How business debts are handled.",
                options: [
                    { value: "fully_deductible", label: "Deductible against all wealth (Hanafi/Hanbali/Bradford)." },
                    { value: "deductible_from_business_assets", label: "Ring-fenced — Only deductible against business assets (Maliki)." },
                    { value: "none", label: "Not deductible (Shafi'i)." },
                ],
                required: true,
                group: "Commercial Debt",
                groupIcon: Briefcase,
            },
            {
                path: "liabilities.personal_debt.deductible",
                type: "boolean",
                description: "Master switch: whether personal debts can be deducted at all.",
                required: true,
                group: "Personal Debt",
                groupIcon: Bank,
            },
            {
                path: "liabilities.personal_debt.cap",
                type: "enum",
                description: "Maximum cap on total personal debt deduction.",
                options: [
                    { value: "none", label: "No cap — deduct full qualifying debt amount." },
                    { value: "total_assets", label: "Capped at total assets — debt deduction cannot exceed total asset value." },
                    { value: "total_cash", label: "Capped at total cash — debt deduction cannot exceed liquid cash holdings." },
                ],
                required: false,
                group: "Personal Debt",
            },
            {
                path: "liabilities.personal_debt.types.housing",
                type: "enum",
                description: "How mortgage/housing payments are deducted.",
                options: [
                    { value: "full", label: "Annual approximation (12 months of payments)." },
                    { value: "12_months", label: "12 months of mortgage payments." },
                    { value: "current_due", label: "Only this month's mortgage payment." },
                    { value: "none", label: "Not deductible." },
                ],
                required: false,
                group: "Personal Debt",
                helpText: "mortgageDeduction",
            },
            {
                path: "liabilities.personal_debt.types.student_loans",
                type: "enum",
                description: "How student loan debt is deducted.",
                options: [
                    { value: "full", label: "Total amount due." },
                    { value: "current_due", label: "Only current payment due." },
                    { value: "none", label: "Not deductible." },
                ],
                required: false,
                group: "Personal Debt",
                helpText: "studentLoans",
            },
            {
                path: "liabilities.personal_debt.types.credit_cards",
                type: "enum",
                description: "How credit card balance is deducted. Credit cards are due immediately by nature.",
                options: [
                    { value: "full", label: "Full outstanding balance (due immediately)." },
                    { value: "none", label: "Not deductible." },
                ],
                required: false,
                group: "Personal Debt",
            },
            {
                path: "liabilities.personal_debt.types.living_expenses",
                type: "enum",
                description: "How recurring living expenses (rent, utilities, food) are deducted.",
                options: [
                    { value: "full", label: "Annualized (12 months of monthly expenses)." },
                    { value: "12_months", label: "12 months of expenses." },
                    { value: "current_due", label: "Only this month's expenses." },
                    { value: "none", label: "Not deductible." },
                ],
                required: false,
                group: "Personal Debt",
                helpText: "monthlyLiving",
            },
            {
                path: "liabilities.personal_debt.types.insurance",
                type: "enum",
                description: "How insurance premiums are deducted.",
                options: [
                    { value: "full", label: "Annual premium." },
                    { value: "current_due", label: "Only current payment due." },
                    { value: "none", label: "Not deductible." },
                ],
                required: false,
                group: "Personal Debt",
            },
            {
                path: "liabilities.personal_debt.types.unpaid_bills",
                type: "enum",
                description: "How unpaid utility/service bills are deducted.",
                options: [
                    { value: "full", label: "All outstanding bills." },
                    { value: "none", label: "Not deductible." },
                ],
                required: false,
                group: "Personal Debt",
            },
            {
                path: "liabilities.personal_debt.types.taxes",
                type: "enum",
                description: "How tax obligations (property tax, late taxes) are deducted.",
                options: [
                    { value: "full", label: "All due taxes." },
                    { value: "current_due", label: "Only taxes currently payable." },
                    { value: "none", label: "Not deductible." },
                ],
                required: false,
                group: "Personal Debt",
            },
            {
                path: "liabilities.tooltip",
                type: "string",
                description: "User-facing guidance text displayed in the calculator UI for the Liabilities section. Config authors should write clear, concise summaries that help end-users understand the ruling.",
                required: false,
                group: "Liabilities",
                category: "content",
            },
        ],
    },
];
