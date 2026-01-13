import { ZakatFormData, calculateNisab, formatCurrency, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, NisabStandard, Madhab } from "@/lib/zakatCalculations";
import { nisabContent } from "@/content/steps";
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
            className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${data.nisabStandard === 'silver'
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
            className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${data.nisabStandard === 'gold'
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

      {/* Calculation Mode Selection - 4 Fiqh-Based Modes */}
      <div className="space-y-3 pt-6 border-t border-border">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-foreground">Calculation Methodology</h3>
          <WhyTooltip {...fiqhExplanations.calculationModes} />
        </div>
        <RadioGroup
          value={data.madhab}
          onValueChange={(value) => updateData({ madhab: value as Madhab })}
          className="space-y-3"
        >
          {/* Bradford Mode */}
          <label
            className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${data.madhab === 'balanced'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
              }`}
          >
            <RadioGroupItem value="bradford" id="bradford" className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <ShieldCheck weight="duotone" className="w-5 h-5 text-tertiary" />
                <span className="font-medium text-foreground">Bradford (Balanced)</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Recommended</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                30% passive investments, retirement exempt under 59½, personal jewelry exempt.
              </p>
            </div>
          </label>

          {/* Hanafi Mode */}
          <label
            className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${data.madhab === 'hanafi'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
              }`}
          >
            <RadioGroupItem value="hanafi" id="hanafi" className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Scales weight="duotone" className="w-5 h-5 text-secondary" />
                <span className="font-medium text-foreground">Hanafi</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                100% all assets, personal jewelry included, full debt deduction.
              </p>
            </div>
          </label>

          {/* Maliki/Shafi'i Mode */}
          <label
            className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${data.madhab === 'maliki' || data.madhab === 'shafii'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
              }`}
          >
            <RadioGroupItem value="maliki-shafii" id="maliki-shafii" className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Calculator weight="duotone" className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">Maliki/Shafi'i</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                100% all assets, jewelry exempt, only 12-month debts deducted.
              </p>
            </div>
          </label>

          {/* Hanbali Mode */}
          <label
            className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${data.madhab === 'hanbali'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
              }`}
          >
            <RadioGroupItem value="hanbali" id="hanbali" className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Calculator weight="duotone" className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Hanbali</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                100% all assets, jewelry exempt, full debt deduction.
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
