import { ZakatFormData } from "@/lib/zakatCalculations";
import { categoriesContent } from "@/lib/zakatContent";
import { QuestionLayout } from "../QuestionLayout";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Banknote, TrendingUp, Landmark, CheckCircle2 } from "lucide-react";

interface CategorySelectionStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
}

const defaultCategories = [
  {
    icon: Banknote,
    label: 'Cash & Bank Accounts',
    description: 'Checking, savings, digital wallets',
  },
  {
    icon: TrendingUp,
    label: 'Stocks & Investments',
    description: 'Brokerage accounts, dividends',
  },
  {
    icon: Landmark,
    label: 'Retirement Accounts',
    description: '401(k), IRA, HSA, Roth',
  },
];

const optionalCategories = [
  {
    id: 'hasPreciousMetals' as const,
    emoji: '💍',
    label: 'Precious Metals',
    description: 'Gold, silver, or jewelry',
  },
  {
    id: 'hasCrypto' as const,
    emoji: '₿',
    label: 'Cryptocurrency',
    description: 'Bitcoin, Ethereum, staking, DeFi',
  },
  {
    id: 'hasTrusts' as const,
    emoji: '📜',
    label: 'Trusts & Estates',
    description: 'Revocable or irrevocable trusts',
  },
  {
    id: 'hasRealEstate' as const,
    emoji: '🏘️',
    label: 'Investment Property',
    description: 'Real estate for sale or rental income',
  },
  {
    id: 'hasBusiness' as const,
    emoji: '🏪',
    label: 'Business Assets',
    description: 'Inventory, receivables, business cash',
  },
  {
    id: 'hasIlliquidAssets' as const,
    emoji: '🖼️',
    label: 'Collectibles & Livestock',
    description: 'Art, antiques, or animals for sale',
  },
  {
    id: 'hasDebtOwedToYou' as const,
    emoji: '🤝',
    label: 'Money Owed to You',
    description: 'Personal loans you expect to collect',
  },
  {
    id: 'hasTaxPayments' as const,
    emoji: '📋',
    label: 'Outstanding Taxes',
    description: 'Property tax or late payments due',
  },
];

export function CategorySelectionStep({ data, updateData }: CategorySelectionStepProps) {
  const selectedCount = optionalCategories.filter(cat => data[cat.id]).length;

  return (
    <QuestionLayout content={categoriesContent}>
      {/* Always Included Section */}
      <div>
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
          We'll always ask about
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {defaultCategories.map((category) => (
            <div
              key={category.label}
              className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <category.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{category.label}</p>
                <p className="text-xs text-muted-foreground truncate">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optional Categories */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Do any of these apply?
          </p>
          {selectedCount > 0 && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {selectedCount} selected
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {optionalCategories.map((category) => {
            const isChecked = data[category.id];
            
            return (
              <label
                key={category.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all group",
                  isChecked 
                    ? "bg-primary/5 border-primary ring-1 ring-primary/20" 
                    : "bg-card border-border hover:border-primary/40 hover:bg-accent/50"
                )}
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) => 
                    updateData({ [category.id]: checked === true })
                  }
                  className="flex-shrink-0"
                />
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-lg flex-shrink-0">{category.emoji}</span>
                  <div className="min-w-0">
                    <Label className="font-medium text-foreground cursor-pointer block truncate">
                      {category.label}
                    </Label>
                    <p className="text-xs text-muted-foreground truncate">
                      {category.description}
                    </p>
                  </div>
                </div>
                {isChecked && (
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                )}
              </label>
            );
          })}
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground text-center">
        Not sure? Select it anyway — you can skip any question later.
      </p>
    </QuestionLayout>
  );
}
