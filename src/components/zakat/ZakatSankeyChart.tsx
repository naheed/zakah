import { Sankey, Tooltip, Rectangle, Layer } from "recharts";
import { formatCurrency } from "@/lib/zakatCalculations";

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

// Color coding by Zakat treatment:
// Green shades: Full 2.5% (cash, gold, crypto)
// Blue shades: May have deductions (investments with 30% rule, retirement with tax/penalty)
// Purple: Other assets (trusts, debt owed, illiquid)
// Orange: Real estate / business
const ASSET_COLORS: Record<string, string> = {
  "Cash & Liquid": "hsl(var(--chart-1))",
  "Investments": "hsl(var(--chart-2))",
  "Retirement": "hsl(var(--chart-3))",
  "Real Estate": "hsl(var(--chart-4))",
  "Business": "hsl(var(--chart-5))",
  "Other Assets": "hsl(var(--primary))",
  "Net Zakatable": "hsl(var(--accent-foreground))",
  "Deductions": "hsl(var(--destructive))",
  "Zakat Due": "hsl(142, 76%, 36%)", // Green for Zakat
};

interface ZakatSankeyChartProps {
  data: SankeyChartData;
  currency: string;
  width?: number;
  height?: number;
  showLabels?: boolean;
}

export function ZakatSankeyChart({ 
  data, 
  currency, 
  width = 500, 
  height = 300,
  showLabels = true 
}: ZakatSankeyChartProps) {
  // Build nodes and links dynamically based on non-zero values
  const nodes: { name: string }[] = [];
  const links: { source: number; target: number; value: number }[] = [];
  
  let nodeIndex = 0;
  const nodeMap: Record<string, number> = {};
  
  // Add asset nodes (left side)
  const addAssetNode = (name: string, value: number) => {
    if (value > 0) {
      nodes.push({ name });
      nodeMap[name] = nodeIndex++;
      return true;
    }
    return false;
  };
  
  // Add asset categories
  addAssetNode("Cash & Liquid", data.liquidAssets);
  addAssetNode("Investments", data.investments);
  addAssetNode("Retirement", data.retirement);
  addAssetNode("Real Estate", data.realEstate);
  addAssetNode("Business", data.business);
  addAssetNode("Other Assets", data.otherAssets);
  
  // Add center node (Net Zakatable Wealth)
  nodes.push({ name: "Net Zakatable" });
  const netZakatableIndex = nodeIndex++;
  nodeMap["Net Zakatable"] = netZakatableIndex;
  
  // Add deductions node if applicable
  if (data.totalLiabilities > 0) {
    nodes.push({ name: "Deductions" });
    nodeMap["Deductions"] = nodeIndex++;
  }
  
  // Add final node (Zakat Due)
  if (data.zakatDue > 0) {
    nodes.push({ name: "Zakat Due" });
    nodeMap["Zakat Due"] = nodeIndex++;
  }
  
  // Create links from assets to net zakatable
  if (data.liquidAssets > 0) {
    links.push({ source: nodeMap["Cash & Liquid"], target: netZakatableIndex, value: data.liquidAssets });
  }
  if (data.investments > 0) {
    links.push({ source: nodeMap["Investments"], target: netZakatableIndex, value: data.investments });
  }
  if (data.retirement > 0) {
    links.push({ source: nodeMap["Retirement"], target: netZakatableIndex, value: data.retirement });
  }
  if (data.realEstate > 0) {
    links.push({ source: nodeMap["Real Estate"], target: netZakatableIndex, value: data.realEstate });
  }
  if (data.business > 0) {
    links.push({ source: nodeMap["Business"], target: netZakatableIndex, value: data.business });
  }
  if (data.otherAssets > 0) {
    links.push({ source: nodeMap["Other Assets"], target: netZakatableIndex, value: data.otherAssets });
  }
  
  // Link from net zakatable to zakat due
  if (data.zakatDue > 0 && nodeMap["Zakat Due"] !== undefined) {
    links.push({ 
      source: netZakatableIndex, 
      target: nodeMap["Zakat Due"], 
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
        {showLabels && nodeHeight > 20 && (
          <text
            x={x < width / 2 ? x - 5 : x + nodeWidth + 5}
            y={y + nodeHeight / 2}
            textAnchor={x < width / 2 ? "end" : "start"}
            dominantBaseline="middle"
            className="fill-foreground text-xs font-medium"
          >
            {name}
          </text>
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
    const sourceColor = ASSET_COLORS[sourceName] || "hsl(var(--muted))";
    
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
            <stop offset="0%" stopColor={sourceColor} stopOpacity={0.6} />
            <stop offset="100%" stopColor={ASSET_COLORS["Net Zakatable"]} stopOpacity={0.3} />
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
  
  return (
    <div className="w-full overflow-hidden">
      <Sankey
        width={width}
        height={height}
        data={sankeyData}
        node={<CustomNode />}
        link={<CustomLink />}
        nodePadding={24}
        nodeWidth={12}
        linkCurvature={0.5}
        margin={{ top: 10, right: showLabels ? 100 : 20, bottom: 10, left: showLabels ? 100 : 20 }}
      >
        <Tooltip
          content={({ payload }) => {
            if (!payload || payload.length === 0) return null;
            const data = payload[0]?.payload;
            if (!data) return null;
            
            if (data.source !== undefined && data.target !== undefined) {
              // Link tooltip
              return (
                <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
                  <p className="text-sm font-medium text-foreground">
                    {nodes[data.source]?.name} → {nodes[data.target]?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(data.value, currency)}
                  </p>
                </div>
              );
            }
            
            // Node tooltip
            return (
              <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
                <p className="text-sm font-medium text-foreground">{data.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(data.value, currency)}
                </p>
              </div>
            );
          }}
        />
      </Sankey>
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
    zakatDue: 2847,
    netZakatableWealth: 133850,
    zakatRate: 0.025,
  };
  
  return (
    <div className="w-full">
      <ZakatSankeyChart 
        data={mockData} 
        currency="USD" 
        width={340} 
        height={200}
        showLabels={true}
      />
    </div>
  );
}
