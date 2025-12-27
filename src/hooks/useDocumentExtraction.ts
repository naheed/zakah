import { useCallback, useRef, useEffect } from "react";
import { ZakatFormData } from "@/lib/zakatCalculations";
import { UploadedDocument, fieldToStepMapping } from "@/lib/documentTypes";

// Get all numeric fields that belong to a specific step
export function getFieldsForStep(stepId: string): (keyof ZakatFormData)[] {
  return (Object.entries(fieldToStepMapping) as [keyof ZakatFormData, string][])
    .filter(([_, step]) => step === stepId)
    .map(([field]) => field)
    .filter(field => {
      // Only include numeric fields (exclude booleans and strings)
      const numericFields = [
        'checkingAccounts', 'savingsAccounts', 'cashOnHand', 'digitalWallets',
        'foreignCurrency', 'interestEarned', 'activeInvestments', 'passiveInvestmentsValue',
        'dividends', 'dividendPurificationPercent', 'rothIRAContributions', 'rothIRAEarnings',
        'traditionalIRABalance', 'fourOhOneKVestedBalance', 'fourOhOneKUnvestedMatch',
        'iraWithdrawals', 'esaWithdrawals', 'fiveTwentyNineWithdrawals', 'hsaBalance',
        'goldValue', 'silverValue', 'cryptoCurrency', 'cryptoTrading', 'stakedAssets',
        'stakedRewardsVested', 'liquidityPoolValue', 'revocableTrustValue', 'irrevocableTrustValue',
        'clatValue', 'realEstateForSale', 'rentalPropertyIncome', 'businessCashAndReceivables',
        'businessInventory', 'illiquidAssetsValue', 'livestockValue', 'goodDebtOwedToYou',
        'badDebtRecovered', 'monthlyLivingExpenses', 'insuranceExpenses', 'creditCardBalance',
        'unpaidBills', 'monthlyMortgage', 'studentLoansDue', 'propertyTax', 'lateTaxPayments'
      ];
      return numericFields.includes(field as string);
    });
}

// Hook to create a document extraction handler for a specific step
export function useDocumentExtraction(
  stepId: string,
  data: ZakatFormData,
  updateData: (updates: Partial<ZakatFormData>) => void
) {
  const stepFields = getFieldsForStep(stepId);
  
  // Use ref to avoid stale closures - always have access to latest data
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const handleDataExtracted = useCallback((extractedData: Partial<ZakatFormData>) => {
    const updates: Partial<ZakatFormData> = {};
    const currentData = dataRef.current;
    
    for (const field of stepFields) {
      const extractedValue = extractedData[field];
      if (typeof extractedValue === 'number' && extractedValue > 0) {
        const currentValue = (currentData[field] as number) || 0;
        (updates as any)[field] = currentValue + extractedValue;
      }
    }
    
    if (Object.keys(updates).length > 0) {
      updateData(updates);
    }
  }, [stepFields, updateData]);

  return { handleDataExtracted, stepFields };
}

// Get document contributions for a field from all documents
export function getDocumentContributionsForField(
  documents: UploadedDocument[],
  fieldName: keyof ZakatFormData
): Array<{
  documentId: string;
  documentName: string;
  institutionName: string;
  amount: number;
}> {
  return documents
    .filter(doc => {
      const value = doc.extractedData[fieldName];
      return typeof value === 'number' && value > 0;
    })
    .map(doc => ({
      documentId: doc.id,
      documentName: doc.fileName,
      institutionName: doc.institutionName,
      amount: doc.extractedData[fieldName] as number,
    }));
}

// Standard props that all asset steps receive
export interface AssetStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
  uploadedDocuments: UploadedDocument[];
  onDocumentAdded: (doc: Omit<UploadedDocument, 'id' | 'uploadedAt'>) => void;
  onRemoveDocument: (id: string) => void;
}
