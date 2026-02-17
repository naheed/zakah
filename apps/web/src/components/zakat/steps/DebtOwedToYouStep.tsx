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
import { debtOwedContent } from "@/content/steps";
import { AssetStepWrapper } from "../AssetStepWrapper";
import { CurrencyInput } from "../CurrencyInput";
import { UploadedDocument } from "@zakatflow/core";
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
