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

export type CalendarType = 'lunar' | 'solar';
export type NisabStandard = 'silver' | 'gold';
/**
 * Supported Zakat calculation methodologies.
 *
 * Classical madhabs:
 *   - 'hanafi'    — Classical Hanafi (Abu Hanifa, Al-Kasani, Al-Marghinani)
 *   - 'shafii'    — Classical Shafi'i (Al-Nawawi, Al-Shirazi)
 *   - 'maliki'    — Classical Maliki (Khalil, Al-Dardir)
 *   - 'hanbali'   — Classical Hanbali (Ibn Qudama, Al-Mardawi)
 *
 * Modern scholarly methodologies:
 * Modern scholarly methodologies:
 *   - 'bradford'      — Sheikh Joe Bradford's modern synthesis (30% proxy, age-conditional retirement)
 *   - 'amja'          — AMJA (Assembly of Muslim Jurists of America) rulings
 *   - 'tahir_anwar'   — Imam Tahir Anwar's Hanafi-leaning approach (strong ownership)
 *   - 'qaradawi'      — Dr. Yusuf Al-Qaradawi's Fiqh al-Zakah (progressive ijtihād, most influential modern text)
 */
export type Madhab = 'bradford' | 'hanafi' | 'shafii' | 'maliki' | 'hanbali' | 'amja' | 'tahir_anwar' | 'qaradawi';

// Legacy alias for backward compatibility during migration
// No alias needed, Madhab is the single source of truth

// Maliki distinction: Mudir (active trader) vs Muhtakir (long-term holder)
export type InvestmentIntent = 'mudir' | 'muhtakir';

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
    madhab: Madhab; // User's preferred school of thought (determines all calculation rules)
    entryMethod?: 'manual' | 'upload'; // v0.20.0: Manual entry vs Batch Upload
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
    goldInvestmentValue: number; // Coins, bars, bullion (Always Zakatable)
    goldJewelryValue: number;    // Wearable jewelry (Zakatable based on Madhab)
    silverInvestmentValue: number;
    silverJewelryValue: number;


    // Crypto & Digital Assets
    cryptoCurrency: number; // BTC, ETH treated as currency
    cryptoTrading: number; // Altcoins, NFTs for trading
    stakedAssets: number; // Principal only
    stakedRewardsVested: number; // Vested staking rewards
    liquidityPoolValue: number; // Current redeemable value

    // Investments
    activeInvestments: number;
    passiveInvestmentsValue: number;
    passiveInvestmentIntent: InvestmentIntent; // Mudir (trade) or Muhtakir (hold)
    reitsValue: number; // Equity REITs - market value (avoid Mortgage REITs)
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
    // Retirement Access Settings
    retirementWithdrawalAllowed: boolean; // Does employer allow early withdrawal?
    retirementWithdrawalLimit: number; // Max % allowed to withdraw (0-1)
    isOver59Half: boolean;

    // Trusts
    revocableTrustValue: number;
    irrevocableTrustAccessible: boolean;
    irrevocableTrustValue: number;
    clatValue: number; // Not Zakatable during annuity term

    // Real Estate
    realEstateForSale: number; // Property for flipping - full value
    landBankingValue: number; // Undeveloped land held for appreciation - full value
    rentalPropertyIncome: number; // Net rental income in bank

    // Business
    isServiceBusiness: boolean; // Toggle for service businesses (no inventory)
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

export interface AssetBreakdown {
    liquidAssets: number;
    investments: number;
    retirement: number;
    realEstate: number;
    business: number;
    otherAssets: number;
    exemptAssets: number;
}

// Enhanced Asset Breakdown for PDF Report v2
export interface AssetItem {
    name: string;
    value: number;
    zakatablePercent?: number;
    zakatableAmount?: number;
}

export interface AssetCategory {
    label: string;
    color: string;
    total: number;
    zakatableAmount: number;
    zakatablePercent: number;
    percentOfNetZakatable: number;
    items: AssetItem[];
}

export interface LiabilityItem {
    name: string;
    value: number;
}

export interface EnhancedAssetBreakdown {
    liquidAssets: AssetCategory;
    preciousMetals: AssetCategory;
    crypto: AssetCategory;
    investments: AssetCategory;
    retirement: AssetCategory;
    trusts: AssetCategory;
    realEstate: AssetCategory;
    business: AssetCategory;
    debtOwedToYou: AssetCategory;
    illiquidAssets: AssetCategory;
    liabilities: {
        label: string;
        color: string;
        total: number;
        items: LiabilityItem[];
    };
    exempt: {
        label: string;
        color: string;
        total: number;
        items: AssetItem[];
    };
}

export interface ZakatCalculationResult {
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
}

export interface ZakatReport {
    meta: {
        timestamp: string;
        reportId: string;
        version: string;
        referralCode?: string;
    };
    input: ZakatFormData;
    output: ZakatCalculationResult;
}
