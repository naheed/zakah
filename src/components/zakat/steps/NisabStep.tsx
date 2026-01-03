import { ZakatFormData, calculateNisab, formatCurrency, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, NisabStandard, CalculationMode } from "@/lib/zakatCalculations";
import { nisabContent } from "@/lib/zakatContent";
import { QuestionLayout } from "../QuestionLayout";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { WhyTooltip, fiqhExplanations } from "../WhyTooltip";
import { Scales, Calculator, ShieldCheck } from "@phosphor-icons/react";

interface NisabStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
  questionNumber?: number;
}

export function NisabStep({ data, updateData, questionNumber }: NisabStepProps) {
  const silverNisab = calculateNisab(SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, 'silver');
  const goldNisab = calculateNisab(SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, 'gold');
  const currentNisab = data.nisabStandard === 'gold' ? goldNisab : silverNisab;
  
  return (
    <QuestionLayout content={nisabContent} questionNumber={questionNumber}>
      {/* Nisab Standard Selection */}
      <div className="space-y-3">
        <h3 className="font-medium text-foreground">Niṣāb Standard</h3>
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
      </div>
      
      {/* Calculation Mode Selection */}
      <div className="space-y-3 pt-6 border-t border-border">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-foreground">Calculation Mode</h3>
          <WhyTooltip {...fiqhExplanations.calculationModes} />
        </div>
        <RadioGroup
          value={data.calculationMode}
          onValueChange={(value) => updateData({ calculationMode: value as CalculationMode })}
          className="space-y-3"
        >
          <label 
            className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
              data.calculationMode === 'conservative' 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            <RadioGroupItem value="conservative" id="conservative" className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Scales weight="duotone" className="w-5 h-5 text-secondary" />
                <span className="font-medium text-foreground">Conservative (Precautionary)</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Full value of all assets. Maximum Zakat—no deductions for taxes or penalties on retirement accounts.
              </p>
            </div>
          </label>
          
          <label 
            className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
              data.calculationMode === 'optimized' 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            <RadioGroupItem value="optimized" id="optimized" className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Calculator weight="duotone" className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">Optimized (Tax-Adjusted)</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Deducts estimated taxes and early withdrawal penalties from retirement accounts. Applies 30% rule for passive investments.
              </p>
            </div>
          </label>
          
          <label 
            className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
              data.calculationMode === 'bradford' 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            <RadioGroupItem value="bradford" id="bradford" className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <ShieldCheck weight="duotone" className="w-5 h-5 text-tertiary" />
                <span className="font-medium text-foreground">Bradford Exclusion Rule</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Traditional 401(k)/IRA accounts are <strong>fully exempt</strong> if under 59½. Based on Sheikh Joe Bradford's ruling that these lack <em>milk tām</em> (complete ownership).
              </p>
              <p className="text-xs text-muted-foreground mt-2 italic">
                Roth IRA contributions remain 100% zakatable. Only pre-tax retirement accounts are exempt.
              </p>
            </div>
          </label>
        </RadioGroup>
      </div>
      
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
