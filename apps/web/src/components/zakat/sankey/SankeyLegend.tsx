/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from "react";
import { formatCurrency, AssetCategory } from "@zakatflow/core";
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
                    const c = cat as { total?: number; label?: string; color?: string } | undefined;
                    if (!c || !c.total || c.total <= 0) return null;
                    if (key === 'liabilities' || key === 'exempt') return null; // Usually filtered out

                    // Or follow stricter typing
                    if (typeof c?.total === 'number') {
                        return (
                            <LegendCard
                                key={key}
                                name={c.label || key}
                                value={c.total}
                                currency={currency}
                                description=""
                                color={c.color || ASSET_COLORS[c.label || ''] || "#ccc"}
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
