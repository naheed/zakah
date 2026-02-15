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
// Re-export all step content from zakatGuide.ts
export * from './zakatGuide';

// Type re-exports for convenience
export type { StepContent, FieldContent } from './zakatGuide';
