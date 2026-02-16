import { ZakatFormData } from './zakatTypes';
import { defaultFormData } from './calculators/utils';

export const AHMED_PROFILE: ZakatFormData = {
    ...defaultFormData,
    // Household Info
    isHousehold: true,
    householdMembers: [
        { id: 'self', name: 'Ahmed', relationship: 'self' },
        { id: 'spouse', name: 'Fatima', relationship: 'spouse' }
    ],
    age: 42,

    // Assets
    checkingAccounts: 45000,          // "Cash & Savings"
    rentalPropertyIncome: 12000,      // "Rental Income"

    // Retirement
    fourOhOneKVestedBalance: 320000,  // "320k 401k (Vested)"
    isOver59Half: false,              // Under 59.5 (Age 42)
    rothIRAContributions: 60000,      // "Roth Contrib"

    // Investments
    passiveInvestmentsValue: 150000,  // "Passive ETF"
    passiveInvestmentIntent: 'muhtakir',
    reitsValue: 30000,               // "REITs"

    // Real Estate / Land
    landBankingValue: 75000,         // "Land Banking"

    // Metals
    goldJewelryValue: 8000,          // "Gold Jewelry"
    hasPreciousMetals: true,

    // Liabilities
    monthlyMortgage: 3000,           // $36k / 12 months = $3,000/mo
    creditCardBalance: 5000,         // "Credit Card"
};
