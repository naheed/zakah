import { ZakatFormData } from "@/lib/zakatCalculations";
import { realEstateContent } from "@/content/steps";
import { AssetStepWrapper } from "../AssetStepWrapper";
import { CurrencyInput } from "../CurrencyInput";
import { UploadedDocument } from "@/lib/documentTypes";
import { AssetStepProps, getDocumentContributionsForField } from "@/hooks/useDocumentExtraction";
import { WhyTooltip, fiqhExplanations } from "../WhyTooltip";

export function RealEstateStep({ data, updateData, uploadedDocuments, onDocumentAdded, onRemoveDocument, questionNumber }: AssetStepProps) {
  const isHousehold = data.isHousehold;

  return (
    <AssetStepWrapper
      content={realEstateContent}
      stepId="real-estate"
      questionNumber={questionNumber}
      data={data}
      updateData={updateData}
      uploadedDocuments={uploadedDocuments}
      onDocumentAdded={onDocumentAdded}
      onRemoveDocument={onRemoveDocument}
      showUpload={false}
      householdReminder="Include investment properties owned by yourself, spouse, and children."
    >
      <CurrencyInput
        label="Real Estate for Sale (Flipping)"
        description="Market value of properties you intend to sell soon"
        householdDescription="Combined real estate for sale for all family members"
        isHousehold={isHousehold}
        value={data.realEstateForSale}
        onChange={(value) => updateData({ realEstateForSale: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'realEstateForSale')}
      />

      <CurrencyInput
        label={
          <span className="flex items-center gap-2">
            Land Banking / Appreciation
            <WhyTooltip
              title="Land Banking"
              explanation="Land held for capital appreciation (not immediate sale or development) is treated as trade goods. Majority view: pay Zakat annually on market value. (NZF UK)"
            />
          </span>
        }
        description="Undeveloped land held for long-term appreciation"
        householdDescription="Combined land banking value for all family members"
        isHousehold={isHousehold}
        value={data.landBankingValue}
        onChange={(value) => updateData({ landBankingValue: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'landBankingValue')}
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
