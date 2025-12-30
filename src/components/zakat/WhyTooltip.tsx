import { Question } from "@phosphor-icons/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

interface WhyTooltipProps {
  title?: string;
  explanation: string;
  className?: string;
}

/**
 * WhyTooltip - Inline fiqh explanation component
 * Shows a "?" icon that reveals scholarly reasoning on hover/tap
 * Uses Tooltip on desktop, Popover on mobile for better touch UX
 */
export function WhyTooltip({ title, explanation, className }: WhyTooltipProps) {
  const isMobile = useIsMobile();

  const content = (
    <div className="space-y-1.5 max-w-[280px]">
      {title && <p className="font-medium text-foreground text-sm">{title}</p>}
      <p className="text-sm text-muted-foreground leading-relaxed">{explanation}</p>
    </div>
  );

  const trigger = (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center w-5 h-5 rounded-full",
        "bg-primary/10 hover:bg-primary/20 transition-colors",
        "text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "touch-manipulation pointer-events-auto",
        className
      )}
      aria-label={title || "Why?"}
      onClick={(e) => e.stopPropagation()}
    >
      <Question weight="bold" className="w-3 h-3" />
    </button>
  );

  // Use Popover on mobile for better touch experience
  if (isMobile) {
    return (
      <Popover>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent side="top" className="w-auto p-3">
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  // Use Tooltip on desktop with Portal for proper layering
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipPrimitive.Portal>
          <TooltipContent side="top" className="p-3 pointer-events-auto">
            {content}
          </TooltipContent>
        </TooltipPrimitive.Portal>
      </Tooltip>
    </TooltipProvider>
  );
}

// Pre-defined fiqh explanations for common fields
export const fiqhExplanations = {
  // Calculation Modes
  calculationModes: {
    title: "Three approaches to Zakat calculation",
    explanation: "Conservative uses full asset values. Optimized deducts taxes/penalties. Bradford Exclusion Rule fully exempts Traditional 401(k)/IRA under 59½ per Sheikh Joe Bradford's ruling on milk tām (complete ownership).",
  },
  bradfordExclusion: {
    title: "Bradford Exclusion Rule",
    explanation: "Traditional 401(k)/IRA accounts under 59½ lack milk tām (complete ownership) and qudrah 'ala al-tasarruf (ability to dispose). The 10% penalty plus taxes create a legal barrier similar to māl ḍimār (inaccessible wealth).",
  },
  
  // Liquid Assets
  checkingAccounts: {
    title: "Why is cash zakatable?",
    explanation: "Fiat currency takes the ruling of gold and silver as a store of value. The full closing balance is zakatable.",
  },
  interestEarned: {
    title: "Why purify interest?",
    explanation: "Interest (riba) is impure money that does not belong to you. It must be donated to charity without reward expectation.",
  },
  
  // Investments
  activeInvestments: {
    title: "Why 100% for trading stocks?",
    explanation: "Stocks held for short-term capital gain are commercial merchandise (urud al-tijarah). Zakat is due on full market value.",
  },
  passiveInvestments: {
    title: "Why the 30% rule?",
    explanation: "For long-term holdings, Zakat shifts to the company's zakatable assets. Research shows ~30% of market cap is liquid/zakatable (AAOIFI Standard 35).",
  },
  
  // Retirement
  retirementAccounts: {
    title: "Why deduct taxes & penalties?",
    explanation: "The accessible balance method: only pay Zakat on what you could actually access. Taxes and early withdrawal penalties reduce your actual ownership.",
  },
  rothIRA: {
    title: "Roth IRA treatment",
    explanation: "Contributions can be withdrawn tax-free anytime (fully zakatable). Earnings are subject to penalty if under 59½, treated like 401(k).",
  },
  
  // Precious Metals
  goldSilver: {
    title: "Why melt value only?",
    explanation: "Zakat is due on the metal content only. Gemstones and craftsmanship are not zakatable unless the jewelry is trade inventory.",
  },
  jewelryExemption: {
    title: "The jewelry debate",
    explanation: "Majority view: worn jewelry is exempt (like clothing). Hanafi view: gold/silver are inherently zakatable. Both are valid.",
  },
  
  // Liabilities
  deductibleDebts: {
    title: "Which debts are deductible?",
    explanation: "Only immediate debts reduce zakatable wealth: bills due now, credit cards, 12 months of mortgage (AMJA opinion). Long-term debt is not fully deductible.",
  },
  monthlyLiving: {
    title: "Why one month's expenses?",
    explanation: "Immediate living expenses (rent, food, utilities) are basic needs exempt from Zakat. Only the current month's obligations are deductible.",
  },
  mortgageDeduction: {
    title: "Why 12 months of mortgage?",
    explanation: "AMJA ruling: Only the next 12 installments are deductible, not the full mortgage balance. This balances debt relief with Zakat obligations.",
  },
  studentLoans: {
    title: "Why only current payment?",
    explanation: "Like mortgages, only the installment due now is deductible. Future payments aren't yet owed and don't reduce current wealth.",
  },
  
  // Crypto
  cryptoCurrency: {
    title: "Why is crypto zakatable?",
    explanation: "Major cryptocurrencies function as currency/store of value, taking the ruling of gold and silver (medium of exchange). Full market value is zakatable.",
  },
  cryptoTrading: {
    title: "Trading vs. holding crypto",
    explanation: "Actively traded tokens are commercial goods (urud al-tijarah). Even NFTs held for flipping are zakatable at full value.",
  },
  stakedAssets: {
    title: "Staking and Zakat",
    explanation: "Your staked principal remains your wealth and is fully zakatable. Locked staking doesn't affect ownership, only accessibility.",
  },
  defiLiquidity: {
    title: "DeFi liquidity pools",
    explanation: "LP tokens represent redeemable value. Calculate based on what you could withdraw now, even if subject to impermanent loss.",
  },
  
  // Trusts
  revocableTrust: {
    title: "Why revocable = zakatable?",
    explanation: "You retain full control and can dissolve the trust anytime. Legally and Islamically, the assets remain yours (Milk Tam - complete ownership).",
  },
  irrevocableTrust: {
    title: "Why control matters?",
    explanation: "Zakat requires Milk Tam (complete possession). If you irrevocably transferred assets and can't access principal, you lack this requirement.",
  },
  clatTrust: {
    title: "CLAT treatment",
    explanation: "During the annuity term, the charity owns the income stream (usufruct). The remainder interest is contingent until the term ends.",
  },
  
  // Retirement - additional
  hsaAccount: {
    title: "Why is HSA zakatable?",
    explanation: "HSA funds are fully yours and accessible for medical expenses at any time. No penalties for qualified medical use makes it complete ownership.",
  },
  
  // Nisab
  silverNisab: {
    title: "Why silver standard?",
    explanation: "Silver captures more Muslims in the obligation (most beneficial for the poor). Gold standard is valid for those holding wealth exclusively in gold.",
  },
  
  // Calendar
  lunarYear: {
    title: "Why adjust for solar year?",
    explanation: "The solar year is 11 days longer. Rate is adjusted to 2.577% to prevent shortchanging recipients over a lifetime.",
  },
};
