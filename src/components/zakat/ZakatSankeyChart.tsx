import { formatCurrency } from "@/lib/zakatCalculations";
import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";

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
  "Cash & Savings": "#22c55e", // Green - Full 2.5%
  "Investment Portfolio": "#3b82f6", // Blue - May have 30% rule
  "Retirement Accounts": "#8b5cf6", // Purple - Tax/penalty deductions
  "Real Estate": "#f97316", // Orange - Business assets
  "Business Assets": "#ec4899", // Pink - Business assets  
  "Other Assets": "#06b6d4", // Cyan
  "Net Zakatable Wealth": "#64748b", // Slate
  "Zakat Due": "#22c55e", // Green for Zakat
};

// Asset descriptions for tooltips
const ASSET_DESCRIPTIONS: Record<string, string> = {
  "Cash & Savings": "Bank accounts, cash, gold, silver, crypto",
  "Investment Portfolio": "Stocks, bonds, mutual funds, brokerage",
  "Retirement Accounts": "401(k), IRA, pension (after tax/penalty)",
  "Real Estate": "Investment properties for income",
  "Business Assets": "Inventory, receivables, business cash",
  "Other Assets": "Trusts, debts owed to you, other",
  "Net Zakatable Wealth": "Total wealth eligible for Zakat",
  "Zakat Due": "Your obligatory Zakat payment (2.5%)",
};

interface ZakatSankeyChartProps {
  data: SankeyChartData;
  currency: string;
  width?: number;
  height?: number;
  showLabels?: boolean;
  showFullscreenButton?: boolean;
}

interface FlowNode {
  name: string;
  value: number;
  color: string;
  x: number;
  y: number;
  height: number;
}

interface FlowLink {
  source: FlowNode;
  target: FlowNode;
  value: number;
  sourceY: number;
  targetY: number;
}

interface TooltipData {
  name: string;
  value: number;
  description: string;
  x: number;
  y: number;
  isLink?: boolean;
  sourceName?: string;
  targetName?: string;
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
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  
  // Calculate layout
  const { nodes, links, leftNodes, rightNode, zakatNode } = useMemo(() => {
    const leftNodes: FlowNode[] = [];
    const nodeWidth = 14;
    const padding = showLabels ? 140 : 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - 40;
    
    // Build left side nodes (assets)
    const assetData = [
      { name: "Cash & Savings", value: data.liquidAssets },
      { name: "Investment Portfolio", value: data.investments },
      { name: "Retirement Accounts", value: data.retirement },
      { name: "Real Estate", value: data.realEstate },
      { name: "Business Assets", value: data.business },
      { name: "Other Assets", value: data.otherAssets },
    ].filter(a => a.value > 0);
    
    const totalAssets = assetData.reduce((sum, a) => sum + a.value, 0);
    if (totalAssets === 0) return { nodes: [], links: [], leftNodes: [], rightNode: null, zakatNode: null };
    
    // Calculate heights proportionally
    const minHeight = 20;
    const nodePadding = 8;
    const availableHeight = chartHeight - (assetData.length - 1) * nodePadding;
    
    let currentY = 20;
    assetData.forEach(asset => {
      const proportionalHeight = (asset.value / totalAssets) * availableHeight;
      const nodeHeight = Math.max(minHeight, proportionalHeight);
      
      leftNodes.push({
        name: asset.name,
        value: asset.value,
        color: ASSET_COLORS[asset.name] || "#64748b",
        x: padding,
        y: currentY,
        height: nodeHeight,
      });
      
      currentY += nodeHeight + nodePadding;
    });
    
    // Center node (Net Zakatable Wealth)
    const centerX = padding + chartWidth / 2 - nodeWidth / 2;
    const rightNode: FlowNode = {
      name: "Net Zakatable Wealth",
      value: data.netZakatableWealth,
      color: ASSET_COLORS["Net Zakatable Wealth"],
      x: centerX,
      y: 20,
      height: chartHeight,
    };
    
    // Zakat Due node (right side)
    const zakatNode: FlowNode | null = data.zakatDue > 0 ? {
      name: "Zakat Due",
      value: data.zakatDue,
      color: ASSET_COLORS["Zakat Due"],
      x: width - padding - nodeWidth,
      y: 20,
      height: Math.max(40, chartHeight * 0.3),
    } : null;
    
    // Build links
    const links: FlowLink[] = [];
    let sourceYOffset = 0;
    
    leftNodes.forEach(node => {
      const linkHeight = (node.value / totalAssets) * chartHeight;
      links.push({
        source: node,
        target: rightNode,
        value: node.value,
        sourceY: node.y + node.height / 2,
        targetY: 20 + sourceYOffset + linkHeight / 2,
      });
      sourceYOffset += linkHeight;
    });
    
    // Link from center to zakat
    if (zakatNode) {
      links.push({
        source: rightNode,
        target: zakatNode,
        value: data.zakatDue,
        sourceY: rightNode.y + rightNode.height / 2,
        targetY: zakatNode.y + zakatNode.height / 2,
      });
    }
    
    return { 
      nodes: [...leftNodes, rightNode, ...(zakatNode ? [zakatNode] : [])], 
      links, 
      leftNodes, 
      rightNode, 
      zakatNode 
    };
  }, [data, width, height, showLabels]);
  
  if (nodes.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-muted-foreground">
        No assets to display
      </div>
    );
  }
  
  const nodeWidth = 14;
  const padding = showLabels ? 140 : 40;
  
  // Generate curved path for links
  const generatePath = (link: FlowLink, linkWidth: number) => {
    const sourceX = link.source.x + nodeWidth;
    const sourceY = link.sourceY;
    const targetX = link.target.x;
    const targetY = link.targetY;
    
    const midX = (sourceX + targetX) / 2;
    
    return `
      M ${sourceX} ${sourceY - linkWidth / 2}
      C ${midX} ${sourceY - linkWidth / 2}, ${midX} ${targetY - linkWidth / 2}, ${targetX} ${targetY - linkWidth / 2}
      L ${targetX} ${targetY + linkWidth / 2}
      C ${midX} ${targetY + linkWidth / 2}, ${midX} ${sourceY + linkWidth / 2}, ${sourceX} ${sourceY + linkWidth / 2}
      Z
    `;
  };
  
  const handleNodeHover = (node: FlowNode, e: React.MouseEvent) => {
    const rect = (e.target as SVGElement).getBoundingClientRect();
    const svgRect = (e.currentTarget.closest('svg') as SVGElement)?.getBoundingClientRect();
    if (!svgRect) return;
    
    setTooltip({
      name: node.name,
      value: node.value,
      description: ASSET_DESCRIPTIONS[node.name] || "",
      x: rect.left - svgRect.left + rect.width / 2,
      y: rect.top - svgRect.top,
    });
  };
  
  const handleLinkHover = (link: FlowLink, e: React.MouseEvent) => {
    const rect = (e.target as SVGElement).getBoundingClientRect();
    const svgRect = (e.currentTarget.closest('svg') as SVGElement)?.getBoundingClientRect();
    if (!svgRect) return;
    
    setTooltip({
      name: `${link.source.name} → ${link.target.name}`,
      value: link.value,
      description: `Flow from ${link.source.name}`,
      x: rect.left - svgRect.left + rect.width / 2,
      y: rect.top - svgRect.top,
      isLink: true,
      sourceName: link.source.name,
      targetName: link.target.name,
    });
  };
  
  const totalAssets = leftNodes.reduce((sum, n) => sum + n.value, 0);

  const chartElement = (
    <div className="relative">
      <svg width={width} height={height} className="overflow-visible">
        {/* Links */}
        {links.map((link, i) => {
          const linkWidth = Math.max(4, (link.value / totalAssets) * (height - 60));
          return (
            <path
              key={`link-${i}`}
              d={generatePath(link, linkWidth)}
              fill={link.source.color}
              fillOpacity={0.3}
              className="cursor-pointer transition-all duration-200 hover:fill-opacity-50"
              onMouseEnter={(e) => handleLinkHover(link, e)}
              onMouseLeave={() => setTooltip(null)}
            />
          );
        })}
        
        {/* Nodes */}
        {nodes.map((node, i) => {
          // Determine label position based on node position
          const isLeftSide = node.x < width * 0.35;
          const isRightSide = node.x > width * 0.65;
          const isCenter = !isLeftSide && !isRightSide;
          
          return (
            <g key={`node-${i}`}>
              <rect
                x={node.x}
                y={node.y}
                width={nodeWidth}
                height={node.height}
                fill={node.color}
                rx={4}
                className="cursor-pointer transition-all duration-200 hover:opacity-80"
                onMouseEnter={(e) => handleNodeHover(node, e)}
                onMouseLeave={() => setTooltip(null)}
              />
              {showLabels && (
                <>
                  {isCenter ? (
                    <>
                      {/* Center labels go below the node */}
                      <text
                        x={node.x + nodeWidth / 2}
                        y={node.y + node.height + 16}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-foreground text-xs font-semibold pointer-events-none"
                        style={{ fontSize: '10px' }}
                      >
                        {node.name}
                      </text>
                      <text
                        x={node.x + nodeWidth / 2}
                        y={node.y + node.height + 28}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-muted-foreground text-xs pointer-events-none"
                        style={{ fontSize: '9px' }}
                      >
                        {formatCurrency(node.value, currency)}
                      </text>
                    </>
                  ) : (
                    <>
                      {/* Side labels go to the side */}
                      <text
                        x={isLeftSide ? node.x - 8 : node.x + nodeWidth + 8}
                        y={node.y + node.height / 2 - 6}
                        textAnchor={isLeftSide ? "end" : "start"}
                        dominantBaseline="middle"
                        className="fill-foreground text-xs font-semibold pointer-events-none"
                        style={{ fontSize: '11px' }}
                      >
                        {node.name}
                      </text>
                      <text
                        x={isLeftSide ? node.x - 8 : node.x + nodeWidth + 8}
                        y={node.y + node.height / 2 + 8}
                        textAnchor={isLeftSide ? "end" : "start"}
                        dominantBaseline="middle"
                        className="fill-muted-foreground text-xs pointer-events-none"
                        style={{ fontSize: '10px' }}
                      >
                        {formatCurrency(node.value, currency)}
                      </text>
                    </>
                  )}
                </>
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Tooltip */}
      {tooltip && (
        <div 
          className="absolute bg-popover border border-border rounded-lg px-4 py-3 shadow-lg z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{ 
            left: tooltip.x, 
            top: tooltip.y - 8,
            minWidth: '160px',
          }}
        >
          <p className="text-sm font-semibold text-foreground">{tooltip.name}</p>
          {tooltip.description && (
            <p className="text-xs text-muted-foreground mt-1 mb-2">{tooltip.description}</p>
          )}
          <p className="text-base font-bold text-foreground">
            {formatCurrency(tooltip.value, currency)}
          </p>
        </div>
      )}
    </div>
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

const LegendCard = ({ 
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
}) => {
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
};

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
