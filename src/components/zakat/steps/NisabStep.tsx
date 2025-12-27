import { ZakatFormData, calculateNisab, formatCurrency, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, NisabStandard } from "@/lib/zakatCalculations";
import { nisabContent } from "@/lib/zakatContent";
import { QuestionLayout } from "../QuestionLayout";
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
    <QuestionLayout content={nisabContent}>
      <RadioGroup
        value={data.nisabStandard}
        onValueChange={(value) => updateData({ nisabStandard: value as NisabStandard })}
        className="space-y-3"
      >
        <label 
          className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
            data.nisabStandard === 'silver' 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50'
          }`}
        >
          <RadioGroupItem value="silver" id="silver" />
          <div className="flex-1">
            <span className="font-medium text-foreground">Silver Standard</span>
            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Recommended</span>
            <p className="text-sm text-muted-foreground mt-1">
              595 grams of silver ≈ {formatCurrency(silverNisab, data.currency)}
            </p>
          </div>
        </label>
        
        <label 
          className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
            data.nisabStandard === 'gold' 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50'
          }`}
        >
          <RadioGroupItem value="gold" id="gold" />
          <div className="flex-1">
            <span className="font-medium text-foreground">Gold Standard</span>
            <p className="text-sm text-muted-foreground mt-1">
              85 grams of gold ≈ {formatCurrency(goldNisab, data.currency)}
            </p>
          </div>
        </label>
      </RadioGroup>
      
      {/* Current Nisab Display */}
      <div className="text-center p-6 bg-card border border-border rounded-xl">
        <p className="text-sm text-muted-foreground mb-1">Your Niṣāb Threshold</p>
        <p className="text-4xl font-bold text-primary">
          {formatCurrency(currentNisab, data.currency)}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Based on current {data.nisabStandard} prices
        </p>
      </div>
    </QuestionLayout>
  );
}
