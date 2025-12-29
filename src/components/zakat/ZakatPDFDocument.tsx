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

// Stripe-inspired color palette
const COLORS = {
  pageBg: "#FAF9F7",
  cardBg: "#FFFFFF",
  headerBg: "#1C1A18",
  primary: "#10B981",
  primaryLight: "#D1FAE5",
  gold: "#DAA520",
  text: "#1C1A18",
  textMuted: "#6B7280",
  textLight: "#9CA3AF",
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  danger: "#DC2626",
  dangerLight: "#FEE2E2",
  totalRowBg: "#F5F3F0",
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
    padding: 28,
    fontFamily: "WorkSans",
    fontSize: 10,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
    padding: 24,
  },
  // Bismillah section
  bismillahSection: {
    textAlign: "center",
    marginBottom: 20,
  },
  bismillahText: {
    fontFamily: "Lora",
    fontSize: 15,
    fontStyle: "italic",
    color: COLORS.text,
    marginBottom: 4,
  },
  bismillahEnglish: {
    fontSize: 9,
    color: COLORS.textMuted,
    marginBottom: 10,
  },
  goldLine: {
    height: 1,
    backgroundColor: COLORS.gold,
    width: 100,
    marginHorizontal: "auto",
    marginVertical: 8,
  },
  // Header section
  headerBox: {
    backgroundColor: COLORS.headerBg,
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  headerAccent: {
    height: 4,
    backgroundColor: COLORS.primary,
    marginHorizontal: -20,
    marginTop: -20,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: "#FFFFFF",
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 9,
    color: "#9CA3AF",
    marginTop: 4,
  },
  calculationName: {
    fontFamily: "Lora",
    fontSize: 14,
    color: "#FFFFFF",
    marginTop: 6,
  },
  dateBox: {
    textAlign: "right",
  },
  dateLabel: {
    fontSize: 8,
    color: "#9CA3AF",
    letterSpacing: 0.5,
  },
  dateText: {
    fontSize: 10,
    fontWeight: 500,
    color: "#FFFFFF",
    marginTop: 2,
  },
  // Hero amount
  heroSection: {
    marginTop: 8,
  },
  heroLabel: {
    fontSize: 10,
    color: "#9CA3AF",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  heroAmount: {
    fontFamily: "Lora",
    fontSize: 36,
    fontWeight: 600,
    color: "#FFFFFF",
  },
  heroAmountShadow: {
    fontFamily: "Lora",
    fontSize: 36,
    fontWeight: 600,
    color: COLORS.primary,
    position: "absolute",
    left: 1,
    top: 1,
    opacity: 0.3,
  },
  heroAmountBelow: {
    fontFamily: "Lora",
    fontSize: 22,
    fontWeight: 600,
    color: "#FFFFFF",
  },
  // Section headers
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionAccent: {
    width: 3,
    height: 14,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginRight: 8,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: 600,
    color: COLORS.textMuted,
    letterSpacing: 1.5,
  },
  // Sankey section
  sankeyContainer: {
    marginBottom: 20,
    backgroundColor: COLORS.pageBg,
    borderRadius: 8,
    padding: 12,
    border: `1px solid ${COLORS.borderLight}`,
  },
  // Asset breakdown table
  tableContainer: {
    marginBottom: 20,
  },
  tableBox: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 6,
    border: `1px solid ${COLORS.border}`,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.borderLight,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tableHeaderText: {
    fontSize: 8,
    fontWeight: 600,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  tableRowAlt: {
    backgroundColor: "#FAFAFA",
  },
  tableRowTotal: {
    backgroundColor: COLORS.totalRowBg,
    borderBottomWidth: 0,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  assetName: {
    flex: 1,
    fontSize: 10,
    color: COLORS.text,
  },
  assetNameTotal: {
    flex: 1,
    fontSize: 10,
    fontWeight: 600,
    color: COLORS.text,
  },
  barContainer: {
    width: 80,
    height: 6,
    backgroundColor: COLORS.borderLight,
    borderRadius: 3,
    marginRight: 12,
    overflow: "hidden",
  },
  assetPercent: {
    fontSize: 9,
    color: COLORS.textMuted,
    marginRight: 16,
    width: 36,
    textAlign: "right",
  },
  assetValue: {
    fontSize: 10,
    fontWeight: 500,
    color: COLORS.text,
    width: 90,
    textAlign: "right",
  },
  assetValueTotal: {
    fontSize: 11,
    fontWeight: 600,
    color: COLORS.text,
    width: 90,
    textAlign: "right",
  },
  // Two-column layout
  twoColumn: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  column: {
    flex: 1,
  },
  columnBox: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 6,
    border: `1px solid ${COLORS.border}`,
    padding: 14,
  },
  ledgerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  ledgerRowHighlight: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginHorizontal: -8,
    marginTop: 6,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 4,
  },
  ledgerLabel: {
    fontSize: 9,
    color: COLORS.textMuted,
  },
  ledgerLabelBold: {
    fontSize: 10,
    fontWeight: 600,
    color: COLORS.text,
  },
  ledgerValue: {
    fontSize: 10,
    fontWeight: 500,
    color: COLORS.text,
  },
  ledgerValueBold: {
    fontSize: 11,
    fontWeight: 600,
    color: COLORS.text,
  },
  ledgerValueDanger: {
    fontSize: 10,
    fontWeight: 500,
    color: COLORS.danger,
  },
  ledgerDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  // Purification alert
  alertBox: {
    backgroundColor: COLORS.dangerLight,
    border: `1px solid ${COLORS.danger}`,
    borderRadius: 6,
    padding: 14,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  alertIcon: {
    width: 20,
    marginRight: 10,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 10,
    fontWeight: 600,
    color: COLORS.danger,
    marginBottom: 4,
  },
  alertText: {
    fontSize: 9,
    color: COLORS.text,
    lineHeight: 1.4,
  },
  alertRecommendation: {
    fontSize: 8,
    color: COLORS.textMuted,
    marginTop: 6,
    fontStyle: "italic",
  },
  // Footer
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
    marginTop: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLeft: {
    flexDirection: "column",
  },
  footerBrand: {
    fontSize: 9,
    fontWeight: 600,
    color: COLORS.textMuted,
  },
  footerUrl: {
    fontSize: 7,
    color: COLORS.textLight,
    marginTop: 2,
  },
  footerRight: {
    textAlign: "right",
  },
  footerDate: {
    fontSize: 8,
    color: COLORS.textMuted,
  },
  footerRef: {
    fontSize: 7,
    color: COLORS.textLight,
    marginTop: 2,
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

// Vector Sankey Chart with Labels
interface SankeyChartProps {
  data: ZakatPDFData;
  width: number;
  height: number;
}

function VectorSankeyChart({ data, width, height }: SankeyChartProps) {
  const padding = { left: 12, right: 12, top: 24, bottom: 24 };
  const labelWidth = 90;
  const valueWidth = 70;
  const chartWidth = width - padding.left - padding.right - labelWidth * 2 - valueWidth * 2;
  const chartHeight = height - padding.top - padding.bottom;
  const nodeWidth = 10;

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
  const nodePadding = 4;
  const availableHeight = chartHeight - (assets.length - 1) * nodePadding;
  
  // Left side nodes (assets)
  const leftNodeX = padding.left + labelWidth + valueWidth;
  const leftNodes: { name: string; value: number; color: string; y: number; height: number }[] = [];
  let currentY = padding.top;
  assets.forEach((asset) => {
    const proportionalHeight = (asset.value / totalAssets) * availableHeight;
    const nodeHeight = Math.max(12, proportionalHeight);
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
  const centerX = leftNodeX + chartWidth * 0.45;
  const centerNodeHeight = chartHeight * 0.8;
  const centerNode = {
    x: centerX,
    y: padding.top + (chartHeight - centerNodeHeight) / 2,
    height: centerNodeHeight,
    color: COLORS.netWealth,
    value: data.netZakatableWealth,
  };

  // Right node (Zakat Due)
  const rightNodeX = width - padding.right - labelWidth - valueWidth - nodeWidth;
  const zakatHeight = Math.max(24, chartHeight * 0.25);
  const rightNode = data.zakatDue > 0 ? {
    x: rightNodeX,
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
    const linkHeight = (node.value / totalAssets) * centerNode.height;
    const sourceY = node.y + node.height / 2;
    const targetY = centerNode.y + sourceYOffset + linkHeight / 2;
    sourceYOffset += linkHeight;
    return {
      path: generatePath(
        leftNodeX + nodeWidth, sourceY,
        centerX, targetY,
        Math.max(3, linkHeight * 0.8)
      ),
      color: node.color,
      opacity: 0.4,
    };
  });

  // Build links from center to zakat
  const rightLinks: { path: string; color: string; opacity: number }[] = [];
  if (rightNode && data.zakatDue > 0) {
    const zakatLinkHeight = rightNode.height * 0.8;
    const sourceY = centerNode.y + centerNode.height / 2;
    const targetY = rightNode.y + rightNode.height / 2;
    
    rightLinks.push({
      path: generatePath(
        centerX + nodeWidth, sourceY,
        rightNode.x, targetY,
        zakatLinkHeight
      ),
      color: COLORS.primary,
      opacity: 0.5,
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
      
      {/* Left nodes (assets) with labels */}
      {leftNodes.map((node, i) => (
        <React.Fragment key={`left-node-${i}`}>
          <Rect x={leftNodeX} y={node.y} width={nodeWidth} height={node.height} fill={node.color} rx={2} />
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

// Sankey Labels Component (rendered separately for better text control)
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
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 4 }}>
      {/* Left labels - Assets */}
      <View style={{ width: 130 }}>
        {assets.map((asset, i) => (
          <View key={i} style={{ flexDirection: "row", alignItems: "center", marginBottom: 3 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: asset.color, marginRight: 6 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 8, color: COLORS.text }}>{asset.name}</Text>
              <Text style={{ fontSize: 7, color: COLORS.textLight }}>{formatCurrencyCompact(asset.value, data.currency)}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Center label */}
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 8, color: COLORS.textMuted, marginBottom: 2 }}>Net Zakatable</Text>
        <Text style={{ fontSize: 10, fontWeight: 600, color: COLORS.text }}>{formatCurrencyCompact(data.netZakatableWealth, data.currency)}</Text>
      </View>

      {/* Right label - Zakat */}
      <View style={{ width: 100, alignItems: "flex-end", justifyContent: "center" }}>
        {data.zakatDue > 0 ? (
          <>
            <Text style={{ fontSize: 8, color: COLORS.textMuted, marginBottom: 2 }}>Zakat Due</Text>
            <Text style={{ fontSize: 12, fontWeight: 600, color: COLORS.primary }}>{formatCurrencyCompact(data.zakatDue, data.currency)}</Text>
          </>
        ) : (
          <Text style={{ fontSize: 9, color: COLORS.textMuted }}>No Zakat Due</Text>
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
      <View style={{ width: `${barWidth}%`, height: "100%", backgroundColor: color, borderRadius: 3 }} />
    </View>
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
  const refNumber = generateRefNumber();

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
                {calculationName && (
                  <Text style={styles.calculationName}>{calculationName}</Text>
                )}
                <Text style={styles.headerSubtitle}>
                  {calendarLabel} • {formatPercent(data.zakatRate)} Rate
                </Text>
              </View>
              <View style={styles.dateBox}>
                <Text style={styles.dateLabel}>GENERATED</Text>
                <Text style={styles.dateText}>{dateStr}</Text>
              </View>
            </View>
            
            <View style={styles.heroSection}>
              {data.isAboveNisab ? (
                <>
                  <Text style={styles.heroLabel}>YOUR ZAKAT DUE</Text>
                  <View style={{ position: "relative" }}>
                    <Text style={styles.heroAmountShadow}>
                      {formatCurrency(data.zakatDue, data.currency)}
                    </Text>
                    <Text style={styles.heroAmount}>
                      {formatCurrency(data.zakatDue, data.currency)}
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.heroLabel}>BELOW NISĀB THRESHOLD</Text>
                  <Text style={styles.heroAmountBelow}>No Zakat Due This Year</Text>
                </>
              )}
            </View>
          </View>

          {/* Sankey Chart */}
          <View style={styles.sankeyContainer}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionLabel}>ASSET FLOW TO ZAKAT</Text>
            </View>
            <VectorSankeyChart data={data} width={490} height={100} />
            <SankeyLabels data={data} width={490} />
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
                  <Text style={[styles.tableHeaderText, { flex: 1, marginLeft: 20 }]}>ASSET TYPE</Text>
                  <Text style={[styles.tableHeaderText, { width: 80, textAlign: "center" }]}>ALLOCATION</Text>
                  <Text style={[styles.tableHeaderText, { width: 36, textAlign: "right" }]}>%</Text>
                  <Text style={[styles.tableHeaderText, { width: 90, textAlign: "right" }]}>VALUE</Text>
                </View>
                {activeAssets.map((asset, index) => {
                  const percentage = (asset.value / data.totalAssets) * 100;
                  return (
                    <View 
                      key={asset.key} 
                      style={[
                        styles.tableRow, 
                        index % 2 === 1 && styles.tableRowAlt
                      ]}
                    >
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
                  <View style={{ width: 80, marginRight: 12 }} />
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
                  <Text style={styles.ledgerLabel}>Less: Deductible Liabilities</Text>
                  <Text style={styles.ledgerValueDanger}>
                    ({formatCurrency(data.totalLiabilities, data.currency)})
                  </Text>
                </View>
                <View style={styles.ledgerDivider} />
                <View style={styles.ledgerRowHighlight}>
                  <Text style={styles.ledgerLabelBold}>Net Zakatable Wealth</Text>
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
                  <Text style={styles.ledgerLabel}>Nisāb Threshold</Text>
                  <Text style={styles.ledgerValue}>
                    {formatCurrency(data.nisab, data.currency)}
                  </Text>
                </View>
                <View style={styles.ledgerRow}>
                  <Text style={styles.ledgerLabel}>Standard Used</Text>
                  <Text style={styles.ledgerValue}>{nisabLabel}</Text>
                </View>
                <View style={styles.ledgerRow}>
                  <Text style={styles.ledgerLabel}>Calendar Type</Text>
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
              <View style={styles.alertIcon}>
                <Text style={{ fontSize: 14 }}>⚠</Text>
              </View>
              <View style={styles.alertContent}>
                <Text style={styles.alertTitle}>Purification Required</Text>
                <Text style={styles.alertText}>
                  {data.interestToPurify > 0 && `Interest to purify: ${formatCurrency(data.interestToPurify, data.currency)}`}
                  {data.interestToPurify > 0 && data.dividendsToPurify > 0 && "\n"}
                  {data.dividendsToPurify > 0 && `Non-halal dividends: ${formatCurrency(data.dividendsToPurify, data.currency)}`}
                </Text>
                <Text style={styles.alertRecommendation}>
                  These amounts should be given to charity separately from Zakat, as they represent wealth that requires purification.
                </Text>
              </View>
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
        </View>
      </Page>
    </Document>
  );
}
