import { ZakatFormData } from "@/lib/zakatCalculations";
import { illiquidAssetsContent } from "@/lib/zakatContent";
import { QuestionLayout } from "../QuestionLayout";
import { CurrencyInput } from "../CurrencyInput";
import { StepDocumentsDisplay } from "../DocumentsManager";
import { UploadedDocument } from "@/lib/documentTypes";

interface IlliquidAssetsStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
  uploadedDocuments: UploadedDocument[];
  onDocumentAdded: (doc: Omit<UploadedDocument, 'id' | 'uploadedAt'>) => void;
  onRemoveDocument: (id: string) => void;
}

export function IlliquidAssetsStep({ data, updateData, uploadedDocuments, onRemoveDocument }: IlliquidAssetsStepProps) {
  return (
    <QuestionLayout content={illiquidAssetsContent}>
      <StepDocumentsDisplay documents={uploadedDocuments} stepId="illiquid-assets" onRemoveDocument={onRemoveDocument} />
      
      <CurrencyInput
        label="Illiquid Assets Value"
        description="Art, antiques, collectibles held for sale"
        value={data.illiquidAssetsValue}
        onChange={(value) => updateData({ illiquidAssetsValue: value })}
      />
      
      <CurrencyInput
        label="Livestock Value"
        description="Animals raised for sale"
        value={data.livestockValue}
        onChange={(value) => updateData({ livestockValue: value })}
      />
    </QuestionLayout>
  );
}
