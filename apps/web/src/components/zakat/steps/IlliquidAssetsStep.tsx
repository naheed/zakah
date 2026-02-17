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

import { ZakatFormData } from "@zakatflow/core";
import { illiquidAssetsContent } from "@/content/steps";
import { AssetStepWrapper } from "../AssetStepWrapper";
import { CurrencyInput } from "../CurrencyInput";
import { UploadedDocument } from "@zakatflow/core";
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
