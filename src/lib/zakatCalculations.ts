// Zakat Calculation Logic based on Sheikh Joe Bradford's methodology

import { ZakatFormData, ZakatCalculationResult, AssetBreakdown, EnhancedAssetBreakdown } from './zakatTypes';
import { calculateTotalAssets, calculateAssetBreakdown, calculateEnhancedAssetBreakdown } from './calculators/assets';
import { calculateTotalLiabilities } from './calculators/liabilities';
import { calculateNisab, ZAKAT_RATE, SOLAR_ZAKAT_RATE, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE } from './calculators/utils';

export * from './zakatTypes';
export * from './madhahRules';
export * from './calculators/utils';
export * from './calculators/assets';
export * from './calculators/liabilities';

export function calculateZakat(
  data: ZakatFormData,
  silverPrice: number = SILVER_PRICE_PER_OUNCE,
  goldPrice: number = GOLD_PRICE_PER_OUNCE
): {
  totalAssets: number;
  totalLiabilities: number;
  netZakatableWealth: number;
  nisab: number;
  isAboveNisab: boolean;
  zakatDue: number;
  zakatRate: number;
  interestToPurify: number;
  dividendsToPurify: number;
  assetBreakdown: AssetBreakdown;
  enhancedBreakdown: EnhancedAssetBreakdown;
} {
  const totalAssets = calculateTotalAssets(data);
  const totalLiabilities = calculateTotalLiabilities(data);
  const netZakatableWealth = Math.max(0, totalAssets - totalLiabilities);
  const nisab = calculateNisab(silverPrice, goldPrice, data.nisabStandard);
  const isAboveNisab = netZakatableWealth >= nisab;

  const zakatRate = data.calendarType === 'solar' ? SOLAR_ZAKAT_RATE : ZAKAT_RATE;
  const zakatDue = isAboveNisab ? netZakatableWealth * zakatRate : 0;

  // Purification amounts
  const interestToPurify = data.interestEarned;
  const dividendsToPurify = data.dividends * (data.dividendPurificationPercent / 100);

  // Calculate breakdown for visualization
  const assetBreakdown = calculateAssetBreakdown(data);

  // Enhanced breakdown for PDF v2 (with percentages and granular categories)
  const enhancedBreakdown = calculateEnhancedAssetBreakdown(data, netZakatableWealth);

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
