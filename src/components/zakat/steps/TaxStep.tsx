import { ZakatFormData } from "@/lib/zakatCalculations";
import { taxContent } from "@/lib/zakatContent";
import { AssetStepWrapper } from "../AssetStepWrapper";
import { CurrencyInput } from "../CurrencyInput";
import { UploadedDocument } from "@/lib/documentTypes";
import { AssetStepProps, getDocumentContributionsForField } from "@/hooks/useDocumentExtraction";

export function TaxStep({ data, updateData, uploadedDocuments, onDocumentAdded, onRemoveDocument, questionNumber }: AssetStepProps) {
  const isHousehold = data.isHousehold;

  return (
    <AssetStepWrapper
      content={taxContent}
      stepId="tax"
      questionNumber={questionNumber}
      data={data}
      updateData={updateData}
      uploadedDocuments={uploadedDocuments}
      onDocumentAdded={onDocumentAdded}
      onRemoveDocument={onRemoveDocument}
      showUpload={false}
      householdReminder="Include taxes due for your entire household."
    >
      <CurrencyInput
        label="Property Tax Due"
        description="Property taxes currently due"
        householdDescription="Combined property taxes for your household"
        isHousehold={isHousehold}
        value={data.propertyTax}
        onChange={(value) => updateData({ propertyTax: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'propertyTax')}
      />
      
      <CurrencyInput
        label="Late Tax Payments or Fines"
        description="Overdue taxes, penalties, or fines"
        householdDescription="Combined late taxes for all family members"
        isHousehold={isHousehold}
        value={data.lateTaxPayments}
        onChange={(value) => updateData({ lateTaxPayments: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'lateTaxPayments')}
      />
    </AssetStepWrapper>
  );
}
