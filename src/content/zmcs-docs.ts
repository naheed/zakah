
import { LucideIcon, Coins, Landmark, Gavel, Scale, Calculator, ScrollText, Building2, Wallet, UserMinus } from "lucide-react";

export interface ZMCSField {
    path: string;
    type: string;
    description: string;
    options?: { value: string; label: string }[];
    default?: string;
    required: boolean;
}

export interface ZMCSSection {
    id: string;
    title: string;
    icon?: any; // LucideIcon type mismatch workaround if needed
    description: string;
    fields: ZMCSField[];
}

export const ZMCS_DOCS: ZMCSSection[] = [
    {
        id: "meta",
        title: "Metadata",
        icon: ScrollText,
        description: "Standard identifiers for versioning and attribution of the methodology.",
        fields: [
            {
                path: "meta.id",
                type: "string",
                description: "Unique slug identifier for this configuration (e.g., 'hanafi-standard-v1'). Must be URL-safe.",
                required: true
            },
            {
                path: "meta.name",
                type: "string",
                description: "Human-readable display title for the methodology.",
                required: true
            },
            {
                path: "meta.version",
                type: "string",
                description: "Semantic version string (e.g., '1.0.0'). Identifies changes to rules over time.",
                required: true
            },
            {
                path: "meta.author",
                type: "string",
                description: "Organization or scholar name responsible for this configuration.",
                required: true
            },
            {
                path: "meta.certification.url",
                type: "string (url)",
                description: "Link to the public fatwa, PDF, or official page verifying these rules.",
                required: false
            }
        ]
    },
    {
        id: "thresholds",
        title: "Thresholds",
        icon: Scale,
        description: "Base constants defining the minimum zakatable wealth (Nisab) and tax rates.",
        fields: [
            {
                path: "thresholds.nisab.default_standard",
                type: "enum",
                description: "Which metal price sets the poverty line (Nisab).",
                options: [
                    { value: "silver", label: "Silver (Preferred). Lower threshold (~$400), safer for the poor." },
                    { value: "gold", label: "Gold. Higher threshold (~$6,000), exempts more people." }
                ],
                required: true
            },
            {
                path: "thresholds.zakat_rate.lunar",
                type: "number",
                description: "Tax rate for Hijri (Lunar) calendar year.",
                default: "0.025 (2.5%)",
                required: true
            },
            {
                path: "thresholds.zakat_rate.solar",
                type: "number",
                description: "Tax rate adjusted for Gregorian (Solar) year length (11 days longer).",
                default: "0.02577 (2.577%)",
                required: true
            }
        ]
    },
    {
        id: "assets",
        title: "Assets",
        icon: Coins,
        description: "Rules determining zakatability and valuation for each asset class.",
        fields: [
            {
                path: "assets.cash.zakatable",
                type: "boolean",
                description: "Whether cash on hand / checking accounts are zakatable.",
                default: "true",
                required: true
            },
            {
                path: "assets.precious_metals.jewelry.zakatable",
                type: "boolean",
                description: "Whether personal jewelry is subject to Zakat. (Hanafi: True, Majority: False)",
                required: true
            },
            {
                path: "assets.crypto.staking.vested_only",
                type: "boolean",
                description: "If true, only vested staking rewards are counted.",
                default: "true",
                required: true
            },
            {
                path: "assets.business.inventory_rate",
                type: "number (0-1)",
                description: "Zakat rate on business inventory (usually 1.0).",
                required: true
            },
            {
                path: "assets.business.fixed_assets_rate",
                type: "number (0-1)",
                description: "Zakat rate on fixed assets/equipment (usually 0.0).",
                required: true
            },
            {
                path: "assets.retirement.zakatability",
                type: "enum",
                description: "Method for calculating Zakatable amount of 401(k)/IRA accounts.",
                options: [
                    { value: "full", label: "100% of vested balance (Strong Ownership view)." },
                    { value: "net_accessible", label: "Balance minus taxes and penalties (AMJA Standard)." },
                    { value: "conditional_age", label: "Exempt if under age (e.g. 59.5), Net Accessible if over (Bradford view)." },
                    { value: "deferred_upon_access", label: "Zakat due only when funds are withdrawn (Mal Dimar)." },
                    { value: "exempt", label: "Fully exempt." }
                ],
                required: true
            },
            {
                path: "assets.retirement.exemption_age",
                type: "number",
                description: "Age threshold for 'conditional_age' rule. Usually 59.5 (US rules).",
                required: false
            },
            {
                path: "assets.investments.active_trading_rate",
                type: "number (0-1)",
                description: "Zakat rate on actively traded investments (Day Trading). Usually 1.0.",
                required: true
            },
            {
                path: "assets.investments.passive_investments.rate",
                type: "number (0-1)",
                description: "Proxy rate for underlying zakatable assets in stocks/funds. 0.3 = 30% Rule.",
                required: true
            },
            {
                path: "assets.investments.dividends.deduct_purification",
                type: "boolean",
                description: "If true, allows deducting the haram portion of dividends before Zakat.",
                required: true
            },
            {
                path: "assets.real_estate.rental_property.zakatable",
                type: "boolean",
                description: "True if the property value itself is zakatable (not just income). Usually False.",
                required: true
            },
            {
                path: "assets.real_estate.for_sale.zakatable",
                type: "boolean",
                description: "True if property is listed for sale (intent to sell).",
                required: true
            },
            {
                path: "assets.real_estate.land_banking.zakatable",
                type: "boolean",
                description: "True if holding land for long-term appreciation.",
                required: true
            },
            {
                path: "assets.debts_owed_to_user.good_debt_rate",
                type: "number (0-1)",
                description: "Rate for debts likely to be repaid (Good Debt). Usually 1.0.",
                required: true
            },
            {
                path: "assets.illiquid_assets.rate",
                type: "number (0-1)",
                description: "Zakat rate on other illiquid assets.",
                required: true
            },
            {
                path: "assets.trusts.revocable_rate",
                type: "number (0-1)",
                description: "Zakat rate on revocable trusts (grantor usually owns).",
                required: true
            }
        ]
    },
    {
        id: "liabilities",
        title: "Liabilities",
        icon: UserMinus,
        description: "Rules for deducting debts from Wealth.",
        fields: [
            {
                path: "liabilities.method",
                type: "enum",
                description: "Global philosophy on debt deduction.",
                options: [
                    { value: "full_deduction", label: "All debts are deductible (Hanafi)." },
                    { value: "no_deduction", label: "No debts prevent Zakat (Shafi'i)." },
                    { value: "12_month_rule", label: "Only debts due in coming 12 months (Maliki/Modern)." }
                ],
                required: true
            },
            {
                path: "liabilities.commercial_debt",
                type: "enum",
                description: "How business debts are handled.",
                options: [
                    { value: "fully_deductible", label: "Deductible against all wealth." },
                    { value: "deductible_from_business_assets", label: "Only deductible against business assets." },
                    { value: "none", label: "Not deductible." }
                ],
                required: true
            },
            {
                path: "liabilities.personal_debt.deductible",
                type: "boolean",
                description: "Master switch to allow personal debt deduction.",
                required: true
            },
            {
                path: "liabilities.personal_debt.types.expense_period",
                type: "enum",
                description: "For recurring expenses (rent/utilities), how many months to deduct.",
                options: [
                    { value: "monthly", label: "Deduct only the current month's bill." },
                    { value: "annual", label: "Deduct 12 months of expenses (Annualized)." }
                ],
                required: false
            }
        ]
    }
];
