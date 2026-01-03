import { ResponsiveSankey } from "@nivo/sankey";
import { useMemo } from "react";
import { formatCurrency, formatCompactCurrency, formatPercent } from "@/lib/zakatCalculations";
import { ASSET_COLORS } from "./sankey/constants";
import { SankeyChartData, EnhancedSankeyChartData } from "./sankey/types";

// Re-export types
export type { SankeyChartData, EnhancedSankeyChartData };

interface ZakatSankeyChartProps {
  data: SankeyChartData;
  enhancedData?: EnhancedSankeyChartData;
  currency: string;
  width?: number; // Ignored by ResponsiveSankey but kept for interface compat
  height?: number;
  showLabels?: boolean;
  showFullscreenButton?: boolean;
}

// Helper to sanitize IDs for Nivo to avoid "missing node" errors with special chars
const getSafeId = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '_');

export function ZakatSankeyChart({
  data,
  enhancedData,
  currency,
  height = 500, // Increased height for better granularity
}: ZakatSankeyChartProps) {

  const formattedData = useMemo(() => {
    // 1. Build initial Asset List
    const assets = enhancedData?.enhancedBreakdown
      ? [
        { id: "Cash & Savings", value: enhancedData.enhancedBreakdown.liquidAssets.zakatableAmount, grossValue: enhancedData.enhancedBreakdown.liquidAssets.total, zakatablePercent: enhancedData.enhancedBreakdown.liquidAssets.zakatablePercent, color: ASSET_COLORS["Cash & Savings"] },
        { id: "Precious Metals", value: enhancedData.enhancedBreakdown.preciousMetals.zakatableAmount, grossValue: enhancedData.enhancedBreakdown.preciousMetals.total, zakatablePercent: enhancedData.enhancedBreakdown.preciousMetals.zakatablePercent, color: ASSET_COLORS["Precious Metals"] },
        { id: "Crypto & Digital", value: enhancedData.enhancedBreakdown.crypto.zakatableAmount, grossValue: enhancedData.enhancedBreakdown.crypto.total, zakatablePercent: enhancedData.enhancedBreakdown.crypto.zakatablePercent, color: ASSET_COLORS["Crypto & Digital"] },
        { id: "Investments", value: enhancedData.enhancedBreakdown.investments.zakatableAmount, grossValue: enhancedData.enhancedBreakdown.investments.total, zakatablePercent: enhancedData.enhancedBreakdown.investments.zakatablePercent, color: ASSET_COLORS["Investments"] },
        { id: "Retirement", value: enhancedData.enhancedBreakdown.retirement.zakatableAmount, grossValue: enhancedData.enhancedBreakdown.retirement.total, zakatablePercent: enhancedData.enhancedBreakdown.retirement.zakatablePercent, color: ASSET_COLORS["Retirement"] },
        { id: "Trusts", value: enhancedData.enhancedBreakdown.trusts.zakatableAmount, grossValue: enhancedData.enhancedBreakdown.trusts.total, zakatablePercent: enhancedData.enhancedBreakdown.trusts.zakatablePercent, color: ASSET_COLORS["Trusts"] },
        { id: "Real Estate", value: enhancedData.enhancedBreakdown.realEstate.zakatableAmount, grossValue: enhancedData.enhancedBreakdown.realEstate.total, zakatablePercent: enhancedData.enhancedBreakdown.realEstate.zakatablePercent, color: ASSET_COLORS["Real Estate"] },
        { id: "Business", value: enhancedData.enhancedBreakdown.business.zakatableAmount, grossValue: enhancedData.enhancedBreakdown.business.total, zakatablePercent: enhancedData.enhancedBreakdown.business.zakatablePercent, color: ASSET_COLORS["Business"] },
        { id: "Debt Owed to You", value: enhancedData.enhancedBreakdown.debtOwedToYou.zakatableAmount, grossValue: enhancedData.enhancedBreakdown.debtOwedToYou.total, zakatablePercent: enhancedData.enhancedBreakdown.debtOwedToYou.zakatablePercent, color: ASSET_COLORS["Debt Owed to You"] },
        { id: "Illiquid Assets", value: enhancedData.enhancedBreakdown.illiquidAssets.zakatableAmount, grossValue: enhancedData.enhancedBreakdown.illiquidAssets.total, zakatablePercent: enhancedData.enhancedBreakdown.illiquidAssets.zakatablePercent, color: ASSET_COLORS["Illiquid Assets"] },
      ]
      : [
        { id: "Cash & Savings", value: data.liquidAssets, color: ASSET_COLORS["Cash & Savings"] },
        { id: "Investments", value: data.investments, color: ASSET_COLORS["Investments"] },
        { id: "Retirement", value: data.retirement, color: ASSET_COLORS["Retirement"] },
        { id: "Real Estate", value: data.realEstate, color: ASSET_COLORS["Real Estate"] },
        { id: "Business", value: data.business, color: ASSET_COLORS["Business"] },
        { id: "Other Assets", value: data.otherAssets, color: ASSET_COLORS["Other Assets"] },
      ];

    // Filter zero assets
    const activeAssets = assets.filter((a) => a.value > 0);
    const totalZakatable = activeAssets.reduce((sum, a) => sum + a.value, 0);

    if (totalZakatable === 0) return { nodes: [], links: [] };

    const totalLiabilities = enhancedData?.totalLiabilities ?? data.totalLiabilities;
    const netWealth = enhancedData?.netZakatableWealth ?? data.netZakatableWealth;
    const zakatDue = enhancedData?.zakatDue ?? data.zakatDue;

    // 2. Define Nodes
    // Split "Net Wealth" into individual nodes per asset to ensure perfect alignment
    const nodes: any[] = [
      ...activeAssets.map(a => ({
        id: getSafeId(a.id), // Safe internal ID
        displayName: a.id,   // Human readable name
        nodeColor: a.color,
        grossValue: (a as any).grossValue,
        zakatablePercent: (a as any).zakatablePercent
      })),
      { id: getSafeId("Liabilities (Shared)"), displayName: "Liabilities (Shared)", nodeColor: "#ef4444" },
      // Generate "Net" nodes for each asset
      ...activeAssets.map(a => ({
        id: getSafeId(`${a.id} (Net)`), // Unique ID for the middle node
        displayName: `${a.id} (Net Wealth)`,
        nodeColor: a.color,  // Inherit asset color!
        isNetNode: true,     // Tag for tooltip
        originalAsset: a.id
      })),
      { id: getSafeId("Zakat Due"), displayName: "Zakat Due", nodeColor: "#15803d" },    // Dark Green
    ];

    // 3. Define Links
    const links: any[] = [];

    // Calculate Ratios
    const liabilityRatio = totalZakatable > 0 ? Math.min(1, totalLiabilities / totalZakatable) : 0;
    const netRatio = 1 - liabilityRatio;

    // Zakat Ratio (applied to the Net portion)
    // Avoid division by zero
    const totalNetWealth = activeAssets.reduce((sum, a) => sum + (a.value * netRatio), 0);
    const zakatRatioOfNet = totalNetWealth > 0 ? zakatDue / totalNetWealth : 0;

    activeAssets.forEach((asset, index) => {
      const liabShare = asset.value * liabilityRatio;
      const netShare = asset.value * netRatio;

      // 1. Flow to Liabilities (Shared Sink)
      if (liabShare > 0.01) {
        links.push({
          source: getSafeId(asset.id),
          target: getSafeId("Liabilities (Shared)"),
          value: liabShare,
          startColor: "#cbd5e1",
          endColor: "#ef4444",
        });
      }

      // 2. Flow to "Net [Asset]" Node (Parallel Track)
      if (netShare > 0.01) {
        links.push({
          source: getSafeId(asset.id),
          target: getSafeId(`${asset.id} (Net)`),
          value: netShare,
          startColor: asset.color,
          endColor: asset.color,
        });

        // 3. Flow from "Net [Asset]" -> Zakat Due
        // Calculate strict share of Zakat for this specific asset stream
        const assetZakat = netShare * zakatRatioOfNet;

        if (assetZakat > 0.01) {
          links.push({
            source: getSafeId(`${asset.id} (Net)`),
            target: getSafeId("Zakat Due"),
            value: assetZakat,
            startColor: asset.color,
            endColor: asset.color,
            originalAssetId: asset.id // For tooltip
          });
        }
      }
    });

    return { nodes, links };
  }, [data, enhancedData]);


  if (formattedData.nodes.length === 0) {
    return <div className="h-48 flex items-center justify-center text-muted-foreground">No assets to display</div>;
  }

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveSankey
        data={formattedData}
        margin={{ top: 20, right: 200, bottom: 20, left: 200 }} // Increased margins for labels
        align="justify"
        colors={(node: any) => node.nodeColor || "#999"}
        nodeOpacity={1}
        nodeHoverOthersOpacity={0.35}
        nodeThickness={18}
        nodeSpacing={0} // Tight spacing for split nodes
        nodeBorderWidth={0}
        nodeBorderColor={{ from: 'color', modifiers: [['darker', 0.8]] }}
        linkOpacity={0.6}
        linkHoverOthersOpacity={0.1}
        linkContract={0} // No gap between links
        enableLinkGradient={true}
        labelPosition="outside"
        labelOrientation="horizontal"
        labelPadding={24} // More padding
        labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
        // Custom Tooltips
        nodeTooltip={({ node }: any) => {
          const isRuleApplied = node.zakatablePercent !== undefined && node.zakatablePercent < 1;
          const isNetNode = node.isNetNode;

          // Clean up ID for display
          const displayId = node.displayName || node.id;

          return (
            <div className="bg-popover text-popover-foreground px-3 py-2 rounded-lg shadow-xl border border-border text-xs z-50 min-w-[180px]">
              <div className="font-bold mb-1 text-sm border-b border-border/50 pb-1">{displayId}</div>

              <div className="space-y-1 mt-1.5">
                {/* Gross Value (Only on Source Nodes) */}
                {!isNetNode && node.id !== getSafeId("Zakat Due") && node.id !== getSafeId("Liabilities (Shared)") && (
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Gross Value:</span>
                    <span className="font-mono">{formatCurrency(node.grossValue || node.value, currency)}</span>
                  </div>
                )}

                {/* Rule display if not 100% */}
                {isRuleApplied && (
                  <div className="flex justify-between gap-4 text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded">
                    <span>Zakatable Rule:</span>
                    <span>{formatPercent(node.zakatablePercent)}</span>
                  </div>
                )}

                {/* Final Zakatable Amount / Node Value */}
                <div className="flex justify-between gap-4 pt-1 border-t border-border/50">
                  <span className="font-bold">
                    {isNetNode ? "Net Zakatable:" : "Value:"}
                  </span>
                  <span className="font-mono font-bold text-primary">{formatCurrency(node.value, currency)}</span>
                </div>
              </div>
            </div>
          )
        }}
        linkTooltip={({ link }: any) => {
          // If this is a granular flow (Net -> Zakat), show the asset name
          const isZakatFlow = link.target.id === getSafeId("Zakat Due") && link.originalAssetId;

          return (
            <div className="bg-popover text-popover-foreground px-3 py-2 rounded-lg shadow-xl border border-border text-xs z-50 min-w-[200px]">
              <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                <span>{link.source.displayName || link.source.id}</span>
                <span>→</span>
                <span>{link.target.displayName || link.target.id}</span>
              </div>

              {isZakatFlow && (
                <div className="text-xs font-semibold text-foreground mb-1">
                  {link.originalAssetId} Contribution
                </div>
              )}

              <div className="font-mono font-bold text-base text-primary">
                {formatCurrency(link.value, currency)}
              </div>

              {link.target.id === getSafeId("Liabilities (Shared)") && (
                <div className="text-[10px] text-muted-foreground mt-1 italic">
                  Proportional share of liabilities deducted
                </div>
              )}
            </div>
          )
        }}
        // Custom Label Formatter
        // Only show labels for Source nodes and final Zakat/Liability nodes. Hide intermediate splits.
        label={(node) => {
          if (node.isNetNode) return ""; // Hide split nodes
          return `${node.displayName || node.id}\n${formatCompactCurrency(node.value, currency)}`;
        }}
      />
    </div>
  );
}

// Mock export for testing
export function ZakatSankeyMock() {
  return null; // Deprecated
}
