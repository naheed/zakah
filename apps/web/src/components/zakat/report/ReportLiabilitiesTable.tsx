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

import { formatCurrency, ZakatFormData, ZAKAT_PRESETS, DEFAULT_CONFIG } from "@zakatflow/core";
import { Warning } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface ReportLiabilitiesTableProps {
    formData: ZakatFormData;
    madhab: string;
    totalLiabilities: number;
    currency: string;
}

const LIABILITY_FIELDS = [
    { key: 'monthlyLivingExpenses', label: 'Living Expenses', configKey: 'living_expenses', isRecurring: true },
    { key: 'insuranceExpenses', label: 'Insurance', configKey: 'insurance', isRecurring: false },
    { key: 'creditCardBalance', label: 'Credit Card Balance', configKey: 'credit_cards', isRecurring: false },
    { key: 'unpaidBills', label: 'Unpaid Bills', configKey: 'unpaid_bills', isRecurring: false },
    { key: 'monthlyMortgage', label: 'Housing / Mortgage', configKey: 'housing', isRecurring: true },
    { key: 'studentLoansDue', label: 'Student Loans', configKey: 'student_loans', isRecurring: true },
    { key: 'propertyTax', label: 'Property Tax', configKey: 'taxes', isRecurring: false },
    { key: 'lateTaxPayments', label: 'Late Tax Payments', configKey: 'taxes', isRecurring: false },
];

function getRuleLabel(rule: string | undefined, isRecurring: boolean, multiplier: number): string {
    if (multiplier === 0) return "Not Deductible";
    if (isRecurring && multiplier === 12) return "Annualized (12 Mo.)";
    if (multiplier === 1) return isRecurring ? "Current Month" : "Full Value";
    return rule || "Standard";
}

export function ReportLiabilitiesTable({ formData, madhab, totalLiabilities, currency }: ReportLiabilitiesTableProps) {
    if (totalLiabilities <= 0) return null;

    const effectiveConfig = ZAKAT_PRESETS[madhab || 'bradford'] || DEFAULT_CONFIG;
    const liabRules = effectiveConfig.liabilities;
    const personalRules = liabRules.personal_debt;
    const types = (personalRules.types || {}) as Record<string, string>;

    const rows = LIABILITY_FIELDS.map((field) => {
        const val = formData[field.key as keyof ZakatFormData] as number | undefined;
        if (!val || val <= 0) return null;

        let multiplier = 1;

        if (liabRules.method === 'no_deduction') {
            multiplier = 0;
        } else if (personalRules.deductible) {
            if (personalRules.types) {
                const rule = types[field.configKey];
                if (rule === 'full' || rule === '12_months') {
                    multiplier = field.isRecurring ? 12 : 1;
                } else if (rule === 'none') {
                    multiplier = 0;
                } else {
                    multiplier = 1; // current_due
                }
            } else {
                const isAnnual = liabRules.method === 'full_deduction' || liabRules.method === '12_month_rule';
                multiplier = isAnnual && field.isRecurring ? 12 : 1;
            }
        }

        const deduction = val * multiplier;
        if (deduction <= 0) return null;

        return {
            label: field.label,
            inputAmount: val,
            multiplier,
            deduction,
            isRecurring: field.isRecurring,
            ruleLabel: getRuleLabel(types[field.configKey], field.isRecurring, multiplier),
        };
    }).filter(Boolean) as {
        label: string;
        inputAmount: number;
        multiplier: number;
        deduction: number;
        isRecurring: boolean;
        ruleLabel: string;
    }[];

    if (rows.length === 0) return null;

    return (
        <section className="mt-10">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-0.5 h-4 bg-destructive rounded-full" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Liabilities Deducted
                </h3>
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-12 gap-2 items-center px-4 py-2.5 bg-muted/50 border-b border-border text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <div className="col-span-4">Debt Category</div>
                    <div className="col-span-3 text-right">Input Amount</div>
                    <div className="col-span-2 text-center">Rule</div>
                    <div className="col-span-3 text-right">Deduction</div>
                </div>

                {/* Rows */}
                {rows.map((row, idx) => (
                    <div
                        key={idx}
                        className={cn(
                            "grid grid-cols-12 gap-2 items-center px-4 py-3 border-b border-border/50 last:border-b-0",
                            "hover:bg-muted/30 transition-colors"
                        )}
                    >
                        <div className="col-span-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-destructive/60 shrink-0" />
                            <div>
                                <span className="text-sm font-medium text-foreground">{row.label}</span>
                                {row.isRecurring && row.multiplier === 12 && (
                                    <span className="block text-[10px] text-muted-foreground">Monthly → Annual</span>
                                )}
                            </div>
                        </div>
                        <div className="col-span-3 text-right text-sm text-muted-foreground tabular-nums">
                            {formatCurrency(row.inputAmount, currency, 0)}
                            {row.isRecurring && <span className="text-[10px] text-muted-foreground/60">/mo</span>}
                        </div>
                        <div className="col-span-2 flex justify-center">
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-destructive/10 text-destructive whitespace-nowrap">
                                {row.ruleLabel}
                            </span>
                        </div>
                        <div className="col-span-3 text-right text-sm font-semibold text-destructive tabular-nums">
                            −{formatCurrency(row.deduction, currency, 0)}
                        </div>
                    </div>
                ))}

                {/* Total Row */}
                <div className="grid grid-cols-12 gap-2 items-center px-4 py-3 bg-destructive/5 border-t border-destructive/20">
                    <div className="col-span-4 flex items-center gap-2">
                        <Warning weight="fill" className="w-4 h-4 text-destructive" />
                        <span className="text-sm font-bold text-foreground">Total Deducted</span>
                    </div>
                    <div className="col-span-5" />
                    <div className="col-span-3 text-right text-sm font-bold text-destructive tabular-nums">
                        −{formatCurrency(totalLiabilities, currency, 0)}
                    </div>
                </div>
            </div>
        </section>
    );
}
