import { ZakatFormData } from '../zakatTypes';
import { MADHAB_RULES } from '../madhahRules';

export function calculateTotalLiabilities(data: ZakatFormData): number {
    let total = 0;

    // Get the debt deduction method from the madhab rules
    const debtMethod = MADHAB_RULES[data.madhab].debtDeductionMethod;

    // Shafi'i position: Debt does NOT prevent Zakat (Al-Nawawi)
    if (debtMethod === 'none') {
        return 0; // No deductions allowed
    }

    // Immediate debts are always deductible (all schools that allow deduction)
    total += data.monthlyLivingExpenses * 12; // Annualized living expenses (12-month obligation)
    total += data.insuranceExpenses;
    total += data.creditCardBalance; // Due immediately
    total += data.unpaidBills; // Due immediately
    total += data.studentLoansDue; // Only current payments due

    // Mortgage handling differs by debtDeductionMethod
    if (debtMethod === 'full') {
        // Hanafi/Hanbali: Full debt deduction
        // Note: We use 12x monthly as proxy for annual principal (ideal: use actual remaining balance)
        total += data.monthlyMortgage * 12; // Using annual as proxy for full debt visibility
    } else if (debtMethod === 'twelve_month') {
        // AAOIFI/Maliki: Only 12 months of payments deductible
        total += data.monthlyMortgage * 12;
    }

    if (data.hasTaxPayments) {
        total += data.propertyTax; // Recurring annual obligation - deductible
        // Note: estimatedTaxPayment is NOT deducted - it's a one-time estimated payment,
        // not a recurring 12-month debt (Maliki ruling distinguishes dayn mustaqir vs ghair mustaqir)
        total += data.lateTaxPayments;
    }

    return total;
}
