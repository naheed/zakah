/**
 * Wizard Step Content
 *
 * Re-exports all step content from the centralized zakatContent module.
 * This consolidates content access through src/content/ while preserving
 * the existing rich educational content.
 *
 * Note: zakatContent.ts contains extensive educational text based on
 * Islamic scholarship. During Phase 2 (Rewrite), this content will be
 * audited against CONTENT_STANDARDS.md for "Dignified Guide" voice.
 */

// Re-export all step content from zakatContent.ts
export * from '@/lib/zakatContent';

// Type re-exports for convenience
export type { StepContent, FieldContent } from '@/lib/zakatContent';
