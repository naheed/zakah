import { ZakatFormData, formatCurrency } from "@/lib/zakatCalculations";
import { investmentsContent } from "@/lib/zakatContent";
import { QuestionLayout } from "../QuestionLayout";
import { CurrencyInput, getDocumentContributionsForField } from "../CurrencyInput";
import { DocumentUpload } from "../DocumentUpload";
import { StepDocumentsDisplay } from "../DocumentsManager";
import { UploadedDocument } from "@/lib/documentTypes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InvestmentsStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
  uploadedDocuments: UploadedDocument[];
  onDocumentAdded: (doc: Omit<UploadedDocument, 'id' | 'uploadedAt'>) => void;
  onRemoveDocument: (id: string) => void;
}

export function InvestmentsStep({ data, updateData, uploadedDocuments, onDocumentAdded, onRemoveDocument }: InvestmentsStepProps) {
  const passiveZakatable = data.calculationMode === 'conservative' 
    ? data.passiveInvestmentsValue 
    : data.passiveInvestmentsValue * 0.30;
  
  const purificationAmount = data.dividends * (data.dividendPurificationPercent / 100);
  const isHousehold = data.isHousehold;

  const handleDataExtracted = (extractedData: Partial<ZakatFormData>) => {
    const updates: Partial<ZakatFormData> = {};
    const fields = ['activeInvestments', 'passiveInvestmentsValue', 'dividends'] as const;
    
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
    <QuestionLayout content={investmentsContent}>
      {isHousehold && (
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-foreground">
            <span className="font-medium">Household Mode:</span> Include investment accounts for yourself, spouse, and children.
          </p>
        </div>
      )}

      <StepDocumentsDisplay documents={uploadedDocuments} stepId="investments" onRemoveDocument={onRemoveDocument} />
      
      <DocumentUpload
        onDataExtracted={handleDataExtracted}
        onDocumentAdded={onDocumentAdded}
        label="Upload Brokerage Statement"
        description="Auto-fill from your investment statement"
      />
      
      <div className="space-y-2">
        <h3 className="font-medium text-foreground">Active Investments (Trading)</h3>
        <CurrencyInput
          label="Stocks held for trading"
          description="Short-term holdings (<365 days) for capital gain. Include brokerage cash."
          householdDescription="Combined short-term holdings for all family members"
          isHousehold={isHousehold}
          value={data.activeInvestments}
          onChange={(value) => updateData({ activeInvestments: value })}
          fieldName="activeInvestments"
          documentContributions={getDocumentContributionsForField(uploadedDocuments, 'activeInvestments')}
        />
      </div>
      
      <div className="space-y-3">
        <h3 className="font-medium text-foreground">Passive Investments (Long-Term)</h3>
        <CurrencyInput
          label="Stocks held long-term"
          description="Buy-and-hold investments (>365 days)"
          householdDescription="Combined long-term investments for all family members"
          isHousehold={isHousehold}
          value={data.passiveInvestmentsValue}
          onChange={(value) => updateData({ passiveInvestmentsValue: value })}
          fieldName="passiveInvestmentsValue"
          documentContributions={getDocumentContributionsForField(uploadedDocuments, 'passiveInvestmentsValue')}
        />
        
        {data.passiveInvestmentsValue > 0 && (
          <div className="p-4 bg-accent rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">
              Zakatable Amount ({data.calculationMode === 'conservative' ? '100%' : '30% rule'})
            </p>
            <p className="text-xl font-semibold text-primary">
              {formatCurrency(passiveZakatable, data.currency)}
            </p>
          </div>
        )}
      </div>
      
      <div className="space-y-3 pt-4 border-t border-border">
        <h3 className="font-medium text-foreground">Dividends & Purification</h3>
        
        <CurrencyInput
          label="Dividends Received"
          description="Total dividends this year (don't double-count if in checking/savings)"
          householdDescription="Combined dividends for all family members"
          isHousehold={isHousehold}
          value={data.dividends}
          onChange={(value) => updateData({ dividends: value })}
          fieldName="dividends"
          documentContributions={getDocumentContributionsForField(uploadedDocuments, 'dividends')}
        />
        
        <div className="space-y-2">
          <Label className="text-sm text-foreground">Purification % (Non-Halal Income)</Label>
          <Input
            type="number"
            min={0}
            max={100}
            step={0.1}
            value={data.dividendPurificationPercent || 0}
            onChange={(e) => updateData({ dividendPurificationPercent: parseFloat(e.target.value) || 0 })}
            className="max-w-24"
          />
          <p className="text-xs text-muted-foreground">% from impermissible sources (interest, alcohol, etc.)</p>
        </div>
        
        {purificationAmount > 0 && (
          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Amount to Purify</p>
            <p className="text-xl font-semibold text-destructive">
              {formatCurrency(purificationAmount, data.currency)}
            </p>
          </div>
        )}
      </div>
    </QuestionLayout>
  );
}
