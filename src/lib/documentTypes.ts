import { ZakatFormData } from "./zakatCalculations";

// Minimal definition to avoid circular imports with useDocumentParsingV2
export interface ExtractionLineItem {
  description: string;
  amount: number;
  inferredCategory: string;
  confidence?: number; // Optional - AI may not always provide this
}

// Represents a single uploaded and processed document
export interface UploadedDocument {
  id: string;
  fileName: string;
  uploadedAt: string;
  institutionName: string;
  accountName?: string;
  accountId?: string; // Last 4 digits (e.g. "1234")
  documentDate?: string;
  summary: string;
  notes?: string;
  extractedData: Partial<ZakatFormData>;
  lineItems?: ExtractionLineItem[]; // NEW: Granular line items (V2)
  mimeType: string;
}

// Maps each form field to the step/page it belongs to
export const fieldToStepMapping: Record<keyof ZakatFormData, string> = {
  // Liquid Assets
  checkingAccounts: "liquid-assets",
  savingsAccounts: "liquid-assets",
  cashOnHand: "liquid-assets",
  digitalWallets: "liquid-assets",
  foreignCurrency: "liquid-assets",
  interestEarned: "liquid-assets",

  // Investments
  activeInvestments: "investments",
  passiveInvestmentsValue: "investments",
  passiveInvestmentIntent: "investments",
  dividends: "investments",
  dividendPurificationPercent: "investments",

  // Retirement
  rothIRAContributions: "retirement",
  rothIRAEarnings: "retirement",
  traditionalIRABalance: "retirement",
  fourOhOneKVestedBalance: "retirement",
  fourOhOneKUnvestedMatch: "retirement",
  iraWithdrawals: "retirement",
  esaWithdrawals: "retirement",
  fiveTwentyNineWithdrawals: "retirement",
  hsaBalance: "retirement",
  isOver59Half: "retirement",

  // Precious Metals
  goldInvestmentValue: "precious-metals",
  goldJewelryValue: "precious-metals",
  silverInvestmentValue: "precious-metals",
  silverJewelryValue: "precious-metals",

  // Crypto
  cryptoCurrency: "crypto",
  cryptoTrading: "crypto",
  stakedAssets: "crypto",
  stakedRewardsVested: "crypto",
  liquidityPoolValue: "crypto",

  // Trusts
  revocableTrustValue: "trusts",
  irrevocableTrustAccessible: "trusts",
  irrevocableTrustValue: "trusts",
  clatValue: "trusts",

  // Real Estate
  realEstateForSale: "real-estate",
  rentalPropertyIncome: "real-estate",

  // Business
  businessCashAndReceivables: "business",
  businessInventory: "business",

  // Illiquid Assets
  illiquidAssetsValue: "illiquid-assets",
  livestockValue: "illiquid-assets",

  // Debt Owed To You
  goodDebtOwedToYou: "debt-owed",
  badDebtRecovered: "debt-owed",

  // Liabilities
  monthlyLivingExpenses: "liabilities",
  insuranceExpenses: "liabilities",
  creditCardBalance: "liabilities",
  unpaidBills: "liabilities",
  monthlyMortgage: "liabilities",
  studentLoansDue: "liabilities",
  propertyTax: "liabilities",
  lateTaxPayments: "liabilities",

  // Non-asset fields (not shown on asset pages)
  currency: "currency",
  calendarType: "nisab",
  nisabStandard: "nisab",
  madhab: "nisab",
  isHousehold: "family",
  householdMembers: "family",
  email: "email",
  age: "tax",
  estimatedTaxRate: "tax",
  hasPreciousMetals: "category-selection",
  hasRealEstate: "category-selection",
  hasBusiness: "category-selection",
  hasIlliquidAssets: "category-selection",
  hasDebtOwedToYou: "category-selection",
  hasTaxPayments: "category-selection",
  hasCrypto: "category-selection",
  hasTrusts: "category-selection",
  isSimpleMode: "category-selection",
  entryMethod: "setup",
};

// Get documents that have data relevant to a specific step
export function getDocumentsForStep(
  documents: UploadedDocument[],
  stepId: string
): UploadedDocument[] {
  return documents.filter((doc) => {
    const extractedFields = Object.keys(doc.extractedData) as (keyof ZakatFormData)[];
    return extractedFields.some((field) => {
      const value = doc.extractedData[field];
      // Check if field belongs to this step and has a non-zero value
      return (
        fieldToStepMapping[field] === stepId &&
        value !== undefined &&
        value !== null &&
        value !== 0 &&
        value !== false
      );
    });
  });
}

// Get extracted values for a specific step from a document
export function getExtractedValuesForStep(
  doc: UploadedDocument,
  stepId: string
): Record<string, number | boolean> {
  const result: Record<string, number | boolean> = {};
  const extractedFields = Object.keys(doc.extractedData) as (keyof ZakatFormData)[];

  for (const field of extractedFields) {
    if (fieldToStepMapping[field] === stepId) {
      const value = doc.extractedData[field];
      if (value !== undefined && value !== null && value !== 0 && value !== false) {
        result[field] = value as number | boolean;
      }
    }
  }

  return result;
}

// Human-readable field names
export const fieldDisplayNames: Record<string, string> = {
  checkingAccounts: "Checking",
  savingsAccounts: "Savings",
  cashOnHand: "Cash",
  digitalWallets: "Digital Wallets",
  foreignCurrency: "Foreign Currency",
  interestEarned: "Interest",
  activeInvestments: "Active Investments",
  passiveInvestmentsValue: "Passive Investments",
  dividends: "Dividends",
  rothIRAContributions: "Roth IRA",
  rothIRAEarnings: "Roth Earnings",
  fourOhOneKVestedBalance: "401(k)",
  traditionalIRABalance: "Traditional IRA",
  hsaBalance: "HSA",
  cryptoCurrency: "Crypto",
  cryptoTrading: "Crypto Trading",
  stakedAssets: "Staked Assets",
  stakedRewardsVested: "Staking Rewards",
  liquidityPoolValue: "Liquidity Pool",
  goldValue: "Gold",
  silverValue: "Silver",
  revocableTrustValue: "Revocable Trust",
  irrevocableTrustValue: "Irrevocable Trust",
  clatValue: "CLAT",
  realEstateForSale: "Real Estate",
  rentalPropertyIncome: "Rental Income",
  businessCashAndReceivables: "Business Cash",
  businessInventory: "Inventory",
  illiquidAssetsValue: "Illiquid Assets",
  livestockValue: "Livestock",
  goodDebtOwedToYou: "Good Debt",
  badDebtRecovered: "Recovered Debt",
  // Liabilities
  monthlyLivingExpenses: "Living Expenses",
  monthlyMortgage: "Mortgage Payment",
  insuranceExpenses: "Insurance",
  creditCardBalance: "Credit Card Balance",
  unpaidBills: "Unpaid Bills",
  studentLoansDue: "Student Loans Due",
  propertyTax: "Property Tax",
  lateTaxPayments: "Late Tax Payments",
};

// Generate a unique ID for documents
export function generateDocumentId(): string {
  return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sanitize a document for storage by removing sensitive metadata.
 * Only the extracted numeric data and minimal identifiers are kept.
 * This ensures document filenames, institution names, and summaries
 * are not persisted in localStorage.
 */
export function sanitizeDocumentForStorage(doc: UploadedDocument): UploadedDocument {
  return {
    id: doc.id,
    fileName: '', // Don't persist filename
    uploadedAt: doc.uploadedAt,
    institutionName: '', // Don't persist institution name
    documentDate: undefined, // Don't persist document date
    summary: '', // Don't persist AI-generated summary
    notes: undefined, // Don't persist notes
    extractedData: doc.extractedData, // Keep the numeric values only
    mimeType: '', // Don't persist mime type
  };
}
