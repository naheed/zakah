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
import { liquidAssetsContent } from "@/content/steps";
import { AssetStepWrapper } from "../AssetStepWrapper";
import { CurrencyInput } from "../CurrencyInput";
import { UploadedDocument } from "@zakatflow/core";
import { AssetStepProps, getDocumentContributionsForField } from "@/hooks/useDocumentExtraction";

export function LiquidAssetsStep({
  data,
  updateData,
  uploadedDocuments,
  onDocumentAdded,
  onRemoveDocument,
  questionNumber,
}: AssetStepProps) {
  const isHousehold = data.isHousehold;

  return (
    <AssetStepWrapper
      content={liquidAssetsContent}
      stepId="liquid-assets"
      questionNumber={questionNumber}
      data={data}
      updateData={updateData}
      uploadedDocuments={uploadedDocuments}
      onDocumentAdded={onDocumentAdded}
      onRemoveDocument={onRemoveDocument}
      uploadLabel="Upload Bank Statement"
      uploadDescription="Auto-fill from your bank statement"
      householdReminder="Include accounts for yourself, spouse, and children."
    >
      <CurrencyInput
        label="Checking Accounts"
        description="Total balance across all checking accounts"
        householdDescription="Combined checking accounts for all family members"
        isHousehold={isHousehold}
        value={data.checkingAccounts}
        onChange={(value) => updateData({ checkingAccounts: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'checkingAccounts')}
        testId="checking-accounts-input"
      />

      <CurrencyInput
        label="Savings Accounts"
        description="Total balance (exclude interest earned)"
        householdDescription="Combined savings for all family members (exclude interest)"
        isHousehold={isHousehold}
        value={data.savingsAccounts}
        onChange={(value) => updateData({ savingsAccounts: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'savingsAccounts')}
        testId="savings-accounts-input"
      />

      <CurrencyInput
        label="Cash on Hand"
        description="Physical cash in wallet or home"
        householdDescription="Cash held by all family members"
        isHousehold={isHousehold}
        value={data.cashOnHand}
        onChange={(value) => updateData({ cashOnHand: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'cashOnHand')}
        testId="cash-on-hand-input"
      />

      <CurrencyInput
        label="Digital Wallets"
        description="PayPal, Venmo, CashApp, Zelle"
        householdDescription="Combined digital wallet balances for all family members"
        isHousehold={isHousehold}
        value={data.digitalWallets}
        onChange={(value) => updateData({ digitalWallets: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'digitalWallets')}
        testId="digital-wallets-input"
      />

      <CurrencyInput
        label="Foreign Currency"
        description="Converted to USD at today's rate"
        householdDescription="Foreign currency held by all family members (in USD)"
        isHousehold={isHousehold}
        value={data.foreignCurrency}
        onChange={(value) => updateData({ foreignCurrency: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'foreignCurrency')}
        testId="foreign-currency-input"
      />

      <div className="pt-4 border-t border-border">
        <CurrencyInput
          label="⚠️ Interest Earned (For Purification)"
          description="Not Zakatable—must be donated to charity separately"
          value={data.interestEarned}
          onChange={(value) => updateData({ interestEarned: value })}
          documentContributions={getDocumentContributionsForField(uploadedDocuments, 'interestEarned')}
          testId="interest-earned-input"
        />
      </div>
    </AssetStepWrapper>
  );
}
