// Zakat Calculation Logic based on Sheikh Joe Bradford's methodology

import { ZakatFormData, ZakatCalculationResult, AssetBreakdown, EnhancedAssetBreakdown } from './zakatTypes';
import { calculateTotalAssets, calculateAssetBreakdown, calculateEnhancedAssetBreakdown } from './calculators/assets';
import { calculateTotalLiabilities } from './calculators/liabilities';
import { calculateNisab, SILVER_PRICE_PER_OUNCE as DEFAULT_SILVER, GOLD_PRICE_PER_OUNCE as DEFAULT_GOLD } from './calculators/utils'; // Alias to avoid shadowing export *
import { ZakatMethodologyConfig } from './config/types';
import { DEFAULT_CONFIG } from './config/defaults';
import { ZAKAT_PRESETS } from './config/presets';

export * from './zakatTypes';
export * from './config/types';
export * from './calculators/assets';
export * from './calculators/liabilities';
export {
  formatCurrency,
  SILVER_PRICE_PER_OUNCE,
  GOLD_PRICE_PER_OUNCE,
  calculateNisab,
  ZAKAT_RATE,
  SOLAR_ZAKAT_RATE
} from './calculators/utils';

export function calculateZakat(
  data: ZakatFormData,
  silverPrice: number = DEFAULT_SILVER,
  goldPrice: number = DEFAULT_GOLD,
  config?: ZakatMethodologyConfig
): ZakatCalculationResult {
  // 1. Resolve Configuration
  // Priority: Explicit Config > Preset for Madhab > Default
  const effectiveConfig = config || ZAKAT_PRESETS[data.madhab] || DEFAULT_CONFIG;

  // 2. Calculate Components using Config
  const totalAssets = calculateTotalAssets(data, effectiveConfig);
  const totalLiabilities = calculateTotalLiabilities(data, effectiveConfig);
  const netZakatableWealth = Math.max(0, totalAssets - totalLiabilities);

  // 3. Nisab Logic
  // Use thresholds from config
  const nisabStandard = effectiveConfig.thresholds.nisab.default_standard;
  // Should we respect data.nisabStandard user override? Yes.
  const effectiveNisabStandard = data.nisabStandard || nisabStandard;

  const nisab = calculateNisab(silverPrice, goldPrice, effectiveNisabStandard);
  const isAboveNisab = netZakatableWealth >= nisab;

  // 4. Rate Logic
  const zakatRate = data.calendarType === 'solar'
    ? effectiveConfig.thresholds.zakat_rate.solar
    : effectiveConfig.thresholds.zakat_rate.lunar;

  const zakatDue = isAboveNisab ? netZakatableWealth * zakatRate : 0;

  // Purification amounts
  const interestToPurify = data.interestEarned;
  const dividendsToPurify = data.dividends * (data.dividendPurificationPercent / 100);

  // Calculate breakdown for visualization
  const assetBreakdown = calculateAssetBreakdown(data, effectiveConfig);

  // Enhanced breakdown for PDF v2 (with percentages and granular categories)
  const enhancedBreakdown = calculateEnhancedAssetBreakdown(data, netZakatableWealth, effectiveConfig);

  return {
    totalAssets,
    totalLiabilities,
    netZakatableWealth,
    nisab,
    isAboveNisab,
    zakatDue,
    zakatRate,
    interestToPurify,
    dividendsToPurify,
    assetBreakdown,
    enhancedBreakdown,
  };
}

