import { ZakatFormData, formatCurrency, calculateRetirementAccessible } from "@/lib/zakatCalculations";
import { retirementContent } from "@/lib/zakatContent";
import { QuestionLayout } from "../QuestionLayout";
import { CurrencyInput } from "../CurrencyInput";
import { DocumentUpload } from "../DocumentUpload";
import { StepDocumentsDisplay } from "../DocumentsManager";
import { UploadedDocument } from "@/lib/documentTypes";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface RetirementStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
  uploadedDocuments: UploadedDocument[];
  onDocumentAdded: (doc: Omit<UploadedDocument, 'id' | 'uploadedAt'>) => void;
  onRemoveDocument: (id: string) => void;
}

export function RetirementStep({ data, updateData, uploadedDocuments, onDocumentAdded, onRemoveDocument }: RetirementStepProps) {
  const accessible401k = calculateRetirementAccessible(data.fourOhOneKVestedBalance, data.age, data.estimatedTaxRate, data.calculationMode);
  const accessibleIRA = calculateRetirementAccessible(data.traditionalIRABalance, data.age, data.estimatedTaxRate, data.calculationMode);

  const handleDataExtracted = (extractedData: Partial<ZakatFormData>) => {
    const updates: Partial<ZakatFormData> = {};
    const fields = ['fourOhOneKVestedBalance', 'traditionalIRABalance', 'rothIRAContributions', 'rothIRAEarnings', 'hsaBalance'] as const;
    
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
    <QuestionLayout content={retirementContent}>
      <StepDocumentsDisplay documents={uploadedDocuments} stepId="retirement" onRemoveDocument={onRemoveDocument} />
      
      <DocumentUpload
        onDataExtracted={handleDataExtracted}
        onDocumentAdded={onDocumentAdded}
        label="Upload Retirement Statement"
        description="Auto-fill from your 401(k) or IRA statement"
      />

      <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
        <div>
          <Label className="text-foreground">Are you over 59½?</Label>
          <p className="text-sm text-muted-foreground">No early withdrawal penalty</p>
        </div>
        <Switch checked={data.isOver59Half} onCheckedChange={(checked) => updateData({ isOver59Half: checked })} />
      </div>
      
      <div className="space-y-3">
        <h3 className="font-medium text-foreground">401(k) / 403(b)</h3>
        <CurrencyInput label="Vested Balance" description="Exclude unvested employer match" value={data.fourOhOneKVestedBalance} onChange={(value) => updateData({ fourOhOneKVestedBalance: value })} />
        {data.fourOhOneKVestedBalance > 0 && data.calculationMode === 'optimized' && (
          <div className="p-3 bg-accent rounded-lg text-sm">
            <span className="text-muted-foreground">Zakatable (after tax/penalty): </span>
            <span className="font-medium text-primary">{formatCurrency(accessible401k, data.currency)}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <h3 className="font-medium text-foreground">Traditional IRA</h3>
        <CurrencyInput label="IRA Balance" value={data.traditionalIRABalance} onChange={(value) => updateData({ traditionalIRABalance: value })} />
        {data.traditionalIRABalance > 0 && data.calculationMode === 'optimized' && (
          <div className="p-3 bg-accent rounded-lg text-sm">
            <span className="text-muted-foreground">Zakatable (after tax/penalty): </span>
            <span className="font-medium text-primary">{formatCurrency(accessibleIRA, data.currency)}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-3 pt-4 border-t border-border">
        <h3 className="font-medium text-foreground">Roth IRA</h3>
        <CurrencyInput label="Contributions (Principal)" description="Always accessible, fully Zakatable" value={data.rothIRAContributions} onChange={(value) => updateData({ rothIRAContributions: value })} />
        <CurrencyInput label="Earnings (Growth)" description="Subject to penalty if under 59½" value={data.rothIRAEarnings} onChange={(value) => updateData({ rothIRAEarnings: value })} />
      </div>
      
      <div className="space-y-3 pt-4 border-t border-border">
        <h3 className="font-medium text-foreground">HSA (Health Savings Account)</h3>
        <CurrencyInput label="HSA Balance" description="Fully accessible for medical, fully Zakatable" value={data.hsaBalance} onChange={(value) => updateData({ hsaBalance: value })} />
      </div>
    </QuestionLayout>
  );
}
