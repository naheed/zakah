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

import { ZakatFormData } from '../zakatTypes';
import { ZakatMethodologyConfig } from '../config/types';
import { DEFAULT_CONFIG } from '../config/defaults';

// =============================================================================
// Liability Calculation Engine (ZMCS v1.0)
// =============================================================================
//
// This function calculates total deductible liabilities based on the methodology
// config. It supports 4 deduction methods:
//
//   1. 'no_deduction'     — Return 0 (Shafi'i: debts don't prevent Zakat)
//   2. 'full_deduction'   — All debts fully deductible (Hanafi/Hanbali)
//   3. '12_month_rule'    — Debts due within the coming year (Maliki/Bradford)
//   4. 'current_due_only' — Only this month's payments (AMJA strict)
//
// Per-category debt types allow granular control:
//   - 'full': Annual (12× monthly) approximation
//   - '12_months': Same as full (12× monthly)
//   - 'current_due': Monthly amount (1× monthly)
//   - 'none': Not deductible
//
// BUGS FIXED (v1.0):
//   - Removed accidental 360× multiplier on housing 'full' (was monthlyMortgage * 12 * 30)
//   - Fixed double-addition of studentLoansDue for 'full' type
//   - Insurance and unpaid bills now governed by per-category config rules
//   - Tax liabilities now governed by config (were outside personal_debt.types check)
//

export function calculateTotalLiabilities(
    data: ZakatFormData,
    config: ZakatMethodologyConfig = DEFAULT_CONFIG
): number {
    let total = 0;
    const liabRules = config.liabilities;
    const personalRules = liabRules.personal_debt;

    // ═══════════════════════════════════════════════════════════════════════
    // 1. Global Method Check
    // ═══════════════════════════════════════════════════════════════════════
    if (liabRules.method === 'no_deduction') {
        console.log('[ZMCS Liabilities] Method: no_deduction → 0');
        return 0;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 2. Personal Debts
    // ═══════════════════════════════════════════════════════════════════════
    if (personalRules.deductible && personalRules.types) {
        const types = personalRules.types;

        // ── Helper: Calculate deduction amount for a monthly recurring expense ──
        const calcRecurring = (monthlyAmount: number, rule: string | undefined): number => {
            switch (rule) {
                case 'full':
                case '12_months':
                    return monthlyAmount * 12; // Annual approximation
                case 'current_due':
                    return monthlyAmount * 1;  // Just this month
                case 'none':
                default:
                    return 0;
            }
        };

        // ── Helper: Calculate deduction for a lump-sum debt ──
        const calcLumpSum = (amount: number, rule: string | undefined): number => {
            switch (rule) {
                case 'full':
                case 'current_due':
                    return amount; // Full outstanding balance
                case 'none':
                default:
                    return 0;
            }
        };

        // ── Living Expenses ──
        const livingDeduction = calcRecurring(data.monthlyLivingExpenses, types.living_expenses);
        total += livingDeduction;
        if (livingDeduction > 0) {
            console.log(`[ZMCS Liabilities] Living expenses: ${data.monthlyLivingExpenses}/mo × rule '${types.living_expenses}' = ${livingDeduction}`);
        }

        // ── Insurance ──
        const insuranceDeduction = calcLumpSum(data.insuranceExpenses, types.insurance);
        total += insuranceDeduction;
        if (insuranceDeduction > 0) {
            console.log(`[ZMCS Liabilities] Insurance: ${data.insuranceExpenses} × rule '${types.insurance}' = ${insuranceDeduction}`);
        }

        // ── Credit Cards ──
        const creditDeduction = calcLumpSum(data.creditCardBalance, types.credit_cards);
        total += creditDeduction;
        if (creditDeduction > 0) {
            console.log(`[ZMCS Liabilities] Credit cards: ${data.creditCardBalance} × rule '${types.credit_cards}' = ${creditDeduction}`);
        }

        // ── Unpaid Bills ──
        const billsDeduction = calcLumpSum(data.unpaidBills, types.unpaid_bills);
        total += billsDeduction;
        if (billsDeduction > 0) {
            console.log(`[ZMCS Liabilities] Unpaid bills: ${data.unpaidBills} × rule '${types.unpaid_bills}' = ${billsDeduction}`);
        }

        // ── Housing / Mortgage ──
        const housingDeduction = calcRecurring(data.monthlyMortgage, types.housing);
        total += housingDeduction;
        if (housingDeduction > 0) {
            console.log(`[ZMCS Liabilities] Housing: ${data.monthlyMortgage}/mo × rule '${types.housing}' = ${housingDeduction}`);
        }

        // ── Student Loans ──
        const studentDeduction = calcLumpSum(data.studentLoansDue, types.student_loans);
        total += studentDeduction;
        if (studentDeduction > 0) {
            console.log(`[ZMCS Liabilities] Student loans: ${data.studentLoansDue} × rule '${types.student_loans}' = ${studentDeduction}`);
        }

        // ── Tax Payments ──
        if (data.hasTaxPayments) {
            const taxDeduction = calcLumpSum(data.propertyTax + data.lateTaxPayments, types.taxes);
            total += taxDeduction;
            if (taxDeduction > 0) {
                console.log(`[ZMCS Liabilities] Taxes: ${data.propertyTax + data.lateTaxPayments} × rule '${types.taxes}' = ${taxDeduction}`);
            }
        }
    } else if (personalRules.deductible && !personalRules.types) {
        // If deductible but no per-type rules, fall back to global method
        console.log('[ZMCS Liabilities] Deductible but no per-type rules; using global method fallback');
        const isAnnual = liabRules.method === 'full_deduction' || liabRules.method === '12_month_rule';
        const multiplier = isAnnual ? 12 : 1;

        total += data.monthlyLivingExpenses * multiplier;
        total += data.insuranceExpenses;
        total += data.creditCardBalance;
        total += data.unpaidBills;
        total += data.monthlyMortgage * multiplier;
        total += data.studentLoansDue;

        if (data.hasTaxPayments) {
            total += data.propertyTax;
            total += data.lateTaxPayments;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 3. Cap Check (if configured)
    // ═══════════════════════════════════════════════════════════════════════
    if (personalRules.cap && personalRules.cap !== 'none') {
        // Future: Implement cap logic.
        // 'total_assets': total liabilities cannot exceed total assets
        // 'total_cash': total liabilities cannot exceed liquid cash
        // For now, log a warning if cap is set but not yet enforced.
        console.warn(`[ZMCS Liabilities] Cap '${personalRules.cap}' is configured but not yet enforced. Total deduction: ${total}`);
    }

    console.log(`[ZMCS Liabilities] Total deductible liabilities: ${total}`);
    return total;
}
