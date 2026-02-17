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

// =============================================================================
// Zakat Calculation Engine (ZMCS v1.0.1 — Multi-Rate Support)
// =============================================================================
//
// This is the main entry point for Zakat calculation. It orchestrates:
//   1. Configuration resolution (explicit config > madhab preset > default)
//   2. Asset calculation (via ZMCS config-driven calculators)
//   3. Liability deduction
//   4. Nisab threshold comparison
//   5. Multi-rate Zakat calculation
//
// v1.0.1 Multi-Rate Architecture:
// ─────────────────────────────
// Some methodologies apply different Zakat rates to specific asset classes.
// For example, Al-Qaradawi applies 10% to net rental income (agricultural
// analogy from Fiqh al-Zakah) instead of the global 2.5%.
//
// Instead of a single zakatDue = netWealth × globalRate, the engine now:
//   1. Identifies assets with rate overrides (calculateRateOverrides)
//   2. Removes those assets from the standard pool
//   3. Applies the override rate to each override pool
//   4. Applies the global rate to the remaining standard pool
//
//   standardZakat = max(0, netWealth - overrideTotal) × globalRate
//   overrideZakat = Σ(overrideAmount × overrideRate)
//   totalZakat    = standardZakat + overrideZakat
//
// When no overrides are configured, the calculation is identical to v1.0.

import { ZakatFormData, ZakatCalculationResult, AssetBreakdown, EnhancedAssetBreakdown } from './zakatTypes';
import {
  calculateTotalAssets,
  calculateAssetBreakdown,
  calculateEnhancedAssetBreakdown,
  calculateRateOverrides,
  type RateOverridePool,
} from './calculators/assets';
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
  formatCompactCurrency,
  formatPercent,
  parseMathExpression,
  createZakatReport,
  defaultFormData,
  SILVER_PRICE_PER_OUNCE,
  GOLD_PRICE_PER_OUNCE,
  GRAMS_PER_OUNCE,
  calculateNisab,
  ZAKAT_RATE,
  SOLAR_ZAKAT_RATE
} from './calculators/utils';
export { MADHAB_RULES, MODE_RULES } from './madhahRules';

export function calculateZakat(
  data: ZakatFormData,
  silverPrice: number = DEFAULT_SILVER,
  goldPrice: number = DEFAULT_GOLD,
  config?: ZakatMethodologyConfig
): ZakatCalculationResult {
  // ═══════════════════════════════════════════════════════════════════════
  // 1. Resolve Configuration
  //    Priority: Explicit Config > Preset for Madhab > Default (Bradford)
  // ═══════════════════════════════════════════════════════════════════════
  const effectiveConfig = config || ZAKAT_PRESETS[data.madhab] || DEFAULT_CONFIG;

  // ═══════════════════════════════════════════════════════════════════════
  // 2. Calculate Components using Config
  // ═══════════════════════════════════════════════════════════════════════
  const totalAssets = calculateTotalAssets(data, effectiveConfig);
  const totalLiabilities = calculateTotalLiabilities(data, effectiveConfig);
  const netZakatableWealth = Math.max(0, totalAssets - totalLiabilities);

  // ═══════════════════════════════════════════════════════════════════════
  // 3. Nisab Logic
  //    Respect user override of nisab standard (gold vs silver), then
  //    fall back to the methodology's default standard.
  // ═══════════════════════════════════════════════════════════════════════
  const nisabStandard = effectiveConfig.thresholds.nisab.default_standard;
  const effectiveNisabStandard = data.nisabStandard || nisabStandard;
  const nisab = calculateNisab(silverPrice, goldPrice, effectiveNisabStandard);
  const isAboveNisab = netZakatableWealth >= nisab;

  // ═══════════════════════════════════════════════════════════════════════
  // 4. Multi-Rate Zakat Calculation (v1.0.1)
  // ═══════════════════════════════════════════════════════════════════════
  //
  // Determine global Zakat rate (lunar or solar adjustment)
  const zakatRate = data.calendarType === 'solar'
    ? effectiveConfig.thresholds.zakat_rate.solar
    : effectiveConfig.thresholds.zakat_rate.lunar;

  let zakatDue = 0;

  if (isAboveNisab) {
    // Identify assets with rate overrides (e.g., rental income at 10%)
    const rateOverrides = calculateRateOverrides(data, effectiveConfig);
    const totalOverrideAmount = rateOverrides.reduce((sum, o) => sum + o.amount, 0);

    if (rateOverrides.length > 0 && totalOverrideAmount > 0) {
      // ── Multi-Rate Path ──
      // Override pools are taxed at their specific rates.
      // The remaining standard pool is taxed at the global rate.
      //
      // Important: Override amounts were included in totalAssets, so we
      // subtract them from netZakatableWealth to get the standard pool.
      // Liabilities are deducted from the standard pool only (not from
      // rate-override assets, which represent gross income already received).
      const standardPool = Math.max(0, netZakatableWealth - totalOverrideAmount);
      const standardZakat = standardPool * zakatRate;

      let overrideZakat = 0;
      for (const override of rateOverrides) {
        const contribution = override.amount * override.rate;
        overrideZakat += contribution;
        console.log(
          `[ZMCS Multi-Rate] ${override.label}: $${override.amount.toFixed(2)} × ` +
          `${(override.rate * 100).toFixed(1)}% = $${contribution.toFixed(2)}`
        );
      }

      zakatDue = standardZakat + overrideZakat;
      console.log(
        `[ZMCS Multi-Rate] Standard pool: $${standardPool.toFixed(2)} × ${(zakatRate * 100).toFixed(2)}% = $${standardZakat.toFixed(2)} | ` +
        `Override total: $${overrideZakat.toFixed(2)} | Total Zakat: $${zakatDue.toFixed(2)}`
      );
    } else {
      // ── Standard Single-Rate Path ──
      // No overrides configured; classic netWealth × globalRate
      zakatDue = netZakatableWealth * zakatRate;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 5. Purification Amounts (interest and haram dividend income)
  // ═══════════════════════════════════════════════════════════════════════
  const interestToPurify = data.interestEarned;
  const dividendsToPurify = data.dividends * (data.dividendPurificationPercent / 100);

  // ═══════════════════════════════════════════════════════════════════════
  // 6. Breakdown for Visualization
  // ═══════════════════════════════════════════════════════════════════════
  const assetBreakdown = calculateAssetBreakdown(data, effectiveConfig);
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

