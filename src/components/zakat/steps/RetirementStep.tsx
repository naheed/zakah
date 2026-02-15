import { ZakatFormData, formatCurrency, calculateRetirementAccessible } from "@/lib/zakatCalculations";
import { ZAKAT_PRESETS } from "@/lib/config/presets";
import { DEFAULT_CONFIG } from "@/lib/config/defaults";
import { retirementContent } from "@/content/steps";
import { AssetStepWrapper } from "../AssetStepWrapper";
import { CurrencyInput } from "../CurrencyInput";
import { UploadedDocument } from "@/lib/documentTypes";
import { AssetStepProps, getDocumentContributionsForField } from "@/hooks/useDocumentExtraction";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { WhyTooltip } from "../WhyTooltip";
import { getFiqhExplanations } from "@/content/fiqhExplanations";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ShieldCheck } from "@phosphor-icons/react";

export function RetirementStep({ data, updateData, uploadedDocuments, onDocumentAdded, onRemoveDocument, questionNumber }: AssetStepProps) {
  const effectiveConfig = ZAKAT_PRESETS[data.madhab] || DEFAULT_CONFIG;
  const fiqhExplanations = getFiqhExplanations(effectiveConfig);
  const accessible401k = calculateRetirementAccessible(data.fourOhOneKVestedBalance, data.age, data.estimatedTaxRate, effectiveConfig, data.retirementWithdrawalAllowed, data.retirementWithdrawalLimit);
  const accessibleIRA = calculateRetirementAccessible(data.traditionalIRABalance, data.age, data.estimatedTaxRate, effectiveConfig, data.retirementWithdrawalAllowed, data.retirementWithdrawalLimit);
  const isHousehold = data.isHousehold;
  const isBradfordMode = data.madhab === 'bradford';
  const isUnder59Half = !data.isOver59Half;
  const showBradfordExempt = isBradfordMode && isUnder59Half;

  return (
    <AssetStepWrapper
      content={retirementContent}
      stepId="retirement"
      questionNumber={questionNumber}
      data={data}
      updateData={updateData}
      uploadedDocuments={uploadedDocuments}
      onDocumentAdded={onDocumentAdded}
      onRemoveDocument={onRemoveDocument}
      uploadLabel="Upload Retirement Statement"
      uploadDescription="Auto-fill from your 401(k) or IRA statement"
      householdReminder="Include retirement accounts for yourself, spouse, and children."
    >
      {/* Bradford Mode Callout */}
      {isBradfordMode && (
        <div className="flex items-start gap-3 p-4 bg-tertiary/10 border border-tertiary/20 rounded-lg">
          <ShieldCheck weight="duotone" className="w-5 h-5 text-tertiary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Sheikh Joe Bradford Exclusion Rule Active</p>
            <p className="text-xs text-muted-foreground">
              Traditional 401(k)/IRA accounts are {isUnder59Half ? (
                <strong className="text-tertiary">fully exempt</strong>
              ) : (
                "tax-adjusted"
              )} under this mode.
              {isUnder59Half && " Roth IRA contributions remain 100% zakatable."}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 p-4 bg-accent rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-foreground">Are you over 59½?</Label>
            <p className="text-sm text-muted-foreground">No early withdrawal penalty</p>
          </div>
          <Switch
            checked={data.isOver59Half}
            onCheckedChange={(checked) => updateData({ isOver59Half: checked })}
            aria-label="Are you over 59 and a half years old"
          />
        </div>

        <div className="h-px bg-border/50" />

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-foreground">Does your employer allow early withdrawal?</Label>
            <p className="text-sm text-muted-foreground">Even if there is a penalty</p>
          </div>
          <Switch
            checked={data.retirementWithdrawalAllowed !== false} // Default to true if undefined
            onCheckedChange={(checked) => updateData({ retirementWithdrawalAllowed: checked })}
            aria-label="Does employer allow early withdrawal"
          />
        </div>

        {data.retirementWithdrawalAllowed !== false && (
          <div className="pt-2 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-foreground">Withdrawal Limit</Label>
              <span className="text-sm font-mono bg-background px-2 py-0.5 rounded border">
                {Math.round((data.retirementWithdrawalLimit ?? 1) * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Slider
                value={[(data.retirementWithdrawalLimit ?? 1) * 100]}
                onValueChange={(vals) => updateData({ retirementWithdrawalLimit: vals[0] / 100 })}
                max={100}
                step={5}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Percentage of vested balance you can access today
            </p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-foreground">401(k) / 403(b)</h3>
          <WhyTooltip {...(showBradfordExempt ? fiqhExplanations.bradfordExclusion : fiqhExplanations.retirementAccounts)} />
          {showBradfordExempt && (
            <Badge variant="secondary" className="text-xs bg-tertiary/15 text-amber-800 dark:text-amber-400 border-0">
              Exempt
            </Badge>
          )}
        </div>
        <CurrencyInput
          label="Vested Balance"
          description="Exclude unvested employer match"
          householdDescription="Combined vested 401(k) for all family members"
          isHousehold={isHousehold}
          value={data.fourOhOneKVestedBalance}
          onChange={(value) => updateData({ fourOhOneKVestedBalance: value })}
          documentContributions={getDocumentContributionsForField(uploadedDocuments, 'fourOhOneKVestedBalance')}
        />
        {data.fourOhOneKVestedBalance > 0 && (
          <div className="p-3 bg-accent rounded-lg text-sm">
            <span className="text-muted-foreground">Zakatable amount: </span>
            {showBradfordExempt ? (
              <span className="font-medium text-amber-800 dark:text-amber-400">$0.00 (Exempt)</span>
            ) : (
              <span className="font-medium text-primary">{formatCurrency(accessible401k, data.currency)} (After tax/penalty)</span>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-foreground">Traditional IRA</h3>
          {showBradfordExempt && (
            <Badge variant="secondary" className="text-xs bg-tertiary/15 text-amber-800 dark:text-amber-400 border-0">
              Exempt
            </Badge>
          )}
        </div>
        <CurrencyInput
          label="IRA Balance"
          description="Total Traditional IRA balance"
          householdDescription="Combined Traditional IRA for all family members"
          isHousehold={isHousehold}
          value={data.traditionalIRABalance}
          onChange={(value) => updateData({ traditionalIRABalance: value })}
          documentContributions={getDocumentContributionsForField(uploadedDocuments, 'traditionalIRABalance')}
        />
        {data.traditionalIRABalance > 0 && (
          <div className="p-3 bg-accent rounded-lg text-sm">
            <span className="text-muted-foreground">Zakatable amount: </span>
            {showBradfordExempt ? (
              <span className="font-medium text-amber-800 dark:text-amber-400">$0.00 (Exempt)</span>
            ) : (
              <span className="font-medium text-primary">{formatCurrency(accessibleIRA, data.currency)} (After tax/penalty)</span>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-foreground">Roth IRA</h3>
          <WhyTooltip {...fiqhExplanations.rothIRA} />
        </div>
        <CurrencyInput
          label="Contributions (Principal)"
          description="Always accessible, fully Zakatable"
          householdDescription="Combined Roth IRA contributions for all family members"
          isHousehold={isHousehold}
          value={data.rothIRAContributions}
          onChange={(value) => updateData({ rothIRAContributions: value })}
          documentContributions={getDocumentContributionsForField(uploadedDocuments, 'rothIRAContributions')}
        />
        <CurrencyInput
          label="Earnings (Growth)"
          description={showBradfordExempt ? "Exempt under Sheikh Joe Bradford rule" : "Subject to penalty if under 59½"}
          householdDescription="Combined Roth IRA earnings for all family members"
          isHousehold={isHousehold}
          value={data.rothIRAEarnings}
          onChange={(value) => updateData({ rothIRAEarnings: value })}
          documentContributions={getDocumentContributionsForField(uploadedDocuments, 'rothIRAEarnings')}
        />
        {data.rothIRAEarnings > 0 && showBradfordExempt && (
          <div className="p-3 bg-accent rounded-lg text-sm">
            <span className="text-muted-foreground">Roth earnings: </span>
            <span className="font-medium text-tertiary">$0.00 (Exempt under Sheikh Joe Bradford rule)</span>
          </div>
        )}
      </div>

      <div className="space-y-3 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-foreground">HSA (Health Savings Account)</h3>
          <WhyTooltip {...fiqhExplanations.hsaAccount} />
        </div>
        <CurrencyInput
          label="HSA Balance"
          description="Fully accessible for medical, fully Zakatable"
          householdDescription="Combined HSA balances for all family members"
          isHousehold={isHousehold}
          value={data.hsaBalance}
          onChange={(value) => updateData({ hsaBalance: value })}
          documentContributions={getDocumentContributionsForField(uploadedDocuments, 'hsaBalance')}
        />
      </div>
    </AssetStepWrapper>
  );
}
