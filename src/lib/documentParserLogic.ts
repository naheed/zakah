import { ZakatFormData } from "@/lib/zakatTypes";

/** Legacy format from Edge Function document extraction */
interface LegacyExtractedData {
    checkingAccounts?: number;
    savingsAccounts?: number;
    cashOnHand?: number;
    digitalWallets?: number;
    foreignCurrency?: number;
    interestEarned?: number;
    goldInvestmentValue?: number;
    goldValue?: number;
    silverInvestmentValue?: number;
    silverValue?: number;
    cryptoCurrency?: number;
    cryptoTrading?: number;
    activeInvestments?: number;
    passiveInvestmentsValue?: number;
    dividends?: number;
    rothIRAContributions?: number;
    rothIRAEarnings?: number;
    traditionalIRABalance?: number;
    fourOhOneKVestedBalance?: number;
    revocableTrustValue?: number;
    irrevocableTrustValue?: number;
    realEstateForSale?: number;
    rentalPropertyIncome?: number;
    businessCashAndReceivables?: number;
    businessInventory?: number;
    monthlyLivingExpenses?: number;
    creditCardBalance?: number;
    creditCardDebt?: number;
    monthlyMortgage?: number;
    studentLoansDue?: number;
}

/**
 * Maps the legacy extracted data format from the Edge Function
 * to the current ZakatFormData structure.
 */
export function mapLegacyData(legacyData: LegacyExtractedData | Record<string, unknown> | null | undefined): Partial<ZakatFormData> {
    if (!legacyData) return {};

    const data = legacyData as LegacyExtractedData;
    const mappedData: Partial<ZakatFormData> = {
        // Liquid Assets
        checkingAccounts: data.checkingAccounts,
        savingsAccounts: legacyData.savingsAccounts,
        cashOnHand: legacyData.cashOnHand,
        digitalWallets: legacyData.digitalWallets,
        foreignCurrency: legacyData.foreignCurrency,
        interestEarned: legacyData.interestEarned,

        // Precious Metals - Map legacy keys to Investment
        // Prioritize explicit investment keys, fall back to generic legacy keys
        goldInvestmentValue: legacyData.goldInvestmentValue || legacyData.goldValue,
        silverInvestmentValue: legacyData.silverInvestmentValue || legacyData.silverValue,

        // Note: Jewelry is typically not extracted by the AI unless specified,
        // so we default to 0 or undefined. AI usually lumps into 'goldValue'.

        // Crypto
        cryptoCurrency: legacyData.cryptoCurrency,
        cryptoTrading: legacyData.cryptoTrading,

        // Investments
        activeInvestments: legacyData.activeInvestments,
        passiveInvestmentsValue: legacyData.passiveInvestmentsValue,
        dividends: legacyData.dividends,

        // Retirement
        rothIRAContributions: legacyData.rothIRAContributions,
        rothIRAEarnings: legacyData.rothIRAEarnings,
        traditionalIRABalance: legacyData.traditionalIRABalance,
        fourOhOneKVestedBalance: legacyData.fourOhOneKVestedBalance,

        // Trusts
        revocableTrustValue: legacyData.revocableTrustValue,
        irrevocableTrustValue: legacyData.irrevocableTrustValue,

        // Real Estate
        realEstateForSale: legacyData.realEstateForSale,
        rentalPropertyIncome: legacyData.rentalPropertyIncome,

        // Business
        businessCashAndReceivables: legacyData.businessCashAndReceivables,
        businessInventory: legacyData.businessInventory,

        // Liabilities
        monthlyLivingExpenses: legacyData.monthlyLivingExpenses,
        creditCardBalance: legacyData.creditCardBalance || legacyData.creditCardDebt, // handle potential alias
        monthlyMortgage: legacyData.monthlyMortgage,
        studentLoansDue: legacyData.studentLoansDue,
    };

    // Clean data: Remove undefined, null, or 0 values
    const cleanData = Object.entries(mappedData).reduce((acc, [key, value]) => {
        if (typeof value === 'number' && value > 0) {
            (acc as Partial<ZakatFormData>)[key as keyof ZakatFormData] = value;
        }
        return acc;
    }, {} as Partial<ZakatFormData>);

    return cleanData;
}

/**
 * Aggregates multiple partial form data objects into a single one (summing numbers).
 */
export function aggregateResults(results: Partial<ZakatFormData>[]): Partial<ZakatFormData> {
    const totalData: Partial<ZakatFormData> = {};

    results.forEach(res => {
        (Object.keys(res) as (keyof ZakatFormData)[]).forEach(key => {
            const val = res[key];
            if (typeof val === 'number') {
                const current = (totalData[key] as number | undefined) ?? 0;
                (totalData as Partial<ZakatFormData>)[key] = current + val;
            }
        });
    });

    return totalData;
}
