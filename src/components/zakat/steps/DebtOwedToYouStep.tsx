import { ZakatFormData } from "@/lib/zakatCalculations";
import { debtOwedContent } from "@/lib/zakatContent";
import { AssetStepWrapper } from "../AssetStepWrapper";
import { CurrencyInput } from "../CurrencyInput";
import { UploadedDocument } from "@/lib/documentTypes";
import { AssetStepProps, getDocumentContributionsForField } from "@/hooks/useDocumentExtraction";

export function DebtOwedToYouStep({ data, updateData, uploadedDocuments, onDocumentAdded, onRemoveDocument, questionNumber }: AssetStepProps) {
  const isHousehold = data.isHousehold;

  return (
    <AssetStepWrapper
      content={debtOwedContent}
      stepId="debt-owed"
      questionNumber={questionNumber}
      data={data}
      updateData={updateData}
      uploadedDocuments={uploadedDocuments}
      onDocumentAdded={onDocumentAdded}
      onRemoveDocument={onRemoveDocument}
      showUpload={false}
      householdReminder="Include debts owed to yourself, spouse, and children."
    >
      <CurrencyInput
        label="Good Debt (Collectible)"
        description="Borrower is willing and able to pay"
        householdDescription="Combined good debt owed to all family members"
        isHousehold={isHousehold}
        value={data.goodDebtOwedToYou}
        onChange={(value) => updateData({ goodDebtOwedToYou: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'goodDebtOwedToYou')}
      />
      
      <CurrencyInput
        label="Bad Debt Recovered This Year"
        description="Previously uncollectible debt you actually received"
        householdDescription="Combined recovered debt for all family members"
        isHousehold={isHousehold}
        value={data.badDebtRecovered}
        onChange={(value) => updateData({ badDebtRecovered: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'badDebtRecovered')}
      />
    </AssetStepWrapper>
  );
}
