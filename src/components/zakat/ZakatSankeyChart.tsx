import { ResponsiveSankey } from "@nivo/sankey";
import { useMemo } from "react";
import { useTheme } from "next-themes";
import { formatCurrency, formatCompactCurrency, formatPercent } from "@/lib/zakatCalculations";
import { ASSET_COLORS } from "./sankey/constants";
import { SankeyChartData, EnhancedSankeyChartData } from "./sankey/types";
import { ArrowDown, ShieldSlash, Wallet } from "@phosphor-icons/react";

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

interface SankeyNode {
  id: string;
  displayName: string;
  nodeColor: string;
  isSource?: boolean;
  isZakat?: boolean;
  isRetained?: boolean;
  isExempt?: boolean;
  value?: number;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
  startColor: string;
  endColor: string;
  assetName: string;
  type: 'zakat' | 'retained' | 'exempt';
}

// Helper to sanitize IDs for Nivo
const getSafeId = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '_');

export function ZakatSankeyChart({
  data,
  enhancedData,
  currency,
  width,
  height = 450,
}: ZakatSankeyChartProps) {

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const { formattedData, totalLiabilities, netZakatableWealth, hasExemptions, totalExempt, totalAssets } = useMemo(() => {
    // 1. Build Asset List
    // We strictly follow the "Option A" logic but simplified for Nivo's layout engine.
    // To ensure nodes are sized correctly on the LEFT (Gross Value), we must account for WHERE THE REST OF THE MONEY GOES.
    // Flow Conservation: Input (Gross) = Output (Zakat + Retained Wealth + Exemptions)

    const assets = enhancedData?.enhancedBreakdown
      ? [
        { id: "Cash & Savings", grossValue: enhancedData.enhancedBreakdown.liquidAssets.total, netValue: enhancedData.enhancedBreakdown.liquidAssets.zakatableAmount, zakatablePercent: enhancedData.enhancedBreakdown.liquidAssets.zakatablePercent, color: ASSET_COLORS["Cash & Savings"] },
        { id: "Precious Metals", grossValue: enhancedData.enhancedBreakdown.preciousMetals.total, netValue: enhancedData.enhancedBreakdown.preciousMetals.zakatableAmount, zakatablePercent: enhancedData.enhancedBreakdown.preciousMetals.zakatablePercent, color: ASSET_COLORS["Precious Metals"] },
        { id: "Crypto & Digital", grossValue: enhancedData.enhancedBreakdown.crypto.total, netValue: enhancedData.enhancedBreakdown.crypto.zakatableAmount, zakatablePercent: enhancedData.enhancedBreakdown.crypto.zakatablePercent, color: ASSET_COLORS["Crypto & Digital"] },
        { id: "Investments", grossValue: enhancedData.enhancedBreakdown.investments.total, netValue: enhancedData.enhancedBreakdown.investments.zakatableAmount, zakatablePercent: enhancedData.enhancedBreakdown.investments.zakatablePercent, color: ASSET_COLORS["Investments"] },
        { id: "Retirement", grossValue: enhancedData.enhancedBreakdown.retirement.total, netValue: enhancedData.enhancedBreakdown.retirement.zakatableAmount, zakatablePercent: enhancedData.enhancedBreakdown.retirement.zakatablePercent, color: ASSET_COLORS["Retirement"] },
        { id: "Trusts", grossValue: enhancedData.enhancedBreakdown.trusts.total, netValue: enhancedData.enhancedBreakdown.trusts.zakatableAmount, zakatablePercent: enhancedData.enhancedBreakdown.trusts.zakatablePercent, color: ASSET_COLORS["Trusts"] },
        { id: "Real Estate", grossValue: enhancedData.enhancedBreakdown.realEstate.total, netValue: enhancedData.enhancedBreakdown.realEstate.zakatableAmount, zakatablePercent: enhancedData.enhancedBreakdown.realEstate.zakatablePercent, color: ASSET_COLORS["Real Estate"] },
        { id: "Business", grossValue: enhancedData.enhancedBreakdown.business.total, netValue: enhancedData.enhancedBreakdown.business.zakatableAmount, zakatablePercent: enhancedData.enhancedBreakdown.business.zakatablePercent, color: ASSET_COLORS["Business"] },
        { id: "Debt Owed to You", grossValue: enhancedData.enhancedBreakdown.debtOwedToYou.total, netValue: enhancedData.enhancedBreakdown.debtOwedToYou.zakatableAmount, zakatablePercent: enhancedData.enhancedBreakdown.debtOwedToYou.zakatablePercent, color: ASSET_COLORS["Debt Owed to You"] },
        { id: "Illiquid Assets", grossValue: enhancedData.enhancedBreakdown.illiquidAssets.total, netValue: enhancedData.enhancedBreakdown.illiquidAssets.zakatableAmount, zakatablePercent: enhancedData.enhancedBreakdown.illiquidAssets.zakatablePercent, color: ASSET_COLORS["Illiquid Assets"] },
      ]
      : [
        { id: "Cash & Savings", grossValue: data.liquidAssets, netValue: data.liquidAssets, zakatablePercent: 1, color: ASSET_COLORS["Cash & Savings"] },
        { id: "Investments", grossValue: data.investments, netValue: data.investments, zakatablePercent: 1, color: ASSET_COLORS["Investments"] },
        { id: "Retirement", grossValue: data.retirement, netValue: data.retirement, zakatablePercent: 1, color: ASSET_COLORS["Retirement"] },
        { id: "Real Estate", grossValue: data.realEstate, netValue: data.realEstate, zakatablePercent: 1, color: ASSET_COLORS["Real Estate"] },
        { id: "Business", grossValue: data.business, netValue: data.business, zakatablePercent: 1, color: ASSET_COLORS["Business"] },
        { id: "Other Assets", grossValue: data.otherAssets, netValue: data.otherAssets, zakatablePercent: 1, color: ASSET_COLORS["Other Assets"] },
      ];

    // Filter active assets
    const activeAssets = assets.filter((a) => a.grossValue > 1);

    // Calculate global stats
    const totalAssetsVal = activeAssets.reduce((sum, a) => sum + a.grossValue, 0);
    const totalExemptVal = activeAssets.reduce((sum, a) => sum + (a.grossValue - a.netValue), 0);
    const totalNetVal = activeAssets.reduce((sum, a) => sum + a.netValue, 0);

    // If no data, return empty
    if (totalAssetsVal === 0) return {
      formattedData: { nodes: [], links: [] },
      totalLiabilities: 0,
      netZakatableWealth: 0,
      hasExemptions: false,
      totalExempt: 0,
      totalAssets: 0
    };

    const liabilities = enhancedData?.totalLiabilities ?? data.totalLiabilities;
    const netWealth = enhancedData?.netZakatableWealth ?? data.netZakatableWealth;
    const zakatDue = enhancedData?.zakatDue ?? data.zakatDue;
    const hasExemptionRules = totalExemptVal > 1;

    // --- NODE DEFINITIONS ---
    const nodes: SankeyNode[] = [];

    // 1. Source Nodes (Left Column) - Individual Assets
    activeAssets.forEach((a) => {
      nodes.push({
        id: getSafeId(a.id),
        displayName: a.id,
        nodeColor: a.color,
        isSource: true
      });
    });

    // 2. Target Nodes (Right Column)
    // - Zakat Due (Top priority)
    // - Retained Wealth (Where the 97.5% goes)
    // - Exempt (Where the non-zakatable portion goes)

    nodes.push({
      id: "Zakat_Due",
      displayName: "Zakat Due",
      nodeColor: "#16a34a", // Green-600
      isZakat: true
    });

    nodes.push({
      id: "Retained_Wealth",
      displayName: "Retained Wealth",
      nodeColor: isDark ? "#334155" : "#cbd5e1", // Slate-700 / Slate-300
      isRetained: true
    });

    if (hasExemptionRules) {
      nodes.push({
        id: "Exempt",
        displayName: "Not Zakatable",
        nodeColor: "#94a3b8", // Slate-400
        isExempt: true
      });
    }

    // --- LINK DEFINITIONS ---
    // Strict flow conservation: Every dollar in Source must go to a Target
    const links: SankeyLink[] = [];

    activeAssets.forEach((asset) => {
      // 1. Calculate Splits
      const exemptAmount = asset.grossValue - asset.netValue;

      // Of the Net Value, 2.5% is Zakat, 97.5% is Retained
      // Note: We use the global zakat rate logic to be consistent with calculator
      // Zakat Contribution = (Asset Net / Total Net) * Zakat Due
      // This handles cases where Zakat might be capped or adjusted globally, though usually it's strict 2.5%
      const zakatContribution = totalNetVal > 0 ? (asset.netValue / totalNetVal) * zakatDue : 0;
      const retainedAmount = asset.netValue - zakatContribution;

      // 2. Create Links

      // Link -> Zakat Due
      if (zakatContribution > 0.01) {
        links.push({
          source: getSafeId(asset.id),
          target: "Zakat_Due",
          value: zakatContribution,
          startColor: asset.color,
          endColor: "#16a34a",
          assetName: asset.id,
          type: "zakat"
        });
      }

      // Link -> Retained Wealth (Big flow)
      if (retainedAmount > 0.01) {
        links.push({
          source: getSafeId(asset.id),
          target: "Retained_Wealth",
          value: retainedAmount,
          startColor: asset.color,
          endColor: isDark ? "#334155" : "#cbd5e1",
          assetName: asset.id,
          type: "retained"
        });
      }

      // Link -> Exempt (if applicable)
      if (hasExemptionRules && exemptAmount > 0.01) {
        links.push({
          source: getSafeId(asset.id),
          target: "Exempt",
          value: exemptAmount,
          startColor: asset.color, // Or use gray startColor: "#94a3b8"
          endColor: "#94a3b8",
          assetName: asset.id,
          type: "exempt"
        });
      }
    });

    // Chart Theme
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
      netZakatableWealth: netWealth,
      hasExemptions: hasExemptionRules,
      totalExempt: totalExemptVal,
      totalAssets: totalAssetsVal
    };
  }, [data, enhancedData, isDark]);

  if (formattedData.nodes.length === 0) {
    return <div className="h-48 flex items-center justify-center text-muted-foreground">No assets to display</div>;
  }

  // Define sort order function
  // We want: Zakat (Top Right), Retained (Middle Right), Exempt (Bottom Right)
  // Assets (Left) sorted by value
  const sortNodes = (a: SankeyNode, b: SankeyNode) => {
    // 1. Zakat always first
    if (a.isZakat) return -1;
    if (b.isZakat) return 1;

    // 2. Exempt always last
    if (a.isExempt) return 1;
    if (b.isExempt) return -1;

    // 3. Retained Middle (implicitly handled if Zakat is top and Exempt is bottom)

    // 4. Sources sort by value (Descending)
    // Note: Sankey computes node.value as sum of links. 
    // For source nodes, this equals grossValue.
    // For target nodes, it equals total flow in.
    return (b.value || 0) - (a.value || 0);
  };

  // Dynamic margins based on width
  // Mobile (320px) -> 160px margins left 0 width!
  // We need tighter margins on mobile.
  const isSmallScreen = (width || 800) < 500;
  const margin = isSmallScreen
    ? { top: 10, right: 90, bottom: 10, left: 100 } // Compact margins for mobile (increased left for labels)
    : { top: 20, right: 130, bottom: 20, left: 180 }; // Increased left from 130->180 to fit long labels

  // Adjust align based on screen size/flow
  // 'justify' stretches nodes to edges, 'center' might be better if we have space issues?
  // Stick to 'justify' but ensure margins allow it.

  return (
    <div className="space-y-6">
      <div style={{ height, width: width || '100%', maxWidth: '100%' }} className="mx-auto">
        <ResponsiveSankey
          data={formattedData}
          theme={formattedData.chartTheme}
          margin={margin}
          align="justify"
          // @ts-ignore - Nivo types can be strict about sort function signature
          sort={sortNodes}
          colors={(node: SankeyNode) => node.nodeColor || "#999"}
          nodeOpacity={1}
          nodeHoverOthersOpacity={0.35}
          nodeThickness={isSmallScreen ? 12 : 18}
          nodeSpacing={isSmallScreen ? 16 : 24}
          nodeBorderWidth={0}
          nodeBorderColor={{ from: 'color', modifiers: [['darker', 0.8]] }}
          linkOpacity={isDark ? 0.6 : 0.4}
          linkBlendMode="normal"
          linkHoverOthersOpacity={0.1}
          linkContract={2}
          enableLinkGradient={true}
          labelPosition="outside"
          labelOrientation="horizontal"
          labelPadding={isSmallScreen ? 8 : 16}
          labelTextColor={{ from: 'theme', theme: 'text.fill' }}

          // --- TOOLTIPS ---
          nodeTooltip={({ node }: { node: SankeyNode }) => (
            <div className="bg-popover text-popover-foreground px-3 py-2 rounded-lg shadow-xl border border-border text-xs z-50 min-w-[160px]">
              <div className="font-bold mb-1 border-b border-border/50 pb-1">{node.displayName || node.id}</div>
              <div className="font-mono font-bold text-primary">
                {formatCurrency(node.value || 0, currency)}
              </div>
              {node.isZakat && <div className="text-[10px] text-muted-foreground mt-1">Total Zakat Due</div>}
              {node.isRetained && <div className="text-[10px] text-muted-foreground mt-1">Wealth retained after Zakat</div>}
              {node.isExempt && <div className="text-[10px] text-muted-foreground mt-1">Assets exempt from Zakat rules</div>}
              {node.isSource && <div className="text-[10px] text-muted-foreground mt-1">Gross Asset Value</div>}
            </div>
          )}

          linkTooltip={({ link }: { link: any }) => (
            <div className="bg-popover text-popover-foreground px-3 py-2 rounded-lg shadow-xl border border-border text-xs z-50 min-w-[180px]">
              <div className="text-muted-foreground mb-1">
                {link.assetName} → {link.target.displayName || link.target.id}
              </div>
              <div className="font-mono font-bold text-base text-primary">
                {formatCurrency(link.value, currency)}
              </div>
              <div className="text-[10px] text-muted-foreground mt-1 italic">
                {link.type === 'zakat' && "2.5% Contribution"}
                {link.type === 'retained' && "Retained Wealth (97.5%)"}
                {link.type === 'exempt' && "Exempt Amount"}
              </div>
            </div>
          )}

          // Custom Label: hide label for Retained Wealth to reduce clutter? 
          // Or user might want to see it. Let's show all for now but keep them compact.
          label={(node) => {
            const val = formatCompactCurrency(node.value, currency);
            if (isSmallScreen) {
              // Compact labels for mobile
              if (node.id === "Retained_Wealth") return `Retained\n${val}`;
              if (node.id === "Zakat_Due") return `Zakat\n${val}`;
              if (node.id === "Exempt") return `Exempt\n${val}`;
              // Truncate long source names
              const name = (node.displayName || node.id).substring(0, 10);
              return `${name}\n${val}`;
            }
            // Desktop
            // For Retained Wealth, maybe simplify label
            if (node.id === "Retained_Wealth") return `Retained\n${val}`;
            return `${node.displayName || node.id}\n${val}`;
          }}
        />
      </div>

      {/* Summary Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        {/* Total Assets */}
        <div className="bg-muted/30 rounded-xl p-3 flex flex-col items-center justify-center">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Total Assets</span>
          <span className="text-lg font-bold font-mono">{formatCompactCurrency(totalAssets, currency)}</span>
        </div>

        {/* Deductions (Liabilities + Exempt) */}
        <div className="bg-muted/30 rounded-xl p-3 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-destructive/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
            <ArrowDown className="w-3 h-3" /> Deductions
          </span>
          <div className="flex flex-col items-center">
            <div className="flex gap-2 items-baseline">
              {totalLiabilities > 0 && (
                <span className="text-lg font-bold font-mono text-destructive" title="Liabilities">
                  -{formatCompactCurrency(totalLiabilities, currency)}
                </span>
              )}
              {totalExempt > 0 && (
                <span className="text-lg font-bold font-mono text-muted-foreground" title="Exemptions">
                  -{formatCompactCurrency(totalExempt, currency)}
                </span>
              )}
              {totalLiabilities === 0 && totalExempt === 0 && <span className="text-lg font-bold font-mono text-muted-foreground">-</span>}
            </div>
            {(totalLiabilities > 0 || totalExempt > 0) && (
              <div className="text-[10px] text-muted-foreground flex gap-2">
                {totalLiabilities > 0 && <span>(Liab)</span>}
                {totalExempt > 0 && <span>(Exempt)</span>}
              </div>
            )}
          </div>
        </div>

        {/* Net Wealth */}
        <div className="bg-primary/5 rounded-xl p-3 flex flex-col items-center justify-center border border-primary/10">
          <span className="text-xs uppercase tracking-wider text-primary font-semibold flex items-center gap-1">
            <Wallet className="w-3 h-3" /> Net Wealth
          </span>
          <span className="text-lg font-bold font-mono text-primary">{formatCompactCurrency(netZakatableWealth, currency)}</span>
        </div>
      </div>
    </div>
  );
}

export function ZakatSankeyMock() {
  return null;
}
