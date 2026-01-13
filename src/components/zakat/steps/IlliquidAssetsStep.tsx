import { ZakatFormData } from "@/lib/zakatCalculations";
import { illiquidAssetsContent } from "@/content/steps";
import { AssetStepWrapper } from "../AssetStepWrapper";
import { CurrencyInput } from "../CurrencyInput";
import { UploadedDocument } from "@/lib/documentTypes";
import { AssetStepProps, getDocumentContributionsForField } from "@/hooks/useDocumentExtraction";

export function IlliquidAssetsStep({ data, updateData, uploadedDocuments, onDocumentAdded, onRemoveDocument, questionNumber }: AssetStepProps) {
  const isHousehold = data.isHousehold;

  return (
    <AssetStepWrapper
      content={illiquidAssetsContent}
      stepId="illiquid-assets"
      questionNumber={questionNumber}
      data={data}
      updateData={updateData}
      uploadedDocuments={uploadedDocuments}
      onDocumentAdded={onDocumentAdded}
      onRemoveDocument={onRemoveDocument}
      showUpload={false}
      householdReminder="Include illiquid assets owned by yourself, spouse, and children."
    >
      <CurrencyInput
        label="Illiquid Assets Value"
        description="Art, antiques, collectibles held for sale"
        householdDescription="Combined illiquid assets for all family members"
        isHousehold={isHousehold}
        value={data.illiquidAssetsValue}
        onChange={(value) => updateData({ illiquidAssetsValue: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'illiquidAssetsValue')}
      />
      
      <CurrencyInput
        label="Livestock Value"
        description="Animals raised for sale"
        householdDescription="Combined livestock value for all family members"
        isHousehold={isHousehold}
        value={data.livestockValue}
        onChange={(value) => updateData({ livestockValue: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'livestockValue')}
      />
    </AssetStepWrapper>
  );
}
