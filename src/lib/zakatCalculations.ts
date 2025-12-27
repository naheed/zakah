// Zakat Calculation Logic based on Sheikh Joe Bradford's methodology

export const SILVER_NISAB_GRAMS = 595;
export const SILVER_PRICE_PER_OUNCE = 24.50; // Default, should be updated with real-time data
export const GRAMS_PER_OUNCE = 31.1035;

export const ZAKAT_RATE = 0.025; // 2.5%
export const SOLAR_ZAKAT_RATE = 0.02577; // Adjusted for solar year

export interface ZakatFormData {
  // Currency
  currency: string;
  
  // Personal Info
  email: string;
  
  // Financial categories selected
  hasPreciousMetals: boolean;
  hasRealEstate: boolean;
  hasBusiness: boolean;
  hasIlliquidAssets: boolean;
  hasDebtOwedToYou: boolean;
  hasTaxPayments: boolean;
  
  // Assets
  checkingAccounts: number;
  savingsAccounts: number;
  cashOnHand: number;
  goldValue: number;
  silverValue: number;
  activeInvestments: number;
  passiveInvestmentsValue: number;
  dividends: number;
  rothIRAContributions: number;
  fourOhOneKWithdrawals: number;
  iraWithdrawals: number;
  esaWithdrawals: number;
  fiveTwentyNineWithdrawals: number;
  hsaBalance: number;
  
  // Real Estate
  realEstateForSale: number;
  rentalPropertyIncome: number;
  
  // Business
  businessCashAndReceivables: number;
  businessInventory: number;
  
  // Illiquid Assets
  illiquidAssetsValue: number;
  livestockValue: number;
  
  // Debt Owed To You
  debtOwedToYou: number;
  
  // Liabilities
  monthlyLivingExpenses: number;
  insuranceExpenses: number;
  debtsYouOwe: number;
  propertyTax: number;
  lateTaxPayments: number;
}

export const defaultFormData: ZakatFormData = {
  currency: 'USD',
  email: '',
  hasPreciousMetals: false,
  hasRealEstate: false,
  hasBusiness: false,
  hasIlliquidAssets: false,
  hasDebtOwedToYou: false,
  hasTaxPayments: false,
  checkingAccounts: 0,
  savingsAccounts: 0,
  cashOnHand: 0,
  goldValue: 0,
  silverValue: 0,
  activeInvestments: 0,
  passiveInvestmentsValue: 0,
  dividends: 0,
  rothIRAContributions: 0,
  fourOhOneKWithdrawals: 0,
  iraWithdrawals: 0,
  esaWithdrawals: 0,
  fiveTwentyNineWithdrawals: 0,
  hsaBalance: 0,
  realEstateForSale: 0,
  rentalPropertyIncome: 0,
  businessCashAndReceivables: 0,
  businessInventory: 0,
  illiquidAssetsValue: 0,
  livestockValue: 0,
  debtOwedToYou: 0,
  monthlyLivingExpenses: 0,
  insuranceExpenses: 0,
  debtsYouOwe: 0,
  propertyTax: 0,
  lateTaxPayments: 0,
};

export function calculateNisab(silverPricePerOunce: number = SILVER_PRICE_PER_OUNCE): number {
  // 595 grams of silver
  const nisabInOunces = SILVER_NISAB_GRAMS / GRAMS_PER_OUNCE;
  return nisabInOunces * silverPricePerOunce;
}

export function calculateTotalAssets(data: ZakatFormData): number {
  let total = 0;
  
  // Liquid Assets
  total += data.checkingAccounts;
  total += data.savingsAccounts;
  total += data.cashOnHand;
  
  // Precious Metals
  if (data.hasPreciousMetals) {
    total += data.goldValue;
    total += data.silverValue;
  }
  
  // Investments
  total += data.activeInvestments;
  // Passive investments use the 30% rule
  total += data.passiveInvestmentsValue * 0.30;
  total += data.dividends;
  
  // Retirement Accounts (accessible portions only)
  total += data.rothIRAContributions;
  total += data.fourOhOneKWithdrawals;
  total += data.iraWithdrawals;
  total += data.esaWithdrawals;
  total += data.fiveTwentyNineWithdrawals;
  total += data.hsaBalance;
  
  // Real Estate (for business purposes)
  if (data.hasRealEstate) {
    total += data.realEstateForSale;
    total += data.rentalPropertyIncome;
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
    total += data.debtOwedToYou;
  }
  
  return total;
}

export function calculateTotalLiabilities(data: ZakatFormData): number {
  let total = 0;
  
  total += data.monthlyLivingExpenses;
  total += data.insuranceExpenses;
  total += data.debtsYouOwe;
  
  if (data.hasTaxPayments) {
    total += data.propertyTax;
    total += data.lateTaxPayments;
  }
  
  return total;
}

export function calculateZakat(data: ZakatFormData, silverPrice: number = SILVER_PRICE_PER_OUNCE): {
  totalAssets: number;
  totalLiabilities: number;
  netZakatableWealth: number;
  nisab: number;
  isAboveNisab: boolean;
  zakatDue: number;
} {
  const totalAssets = calculateTotalAssets(data);
  const totalLiabilities = calculateTotalLiabilities(data);
  const netZakatableWealth = Math.max(0, totalAssets - totalLiabilities);
  const nisab = calculateNisab(silverPrice);
  const isAboveNisab = netZakatableWealth >= nisab;
  const zakatDue = isAboveNisab ? netZakatableWealth * ZAKAT_RATE : 0;
  
  return {
    totalAssets,
    totalLiabilities,
    netZakatableWealth,
    nisab,
    isAboveNisab,
    zakatDue,
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

export function parseMathExpression(expression: string): number {
  if (!expression || expression.trim() === '') return 0;
  
  // Remove any characters that aren't numbers, operators, decimal points, or spaces
  const sanitized = expression.replace(/[^0-9+\-*/.() ]/g, '');
  
  try {
    // Use Function constructor for safe evaluation of basic math
    const result = new Function(`return ${sanitized}`)();
    return isNaN(result) ? 0 : result;
  } catch {
    return 0;
  }
}
