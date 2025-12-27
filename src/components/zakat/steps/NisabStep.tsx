import { StepHeader } from "../StepHeader";
import { InfoCard } from "../InfoCard";
import { calculateNisab, formatCurrency, SILVER_PRICE_PER_OUNCE } from "@/lib/zakatCalculations";

interface NisabStepProps {
  currency: string;
}

export function NisabStep({ currency }: NisabStepProps) {
  const nisab = calculateNisab(SILVER_PRICE_PER_OUNCE);
  
  return (
    <div className="max-w-2xl">
      <StepHeader
        questionNumber={2}
        title="Know the Niṣāb"
        subtitle="The minimum threshold for Zakat obligation"
      />
      
      <div className="space-y-6">
        <InfoCard variant="info">
          <p>
            The <strong>niṣāb</strong> is the minimum liable amount that a Muslim must have 
            to be obligated to pay Zakat. This amount was set by our Prophet Muhammad (ﷺ) 
            at <strong>595 grams of Silver</strong> (approximately 21 ounces).
          </p>
        </InfoCard>
        
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Current Niṣāb Threshold</p>
          <p className="text-4xl font-bold text-primary">
            {formatCurrency(nisab, currency)}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Based on silver price of ${SILVER_PRICE_PER_OUNCE.toFixed(2)}/oz
          </p>
        </div>
        
        <InfoCard variant="tip" title="Why Silver?">
          <p>
            We use the silver niṣāb (rather than gold) to stay true to Sheikh Joe Bradford's method. 
            This approach ensures we capture all those who are financially capable of paying Zakat, 
            as the silver standard is more inclusive and beneficial for the poor.
          </p>
        </InfoCard>
        
        <p className="text-muted-foreground">
          We will automatically let you know if you're under the niṣāb amount at the end of your calculation.
        </p>
      </div>
    </div>
  );
}
