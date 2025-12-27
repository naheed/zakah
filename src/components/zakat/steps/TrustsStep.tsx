import { ZakatFormData } from "@/lib/zakatCalculations";
import { trustsContent } from "@/lib/zakatContent";
import { AssetStepWrapper } from "../AssetStepWrapper";
import { CurrencyInput } from "../CurrencyInput";
import { UploadedDocument } from "@/lib/documentTypes";
import { AssetStepProps, getDocumentContributionsForField } from "@/hooks/useDocumentExtraction";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function TrustsStep({ data, updateData, uploadedDocuments, onDocumentAdded, onRemoveDocument }: AssetStepProps) {
  const isHousehold = data.isHousehold;

  return (
    <AssetStepWrapper
      content={trustsContent}
      stepId="trusts"
      data={data}
      updateData={updateData}
      uploadedDocuments={uploadedDocuments}
      onDocumentAdded={onDocumentAdded}
      onRemoveDocument={onRemoveDocument}
      showUpload={false}
      householdReminder="Include trusts benefiting yourself, spouse, and children."
    >
      <CurrencyInput
        label="Revocable Trust Value"
        description="You retain control—fully Zakatable"
        householdDescription="Combined revocable trust value for all family members"
        isHousehold={isHousehold}
        value={data.revocableTrustValue}
        onChange={(value) => updateData({ revocableTrustValue: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'revocableTrustValue')}
      />
      
      <div className="space-y-3 pt-4 border-t border-border">
        <h3 className="font-medium text-foreground">Irrevocable Trust</h3>
        
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
        <h3 className="font-medium text-foreground">CLAT (Charitable Lead Annuity Trust)</h3>
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
  );
}
