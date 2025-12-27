import { ZakatFormData, calculateRetirementAccessible, formatCurrency } from "@/lib/zakatCalculations";
import { StepHeader } from "../StepHeader";
import { CurrencyInput } from "../CurrencyInput";
import { InfoCard } from "../InfoCard";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DocumentUpload } from "../DocumentUpload";

interface RetirementStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
}

export function RetirementStep({ data, updateData }: RetirementStepProps) {
  const accessibleBalance401k = calculateRetirementAccessible(
    data.fourOhOneKVestedBalance,
    data.age,
    data.estimatedTaxRate,
    data.calculationMode
  );
  
  const accessibleBalanceIRA = calculateRetirementAccessible(
    data.traditionalIRABalance,
    data.age,
    data.estimatedTaxRate,
    data.calculationMode
  );

  const handleDataExtracted = (extractedData: Partial<ZakatFormData>) => {
    const updates: Partial<ZakatFormData> = {};
    const fields = ['rothIRAContributions', 'rothIRAEarnings', 'fourOhOneKVestedBalance', 'traditionalIRABalance', 'hsaBalance'] as const;
    
    for (const field of fields) {
      if (extractedData[field] && extractedData[field]! > 0) {
        updates[field] = (data[field] || 0) + extractedData[field]!;
      }
    }
    
    if (Object.keys(updates).length > 0) {
      updateData(updates);
    }
  };
  
  return (
    <div className="max-w-xl">
      <StepHeader
        emoji="🎂"
        title="Retirement Accounts"
        subtitle="Tax-advantaged accounts with accessibility considerations"
      />
      
      <div className="space-y-8">
        <DocumentUpload
          onDataExtracted={handleDataExtracted}
          label="Upload Retirement Statement"
          description="Upload a 401(k), IRA, or HSA statement to auto-fill values"
        />
        
        <InfoCard variant="info">
          <p>
            Retirement accounts present unique Zakat challenges due to access restrictions. 
            The <strong>Accessible Balance Method</strong> (AMJA/Bradford) calculates Zakat on the 
            "Net Cash Value" if you were to liquidate today.
          </p>
        </InfoCard>
        
        <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
          <div>
            <Label className="text-foreground">Are you over 59½ years old?</Label>
            <p className="text-sm text-muted-foreground">This affects penalty calculations</p>
          </div>
          <Switch
            checked={data.isOver59Half}
            onCheckedChange={(checked) => updateData({ isOver59Half: checked })}
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Roth Accounts</h3>
          
          <CurrencyInput
            label="🎂 Roth IRA Contributions (Principal)"
            description="Your contributions only. These are always accessible tax-free and penalty-free."
            value={data.rothIRAContributions}
            onChange={(value) => updateData({ rothIRAContributions: value })}
          />
          
          <CurrencyInput
            label="📈 Roth IRA Earnings"
            description="Growth/earnings portion. Subject to tax and penalty if withdrawn before 59½."
            value={data.rothIRAEarnings}
            onChange={(value) => updateData({ rothIRAEarnings: value })}
          />
          
          <InfoCard variant="tip" title="Roth Treatment">
            <p>
              <strong>Principal:</strong> Always 100% Zakatable (accessible anytime).<br/>
              <strong>Earnings:</strong> If under 59½, we apply the tax/penalty deduction.
            </p>
          </InfoCard>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Traditional 401(k)</h3>
          
          <CurrencyInput
            label="👴 401(k) Vested Balance"
            description="Your vested balance only. Unvested employer matches are NOT Zakatable."
            value={data.fourOhOneKVestedBalance}
            onChange={(value) => updateData({ fourOhOneKVestedBalance: value })}
          />
          
          <CurrencyInput
            label="🔒 401(k) Unvested Employer Match"
            description="Unvested amounts you don't yet own. This is EXEMPT from Zakat."
            value={data.fourOhOneKUnvestedMatch}
            onChange={(value) => updateData({ fourOhOneKUnvestedMatch: value })}
          />
          
          {data.fourOhOneKVestedBalance > 0 && (
            <div className="p-4 bg-accent rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Zakatable Amount ({data.calculationMode} mode)</p>
              <p className="text-lg font-semibold text-primary">
                {formatCurrency(accessibleBalance401k, data.currency)}
              </p>
              {!data.isOver59Half && data.calculationMode === 'optimized' && (
                <p className="text-xs text-muted-foreground mt-1">
                  After {(data.estimatedTaxRate * 100).toFixed(0)}% tax + 10% penalty deduction
                </p>
              )}
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Traditional IRA</h3>
          
          <CurrencyInput
            label="👵 Traditional IRA Balance"
            description="Total vested balance of your Traditional IRA"
            value={data.traditionalIRABalance}
            onChange={(value) => updateData({ traditionalIRABalance: value })}
          />
          
          {data.traditionalIRABalance > 0 && (
            <div className="p-4 bg-accent rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Zakatable Amount</p>
              <p className="text-lg font-semibold text-primary">
                {formatCurrency(accessibleBalanceIRA, data.currency)}
              </p>
            </div>
          )}
        </div>
        
        <CurrencyInput
          label="💰 IRA Withdrawals This Year"
          description="Actual withdrawals made (post-tax & post-penalties)"
          value={data.iraWithdrawals}
          onChange={(value) => updateData({ iraWithdrawals: value })}
        />
        
        <CurrencyInput
          label="🎒 ESA Withdrawals"
          description="Total Coverdell ESA withdrawals (post-tax & post-penalties)"
          value={data.esaWithdrawals}
          onChange={(value) => updateData({ esaWithdrawals: value })}
        />
        
        <CurrencyInput
          label="📚 529 Withdrawals"
          description="Total 529 College Savings withdrawals (post-tax & post-penalties)"
          value={data.fiveTwentyNineWithdrawals}
          onChange={(value) => updateData({ fiveTwentyNineWithdrawals: value })}
        />
        
        <div className="space-y-4">
          <CurrencyInput
            label="💉 HSA Balance"
            description="Total value of your Health Savings Account"
            value={data.hsaBalance}
            onChange={(value) => updateData({ hsaBalance: value })}
          />
          
          <InfoCard variant="info">
            <p>
              <strong>FSA funds are NOT Zakatable</strong> (use it or lose it — no ownership).<br/>
              <strong>HSA funds ARE Zakatable</strong> because they're constantly accessible 
              for medical expenses.
            </p>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
