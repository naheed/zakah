
import { calculateTotalLiabilities } from '../src/lib/calculators/liabilities';
import { ZakatFormData } from '../src/lib/zakatCalculations';
import { ZakatMethodologyConfig } from '../src/lib/config/types';

// Mock Data
const mockData: ZakatFormData = {
    monthlyLivingExpenses: 1000,
    monthlyMortgage: 2000,
    insuranceExpenses: 0,
    creditCardBalance: 0,
    unpaidBills: 0,
    studentLoansDue: 0,
    isHousehold: false,
    methodology: 'balanced',
    hawlMet: true,
    nisabMet: true,
    location: 'US',
    currency: 'USD',
    // ... add other required fields with dummy values
    cash: { onHand: 0, checking: 0, savings: 0, digital: 0, foreign: 0, interest: 0 },
    preciousMetals: { gold: 0, silver: 0, investment: 0 },
    stocks: { brokerage: 0, active: 0, retirement: 0 },
    crypto: { coins: 0, stablecoins: 0, exchange: 0 },
    realEstate: { primary: 0, investment: 0, rental: 0 },
    business: { cash: 0, receivables: 0, inventory: 0, payables: 0 },
    debts: { owedToYou: 0 },
    metals: { gold: 0, silver: 0, investment: 0 },
};

// Mock Config Template
const baseConfig: ZakatMethodologyConfig = {
    meta: { id: 'test', name: 'Test', version: '1', author: 'Test', description: 'Test', certification: { certified_by: 'Test', url: 'Test' } },
    thresholds: { nisab: { default_standard: 'silver', gold_grams: 85, silver_grams: 595 }, zakat_rate: { lunar: 0.025, solar: 0.02577 } },
    assets: {} as any, // Simplified
    liabilities: {
        method: '12_month_rule',
        commercial_debt: 'none',
        personal_debt: {
            deductible: true,
            types: {
                housing: '12_months',
                expense_period: 'annual', // Default
                student_loans: 'current_due',
                credit_cards: 'full',
                living_expenses: '12_months',
            }
        }
    }
};

// Test Case 1: Annual Expense Period (Default)
const configAnnual = JSON.parse(JSON.stringify(baseConfig));
configAnnual.liabilities.personal_debt.types.expense_period = 'annual';

const annualLiabilities = calculateTotalLiabilities(mockData, configAnnual);
console.log(`Annual Config Result: ${annualLiabilities}`);
// Expected: (1000 * 12) + (2000 * 12) = 12000 + 24000 = 36000

// Test Case 2: Monthly Expense Period
const configMonthly = JSON.parse(JSON.stringify(baseConfig));
configMonthly.liabilities.personal_debt.types.expense_period = 'monthly';

const monthlyLiabilities = calculateTotalLiabilities(mockData, configMonthly);
console.log(`Monthly Config Result: ${monthlyLiabilities}`);
// Expected: (1000 * 1) + (2000 * 1) = 1000 + 2000 = 3000

if (annualLiabilities === 36000 && monthlyLiabilities === 3000) {
    console.log("SUCCESS: Calculation logic verified.");
} else {
    console.error("FAILURE: Calculation logic mismatch.");
    console.error(`Expected Annual: 36000, Got: ${annualLiabilities}`);
    console.error(`Expected Monthly: 3000, Got: ${monthlyLiabilities}`);
    process.exit(1);
}
