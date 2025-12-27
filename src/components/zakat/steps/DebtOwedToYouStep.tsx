import { ZakatFormData } from "@/lib/zakatCalculations";
import { debtOwedContent } from "@/lib/zakatContent";
import { QuestionLayout } from "../QuestionLayout";
import { CurrencyInput } from "../CurrencyInput";
import { StepDocumentsDisplay } from "../DocumentsManager";
import { UploadedDocument } from "@/lib/documentTypes";

interface DebtOwedToYouStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
  uploadedDocuments: UploadedDocument[];
  onDocumentAdded: (doc: Omit<UploadedDocument, 'id' | 'uploadedAt'>) => void;
  onRemoveDocument: (id: string) => void;
}

export function DebtOwedToYouStep({ data, updateData, uploadedDocuments, onRemoveDocument }: DebtOwedToYouStepProps) {
  return (
    <QuestionLayout content={debtOwedContent}>
      <StepDocumentsDisplay documents={uploadedDocuments} stepId="debt-owed" onRemoveDocument={onRemoveDocument} />
      
      <CurrencyInput
        label="Good Debt (Collectible)"
        description="Borrower is willing and able to pay"
        value={data.goodDebtOwedToYou}
        onChange={(value) => updateData({ goodDebtOwedToYou: value })}
      />
      
      <CurrencyInput
        label="Bad Debt Recovered This Year"
        description="Previously uncollectible debt you actually received"
        value={data.badDebtRecovered}
        onChange={(value) => updateData({ badDebtRecovered: value })}
      />
    </QuestionLayout>
  );
}
