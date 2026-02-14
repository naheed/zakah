import { ZakatMethodologyConfig } from '../types';
import { DEFAULT_CONFIG } from '../defaults';
import { HANAFI_CONFIG } from './hanafi';
import { SHAFII_CONFIG } from './shafii';
import { MALIKI_CONFIG } from './maliki';
import { HANBALI_CONFIG } from './hanbali';
import { AMJA_CONFIG } from './amja';
import { TAHIR_ANWAR_CONFIG } from './tahir_anwar';
import { QARADAWI_CONFIG } from './qaradawi';

// =============================================================================
// ZMCS Preset Registry
// =============================================================================
// All registered methodology configurations, keyed by Madhab identifier.
// The key MUST match the Madhab type in zakatTypes.ts.

export const ZAKAT_PRESETS: Record<string, ZakatMethodologyConfig> = {
    // Modern scholarly methodologies
    'balanced': DEFAULT_CONFIG,
    'amja': AMJA_CONFIG,
    'tahir_anwar': TAHIR_ANWAR_CONFIG,
    'qaradawi': QARADAWI_CONFIG,

    // Classical madhabs
    'hanafi': HANAFI_CONFIG,
    'shafii': SHAFII_CONFIG,
    'maliki': MALIKI_CONFIG,
    'hanbali': HANBALI_CONFIG,
};

/** All available preset configurations as an array. */
export const AVAILABLE_PRESETS = Object.values(ZAKAT_PRESETS);

/** Valid preset identifiers. */
export type PresetId = keyof typeof ZAKAT_PRESETS;
