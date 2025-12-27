import { ZakatFormData } from "@/lib/zakatCalculations";
import { realEstateContent } from "@/lib/zakatContent";
import { QuestionLayout } from "../QuestionLayout";
import { CurrencyInput } from "../CurrencyInput";
import { StepDocumentsDisplay } from "../DocumentsManager";
import { UploadedDocument } from "@/lib/documentTypes";

interface RealEstateStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
  uploadedDocuments: UploadedDocument[];
  onDocumentAdded: (doc: Omit<UploadedDocument, 'id' | 'uploadedAt'>) => void;
  onRemoveDocument: (id: string) => void;
}

export function RealEstateStep({ data, updateData, uploadedDocuments, onRemoveDocument }: RealEstateStepProps) {
  return (
    <QuestionLayout content={realEstateContent}>
      <StepDocumentsDisplay documents={uploadedDocuments} stepId="real-estate" onRemoveDocument={onRemoveDocument} />
      
      <CurrencyInput
        label="Real Estate for Sale"
        description="Market value of properties you intend to flip"
        value={data.realEstateForSale}
        onChange={(value) => updateData({ realEstateForSale: value })}
      />
      
      <CurrencyInput
        label="Accumulated Rental Income"
        description="Net rental income remaining in your accounts"
        value={data.rentalPropertyIncome}
        onChange={(value) => updateData({ rentalPropertyIncome: value })}
      />
    </QuestionLayout>
  );
}
