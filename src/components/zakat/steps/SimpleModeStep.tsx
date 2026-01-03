import { ZakatFormData, formatCurrency } from "@/lib/zakatCalculations";
import { CurrencyInput } from "../CurrencyInput";
import { motion } from "framer-motion";
import { Wallet, TrendUp, Diamond, CreditCard } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface SimpleModeStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
  questionNumber?: number;
}

const simpleSections = [
  {
    id: 'cash',
    icon: Wallet,
    title: 'Cash & Savings',
    description: 'Bank accounts, cash on hand, digital wallets',
    fields: ['checkingAccounts', 'savingsAccounts', 'cashOnHand', 'digitalWallets'] as const,
  },
  {
    id: 'investments',
    icon: TrendUp,
    title: 'Investments & Retirement',
    description: 'Stocks, 401(k), IRA, crypto',
    fields: ['activeInvestments', 'passiveInvestmentsValue', 'fourOhOneKVestedBalance', 'traditionalIRABalance', 'rothIRAContributions', 'cryptoCurrency'] as const,
  },
  {
    id: 'gold',
    icon: Diamond,
    title: 'Gold & Silver',
    description: 'Jewelry, bullion, coins (melt value)',
    fields: ['goldValue', 'silverValue'] as const,
  },
  {
    id: 'debts',
    icon: CreditCard,
    title: 'Money You Owe',
    description: 'Credit cards, bills, loans due now',
    fields: ['creditCardBalance', 'unpaidBills', 'monthlyLivingExpenses'] as const,
    isLiability: true,
  },
];

export function SimpleModeStep({ data, updateData, questionNumber }: SimpleModeStepProps) {
  // Calculate totals for each section
  const getSectionTotal = (fields: readonly (keyof ZakatFormData)[]) => {
    return fields.reduce((sum, field) => sum + (Number(data[field]) || 0), 0);
  };
  
  // For simple mode, we'll use combined totals
  const handleSectionChange = (sectionId: string, value: number) => {
    const section = simpleSections.find(s => s.id === sectionId);
    if (!section) return;
    
    // Distribute to the first field in the section (simple approach)
    const primaryField = section.fields[0];
    updateData({ [primaryField]: value });
    
    // Clear other fields in the section
    const otherFields = section.fields.slice(1);
    const clearUpdates: Partial<ZakatFormData> = {};
    otherFields.forEach(field => {
      clearUpdates[field] = 0;
    });
    if (Object.keys(clearUpdates).length > 0) {
      updateData(clearUpdates);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-3">
        {questionNumber && (
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {questionNumber}
          </span>
        )}
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Quick Zakat Calculation
        </h2>
        <p className="text-muted-foreground">
          Enter your approximate totals for each category.
        </p>
      </div>
      
      {/* Simple Input Cards */}
      <div className="space-y-4">
        {simpleSections.map((section, index) => {
          const total = getSectionTotal(section.fields);
          const Icon = section.icon;
          
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "p-4 rounded-xl border transition-colors",
                section.isLiability 
                  ? "bg-destructive/5 border-destructive/20" 
                  : "bg-card border-border"
              )}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  section.isLiability ? "bg-destructive/10" : "bg-primary/10"
                )}>
                  <Icon 
                    weight="duotone" 
                    className={cn(
                      "w-5 h-5",
                      section.isLiability ? "text-destructive" : "text-primary"
                    )} 
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{section.title}</h3>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </div>
              </div>
              
              <CurrencyInput
                label={section.isLiability ? "Total Debts Due Now" : `Total ${section.title}`}
                value={total}
                onChange={(value) => handleSectionChange(section.id, value)}
                className="mt-2"
              />
            </motion.div>
          );
        })}
      </div>
      
      {/* Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="p-4 rounded-xl bg-surface-container-low border border-border"
      >
        <p className="text-sm text-muted-foreground mb-2">Estimated Net Zakatable Wealth</p>
        <p className="text-2xl font-semibold text-foreground">
          {formatCurrency(
            getSectionTotal(simpleSections[0].fields) +
            getSectionTotal(simpleSections[1].fields) +
            getSectionTotal(simpleSections[2].fields) -
            getSectionTotal(simpleSections[3].fields),
            data.currency
          )}
        </p>
      </motion.div>
    </div>
  );
}
