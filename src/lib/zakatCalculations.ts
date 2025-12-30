// Zakat Calculation Logic based on Sheikh Joe Bradford's methodology

export const SILVER_NISAB_GRAMS = 595;
export const GOLD_NISAB_GRAMS = 85;
export const SILVER_PRICE_PER_OUNCE = 24.50; // Default, should be updated with real-time data
export const GOLD_PRICE_PER_OUNCE = 2650; // Default, should be updated with real-time data
export const GRAMS_PER_OUNCE = 31.1035;

export const ZAKAT_RATE = 0.025; // 2.5% for lunar year
export const SOLAR_ZAKAT_RATE = 0.02577; // Adjusted for solar year (2.5% * 365.25/354.37)

export type CalendarType = 'lunar' | 'solar';
export type NisabStandard = 'silver' | 'gold';
export type CalculationMode = 'conservative' | 'optimized' | 'bradford';

export interface HouseholdMember {
  id: string;
  name: string;
  relationship: 'self' | 'spouse' | 'child' | 'other';
}

export interface ZakatFormData {
  // Preferences
  currency: string;
  calendarType: CalendarType;
  nisabStandard: NisabStandard;
  calculationMode: CalculationMode;
  isHousehold: boolean; // Whether calculating for household or just self
  isSimpleMode: boolean; // Whether using simple 4-question mode
  householdMembers: HouseholdMember[]; // Track family members for household mode
  
  // Personal Info
  email: string;
  age: number;
  estimatedTaxRate: number; // Combined federal + state rate as decimal
  
  // Financial categories selected
  hasPreciousMetals: boolean;
  hasRealEstate: boolean;
  hasBusiness: boolean;
  hasIlliquidAssets: boolean;
  hasDebtOwedToYou: boolean;
  hasTaxPayments: boolean;
  hasCrypto: boolean;
  hasTrusts: boolean;
  
  // Liquid Assets
  checkingAccounts: number;
  savingsAccounts: number;
  cashOnHand: number;
  digitalWallets: number; // PayPal, Venmo, CashApp, Zelle
  foreignCurrency: number; // Converted to USD at spot rate
  interestEarned: number; // For purification (not Zakatable)
  
  // Precious Metals
  goldValue: number;
  silverValue: number;
  
  // Crypto & Digital Assets
  cryptoCurrency: number; // BTC, ETH treated as currency
  cryptoTrading: number; // Altcoins, NFTs for trading
  stakedAssets: number; // Principal only
  stakedRewardsVested: number; // Vested staking rewards
  liquidityPoolValue: number; // Current redeemable value
  
  // Investments
  activeInvestments: number;
  passiveInvestmentsValue: number;
  dividends: number;
  dividendPurificationPercent: number; // % to purify from non-halal income
  
  // Retirement Accounts
  rothIRAContributions: number; // Principal only (always accessible)
  rothIRAEarnings: number; // Subject to penalty if under 59.5
  traditionalIRABalance: number; // Vested balance
  fourOhOneKVestedBalance: number; // Vested balance
  fourOhOneKUnvestedMatch: number; // Not Zakatable
  iraWithdrawals: number;
  esaWithdrawals: number;
  fiveTwentyNineWithdrawals: number;
  hsaBalance: number;
  isOver59Half: boolean;
  
  // Trusts
  revocableTrustValue: number;
  irrevocableTrustAccessible: boolean;
  irrevocableTrustValue: number;
  clatValue: number; // Not Zakatable during annuity term
  
  // Real Estate
  realEstateForSale: number; // Property for flipping - full value
  rentalPropertyIncome: number; // Net rental income in bank
  
  // Business
  businessCashAndReceivables: number;
  businessInventory: number;
  
  // Illiquid Assets
  illiquidAssetsValue: number;
  livestockValue: number;
  
  // Debt Owed To You
  goodDebtOwedToYou: number; // Collectible - borrower willing/able
  badDebtRecovered: number; // Bad debt recovered this year
  
  // Liabilities
  monthlyLivingExpenses: number;
  insuranceExpenses: number;
  creditCardBalance: number; // Due immediately
  unpaidBills: number; // Due immediately
  monthlyMortgage: number; // Only 12 months deductible
  studentLoansDue: number; // Only current payments due
  propertyTax: number;
  lateTaxPayments: number;
}

export const defaultFormData: ZakatFormData = {
  currency: 'USD',
  calendarType: 'lunar',
  nisabStandard: 'silver',
  calculationMode: 'optimized',
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
  // Conservative mode: pay on gross amount
  if (mode === 'conservative') {
    return vestedBalance;
  }
  
  // Bradford Exclusion Rule: Traditional 401(k)/IRA fully exempt under 59½
  // Based on Sheikh Joe Bradford's ruling that these accounts lack milk tām
  // (complete ownership) and qudrah 'ala al-tasarruf (ability to dispose)
  if (mode === 'bradford' && age < 59.5) {
    return 0; // Fully exempt - treated as māl ḍimār (inaccessible wealth)
  }
  
  // Optimized mode OR Bradford mode for 59½+: deduct taxes and penalties
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
  
  // Precious Metals
  if (data.hasPreciousMetals) {
    total += data.goldValue;
    total += data.silverValue;
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
  
  // Passive investments: 30% rule or full based on mode
  if (calculationMode === 'conservative') {
    total += data.passiveInvestmentsValue; // 100%
  } else {
    total += data.passiveInvestmentsValue * 0.30; // 30% rule
  }
  
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
  
  // Only IMMEDIATE debts are deductible
  total += data.monthlyLivingExpenses;
  total += data.insuranceExpenses;
  total += data.creditCardBalance; // Due immediately
  total += data.unpaidBills; // Due immediately
  total += data.monthlyMortgage * 12; // 12 months deductible (AMJA opinion)
  total += data.studentLoansDue; // Only current payments due
  
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
  };
}

export interface AssetBreakdown {
  liquidAssets: number;
  investments: number;
  retirement: number;
  realEstate: number;
  business: number;
  otherAssets: number;
  exemptAssets: number;
}

function calculateAssetBreakdown(data: ZakatFormData): AssetBreakdown {
  const liquidAssets = 
    data.checkingAccounts + 
    data.savingsAccounts + 
    data.cashOnHand + 
    data.digitalWallets + 
    data.foreignCurrency +
    (data.hasPreciousMetals ? data.goldValue + data.silverValue : 0) +
    (data.hasCrypto ? data.cryptoCurrency + data.cryptoTrading + data.stakedAssets + data.stakedRewardsVested + data.liquidityPoolValue : 0);
  
  const investments = 
    data.activeInvestments + 
    (data.calculationMode === 'conservative' ? data.passiveInvestmentsValue : data.passiveInvestmentsValue * 0.30) +
    data.dividends;
  
  const retirement = 
    data.rothIRAContributions + 
    data.rothIRAEarnings + 
    calculateRetirementAccessible(data.fourOhOneKVestedBalance, data.age, data.estimatedTaxRate, data.calculationMode) +
    calculateRetirementAccessible(data.traditionalIRABalance, data.age, data.estimatedTaxRate, data.calculationMode) +
    data.iraWithdrawals +
    data.esaWithdrawals +
    data.fiveTwentyNineWithdrawals +
    data.hsaBalance;
  
  const realEstate = data.hasRealEstate ? data.realEstateForSale + data.rentalPropertyIncome : 0;
  
  const business = data.hasBusiness ? data.businessCashAndReceivables + data.businessInventory : 0;
  
  const otherAssets = 
    (data.hasIlliquidAssets ? data.illiquidAssetsValue + data.livestockValue : 0) +
    (data.hasDebtOwedToYou ? data.goodDebtOwedToYou + data.badDebtRecovered : 0) +
    (data.hasTrusts ? data.revocableTrustValue + (data.irrevocableTrustAccessible ? data.irrevocableTrustValue : 0) : 0);
  
  // Exempt assets (for display purposes)
  const exemptAssets = 
    data.fourOhOneKUnvestedMatch +
    data.clatValue +
    (data.hasTrusts && !data.irrevocableTrustAccessible ? data.irrevocableTrustValue : 0);
  
  return {
    liquidAssets,
    investments,
    retirement,
    realEstate,
    business,
    otherAssets,
    exemptAssets,
  };
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(3)}%`;
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
