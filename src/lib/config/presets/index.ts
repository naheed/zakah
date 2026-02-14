import { ZakatMethodologyConfig } from '../types';
import { DEFAULT_CONFIG } from '../defaults';
import { HANAFI_CONFIG } from './hanafi';
import { SHAFII_CONFIG } from './shafii';
import { MALIKI_CONFIG } from './maliki';
import { HANBALI_CONFIG } from './hanbali';

export const ZAKAT_PRESETS: Record<string, ZakatMethodologyConfig> = {
    'balanced': DEFAULT_CONFIG,
    'hanafi': HANAFI_CONFIG,
    'shafii': SHAFII_CONFIG,
    'maliki': MALIKI_CONFIG,
    'hanbali': HANBALI_CONFIG
};

export const AVAILABLE_PRESETS = Object.values(ZAKAT_PRESETS);

export type PresetId = keyof typeof ZAKAT_PRESETS;
