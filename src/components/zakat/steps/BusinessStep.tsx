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
import { businessContent } from "@/content/steps";
import { AssetStepWrapper } from "../AssetStepWrapper";
import { CurrencyInput } from "../CurrencyInput";
import { UploadedDocument } from "@/lib/documentTypes";
import { AssetStepProps, getDocumentContributionsForField } from "@/hooks/useDocumentExtraction";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Lightbulb } from "@phosphor-icons/react";

export function BusinessStep({ data, updateData, uploadedDocuments, onDocumentAdded, onRemoveDocument, questionNumber }: AssetStepProps) {
  const isHousehold = data.isHousehold;
  const isServiceBusiness = data.isServiceBusiness;

  return (
    <AssetStepWrapper
      content={businessContent}
      stepId="business"
      questionNumber={questionNumber}
      data={data}
      updateData={updateData}
      uploadedDocuments={uploadedDocuments}
      onDocumentAdded={onDocumentAdded}
      onRemoveDocument={onRemoveDocument}
      showUpload={false}
      householdReminder="Include business assets owned by yourself, spouse, and children."
    >
      {/* Service Business Toggle */}
      <div className="flex items-center justify-between p-4 bg-accent rounded-lg mb-4">
        <div>
          <Label className="text-foreground font-medium">Service Business?</Label>
          <p className="text-sm text-muted-foreground">Consultants, freelancers, SaaS — no physical inventory</p>
        </div>
        <Switch
          checked={isServiceBusiness}
          onCheckedChange={(checked) => updateData({ isServiceBusiness: checked })}
        />
      </div>

      {/* Service Business Tip */}
      {isServiceBusiness && (
        <div className="flex gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg mb-4">
          <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" weight="fill" />
          <div className="text-sm">
            <p className="font-medium text-primary mb-1">Service Income Guidance</p>
            <p className="text-muted-foreground">
              Include <strong>net profits</strong> held in your accounts. No inventory field needed.
            </p>
            <p className="text-muted-foreground/80 text-xs mt-2 italic">
              "Service income is like agricultural produce—taxed on the yield, not the land." — Dr. Yusuf Al-Qaradawi
            </p>
          </div>
        </div>
      )}

      <CurrencyInput
        label={isServiceBusiness ? "Cash, Receivables & Net Profits" : "Cash & Receivables"}
        description={isServiceBusiness
          ? "Business cash + accounts receivable + accumulated net profits"
          : "Business cash + accounts receivable"
        }
        householdDescription="Combined business cash for all family members"
        isHousehold={isHousehold}
        value={data.businessCashAndReceivables}
        onChange={(value) => updateData({ businessCashAndReceivables: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'businessCashAndReceivables')}
      />

      {/* Only show inventory for non-service businesses */}
      {!isServiceBusiness && (
        <CurrencyInput
          label="Inventory"
          description="Goods for sale at current selling price"
          householdDescription="Combined inventory for all family members"
          isHousehold={isHousehold}
          value={data.businessInventory}
          onChange={(value) => updateData({ businessInventory: value })}
          documentContributions={getDocumentContributionsForField(uploadedDocuments, 'businessInventory')}
        />
      )}
    </AssetStepWrapper>
  );
}
