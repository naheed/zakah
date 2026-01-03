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
