import { ZakatFormData } from "@/lib/zakatCalculations";
import { liquidAssetsContent } from "@/lib/zakatContent";
import { QuestionLayout } from "../QuestionLayout";
import { CurrencyInput } from "../CurrencyInput";
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

  return (
    <QuestionLayout content={liquidAssetsContent}>
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
        value={data.checkingAccounts}
        onChange={(value) => updateData({ checkingAccounts: value })}
      />
      
      <CurrencyInput
        label="Savings Accounts"
        description="Total balance (exclude interest earned)"
        value={data.savingsAccounts}
        onChange={(value) => updateData({ savingsAccounts: value })}
      />
      
      <CurrencyInput
        label="Cash on Hand"
        description="Physical cash in wallet or home"
        value={data.cashOnHand}
        onChange={(value) => updateData({ cashOnHand: value })}
      />
      
      <CurrencyInput
        label="Digital Wallets"
        description="PayPal, Venmo, CashApp, Zelle"
        value={data.digitalWallets}
        onChange={(value) => updateData({ digitalWallets: value })}
      />
      
      <CurrencyInput
        label="Foreign Currency"
        description="Converted to USD at today's rate"
        value={data.foreignCurrency}
        onChange={(value) => updateData({ foreignCurrency: value })}
      />
      
      <div className="pt-4 border-t border-border">
        <CurrencyInput
          label="⚠️ Interest Earned (For Purification)"
          description="Not Zakatable—must be donated to charity separately"
          value={data.interestEarned}
          onChange={(value) => updateData({ interestEarned: value })}
        />
      </div>
    </QuestionLayout>
  );
}
