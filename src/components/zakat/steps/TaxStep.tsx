import { ZakatFormData } from "@/lib/zakatCalculations";
import { taxContent } from "@/lib/zakatContent";
import { QuestionLayout } from "../QuestionLayout";
import { CurrencyInput } from "../CurrencyInput";
import { StepDocumentsDisplay } from "../DocumentsManager";
import { UploadedDocument } from "@/lib/documentTypes";

interface TaxStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
  uploadedDocuments: UploadedDocument[];
  onDocumentAdded: (doc: Omit<UploadedDocument, 'id' | 'uploadedAt'>) => void;
  onRemoveDocument: (id: string) => void;
}

export function TaxStep({ data, updateData, uploadedDocuments, onRemoveDocument }: TaxStepProps) {
  return (
    <QuestionLayout content={taxContent}>
      <StepDocumentsDisplay documents={uploadedDocuments} stepId="tax" onRemoveDocument={onRemoveDocument} />
      
      <CurrencyInput
        label="Property Tax Due"
        description="Property taxes currently due"
        value={data.propertyTax}
        onChange={(value) => updateData({ propertyTax: value })}
      />
      
      <CurrencyInput
        label="Late Tax Payments or Fines"
        description="Overdue taxes, penalties, or fines"
        value={data.lateTaxPayments}
        onChange={(value) => updateData({ lateTaxPayments: value })}
      />
    </QuestionLayout>
  );
}
