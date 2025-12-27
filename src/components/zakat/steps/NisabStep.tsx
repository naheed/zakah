import { ZakatFormData, calculateNisab, formatCurrency, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, NisabStandard } from "@/lib/zakatCalculations";
import { StepHeader } from "../StepHeader";
import { InfoCard } from "../InfoCard";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface NisabStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
}

export function NisabStep({ data, updateData }: NisabStepProps) {
  const silverNisab = calculateNisab(SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, 'silver');
  const goldNisab = calculateNisab(SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, 'gold');
  const currentNisab = data.nisabStandard === 'gold' ? goldNisab : silverNisab;
  
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
            to be obligated to pay Zakat. This amount was set by our Prophet Muhammad (ﷺ).
          </p>
        </InfoCard>
        
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-2">Choose Your Niṣāb Standard</p>
          
          <RadioGroup
            value={data.nisabStandard}
            onValueChange={(value) => updateData({ nisabStandard: value as NisabStandard })}
            className="space-y-3 mb-6"
          >
            <div className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors ${data.nisabStandard === 'silver' ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-accent'}`}>
              <RadioGroupItem value="silver" id="silver" />
              <Label htmlFor="silver" className="flex-1 cursor-pointer">
                <span className="font-medium">Silver Standard (Recommended)</span>
                <p className="text-sm text-muted-foreground">595 grams of silver ≈ {formatCurrency(silverNisab, data.currency)}</p>
              </Label>
            </div>
            <div className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors ${data.nisabStandard === 'gold' ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-accent'}`}>
              <RadioGroupItem value="gold" id="gold" />
              <Label htmlFor="gold" className="flex-1 cursor-pointer">
                <span className="font-medium">Gold Standard</span>
                <p className="text-sm text-muted-foreground">85 grams of gold ≈ {formatCurrency(goldNisab, data.currency)}</p>
              </Label>
            </div>
          </RadioGroup>
          
          <div className="text-center pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">Your Current Niṣāb Threshold</p>
            <p className="text-4xl font-bold text-primary">
              {formatCurrency(currentNisab, data.currency)}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Based on {data.nisabStandard} price of ${data.nisabStandard === 'silver' ? SILVER_PRICE_PER_OUNCE.toFixed(2) : GOLD_PRICE_PER_OUNCE.toFixed(2)}/oz
            </p>
          </div>
        </div>
        
        <InfoCard variant="tip" title="Why Silver is Recommended">
          <p>
            The majority of scholars advocate for the <strong>silver standard</strong> for cash 
            and mixed assets. This is based on the principle of <em>Anfa' li'l-fuqara</em> 
            (most beneficial for the poor) and <em>Ahwat</em> (precautionary). The gold 
            standard is valid for those holding wealth exclusively in gold bullion.
          </p>
        </InfoCard>
        
        <p className="text-muted-foreground">
          We will automatically let you know if you're under the niṣāb amount at the end of your calculation.
        </p>
      </div>
    </div>
  );
}
