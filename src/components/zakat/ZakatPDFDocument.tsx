import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
  Svg,
  Rect,
  Path,
} from "@react-pdf/renderer";

import loraRegular from "@/assets/pdf-fonts/Lora-Regular.ttf?url";
import loraItalic from "@/assets/pdf-fonts/Lora-Italic.ttf?url";
import loraSemiBold from "@/assets/pdf-fonts/Lora-SemiBold.ttf?url";
import workSansRegular from "@/assets/pdf-fonts/WorkSans-Regular.ttf?url";
import workSansMedium from "@/assets/pdf-fonts/WorkSans-Medium.ttf?url";
import workSansSemiBold from "@/assets/pdf-fonts/WorkSans-SemiBold.ttf?url";

// Register fonts from bundled local TTF files.
// Using imports is more reliable than absolute "/fonts" paths (especially in embedded previews).
Font.register({
  family: "Lora",
  fonts: [
    { src: loraRegular, fontWeight: 400 },
    { src: loraItalic, fontWeight: 400, fontStyle: "italic" },
    { src: loraSemiBold, fontWeight: 600 },
  ],
});

Font.register({
  family: "WorkSans",
  fonts: [
    { src: workSansRegular, fontWeight: 400 },
    { src: workSansMedium, fontWeight: 500 },
    { src: workSansSemiBold, fontWeight: 600 },
  ],
});

// Color palette
const COLORS = {
  pageBg: "#FAF9F7",
  cardBg: "#FFFFFF",
  headerBg: "#1C1A18",
  primary: "#10B981",
  gold: "#DAA520",
  text: "#1C1A18",
  textMuted: "#807666",
  textLight: "#B4AA9B",
  border: "#E2DCD2",
  danger: "#DC2626",
  // Asset colors
  cash: "#22C55E",
  investments: "#3B82F6",
  retirement: "#8B5CF6",
  realEstate: "#F97316",
  business: "#EC4899",
  other: "#06B6D4",
  netWealth: "#64748B",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.pageBg,
    padding: 24,
    fontFamily: "WorkSans",
    fontSize: 10,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 8,
    border: `1px solid ${COLORS.border}`,
    padding: 20,
  },
  // Bismillah section
  bismillahSection: {
    textAlign: "center",
    marginBottom: 16,
  },
  bismillahText: {
    fontFamily: "Lora",
    fontSize: 14,
    fontStyle: "italic",
    color: COLORS.text,
    marginBottom: 4,
  },
  bismillahEnglish: {
    fontSize: 9,
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  goldLine: {
    height: 1,
    backgroundColor: COLORS.gold,
    width: 80,
    marginHorizontal: "auto",
    marginVertical: 8,
  },
  // Header section
  headerBox: {
    backgroundColor: COLORS.headerBg,
    borderRadius: 6,
    padding: 16,
    marginBottom: 16,
  },
  headerAccent: {
    height: 3,
    backgroundColor: COLORS.primary,
    marginHorizontal: -16,
    marginTop: -16,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 8,
    color: "#C8C3BE",
    marginTop: 4,
  },
  dateLabel: {
    fontSize: 7,
    color: "#B4AFA5",
  },
  dateText: {
    fontSize: 9,
    fontWeight: 600,
    color: "#FFFFFF",
    marginTop: 2,
  },
  // Hero amount
  heroLabel: {
    fontSize: 9,
    color: "#C8C3BE",
    marginBottom: 4,
  },
  heroAmount: {
    fontFamily: "Lora",
    fontSize: 28,
    fontWeight: 600,
    color: "#FFFFFF",
  },
  heroAmountBelow: {
    fontFamily: "Lora",
    fontSize: 18,
    fontWeight: 600,
    color: "#FFFFFF",
  },
  // Sankey section
  sectionLabel: {
    fontSize: 9,
    fontWeight: 600,
    color: COLORS.textMuted,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  sankeyContainer: {
    marginBottom: 16,
    backgroundColor: COLORS.pageBg,
    borderRadius: 6,
    padding: 8,
  },
  // Asset breakdown table
  tableContainer: {
    marginBottom: 16,
  },
  tableBox: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 4,
    border: `1px solid ${COLORS.border}`,
    padding: 8,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  assetName: {
    flex: 1,
    fontSize: 9,
    color: COLORS.text,
  },
  assetPercent: {
    fontSize: 9,
    color: COLORS.textMuted,
    marginRight: 16,
    width: 40,
    textAlign: "right",
  },
  assetValue: {
    fontSize: 9,
    fontWeight: 600,
    color: COLORS.text,
    width: 80,
    textAlign: "right",
  },
  // Two-column layout
  twoColumn: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  column: {
    flex: 1,
  },
  columnBox: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 4,
    border: `1px solid ${COLORS.border}`,
    padding: 10,
  },
  ledgerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  ledgerLabel: {
    fontSize: 9,
    color: COLORS.textMuted,
  },
  ledgerValue: {
    fontSize: 9,
    fontWeight: 600,
    color: COLORS.text,
  },
  ledgerValueDanger: {
    fontSize: 9,
    fontWeight: 500,
    color: COLORS.danger,
  },
  // Purification alert
  alertBox: {
    backgroundColor: "#FFF8F0",
    border: `1px solid ${COLORS.border}`,
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
  },
  alertTitle: {
    fontSize: 9,
    fontWeight: 600,
    color: COLORS.danger,
    marginBottom: 4,
  },
  alertText: {
    fontSize: 8,
    color: COLORS.textMuted,
  },
  // Footer
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    marginTop: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 7,
    color: COLORS.textLight,
  },
});

// Types
export interface ZakatPDFData {
  currency: string;
  calendarType: "lunar" | "solar";
  nisabStandard: "gold" | "silver";
  zakatRate: number;
  totalAssets: number;
  totalLiabilities: number;
  netZakatableWealth: number;
  nisab: number;
  isAboveNisab: boolean;
  zakatDue: number;
  interestToPurify: number;
  dividendsToPurify: number;
  assetBreakdown: {
    liquidAssets: number;
    investments: number;
    retirement: number;
    realEstate: number;
    business: number;
    otherAssets: number;
  };
}

interface ZakatPDFDocumentProps {
  data: ZakatPDFData;
  calculationName?: string;
}

// Helper functions
function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(2)}%`;
}

function formatAllocationPercent(value: number, total: number): string {
  if (!total || total <= 0) return "0%";
  return `${((value / total) * 100).toFixed(0)}%`;
}

// Asset configuration
const ASSET_CONFIG: {
  key: keyof ZakatPDFData["assetBreakdown"];
  name: string;
  color: string;
}[] = [
  { key: "liquidAssets", name: "Cash & Savings", color: COLORS.cash },
  { key: "investments", name: "Investments", color: COLORS.investments },
  { key: "retirement", name: "Retirement", color: COLORS.retirement },
  { key: "realEstate", name: "Real Estate", color: COLORS.realEstate },
  { key: "business", name: "Business", color: COLORS.business },
  { key: "otherAssets", name: "Other", color: COLORS.other },
];

// Vector Sankey Chart Component
interface SankeyChartProps {
  data: ZakatPDFData;
  width: number;
  height: number;
}

function VectorSankeyChart({ data, width, height }: SankeyChartProps) {
  const padding = { left: 100, right: 80, top: 10, bottom: 30 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const nodeWidth = 12;

  // Get assets with positive values
  const assets = ASSET_CONFIG
    .map((cfg) => ({
      ...cfg,
      value: data.assetBreakdown[cfg.key] || 0,
    }))
    .filter((a) => a.value > 0)
    .sort((a, b) => b.value - a.value);

  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
  if (totalAssets === 0) {
    return (
      <Svg width={width} height={height}>
        <Rect x={0} y={0} width={width} height={height} fill={COLORS.pageBg} />
      </Svg>
    );
  }

  // Calculate node positions
  const nodePadding = 6;
  const availableHeight = chartHeight - (assets.length - 1) * nodePadding;
  
  // Left side nodes (assets)
  const leftNodes: { name: string; value: number; color: string; y: number; height: number }[] = [];
  let currentY = padding.top;
  assets.forEach((asset) => {
    const proportionalHeight = (asset.value / totalAssets) * availableHeight;
    const nodeHeight = Math.max(16, proportionalHeight);
    leftNodes.push({
      name: asset.name,
      value: asset.value,
      color: asset.color,
      y: currentY,
      height: nodeHeight,
    });
    currentY += nodeHeight + nodePadding;
  });

  // Center node (Net Zakatable Wealth)
  const centerX = padding.left + chartWidth * 0.5 - nodeWidth / 2;
  const centerNode = {
    x: centerX,
    y: padding.top,
    height: chartHeight,
    color: COLORS.netWealth,
    value: data.netZakatableWealth,
  };

  // Right node (Zakat Due)
  const zakatHeight = Math.max(30, chartHeight * 0.3);
  const rightNode = data.zakatDue > 0 ? {
    x: width - padding.right - nodeWidth,
    y: padding.top + (chartHeight - zakatHeight) / 2,
    height: zakatHeight,
    color: COLORS.primary,
    value: data.zakatDue,
  } : null;

  // Generate curved paths for links
  const generatePath = (
    sourceX: number, sourceY: number,
    targetX: number, targetY: number,
    linkHeight: number
  ): string => {
    const midX = (sourceX + targetX) / 2;
    return `
      M ${sourceX} ${sourceY - linkHeight / 2}
      C ${midX} ${sourceY - linkHeight / 2}, ${midX} ${targetY - linkHeight / 2}, ${targetX} ${targetY - linkHeight / 2}
      L ${targetX} ${targetY + linkHeight / 2}
      C ${midX} ${targetY + linkHeight / 2}, ${midX} ${sourceY + linkHeight / 2}, ${sourceX} ${sourceY + linkHeight / 2}
      Z
    `;
  };

  // Build links from assets to center
  let sourceYOffset = 0;
  const leftLinks = leftNodes.map((node) => {
    const linkHeight = (node.value / totalAssets) * chartHeight;
    const sourceY = node.y + node.height / 2;
    const targetY = padding.top + sourceYOffset + linkHeight / 2;
    sourceYOffset += linkHeight;
    return {
      path: generatePath(
        padding.left + nodeWidth, sourceY,
        centerX, targetY,
        Math.max(4, (node.value / totalAssets) * (height - 60))
      ),
      color: node.color,
      opacity: 0.35,
    };
  });

  // Build links from center to zakat
  const rightLinks: { path: string; color: string; opacity: number }[] = [];
  if (rightNode && data.zakatDue > 0) {
    let centerYOffset = 0;
    let zakatYOffset = 0;
    leftNodes.forEach((node) => {
      const assetContribution = (node.value / totalAssets) * data.zakatDue;
      const proportionOfZakat = assetContribution / data.zakatDue;
      const rightLinkHeight = Math.max(3, proportionOfZakat * rightNode.height);
      const assetPortionHeight = (node.value / totalAssets) * chartHeight;
      
      const sourceY = padding.top + centerYOffset + assetPortionHeight / 2;
      const targetY = rightNode.y + zakatYOffset + rightLinkHeight / 2;
      
      rightLinks.push({
        path: generatePath(
          centerX + nodeWidth, sourceY,
          rightNode.x, targetY,
          rightLinkHeight
        ),
        color: node.color,
        opacity: 0.5,
      });
      
      centerYOffset += assetPortionHeight;
      zakatYOffset += rightLinkHeight;
    });
  }

  return (
    <Svg width={width} height={height}>
      {/* Links from assets to center */}
      {leftLinks.map((link, i) => (
        <Path key={`left-${i}`} d={link.path} fill={link.color} fillOpacity={link.opacity} />
      ))}
      
      {/* Links from center to zakat */}
      {rightLinks.map((link, i) => (
        <Path key={`right-${i}`} d={link.path} fill={link.color} fillOpacity={link.opacity} />
      ))}
      
      {/* Left nodes (assets) */}
      {leftNodes.map((node, i) => (
        <React.Fragment key={`left-node-${i}`}>
          <Rect x={padding.left} y={node.y} width={nodeWidth} height={node.height} fill={node.color} rx={3} />
        </React.Fragment>
      ))}
      
      {/* Center node */}
      <Rect x={centerNode.x} y={centerNode.y} width={nodeWidth} height={centerNode.height} fill={centerNode.color} rx={3} />
      
      {/* Right node (zakat) */}
      {rightNode && (
        <Rect x={rightNode.x} y={rightNode.y} width={nodeWidth} height={rightNode.height} fill={rightNode.color} rx={3} />
      )}
    </Svg>
  );
}

// Main PDF Document Component
export function ZakatPDFDocument({ data, calculationName }: ZakatPDFDocumentProps) {
  const date = new Date();
  const dateStr = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

  const calendarLabel = data.calendarType === "lunar" ? "Lunar (Hijri)" : "Solar (Gregorian)";
  const nisabLabel = data.nisabStandard === "silver" ? "Silver Standard" : "Gold Standard";
  const totalPurification = data.interestToPurify + data.dividendsToPurify;

  // Get active assets for breakdown
  const activeAssets = ASSET_CONFIG
    .map((cfg) => ({
      ...cfg,
      value: data.assetBreakdown[cfg.key] || 0,
    }))
    .filter((a) => a.value > 0)
    .sort((a, b) => b.value - a.value);

  return (
    <Document title={calculationName || "Zakat Report"} author="ZakahFlow">
      <Page size="A4" style={styles.page}>
        <View style={styles.card}>
          {/* Bismillah Section */}
          <View style={styles.bismillahSection}>
            <Text style={styles.bismillahText}>Bismillāhir Raḥmānir Raḥīm</Text>
            <Text style={styles.bismillahEnglish}>
              In the name of Allah, the Most Gracious, the Most Merciful
            </Text>
            <View style={styles.goldLine} />
          </View>

          {/* Header with Hero Amount */}
          <View style={styles.headerBox}>
            <View style={styles.headerAccent} />
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.headerTitle}>ZAKAT REPORT</Text>
                <Text style={styles.headerSubtitle}>
                  {calendarLabel} • {formatPercent(data.zakatRate)} Rate
                </Text>
              </View>
              <View style={{ textAlign: "right" }}>
                <Text style={styles.dateLabel}>Generated</Text>
                <Text style={styles.dateText}>{dateStr}</Text>
              </View>
            </View>
            
            {data.isAboveNisab ? (
              <View>
                <Text style={styles.heroLabel}>Your Zakat Due</Text>
                <Text style={styles.heroAmount}>
                  {formatCurrency(data.zakatDue, data.currency)}
                </Text>
              </View>
            ) : (
              <View>
                <Text style={styles.heroLabel}>Below Nisāb Threshold</Text>
                <Text style={styles.heroAmountBelow}>No Zakat Due This Year</Text>
              </View>
            )}
          </View>

          {/* Sankey Chart */}
          <View style={styles.sankeyContainer}>
            <Text style={styles.sectionLabel}>ASSET FLOW TO ZAKAT</Text>
            <VectorSankeyChart data={data} width={500} height={140} />
          </View>

          {/* Asset Breakdown */}
          {activeAssets.length > 0 && (
            <View style={styles.tableContainer}>
              <Text style={styles.sectionLabel}>ASSET COMPOSITION</Text>
              <View style={styles.tableBox}>
                {activeAssets.map((asset) => (
                  <View key={asset.key} style={styles.tableRow}>
                    <View style={[styles.colorDot, { backgroundColor: asset.color }]} />
                    <Text style={styles.assetName}>{asset.name}</Text>
                    <Text style={styles.assetPercent}>
                      {formatAllocationPercent(asset.value, data.totalAssets)}
                    </Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(asset.value, data.currency)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Two-Column: Ledger + Configuration */}
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <Text style={styles.sectionLabel}>CALCULATION LEDGER</Text>
              <View style={styles.columnBox}>
                <View style={styles.ledgerRow}>
                  <Text style={styles.ledgerLabel}>Total Assets</Text>
                  <Text style={styles.ledgerValue}>
                    {formatCurrency(data.totalAssets, data.currency)}
                  </Text>
                </View>
                <View style={styles.ledgerRow}>
                  <Text style={styles.ledgerLabel}>Liabilities</Text>
                  <Text style={styles.ledgerValueDanger}>
                    -{formatCurrency(data.totalLiabilities, data.currency)}
                  </Text>
                </View>
                <View style={[styles.ledgerRow, { marginTop: 4, paddingTop: 4, borderTopWidth: 1, borderTopColor: COLORS.border }]}>
                  <Text style={[styles.ledgerLabel, { fontWeight: 600 }]}>Net Zakatable</Text>
                  <Text style={styles.ledgerValue}>
                    {formatCurrency(data.netZakatableWealth, data.currency)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.column}>
              <Text style={styles.sectionLabel}>CONFIGURATION</Text>
              <View style={styles.columnBox}>
                <View style={styles.ledgerRow}>
                  <Text style={styles.ledgerLabel}>Nisāb ({nisabLabel})</Text>
                  <Text style={styles.ledgerValue}>
                    {formatCurrency(data.nisab, data.currency)}
                  </Text>
                </View>
                <View style={styles.ledgerRow}>
                  <Text style={styles.ledgerLabel}>Calendar</Text>
                  <Text style={styles.ledgerValue}>{calendarLabel}</Text>
                </View>
                <View style={styles.ledgerRow}>
                  <Text style={styles.ledgerLabel}>Rate Applied</Text>
                  <Text style={styles.ledgerValue}>{formatPercent(data.zakatRate)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Purification Alert */}
          {totalPurification > 0 && (
            <View style={styles.alertBox}>
              <Text style={styles.alertTitle}>✦ Purification Required</Text>
              <Text style={styles.alertText}>
                {data.interestToPurify > 0 && `Interest: ${formatCurrency(data.interestToPurify, data.currency)}`}
                {data.interestToPurify > 0 && data.dividendsToPurify > 0 && "  •  "}
                {data.dividendsToPurify > 0 && `Non-Halal Dividends: ${formatCurrency(data.dividendsToPurify, data.currency)}`}
              </Text>
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Computed by ZakahFlow • zakat.vora.dev</Text>
            <Text style={styles.footerText}>Generated {dateStr}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
