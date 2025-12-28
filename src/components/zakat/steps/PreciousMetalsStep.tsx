import { ZakatFormData } from "@/lib/zakatCalculations";
import { preciousMetalsContent } from "@/lib/zakatContent";
import { AssetStepWrapper } from "../AssetStepWrapper";
import { CurrencyInput } from "../CurrencyInput";
import { UploadedDocument } from "@/lib/documentTypes";
import { AssetStepProps, getDocumentContributionsForField } from "@/hooks/useDocumentExtraction";

export function PreciousMetalsStep({ data, updateData, uploadedDocuments, onDocumentAdded, onRemoveDocument, questionNumber }: AssetStepProps) {
  const isHousehold = data.isHousehold;

  return (
    <AssetStepWrapper
      content={preciousMetalsContent}
      stepId="precious-metals"
      questionNumber={questionNumber}
      data={data}
      updateData={updateData}
      uploadedDocuments={uploadedDocuments}
      onDocumentAdded={onDocumentAdded}
      onRemoveDocument={onRemoveDocument}
      showUpload={false}
      householdReminder="Include gold and silver owned by yourself, spouse, and children."
    >
      <CurrencyInput
        label="Gold Value"
        description="Melt value of gold items (not gemstones or craftsmanship)"
        householdDescription="Combined gold value for all family members"
        isHousehold={isHousehold}
        value={data.goldValue}
        onChange={(value) => updateData({ goldValue: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'goldValue')}
      />
      
      <CurrencyInput
        label="Silver Value"
        description="Melt value of silver items"
        householdDescription="Combined silver value for all family members"
        isHousehold={isHousehold}
        value={data.silverValue}
        onChange={(value) => updateData({ silverValue: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'silverValue')}
      />
    </AssetStepWrapper>
  );
}
