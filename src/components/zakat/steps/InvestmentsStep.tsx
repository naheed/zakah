import { ZakatFormData } from "@/lib/zakatCalculations";
import { StepHeader } from "../StepHeader";
import { CurrencyInput } from "../CurrencyInput";
import { InfoCard } from "../InfoCard";

interface InvestmentsStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
}

export function InvestmentsStep({ data, updateData }: InvestmentsStepProps) {
  return (
    <div className="max-w-xl">
      <StepHeader
        emoji="📈"
        title="Investments & Cryptocurrencies"
        subtitle="Stocks, funds, and digital assets"
      />
      
      <div className="space-y-8">
        <div className="space-y-4">
          <CurrencyInput
            label="📈 Active Investments & Cryptocurrencies"
            description="Stocks, funds, or currencies held short-term (less than 365 days). Include the market value of cryptocurrencies and cash in brokerage accounts."
            value={data.activeInvestments}
            onChange={(value) => updateData({ activeInvestments: value })}
          />
          
          <InfoCard variant="info">
            <p>
              An "active" investment is one you hold for a short period for trading purposes. 
              Treat these the same as cash. <strong>Unvested RSUs, ESPP, or restricted shares 
              are not subject to Zakat.</strong>
            </p>
          </InfoCard>
        </div>
        
        <div className="space-y-4">
          <CurrencyInput
            label="📊 Passive Investments"
            description="Stocks you plan on holding long-term (more than 365 days). We'll apply the 30% rule for these."
            value={data.passiveInvestmentsValue}
            onChange={(value) => updateData({ passiveInvestmentsValue: value })}
          />
          
          <InfoCard variant="tip" title="The 30% Rule">
            <p>
              For long-term investments, you pay Zakat on approximately 30% of the market 
              value (representing the liquid/zakatable assets of the underlying companies). 
              This is based on AAOIFI standards and average corporate balance sheets.
            </p>
          </InfoCard>
        </div>
        
        <CurrencyInput
          label="🔖 Dividends"
          description="Total dividends received over the ḥawl. Don't double count if already in your checking/savings."
          value={data.dividends}
          onChange={(value) => updateData({ dividends: value })}
        />
      </div>
    </div>
  );
}
