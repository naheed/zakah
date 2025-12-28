import { ZakatFormData } from "@/lib/zakatCalculations";
import { categoriesContent } from "@/lib/zakatContent";
import { cn } from "@/lib/utils";
import { Check, Money, TrendUp, Bank, Diamond, CurrencyBtc, Scroll, Buildings, Storefront, PaintBrush, Handshake, Receipt, IconProps } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";

interface CategorySelectionStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
  questionNumber?: number;
}

const defaultCategories = [
  { icon: Money, label: 'Cash & Bank' },
  { icon: TrendUp, label: 'Investments' },
  { icon: Bank, label: 'Retirement' },
];

const optionalCategories: {
  id: keyof Pick<ZakatFormData, 'hasPreciousMetals' | 'hasCrypto' | 'hasTrusts' | 'hasRealEstate' | 'hasBusiness' | 'hasIlliquidAssets' | 'hasDebtOwedToYou' | 'hasTaxPayments'>;
  icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>;
  label: string;
  description: string;
}[] = [
  {
    id: 'hasPreciousMetals',
    icon: Diamond,
    label: 'Precious Metals',
    description: 'Gold, silver, or jewelry',
  },
  {
    id: 'hasCrypto',
    icon: CurrencyBtc,
    label: 'Cryptocurrency',
    description: 'Bitcoin, Ethereum, staking, DeFi',
  },
  {
    id: 'hasTrusts',
    icon: Scroll,
    label: 'Trusts & Estates',
    description: 'Revocable or irrevocable trusts',
  },
  {
    id: 'hasRealEstate',
    icon: Buildings,
    label: 'Investment Property',
    description: 'Real estate for sale or rental income',
  },
  {
    id: 'hasBusiness',
    icon: Storefront,
    label: 'Business Assets',
    description: 'Inventory, receivables, business cash',
  },
  {
    id: 'hasIlliquidAssets',
    icon: PaintBrush,
    label: 'Collectibles',
    description: 'Art, antiques, or livestock for sale',
  },
  {
    id: 'hasDebtOwedToYou',
    icon: Handshake,
    label: 'Money Owed',
    description: 'Personal loans you expect to collect',
  },
  {
    id: 'hasTaxPayments',
    icon: Receipt,
    label: 'Outstanding Taxes',
    description: 'Property tax or late payments due',
  },
];

// M3 spring animation config
const springConfig = { type: "spring" as const, stiffness: 400, damping: 25 };

export function CategorySelectionStep({ data, updateData, questionNumber }: CategorySelectionStepProps) {
  const selectedCount = optionalCategories.filter(cat => data[cat.id]).length;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="w-full max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-3">
          {questionNumber && (
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-medium">
              {questionNumber}
            </span>
          )}
          <h2 className="text-2xl font-serif font-semibold text-foreground">
            {categoriesContent.title}
          </h2>
          <p className="text-muted-foreground">
            {categoriesContent.subtitle}
          </p>
        </div>

        {/* Assist Chips - Always Included (Muted) */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            We'll always ask about
          </p>
          <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-surface-container-low">
            {defaultCategories.map((category) => (
              <div
                key={category.label}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container border border-border/50 text-sm text-muted-foreground"
              >
                <Check weight="bold" className="w-3.5 h-3.5 text-primary" />
                <category.icon weight="duotone" className="w-3.5 h-3.5" />
                <span>{category.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Chips - Optional Categories */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Do any of these apply?
            </p>
            <AnimatePresence>
              {selectedCount > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={springConfig}
                  className="text-xs font-medium bg-tertiary/15 text-tertiary px-2.5 py-1 rounded-full"
                >
                  {selectedCount} selected
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {optionalCategories.map((category, index) => {
              const isSelected = data[category.id];
              
              return (
                <Tooltip key={category.id}>
                  <TooltipTrigger asChild>
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...springConfig, delay: index * 0.03 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => updateData({ [category.id]: !isSelected })}
                      className={cn(
                        "relative flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-colors",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        // M3 State layers via hover/focus
                        isSelected
                          ? "bg-secondary border-secondary text-secondary-foreground"
                          : "bg-card border-border hover:bg-accent/50 hover:border-primary/30"
                      )}
                    >
                      {/* Icon */}
                      <category.icon 
                        weight={isSelected ? "fill" : "duotone"} 
                        className={cn(
                          "w-7 h-7",
                          isSelected ? "text-secondary-foreground" : "text-primary"
                        )} 
                      />
                      
                      {/* Label */}
                      <span className="text-xs font-medium leading-tight">
                        {category.label}
                      </span>
                      
                      {/* Selected checkmark */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={springConfig}
                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-tertiary flex items-center justify-center shadow-sm"
                          >
                            <Check weight="bold" className="w-3 h-3 text-tertiary-foreground" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-[200px] text-center">
                    <p>{category.description}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
        
        {/* Helper text */}
        <p className="text-sm text-muted-foreground text-center">
          Not sure? Select it anyway — you can skip any question later.
        </p>
      </div>
    </TooltipProvider>
  );
}
