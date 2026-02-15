import { formatCurrency, formatPercent, EnhancedAssetBreakdown, AssetCategory } from "@/lib/zakatCalculations";
import type { IconProps } from "@phosphor-icons/react";
import {
    Wallet, TrendUp, PiggyBank, Coins, CurrencyBtc,
    HouseLine, Storefront, HandCoins, Scroll, TreasureChest
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface ReportAssetTableProps {
    enhancedBreakdown: EnhancedAssetBreakdown;
    currency: string;
}

// Icon mapping
const getAssetIcon = (key: string) => {
    switch (key) {
        case 'liquidAssets': return Wallet;
        case 'investments': return TrendUp;
        case 'retirement': return PiggyBank;
        case 'preciousMetals': return Coins;
        case 'crypto': return CurrencyBtc;
        case 'realEstate': return HouseLine;
        case 'business': return Storefront;
        case 'debtOwedToYou': return HandCoins;
        case 'trusts': return Scroll;
        case 'illiquidAssets': return TreasureChest;
        default: return Wallet;
    }
};

// Ruling Text Helper
const getRulingText = (key: string, cat: AssetCategory) => {
    if (cat.zakatablePercent === 1) return "Fully accessible/zakatable";
    if (cat.zakatablePercent === 0) return "Exempt below threshold";

    switch (key) {
        case 'investments': return "Split Strategy (30% Passive Rule)";
        case 'retirement': return "Taxed on Vested Balance";
        case 'trusts': return "Revocable/Accessible portion";
        default: return `${formatPercent(cat.zakatablePercent)} Weighted`;
    }
};

export function ReportAssetTable({ enhancedBreakdown, currency }: ReportAssetTableProps) {
    const assetKeys = [
        'liquidAssets', 'investments', 'retirement', 'preciousMetals',
        'crypto', 'realEstate', 'business', 'debtOwedToYou', 'trusts'
    ] as const;

    const rows = assetKeys.map(key => {
        const cat = enhancedBreakdown[key as keyof EnhancedAssetBreakdown] as AssetCategory;
        if (!cat) return null;
        return { key, cat, Icon: getAssetIcon(key), ruling: getRulingText(key, cat) };
    }).filter((item): item is { key: typeof assetKeys[number], cat: AssetCategory, Icon: React.ComponentType<IconProps>, ruling: string } =>
        item !== null && item.cat && item.cat.total > 0
    );

    return (
        <section className="flex-grow mt-8">
            <div className="flex items-end justify-between mb-4">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">
                    Portfolio Composition
                </h3>
                <span className="text-xs text-muted-foreground">Values rounded for clarity</span>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block text-sm border border-border rounded-xl overflow-hidden bg-white dark:bg-card">
                <table className="w-full">
                    <thead className="bg-muted/30 text-[10px] text-muted-foreground uppercase font-bold tracking-wider border-b border-border">
                        <tr>
                            <th className="px-4 py-3 text-left w-5/12 font-semibold">Asset Class</th>
                            <th className="px-4 py-3 text-right w-2/12 font-semibold">Gross Value</th>
                            <th className="px-2 py-3 text-center w-2/12 font-semibold">Zakat Weight</th>
                            <th className="px-4 py-3 text-right w-3/12 font-semibold">Zakatable Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {rows.flatMap(({ key, cat, Icon, ruling }) => {
                            if (key === 'preciousMetals' && cat.items && cat.items.length > 0) {
                                return cat.items.map((item, idx) => (
                                    <tr key={`${key}-${idx}`} className="hover:bg-muted/5 transition-colors">
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted text-muted-foreground">
                                                    <Icon weight="duotone" className="text-lg" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-foreground">{item.name}</div>
                                                    <div className="text-[11px] text-muted-foreground mt-0.5">
                                                        {item.zakatablePercent === 1 ? 'Fully Zakatable' : item.zakatablePercent === 0 ? 'Exempt' : `${formatPercent(item.zakatablePercent ?? 0)} Zakatable`}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 text-right font-mono text-muted-foreground">
                                            {formatCurrency(item.value ?? 0, currency, 0)}
                                        </td>
                                        <td className="px-2 py-3.5 text-center">
                                            {item.zakatablePercent === 1 ? (
                                                <span className="font-bold text-muted-foreground text-xs">100%</span>
                                            ) : (
                                                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-bold">
                                                    {formatPercent(item.zakatablePercent ?? 0)}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5 text-right font-bold text-foreground">
                                            {formatCurrency(item.zakatableAmount ?? 0, currency, 0)}
                                        </td>
                                    </tr>
                                ));
                            }

                            return (
                                <tr key={key} className="hover:bg-muted/5 transition-colors">
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted text-muted-foreground">
                                                <Icon weight="duotone" className="text-lg" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-foreground">{cat.label}</div>
                                                <div className="text-[11px] text-muted-foreground mt-0.5">{ruling}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 text-right font-mono text-muted-foreground">
                                        {formatCurrency(cat.total, currency, 0)}
                                    </td>
                                    <td className="px-2 py-3.5 text-center">
                                        {cat.zakatablePercent === 1 ? (
                                            <span className="font-bold text-muted-foreground text-xs">100%</span>
                                        ) : (
                                            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-bold">
                                                {formatPercent(cat.zakatablePercent)}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3.5 text-right font-bold text-foreground">
                                        {formatCurrency(cat.zakatableAmount ?? 0, currency, 0)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {rows.flatMap(({ key, cat, Icon, ruling }) => {
                    if (key === 'preciousMetals' && cat.items && cat.items.length > 0) {
                        return cat.items.map((item, idx) => (
                            <div key={`${key}-${idx}`} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-4 shadow-sm">
                                {/* Header */}
                                <div className="flex items-center gap-3 border-b border-border/50 pb-3">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted text-muted-foreground">
                                        <Icon weight="duotone" className="text-xl" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-foreground text-base">{item.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {item.zakatablePercent === 1 ? 'Fully Zakatable' : item.zakatablePercent === 0 ? 'Exempt' : `${formatPercent(item.zakatablePercent ?? 0)} Zakatable`}
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-y-2 text-sm">
                                    <div className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Gross</div>
                                    <div className="text-right font-mono text-muted-foreground">{formatCurrency(item.value ?? 0, currency, 0)}</div>

                                    <div className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Weight</div>
                                    <div className="text-right">
                                        {item.zakatablePercent === 1 ? (
                                            <span className="font-bold text-muted-foreground text-xs">100%</span>
                                        ) : (
                                            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-bold">
                                                {formatPercent(item.zakatablePercent ?? 0)}
                                            </span>
                                        )}
                                    </div>

                                    <div className="col-span-2 border-t border-border/50 my-1"></div>

                                    <div className="text-right font-bold text-primary text-base">
                                        {formatCurrency(item.zakatableAmount ?? 0, currency, 0)}
                                    </div>
                                </div>
                            </div>
                        ));
                    }

                    return (
                        <div key={key} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-4 shadow-sm">
                            {/* Header */}
                            <div className="flex items-center gap-3 border-b border-border/50 pb-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted text-muted-foreground">
                                    <Icon weight="duotone" className="text-xl" />
                                </div>
                                <div>
                                    <div className="font-bold text-foreground text-base">{cat.label}</div>
                                    <div className="text-xs text-muted-foreground">{ruling}</div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                                <div className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Gross</div>
                                <div className="text-right font-mono text-muted-foreground">{formatCurrency(cat.total, currency, 0)}</div>

                                <div className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Weight</div>
                                <div className="text-right">
                                    {cat.zakatablePercent === 1 ? (
                                        <span className="font-bold text-muted-foreground text-xs">100%</span>
                                    ) : (
                                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-bold">
                                            {formatPercent(cat.zakatablePercent)}
                                        </span>
                                    )}
                                </div>

                                <div className="col-span-2 border-t border-border/50 my-1"></div>

                                <div className="text-foreground font-bold">Zakatable Portion</div>
                                <div className="text-right font-bold text-primary text-base">
                                    {formatCurrency(cat.zakatableAmount ?? 0, currency, 0)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {rows.length === 0 && (
                <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl">
                    No assets added.
                </div>
            )}
        </section>
    );
}
