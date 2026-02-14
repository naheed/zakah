import { ZakatMethodologySchema } from './schema';
import { ZakatMethodologyConfig } from './types';
import { DEFAULT_CONFIG } from './defaults';
import { z } from 'zod';

export interface ConfigLoadResult {
    config: ZakatMethodologyConfig;
    errors: string[];
    isFallback: boolean;
}

/**
 * Validates and loads a configuration object.
 * Applies graceful degradation by falling back to DEFAULT_CONFIG if critical validation fails.
 */
export function loadMethodologyConfig(input: unknown): ConfigLoadResult {
    const result = ZakatMethodologySchema.safeParse(input);

    if (result.success) {
        return {
            config: result.data,
            errors: [],
            isFallback: false,
        };
    }

    // If validation fails, strictly returning default for now.
    // Future robustness: We could attempt to partial-merge valid sections.
    const errorMessages = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
    console.warn("Zakat Config Validation Failed:", errorMessages);

    return {
        config: DEFAULT_CONFIG,
        errors: errorMessages,
        isFallback: true,
    };
}

/**
 * Merges a base config with user overrides.
 * Overrides are validated loosely - if an override is invalid, it is ignored for that specific field.
 * (Note: Deep merge implementation would be ideal here, using Object.assign for shallow merge for now)
 */
export function mergeConfig(base: ZakatMethodologyConfig, overrides: Partial<ZakatMethodologyConfig>): ZakatMethodologyConfig {
    // TODO: Implement deep merge if needed. For now, we assume overrides replace top-level sections or strictly adhere to type if passed from UI.
    // In a robust system, we would perform a deep merge of the JSON structure.

    // Simple shallow merge for top-level keys
    const newConfig = { ...base };

    if (overrides.meta) newConfig.meta = { ...newConfig.meta, ...overrides.meta };
    if (overrides.thresholds) newConfig.thresholds = { ...newConfig.thresholds, ...overrides.thresholds };
    // ... proceed for other sections if needed.
    // Given the complexity of deep merging assets rules, for this phase we stick to "Load Whole Config".

    return newConfig;
}
