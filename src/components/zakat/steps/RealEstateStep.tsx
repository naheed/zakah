import { ZakatFormData } from "@/lib/zakatCalculations";
import { realEstateContent } from "@/lib/zakatContent";
import { AssetStepWrapper } from "../AssetStepWrapper";
import { CurrencyInput } from "../CurrencyInput";
import { UploadedDocument } from "@/lib/documentTypes";
import { AssetStepProps, getDocumentContributionsForField } from "@/hooks/useDocumentExtraction";

export function RealEstateStep({ data, updateData, uploadedDocuments, onDocumentAdded, onRemoveDocument }: AssetStepProps) {
  const isHousehold = data.isHousehold;

  return (
    <AssetStepWrapper
      content={realEstateContent}
      stepId="real-estate"
      data={data}
      updateData={updateData}
      uploadedDocuments={uploadedDocuments}
      onDocumentAdded={onDocumentAdded}
      onRemoveDocument={onRemoveDocument}
      showUpload={false}
      householdReminder="Include investment properties owned by yourself, spouse, and children."
    >
      <CurrencyInput
        label="Real Estate for Sale"
        description="Market value of properties you intend to flip"
        householdDescription="Combined real estate for sale for all family members"
        isHousehold={isHousehold}
        value={data.realEstateForSale}
        onChange={(value) => updateData({ realEstateForSale: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'realEstateForSale')}
      />
      
      <CurrencyInput
        label="Accumulated Rental Income"
        description="Net rental income remaining in your accounts"
        householdDescription="Combined rental income for all family members"
        isHousehold={isHousehold}
        value={data.rentalPropertyIncome}
        onChange={(value) => updateData({ rentalPropertyIncome: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'rentalPropertyIncome')}
      />
    </AssetStepWrapper>
  );
}
