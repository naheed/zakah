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

import { ZakatReport } from "@zakatflow/core";
import type { CalculatedAssetCategory, AssetItem } from "@zakatflow/core";
import { format } from "date-fns";
import { saveAs } from "file-saver";
import { MADHAB_RULES, getAssetRuleExplanations, getMethodologyDisplayName } from "@zakatflow/core";

export interface MetalPricesForExport {
    goldPrice: number;
    silverPrice: number;
    lastUpdated?: Date | null;
}

export function generateCSV(
    report: ZakatReport,
    fileName: string = "zakat-report.csv",
    metalPrices?: MetalPricesForExport
) {
    const { input: formData, output: calculations } = report;
    const { currency, madhab } = formData;
    const {
        totalAssets,
        totalLiabilities,
        netZakatableWealth,
        zakatDue,
        interestToPurify,
        dividendsToPurify,
        enhancedBreakdown
    } = calculations;

    // Get Rules for Methodology Column
    const rawRules = MADHAB_RULES[madhab || 'bradford'] || MADHAB_RULES.bradford;
    const ruleExplanations = getAssetRuleExplanations(madhab || 'bradford');
    const methodologyName = getMethodologyDisplayName(madhab || 'bradford');


    // Helper to escape commas for CSV
    const safe = (str: string | number) => `"${String(str).replace(/"/g, '""')}"`;
    const money = (val: number | undefined | null) => safe(((val || 0)).toFixed(2));

    const rows: string[][] = [];

    // 1. Header Info & Instructions
    rows.push(["ZAKATFLOW REPORT"]);
    rows.push(["Generated", safe(format(new Date(), "PPpp"))]);
    rows.push(["For Google Sheets", "Import this file via File > Import > Upload. Formulas are not embedded for security."]);
    rows.push([]);

    // 2. Summary Section
    rows.push(["CALCULATION SUMMARY"]);
    rows.push(["Metric", "Value", "Notes"]);
    rows.push(["Total Gross Assets", money(totalAssets), "All assets before deductions/exemptions"]);
    rows.push(["Total Liabilities", money(totalLiabilities), "Deductible debts/expenses"]);
    rows.push(["Net Zakatable Wealth", money(netZakatableWealth), "Wealth subject to Zakat"]);
    rows.push(["Zakat Due", money(zakatDue), "2.5% of Net Zakatable Wealth"]);
    rows.push([]);

    // 2.5. Market Prices (if available)
    if (metalPrices) {
        rows.push(["MARKET PRICES USED"]);
        rows.push(["Metal", "Price per Troy Ounce (USD)", "Last Updated"]);
        rows.push(["Gold", money(metalPrices.goldPrice), safe(metalPrices.lastUpdated ? format(metalPrices.lastUpdated, "PPpp") : "Default")]);
        rows.push(["Silver", money(metalPrices.silverPrice), safe(metalPrices.lastUpdated ? format(metalPrices.lastUpdated, "PPpp") : "Default")]);
        rows.push([]);
    }

    // 3. Asset Breakdown Table
    rows.push(["ASSET BREAKDOWN"]);
    rows.push([
        "Category",
        "Item / Sub-Category",
        "Gross Value",
        "Zakatable %",
        "Zakatable Amount",
        "Methodology Rule"
    ]);

    // Breakdown Logic
    const addCategory = (key: string, cat: CalculatedAssetCategory) => {
        // Determine rule explanation based on key & madhab
        // Now using centralized logic from madhahRules
        let ruleNote = "Standard (100%)";
        if (key in ruleExplanations) {
            // @ts-ignore
            ruleNote = ruleExplanations[key].sub;
        }

        if (cat.items && cat.items.length > 0) {
            cat.items.forEach((item: AssetItem & { type?: string }) => {
                rows.push([
                    safe(cat.label),
                    safe(item.name || item.type || "Item"),
                    money(item.value),
                    safe(((item.zakatablePercent ?? 0) * 100).toFixed(0) + "%"),
                    money(item.zakatableAmount),
                    safe(ruleNote)
                ]);
            });
        } else if (cat.total > 0) {
            rows.push([
                safe(cat.label),
                "General",
                money(cat.total),
                safe((cat.zakatablePercent * 100).toFixed(0) + "%"),
                money(cat.zakatableAmount),
                safe(ruleNote)
            ]);
        }
    };

    const keys = [
        'liquidAssets', 'investments', 'retirement', 'realEstate',
        'business', 'preciousMetals', 'crypto', 'debtOwedToYou', 'otherAssets'
    ];

    keys.forEach(k => {
        const cat = enhancedBreakdown[k as keyof typeof enhancedBreakdown];
        if (cat && 'zakatableAmount' in cat) addCategory(k, cat);
    });

    rows.push([]);

    // 4. Liabilities Breakdown
    if (totalLiabilities > 0) {
        rows.push(["LIABILITIES DEDUCTED"]);
        rows.push(["Type", "Description", "Amount", "Deductible %", "Deduction", "Rule"]);

        const liabilityFields = [
            { key: 'creditCardBalance', label: 'Credit Card Balance' },
            { key: 'unpaidBills', label: 'Unpaid Bills' },
            { key: 'studentLoansDue', label: 'Student Loans' },
            { key: 'lateTaxPayments', label: 'Late Tax Payments' },
            { key: 'outstandingDebts', label: 'Other Debts' }
        ];

        const debtRule = rawRules.debtDeductionMethod === 'twelve_month' ? "12-Month Living Expenses Cap" :
            rawRules.debtDeductionMethod === 'none' ? "Not Deductible" : "Full Deduction";

        liabilityFields.forEach(l => {
            const val = formData[l.key as keyof typeof formData] as number | undefined;
            if (val && val > 0) {
                rows.push(["Liability", safe(l.label), money(val), "100%", money(val), safe(debtRule)]);
            }
        });
        rows.push([]);
    }

    // 5. Methodology Glossary (The "Depth Bar")
    rows.push(["METHODOLOGY GLOSSARY"]);
    rows.push(["Selected School", safe(methodologyName)]);
    rows.push(["Core Principle", safe("See Methodology page for details")]); // Rules object no longer has description directly
    rows.push(["Jewelry Ruling", safe(ruleExplanations.preciousMetals.sub)]);
    rows.push(["Retirement Ruling", safe(ruleExplanations.retirement.sub)]);
    rows.push(["Investment Ruling", safe(ruleExplanations.investments.sub)]);
    rows.push(["Ref", "https://zakatflow.org/methodology"]);

    // Convert to String
    const csvContent = rows.map(r => r.join(",")).join("\n");

    // Trigger Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, fileName);
}
