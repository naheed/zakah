
import { Coins, Bank, Gavel, Scales, Calculator, Scroll, Buildings, Wallet, UserMinus, Icon, CurrencyBtc, HouseLine, Briefcase, ChartLineUp, PiggyBank, HandCoins } from "@phosphor-icons/react";

// =============================================================================
// ZMCS UI Documentation Content (v2.0)
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
    options?: { value: string; label: string }[];
    default?: string;
    required: boolean;
    group?: string;
    groupIcon?: Icon;
    /** Key in fiqhExplanations linking this config field to its user-facing WhyTooltip. */
    helpText?: string;
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
                description: "Unique slug identifier for this configuration (e.g., 'hanafi-standard-v2'). Must be URL-safe.",
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
                description: "Semantic version of this config file (e.g., '2.0.0'). Tracks rule changes over time.",
                required: true,
            },
            {
                path: "meta.zmcs_version",
                type: "string",
                description: "ZMCS schema version this config targets. Enables forward-compatibility checking.",
                default: "2.0.0",
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
                path: "meta.certification.url",
                type: "string (url)",
                description: "Link to the public fatwa, paper, or official ruling document.",
                required: false,
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

            // ── Precious Metals / Jewelry ──
            {
                path: "assets.precious_metals.jewelry.zakatable",
                type: "boolean",
                description: "Whether personal-use gold/silver jewelry is subject to Zakat. MAJOR DIVERGENCE: Hanafi/Bradford = Yes, Majority (Shafi'i/Maliki/Hanbali/AMJA) = No.",
                required: true,
                group: "Precious Metals",
                groupIcon: Coins,
                helpText: "jewelryExemption",
            },
            {
                path: "assets.precious_metals.jewelry.scholarly_basis",
                type: "string",
                description: "Scholarly evidence for the jewelry ruling (hadith, fiqh reference).",
                required: false,
                group: "Precious Metals",
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
                path: "assets.crypto.staking.vested_only",
                type: "boolean",
                description: "If true, only vested (claimable) staking rewards are counted. Unvested/locked rewards excluded.",
                default: "true",
                required: true,
                group: "Cryptocurrency",
                helpText: "stakedAssets",
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
                description: "Zakatable portion of passive investment market value. MAJOR DIVERGENCE: 1.0 = classical, 0.30 = Bradford proxy, 0.0 = AMJA income-only.",
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
                path: "assets.investments.dividends.deduct_purification",
                type: "boolean",
                description: "If true, the haram purification percentage is deducted from dividends before Zakat calculation.",
                required: true,
                group: "Investments",
            },

            // ── REITs ──
            {
                path: "assets.investments.reits_rate",
                type: "number (0-1)",
                description: "Zakat rate on Equity REITs. Usually follows passive investment rate. Avoid Mortgage REITs (Shariah compliance concern).",
                required: true,
                group: "Investments",
            },

            // ── Retirement ──
            {
                path: "assets.retirement.zakatability",
                type: "enum",
                description: "Primary method for calculating zakatable amount of 401(k)/IRA retirement accounts. MOST DIVERGENT PARAMETER across methodologies.",
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

            // ── Real Estate ──
            {
                path: "assets.real_estate.rental_property.zakatable",
                type: "boolean",
                description: "Whether rental property market value itself is zakatable. Usually false (exploited asset — only income is zakatable).",
                required: true,
                group: "Real Estate",
                groupIcon: HouseLine,
            },
            {
                path: "assets.real_estate.rental_property.income_zakatable",
                type: "boolean",
                description: "Whether net rental income (in bank) is zakatable. Usually true.",
                required: true,
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
                path: "assets.real_estate.land_banking.zakatable",
                type: "boolean",
                description: "Whether undeveloped land held for long-term appreciation is zakatable.",
                required: true,
                group: "Real Estate",
            },

            // ── Business ──
            {
                path: "assets.business.inventory_rate",
                type: "number (0-1)",
                description: "Zakat rate on business inventory (raw materials, finished goods for sale).",
                default: "1.0",
                required: true,
                group: "Business",
                groupIcon: Briefcase,
            },
            {
                path: "assets.business.fixed_assets_rate",
                type: "number (0-1)",
                description: "Zakat rate on fixed business assets (equipment, machinery, vehicles). Usually 0.0 (not zakatable).",
                default: "0.0",
                required: true,
                group: "Business",
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
                path: "assets.debts_owed_to_user.bad_debt_on_recovery",
                type: "boolean",
                description: "If true, bad debts only become zakatable when actually recovered (pay Zakat on recovery year).",
                required: true,
                group: "Debts Owed",
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
        ],
    },
];
