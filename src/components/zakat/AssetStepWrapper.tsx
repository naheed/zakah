import { ReactNode, useCallback } from "react";
import { ZakatFormData } from "@/lib/zakatCalculations";
import { StepContent } from "@/lib/zakatContent";
import { QuestionLayout } from "./QuestionLayout";
import { DocumentUpload } from "./DocumentUpload";
import { StepDocumentsDisplay } from "./DocumentsManager";
import { UploadedDocument } from "@/lib/documentTypes";
import { useDocumentExtraction } from "@/hooks/useDocumentExtraction";
import { useAssetPersistence, inferAccountTypeFromStep } from "@/hooks/useAssetPersistence";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ProTip } from "./ProTip";

interface AssetStepWrapperProps {
  content: StepContent;
  stepId: string;
  /** Dynamic question number from wizard */
  questionNumber?: number;
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
  uploadedDocuments: UploadedDocument[];
  onDocumentAdded: (doc: Omit<UploadedDocument, 'id' | 'uploadedAt'>) => void;
  onRemoveDocument: (id: string) => void;
  showUpload?: boolean;
  uploadLabel?: string;
  uploadDescription?: string;
  householdReminder?: string;
  children: ReactNode;
}

export function AssetStepWrapper({
  content,
  stepId,
  questionNumber,
  data,
  updateData,
  uploadedDocuments,
  onDocumentAdded,
  onRemoveDocument,
  showUpload = true,
  uploadLabel = "Upload Statement",
  uploadDescription = "Auto-fill from your financial statement",
  householdReminder,
  children,
}: AssetStepWrapperProps) {
  const { handleDataExtracted } = useDocumentExtraction(stepId, data, updateData);
  const { persistExtraction } = useAssetPersistence();
  const { user } = useAuth();
  const { toast } = useToast();
  const isHousehold = data.isHousehold;

  // Wrap onDocumentAdded to also persist to V2 tables
  const handleDocumentAddedWithPersistence = useCallback(async (
    doc: Omit<UploadedDocument, 'id' | 'uploadedAt'>
  ) => {
    // First, call the original callback to update local state
    onDocumentAdded(doc);

    // If user is logged in, persist to V2 tables
    if (user && doc.institutionName) {
      try {
        // Use granular line items if available (from Review UI), otherwise fallback to legacy conversion
        let lineItems: { description: string; amount: number; inferredCategory: string; confidence: number }[] = [];

        if (doc.lineItems && doc.lineItems.length > 0) {
          lineItems = doc.lineItems;
        } else {
          // Legacy fallback
          lineItems = Object.entries(doc.extractedData)
            .filter(([_, value]) => typeof value === 'number' && value > 0)
            .map(([field, value]) => ({
              description: field,
              amount: value as number,
              inferredCategory: mapLegacyFieldToCategory(field),
              confidence: 0.9,
            }));
        }

        if (lineItems.length > 0) {
          const result = await persistExtraction(
            doc.institutionName,
            doc.documentDate,
            lineItems,
            stepId,
            doc.accountName,
            doc.accountId
          );

          if (result.success && !result.skipped) {
            toast({
              title: "Saved to your accounts",
              description: `${doc.institutionName} data saved`,
            });
          }
          // If skipped, no toast - duplicate was silently ignored
        }
      } catch (err) {
        console.error('Error persisting to V2:', err);
        // Don't show error to user - V2 persistence is silent enhancement
      }
    }
  }, [onDocumentAdded, user, persistExtraction, stepId, toast]);

  return (
    <QuestionLayout content={content} questionNumber={questionNumber}>
      {/* Pro tip for math in inputs */}
      <ProTip tipKey="math-inputs">
        <strong>Pro tip:</strong> You can do math in any field below, e.g. type "1000 + 500" and it will calculate automatically.
      </ProTip>

      {/* Household mode reminder */}
      {isHousehold && householdReminder && (
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-foreground">
            <span className="font-medium">Household Mode:</span> {householdReminder}
          </p>
        </div>
      )}

      {/* Show previously uploaded documents with relevant data */}
      <StepDocumentsDisplay
        documents={uploadedDocuments}
        stepId={stepId}
        onRemoveDocument={onRemoveDocument}
      />

      {/* Document upload */}
      {showUpload && (
        <DocumentUpload
          onDataExtracted={handleDataExtracted}
          onDocumentAdded={handleDocumentAddedWithPersistence}
          label={uploadLabel}
          description={uploadDescription}
        />
      )}

      {children}
    </QuestionLayout>
  );
}

// Map legacy form field names to V2 category format
function mapLegacyFieldToCategory(field: string): string {
  const mapping: Record<string, string> = {
    // Liquid
    checkingAccounts: 'CASH_CHECKING',
    savingsAccounts: 'CASH_SAVINGS',
    cashOnHand: 'CASH_SAVINGS',
    digitalWallets: 'CASH_SAVINGS',
    foreignCurrency: 'CASH_SAVINGS',
    interestEarned: 'INCOME_INTEREST',
    // Investments
    activeInvestments: 'INVESTMENT_EQUITY',
    passiveInvestmentsValue: 'INVESTMENT_EQUITY',
    dividends: 'INCOME_DIVIDEND',
    // Retirement
    rothIRAContributions: 'RETIREMENT_ROTH',
    rothIRAEarnings: 'RETIREMENT_ROTH',
    traditionalIRABalance: 'RETIREMENT_IRA',
    fourOhOneKVestedBalance: 'RETIREMENT_401K',
    hsaBalance: 'CASH_SAVINGS',
    // Crypto
    cryptoCurrency: 'CRYPTO',
    cryptoTrading: 'CRYPTO',
    stakedAssets: 'CRYPTO',
    stakedRewardsVested: 'CRYPTO',
    liquidityPoolValue: 'CRYPTO',
    // Metals
    goldValue: 'COMMODITY_GOLD',
    silverValue: 'COMMODITY_SILVER',
    // Liabilities
    creditCardBalance: 'LIABILITY_CREDIT_CARD',
    monthlyLivingExpenses: 'EXPENSE_UTILITY',
    insuranceExpenses: 'EXPENSE_INSURANCE',
    monthlyMortgage: 'LIABILITY_LOAN',
    studentLoansDue: 'LIABILITY_LOAN',
  };
  return mapping[field] || 'OTHER';
}

