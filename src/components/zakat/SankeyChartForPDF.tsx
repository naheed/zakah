import { formatCurrency } from "@/lib/zakatCalculations";
import { useMemo } from "react";

export interface SankeyPDFData {
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

const ASSET_COLORS: Record<string, string> = {
  "Cash & Savings": "#22c55e",
  "Investment Portfolio": "#3b82f6",
  "Retirement Accounts": "#8b5cf6",
  "Real Estate": "#f97316",
  "Business Assets": "#ec4899",
  "Other Assets": "#06b6d4",
  "Net Zakatable Wealth": "#64748b",
  "Zakat Due": "#22c55e",
};

interface SankeyChartForPDFProps {
  data: SankeyPDFData;
  currency: string;
  width?: number;
  height?: number;
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
  color: string;
  originalAssetName?: string;
}

/**
 * A simplified, static Sankey chart component designed for PDF capture.
 * No hover states, no animations - just clean, crisp SVG rendering.
 */
export function SankeyChartForPDF({ 
  data, 
  currency, 
  width = 500, 
  height = 300,
}: SankeyChartForPDFProps) {
  
  const { nodes, links, leftNodes, centerNode, zakatNode, assetZakatContributions } = useMemo(() => {
    const leftNodes: FlowNode[] = [];
    const nodeWidth = 14;
    const padding = 120;
    const chartWidth = width - padding * 2;
    const chartHeight = height - 60;
    
    const assetData = [
      { name: "Cash & Savings", value: data.liquidAssets },
      { name: "Investment Portfolio", value: data.investments },
      { name: "Retirement Accounts", value: data.retirement },
      { name: "Real Estate", value: data.realEstate },
      { name: "Business Assets", value: data.business },
      { name: "Other Assets", value: data.otherAssets },
    ].filter(a => a.value > 0);
    
    const totalAssets = assetData.reduce((sum, a) => sum + a.value, 0);
    if (totalAssets === 0) return { nodes: [], links: [], leftNodes: [], centerNode: null, zakatNode: null, assetZakatContributions: {} };
    
    const assetZakatContributions: Record<string, number> = {};
    assetData.forEach(asset => {
      assetZakatContributions[asset.name] = (asset.value / totalAssets) * data.zakatDue;
    });
    
    const minHeight = 20;
    const nodePadding = 8;
    const availableHeight = chartHeight - (assetData.length - 1) * nodePadding;
    
    let currentY = 30;
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
    
    const centerX = padding + chartWidth * 0.45 - nodeWidth / 2;
    const centerNode: FlowNode = {
      name: "Net Zakatable Wealth",
      value: data.netZakatableWealth,
      color: ASSET_COLORS["Net Zakatable Wealth"],
      x: centerX,
      y: 30,
      height: chartHeight,
    };
    
    const zakatHeight = Math.max(40, chartHeight * 0.25);
    const zakatNode: FlowNode | null = data.zakatDue > 0 ? {
      name: "Zakat Due",
      value: data.zakatDue,
      color: ASSET_COLORS["Zakat Due"],
      x: width - padding - nodeWidth,
      y: 30 + (chartHeight - zakatHeight) / 2,
      height: zakatHeight,
    } : null;
    
    const links: FlowLink[] = [];
    let sourceYOffset = 0;
    const centerFlowTopByAsset: Record<string, number> = {};

    leftNodes.forEach((node) => {
      const linkHeight = (node.value / totalAssets) * chartHeight;
      const targetY = 30 + sourceYOffset + linkHeight / 2;
      const leftLinkWidth = Math.max(4, (node.value / totalAssets) * (height - 80));
      centerFlowTopByAsset[node.name] = targetY - leftLinkWidth / 2;

      links.push({
        source: node,
        target: centerNode,
        value: node.value,
        sourceY: node.y + node.height / 2,
        targetY,
        color: node.color,
        originalAssetName: node.name,
      });
      sourceYOffset += linkHeight;
    });

    if (zakatNode) {
      let centerYOffset = 0;
      let zakatYOffset = 0;
      const totalZakatHeight = zakatNode.height;

      leftNodes.forEach((node) => {
        const zakatContribution = assetZakatContributions[node.name] || 0;
        if (zakatContribution > 0) {
          const proportionOfZakat = zakatContribution / data.zakatDue;
          const rightLinkWidth = Math.max(3, proportionOfZakat * totalZakatHeight);
          const assetProportion = node.value / totalAssets;
          const assetPortionHeight = assetProportion * chartHeight;
          const sourceTop = centerFlowTopByAsset[node.name] ?? (30 + centerYOffset);
          const centerBarYForAsset = sourceTop + rightLinkWidth / 2;

          links.push({
            source: centerNode,
            target: zakatNode,
            value: zakatContribution,
            sourceY: centerBarYForAsset,
            targetY: zakatNode.y + zakatYOffset + rightLinkWidth / 2,
            color: node.color,
            originalAssetName: node.name,
          });

          centerYOffset += assetPortionHeight;
          zakatYOffset += rightLinkWidth;
        }
      });
    }
    
    return { 
      nodes: [...leftNodes, centerNode, ...(zakatNode ? [zakatNode] : [])], 
      links, 
      leftNodes, 
      centerNode, 
      zakatNode,
      assetZakatContributions,
    };
  }, [data, width, height]);
  
  if (nodes.length === 0) {
    return (
      <div style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
        No assets to display
      </div>
    );
  }
  
  const nodeWidth = 14;
  
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
  
  const totalAssets = leftNodes.reduce((sum, n) => sum + n.value, 0);

  return (
    <div 
      style={{ 
        width, 
        height, 
        backgroundColor: '#FAF9F7',
        fontFamily: "'Work Sans', sans-serif",
      }}
    >
      <svg width={width} height={height}>
        {/* Links */}
        {links.map((link, i) => {
          const isZakatLink = link.target.name === "Zakat Due";
          const linkWidth = isZakatLink 
            ? Math.max(3, (link.value / data.zakatDue) * (zakatNode?.height || 60))
            : Math.max(4, (link.value / totalAssets) * (height - 80));
          
          return (
            <path
              key={`link-${i}`}
              d={generatePath(link, linkWidth)}
              fill={link.color}
              fillOpacity={isZakatLink ? 0.5 : 0.3}
            />
          );
        })}
        
        {/* Nodes with labels */}
        {nodes.map((node, i) => {
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
              />
              {isCenter ? (
                <>
                  <text
                    x={node.x + nodeWidth / 2}
                    y={node.y + node.height + 16}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#1C1A18"
                    fontSize="10"
                    fontWeight="600"
                    fontFamily="'Work Sans', sans-serif"
                  >
                    {node.name}
                  </text>
                  <text
                    x={node.x + nodeWidth / 2}
                    y={node.y + node.height + 28}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#807666"
                    fontSize="9"
                    fontFamily="'Work Sans', sans-serif"
                  >
                    {formatCurrency(node.value, currency)}
                  </text>
                </>
              ) : (
                <>
                  <text
                    x={isLeftSide ? node.x - 8 : node.x + nodeWidth + 8}
                    y={node.y + node.height / 2 - 6}
                    textAnchor={isLeftSide ? "end" : "start"}
                    dominantBaseline="middle"
                    fill="#1C1A18"
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="'Work Sans', sans-serif"
                  >
                    {node.name}
                  </text>
                  <text
                    x={isLeftSide ? node.x - 8 : node.x + nodeWidth + 8}
                    y={node.y + node.height / 2 + 8}
                    textAnchor={isLeftSide ? "end" : "start"}
                    dominantBaseline="middle"
                    fill="#807666"
                    fontSize="10"
                    fontFamily="'Work Sans', sans-serif"
                  >
                    {formatCurrency(node.value, currency)}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
