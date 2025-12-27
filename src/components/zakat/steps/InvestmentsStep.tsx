import { ZakatFormData, formatCurrency } from "@/lib/zakatCalculations";
import { StepHeader } from "../StepHeader";
import { CurrencyInput } from "../CurrencyInput";
import { InfoCard } from "../InfoCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InvestmentsStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
}

export function InvestmentsStep({ data, updateData }: InvestmentsStepProps) {
  const passiveZakatable = data.calculationMode === 'conservative' 
    ? data.passiveInvestmentsValue 
    : data.passiveInvestmentsValue * 0.30;
  
  const purificationAmount = data.dividends * (data.dividendPurificationPercent / 100);
  
  return (
    <div className="max-w-xl">
      <StepHeader
        emoji="📈"
        title="Investments"
        subtitle="Stocks, funds, and investment accounts"
      />
      
      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Active Investments (Trading)</h3>
          
          <CurrencyInput
            label="📈 Active Investments"
            description="Stocks, funds, or currencies held short-term (less than 365 days) for trading. Include brokerage cash."
            value={data.activeInvestments}
            onChange={(value) => updateData({ activeInvestments: value })}
          />
          
          <InfoCard variant="info">
            <p>
              <strong>Active investments = trade goods.</strong> If your primary intent is to sell 
              for capital gain (day trading, swing trading), the stock is merchandise. Zakat is 
              due on <strong>100%</strong> of the market value. <strong>Unvested RSUs, ESPP, or 
              restricted shares are NOT subject to Zakat.</strong>
            </p>
          </InfoCard>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Passive Investments (Long-Term)</h3>
          
          <CurrencyInput
            label="📊 Passive Investments"
            description="Stocks you plan on holding long-term (more than 365 days) for appreciation and dividends"
            value={data.passiveInvestmentsValue}
            onChange={(value) => updateData({ passiveInvestmentsValue: value })}
          />
          
          {data.passiveInvestmentsValue > 0 && (
            <div className="p-4 bg-accent rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                Zakatable Amount ({data.calculationMode === 'conservative' ? '100%' : '30% rule'})
              </p>
              <p className="text-lg font-semibold text-primary">
                {formatCurrency(passiveZakatable, data.currency)}
              </p>
            </div>
          )}
          
          <InfoCard variant="tip" title="The 30% Rule (AAOIFI Standard 35)">
            <p>
              For long-term holdings, Zakat shifts to the <strong>Zakatable assets held by the 
              company</strong> (cash, receivables, inventory). Research shows these average ~30% 
              of market cap. In <strong>Optimized mode</strong>, we apply this proxy. In 
              <strong> Conservative mode</strong>, we use 100%.
            </p>
          </InfoCard>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Dividends & Purification</h3>
          
          <CurrencyInput
            label="🔖 Dividends Received"
            description="Total dividends received over the ḥawl. Don't double count if already in your checking/savings."
            value={data.dividends}
            onChange={(value) => updateData({ dividends: value })}
          />
          
          <div className="space-y-2">
            <Label className="text-foreground">
              Purification % (Non-Halal Income)
            </Label>
            <Input
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={data.dividendPurificationPercent || 0}
              onChange={(e) => updateData({ dividendPurificationPercent: parseFloat(e.target.value) || 0 })}
              className="max-w-32"
            />
            <p className="text-sm text-muted-foreground">
              % of dividend from impermissible sources (interest, alcohol, etc.)
            </p>
          </div>
          
          {purificationAmount > 0 && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Amount to Purify (Donate)</p>
              <p className="text-lg font-semibold text-destructive">
                {formatCurrency(purificationAmount, data.currency)}
              </p>
            </div>
          )}
          
          <InfoCard variant="warning" title="Dividend Purification (Tathir)">
            <p>
              If a company derives &lt;5% revenue from impermissible sources (interest, alcohol, gambling), 
              that portion of dividends must be donated to charity. Example: $1.00 dividend with 3% 
              non-halal income = donate $0.03. Zakat is then calculated on remaining assets.
            </p>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
