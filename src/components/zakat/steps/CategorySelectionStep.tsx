import { ZakatFormData } from "@/lib/zakatCalculations";
import { StepHeader } from "../StepHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CategorySelectionStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
}

const categories = [
  {
    id: 'hasPreciousMetals' as const,
    emoji: '💍',
    label: 'Precious Metals',
    description: 'Gold, silver, or other precious metals',
  },
  {
    id: 'hasRealEstate' as const,
    emoji: '🏘️',
    label: 'Real Estate for Business',
    description: 'Investment properties or real estate for sale',
  },
  {
    id: 'hasBusiness' as const,
    emoji: '🏪',
    label: 'Business Ownership',
    description: 'Own a business with inventory or receivables',
  },
  {
    id: 'hasIlliquidAssets' as const,
    emoji: '🖼️',
    label: 'Illiquid Assets or Livestock',
    description: 'Art, collectibles, or livestock for sale',
  },
  {
    id: 'hasDebtOwedToYou' as const,
    emoji: '🤝',
    label: 'Debt Owed to You',
    description: 'Money others owe you that you expect to collect',
  },
  {
    id: 'hasTaxPayments' as const,
    emoji: '📋',
    label: 'Property Tax or Late Payments',
    description: 'Property taxes, late tax payments, or fines due',
  },
];

export function CategorySelectionStep({ data, updateData }: CategorySelectionStepProps) {
  return (
    <div className="max-w-2xl">
      <StepHeader
        questionNumber={5}
        title="Which of these apply to your financial picture?"
        subtitle="Select all that apply. This helps us ask the right questions."
      />
      
      <div className="space-y-3">
        {categories.map((category) => {
          const isChecked = data[category.id];
          
          return (
            <label
              key={category.id}
              className={cn(
                "flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all",
                isChecked 
                  ? "bg-primary/5 border-primary" 
                  : "bg-card border-border hover:border-primary/50"
              )}
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={(checked) => 
                  updateData({ [category.id]: checked === true })
                }
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span>{category.emoji}</span>
                  <Label className="font-medium text-foreground cursor-pointer">
                    {category.label}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {category.description}
                </p>
              </div>
            </label>
          );
        })}
      </div>
      
      <p className="text-sm text-muted-foreground mt-6">
        If you're not sure, select the box and you can leave the question blank 
        later when we provide explanations.
      </p>
    </div>
  );
}
