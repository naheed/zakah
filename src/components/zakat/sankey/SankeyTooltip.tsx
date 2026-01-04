import React from "react";
import { TooltipData } from "./types";
import { formatCurrency } from "@/lib/zakatCalculations";

interface SankeyTooltipProps {
    tooltip: TooltipData;
    currency: string;
}

export const SankeyTooltip: React.FC<SankeyTooltipProps> = ({ tooltip, currency }) => {
    return (
        <div
            className={`absolute bg-popover border border-border rounded-lg px-4 py-3 shadow-lg z-50 pointer-events-none transform -translate-x-1/2 ${tooltip.showBelow ? 'translate-y-2' : '-translate-y-full'
                }`}
            style={{
                left: tooltip.x,
                top: tooltip.showBelow ? tooltip.y : tooltip.y - 8,
                minWidth: '200px',
            }}
        >
            <p className="text-sm font-semibold text-foreground">{tooltip.name}</p>
            {tooltip.description && (
                <p className="text-xs text-muted-foreground mt-1 mb-2">{tooltip.description}</p>
            )}
            {tooltip.value > 0 && (
                <p className="text-base font-bold text-foreground">
                    {formatCurrency(tooltip.value, currency)}
                </p>
            )}
            {tooltip.zakatablePercent !== undefined && tooltip.zakatablePercent < 1.0 && tooltip.zakatableAmount !== undefined && (
                <div className="text-xs text-muted-foreground mt-1 border-t border-border pt-1">
                    <span className="font-medium">{Math.round(tooltip.zakatablePercent * 100)}%</span> zakatable = {formatCurrency(tooltip.zakatableAmount, currency)}
                </div>
            )}
            {tooltip.zakatContribution !== undefined && (
                <p className="text-xs text-primary mt-1">
                    → Zakat: {formatCurrency(tooltip.zakatContribution, currency)}
                </p>
            )}
        </div>
    );
};
