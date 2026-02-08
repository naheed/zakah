import { ReactNode, useCallback, useState, useEffect } from "react";
import { ZakatFormData } from "@/lib/zakatCalculations";
import { StepContent } from "@/content/steps";
import { QuestionLayout } from "./QuestionLayout";
import { DocumentUpload, AccountWithLineItems } from "./DocumentUpload";
import { StepDocumentsDisplay } from "./DocumentsManager";
import { UploadedDocument } from "@/lib/documentTypes";
import { useDocumentExtraction } from "@/hooks/useDocumentExtraction";
import { useAssetPersistence, inferAccountTypeFromStep } from "@/hooks/useAssetPersistence";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ProTip } from "./ProTip";
import { QuestionContext, filterRelevantAccounts, mergeAccountIntoFormData } from "@/lib/accountImportMapper";
import { supabase } from "@/integrations/supabase/runtimeClient";

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
  const { persistExtraction, fetchAccounts } = useAssetPersistence();
  const { user } = useAuth();
  const { toast } = useToast();
  const isHousehold = data.isHousehold;

  // State for existing accounts
  const [existingAccounts, setExistingAccounts] = useState<AccountWithLineItems[]>([]);
  const [allAccounts, setAllAccounts] = useState<AccountWithLineItems[]>([]);

  // Map stepId to question context for filtering
  const getContextForStep = (stepId: string): QuestionContext => {
    const mapping: Record<string, QuestionContext> = {
      'liquid-assets': 'liquid-assets',
      'investments': 'investments',
      'retirement': 'retirement',
      'crypto': 'crypto',
      'precious-metals': 'precious-metals',
      'real-estate': 'real-estate',
      'business': 'business',
      'trusts': 'trusts',
      'liabilities': 'debts',
    };
    return mapping[stepId] || 'liquid-assets';
  };

  // Fetch and filter accounts for this step
  useEffect(() => {
    if (!user) {
      setExistingAccounts([]);
      return;
    }

    const loadAccounts = async () => {
      try {
        const accounts = await fetchAccounts();

        // For each account, fetch line items
        const accountsWithItems = await Promise.all(
          accounts.map(async (account) => {
            const { data: lineItems } = await supabase
              .from('asset_line_items')
              .select('*')
              .eq('snapshot_id', (
                // Get latest snapshot ID
                await supabase
                  .from('asset_snapshots')
                  .select('id')
                  .eq('account_id', account.id)
                  .order('statement_date', { ascending: false })
                  .limit(1)
                  .single()
              ).data?.id || '')
              .limit(50);

            return {
              ...account,
              lineItems: lineItems || [],
            } as AccountWithLineItems;
          })
        );

        // Filter by context and recency (6 months)
        const context = getContextForStep(stepId);
        const filtered = filterRelevantAccounts(accountsWithItems, context, 6);
        setExistingAccounts(filtered);

        // Also store all recent accounts (for "Show all" toggle)
        const cutoffDate = new Date();
        cutoffDate.setMonth(cutoffDate.getMonth() - 6);
        const allRecent = accountsWithItems.filter(a => {
          const date = new Date(a.updated_at || a.created_at || 0);
          return date >= cutoffDate;
        });
        setAllAccounts(allRecent);
      } catch (err) {
        console.error('Error loading accounts for step:', err);
        setExistingAccounts([]);
        setAllAccounts([]);
      }
    };

    loadAccounts();
  }, [user, stepId, fetchAccounts]);

  // Handle account selection - merge line items into form data
  const handleAccountSelected = useCallback((account: AccountWithLineItems) => {
    if (!account.lineItems || account.lineItems.length === 0) {
      toast({
        title: 'No data to import',
        description: 'This account has no line items to import',
        variant: 'destructive',
      });
      return;
    }

    // Merge line items into form data (cross-question mapping)
    const updatedData = mergeAccountIntoFormData(data, account.lineItems);
    updateData(updatedData);

    toast({
      title: 'Account imported',
      description: `Values from ${account.name} added across all relevant fields`,
    });
  }, [data, updateData, toast]);

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
          lineItems = doc.lineItems.map(item => ({
            description: item.description,
            amount: item.amount,
            inferredCategory: item.inferredCategory,
            confidence: item.confidence ?? 1.0,
          }));
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

      {children}

      {/* Document upload with existing accounts selection */}
      {showUpload && (
        <DocumentUpload
          onDataExtracted={handleDataExtracted}
          onDocumentAdded={handleDocumentAddedWithPersistence}
          existingAccounts={existingAccounts}
          allAccounts={allAccounts}
          onAccountSelected={handleAccountSelected}
          label={uploadLabel}
          description={uploadDescription}
        />
      )}
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

