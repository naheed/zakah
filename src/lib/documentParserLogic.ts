import { ZakatFormData } from "@/lib/zakatTypes";

/**
 * Maps the legacy extracted data format from the Edge Function
 * to the current ZakatFormData structure.
 */
export function mapLegacyData(legacyData: any): Partial<ZakatFormData> {
    if (!legacyData) return {};

    const mappedData: Partial<ZakatFormData> = {
        // Liquid Assets
        checkingAccounts: legacyData.checkingAccounts,
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
            (acc as any)[key] = value;
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
                const current = (totalData as any)[key] || 0;
                (totalData as any)[key] = current + val;
            }
        });
    });

    return totalData;
}
