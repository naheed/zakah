import { ResponsiveSankey } from "@nivo/sankey";
import { useMemo } from "react";
import { useTheme } from "next-themes";
import { formatCurrency, formatCompactCurrency, formatPercent } from "@/lib/zakatCalculations";
import { ASSET_COLORS } from "./sankey/constants";
import { SankeyChartData, EnhancedSankeyChartData } from "./sankey/types";
import { Wallet, ArrowDown } from "@phosphor-icons/react";

// Re-export types
export type { SankeyChartData, EnhancedSankeyChartData };

interface ZakatSankeyChartProps {
  data: SankeyChartData;
  enhancedData?: EnhancedSankeyChartData;
  currency: string;
  width?: number;
  height?: number;
  showLabels?: boolean;
  showFullscreenButton?: boolean;
}

// Helper to sanitize IDs for Nivo
const getSafeId = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '_');

export function ZakatSankeyChart({
  data,
  enhancedData,
  currency,
  height = 350, // Reduced height for wider aspect ratio
}: ZakatSankeyChartProps) {

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const { formattedData, totalLiabilities, netZakatableWealth } = useMemo(() => {
    // 1. Build Asset List
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

    if (totalZakatable === 0) return { formattedData: { nodes: [], links: [] }, totalLiabilities: 0, netZakatableWealth: 0 };

    const liabilities = enhancedData?.totalLiabilities ?? data.totalLiabilities;
    const netWealth = enhancedData?.netZakatableWealth ?? data.netZakatableWealth;
    const zakatDue = enhancedData?.zakatDue ?? data.zakatDue;

    // 2. Define Nodes - Simple 2-column: Assets → Zakat
    const nodes: any[] = [
      // Zakat node FIRST for top positioning
      { id: getSafeId("Zakat Due"), displayName: "Zakat Due", nodeColor: "#15803d", sortOrder: 0 },
      // Asset nodes
      ...activeAssets.map((a, i) => ({
        id: getSafeId(a.id),
        displayName: a.id,
        nodeColor: a.color,
        grossValue: (a as any).grossValue,
        zakatablePercent: (a as any).zakatablePercent,
        sortOrder: i + 1
      })),
    ];

    // 3. Define Links - Direct flows from each asset to Zakat
    const links: any[] = [];

    // Calculate each asset's contribution to Zakat (proportional to their share of net wealth)
    const zakatRate = 0.025; // 2.5%

    activeAssets.forEach((asset) => {
      // Each asset contributes proportionally
      const assetShare = asset.value / totalZakatable;
      const assetZakatContribution = netWealth * zakatRate * assetShare;

      if (assetZakatContribution > 0.01) {
        links.push({
          source: getSafeId(asset.id),
          target: getSafeId("Zakat Due"),
          value: assetZakatContribution,
          startColor: asset.color,
          endColor: "#15803d",
          assetName: asset.id
        });
      }
    });

    const chartTheme = {
      text: {
        fill: isDark ? "#e2e8f0" : "#334155",
        fontSize: 11,
        fontWeight: 600,
      },
      tooltip: {
        container: {
          background: isDark ? "#1e293b" : "#ffffff",
          color: isDark ? "#f8fafc" : "#0f172a",
          fontSize: "12px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
        },
      },
    };

    return {
      formattedData: { nodes, links, chartTheme },
      totalLiabilities: liabilities,
      netZakatableWealth: netWealth
    };
  }, [data, enhancedData, isDark]);

  if (formattedData.nodes.length === 0) {
    return <div className="h-48 flex items-center justify-center text-muted-foreground">No assets to display</div>;
  }

  return (
    <div className="space-y-4">
      {/* Sankey Chart */}
      <div style={{ height }} className="w-full">
        <ResponsiveSankey
          data={formattedData}
          theme={formattedData.chartTheme}
          margin={{ top: 40, right: 180, bottom: 40, left: 180 }}
          align="justify"
          sort={(a: any, b: any) => {
            // Zakat Due always at top (sortOrder = 0)
            if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
              return a.sortOrder - b.sortOrder;
            }
            return 0;
          }}
          colors={(node: any) => node.nodeColor || "#999"}
          nodeOpacity={1}
          nodeHoverOthersOpacity={0.35}
          nodeThickness={24}
          nodeSpacing={32}
          nodeBorderWidth={0}
          nodeBorderColor={{ from: 'color', modifiers: [['darker', 0.8]] }}
          linkOpacity={isDark ? 0.6 : 0.4}
          linkBlendMode="normal"
          linkHoverOthersOpacity={0.1}
          linkContract={4}
          enableLinkGradient={true}
          labelPosition="outside"
          labelOrientation="horizontal"
          labelPadding={24}
          labelTextColor={{ from: 'theme', theme: 'text.fill' }}
          nodeTooltip={({ node }: any) => {
            const isZakat = node.id === getSafeId("Zakat Due");
            const displayId = node.displayName || node.id;
            const isRuleApplied = node.zakatablePercent !== undefined && node.zakatablePercent < 1;

            return (
              <div className="bg-popover text-popover-foreground px-3 py-2 rounded-lg shadow-xl border border-border text-xs z-50 min-w-[180px]">
                <div className="font-bold mb-1 text-sm border-b border-border/50 pb-1">{displayId}</div>
                <div className="space-y-1 mt-1.5">
                  {!isZakat && node.grossValue && (
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Gross Value:</span>
                      <span className="font-mono">{formatCurrency(node.grossValue, currency)}</span>
                    </div>
                  )}
                  {isRuleApplied && (
                    <div className="flex justify-between gap-4 text-tertiary font-medium bg-tertiary/10 px-1.5 py-0.5 rounded">
                      <span>Zakatable Rule:</span>
                      <span>{formatPercent(node.zakatablePercent)}</span>
                    </div>
                  )}
                  <div className="flex justify-between gap-4 pt-1 border-t border-border/50">
                    <span className="font-bold">{isZakat ? "2.5% Zakat:" : "Zakatable:"}</span>
                    <span className="font-mono font-bold text-primary">{formatCurrency(node.value, currency)}</span>
                  </div>
                </div>
              </div>
            )
          }}
          linkTooltip={({ link }: any) => (
            <div className="bg-popover text-popover-foreground px-3 py-2 rounded-lg shadow-xl border border-border text-xs z-50 min-w-[180px]">
              <div className="text-muted-foreground mb-1">
                {link.assetName} contribution
              </div>
              <div className="font-mono font-bold text-base text-primary">
                {formatCurrency(link.value, currency)}
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">
                2.5% of proportional share
              </div>
            </div>
          )}
          label={(node) => `${node.displayName || node.id}\n${formatCompactCurrency(node.value, currency)}`}
        />
      </div>

      {/* Liabilities Badge - Shows deductions as summary */}
      {totalLiabilities > 0 && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg py-2 px-4 mx-auto max-w-fit">
          <ArrowDown className="w-4 h-4 text-destructive" weight="bold" />
          <span>
            <span className="font-medium text-destructive">{formatCompactCurrency(totalLiabilities, currency)}</span>
            {" "}in liabilities deducted
          </span>
          <span className="text-muted-foreground/50">→</span>
          <span>
            Net Wealth: <span className="font-medium text-foreground">{formatCompactCurrency(netZakatableWealth, currency)}</span>
          </span>
        </div>
      )}
    </div>
  );
}

// Mock export for testing
export function ZakatSankeyMock() {
  return null;
}
