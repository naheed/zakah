import {
    Wallet,
    ChartLineUp,
    CurrencyBtc,
    Bank,
    Briefcase,
    House,
    ShieldCheck,
    CoinVertical,
    DotsThreeOutline,
    CheckCircle,
    Warning
} from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AssetAccount, AccountType } from "@/types/assets";
import { formatCurrency } from "@/lib/zakatCalculations";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { getInstitutionLogoUrl, getInstitutionDisplayName } from "@/lib/institutionLogos";
import { content as c } from "@/content";

interface AccountCardProps {
    account: AssetAccount;
    latestValue?: number;
    lastUpdated?: string;
    onClick?: () => void;
    compact?: boolean;
}

// Icon mapping for account types
const accountTypeIcons: Record<AccountType, React.ReactNode> = {
    CHECKING: <Bank className="w-5 h-5" weight="duotone" />,
    SAVINGS: <Wallet className="w-5 h-5" weight="duotone" />,
    BROKERAGE: <ChartLineUp className="w-5 h-5" weight="duotone" />,
    RETIREMENT_401K: <ShieldCheck className="w-5 h-5" weight="duotone" />,
    RETIREMENT_IRA: <ShieldCheck className="w-5 h-5" weight="duotone" />,
    ROTH_IRA: <ShieldCheck className="w-5 h-5" weight="duotone" />,
    CRYPTO_WALLET: <CurrencyBtc className="w-5 h-5" weight="duotone" />,
    REAL_ESTATE: <House className="w-5 h-5" weight="duotone" />,
    TRUST: <Briefcase className="w-5 h-5" weight="duotone" />,
    METALS: <CoinVertical className="w-5 h-5" weight="duotone" />,
    BUSINESS: <Briefcase className="w-5 h-5" weight="duotone" />,
    OTHER: <DotsThreeOutline className="w-5 h-5" weight="duotone" />,
};

// Badge colors for account types (subtle)
const accountTypeBadgeColors: Record<AccountType, string> = {
    CHECKING: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    SAVINGS: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    BROKERAGE: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    RETIREMENT_401K: "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
    RETIREMENT_IRA: "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
    ROTH_IRA: "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
    CRYPTO_WALLET: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
    REAL_ESTATE: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    TRUST: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
    METALS: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
    BUSINESS: "bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    OTHER: "bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

// Human readable account type names - now sourced from content system
const accountTypeLabels = c.assets.accountTypeLabels;

/**
 * AccountCard - Material 3 Expressive "Hero Balance" Layout
 * 
 * Structure:
 * ┌─────────────────────────────────────┐
 * │ [Logo] Institution Name     [Type] │  ← Header
 * │                                     │
 * │         $123,456.78                 │  ← Hero Balance
 * │                                     │
 * │ Account Name              [Fresh ●] │  ← Footer
 * └─────────────────────────────────────┘
 */
export function AccountCard({ account, latestValue, lastUpdated, onClick, compact }: AccountCardProps) {
    const icon = accountTypeIcons[account.type] || accountTypeIcons.OTHER;
    const badgeColor = accountTypeBadgeColors[account.type] || accountTypeBadgeColors.OTHER;
    const typeLabel = accountTypeLabels[account.type] || "Account";
    const logoUrl = getInstitutionLogoUrl(account.institution_name);
    const displayInstitution = getInstitutionDisplayName(account.institution_name);

    // Calculate freshness
    const daysSinceUpdate = lastUpdated
        ? Math.floor((Date.now() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60 * 24))
        : null;

    const isFresh = daysSinceUpdate !== null && daysSinceUpdate <= 30;
    const isStale = daysSinceUpdate !== null && daysSinceUpdate > 30;
    const isVeryStale = daysSinceUpdate !== null && daysSinceUpdate > 90;

    // Compact version for dashboard preview
    if (compact) {
        return (
            <Link to={`/assets/${account.id}`}>
                <Card className="cursor-pointer hover:shadow-md transition-all group h-full">
                    <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0 border border-border">
                                {logoUrl ? (
                                    <img
                                        src={logoUrl}
                                        alt={displayInstitution}
                                        className="w-full h-full object-contain p-0.5"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                                        }}
                                    />
                                ) : null}
                                <div className={`fallback-icon flex items-center justify-center w-full h-full text-muted-foreground ${logoUrl ? 'hidden' : ''}`}>
                                    {icon}
                                </div>
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="font-medium text-sm text-foreground truncate">{account.name}</h3>
                                <p className="text-xs text-muted-foreground truncate">{displayInstitution}</p>
                            </div>
                        </div>
                        {latestValue !== undefined && (
                            <p className="text-lg font-bold text-foreground">
                                {formatCurrency(latestValue, 'USD')}
                            </p>
                        )}
                    </CardContent>
                </Card>
            </Link>
        );
    }

    // Full "Hero Balance" layout
    return (
        <Card
            className={cn(
                "cursor-pointer hover:shadow-lg transition-all group min-h-[140px]",
                isVeryStale && "border-destructive/50",
                isStale && !isVeryStale && "border-amber-400/50"
            )}
            onClick={onClick}
        >
            <CardContent className="p-4 h-full flex flex-col">
                {/* Header: Logo + Institution + Type Badge */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        {/* Logo/Icon */}
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0 border border-border group-hover:border-primary/30 transition-colors">
                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt={displayInstitution}
                                    className="w-full h-full object-contain p-0.5"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                                    }}
                                />
                            ) : null}
                            <div className={`fallback-icon flex items-center justify-center w-full h-full text-muted-foreground group-hover:text-primary transition-colors ${logoUrl ? 'hidden' : ''}`}>
                                {icon}
                            </div>
                        </div>
                        {/* Institution Name */}
                        <span className="text-sm font-medium text-muted-foreground truncate">
                            {displayInstitution}
                        </span>
                    </div>
                    {/* Type Badge */}
                    <Badge variant="secondary" className={cn("text-[10px] px-2 py-0.5 shrink-0", badgeColor)}>
                        {typeLabel}
                    </Badge>
                </div>

                {/* Hero: Balance (centered, prominent) */}
                <div className="flex-1 flex items-center justify-center py-3">
                    <p className="text-3xl font-bold text-foreground tracking-tight">
                        {latestValue !== undefined ? formatCurrency(latestValue, 'USD') : '—'}
                    </p>
                </div>

                {/* Footer: Account Name + Freshness */}
                <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-foreground truncate flex-1 font-medium">
                        {account.name}
                    </p>
                    {/* Freshness Indicator */}
                    {daysSinceUpdate !== null && (
                        <div className={cn(
                            "flex items-center gap-1 text-[10px] shrink-0",
                            isFresh && "text-primary",
                            isStale && !isVeryStale && "text-amber-600 dark:text-amber-400",
                            isVeryStale && "text-destructive"
                        )}>
                            {isFresh ? (
                                <CheckCircle weight="fill" className="w-3 h-3" />
                            ) : (
                                <Warning weight="fill" className="w-3 h-3" />
                            )}
                            <span>
                                {daysSinceUpdate === 0 ? c.assets.freshness.today :
                                    daysSinceUpdate === 1 ? c.assets.freshness.yesterday :
                                        c.assets.freshness.daysAgo(daysSinceUpdate)}
                            </span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export { accountTypeLabels, accountTypeIcons };
