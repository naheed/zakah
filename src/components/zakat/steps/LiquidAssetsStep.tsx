import { ZakatFormData } from "@/lib/zakatCalculations";
import { liquidAssetsContent } from "@/lib/zakatContent";
import { QuestionLayout } from "../QuestionLayout";
import { CurrencyInput, getDocumentContributionsForField } from "../CurrencyInput";
import { DocumentUpload } from "../DocumentUpload";
import { StepDocumentsDisplay } from "../DocumentsManager";
import { UploadedDocument } from "@/lib/documentTypes";

interface LiquidAssetsStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
  uploadedDocuments: UploadedDocument[];
  onDocumentAdded: (doc: Omit<UploadedDocument, 'id' | 'uploadedAt'>) => void;
  onRemoveDocument: (id: string) => void;
}

export function LiquidAssetsStep({ 
  data, 
  updateData, 
  uploadedDocuments, 
  onDocumentAdded,
  onRemoveDocument 
}: LiquidAssetsStepProps) {
  const handleDataExtracted = (extractedData: Partial<ZakatFormData>) => {
    const updates: Partial<ZakatFormData> = {};
    const fields = ['checkingAccounts', 'savingsAccounts', 'cashOnHand', 'digitalWallets', 'foreignCurrency', 'interestEarned'] as const;
    
    for (const field of fields) {
      if (extractedData[field] && extractedData[field]! > 0) {
        updates[field] = (data[field] || 0) + extractedData[field]!;
      }
    }
    
    if (Object.keys(updates).length > 0) {
      updateData(updates);
    }
  };

  const isHousehold = data.isHousehold;

  return (
    <QuestionLayout content={liquidAssetsContent}>
      {/* Household mode reminder */}
      {isHousehold && (
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-foreground">
            <span className="font-medium">Household Mode:</span> Include accounts for yourself, spouse, and children.
          </p>
        </div>
      )}

      {/* Show previously uploaded documents with relevant data */}
      <StepDocumentsDisplay 
        documents={uploadedDocuments} 
        stepId="liquid-assets"
        onRemoveDocument={onRemoveDocument}
      />

      <DocumentUpload
        onDataExtracted={handleDataExtracted}
        onDocumentAdded={onDocumentAdded}
        label="Upload Bank Statement"
        description="Auto-fill from your bank statement"
      />
      
      <CurrencyInput
        label="Checking Accounts"
        description="Total balance across all checking accounts"
        householdDescription="Combined checking accounts for all family members"
        isHousehold={isHousehold}
        value={data.checkingAccounts}
        onChange={(value) => updateData({ checkingAccounts: value })}
        fieldName="checkingAccounts"
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'checkingAccounts')}
      />
      
      <CurrencyInput
        label="Savings Accounts"
        description="Total balance (exclude interest earned)"
        householdDescription="Combined savings for all family members (exclude interest)"
        isHousehold={isHousehold}
        value={data.savingsAccounts}
        onChange={(value) => updateData({ savingsAccounts: value })}
        fieldName="savingsAccounts"
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'savingsAccounts')}
      />
      
      <CurrencyInput
        label="Cash on Hand"
        description="Physical cash in wallet or home"
        householdDescription="Cash held by all family members"
        isHousehold={isHousehold}
        value={data.cashOnHand}
        onChange={(value) => updateData({ cashOnHand: value })}
        fieldName="cashOnHand"
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'cashOnHand')}
      />
      
      <CurrencyInput
        label="Digital Wallets"
        description="PayPal, Venmo, CashApp, Zelle"
        householdDescription="Combined digital wallet balances for all family members"
        isHousehold={isHousehold}
        value={data.digitalWallets}
        onChange={(value) => updateData({ digitalWallets: value })}
        fieldName="digitalWallets"
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'digitalWallets')}
      />
      
      <CurrencyInput
        label="Foreign Currency"
        description="Converted to USD at today's rate"
        householdDescription="Foreign currency held by all family members (in USD)"
        isHousehold={isHousehold}
        value={data.foreignCurrency}
        onChange={(value) => updateData({ foreignCurrency: value })}
        fieldName="foreignCurrency"
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'foreignCurrency')}
      />
      
      <div className="pt-4 border-t border-border">
        <CurrencyInput
          label="⚠️ Interest Earned (For Purification)"
          description="Not Zakatable—must be donated to charity separately"
          value={data.interestEarned}
          onChange={(value) => updateData({ interestEarned: value })}
          fieldName="interestEarned"
          documentContributions={getDocumentContributionsForField(uploadedDocuments, 'interestEarned')}
        />
      </div>
    </QuestionLayout>
  );
}
