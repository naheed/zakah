import { ZakatFormData } from "@/lib/zakatCalculations";
import { preciousMetalsContent } from "@/lib/zakatContent";
import { QuestionLayout } from "../QuestionLayout";
import { CurrencyInput } from "../CurrencyInput";
import { StepDocumentsDisplay } from "../DocumentsManager";
import { UploadedDocument } from "@/lib/documentTypes";

interface PreciousMetalsStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
  uploadedDocuments: UploadedDocument[];
  onDocumentAdded: (doc: Omit<UploadedDocument, 'id' | 'uploadedAt'>) => void;
  onRemoveDocument: (id: string) => void;
}

export function PreciousMetalsStep({ data, updateData, uploadedDocuments, onRemoveDocument }: PreciousMetalsStepProps) {
  return (
    <QuestionLayout content={preciousMetalsContent}>
      <StepDocumentsDisplay documents={uploadedDocuments} stepId="precious-metals" onRemoveDocument={onRemoveDocument} />
      
      <CurrencyInput
        label="Gold Value"
        description="Melt value of gold items (not gemstones or craftsmanship)"
        value={data.goldValue}
        onChange={(value) => updateData({ goldValue: value })}
      />
      
      <CurrencyInput
        label="Silver Value"
        description="Melt value of silver items"
        value={data.silverValue}
        onChange={(value) => updateData({ silverValue: value })}
      />
    </QuestionLayout>
  );
}
