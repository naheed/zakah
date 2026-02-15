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
import { realEstateContent } from "@/content/steps";
import { AssetStepWrapper } from "../AssetStepWrapper";
import { CurrencyInput } from "../CurrencyInput";
import { UploadedDocument } from "@/lib/documentTypes";
import { AssetStepProps, getDocumentContributionsForField } from "@/hooks/useDocumentExtraction";
import { WhyTooltip } from "../WhyTooltip";


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
