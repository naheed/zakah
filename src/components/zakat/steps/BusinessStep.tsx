import { ZakatFormData } from "@/lib/zakatCalculations";
import { businessContent } from "@/lib/zakatContent";
import { QuestionLayout } from "../QuestionLayout";
import { CurrencyInput } from "../CurrencyInput";
import { StepDocumentsDisplay } from "../DocumentsManager";
import { UploadedDocument } from "@/lib/documentTypes";

interface BusinessStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
  uploadedDocuments: UploadedDocument[];
  onDocumentAdded: (doc: Omit<UploadedDocument, 'id' | 'uploadedAt'>) => void;
  onRemoveDocument: (id: string) => void;
}

export function BusinessStep({ data, updateData, uploadedDocuments, onRemoveDocument }: BusinessStepProps) {
  return (
    <QuestionLayout content={businessContent}>
      <StepDocumentsDisplay documents={uploadedDocuments} stepId="business" onRemoveDocument={onRemoveDocument} />
      
      <CurrencyInput
        label="Cash & Receivables"
        description="Business cash + accounts receivable"
        value={data.businessCashAndReceivables}
        onChange={(value) => updateData({ businessCashAndReceivables: value })}
      />
      
      <CurrencyInput
        label="Inventory"
        description="Goods for sale at current selling price"
        value={data.businessInventory}
        onChange={(value) => updateData({ businessInventory: value })}
      />
    </QuestionLayout>
  );
}
