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
import amiriRegular from "@/assets/pdf-fonts/Amiri-Regular.ttf?url";
import notoNaskhArabic from "@/assets/pdf-fonts/NotoNaskhArabic-Regular.ttf?url";

// Register fonts
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

// Arabic font for Bismillah - Noto Naskh Arabic for beautiful rendering
Font.register({
  family: "NotoNaskhArabic",
  src: notoNaskhArabic,
});

// Printer-friendly color palette (minimal ink usage)
const COLORS = {
  pageBg: "#FFFFFF",
  cardBg: "#FFFFFF",
  primary: "#10B981",
  primaryLight: "#ECFDF5",
  gold: "#B8860B",
  text: "#1F2937",
  textMuted: "#6B7280",
  textLight: "#9CA3AF",
  border: "#D1D5DB",
  borderLight: "#E5E7EB",
  danger: "#DC2626",
  dangerLight: "#FEF2F2",
  totalRowBg: "#F9FAFB",
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
    fontSize: 9,
  },
  // Bismillah section (Arabic) — keep simple to avoid font shaping crashes
  bismillahSection: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
  bismillahArabic: {
    fontFamily: "NotoNaskhArabic",
    fontSize: 18,
    lineHeight: 1.2,
    color: COLORS.gold,
    width: 260,
    textAlign: "right",
  },
  goldLine: {
    height: 1,
    backgroundColor: COLORS.gold,
    width: 80,
    marginHorizontal: "auto",
    marginVertical: 6,
  },
  // Header section - compact outline style
  headerBox: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 6,
    padding: 12,
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 10,
    fontWeight: 600,
    color: COLORS.text,
    letterSpacing: 1.5,
  },
  headerSubtitle: {
    fontSize: 8,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  calculationName: {
    fontFamily: "Lora",
    fontSize: 11,
    color: COLORS.text,
    marginTop: 3,
  },
  dateBox: {
    textAlign: "right",
  },
  dateLabel: {
    fontSize: 7,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  dateText: {
    fontSize: 9,
    fontWeight: 500,
    color: COLORS.text,
    marginTop: 1,
  },
  // Hero amount
  heroSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 8,
  },
  heroLeft: {
    flex: 1,
  },
  heroLabel: {
    fontSize: 8,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  heroAmount: {
    fontFamily: "Lora",
    fontSize: 28,
    fontWeight: 600,
    color: COLORS.primary,
  },
  heroAmountBelow: {
    fontFamily: "Lora",
    fontSize: 18,
    fontWeight: 600,
    color: COLORS.text,
  },
  heroRight: {
    alignItems: "flex-end",
  },
  nisabBadge: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  nisabBadgeText: {
    fontSize: 7,
    color: COLORS.primary,
    fontWeight: 600,
  },
  // Section headers
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  sectionAccent: {
    width: 2,
    height: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 1,
    marginRight: 6,
  },
  sectionLabel: {
    fontSize: 8,
    fontWeight: 600,
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  // Sankey section
  sankeyContainer: {
    marginBottom: 12,
    backgroundColor: COLORS.totalRowBg,
    borderRadius: 4,
    padding: 8,
    border: `1px solid ${COLORS.borderLight}`,
  },
  // Asset breakdown table
  tableContainer: {
    marginBottom: 12,
  },
  tableBox: {
    borderRadius: 4,
    border: `1px solid ${COLORS.border}`,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: COLORS.totalRowBg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tableHeaderText: {
    fontSize: 7,
    fontWeight: 600,
    color: COLORS.textMuted,
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  tableRowTotal: {
    backgroundColor: COLORS.totalRowBg,
    borderBottomWidth: 0,
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
  assetNameTotal: {
    flex: 1,
    fontSize: 9,
    fontWeight: 600,
    color: COLORS.text,
  },
  barContainer: {
    width: 60,
    height: 5,
    backgroundColor: COLORS.borderLight,
    borderRadius: 2,
    marginRight: 10,
    overflow: "hidden",
  },
  assetPercent: {
    fontSize: 8,
    color: COLORS.textMuted,
    marginRight: 12,
    width: 30,
    textAlign: "right",
  },
  assetValue: {
    fontSize: 9,
    fontWeight: 500,
    color: COLORS.text,
    width: 80,
    textAlign: "right",
  },
  assetValueTotal: {
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
    marginBottom: 12,
  },
  column: {
    flex: 1,
  },
  columnBox: {
    borderRadius: 4,
    border: `1px solid ${COLORS.border}`,
    padding: 10,
  },
  ledgerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  ledgerRowHighlight: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 6,
    marginHorizontal: -6,
    marginTop: 4,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 3,
  },
  ledgerLabel: {
    fontSize: 8,
    color: COLORS.textMuted,
  },
  ledgerLabelBold: {
    fontSize: 9,
    fontWeight: 600,
    color: COLORS.text,
  },
  ledgerValue: {
    fontSize: 9,
    fontWeight: 500,
    color: COLORS.text,
  },
  ledgerValueBold: {
    fontSize: 9,
    fontWeight: 600,
    color: COLORS.text,
  },
  ledgerValueDanger: {
    fontSize: 9,
    fontWeight: 500,
    color: COLORS.danger,
  },
  ledgerDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 4,
  },
  // Purification alert
  alertBox: {
    backgroundColor: COLORS.dangerLight,
    border: `1px solid ${COLORS.danger}`,
    borderRadius: 4,
    padding: 10,
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 9,
    fontWeight: 600,
    color: COLORS.danger,
    marginBottom: 3,
  },
  alertText: {
    fontSize: 8,
    color: COLORS.text,
    lineHeight: 1.3,
  },
  alertRecommendation: {
    fontSize: 7,
    color: COLORS.textMuted,
    marginTop: 4,
    fontStyle: "italic",
  },
  // Footer
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 8,
    marginTop: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLeft: {
    flexDirection: "column",
  },
  footerBrand: {
    fontSize: 8,
    fontWeight: 600,
    color: COLORS.textMuted,
  },
  footerUrl: {
    fontSize: 7,
    color: COLORS.textLight,
    marginTop: 1,
  },
  footerRight: {
    textAlign: "right",
  },
  footerDate: {
    fontSize: 7,
    color: COLORS.textMuted,
  },
  footerRef: {
    fontSize: 6,
    color: COLORS.textLight,
    marginTop: 1,
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

function formatCurrencyCompact(amount: number, currency: string = "USD"): string {
  if (amount >= 1000000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  }
  return formatCurrency(amount, currency);
}

function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(2)}%`;
}

function formatAllocationPercent(value: number, total: number): string {
  if (!total || total <= 0) return "0%";
  return `${((value / total) * 100).toFixed(0)}%`;
}

function generateRefNumber(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "ZF-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
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
  { key: "otherAssets", name: "Other Assets", color: COLORS.other },
];

// Vector Sankey Chart with proper proportional flows
interface SankeyChartProps {
  data: ZakatPDFData;
  width: number;
  height: number;
}

// Helper to format numbers for SVG paths (avoid scientific notation)
function n(num: number): string {
  return num.toFixed(2);
}

function VectorSankeyChart({ data, width, height }: SankeyChartProps) {
  const padding = { left: 4, right: 4, top: 8, bottom: 8 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const nodeWidth = 6;

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
        <Rect x={0} y={0} width={width} height={height} fill={COLORS.totalRowBg} />
      </Svg>
    );
  }

  // Node X positions
  const leftNodeX = padding.left;
  const centerNodeX = padding.left + chartWidth * 0.42;
  const rightNodeX = padding.left + chartWidth - nodeWidth;

  // Calculate left nodes (assets) - heights proportional to value
  const nodePadding = 2;
  const leftTotalPadding = (assets.length - 1) * nodePadding;
  const leftAvailableHeight = chartHeight - leftTotalPadding;
  
  const leftNodes: { name: string; value: number; color: string; y: number; height: number }[] = [];
  let currentY = padding.top;
  assets.forEach((asset) => {
    const nodeHeight = Math.max(4, (asset.value / totalAssets) * leftAvailableHeight);
    leftNodes.push({
      name: asset.name,
      value: asset.value,
      color: asset.color,
      y: currentY,
      height: nodeHeight,
    });
    currentY += nodeHeight + nodePadding;
  });

  // Center node height = total of all left nodes (represents net zakatable wealth)
  const centerNodeHeight = leftNodes.reduce((sum, n) => sum + n.height, 0) + leftTotalPadding;
  const centerNode = {
    x: centerNodeX,
    y: padding.top,
    height: centerNodeHeight,
    color: COLORS.netWealth,
  };

  // Right node (Zakat Due) - height proportional to zakat rate (2.5% of center)
  const zakatRatio = data.zakatDue / data.netZakatableWealth;
  const zakatHeight = Math.max(6, centerNodeHeight * zakatRatio * 4); // Scale up for visibility
  const rightNode = data.zakatDue > 0 ? {
    x: rightNodeX,
    y: padding.top + (centerNodeHeight - zakatHeight) / 2,
    height: zakatHeight,
    color: COLORS.primary,
  } : null;

  // Generate curved Bezier path for flowing ribbon between two points
  // Uses explicit path with no whitespace issues for react-pdf compatibility
  const generateCurvedPath = (
    sourceX: number,
    sourceTopY: number,
    sourceBottomY: number,
    targetX: number,
    targetTopY: number,
    targetBottomY: number
  ): string => {
    // Control point offset for smooth S-curve
    const curveStrength = (targetX - sourceX) * 0.5;
    const cp1x = sourceX + curveStrength;
    const cp2x = targetX - curveStrength;
    
    // Build path with explicit formatting for react-pdf
    return `M${n(sourceX)},${n(sourceTopY)} C${n(cp1x)},${n(sourceTopY)} ${n(cp2x)},${n(targetTopY)} ${n(targetX)},${n(targetTopY)} L${n(targetX)},${n(targetBottomY)} C${n(cp2x)},${n(targetBottomY)} ${n(cp1x)},${n(sourceBottomY)} ${n(sourceX)},${n(sourceBottomY)} Z`;
  };

  // Build links from assets to center - each asset flows into center at proportional position
  let centerYOffset = padding.top;
  const leftLinks = leftNodes.map((node) => {
    const sourceTopY = node.y;
    const sourceBottomY = node.y + node.height;
    const targetTopY = centerYOffset;
    const targetBottomY = centerYOffset + node.height;
    
    const path = generateCurvedPath(
      leftNodeX + nodeWidth, sourceTopY, sourceBottomY,
      centerNodeX, targetTopY, targetBottomY
    );
    
    centerYOffset += node.height + nodePadding;
    
    return {
      path,
      color: node.color,
      opacity: 0.4,
    };
  });

  // Build links from center to zakat - matching web version architecture
  // Each asset's flow has SAME WIDTH at source and target (based on zakat proportion)
  const rightLinks: { path: string; color: string; opacity: number }[] = [];
  if (rightNode && data.zakatDue > 0) {
    let sourceYOffset = padding.top;
    let targetYOffset = rightNode.y;
    
    leftNodes.forEach((node) => {
      // Each asset contributes proportionally to zakat
      const assetProportion = node.value / totalAssets;
      // Flow width = proportion of zakatHeight (same at source and target, like web version)
      const flowWidth = Math.max(2, assetProportion * zakatHeight);
      
      // Source: position within the center bar at the TOP EDGE of this asset's zone
      const sourceTopY = sourceYOffset;
      const sourceBottomY = sourceYOffset + flowWidth;
      
      // Target: stacked in the zakat bar
      const targetTopY = targetYOffset;
      const targetBottomY = targetYOffset + flowWidth;
      
      rightLinks.push({
        path: generateCurvedPath(
          centerNodeX + nodeWidth, sourceTopY, sourceBottomY,
          rightNodeX, targetTopY, targetBottomY
        ),
        color: node.color,
        opacity: 0.5,
      });
      
      // Move to next position based on the full asset height in center, not flow width
      sourceYOffset += node.height + nodePadding;
      targetYOffset += flowWidth;
    });
  }

  // react-pdf requires explicit keys on array children in Svg
  const leftLinkPaths = leftLinks.map((link, i) => (
    <Path key={`left-link-${i}`} d={link.path} fill={link.color} fillOpacity={link.opacity} />
  ));
  
  const rightLinkPaths = rightLinks.map((link, i) => (
    <Path key={`right-link-${i}`} d={link.path} fill={link.color} fillOpacity={link.opacity} />
  ));
  
  const leftNodeRects = leftNodes.map((node, i) => (
    <Rect 
      key={`left-node-${i}`} 
      x={leftNodeX} 
      y={node.y} 
      width={nodeWidth} 
      height={node.height} 
      fill={node.color} 
    />
  ));

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Links from assets to center */}
      {leftLinkPaths}
      
      {/* Links from center to zakat */}
      {rightLinkPaths}
      
      {/* Left nodes (assets) */}
      {leftNodeRects}
      
      {/* Center node */}
      <Rect 
        x={centerNode.x} 
        y={centerNode.y} 
        width={nodeWidth} 
        height={centerNode.height} 
        fill={centerNode.color} 
      />
      
      {/* Right node (zakat) */}
      {rightNode && (
        <Rect 
          x={rightNode.x} 
          y={rightNode.y} 
          width={nodeWidth} 
          height={rightNode.height} 
          fill={rightNode.color} 
        />
      )}
    </Svg>
  );
}

// Sankey Labels Component
function SankeyLabels({ data, width }: { data: ZakatPDFData; width: number }) {
  const assets = ASSET_CONFIG
    .map((cfg) => ({
      ...cfg,
      value: data.assetBreakdown[cfg.key] || 0,
    }))
    .filter((a) => a.value > 0)
    .sort((a, b) => b.value - a.value);

  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
  if (totalAssets === 0) return null;

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 2, marginTop: 4 }}>
      {/* Left labels - Assets */}
      <View style={{ width: 110 }}>
        {assets.slice(0, 4).map((asset, i) => (
          <View key={i} style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
            <View style={{ width: 5, height: 5, borderRadius: 2, backgroundColor: asset.color, marginRight: 4 }} />
            <Text style={{ fontSize: 7, color: COLORS.text }}>{asset.name}</Text>
          </View>
        ))}
        {assets.length > 4 && (
          <Text style={{ fontSize: 6, color: COLORS.textLight, marginLeft: 9 }}>+{assets.length - 4} more</Text>
        )}
      </View>

      {/* Center label */}
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 7, color: COLORS.textMuted }}>Net Zakatable</Text>
        <Text style={{ fontSize: 9, fontWeight: 600, color: COLORS.text }}>{formatCurrencyCompact(data.netZakatableWealth, data.currency)}</Text>
      </View>

      {/* Right label - Zakat */}
      <View style={{ width: 80, alignItems: "flex-end", justifyContent: "center" }}>
        {data.zakatDue > 0 ? (
          <>
            <Text style={{ fontSize: 7, color: COLORS.textMuted }}>Zakat Due</Text>
            <Text style={{ fontSize: 10, fontWeight: 600, color: COLORS.primary }}>{formatCurrencyCompact(data.zakatDue, data.currency)}</Text>
          </>
        ) : (
          <Text style={{ fontSize: 8, color: COLORS.textMuted }}>No Zakat Due</Text>
        )}
      </View>
    </View>
  );
}

// Horizontal bar for asset table
function AssetBar({ percentage, color }: { percentage: number; color: string }) {
  const barWidth = Math.min(100, Math.max(2, percentage));
  return (
    <View style={styles.barContainer}>
      <View style={{ width: `${barWidth}%`, height: "100%", backgroundColor: color, borderRadius: 2 }} />
    </View>
  );
}

// Main PDF Document Component
export function ZakatPDFDocument({ data, calculationName }: ZakatPDFDocumentProps) {
  const date = new Date();
  const dateStr = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const refNumber = generateRefNumber();

  const calendarLabel = data.calendarType === "lunar" ? "Lunar (Hijri)" : "Solar (Gregorian)";
  const nisabLabel = data.nisabStandard === "silver" ? "Silver" : "Gold";
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
        {/* Bismillah (Arabic) — no diacritics for reliable rendering */}
        <View style={styles.bismillahSection}>
          <Text style={styles.bismillahArabic}>بسم الله الرحمن الرحيم</Text>
        </View>

        {/* Header with Hero Amount - Outline style for printer friendliness */}
        <View style={styles.headerBox}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>ZAKAT REPORT</Text>
              {calculationName && (
                <Text style={styles.calculationName}>{calculationName}</Text>
              )}
              <Text style={styles.headerSubtitle}>
                {calendarLabel} • {formatPercent(data.zakatRate)} Rate
              </Text>
            </View>
            <View style={styles.dateBox}>
              <Text style={styles.dateLabel}>Generated</Text>
              <Text style={styles.dateText}>{dateStr}</Text>
            </View>
          </View>
          
          <View style={styles.heroSection}>
            <View style={styles.heroLeft}>
              {data.isAboveNisab ? (
                <>
                  <Text style={styles.heroLabel}>Your Zakat Due</Text>
                  <Text style={styles.heroAmount}>
                    {formatCurrency(data.zakatDue, data.currency)}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.heroLabel}>Below Nisāb Threshold</Text>
                  <Text style={styles.heroAmountBelow}>No Zakat Due This Year</Text>
                </>
              )}
            </View>
            <View style={styles.heroRight}>
              <View style={styles.nisabBadge}>
                <Text style={styles.nisabBadgeText}>
                  {data.isAboveNisab ? "✓ Above Nisāb" : "Below Nisāb"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Sankey Chart */}
        <View style={styles.sankeyContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionLabel}>ASSET FLOW TO ZAKAT</Text>
          </View>
          <VectorSankeyChart data={data} width={500} height={80} />
          <SankeyLabels data={data} width={500} />
        </View>

        {/* Asset Breakdown */}
        {activeAssets.length > 0 && (
          <View style={styles.tableContainer}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionLabel}>ASSET COMPOSITION</Text>
            </View>
            <View style={styles.tableBox}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, { flex: 1, marginLeft: 16 }]}>ASSET TYPE</Text>
                <Text style={[styles.tableHeaderText, { width: 60, textAlign: "center" }]}>ALLOCATION</Text>
                <Text style={[styles.tableHeaderText, { width: 30, textAlign: "right" }]}>%</Text>
                <Text style={[styles.tableHeaderText, { width: 80, textAlign: "right" }]}>VALUE</Text>
              </View>
              {activeAssets.map((asset) => {
                const percentage = (asset.value / data.totalAssets) * 100;
                return (
                  <View key={asset.key} style={styles.tableRow}>
                    <View style={[styles.colorDot, { backgroundColor: asset.color }]} />
                    <Text style={styles.assetName}>{asset.name}</Text>
                    <AssetBar percentage={percentage} color={asset.color} />
                    <Text style={styles.assetPercent}>
                      {formatAllocationPercent(asset.value, data.totalAssets)}
                    </Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(asset.value, data.currency)}
                    </Text>
                  </View>
                );
              })}
              {/* Total row */}
              <View style={[styles.tableRow, styles.tableRowTotal]}>
                <View style={[styles.colorDot, { backgroundColor: "transparent" }]} />
                <Text style={styles.assetNameTotal}>Total Assets</Text>
                <View style={{ width: 60, marginRight: 10 }} />
                <Text style={[styles.assetPercent, { fontWeight: 600 }]}>100%</Text>
                <Text style={styles.assetValueTotal}>
                  {formatCurrency(data.totalAssets, data.currency)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Two-Column: Ledger + Configuration */}
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionLabel}>CALCULATION LEDGER</Text>
            </View>
            <View style={styles.columnBox}>
              <View style={styles.ledgerRow}>
                <Text style={styles.ledgerLabel}>Total Assets</Text>
                <Text style={styles.ledgerValue}>
                  {formatCurrency(data.totalAssets, data.currency)}
                </Text>
              </View>
              <View style={styles.ledgerRow}>
                <Text style={styles.ledgerLabel}>Less: Liabilities</Text>
                <Text style={styles.ledgerValueDanger}>
                  ({formatCurrency(data.totalLiabilities, data.currency)})
                </Text>
              </View>
              <View style={styles.ledgerDivider} />
              <View style={styles.ledgerRowHighlight}>
                <Text style={styles.ledgerLabelBold}>Net Zakatable</Text>
                <Text style={styles.ledgerValueBold}>
                  {formatCurrency(data.netZakatableWealth, data.currency)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.column}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionLabel}>CONFIGURATION</Text>
            </View>
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
                <Text style={styles.ledgerLabel}>Zakat Rate</Text>
                <Text style={styles.ledgerValue}>{formatPercent(data.zakatRate)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Purification Alert */}
        {totalPurification > 0 && (
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>⚠ Purification Required</Text>
            <Text style={styles.alertText}>
              {data.interestToPurify > 0 && `Interest: ${formatCurrency(data.interestToPurify, data.currency)}`}
              {data.interestToPurify > 0 && data.dividendsToPurify > 0 && " • "}
              {data.dividendsToPurify > 0 && `Non-halal dividends: ${formatCurrency(data.dividendsToPurify, data.currency)}`}
            </Text>
            <Text style={styles.alertRecommendation}>
              Give to charity separately from Zakat.
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Text style={styles.footerBrand}>ZakahFlow</Text>
            <Text style={styles.footerUrl}>zakat.vora.dev</Text>
          </View>
          <View style={styles.footerRight}>
            <Text style={styles.footerDate}>{dateStr}</Text>
            <Text style={styles.footerRef}>Ref: {refNumber}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
