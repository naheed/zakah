import { z } from 'zod';

// --- ZMCS: Zakat Methodology Configuration Standard ---
// Schema Definition v1.0.0

// 1. Meta Section
export const MetaSchema = z.object({
    id: z.string().describe("Unique identifier for this configuration (e.g., 'hanafi-standard-v1')"),
    name: z.string().describe("Human-readable name of the methodology"),
    version: z.string().describe("Semantic version of this config file"),
    author: z.string().describe("Author or organization name"),
    description: z.string().describe("Brief description of the methodology's key characteristics"),
    certification: z.object({
        certified_by: z.string().optional(),
        date: z.string().optional(),
        url: z.string().optional().describe("URL to the fatwa or source document"),
    }).optional(),
});

// 2. Thresholds Section
export const ThresholdsSchema = z.object({
    nisab: z.object({
        default_standard: z.enum(['gold', 'silver']).describe("Default standard to use (usually silver)"),
        gold_grams: z.number().min(0).describe("Nisab threshold in grams of gold (usually 85g or 87.48g)"),
        silver_grams: z.number().min(0).describe("Nisab threshold in grams of silver (usually 595g or 612.36g)"),
    }),
    zakat_rate: z.object({
        lunar: z.number().min(0).max(1).describe("Zakat rate for lunar year (usually 0.025)"),
        solar: z.number().min(0).max(1).describe("Zakat rate for solar year (usually 0.02577)"),
    }),
});

// 3. Assets Section
export const AssetsSchema = z.object({
    cash: z.object({
        zakatable: z.boolean(),
        rate: z.number().min(0).max(1),
        description: z.string().optional(),
    }),
    precious_metals: z.object({
        investment_gold_rate: z.number().min(0).max(1),
        investment_silver_rate: z.number().min(0).max(1),
        jewelry: z.object({
            zakatable: z.boolean(),
            conditions: z.array(z.string()).optional(),
            rate: z.number().min(0).max(1),
            description: z.string().optional(),
        }),
    }),
    crypto: z.object({
        currency_rate: z.number().min(0).max(1),
        trading_rate: z.number().min(0).max(1),
        staking: z.object({
            principal_rate: z.number().min(0).max(1),
            rewards_rate: z.number().min(0).max(1),
            vested_only: z.boolean(),
        }),
    }),
    investments: z.object({
        active_trading_rate: z.number().min(0).max(1),
        passive_investments: z.object({
            rate: z.number().min(0).max(1).describe("Portion of value that is zakatable (e.g. 1.0 or 0.30)"),
            description: z.string().optional(),
        }),
        reits_rate: z.number().min(0).max(1),
        dividends: z.object({
            zakatable: z.boolean(),
            deduct_purification: z.boolean(),
        }),
    }),
    retirement: z.object({
        zakatability: z.enum(['full', 'net_accessible', 'deferred_upon_access', 'conditional_age', 'exempt']).describe("Method for calculating zakatable amount"),
        pension_vested_rate: z.number().min(0).max(1).optional(),
        exemption_age: z.number().optional().describe("Age below which funds are exempt (if method is conditional_age)"),
        penalty_rate: z.number().min(0).max(1).optional(),
        tax_rate_source: z.enum(['user_input', 'flat_rate']).optional(),
        description: z.string().optional(),
    }),
    real_estate: z.object({
        primary_residence: z.object({ zakatable: z.boolean() }),
        rental_property: z.object({ zakatable: z.boolean(), income_zakatable: z.boolean() }),
        for_sale: z.object({ zakatable: z.boolean(), rate: z.number().min(0).max(1) }),
        land_banking: z.object({ zakatable: z.boolean(), rate: z.number().min(0).max(1) }),
    }),
    business: z.object({
        cash_receivables_rate: z.number().min(0).max(1),
        inventory_rate: z.number().min(0).max(1),
        fixed_assets_rate: z.number().min(0).max(1),
    }),
    debts_owed_to_user: z.object({
        good_debt_rate: z.number().min(0).max(1),
        bad_debt_rate: z.number().min(0).max(1),
        bad_debt_on_recovery: z.boolean(),
    }),
    illiquid_assets: z.object({
        rate: z.number().min(0).max(1).default(1.0),
        description: z.string().optional(),
    }).optional(),
    trusts: z.object({
        revocable_rate: z.number().min(0).max(1).default(1.0),
        irrevocable_rate: z.number().min(0).max(1).default(1.0),
        description: z.string().optional(),
    }).optional()
});

// 4. Liabilities Section
export const LiabilitiesSchema = z.object({
    method: z.enum(['full_deduction', 'no_deduction', '12_month_rule', 'asset_specific']).describe("Global philosophy on debt deduction"),
    commercial_debt: z.enum(['fully_deductible', 'deductible_from_business_assets', 'none']),
    personal_debt: z.object({
        deductible: z.boolean(),
        cap: z.enum(['none', 'total_assets', 'total_cash']).optional(),
        types: z.object({
            housing: z.enum(['full', '12_months', 'none']),
            expense_period: z.enum(['monthly', 'annual']).default('annual').describe("Whether to deduct 1 month or 12 months of expenses"),
            student_loans: z.enum(['full', 'current_due', 'none']),
            credit_cards: z.enum(['full', 'none']),
            living_expenses: z.enum(['full', '12_months', 'none']),
        }).optional(),
    }),
});

// 5. Root Configuration Schema
export const ZakatMethodologySchema = z.object({
    $schema: z.string().optional(),
    meta: MetaSchema,
    thresholds: ThresholdsSchema,
    assets: AssetsSchema,
    liabilities: LiabilitiesSchema,
    exemptions: z.record(z.any()).optional().describe("Placeholder for future custom exemptions"),
});
