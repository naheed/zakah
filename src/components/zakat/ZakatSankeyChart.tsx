import { Sankey, Tooltip, Rectangle, Layer } from "recharts";
import { formatCurrency } from "@/lib/zakatCalculations";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Maximize2, X } from "lucide-react";

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

// Color coding by Zakat treatment with clear semantic meaning
const ASSET_COLORS: Record<string, string> = {
  "Cash & Savings": "hsl(142, 76%, 36%)", // Green - Full 2.5%
  "Investment Portfolio": "hsl(221, 83%, 53%)", // Blue - May have 30% rule
  "Retirement Accounts": "hsl(262, 83%, 58%)", // Purple - Tax/penalty deductions
  "Real Estate": "hsl(25, 95%, 53%)", // Orange - Business assets
  "Business Assets": "hsl(340, 82%, 52%)", // Pink - Business assets  
  "Other Assets": "hsl(var(--primary))",
  "Net Zakatable Wealth": "hsl(215, 20%, 65%)",
  "Deductions": "hsl(var(--destructive))",
  "Zakat Due (2.5%)": "hsl(142, 76%, 36%)", // Green for Zakat
};

// Map internal names to display names
const DISPLAY_NAMES: Record<string, string> = {
  "Cash & Savings": "Cash & Savings",
  "Investment Portfolio": "Investment Portfolio",
  "Retirement Accounts": "Retirement Accounts",
  "Real Estate": "Real Estate",
  "Business Assets": "Business Assets",
  "Other Assets": "Other Assets",
  "Net Zakatable Wealth": "Net Zakatable Wealth",
  "Zakat Due (2.5%)": "Zakat Due (2.5%)",
};

interface ZakatSankeyChartProps {
  data: SankeyChartData;
  currency: string;
  width?: number;
  height?: number;
  showLabels?: boolean;
  showFullscreenButton?: boolean;
}

interface SankeyNodeData {
  name: string;
  value: number;
}

export function ZakatSankeyChart({ 
  data, 
  currency, 
  width = 500, 
  height = 300,
  showLabels = true,
  showFullscreenButton = false,
}: ZakatSankeyChartProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Build nodes and links dynamically based on non-zero values
  const nodes: SankeyNodeData[] = [];
  const links: { source: number; target: number; value: number }[] = [];
  
  let nodeIndex = 0;
  const nodeMap: Record<string, number> = {};
  const nodeValues: Record<string, number> = {};
  
  // Add asset nodes (left side)
  const addAssetNode = (name: string, value: number) => {
    if (value > 0) {
      nodes.push({ name, value });
      nodeMap[name] = nodeIndex++;
      nodeValues[name] = value;
      return true;
    }
    return false;
  };
  
  // Add asset categories with clearer names
  addAssetNode("Cash & Savings", data.liquidAssets);
  addAssetNode("Investment Portfolio", data.investments);
  addAssetNode("Retirement Accounts", data.retirement);
  addAssetNode("Real Estate", data.realEstate);
  addAssetNode("Business Assets", data.business);
  addAssetNode("Other Assets", data.otherAssets);
  
  // Calculate total assets flowing in
  const totalAssetsFlow = data.liquidAssets + data.investments + data.retirement + 
    data.realEstate + data.business + data.otherAssets;
  
  // Add center node (Net Zakatable Wealth)
  nodes.push({ name: "Net Zakatable Wealth", value: data.netZakatableWealth });
  const netZakatableIndex = nodeIndex++;
  nodeMap["Net Zakatable Wealth"] = netZakatableIndex;
  nodeValues["Net Zakatable Wealth"] = data.netZakatableWealth;
  
  // Add final node (Zakat Due)
  if (data.zakatDue > 0) {
    nodes.push({ name: "Zakat Due (2.5%)", value: data.zakatDue });
    nodeMap["Zakat Due (2.5%)"] = nodeIndex++;
    nodeValues["Zakat Due (2.5%)"] = data.zakatDue;
  }
  
  // Create links from assets to net zakatable
  if (data.liquidAssets > 0) {
    links.push({ source: nodeMap["Cash & Savings"], target: netZakatableIndex, value: data.liquidAssets });
  }
  if (data.investments > 0) {
    links.push({ source: nodeMap["Investment Portfolio"], target: netZakatableIndex, value: data.investments });
  }
  if (data.retirement > 0) {
    links.push({ source: nodeMap["Retirement Accounts"], target: netZakatableIndex, value: data.retirement });
  }
  if (data.realEstate > 0) {
    links.push({ source: nodeMap["Real Estate"], target: netZakatableIndex, value: data.realEstate });
  }
  if (data.business > 0) {
    links.push({ source: nodeMap["Business Assets"], target: netZakatableIndex, value: data.business });
  }
  if (data.otherAssets > 0) {
    links.push({ source: nodeMap["Other Assets"], target: netZakatableIndex, value: data.otherAssets });
  }
  
  // Link from net zakatable to zakat due
  if (data.zakatDue > 0 && nodeMap["Zakat Due (2.5%)"] !== undefined) {
    links.push({ 
      source: netZakatableIndex, 
      target: nodeMap["Zakat Due (2.5%)"], 
      value: data.zakatDue 
    });
  }
  
  // Return empty state if no data
  if (links.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-muted-foreground">
        No assets to display
      </div>
    );
  }
  
  const sankeyData = { nodes, links };
  
  // Custom node renderer
  const CustomNode = (props: any) => {
    const { x, y, width: nodeWidth, height: nodeHeight, index, payload } = props;
    const name = payload?.name || nodes[index]?.name || "";
    const color = ASSET_COLORS[name] || "hsl(var(--muted))";
    const nodeValue = nodeValues[name] || 0;
    
    // Determine label position based on node position
    const isLeftSide = x < width / 3;
    const isRightSide = x > (width * 2) / 3;
    const isCenter = !isLeftSide && !isRightSide;
    
    return (
      <Layer>
        <Rectangle
          x={x}
          y={y}
          width={nodeWidth}
          height={nodeHeight}
          fill={color}
          fillOpacity={0.9}
          rx={4}
          ry={4}
        />
        {showLabels && nodeHeight > 15 && (
          <>
            <text
              x={isLeftSide ? x - 8 : isRightSide ? x + nodeWidth + 8 : x + nodeWidth / 2}
              y={y + nodeHeight / 2 - 6}
              textAnchor={isLeftSide ? "end" : isRightSide ? "start" : "middle"}
              dominantBaseline="middle"
              className="fill-foreground text-xs font-semibold"
              style={{ fontSize: '11px' }}
            >
              {name}
            </text>
            <text
              x={isLeftSide ? x - 8 : isRightSide ? x + nodeWidth + 8 : x + nodeWidth / 2}
              y={y + nodeHeight / 2 + 8}
              textAnchor={isLeftSide ? "end" : isRightSide ? "start" : "middle"}
              dominantBaseline="middle"
              className="fill-muted-foreground text-xs"
              style={{ fontSize: '10px' }}
            >
              {formatCurrency(nodeValue, currency)}
            </text>
          </>
        )}
      </Layer>
    );
  };
  
  // Custom link renderer with gradient
  const CustomLink = (props: any) => {
    const { sourceX, sourceY, sourceControlX, targetX, targetY, targetControlX, linkWidth, index } = props;
    const link = links[index];
    if (!link) return null;
    
    const sourceName = nodes[link.source]?.name || "";
    const targetName = nodes[link.target]?.name || "";
    const sourceColor = ASSET_COLORS[sourceName] || "hsl(var(--muted))";
    const targetColor = ASSET_COLORS[targetName] || "hsl(var(--muted))";
    
    const gradientId = `gradient-${index}`;
    
    const path = `
      M${sourceX},${sourceY}
      C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}
      L${targetX},${targetY + linkWidth}
      C${targetControlX},${targetY + linkWidth} ${sourceControlX},${sourceY + linkWidth} ${sourceX},${sourceY + linkWidth}
      Z
    `;
    
    return (
      <Layer>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={sourceColor} stopOpacity={0.5} />
            <stop offset="100%" stopColor={targetColor} stopOpacity={0.3} />
          </linearGradient>
        </defs>
        <path
          d={path}
          fill={`url(#${gradientId})`}
          stroke="none"
          className="transition-opacity hover:opacity-80"
        />
      </Layer>
    );
  };

  const chartElement = (
    <Sankey
      width={width}
      height={height}
      data={sankeyData}
      node={<CustomNode />}
      link={<CustomLink />}
      nodePadding={30}
      nodeWidth={14}
      linkCurvature={0.5}
      margin={{ top: 20, right: showLabels ? 140 : 30, bottom: 20, left: showLabels ? 140 : 30 }}
    >
      <Tooltip
        content={({ payload }) => {
          if (!payload || payload.length === 0) return null;
          const item = payload[0]?.payload;
          if (!item) return null;
          
          // Check if it's a link (has source and target)
          if (item.source !== undefined && item.target !== undefined) {
            const sourceName = nodes[item.source]?.name || "Source";
            const targetName = nodes[item.target]?.name || "Target";
            const value = item.value;
            
            if (typeof value !== 'number' || isNaN(value)) return null;
            
            return (
              <div className="bg-popover border border-border rounded-lg px-4 py-3 shadow-lg">
                <p className="text-sm font-semibold text-foreground mb-1">
                  {sourceName}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  → {targetName}
                </p>
                <p className="text-base font-bold text-foreground">
                  {formatCurrency(value, currency)}
                </p>
              </div>
            );
          }
          
          // Node tooltip
          const nodeName = item.name || "Unknown";
          const nodeValue = nodeValues[nodeName];
          
          if (typeof nodeValue !== 'number' || isNaN(nodeValue)) return null;
          
          // Get description based on node type
          let description = "";
          if (nodeName === "Cash & Savings") {
            description = "Bank accounts, cash, gold, silver, crypto";
          } else if (nodeName === "Investment Portfolio") {
            description = "Stocks, bonds, mutual funds, brokerage accounts";
          } else if (nodeName === "Retirement Accounts") {
            description = "401(k), IRA, pension plans (after tax/penalty)";
          } else if (nodeName === "Real Estate") {
            description = "Investment properties held for income";
          } else if (nodeName === "Business Assets") {
            description = "Inventory, receivables, cash in business";
          } else if (nodeName === "Net Zakatable Wealth") {
            description = "Total wealth eligible for Zakat calculation";
          } else if (nodeName === "Zakat Due (2.5%)") {
            description = "Your obligatory Zakat payment";
          }
          
          return (
            <div className="bg-popover border border-border rounded-lg px-4 py-3 shadow-lg max-w-xs">
              <p className="text-sm font-semibold text-foreground">{nodeName}</p>
              {description && (
                <p className="text-xs text-muted-foreground mt-1 mb-2">{description}</p>
              )}
              <p className="text-base font-bold text-foreground">
                {formatCurrency(nodeValue, currency)}
              </p>
            </div>
          );
        }}
      />
    </Sankey>
  );
  
  if (showFullscreenButton) {
    return (
      <div className="w-full relative">
        <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 z-10 gap-1"
            >
              <Maximize2 className="w-4 h-4" />
              <span className="hidden sm:inline">Full View</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl w-[95vw] h-[85vh] p-0">
            <DialogHeader className="px-6 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl">Asset Flow to Zakat</DialogTitle>
              </div>
            </DialogHeader>
            <div className="flex-1 overflow-auto p-6">
              <div className="flex flex-col items-center justify-center min-h-[500px]">
                <ZakatSankeyChart
                  data={data}
                  currency={currency}
                  width={900}
                  height={500}
                  showLabels={true}
                  showFullscreenButton={false}
                />
                {/* Fullscreen Legend */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-4xl">
                  {data.liquidAssets > 0 && (
                    <LegendCard 
                      name="Cash & Savings" 
                      value={data.liquidAssets} 
                      currency={currency}
                      description="Bank accounts, cash on hand, gold, silver, crypto"
                      color={ASSET_COLORS["Cash & Savings"]}
                    />
                  )}
                  {data.investments > 0 && (
                    <LegendCard 
                      name="Investment Portfolio" 
                      value={data.investments} 
                      currency={currency}
                      description="Stocks, bonds, mutual funds, brokerage"
                      color={ASSET_COLORS["Investment Portfolio"]}
                    />
                  )}
                  {data.retirement > 0 && (
                    <LegendCard 
                      name="Retirement Accounts" 
                      value={data.retirement} 
                      currency={currency}
                      description="401(k), IRA, pension (after penalties)"
                      color={ASSET_COLORS["Retirement Accounts"]}
                    />
                  )}
                  {data.realEstate > 0 && (
                    <LegendCard 
                      name="Real Estate" 
                      value={data.realEstate} 
                      currency={currency}
                      description="Investment properties for income"
                      color={ASSET_COLORS["Real Estate"]}
                    />
                  )}
                  {data.business > 0 && (
                    <LegendCard 
                      name="Business Assets" 
                      value={data.business} 
                      currency={currency}
                      description="Inventory, receivables, business cash"
                      color={ASSET_COLORS["Business Assets"]}
                    />
                  )}
                  {data.otherAssets > 0 && (
                    <LegendCard 
                      name="Other Assets" 
                      value={data.otherAssets} 
                      currency={currency}
                      description="Trusts, debts owed to you, other"
                      color={ASSET_COLORS["Other Assets"]}
                    />
                  )}
                </div>
                {/* Summary Stats */}
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <div className="bg-muted rounded-lg px-6 py-4 text-center">
                    <p className="text-sm text-muted-foreground">Net Zakatable</p>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(data.netZakatableWealth, currency)}</p>
                  </div>
                  <div className="bg-primary rounded-lg px-6 py-4 text-center">
                    <p className="text-sm text-primary-foreground/80">Zakat Due @ 2.5%</p>
                    <p className="text-2xl font-bold text-primary-foreground">{formatCurrency(data.zakatDue, currency)}</p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <div className="overflow-hidden">
          {chartElement}
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full overflow-hidden">
      {chartElement}
    </div>
  );
}

function LegendCard({ 
  name, 
  value, 
  currency, 
  description, 
  color 
}: { 
  name: string; 
  value: number; 
  currency: string; 
  description: string;
  color: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        <span className="font-semibold text-sm text-foreground">{name}</span>
      </div>
      <p className="text-xs text-muted-foreground mb-2">{description}</p>
      <p className="font-bold text-lg text-foreground">{formatCurrency(value, currency)}</p>
    </div>
  );
}

// Mini version for landing page mock
export function ZakatSankeyMock() {
  const mockData: SankeyChartData = {
    liquidAssets: 24500,
    investments: 67800,
    retirement: 38200,
    realEstate: 0,
    business: 0,
    otherAssets: 11850,
    totalLiabilities: 8500,
    zakatDue: 3346,
    netZakatableWealth: 133850,
    zakatRate: 0.025,
  };
  
  return (
    <div className="w-full">
      <ZakatSankeyChart 
        data={mockData} 
        currency="USD" 
        width={340} 
        height={220}
        showLabels={true}
        showFullscreenButton={false}
      />
    </div>
  );
}
