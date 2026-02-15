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

import { EnhancedAssetBreakdown } from "@/lib/zakatCalculations";

export interface SankeyChartData {
    liquidAssets: number;
    investments: number;
    retirement: number;
    realEstate: number;
    business: number;
    otherAssets: number;
    totalLiabilities: number;
    zakatDue: number;
    netZakatableWealth: number;
    zakatRate: number;
}

export interface EnhancedSankeyChartData {
    enhancedBreakdown: EnhancedAssetBreakdown;
    totalLiabilities: number;
    zakatDue: number;
    netZakatableWealth: number;
    zakatRate: number;
    calculationMode: string;
    madhab?: string;
}

export interface FlowNode {
    name: string;
    value: number;
    zakatableAmount: number;
    zakatablePercent: number;
    color: string;
    x: number;
    y: number;
    height: number;
}

export interface FlowLink {
    source: FlowNode;
    target: FlowNode;
    value: number;
    sourceY: number;
    targetY: number;
    color: string;
    originalAssetName?: string;
    sourceHeight?: number;
    targetHeight?: number;
}

export interface TooltipData {
    name: string;
    value: number;
    zakatableAmount?: number;
    zakatablePercent?: number;
    description: string;
    x: number;
    y: number;
    showBelow?: boolean;
    zakatContribution?: number;
}
