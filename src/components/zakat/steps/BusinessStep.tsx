import { ZakatFormData } from "@/lib/zakatCalculations";
import { businessContent } from "@/lib/zakatContent";
import { AssetStepWrapper } from "../AssetStepWrapper";
import { CurrencyInput } from "../CurrencyInput";
import { UploadedDocument } from "@/lib/documentTypes";
import { AssetStepProps, getDocumentContributionsForField } from "@/hooks/useDocumentExtraction";

export function BusinessStep({ data, updateData, uploadedDocuments, onDocumentAdded, onRemoveDocument }: AssetStepProps) {
  const isHousehold = data.isHousehold;

  return (
    <AssetStepWrapper
      content={businessContent}
      stepId="business"
      data={data}
      updateData={updateData}
      uploadedDocuments={uploadedDocuments}
      onDocumentAdded={onDocumentAdded}
      onRemoveDocument={onRemoveDocument}
      showUpload={false}
      householdReminder="Include business assets owned by yourself, spouse, and children."
    >
      <CurrencyInput
        label="Cash & Receivables"
        description="Business cash + accounts receivable"
        householdDescription="Combined business cash for all family members"
        isHousehold={isHousehold}
        value={data.businessCashAndReceivables}
        onChange={(value) => updateData({ businessCashAndReceivables: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'businessCashAndReceivables')}
      />
      
      <CurrencyInput
        label="Inventory"
        description="Goods for sale at current selling price"
        householdDescription="Combined inventory for all family members"
        isHousehold={isHousehold}
        value={data.businessInventory}
        onChange={(value) => updateData({ businessInventory: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'businessInventory')}
      />
    </AssetStepWrapper>
  );
}
