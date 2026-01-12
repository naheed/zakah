// Zakat Calculation Logic based on Sheikh Joe Bradford's methodology

import { MODE_RULES, MADHAB_RULES, getCalculationModeForMadhab } from './madhahRules';
import {
  ZakatFormData,
  ZakatCalculationResult,
  AssetBreakdown,
  EnhancedAssetBreakdown,
  AssetItem,
  AssetCategory,
  LiabilityItem,
  CalendarType,
  NisabStandard,
  CalculationMode,
  Madhab,
  ZakatReport
} from './zakatTypes';

export * from './zakatTypes';
export * from './madhahRules';

export const SILVER_NISAB_GRAMS = 595;
export const GOLD_NISAB_GRAMS = 85;
export const SILVER_PRICE_PER_OUNCE = 24.50; // Default, should be updated with real-time data
export const GOLD_PRICE_PER_OUNCE = 2650; // Default, should be updated with real-time data
export const GRAMS_PER_OUNCE = 31.1035;

export const ZAKAT_RATE = 0.025; // 2.5% for lunar year
export const SOLAR_ZAKAT_RATE = 0.02577; // Adjusted for solar year (2.5% * 365.25/354.37)

export function formatCurrency(amount: number, currency: string = 'USD', fractionDigits: number = 0): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(amount);
  } catch (e) {
    return `${currency} ${amount.toFixed(fractionDigits)}`;
  }
}

import { Parser } from 'expr-eval';

const mathParser = new Parser();

export function parseMathExpression(expression: string): number {
  if (!expression || expression.trim() === '') return 0;
  try {
    // Use expr-eval for safe math expression parsing (no code execution risk)
    const result = mathParser.evaluate(expression);
    return typeof result === 'number' && !isNaN(result) ? result : 0;
  } catch {
    return 0;
  }
}

export function formatCompactCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(amount);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 1
  }).format(value);
}

export function createZakatReport(data: ZakatFormData, calculations: ZakatCalculationResult, referralCode?: string): ZakatReport {
  return {
    meta: {
      timestamp: new Date().toISOString(),
      reportId: `REF-${Math.floor(Math.random() * 10000)}`,
      version: "2.0",
      referralCode
    },
    input: data,
    output: calculations
  };
}

export const defaultFormData: ZakatFormData = {
  currency: 'USD',
  calendarType: 'lunar',
  nisabStandard: 'silver',
  calculationMode: 'bradford',
  madhab: 'balanced',
  isHousehold: false,
  isSimpleMode: false,
  householdMembers: [{ id: 'self', name: 'You', relationship: 'self' }],
  email: '',
  age: 30,
  estimatedTaxRate: 0.25,
  hasPreciousMetals: false,
  hasRealEstate: false,
  hasBusiness: false,
  hasIlliquidAssets: false,
  hasDebtOwedToYou: false,
  hasTaxPayments: false,
  hasCrypto: false,
  hasTrusts: false,
  checkingAccounts: 0,
  savingsAccounts: 0,
  cashOnHand: 0,
  digitalWallets: 0,
  foreignCurrency: 0,
  interestEarned: 0,
  goldValue: 0,
  silverValue: 0,
  cryptoCurrency: 0,
  cryptoTrading: 0,
  stakedAssets: 0,
  stakedRewardsVested: 0,
  liquidityPoolValue: 0,
  activeInvestments: 0,
  passiveInvestmentsValue: 0,
  passiveInvestmentIntent: 'mudir', // Default: treat as active trading (Mudir)
  dividends: 0,
  dividendPurificationPercent: 0,
  rothIRAContributions: 0,
  rothIRAEarnings: 0,
  traditionalIRABalance: 0,
  fourOhOneKVestedBalance: 0,
  fourOhOneKUnvestedMatch: 0,
  iraWithdrawals: 0,
  esaWithdrawals: 0,
  fiveTwentyNineWithdrawals: 0,
  hsaBalance: 0,
  isOver59Half: false,
  revocableTrustValue: 0,
  irrevocableTrustAccessible: false,
  irrevocableTrustValue: 0,
  clatValue: 0,
  realEstateForSale: 0,
  rentalPropertyIncome: 0,
  businessCashAndReceivables: 0,
  businessInventory: 0,
  illiquidAssetsValue: 0,
  livestockValue: 0,
  goodDebtOwedToYou: 0,
  badDebtRecovered: 0,
  monthlyLivingExpenses: 0,
  insuranceExpenses: 0,
  creditCardBalance: 0,
  unpaidBills: 0,
  monthlyMortgage: 0,
  studentLoansDue: 0,
  propertyTax: 0,
  lateTaxPayments: 0,
};

export function calculateNisab(
  silverPricePerOunce: number = SILVER_PRICE_PER_OUNCE,
  goldPricePerOunce: number = GOLD_PRICE_PER_OUNCE,
  standard: NisabStandard = 'silver'
): number {
  if (standard === 'gold') {
    const nisabInOunces = GOLD_NISAB_GRAMS / GRAMS_PER_OUNCE;
    return nisabInOunces * goldPricePerOunce;
  }
  // Silver standard (default)
  const nisabInOunces = SILVER_NISAB_GRAMS / GRAMS_PER_OUNCE;
  return nisabInOunces * silverPricePerOunce;
}

export function calculateRetirementAccessible(
  vestedBalance: number,
  age: number,
  taxRate: number,
  mode: CalculationMode
): number {
  // Bradford Exclusion Rule: Traditional 401(k)/IRA fully exempt under 59½
  // Based on Sheikh Joe Bradford's ruling that these accounts lack milk tām
  // (complete ownership) and qudrah 'ala al-tasarruf (ability to dispose)
  if (mode === 'bradford' && age < 59.5) {
    return 0; // Fully exempt - treated as māl ḍimār (inaccessible wealth)
  }

  // All modes: deduct taxes and penalties for accessible value
  const penaltyRate = age < 59.5 ? 0.10 : 0;
  const accessFactor = Math.max(0, 1 - (taxRate + penaltyRate));
  return vestedBalance * accessFactor;
}

export function calculateTotalAssets(data: ZakatFormData): number {
  let total = 0;
  const { calculationMode } = data;

  // Module A: Liquid Assets
  total += data.checkingAccounts;
  total += data.savingsAccounts;
  total += data.cashOnHand;
  total += data.digitalWallets;
  total += data.foreignCurrency;
  // Note: interestEarned is NOT added - must be purified separately

  // Precious Metals - only include if jewelryZakatable for this mode
  if (data.hasPreciousMetals) {
    const jewelryZakatable = MODE_RULES[calculationMode].jewelryZakatable;
    // Gold and silver coins/bars are always zakatable
    // Personal jewelry is only zakatable in Hanafi mode
    if (jewelryZakatable) {
      total += data.goldValue;
      total += data.silverValue;
    } else {
      // Non-jewelry gold/silver should still be included
      // For now, we treat goldValue/silverValue as potentially jewelry
      // In the future, we may split this into jewelry vs coins/bars
      // Conservative: if mode exempts jewelry, exclude gold/silver values
      // (This is the Bradford/Maliki/Shafi'i/Hanbali approach)
    }
  }

  // Crypto & Digital Assets
  if (data.hasCrypto) {
    total += data.cryptoCurrency; // 100% - currency treatment
    total += data.cryptoTrading; // 100% - trade goods treatment
    total += data.stakedAssets; // Principal
    total += data.stakedRewardsVested; // Only vested rewards
    total += data.liquidityPoolValue; // Current redeemable value
  }

  // Module B: Investments
  total += data.activeInvestments; // 100% - active trading

  // Passive investments: use mode-specific rate (30% for Bradford, 100% for others)
  // Safety check: Fallback to 'bradford' if mode is undefined/invalid
  const safeMode = MODE_RULES[calculationMode] ? calculationMode : 'bradford';
  const passiveRate = MODE_RULES[safeMode].passiveInvestmentRate;
  total += data.passiveInvestmentsValue * passiveRate;

  // Dividends (after purification)
  const purificationAmount = data.dividends * (data.dividendPurificationPercent / 100);
  total += data.dividends - purificationAmount;

  // Module C: Retirement Accounts
  // Roth IRA Contributions: Always 100% zakatable (can withdraw tax-free anytime)
  total += data.rothIRAContributions;

  // Roth IRA Earnings: 
  // - Bradford mode under 59½: EXEMPT (follows exclusion rule)
  // - Other modes: treated like 401k (tax/penalty deduction)
  if (data.isOver59Half) {
    total += data.rothIRAEarnings;
  } else if (calculationMode === 'bradford') {
    // Roth earnings exempt under Bradford rule (lacks accessibility)
    // Contributions remain zakatable above
  } else {
    total += calculateRetirementAccessible(
      data.rothIRAEarnings,
      data.age,
      data.estimatedTaxRate,
      calculationMode
    );
  }

  // Traditional 401k & IRA
  total += calculateRetirementAccessible(
    data.fourOhOneKVestedBalance,
    data.age,
    data.estimatedTaxRate,
    calculationMode
  );

  total += calculateRetirementAccessible(
    data.traditionalIRABalance,
    data.age,
    data.estimatedTaxRate,
    calculationMode
  );

  // Already withdrawn amounts (post-tax, post-penalty)
  total += data.iraWithdrawals;
  total += data.esaWithdrawals;
  total += data.fiveTwentyNineWithdrawals;

  // HSA is fully accessible for medical expenses
  total += data.hsaBalance;

  // Trusts
  if (data.hasTrusts) {
    total += data.revocableTrustValue; // Fully Zakatable
    if (data.irrevocableTrustAccessible) {
      total += data.irrevocableTrustValue;
    }
    // CLAT is NOT included during annuity term
  }

  // Real Estate (for business purposes)
  if (data.hasRealEstate) {
    total += data.realEstateForSale; // Full value for flipping
    total += data.rentalPropertyIncome; // Net income in bank
  }

  // Business Assets
  if (data.hasBusiness) {
    total += data.businessCashAndReceivables;
    total += data.businessInventory;
  }

  // Illiquid Assets
  if (data.hasIlliquidAssets) {
    total += data.illiquidAssetsValue;
    total += data.livestockValue;
  }

  // Debt Owed To You
  if (data.hasDebtOwedToYou) {
    total += data.goodDebtOwedToYou; // Good debt is like cash
    total += data.badDebtRecovered; // Bad debt only when recovered
  }

  return total;
}

export function calculateTotalLiabilities(data: ZakatFormData): number {
  let total = 0;

  // Get the debt deduction method from the madhab rules
  const debtMethod = MADHAB_RULES[data.madhab].debtDeductionMethod;

  // Shafi'i position: Debt does NOT prevent Zakat (Al-Nawawi)
  if (debtMethod === 'none') {
    return 0; // No deductions allowed
  }

  // Immediate debts are always deductible (all schools that allow deduction)
  total += data.monthlyLivingExpenses;
  total += data.insuranceExpenses;
  total += data.creditCardBalance; // Due immediately
  total += data.unpaidBills; // Due immediately
  total += data.studentLoansDue; // Only current payments due

  // Mortgage handling differs by debtDeductionMethod
  if (debtMethod === 'full') {
    // Hanafi/Hanbali: Full debt deduction
    // Note: We use 12x monthly as proxy for annual principal (ideal: use actual remaining balance)
    total += data.monthlyMortgage * 12; // Using annual as proxy for full debt visibility
  } else if (debtMethod === 'twelve_month') {
    // AAOIFI/Maliki: Only 12 months of payments deductible
    total += data.monthlyMortgage * 12;
  }

  if (data.hasTaxPayments) {
    total += data.propertyTax;
    total += data.lateTaxPayments;
  }

  return total;
}

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

// Deprecated in favor of enhanced breakdown but kept for backward compatibility if needed
export function calculateAssetBreakdown(data: ZakatFormData): AssetBreakdown {
  // Re-implemented to use the logic, though mostly redundant with enhanced
  const enhanced = calculateEnhancedAssetBreakdown(data, 100); // dummy net wealth
  return {
    liquidAssets: enhanced.liquidAssets.total + enhanced.preciousMetals.total + enhanced.crypto.total,
    investments: enhanced.investments.total,
    retirement: enhanced.retirement.total,
    realEstate: enhanced.realEstate.total,
    business: enhanced.business.total,
    otherAssets: enhanced.trusts.total + enhanced.illiquidAssets.total + enhanced.debtOwedToYou.total,
    exemptAssets: enhanced.exempt.total
  };
}

// Asset category colors (consistent with web UI)
const ASSET_COLORS = {
  liquid: '#22C55E',
  metals: '#EAB308',
  crypto: '#8B5CF6',
  investments: '#3B82F6',
  retirement: '#EC4899',
  trusts: '#14B8A6',
  realEstate: '#F97316',
  business: '#06B6D4',
  debtOwed: '#64748B',
  illiquid: '#A855F7',
  liabilities: '#DC2626',
  exempt: '#9CA3AF',
};

export function calculateEnhancedAssetBreakdown(
  data: ZakatFormData,
  netZakatableWealth: number
): EnhancedAssetBreakdown {
  // Helper to compute percent of net zakatable
  const pctOfNet = (amount: number) =>
    netZakatableWealth > 0 ? amount / netZakatableWealth : 0;

  // Safety check: Fallback to 'bradford' if mode is undefined/invalid
  const safeMode = MODE_RULES[data.calculationMode] ? data.calculationMode : 'bradford';

  // Liquid Assets (cash only)
  const liquidItems: AssetItem[] = [];
  if (data.checkingAccounts > 0) liquidItems.push({ name: 'Checking Accounts', value: data.checkingAccounts, zakatablePercent: 1.0, zakatableAmount: data.checkingAccounts });
  if (data.savingsAccounts > 0) liquidItems.push({ name: 'Savings Accounts', value: data.savingsAccounts, zakatablePercent: 1.0, zakatableAmount: data.savingsAccounts });
  if (data.cashOnHand > 0) liquidItems.push({ name: 'Cash on Hand', value: data.cashOnHand, zakatablePercent: 1.0, zakatableAmount: data.cashOnHand });
  if (data.digitalWallets > 0) liquidItems.push({ name: 'Digital Wallets', value: data.digitalWallets, zakatablePercent: 1.0, zakatableAmount: data.digitalWallets });
  if (data.foreignCurrency > 0) liquidItems.push({ name: 'Foreign Currency', value: data.foreignCurrency, zakatablePercent: 1.0, zakatableAmount: data.foreignCurrency });
  const liquidTotal = liquidItems.reduce((s, i) => s + i.value, 0);

  // Precious Metals - only include if jewelryZakatable for this mode
  const metalsItems: AssetItem[] = [];
  const jewelryZakatable = MODE_RULES[safeMode].jewelryZakatable;
  if (data.hasPreciousMetals && jewelryZakatable) {
    if (data.goldValue > 0) metalsItems.push({ name: 'Gold', value: data.goldValue, zakatablePercent: 1.0, zakatableAmount: data.goldValue });
    if (data.silverValue > 0) metalsItems.push({ name: 'Silver', value: data.silverValue, zakatablePercent: 1.0, zakatableAmount: data.silverValue });
  }
  const metalsTotal = metalsItems.reduce((s, i) => s + i.value, 0);

  // Crypto
  const cryptoItems: AssetItem[] = [];
  if (data.hasCrypto) {
    if (data.cryptoCurrency > 0) cryptoItems.push({ name: 'Bitcoin/Ethereum', value: data.cryptoCurrency, zakatablePercent: 1.0, zakatableAmount: data.cryptoCurrency });
    if (data.cryptoTrading > 0) cryptoItems.push({ name: 'Trading Altcoins', value: data.cryptoTrading, zakatablePercent: 1.0, zakatableAmount: data.cryptoTrading });
    if (data.stakedAssets > 0) cryptoItems.push({ name: 'Staked Assets', value: data.stakedAssets, zakatablePercent: 1.0, zakatableAmount: data.stakedAssets });
    if (data.stakedRewardsVested > 0) cryptoItems.push({ name: 'Staking Rewards', value: data.stakedRewardsVested, zakatablePercent: 1.0, zakatableAmount: data.stakedRewardsVested });
    if (data.liquidityPoolValue > 0) cryptoItems.push({ name: 'Liquidity Pools', value: data.liquidityPoolValue, zakatablePercent: 1.0, zakatableAmount: data.liquidityPoolValue });
  }
  const cryptoTotal = cryptoItems.reduce((s, i) => s + i.value, 0);

  // Investments
  const investmentItems: AssetItem[] = [];
  const passiveZakatablePercent = MODE_RULES[safeMode].passiveInvestmentRate;
  const passiveZakatableAmount = data.passiveInvestmentsValue * passiveZakatablePercent;
  if (data.activeInvestments > 0) investmentItems.push({ name: 'Active Investments', value: data.activeInvestments, zakatablePercent: 1.0, zakatableAmount: data.activeInvestments });
  if (data.passiveInvestmentsValue > 0) investmentItems.push({
    name: 'Passive Investments',
    value: data.passiveInvestmentsValue,
    zakatablePercent: passiveZakatablePercent,
    zakatableAmount: passiveZakatableAmount
  });
  const purifiedDividends = data.dividends - (data.dividends * data.dividendPurificationPercent / 100);
  if (data.dividends > 0) investmentItems.push({
    name: 'Dividends',
    value: data.dividends, // Gross amount
    zakatableAmount: purifiedDividends,
    zakatablePercent: Math.max(0, (100 - data.dividendPurificationPercent) / 100)
  });
  const investmentGross = data.activeInvestments + data.passiveInvestmentsValue + data.dividends;
  const investmentZakatable = data.activeInvestments + passiveZakatableAmount + purifiedDividends;

  // Retirement
  const retirementItems: AssetItem[] = [];
  if (data.rothIRAContributions > 0) retirementItems.push({ name: 'Roth IRA Contributions', value: data.rothIRAContributions, zakatablePercent: 1.0, zakatableAmount: data.rothIRAContributions });

  const rothEarningsZakatable = data.isOver59Half ? data.rothIRAEarnings :
    (data.calculationMode === 'bradford' ? 0 : calculateRetirementAccessible(data.rothIRAEarnings, data.age, data.estimatedTaxRate, data.calculationMode));
  if (data.rothIRAEarnings > 0) retirementItems.push({
    name: 'Roth IRA Earnings',
    value: data.rothIRAEarnings,
    zakatableAmount: rothEarningsZakatable,
    zakatablePercent: data.rothIRAEarnings > 0 ? rothEarningsZakatable / data.rothIRAEarnings : 0
  });

  const fourOhOneKZakatable = calculateRetirementAccessible(data.fourOhOneKVestedBalance, data.age, data.estimatedTaxRate, data.calculationMode);
  if (data.fourOhOneKVestedBalance > 0) retirementItems.push({
    name: '401(k) Vested',
    value: data.fourOhOneKVestedBalance,
    zakatableAmount: fourOhOneKZakatable,
    zakatablePercent: data.fourOhOneKVestedBalance > 0 ? fourOhOneKZakatable / data.fourOhOneKVestedBalance : 0
  });

  const iraZakatable = calculateRetirementAccessible(data.traditionalIRABalance, data.age, data.estimatedTaxRate, data.calculationMode);
  if (data.traditionalIRABalance > 0) retirementItems.push({
    name: 'Traditional IRA',
    value: data.traditionalIRABalance,
    zakatableAmount: iraZakatable,
    zakatablePercent: data.traditionalIRABalance > 0 ? iraZakatable / data.traditionalIRABalance : 0
  });

  if (data.iraWithdrawals > 0) retirementItems.push({ name: 'IRA Withdrawals', value: data.iraWithdrawals, zakatablePercent: 1.0, zakatableAmount: data.iraWithdrawals });
  if (data.esaWithdrawals > 0) retirementItems.push({ name: 'ESA Withdrawals', value: data.esaWithdrawals, zakatablePercent: 1.0, zakatableAmount: data.esaWithdrawals });
  if (data.fiveTwentyNineWithdrawals > 0) retirementItems.push({ name: '529 Withdrawals', value: data.fiveTwentyNineWithdrawals, zakatablePercent: 1.0, zakatableAmount: data.fiveTwentyNineWithdrawals });
  if (data.hsaBalance > 0) retirementItems.push({ name: 'HSA Balance', value: data.hsaBalance, zakatablePercent: 1.0, zakatableAmount: data.hsaBalance });

  const retirementGross = retirementItems.reduce((s, i) => s + i.value, 0);
  const retirementZakatable = data.rothIRAContributions + rothEarningsZakatable + fourOhOneKZakatable + iraZakatable +
    data.iraWithdrawals + data.esaWithdrawals + data.fiveTwentyNineWithdrawals + data.hsaBalance;

  // Trusts
  const trustItems: AssetItem[] = [];
  if (data.hasTrusts) {
    if (data.revocableTrustValue > 0) trustItems.push({ name: 'Revocable Trust', value: data.revocableTrustValue, zakatablePercent: 1.0, zakatableAmount: data.revocableTrustValue });
    if (data.irrevocableTrustAccessible && data.irrevocableTrustValue > 0) {
      trustItems.push({ name: 'Irrevocable Trust (Accessible)', value: data.irrevocableTrustValue, zakatablePercent: 1.0, zakatableAmount: data.irrevocableTrustValue });
    }
  }
  const trustsTotal = trustItems.reduce((s, i) => s + i.value, 0);

  // Real Estate
  const realEstateItems: AssetItem[] = [];
  if (data.hasRealEstate) {
    if (data.realEstateForSale > 0) realEstateItems.push({ name: 'Property for Sale', value: data.realEstateForSale, zakatablePercent: 1.0, zakatableAmount: data.realEstateForSale });
    if (data.rentalPropertyIncome > 0) realEstateItems.push({ name: 'Rental Income', value: data.rentalPropertyIncome, zakatablePercent: 1.0, zakatableAmount: data.rentalPropertyIncome });
  }
  const realEstateTotal = realEstateItems.reduce((s, i) => s + i.value, 0);

  // Business
  const businessItems: AssetItem[] = [];
  if (data.hasBusiness) {
    if (data.businessCashAndReceivables > 0) businessItems.push({ name: 'Cash & Receivables', value: data.businessCashAndReceivables, zakatablePercent: 1.0, zakatableAmount: data.businessCashAndReceivables });
    if (data.businessInventory > 0) businessItems.push({ name: 'Inventory', value: data.businessInventory, zakatablePercent: 1.0, zakatableAmount: data.businessInventory });
  }
  const businessTotal = businessItems.reduce((s, i) => s + i.value, 0);

  // Debt Owed To You
  const debtOwedItems: AssetItem[] = [];
  if (data.hasDebtOwedToYou) {
    if (data.goodDebtOwedToYou > 0) debtOwedItems.push({ name: 'Collectible Loans', value: data.goodDebtOwedToYou, zakatablePercent: 1.0, zakatableAmount: data.goodDebtOwedToYou });
    if (data.badDebtRecovered > 0) debtOwedItems.push({ name: 'Recovered Bad Debt', value: data.badDebtRecovered, zakatablePercent: 1.0, zakatableAmount: data.badDebtRecovered });
  }
  const debtOwedTotal = debtOwedItems.reduce((s, i) => s + i.value, 0);

  // Illiquid Assets
  const illiquidItems: AssetItem[] = [];
  if (data.hasIlliquidAssets) {
    if (data.illiquidAssetsValue > 0) illiquidItems.push({ name: 'Illiquid Assets', value: data.illiquidAssetsValue, zakatablePercent: 1.0, zakatableAmount: data.illiquidAssetsValue });
    if (data.livestockValue > 0) illiquidItems.push({ name: 'Livestock', value: data.livestockValue, zakatablePercent: 1.0, zakatableAmount: data.livestockValue });
  }
  const illiquidTotal = illiquidItems.reduce((s, i) => s + i.value, 0);

  // Liabilities
  const liabilityItems: LiabilityItem[] = [];
  if (data.monthlyLivingExpenses > 0) liabilityItems.push({ name: 'Living Expenses', value: data.monthlyLivingExpenses });
  if (data.insuranceExpenses > 0) liabilityItems.push({ name: 'Insurance', value: data.insuranceExpenses });
  if (data.creditCardBalance > 0) liabilityItems.push({ name: 'Credit Card', value: data.creditCardBalance });
  if (data.unpaidBills > 0) liabilityItems.push({ name: 'Unpaid Bills', value: data.unpaidBills });
  if (data.monthlyMortgage > 0) liabilityItems.push({ name: 'Mortgage (12mo)', value: data.monthlyMortgage * 12 });
  if (data.studentLoansDue > 0) liabilityItems.push({ name: 'Student Loans', value: data.studentLoansDue });
  if (data.hasTaxPayments && data.propertyTax > 0) liabilityItems.push({ name: 'Property Tax', value: data.propertyTax });
  if (data.hasTaxPayments && data.lateTaxPayments > 0) liabilityItems.push({ name: 'Late Taxes', value: data.lateTaxPayments });
  const liabilitiesTotal = liabilityItems.reduce((s, i) => s + i.value, 0);

  // Exempt Assets
  const exemptItems: AssetItem[] = [];
  if (data.fourOhOneKUnvestedMatch > 0) exemptItems.push({ name: '401(k) Unvested', value: data.fourOhOneKUnvestedMatch });
  if (data.clatValue > 0) exemptItems.push({ name: 'CLAT', value: data.clatValue });
  if (data.hasTrusts && !data.irrevocableTrustAccessible && data.irrevocableTrustValue > 0) {
    exemptItems.push({ name: 'Irrevocable Trust', value: data.irrevocableTrustValue });
  }
  const exemptTotal = exemptItems.reduce((s, i) => s + i.value, 0);

  return {
    liquidAssets: {
      label: 'Cash & Savings',
      color: ASSET_COLORS.liquid,
      total: liquidTotal,
      zakatableAmount: liquidTotal,
      zakatablePercent: 1.0,
      percentOfNetZakatable: pctOfNet(liquidTotal),
      items: liquidItems,
    },
    preciousMetals: {
      label: 'Precious Metals',
      color: ASSET_COLORS.metals,
      total: metalsTotal,
      zakatableAmount: metalsTotal,
      zakatablePercent: 1.0,
      percentOfNetZakatable: pctOfNet(metalsTotal),
      items: metalsItems,
    },
    crypto: {
      label: 'Crypto & Digital',
      color: ASSET_COLORS.crypto,
      total: cryptoTotal,
      zakatableAmount: cryptoTotal,
      zakatablePercent: 1.0,
      percentOfNetZakatable: pctOfNet(cryptoTotal),
      items: cryptoItems,
    },
    investments: {
      label: 'Investments',
      color: ASSET_COLORS.investments,
      total: investmentGross,
      zakatableAmount: investmentZakatable,
      zakatablePercent: investmentGross > 0 ? investmentZakatable / investmentGross : 1.0,
      percentOfNetZakatable: pctOfNet(investmentZakatable),
      items: investmentItems,
    },
    retirement: {
      label: 'Retirement',
      color: ASSET_COLORS.retirement,
      total: retirementGross,
      zakatableAmount: retirementZakatable,
      zakatablePercent: retirementGross > 0 ? retirementZakatable / retirementGross : 0,
      percentOfNetZakatable: pctOfNet(retirementZakatable),
      items: retirementItems,
    },
    trusts: {
      label: 'Trusts',
      color: ASSET_COLORS.trusts,
      total: trustsTotal,
      zakatableAmount: trustsTotal,
      zakatablePercent: 1.0,
      percentOfNetZakatable: pctOfNet(trustsTotal),
      items: trustItems,
    },
    realEstate: {
      label: 'Real Estate',
      color: ASSET_COLORS.realEstate,
      total: realEstateTotal,
      zakatableAmount: realEstateTotal,
      zakatablePercent: 1.0,
      percentOfNetZakatable: pctOfNet(realEstateTotal),
      items: realEstateItems,
    },
    business: {
      label: 'Business',
      color: ASSET_COLORS.business,
      total: businessTotal,
      zakatableAmount: businessTotal,
      zakatablePercent: 1.0,
      percentOfNetZakatable: pctOfNet(businessTotal),
      items: businessItems,
    },
    debtOwedToYou: {
      label: 'Debt Owed to You',
      color: ASSET_COLORS.debtOwed,
      total: debtOwedTotal,
      zakatableAmount: debtOwedTotal,
      zakatablePercent: 1.0,
      percentOfNetZakatable: pctOfNet(debtOwedTotal),
      items: debtOwedItems,
    },
    illiquidAssets: {
      label: 'Illiquid Assets',
      color: ASSET_COLORS.illiquid,
      total: illiquidTotal,
      zakatableAmount: illiquidTotal,
      zakatablePercent: 1.0,
      percentOfNetZakatable: pctOfNet(illiquidTotal),
      items: illiquidItems,
    },
    liabilities: {
      label: 'Deductions',
      color: ASSET_COLORS.liabilities,
      total: liabilitiesTotal,
      items: liabilityItems,
    },
    exempt: {
      label: 'Exempt Assets',
      color: ASSET_COLORS.exempt,
      total: exemptTotal,
      items: exemptItems,
    },
  };
}
