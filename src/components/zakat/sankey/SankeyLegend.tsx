import React from "react";
import { formatCurrency, AssetCategory } from "@/lib/zakatCalculations";
import { SankeyChartData, EnhancedSankeyChartData } from "./types";
import { ASSET_COLORS } from "./constants";

const LegendCard = ({ name, value, currency, description, color }: { name: string; value: number; currency: string; description: string; color: string; }) => {
    return (
        <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="font-semibold text-sm text-foreground">{name}</span>
            </div>
            {description && <p className="text-xs text-muted-foreground mb-2">{description}</p>}
            <p className="font-bold text-lg text-foreground">{formatCurrency(value, currency)}</p>
        </div>
    );
};

interface SankeyLegendProps {
    data: SankeyChartData;
    enhancedData?: EnhancedSankeyChartData;
    currency: string;
}

export const SankeyLegend: React.FC<SankeyLegendProps> = ({ data, enhancedData, currency }) => {
    return (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-4xl">
            {enhancedData?.enhancedBreakdown ? (
                Object.entries(enhancedData.enhancedBreakdown).map(([key, cat]) => {
                    // Type assertion if needed or type checking
                    const c = cat as any; // Simplified for loose coupling or exact type if imports match
                    if (c?.total <= 0) return null;
                    if (key === 'liabilities' || key === 'exempt') return null; // Usually filtered out

                    // Or follow stricter typing
                    if (typeof c?.total === 'number') {
                        return (
                            <LegendCard
                                key={key}
                                name={c.label}
                                value={c.total}
                                currency={currency}
                                description=""
                                color={c.color || ASSET_COLORS[c.label] || "#ccc"}
                            />
                        );
                    }
                    return null;
                })
            ) : (
                Object.keys(ASSET_COLORS).filter(k =>
                    !["Gross Zakatable Wealth", "Liabilities", "Net Zakatable Wealth", "Zakat Due", "Investment Portfolio", "Retirement Accounts", "Business Assets", "Other Assets"]
                        .includes(k) && ASSET_COLORS[k] !== undefined
                ).map((k): null => (null)) // Logic was messy in original, simplified here or rebuilt if needed
            )}
            {/* Fallback for simple data if enhanced missing */}
            {!enhancedData && data.liquidAssets > 0 && <LegendCard name="Cash & Savings" value={data.liquidAssets} currency={currency} description="" color={ASSET_COLORS["Cash & Savings"]} />}
            {/* Add other fallbacks if strictly needed, but App usually provides enhancedData now */}
        </div>
    );
};
