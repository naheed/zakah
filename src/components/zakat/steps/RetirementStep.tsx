import { ZakatFormData } from "@/lib/zakatCalculations";
import { StepHeader } from "../StepHeader";
import { CurrencyInput } from "../CurrencyInput";
import { InfoCard } from "../InfoCard";

interface RetirementStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
}

export function RetirementStep({ data, updateData }: RetirementStepProps) {
  return (
    <div className="max-w-xl">
      <StepHeader
        emoji="🎂"
        title="Retirement Accounts"
        subtitle="Tax-advantaged accounts and withdrawals"
      />
      
      <div className="space-y-8">
        <div className="space-y-4">
          <CurrencyInput
            label="🎂 Roth IRA Contributions"
            description="Total value of your Roth IRA contributions (principal only, not earnings)"
            value={data.rothIRAContributions}
            onChange={(value) => updateData({ rothIRAContributions: value })}
          />
          
          <InfoCard variant="info">
            <p>
              You pay Zakat on what is in your full control. If you're under 59½, pay only 
              on your <strong>Roth IRA contributions</strong> (accessible without penalty). 
              If over 59½, include earnings older than 5 years.
            </p>
          </InfoCard>
        </div>
        
        <div className="space-y-4">
          <CurrencyInput
            label="👴 401(k) Withdrawals"
            description="Total 401(k) withdrawals this year (post-tax & post-penalties)"
            value={data.fourOhOneKWithdrawals}
            onChange={(value) => updateData({ fourOhOneKWithdrawals: value })}
          />
          
          <InfoCard variant="tip" title="Sheikh Bradford's Advice">
            <p>
              If you're under 59.5, you're not obligated to pay Zakat on your 401(k) because 
              it's not fully in your control. Only include actual withdrawals here (after taxes 
              and penalties are deducted).
            </p>
          </InfoCard>
        </div>
        
        <CurrencyInput
          label="👵 IRA Withdrawals"
          description="Total IRA withdrawals this year (post-tax & post-penalties)"
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
              <strong>FSA funds are not Zakatable</strong> (use it or lose it). 
              <strong>HSA funds are Zakatable</strong> because they're constantly accessible 
              for medical expenses.
            </p>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
