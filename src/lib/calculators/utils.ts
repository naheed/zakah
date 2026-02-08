import { NisabStandard, ZakatFormData, ZakatCalculationResult, ZakatReport } from '../zakatTypes';
import { Parser } from 'expr-eval';

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

// --- Constants ---
export const SILVER_NISAB_GRAMS = 595;
export const GOLD_NISAB_GRAMS = 85;
export const SILVER_PRICE_PER_OUNCE = 24.50; // Default, should be updated with real-time data
export const GOLD_PRICE_PER_OUNCE = 2650; // Default, should be updated with real-time data
export const GRAMS_PER_OUNCE = 31.1035;

export const ZAKAT_RATE = 0.025; // 2.5% for lunar year
export const SOLAR_ZAKAT_RATE = 0.02577; // Adjusted for solar year (2.5% * 365.25/354.37)

export const defaultFormData: ZakatFormData = {
    currency: 'USD',
    calendarType: 'lunar',
    nisabStandard: 'silver',
    madhab: 'balanced',
    entryMethod: 'manual',
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
    goldInvestmentValue: 0,
    goldJewelryValue: 0,
    silverInvestmentValue: 0,
    silverJewelryValue: 0,
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

export const ASSET_COLORS = {
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

// --- Formatters ---

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

export function formatCompactCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
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

// --- Math Helpers ---

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
