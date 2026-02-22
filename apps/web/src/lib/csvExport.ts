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

        // Resolve config for methodology rules (analogous to calculateTotalLiabilities)
        const effectiveConfig = MADHAB_RULES[madhab || 'bradford'] ? (require('@zakatflow/core').ZAKAT_PRESETS[madhab || 'bradford'] || require('@zakatflow/core').DEFAULT_CONFIG) : require('@zakatflow/core').DEFAULT_CONFIG;
        const liabRules = effectiveConfig.liabilities;
        const personalRules = liabRules.personal_debt;
        const types = personalRules.types || {};

        const liabilityFields = [
            { key: 'monthlyLivingExpenses', label: 'Living Expenses', ruleType: types.living_expenses, isRecurring: true },
            { key: 'insuranceExpenses', label: 'Insurance', ruleType: types.insurance, isRecurring: false },
            { key: 'creditCardBalance', label: 'Credit Card Balance', ruleType: types.credit_cards, isRecurring: false },
            { key: 'unpaidBills', label: 'Unpaid Bills', ruleType: types.unpaid_bills, isRecurring: false },
            { key: 'monthlyMortgage', label: 'Housing/Mortgage', ruleType: types.housing, isRecurring: true },
            { key: 'studentLoansDue', label: 'Student Loans', ruleType: types.student_loans, isRecurring: true },
            { key: 'propertyTax', label: 'Property Tax', ruleType: types.taxes, isRecurring: false },
            { key: 'lateTaxPayments', label: 'Late Tax Payments', ruleType: types.taxes, isRecurring: false },
        ];

        liabilityFields.forEach(l => {
            const val = formData[l.key as keyof typeof formData] as number | undefined;
            if (val && val > 0) {
                // If the user's config doesn't use 'per-type' rules (types undefined), fallback to method
                let ruleDesc = l.ruleType || "Global Fallback";
                let deduction = 0;
                let multiplier = 1;

                if (liabRules.method === 'no_deduction') {
                    deduction = 0;
                    ruleDesc = "Not Deductible";
                } else if (personalRules.deductible) {
                    if (personalRules.types) {
                        const rule = l.ruleType;
                        if (rule === 'full' || rule === '12_months') {
                            multiplier = l.isRecurring ? 12 : 1;
                        } else if (rule === 'none') {
                            multiplier = 0;
                        } else {
                            multiplier = 1; // current_due
                        }
                    } else {
                        // Global fallback
                        const isAnnual = liabRules.method === 'full_deduction' || liabRules.method === '12_month_rule';
                        multiplier = isAnnual && l.isRecurring ? 12 : 1;
                    }
                    deduction = val * multiplier;

                    if (l.isRecurring && multiplier === 12) {
                        ruleDesc = "Annualized (12 Months)";
                    } else if (multiplier === 1) {
                        ruleDesc = l.isRecurring ? "Current Month Only" : "Full Value";
                    } else if (multiplier === 0) {
                        ruleDesc = "Not Deductible";
                    }

                }

                if (deduction > 0) {
                    rows.push(["Liability", safe(l.label), money(val), "100%", money(deduction), safe(ruleDesc)]);
                }
            }
        });
        rows.push([]);
    }

    // 5. Methodology Glossary (The "Depth Bar")
    rows.push(["METHODOLOGY GLOSSARY"]);
    rows.push(["Selected Methodology", safe(methodologyName)]);
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
