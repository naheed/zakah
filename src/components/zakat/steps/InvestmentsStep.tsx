import { ZakatFormData, formatCurrency } from "@/lib/zakatCalculations";
import { MADHAB_RULES } from "@/lib/madhahRules";
import { investmentsContent } from "@/content/steps";
import { AssetStepWrapper } from "../AssetStepWrapper";
import { CurrencyInput } from "../CurrencyInput";
import { WhyTooltip, fiqhExplanations } from "../WhyTooltip";
import { UploadedDocument } from "@/lib/documentTypes";
import { AssetStepProps, getDocumentContributionsForField } from "@/hooks/useDocumentExtraction";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InvestmentsStep({ data, updateData, uploadedDocuments, onDocumentAdded, onRemoveDocument, questionNumber }: AssetStepProps) {
  // Use MADHAB_RULES for passive investment rate
  // Balanced: 30% (underlying zakatable assets proxy)
  // Hanafi/Maliki/Shafii/Hanbali: 100% (full market value)
  const passiveRate = MADHAB_RULES[data.madhab].passiveInvestmentRate;
  const passiveZakatable = data.passiveInvestmentsValue * passiveRate;

  const purificationAmount = data.dividends * (data.dividendPurificationPercent / 100);
  const isHousehold = data.isHousehold;

  return (
    <AssetStepWrapper
      content={investmentsContent}
      stepId="investments"
      questionNumber={questionNumber}
      data={data}
      updateData={updateData}
      uploadedDocuments={uploadedDocuments}
      onDocumentAdded={onDocumentAdded}
      onRemoveDocument={onRemoveDocument}
      uploadLabel="Upload Brokerage Statement"
      uploadDescription="Auto-fill from your investment statement"
      householdReminder="Include investment accounts for yourself, spouse, and children."
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-foreground">Active Investments (Trading)</h3>
          <WhyTooltip {...fiqhExplanations.activeInvestments} />
        </div>
        <CurrencyInput
          label="Stocks held for trading"
          description="Short-term holdings (<365 days) for capital gain. Include brokerage cash."
          householdDescription="Combined short-term holdings for all family members"
          isHousehold={isHousehold}
          value={data.activeInvestments}
          onChange={(value) => updateData({ activeInvestments: value })}
          documentContributions={getDocumentContributionsForField(uploadedDocuments, 'activeInvestments')}
        />

        {/* RSU/Stock Options Clarification */}
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <p className="text-sm text-foreground font-medium mb-1">Have RSUs or Stock Options?</p>
          <p className="text-xs text-muted-foreground">
            <strong>Unvested RSUs/options:</strong> Not zakatable — you don't own them yet.<br />
            <strong>Vested RSUs:</strong> Include the current market value above.<br />
            <strong>Exercised options:</strong> Include shares owned in your totals.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-foreground">Passive Investments (Long-Term)</h3>
          <WhyTooltip {...fiqhExplanations.passiveInvestments} />
        </div>
        <CurrencyInput
          label="Stocks held long-term"
          description="Buy-and-hold investments (>365 days)"
          householdDescription="Combined long-term investments for all family members"
          isHousehold={isHousehold}
          value={data.passiveInvestmentsValue}
          onChange={(value) => updateData({ passiveInvestmentsValue: value })}
          documentContributions={getDocumentContributionsForField(uploadedDocuments, 'passiveInvestmentsValue')}
        />

        {data.passiveInvestmentsValue > 0 && (
          <div className="p-4 bg-accent rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">
              Zakatable Amount ({Math.round(passiveRate * 100)}% rule)
            </p>
            <p className="text-xl font-semibold text-primary">
              {formatCurrency(passiveZakatable, data.currency)}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-3 pt-4 border-t border-border">
        <h3 className="font-medium text-foreground">Dividends & Purification</h3>

        <CurrencyInput
          label="Dividends Received"
          description="Total dividends this year (don't double-count if in checking/savings)"
          householdDescription="Combined dividends for all family members"
          isHousehold={isHousehold}
          value={data.dividends}
          onChange={(value) => updateData({ dividends: value })}
          documentContributions={getDocumentContributionsForField(uploadedDocuments, 'dividends')}
        />

        <div className="space-y-2">
          <Label htmlFor="dividend-purification" className="text-sm text-foreground">Purification % (Non-Halal Income)</Label>
          <Input
            id="dividend-purification"
            type="number"
            min={0}
            max={100}
            step={0.1}
            value={data.dividendPurificationPercent || 0}
            onChange={(e) => updateData({ dividendPurificationPercent: parseFloat(e.target.value) || 0 })}
            className="max-w-24"
          />
          <p className="text-xs text-muted-foreground">% from impermissible sources (interest, alcohol, etc.)</p>
        </div>

        {purificationAmount > 0 && (
          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Amount to Purify</p>
            <p className="text-xl font-semibold text-destructive">
              {formatCurrency(purificationAmount, data.currency)}
            </p>
          </div>
        )}
      </div>
    </AssetStepWrapper>
  );
}
