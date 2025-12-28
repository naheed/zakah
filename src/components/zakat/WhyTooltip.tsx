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
        "touch-manipulation",
        className
      )}
      aria-label={title || "Why?"}
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

  // Use Tooltip on desktop
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent side="top" className="p-3">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Pre-defined fiqh explanations for common fields
export const fiqhExplanations = {
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
