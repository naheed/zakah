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
  // ==========================================================================
  // CORE LEGAL PRINCIPLES (New in Phase 3)
  // ==========================================================================
  milkTam: {
    title: "Milk Tām (Complete Ownership)",
    explanation: "Full, unrestricted ownership with legal title (raqabah) and ability to dispose (yad). Required for Zakat liability on any asset.",
  },
  qudrahTasarruf: {
    title: "Qudrah 'ala al-Tasarruf",
    explanation: "The legal and practical ability to dispose of wealth freely. Without this capacity, wealth may be exempt from Zakat.",
  },
  malDimar: {
    title: "Māl Ḍimār (Inaccessible Wealth)",
    explanation: "Wealth that is out of hand and may not return—like seized property or contested inheritance. Classical exemption applies.",
  },
  nama: {
    title: "Namā' (Growth Potential)",
    explanation: "Assets must have potential for growth to be zakatable. Personal items like furniture lack namā' and are exempt.",
  },

  // ==========================================================================
  // CALCULATION MODES - 4 Fiqh-Based Methodologies
  // ==========================================================================
  calculationModes: {
    title: "ZakatFlow Methodology",
    explanation: "We follow Sheikh Joe Bradford's balanced approach: 30% for passive investments, retirement accounts exempt under 59½, jewelry exempt (majority view), and 12-month debt deduction.",
  },
  bradfordExclusion: {
    title: "Bradford Exclusion Rule",
    explanation: "Traditional 401(k)/IRA under 59½ lack milk tām and qudrah 'ala al-tasarruf. The 10% penalty plus taxes create a barrier similar to māl ḍimār.",
  },

  // ==========================================================================
  // LIQUID ASSETS
  // ==========================================================================
  checkingAccounts: {
    title: "Why is cash zakatable?",
    explanation: "Fiat currency takes the ruling of gold and silver as a store of value. The full closing balance is zakatable.",
  },
  interestEarned: {
    title: "Why purify interest?",
    explanation: "Interest (riba) is impure money that does not belong to you. It must be donated to charity without reward expectation.",
  },

  // ==========================================================================
  // INVESTMENTS (Updated with Mudir/Muhtakir)
  // ==========================================================================
  activeInvestments: {
    title: "Mudir (Active Trader)",
    explanation: "One who trades frequently with short-term intent. Stocks are commercial merchandise (ʿurūḍ al-tijārah)—100% of market value is zakatable.",
  },
  passiveInvestments: {
    title: "Muḥtakir (Long-Term Investor)",
    explanation: "One who holds for appreciation/dividends. Zakat shifts to the company's zakatable assets—approximately 30% of market value (AAOIFI Standard 35).",
  },
  thirtyPercentRule: {
    title: "The 30% Rule Derivation",
    explanation: "Research on Shariah-compliant indices shows ~30% of market cap consists of liquid/zakatable assets. This proxy gives an effective rate of 0.75%.",
  },

  // ==========================================================================
  // RETIREMENT (Enhanced for Bradford Rule)
  // ==========================================================================
  retirementAccounts: {
    title: "Retirement Account Approach",
    explanation: "Traditional 401(k)/IRA under 59½ are exempt (lack complete ownership per Sheikh Bradford). Roth contributions are always zakatable. HSA is fully zakatable.",
  },
  rothIRA: {
    title: "Roth IRA Treatment",
    explanation: "Contributions: accessible tax-free anytime, fully zakatable. Earnings: subject to penalty under 59½, exempt until you reach that age.",
  },
  rothContributions: {
    title: "Roth Contributions (Principal)",
    explanation: "Your after-tax contributions can be withdrawn anytime without penalty. This represents complete ownership—fully zakatable regardless of mode.",
  },
  rothEarnings: {
    title: "Roth Earnings (Growth)",
    explanation: "Investment gains are subject to 10% penalty plus taxes if withdrawn before 59½. Bradford mode exempts these; Optimized deducts penalties.",
  },
  traditional401k: {
    title: "Traditional 401(k)/403(b)",
    explanation: "Pre-tax contributions with 10% penalty plus income tax on early withdrawal. Bradford mode: fully exempt under 59½. Optimized: after-penalty value.",
  },
  hsaAccount: {
    title: "Why is HSA zakatable?",
    explanation: "HSA funds are fully yours and accessible for qualified medical expenses at any time. Complete ownership (milk tām) applies.",
  },

  // ==========================================================================
  // PRECIOUS METALS
  // ==========================================================================
  goldSilver: {
    title: "Why melt value only?",
    explanation: "Zakat is due on the metal content only. Gemstones and craftsmanship are not zakatable unless the jewelry is trade inventory.",
  },
  jewelryExemption: {
    title: "The jewelry debate",
    explanation: "Majority view: worn jewelry is exempt (like clothing). Hanafi view: gold/silver are inherently zakatable. Both are valid scholarly positions.",
  },

  // ==========================================================================
  // LIABILITIES (Enhanced with Maliki framing)
  // ==========================================================================
  deductibleDebts: {
    title: "The Maliki Middle Path",
    explanation: "Only immediate debts reduce zakatable wealth: current bills, credit cards, 12 months of installments. This avoids the extremes of full deduction or no deduction.",
  },
  daynMustaghriq: {
    title: "Dayn al-Mustaghriq",
    explanation: "Overwhelming debt that consumes all assets. Classical scholars debated whether this eliminates Zakat—the modern synthesis limits deduction to current obligations.",
  },
  monthlyLiving: {
    title: "We multiply by 12",
    explanation: "Enter your monthly amount only. We automatically annualize it (×12) since living expenses are an ongoing 12-month obligation. Don't multiply yourself—just enter one month.",
  },
  mortgageDeduction: {
    title: "Why 12 months of mortgage?",
    explanation: "AMJA ruling: Only the next 12 installments are deductible, not the full balance. This balances debt relief with Zakat obligations to the poor.",
  },
  studentLoans: {
    title: "Why only current payment?",
    explanation: "Like mortgages, only the installment due now is deductible. Future payments are not yet owed and do not reduce current wealth.",
  },

  // ==========================================================================
  // CRYPTO
  // ==========================================================================
  cryptoCurrency: {
    title: "Why is crypto zakatable?",
    explanation: "Major cryptocurrencies function as currency/store of value, taking the ruling of gold and silver (medium of exchange). Full market value is zakatable.",
  },
  cryptoTrading: {
    title: "Trading vs. holding crypto",
    explanation: "Actively traded tokens are commercial goods (ʿurūḍ al-tijārah). Even NFTs held for flipping are zakatable at full value.",
  },
  stakedAssets: {
    title: "Staking and Zakat",
    explanation: "Your staked principal remains your wealth and is fully zakatable. Locked staking affects accessibility, not ownership.",
  },
  defiLiquidity: {
    title: "DeFi liquidity pools",
    explanation: "LP tokens represent redeemable value. Calculate based on what you could withdraw now, accounting for impermanent loss.",
  },

  // ==========================================================================
  // TRUSTS
  // ==========================================================================
  revocableTrust: {
    title: "Why revocable = zakatable?",
    explanation: "You retain full control (milk tām) and can dissolve the trust anytime. The assets remain yours legally and Islamically.",
  },
  irrevocableTrust: {
    title: "Why control matters?",
    explanation: "Zakat requires milk tām (complete possession). If you irrevocably transferred assets and cannot access principal, you lack this requirement.",
  },
  clatTrust: {
    title: "CLAT treatment",
    explanation: "During the annuity term, the charity owns the income stream (usufruct). The remainder interest is contingent until the term ends.",
  },

  // ==========================================================================
  // NISAB & CALENDAR
  // ==========================================================================
  silverNisab: {
    title: "Why silver standard?",
    explanation: "Silver captures more Muslims in the obligation (anfa' li'l-fuqarā'—most beneficial for the poor). Gold standard is valid for those holding wealth exclusively in gold.",
  },
  lunarYear: {
    title: "Why adjust for solar year?",
    explanation: "The solar year is 11 days longer. Rate is adjusted to 2.577% to prevent shortchanging recipients over a lifetime.",
  },
};
