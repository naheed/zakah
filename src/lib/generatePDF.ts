import jsPDF from "jspdf";
import { ZakatFormData, formatCurrency, formatPercent } from "./zakatCalculations";

interface ZakatCalculations {
  totalAssets: number;
  totalLiabilities: number;
  netZakatableWealth: number;
  nisab: number;
  isAboveNisab: boolean;
  zakatDue: number;
  zakatRate: number;
  interestToPurify: number;
  dividendsToPurify: number;
  assetBreakdown: {
    liquidAssets: number;
    investments: number;
    retirement: number;
    realEstate: number;
    business: number;
    otherAssets: number;
    exemptAssets: number;
  };
}

// PDF palette (RGB)
const COLORS = {
  pageBg: [241, 245, 249] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  border: [226, 232, 240] as [number, number, number],

  dark: [15, 23, 42] as [number, number, number],
  darkMuted: [30, 41, 59] as [number, number, number],

  primary: [16, 185, 129] as [number, number, number], // emerald-ish

  text: [15, 23, 42] as [number, number, number],
  textMuted: [100, 116, 139] as [number, number, number],

  danger: [220, 38, 38] as [number, number, number],

  // Asset colors (roughly aligned with the web chart)
  cash: [34, 197, 94] as [number, number, number],
  investments: [59, 130, 246] as [number, number, number],
  retirement: [139, 92, 246] as [number, number, number],
  realEstate: [249, 115, 22] as [number, number, number],
  business: [236, 72, 153] as [number, number, number],
  other: [6, 182, 212] as [number, number, number],
};

const ASSET_CONFIG: {
  key: keyof ZakatCalculations["assetBreakdown"];
  name: string;
  color: [number, number, number];
}[] = [
  { key: "liquidAssets", name: "Cash & Savings", color: COLORS.cash },
  { key: "investments", name: "Investment Portfolio", color: COLORS.investments },
  { key: "retirement", name: "Retirement Accounts", color: COLORS.retirement },
  { key: "realEstate", name: "Real Estate", color: COLORS.realEstate },
  { key: "business", name: "Business", color: COLORS.business },
  { key: "otherAssets", name: "Other Assets", color: COLORS.other },
];

function drawRoundedRect(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fillColor: [number, number, number],
  strokeColor?: [number, number, number]
) {
  doc.setFillColor(...fillColor);
  if (strokeColor) {
    doc.setDrawColor(...strokeColor);
    doc.roundedRect(x, y, w, h, r, r, "FD");
  } else {
    doc.roundedRect(x, y, w, h, r, r, "F");
  }
}

function formatAllocationPercent(value: number, total: number) {
  if (!total || total <= 0) return "0.0%";
  return `${((value / total) * 100).toFixed(1)}%`;
}

function drawSectionTitle(doc: jsPDF, x: number, y: number, n: string, title: string) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.textMuted);
  doc.text(n, x, y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.text);
  doc.text(title, x + 10, y);

  return y + 6;
}

function drawAssetAllocation(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  calculations: ZakatCalculations,
  currency: string
): number {
  const items = ASSET_CONFIG
    .map((a) => ({
      ...a,
      value: calculations.assetBreakdown[a.key] ?? 0,
    }))
    .filter((a) => a.value > 0)
    .sort((a, b) => b.value - a.value);

  if (items.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.textMuted);
    doc.text("No zakatable assets to display.", x, y + 4);
    return y + 10;
  }

  const total = calculations.totalAssets || items.reduce((s, i) => s + i.value, 0);

  const rowH = 16;
  const gap = 6;

  items.forEach((item) => {
    drawRoundedRect(doc, x, y, w, rowH, 4, COLORS.white, COLORS.border);

    // Color dot
    doc.setFillColor(...item.color);
    doc.circle(x + 7, y + 7, 2, "F");

    // Label
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.text);
    doc.text(item.name, x + 12, y + 7);

    // Value
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.text);
    doc.text(formatCurrency(item.value, currency), x + w - 6, y + 7, { align: "right" });

    // Percent (muted)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.textMuted);
    doc.text(formatAllocationPercent(item.value, total), x + w - 6, y + 12, { align: "right" });

    // Bar
    const barX = x + 12;
    const barY = y + 11;
    const barW = w - 24;
    const barH = 2.5;

    doc.setFillColor(...COLORS.border);
    doc.roundedRect(barX, barY, barW, barH, 1.2, 1.2, "F");

    const fillW = Math.max(2, Math.min(barW, (item.value / total) * barW));
    doc.setFillColor(...item.color);
    doc.roundedRect(barX, barY, fillW, barH, 1.2, 1.2, "F");

    y += rowH + gap;
  });

  return y - gap; // remove last gap
}

function drawKeyValueRow(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  label: string,
  value: string,
  opts?: { valueColor?: [number, number, number]; bold?: boolean }
) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.textMuted);
  doc.text(label, x, y);

  doc.setFont("helvetica", opts?.bold ? "bold" : "bold");
  doc.setFontSize(9);
  doc.setTextColor(...(opts?.valueColor ?? COLORS.text));
  doc.text(value, x + w, y, { align: "right" });
}

export function generateZakatPDF(data: ZakatFormData, calculations: ZakatCalculations, calculationName?: string): void {
  // Use mm + explicit A4 so the output is predictable and always one page.
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const currency = data.currency;

  const date = new Date();
  const dateStr = date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });
  const yearStr = String(date.getFullYear());

  // Page background
  doc.setFillColor(...COLORS.pageBg);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Outer container (marketable “sheet” look)
  const outerM = 8;
  const cardX = outerM;
  const cardY = outerM;
  const cardW = pageWidth - outerM * 2;
  const cardH = pageHeight - outerM * 2;
  drawRoundedRect(doc, cardX, cardY, cardW, cardH, 6, COLORS.white, COLORS.border);

  const pad = 10;

  // Hero header
  const headerH = 70;
  doc.setFillColor(...COLORS.dark);
  doc.rect(cardX, cardY, cardW, headerH, "F");
  doc.setFillColor(...COLORS.primary);
  doc.rect(cardX, cardY, cardW, 3, "F");

  // Header text
  doc.setTextColor(...COLORS.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("ZAKAT REPORT", cardX + pad, cardY + 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(226, 232, 240);
  doc.text(`Verified Calculation • ${yearStr}`, cardX + pad, cardY + 26);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text("Generated Date", cardX + cardW - pad, cardY + 18, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.white);
  doc.text(dateStr, cardX + cardW - pad, cardY + 26, { align: "right" });

  // Obligation card (smaller, not half the page)
  const obligationX = cardX + pad;
  const obligationY = cardY + 34;
  const obligationW = cardW - pad * 2;
  const obligationH = 32;
  drawRoundedRect(doc, obligationX, obligationY, obligationW, obligationH, 5, COLORS.white);

  doc.setTextColor(...COLORS.textMuted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  if (calculations.isAboveNisab) {
    doc.text("Total Obligation Due", obligationX + 8, obligationY + 10);

    doc.setTextColor(...COLORS.text);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(formatCurrency(calculations.zakatDue, currency), obligationX + 8, obligationY + 22);

    doc.setTextColor(...COLORS.textMuted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const calLabel = data.calendarType === "lunar" ? "Lunar (Hijri)" : "Solar (Gregorian)";
    doc.text(`Rate applied: ${formatPercent(calculations.zakatRate)} • Calendar: ${calLabel}`, obligationX + 8, obligationY + 29);
  } else {
    doc.text("Below Niṣāb Threshold", obligationX + 8, obligationY + 10);

    doc.setTextColor(...COLORS.text);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("No Zakat Due", obligationX + 8, obligationY + 21);

    doc.setTextColor(...COLORS.textMuted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`Nisab: ${formatCurrency(calculations.nisab, currency)}`, obligationX + 8, obligationY + 29);
  }

  let y = cardY + headerH + 16;

  // 01 Asset Allocation
  y = drawSectionTitle(doc, cardX + pad, y, "01", "Asset Allocation");
  y = drawAssetAllocation(doc, cardX + pad, y, cardW - pad * 2, calculations, currency) + 10;

  // 02 Final Ledger + Configuration (two-column)
  const colGap = 8;
  const colW = (cardW - pad * 2 - colGap) / 2;
  const leftX = cardX + pad;
  const rightX = leftX + colW + colGap;

  const sectionY = y;
  y = drawSectionTitle(doc, leftX, y, "02", "Final Ledger");

  const ledgerBoxY = y;
  const ledgerBoxH = 36;
  drawRoundedRect(doc, leftX, ledgerBoxY, colW, ledgerBoxH, 5, COLORS.white, COLORS.border);

  const ledgerPadX = leftX + 8;
  const ledgerPadW = colW - 16;
  let ledgerY = ledgerBoxY + 10;

  drawKeyValueRow(doc, ledgerPadX, ledgerY, ledgerPadW, "Total Assets", formatCurrency(calculations.totalAssets, currency));
  ledgerY += 9;
  drawKeyValueRow(
    doc,
    ledgerPadX,
    ledgerY,
    ledgerPadW,
    "Liabilities (Deducted)",
    `-${formatCurrency(calculations.totalLiabilities, currency)}`,
    { valueColor: COLORS.danger }
  );
  ledgerY += 9;
  drawKeyValueRow(doc, ledgerPadX, ledgerY, ledgerPadW, "Net Zakatable Wealth", formatCurrency(calculations.netZakatableWealth, currency), {
    bold: true,
  });

  // Configuration
  // Keep header aligned with ledger top for a clean grid.
  y = drawSectionTitle(doc, rightX, sectionY + 6, "", "Configuration");

  const configBoxY = ledgerBoxY;
  const configBoxH = ledgerBoxH;
  drawRoundedRect(doc, rightX, configBoxY, colW, configBoxH, 5, COLORS.white, COLORS.border);

  const cfgPadX = rightX + 8;
  const cfgPadW = colW - 16;
  let cfgY = configBoxY + 10;

  const nisabLabel = data.nisabStandard === "silver" ? "Nisab (Silver)" : "Nisab (Gold)";
  const calendarLabel = data.calendarType === "lunar" ? "Lunar (Hijri)" : "Solar (Gregorian)";

  drawKeyValueRow(doc, cfgPadX, cfgY, cfgPadW, nisabLabel, formatCurrency(calculations.nisab, currency));
  cfgY += 9;
  drawKeyValueRow(doc, cfgPadX, cfgY, cfgPadW, "Calendar Type", calendarLabel);
  cfgY += 9;
  drawKeyValueRow(doc, cfgPadX, cfgY, cfgPadW, "Rate Applied", formatPercent(calculations.zakatRate));

  y = ledgerBoxY + ledgerBoxH + 14;

  // Optional: Purification (compact, only if needed)
  const totalPurification = calculations.interestToPurify + calculations.dividendsToPurify;
  if (totalPurification > 0) {
    const alertH = 18;
    const alertY = Math.min(y, cardY + cardH - 32 - alertH);
    drawRoundedRect(doc, cardX + pad, alertY, cardW - pad * 2, alertH, 5, COLORS.white, COLORS.border);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.danger);
    doc.text("Purification Required", cardX + pad + 8, alertY + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.textMuted);

    const parts: string[] = [];
    if (calculations.interestToPurify > 0) parts.push(`Interest: ${formatCurrency(calculations.interestToPurify, currency)}`);
    if (calculations.dividendsToPurify > 0) parts.push(`Non‑Halal Dividends: ${formatCurrency(calculations.dividendsToPurify, currency)}`);

    doc.text(parts.join(" • "), cardX + pad + 8, alertY + 14);
  }

  // Footer (source + date)
  const footerY = cardY + cardH - 10;
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.3);
  doc.line(cardX + pad, footerY - 6, cardX + cardW - pad, footerY - 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.textMuted);
  doc.text(`Computed by zakah.vora.dev • Generated ${dateStr}`, cardX + cardW / 2, footerY, { align: "center" });

  // Save
  const fileName = calculationName
    ? `zakat-report-${calculationName.replace(/\s+/g, "-").toLowerCase()}.pdf`
    : `zakat-report-${new Date().toISOString().split("T")[0]}.pdf`;

  doc.save(fileName);
}
