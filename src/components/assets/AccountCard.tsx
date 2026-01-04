import {
    Wallet,
    CurrencyDollar,
    ChartLineUp,
    CurrencyBtc,
    Bank,
    Briefcase,
    House,
    ShieldCheck,
    CoinVertical,
    DotsThreeOutline
} from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AssetAccount, AccountType } from "@/types/assets";
import { formatCurrency } from "@/lib/zakatCalculations";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface AccountCardProps {
    account: AssetAccount;
    latestValue?: number;
    lastUpdated?: string;
    onClick?: () => void;
    compact?: boolean;  // Smaller version for dashboard preview
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

// Badge colors for account types
const accountTypeBadgeColors: Record<AccountType, string> = {
    CHECKING: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    SAVINGS: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    BROKERAGE: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    RETIREMENT_401K: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    RETIREMENT_IRA: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    ROTH_IRA: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    CRYPTO_WALLET: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    REAL_ESTATE: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    TRUST: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    METALS: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    BUSINESS: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
    OTHER: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
};

// Human readable account type names
const accountTypeLabels: Record<AccountType, string> = {
    CHECKING: "Checking",
    SAVINGS: "Savings",
    BROKERAGE: "Brokerage",
    RETIREMENT_401K: "401(k)",
    RETIREMENT_IRA: "IRA",
    ROTH_IRA: "Roth IRA",
    CRYPTO_WALLET: "Crypto",
    REAL_ESTATE: "Real Estate",
    TRUST: "Trust",
    METALS: "Precious Metals",
    BUSINESS: "Business",
    OTHER: "Other",
};

// Helper to get logo URL
function getInstitutionLogo(name: string): string | null {
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const n = normalize(name);

    const domainMap: Record<string, string> = {
        'charlesschwab': 'schwab.com',
        'schwab': 'schwab.com',
        'fidelity': 'fidelity.com',
        'vanguard': 'vanguard.com',
        'chase': 'chase.com',
        'jpmorgan': 'jpmorgan.com',
        'bankofamerica': 'bankofamerica.com',
        'wellsfargo': 'wellsfargo.com',
        'citibank': 'citi.com',
        'citi': 'citi.com',
        'coinbase': 'coinbase.com',
        'robinhood': 'robinhood.com',
        'etrade': 'etrade.com',
        'morganstanley': 'morganstanley.com',
        'betterment': 'betterment.com',
        'wealthfront': 'wealthfront.com',
        'sofi': 'sofi.com',
        'ally': 'ally.com',
        'allybank': 'ally.com',
        'amex': 'americanexpress.com',
        'americanexpress': 'americanexpress.com',
        'discover': 'discover.com',
        'capitalone': 'capitalone.com',
    };

    for (const key in domainMap) {
        if (n.includes(key)) return `https://logo.clearbit.com/${domainMap[key]}`;
    }

    return null;
}

export function AccountCard({ account, latestValue, lastUpdated, onClick, compact }: AccountCardProps) {
    const icon = accountTypeIcons[account.type] || accountTypeIcons.OTHER;
    const badgeColor = accountTypeBadgeColors[account.type] || accountTypeBadgeColors.OTHER;
    const typeLabel = accountTypeLabels[account.type] || account.type;
    const logoUrl = getInstitutionLogo(account.institution_name);

    // Calculate days since last update
    const daysSinceUpdate = lastUpdated
        ? Math.floor((Date.now() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60 * 24))
        : null;

    const isStale = daysSinceUpdate !== null && daysSinceUpdate > 30;

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
                                        alt={account.institution_name}
                                        className="w-full h-full object-contain p-0.5 bg-white"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.parentElement?.querySelector('.fallback-icon-compact')?.classList.remove('hidden');
                                        }}
                                    />
                                ) : null}
                                <div className={`fallback-icon-compact flex items-center justify-center w-full h-full text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors ${logoUrl ? 'hidden' : ''}`}>
                                    {icon}
                                </div>
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="font-medium text-sm text-foreground truncate">{account.name}</h3>
                                <p className="text-xs text-muted-foreground truncate">{account.institution_name}</p>
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

    return (
        <Card
            className={cn(
                "cursor-pointer hover:shadow-md transition-all group",
                isStale && "border-amber-200 dark:border-amber-800"
            )}
            onClick={onClick}
        >
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    {/* Icon and Institution */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0 border border-border">
                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt={account.institution_name}
                                    className="w-full h-full object-contain p-1 bg-white"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                                    }}
                                />
                            ) : null}
                            <div className={`fallback-icon flex items-center justify-center w-full h-full text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors ${logoUrl ? 'hidden' : ''}`}>
                                {icon}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">{account.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                {account.institution_name}
                                {account.mask && (
                                    <span className="text-muted-foreground/70 text-xs bg-muted px-1.5 rounded-sm">
                                        ...{account.mask}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Account Type Badge */}
                    <Badge variant="secondary" className={cn("text-xs", badgeColor)}>
                        {typeLabel}
                    </Badge>
                </div>

                {/* Value and Last Updated */}
                <div className="mt-4 flex items-end justify-between">
                    <div>
                        <p className="text-2xl font-bold text-foreground">
                            {latestValue !== undefined ? formatCurrency(latestValue, 'USD') : '—'}
                        </p>
                        {lastUpdated && (
                            <p className={cn(
                                "text-xs mt-1",
                                isStale ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
                            )}>
                                {isStale ? "⚠️ " : ""}
                                Updated {daysSinceUpdate === 0
                                    ? "today"
                                    : daysSinceUpdate === 1
                                        ? "yesterday"
                                        : `${daysSinceUpdate} days ago`}
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export { accountTypeLabels, accountTypeIcons };
