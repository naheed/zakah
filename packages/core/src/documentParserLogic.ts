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

import { ZakatFormData } from "./zakatTypes";

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

    const data = legacyData as Record<string, unknown>;
    const num = (key: string): number | undefined => {
        const v = data[key];
        return typeof v === 'number' ? v : undefined;
    };

    const mappedData: Partial<ZakatFormData> = {
        checkingAccounts: num('checkingAccounts'),
        savingsAccounts: num('savingsAccounts'),
        cashOnHand: num('cashOnHand'),
        digitalWallets: num('digitalWallets'),
        foreignCurrency: num('foreignCurrency'),
        interestEarned: num('interestEarned'),
        goldInvestmentValue: num('goldInvestmentValue') || num('goldValue'),
        silverInvestmentValue: num('silverInvestmentValue') || num('silverValue'),
        cryptoCurrency: num('cryptoCurrency'),
        cryptoTrading: num('cryptoTrading'),
        activeInvestments: num('activeInvestments'),
        passiveInvestmentsValue: num('passiveInvestmentsValue'),
        dividends: num('dividends'),
        rothIRAContributions: num('rothIRAContributions'),
        rothIRAEarnings: num('rothIRAEarnings'),
        traditionalIRABalance: num('traditionalIRABalance'),
        fourOhOneKVestedBalance: num('fourOhOneKVestedBalance'),
        revocableTrustValue: num('revocableTrustValue'),
        irrevocableTrustValue: num('irrevocableTrustValue'),
        realEstateForSale: num('realEstateForSale'),
        rentalPropertyIncome: num('rentalPropertyIncome'),
        businessCashAndReceivables: num('businessCashAndReceivables'),
        businessInventory: num('businessInventory'),
        monthlyLivingExpenses: num('monthlyLivingExpenses'),
        creditCardBalance: num('creditCardBalance') || num('creditCardDebt'),
        monthlyMortgage: num('monthlyMortgage'),
        studentLoansDue: num('studentLoansDue'),
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
                const current = (totalData[key] as number | undefined) ?? 0;
                (totalData as any)[key] = current + val;
            }
        });
    });

    return totalData;
}
