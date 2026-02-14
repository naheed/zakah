import { z } from 'zod';
import { ZakatMethodologySchema, MetaSchema, AssetsSchema, LiabilitiesSchema, ThresholdsSchema } from './schema';

// =============================================================================
// ZMCS TypeScript Types — Inferred from Zod Schema
// =============================================================================
// These types are the canonical TypeScript representation of ZMCS configurations.
// Always use these types (never hand-craft interfaces) to ensure schema-type parity.

/** Complete ZMCS configuration object. */
export type ZakatMethodologyConfig = z.infer<typeof ZakatMethodologySchema>;

/** Metadata section of a ZMCS config. */
export type MethodologyMeta = z.infer<typeof MetaSchema>;

/** Asset rules section of a ZMCS config. */
export type MethodologyAssets = z.infer<typeof AssetsSchema>;

/** Liability rules section of a ZMCS config. */
export type MethodologyLiabilities = z.infer<typeof LiabilitiesSchema>;

/** Threshold rules section of a ZMCS config. */
export type MethodologyThresholds = z.infer<typeof ThresholdsSchema>;

/**
 * Passive investment treatment philosophy.
 * - 'market_value': Classical view — rate applies to full market value.
 * - 'underlying_assets': Proxy view — rate estimates underlying zakatable company assets (AAOIFI 30% rule).
 * - 'income_only': Exploited-asset view — only dividends/income are zakatable, not principal (AMJA).
 */
export type PassiveInvestmentTreatment = 'market_value' | 'underlying_assets' | 'income_only';

/**
 * Retirement zakatability method.
 */
export type RetirementZakatability = 'full' | 'net_accessible' | 'conditional_age' | 'deferred_upon_access' | 'exempt';

/**
 * Post-threshold retirement calculation method (for conditional_age).
 */
export type PostThresholdMethod = 'net_accessible' | 'proxy_rate' | 'full';

/**
 * Global debt deduction philosophy.
 */
export type DebtMethod = 'full_deduction' | 'no_deduction' | '12_month_rule' | 'current_due_only';
