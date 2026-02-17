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

import { ZakatMethodologyConfig } from '../types';
import { bradford } from './bradford';
import { HANAFI_CONFIG } from './hanafi';
import { SHAFII_CONFIG } from './shafii';
import { MALIKI_CONFIG } from './maliki';
import { HANBALI_CONFIG } from './hanbali';
import { AMJA_CONFIG } from './amja';
import { TAHIR_ANWAR_CONFIG } from './tahir_anwar';
import { QARADAWI_CONFIG } from './qaradawi';

export { bradford, HANAFI_CONFIG, SHAFII_CONFIG, MALIKI_CONFIG, HANBALI_CONFIG, AMJA_CONFIG, TAHIR_ANWAR_CONFIG, QARADAWI_CONFIG };

// =============================================================================
// ZMCS Preset Registry
// =============================================================================
// All registered methodology configurations, keyed by Madhab identifier.
// The key MUST match the Madhab type in zakatTypes.ts.

export const ZAKAT_PRESETS: Record<string, ZakatMethodologyConfig> = {
    // Modern scholarly methodologies
    'bradford': bradford,
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
