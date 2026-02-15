/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { ZakatFormData } from "@/lib/zakatCalculations";
import { taxContent } from "@/content/steps";
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
