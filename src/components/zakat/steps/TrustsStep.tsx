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

import { useState } from "react";
import { ZakatFormData } from "@/lib/zakatCalculations";
import { trustsContent } from "@/content/steps";
import { AssetStepWrapper } from "../AssetStepWrapper";
import { CurrencyInput } from "../CurrencyInput";
import { UploadedDocument } from "@/lib/documentTypes";
import { AssetStepProps, getDocumentContributionsForField } from "@/hooks/useDocumentExtraction";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TrustAllocationDialog } from "../TrustAllocationDialog";
import { WhyTooltip } from "../WhyTooltip";
import { getFiqhExplanations } from "@/content/fiqhExplanations";
import { ZAKAT_PRESETS } from "@/lib/config/presets";

export function TrustsStep({ data, updateData, uploadedDocuments, onDocumentAdded, onRemoveDocument, questionNumber }: AssetStepProps) {
  const isHousehold = data.isHousehold;
  const config = ZAKAT_PRESETS[data.madhab] || ZAKAT_PRESETS['bradford'];
  const fiqhExplanations = getFiqhExplanations(config);
  const [allocationDialog, setAllocationDialog] = useState<{
    open: boolean;
    value: number;
    documentName: string;
    pendingDocument: Omit<UploadedDocument, 'id' | 'uploadedAt'> | null;
  }>({
    open: false,
    value: 0,
    documentName: "",
    pendingDocument: null,
  });

  // Custom handler for trust documents that need categorization
  const handleTrustDocumentAdded = (doc: Omit<UploadedDocument, 'id' | 'uploadedAt'>) => {
    const extractedData = doc.extractedData;

    // Check if document has trust values that need categorization
    const hasTrustValue = (extractedData.revocableTrustValue && extractedData.revocableTrustValue > 0) ||
      (extractedData.irrevocableTrustValue && extractedData.irrevocableTrustValue > 0);

    // If document has a generic trust value, ask user to categorize
    const totalTrustValue = (extractedData.revocableTrustValue || 0) + (extractedData.irrevocableTrustValue || 0);

    if (hasTrustValue && totalTrustValue > 0) {
      setAllocationDialog({
        open: true,
        value: totalTrustValue,
        documentName: doc.fileName,
        pendingDocument: doc,
      });
    } else {
      // No trust values, just add the document normally
      onDocumentAdded(doc);
    }
  };

  const handleAllocationConfirm = (allocation: { revocable: number; irrevocable: number }) => {
    if (allocationDialog.pendingDocument) {
      // Update the document's extracted data with the user's allocation
      const updatedDoc = {
        ...allocationDialog.pendingDocument,
        extractedData: {
          ...allocationDialog.pendingDocument.extractedData,
          revocableTrustValue: allocation.revocable,
          irrevocableTrustValue: allocation.irrevocable,
        },
      };
      onDocumentAdded(updatedDoc);

      // Update form data with new allocations
      updateData({
        revocableTrustValue: data.revocableTrustValue + allocation.revocable,
        irrevocableTrustValue: data.irrevocableTrustValue + allocation.irrevocable,
      });
    }
    setAllocationDialog({ open: false, value: 0, documentName: "", pendingDocument: null });
  };

  return (
    <>
      <AssetStepWrapper
        content={trustsContent}
        stepId="trusts"
        questionNumber={questionNumber}
        data={data}
        updateData={updateData}
        uploadedDocuments={uploadedDocuments}
        onDocumentAdded={handleTrustDocumentAdded}
        onRemoveDocument={onRemoveDocument}
        showUpload={true}
        uploadLabel="Upload Trust Document"
        uploadDescription="Upload trust statements to auto-fill values"
        householdReminder="Include trusts benefiting yourself, spouse, and children."
      >
        <CurrencyInput
          label={
            <span className="flex items-center gap-2">
              Revocable Trust Value
              <WhyTooltip {...fiqhExplanations.revocableTrust} />
            </span>
          }
          description="You retain control—fully Zakatable"
          householdDescription="Combined revocable trust value for all family members"
          isHousehold={isHousehold}
          value={data.revocableTrustValue}
          onChange={(value) => updateData({ revocableTrustValue: value })}
          documentContributions={getDocumentContributionsForField(uploadedDocuments, 'revocableTrustValue')}
        />

        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground">Irrevocable Trust</h3>
            <WhyTooltip {...fiqhExplanations.irrevocableTrust} />
          </div>

          <CurrencyInput
            label="Irrevocable Trust Value"
            description="Trust value if accessible"
            householdDescription="Combined irrevocable trust value for all family members"
            isHousehold={isHousehold}
            value={data.irrevocableTrustValue}
            onChange={(value) => updateData({ irrevocableTrustValue: value })}
            documentContributions={getDocumentContributionsForField(uploadedDocuments, 'irrevocableTrustValue')}
          />

          <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
            <div>
              <Label className="text-foreground">Can you access the principal?</Label>
              <p className="text-sm text-muted-foreground">If no, it's not Zakatable</p>
            </div>
            <Switch
              checked={data.irrevocableTrustAccessible}
              onCheckedChange={(checked) => updateData({ irrevocableTrustAccessible: checked })}
            />
          </div>

          {data.irrevocableTrustValue > 0 && (
            <div className={`p-3 rounded-lg text-sm ${data.irrevocableTrustAccessible ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
              {data.irrevocableTrustAccessible
                ? "✓ Zakatable — you can access the principal"
                : "✗ Not Zakatable — you lack complete possession (Milk Tam)"
              }
            </div>
          )}
        </div>

        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground">CLAT (Charitable Lead Annuity Trust)</h3>
            <WhyTooltip {...fiqhExplanations.clatTrust} />
          </div>
          <CurrencyInput
            label="CLAT Value"
            description="Not Zakatable during annuity term"
            value={data.clatValue}
            onChange={(value) => updateData({ clatValue: value })}
            documentContributions={getDocumentContributionsForField(uploadedDocuments, 'clatValue')}
          />
          {data.clatValue > 0 && (
            <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
              ✗ Not Zakatable — charity owns the usufruct during the term
            </div>
          )}
        </div>
      </AssetStepWrapper>

      <TrustAllocationDialog
        open={allocationDialog.open}
        onOpenChange={(open) => setAllocationDialog(prev => ({ ...prev, open }))}
        extractedValue={allocationDialog.value}
        documentName={allocationDialog.documentName}
        onConfirm={handleAllocationConfirm}
      />
    </>
  );
}
