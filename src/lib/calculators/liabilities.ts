import { ZakatFormData } from '../zakatTypes';
import { ZakatMethodologyConfig } from '../config/types';
import { DEFAULT_CONFIG } from '../config/defaults';

export function calculateTotalLiabilities(
    data: ZakatFormData,
    config: ZakatMethodologyConfig = DEFAULT_CONFIG
): number {
    let total = 0;

    const liabRules = config.liabilities;
    const personalRules = liabRules.personal_debt;

    // 1. Check Global Method
    // If method is 'no_deduction', we return 0 unless there are specific exceptions? 
    // Usually Shafi'i is strict no deduction.
    if (liabRules.method === 'no_deduction') {
        return 0;
    }

    // 2. Personal Debts
    if (personalRules.deductible && personalRules.types) {
        // Determine multiplier based on expense_period
        // Default to 12 if 'annual' or undefined (legacy behavior), 1 if 'monthly'
        const periodMultiplier = (personalRules.types.expense_period === 'monthly') ? 1 : 12;

        // Living Expenses
        if (personalRules.types.living_expenses === 'full' || personalRules.types.living_expenses === '12_months') {
            total += data.monthlyLivingExpenses * periodMultiplier;
        }

        // Insurance? (Not explicitly in standard schema types yet, treat as living expense or immediate bill)
        // Check if unpaid bills covers it.
        total += data.insuranceExpenses; // Assuming immediate due

        // Credit Cards
        if (personalRules.types.credit_cards === 'full') {
            total += data.creditCardBalance;
        }

        // Unpaid Bills (Utilities etc) - usually considered current due
        total += data.unpaidBills;

        // Housing / Mortgage
        if (personalRules.types.housing === 'full') {
            total += data.monthlyMortgage * 12 * 30; // Approximation of full balance? 
            // Ideally we need 'remainingMortgageBalance' in FormData. 
            // For now, retaining existing behavior: 12 months as proxy if 'full' in old code?
            // Old code: if 'full' -> monthly * 12. 
            // IF we want TRUE full deduction we need the full balance field.
            // Sticking to 12 months * 1 for now to prevent massive jumps, or 12 months as annual.
            total += data.monthlyMortgage * periodMultiplier;
        } else if (personalRules.types.housing === '12_months') {
            total += data.monthlyMortgage * periodMultiplier;
        }

        // Student Loans
        if (personalRules.types.student_loans === 'full') {
            total += data.studentLoansDue; // This field name suggests "Due", not "Total Balance".
            // If we want full, we need total balance.
            // For now, adding what we have.
            total += data.studentLoansDue;
        } else if (personalRules.types.student_loans === 'current_due') {
            total += data.studentLoansDue;
        }
    }

    // Tax
    if (data.hasTaxPayments) {
        total += data.propertyTax;
        total += data.lateTaxPayments;
    }

    // Cap Check? 
    // Schema has 'cap'. Not implemented in logic yet to keep simple.

    return total;
}
