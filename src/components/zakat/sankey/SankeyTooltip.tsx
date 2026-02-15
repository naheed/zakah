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
