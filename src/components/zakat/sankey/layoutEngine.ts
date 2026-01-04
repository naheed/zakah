import { SankeyChartData, EnhancedSankeyChartData, FlowNode, FlowLink } from "./types";
import { ASSET_COLORS } from "./constants";

interface LayoutResult {
    nodes: FlowNode[];
    links: FlowLink[];
    leftNodes: FlowNode[];
    liabilitiesNode: FlowNode | null;
    netNode: FlowNode;
    zakatNode: FlowNode | null;
    assetZakatContributions: Record<string, number>;
}

export function calculateSankeyLayout(
    data: SankeyChartData,
    enhancedData: EnhancedSankeyChartData | undefined,
    width: number,
    height: number,
    showLabels: boolean
): LayoutResult {
    const leftNodes: FlowNode[] = [];
    const nodeWidth = 16;
    const padding = showLabels ? 140 : 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - 60;
    const topY = 30;
    const gap = 8;

    // Build asset data
    interface AssetDataItem {
        name: string;
        value: number;
        zakatableAmount: number;
        zakatablePercent: number;
    }

    let assetData: AssetDataItem[];

    if (enhancedData?.enhancedBreakdown) {
        const eb = enhancedData.enhancedBreakdown;
        assetData = [
            { name: eb.liquidAssets.label, value: eb.liquidAssets.total, zakatableAmount: eb.liquidAssets.zakatableAmount, zakatablePercent: eb.liquidAssets.zakatablePercent },
            { name: eb.preciousMetals.label, value: eb.preciousMetals.total, zakatableAmount: eb.preciousMetals.zakatableAmount, zakatablePercent: eb.preciousMetals.zakatablePercent },
            { name: eb.crypto.label, value: eb.crypto.total, zakatableAmount: eb.crypto.zakatableAmount, zakatablePercent: eb.crypto.zakatablePercent },
            { name: eb.investments.label, value: eb.investments.total, zakatableAmount: eb.investments.zakatableAmount, zakatablePercent: eb.investments.zakatablePercent },
            { name: eb.retirement.label, value: eb.retirement.total, zakatableAmount: eb.retirement.zakatableAmount, zakatablePercent: eb.retirement.zakatablePercent },
            { name: eb.trusts.label, value: eb.trusts.total, zakatableAmount: eb.trusts.zakatableAmount, zakatablePercent: eb.trusts.zakatablePercent },
            { name: eb.realEstate.label, value: eb.realEstate.total, zakatableAmount: eb.realEstate.zakatableAmount, zakatablePercent: eb.realEstate.zakatablePercent },
            { name: eb.business.label, value: eb.business.total, zakatableAmount: eb.business.zakatableAmount, zakatablePercent: eb.business.zakatablePercent },
            { name: eb.debtOwedToYou.label, value: eb.debtOwedToYou.total, zakatableAmount: eb.debtOwedToYou.zakatableAmount, zakatablePercent: eb.debtOwedToYou.zakatablePercent },
            { name: eb.illiquidAssets.label, value: eb.illiquidAssets.total, zakatableAmount: eb.illiquidAssets.zakatableAmount, zakatablePercent: eb.illiquidAssets.zakatablePercent },
        ].filter(a => a.zakatableAmount > 0);
    } else {
        assetData = [
            { name: "Cash & Savings", value: data.liquidAssets, zakatableAmount: data.liquidAssets, zakatablePercent: 1.0 },
            { name: "Investments", value: data.investments, zakatableAmount: data.investments, zakatablePercent: 1.0 },
            { name: "Retirement", value: data.retirement, zakatableAmount: data.retirement, zakatablePercent: 1.0 },
            { name: "Real Estate", value: data.realEstate, zakatableAmount: data.realEstate, zakatablePercent: 1.0 },
            { name: "Business", value: data.business, zakatableAmount: data.business, zakatablePercent: 1.0 },
            { name: "Other Assets", value: data.otherAssets, zakatableAmount: data.otherAssets, zakatablePercent: 1.0 },
        ].filter(a => a.value > 0);
    }

    const totalZakatableAssets = assetData.reduce((sum, a) => sum + a.zakatableAmount, 0);
    const zakatDue = enhancedData?.zakatDue ?? data.zakatDue;
    const netZakatableWealth = enhancedData?.netZakatableWealth ?? data.netZakatableWealth;
    const totalLiabilities = enhancedData?.totalLiabilities ?? data.totalLiabilities;

    if (totalZakatableAssets === 0) return { nodes: [], links: [], leftNodes: [], liabilitiesNode: null, netNode: { name: "", value: 0, zakatableAmount: 0, zakatablePercent: 0, color: "", x: 0, y: 0, height: 0 }, zakatNode: null, assetZakatContributions: {} };

    // --- Visual Scaling (Power Law for Artistic Effect) ---
    const powerExp = 0.6;
    const getVisualSize = (v: number) => v > 0 ? Math.pow(v, powerExp) : 0;

    // Calculate visualization scale to fit height
    const totalVisualAssets = assetData.reduce((sum, a) => sum + getVisualSize(a.zakatableAmount), 0);
    const totalGapSafety = (assetData.length) * gap;
    const pixelFactor = Math.max(0.001, (chartHeight - totalGapSafety) / totalVisualAssets);

    // Helper to get pixels
    const toPx = (val: number) => getVisualSize(val) * pixelFactor;

    // --- Layout Nodes ---
    let currentY = topY;
    const assetSegments: { name: string; y: number; h: number; color: string; value: number }[] = [];

    // 1. Left Nodes (Assets)
    assetData.forEach(asset => {
        const h = Math.max(2, toPx(asset.zakatableAmount));
        leftNodes.push({
            name: asset.name,
            value: asset.value,
            zakatableAmount: asset.zakatableAmount,
            zakatablePercent: asset.zakatablePercent,
            color: ASSET_COLORS[asset.name] || "#64748b",
            x: padding,
            y: currentY,
            height: h,
        });
        assetSegments.push({
            name: asset.name,
            y: currentY,
            h: h,
            color: ASSET_COLORS[asset.name] || "#64748b",
            value: asset.zakatableAmount
        });
        currentY += h + gap;
    });

    // 2. Prepare Right Side Flows
    const links: FlowLink[] = [];
    const assetZakatContributions: Record<string, number> = {};

    let liabRemain = totalLiabilities;
    let liabVisualH = 0;
    let netVisualH = 0;

    interface FlowSegment { type: 'liab' | 'net'; val: number; px: number; color: string; srcY: number; name: string; }
    const rightFlows: FlowSegment[] = [];

    // Process Left -> Right
    assetSegments.forEach(seg => {
        const segVal = seg.value;
        const segPx = seg.h;
        const segTop = seg.y;

        // Liability Portion (Value)
        const liabVal = Math.min(liabRemain, segVal);
        const netVal = segVal - liabVal;

        liabRemain -= liabVal;

        const liabPx = segPx * (liabVal / segVal);
        const netPx = segPx * (netVal / segVal);

        if (liabPx > 0) {
            rightFlows.push({ type: 'liab', val: liabVal, px: liabPx, color: seg.color, srcY: segTop + liabPx / 2, name: seg.name });
            liabVisualH += liabPx;
        }
        if (netPx > 0) {
            rightFlows.push({ type: 'net', val: netVal, px: netPx, color: seg.color, srcY: segTop + liabPx + netPx / 2, name: seg.name });
            netVisualH += netPx;
        }
    });

    // 3. Right Nodes Positioning
    const rightColX = padding + chartWidth * 0.55;

    const liabilitiesNode: FlowNode | null = totalLiabilities > 0 ? {
        name: "Liabilities",
        value: totalLiabilities,
        zakatableAmount: 0,
        zakatablePercent: 0,
        color: ASSET_COLORS["Liabilities"] || "#ef4444",
        x: rightColX,
        y: topY,
        height: Math.max(0, liabVisualH)
    } : null;

    const netY = topY + liabVisualH + (liabilitiesNode ? gap : 0);
    const netNode: FlowNode = {
        name: "Net Zakatable Wealth",
        value: netZakatableWealth,
        zakatableAmount: netZakatableWealth,
        zakatablePercent: 1.0,
        color: ASSET_COLORS["Net Zakatable Wealth"],
        x: rightColX,
        y: netY,
        height: netVisualH
    };

    // 4. Zakat Flows (Peeling from Net)
    const zakatX = width - padding - nodeWidth;
    let zakatTotalVisualH = 0;

    rightFlows.filter(f => f.type === 'net').forEach(f => {
        const zVal = f.val * data.zakatRate;
        zakatTotalVisualH += toPx(zVal);
    });

    const zakatNode: FlowNode | null = zakatDue > 0 ? {
        name: "Zakat Due",
        value: zakatDue,
        zakatableAmount: zakatDue,
        zakatablePercent: 1.0,
        color: ASSET_COLORS["Zakat Due"],
        x: zakatX,
        y: topY,
        height: Math.max(20, zakatTotalVisualH)
    } : null;

    // --- Generate Links ---
    let liabCursorY = topY;
    let netCursorY = netY;
    let zakatCursorY = topY;

    rightFlows.forEach(f => {
        if (f.type === 'liab' && liabilitiesNode) {
            links.push({
                source: leftNodes.find(n => n.name === f.name)!,
                target: liabilitiesNode,
                value: f.val,
                color: f.color,
                sourceY: f.srcY,
                targetY: liabCursorY + f.px / 2,
                sourceHeight: f.px,
                targetHeight: f.px,
                originalAssetName: f.name + " (Liability)"
            });
            liabCursorY += f.px;
        } else if (f.type === 'net') {
            links.push({
                source: leftNodes.find(n => n.name === f.name)!,
                target: netNode,
                value: f.val,
                color: f.color,
                sourceY: f.srcY,
                targetY: netCursorY + f.px / 2,
                sourceHeight: f.px,
                targetHeight: f.px,
                originalAssetName: f.name
            });

            if (zakatNode) {
                const zVal = f.val * data.zakatRate;
                const zPx = toPx(zVal);
                assetZakatContributions[f.name] = zVal;

                links.push({
                    source: netNode,
                    target: zakatNode,
                    value: zVal,
                    color: f.color,
                    sourceY: netCursorY + f.px / 2,
                    targetY: zakatCursorY + zPx / 2,
                    // Expanding flow emphasizes the "Output" (small % -> big visual)
                    sourceHeight: f.px * data.zakatRate,
                    targetHeight: zPx,
                    originalAssetName: f.name
                });
                zakatCursorY += zPx;
            }
            netCursorY += f.px;
        }
    });

    return {
        nodes: [netNode, liabilitiesNode, zakatNode, ...leftNodes].filter(n => n !== null) as FlowNode[],
        links,
        leftNodes,
        liabilitiesNode,
        netNode,
        zakatNode,
        assetZakatContributions,
    };
}
