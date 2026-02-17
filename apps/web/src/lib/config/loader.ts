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

import { ZakatMethodologySchema } from './schema';
import { ZakatMethodologyConfig } from './types';
import { DEFAULT_CONFIG } from './defaults';
import { z } from 'zod';

// =============================================================================
// ZMCS Configuration Loader
// =============================================================================
//
// Validates, loads, and merges ZMCS configuration objects. This module provides
// the runtime entry point for consuming ZMCS configs — whether from presets,
// user-uploaded JSON, or API responses.
//

export interface ConfigLoadResult {
    /** The validated (or fallback) configuration. */
    config: ZakatMethodologyConfig;
    /** Validation error messages (empty if valid). */
    errors: string[];
    /** Whether the DEFAULT_CONFIG was used as a fallback due to validation failure. */
    isFallback: boolean;
}

/**
 * Validates and loads a configuration object.
 *
 * If the input passes ZMCS schema validation, it is returned directly.
 * If validation fails, the DEFAULT_CONFIG is returned as a safe fallback,
 * and the specific validation errors are included for logging/display.
 *
 * @param input - Raw configuration object (e.g., from JSON.parse or an API response).
 * @returns ConfigLoadResult with the validated config, any errors, and fallback status.
 *
 * @example
 * ```typescript
 * const raw = JSON.parse(userUploadedJson);
 * const { config, errors, isFallback } = loadMethodologyConfig(raw);
 * if (isFallback) {
 *   console.warn('Invalid config, using defaults:', errors);
 * }
 * ```
 */
export function loadMethodologyConfig(input: unknown): ConfigLoadResult {
    const result = ZakatMethodologySchema.safeParse(input);

    if (result.success) {
        console.log(`[ZMCS Loader] Successfully loaded config: ${result.data.meta.id} v${result.data.meta.version}`);
        return {
            config: result.data,
            errors: [],
            isFallback: false,
        };
    }

    // Validation failed — return safe fallback
    const errorMessages = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
    console.warn('[ZMCS Loader] Validation failed, using DEFAULT_CONFIG fallback:', errorMessages);

    return {
        config: DEFAULT_CONFIG,
        errors: errorMessages,
        isFallback: true,
    };
}

/**
 * Merges a base config with partial overrides.
 *
 * Performs a shallow merge at the top-level section level. For deep section
 * overrides (e.g., changing a single asset rule), the override must include
 * the complete section object.
 *
 * @param base - The complete base configuration.
 * @param overrides - Partial overrides to apply on top of the base.
 * @returns A new merged configuration object.
 *
 * @example
 * ```typescript
 * const custom = mergeConfig(ZAKAT_PRESETS['bradford'], {
 *   assets: {
 *     ...ZAKAT_PRESETS['balanced'].assets,
 *     precious_metals: {
 *       ...ZAKAT_PRESETS['balanced'].assets.precious_metals,
 *       jewelry: { zakatable: false, rate: 1.0 },
 *     },
 *   },
 * });
 * ```
 */
export function mergeConfig(
    base: ZakatMethodologyConfig,
    overrides: Partial<ZakatMethodologyConfig>
): ZakatMethodologyConfig {
    const merged: ZakatMethodologyConfig = {
        ...base,
        meta: overrides.meta ? { ...base.meta, ...overrides.meta } : base.meta,
        thresholds: overrides.thresholds ? { ...base.thresholds, ...overrides.thresholds } : base.thresholds,
        assets: overrides.assets ? { ...base.assets, ...overrides.assets } : base.assets,
        liabilities: overrides.liabilities ? { ...base.liabilities, ...overrides.liabilities } : base.liabilities,
    };

    return merged;
}

/**
 * Validates a configuration without loading it.
 * Useful for validating user-authored configs before persisting.
 *
 * @param input - Raw configuration to validate.
 * @returns Object with isValid flag and any error messages.
 */
export function validateConfig(input: unknown): { isValid: boolean; errors: string[] } {
    const result = ZakatMethodologySchema.safeParse(input);
    if (result.success) {
        return { isValid: true, errors: [] };
    }
    return {
        isValid: false,
        errors: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
    };
}
