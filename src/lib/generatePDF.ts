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

// Premium warm palette (RGB)
const COLORS = {
  pageBg: [249, 246, 243] as [number, number, number], // Warm cream
  cardBg: [255, 255, 255] as [number, number, number],
  headerBg: [28, 26, 24] as [number, number, number], // Warm dark
  
  primary: [16, 185, 129] as [number, number, number], // Emerald
  gold: [218, 165, 32] as [number, number, number], // Gold accent
  
  text: [28, 26, 24] as [number, number, number],
  textMuted: [128, 118, 102] as [number, number, number],
  textLight: [180, 170, 155] as [number, number, number],
  
  border: [226, 220, 210] as [number, number, number],
  danger: [220, 38, 38] as [number, number, number],
  
  // Asset colors
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
  { key: "investments", name: "Investments", color: COLORS.investments },
  { key: "retirement", name: "Retirement", color: COLORS.retirement },
  { key: "realEstate", name: "Real Estate", color: COLORS.realEstate },
  { key: "business", name: "Business", color: COLORS.business },
  { key: "otherAssets", name: "Other", color: COLORS.other },
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
  if (!total || total <= 0) return "0%";
  return `${((value / total) * 100).toFixed(0)}%`;
}

interface PDFOptions {
  sankeyImageDataUrl?: string;
}

export async function generateZakatPDF(
  data: ZakatFormData, 
  calculations: ZakatCalculations, 
  calculationName?: string,
  options?: PDFOptions
): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const currency = data.currency;
  const date = new Date();
  const dateStr = date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "2-digit" });

  // Page background - warm cream
  doc.setFillColor(...COLORS.pageBg);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Main card container
  const cardM = 10;
  const cardX = cardM;
  const cardY = cardM;
  const cardW = pageWidth - cardM * 2;
  const cardH = pageHeight - cardM * 2;
  drawRoundedRect(doc, cardX, cardY, cardW, cardH, 4, COLORS.cardBg, COLORS.border);

  const pad = 12;
  let y = cardY + pad;

  // === BISMILLAH SECTION (Top) ===
  const bismillahArabic = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
  const bismillahEnglish = "In the name of Allah, the Most Gracious, the Most Merciful";
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.text);
  doc.text(bismillahArabic, pageWidth / 2, y, { align: "center" });
  
  y += 6;
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.textMuted);
  doc.text(bismillahEnglish, pageWidth / 2, y, { align: "center" });
  
  // Gold accent line under Bismillah
  y += 6;
  const lineW = 40;
  doc.setDrawColor(...COLORS.gold);
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - lineW / 2, y, pageWidth / 2 + lineW / 2, y);
  
  y += 12;

  // === HEADER SECTION ===
  const headerH = 50;
  doc.setFillColor(...COLORS.headerBg);
  doc.roundedRect(cardX + pad, y, cardW - pad * 2, headerH, 3, 3, "F");
  
  // Primary accent bar
  doc.setFillColor(...COLORS.primary);
  doc.rect(cardX + pad, y, cardW - pad * 2, 2, "F");
  
  // Header content
  const headerY = y;
  
  // Left side: Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("ZAKAT REPORT", cardX + pad + 10, headerY + 18);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(200, 195, 190);
  const calLabel = data.calendarType === "lunar" ? "Lunar (Hijri)" : "Solar (Gregorian)";
  doc.text(`${calLabel} • ${formatPercent(calculations.zakatRate)} Rate`, cardX + pad + 10, headerY + 26);
  
  // Right side: Date
  doc.setFontSize(7);
  doc.setTextColor(180, 175, 170);
  doc.text("Generated", cardX + cardW - pad - 10, headerY + 15, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(dateStr, cardX + cardW - pad - 10, headerY + 22, { align: "right" });

  // === HERO AMOUNT SECTION (within header) ===
  if (calculations.isAboveNisab) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(200, 195, 190);
    doc.text("Your Zakat Due", cardX + pad + 10, headerY + 38);
    
    // Large amount - using serif-like styling
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.text(formatCurrency(calculations.zakatDue, currency), cardX + pad + 10, headerY + 48);
  } else {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(200, 195, 190);
    doc.text("Below Niṣāb Threshold", cardX + pad + 10, headerY + 38);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text("No Zakat Due This Year", cardX + pad + 10, headerY + 48);
  }

  y = headerY + headerH + 10;

  // === SANKEY CHART SECTION ===
  if (options?.sankeyImageDataUrl) {
    const sankeyW = cardW - pad * 2;
    const sankeyH = 65;
    
    // Section label
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.textMuted);
    doc.text("ASSET FLOW TO ZAKAT", cardX + pad, y);
    y += 5;
    
    // Add the captured Sankey image
    try {
      doc.addImage(options.sankeyImageDataUrl, "PNG", cardX + pad, y, sankeyW, sankeyH);
    } catch {
      // Fallback: draw a placeholder box
      drawRoundedRect(doc, cardX + pad, y, sankeyW, sankeyH, 3, COLORS.pageBg, COLORS.border);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.textMuted);
      doc.text("Sankey Chart", cardX + pad + sankeyW / 2, y + sankeyH / 2, { align: "center" });
    }
    
    y += sankeyH + 10;
  }

  // === ASSET BREAKDOWN (Compact Table) ===
  const items = ASSET_CONFIG
    .map((a) => ({
      ...a,
      value: calculations.assetBreakdown[a.key] ?? 0,
    }))
    .filter((a) => a.value > 0)
    .sort((a, b) => b.value - a.value);

  if (items.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.textMuted);
    doc.text("ASSET BREAKDOWN", cardX + pad, y);
    y += 6;

    const total = calculations.totalAssets || items.reduce((s, i) => s + i.value, 0);
    const tableW = cardW - pad * 2;
    const rowH = 8;
    
    // Table background
    const tableH = items.length * rowH + 2;
    drawRoundedRect(doc, cardX + pad, y, tableW, tableH, 2, COLORS.cardBg, COLORS.border);
    
    let tableY = y + 6;
    items.forEach((item) => {
      // Color dot
      doc.setFillColor(...item.color);
      doc.circle(cardX + pad + 6, tableY - 1, 1.5, "F");
      
      // Asset name
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.text);
      doc.text(item.name, cardX + pad + 12, tableY);
      
      // Percentage
      doc.setTextColor(...COLORS.textMuted);
      doc.text(formatAllocationPercent(item.value, total), cardX + pad + tableW * 0.6, tableY);
      
      // Value
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...COLORS.text);
      doc.text(formatCurrency(item.value, currency), cardX + pad + tableW - 6, tableY, { align: "right" });
      
      tableY += rowH;
    });
    
    y += tableH + 8;
  }

  // === TWO COLUMN SECTION: Ledger + Configuration ===
  const colGap = 6;
  const colW = (cardW - pad * 2 - colGap) / 2;
  const leftX = cardX + pad;
  const rightX = leftX + colW + colGap;

  // Final Ledger
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.textMuted);
  doc.text("FINAL LEDGER", leftX, y);
  
  // Configuration
  doc.text("CONFIGURATION", rightX, y);
  
  y += 5;
  const boxH = 28;
  
  // Ledger box
  drawRoundedRect(doc, leftX, y, colW, boxH, 2, COLORS.cardBg, COLORS.border);
  
  const ledgerPad = 6;
  let ledgerY = y + 8;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.textMuted);
  doc.text("Total Assets", leftX + ledgerPad, ledgerY);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.text);
  doc.text(formatCurrency(calculations.totalAssets, currency), leftX + colW - ledgerPad, ledgerY, { align: "right" });
  
  ledgerY += 7;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.textMuted);
  doc.text("Liabilities", leftX + ledgerPad, ledgerY);
  doc.setTextColor(...COLORS.danger);
  doc.text(`-${formatCurrency(calculations.totalLiabilities, currency)}`, leftX + colW - ledgerPad, ledgerY, { align: "right" });
  
  ledgerY += 7;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.text);
  doc.text("Net Zakatable", leftX + ledgerPad, ledgerY);
  doc.text(formatCurrency(calculations.netZakatableWealth, currency), leftX + colW - ledgerPad, ledgerY, { align: "right" });
  
  // Configuration box
  drawRoundedRect(doc, rightX, y, colW, boxH, 2, COLORS.cardBg, COLORS.border);
  
  let cfgY = y + 8;
  const nisabLabel = data.nisabStandard === "silver" ? "Nisab (Silver)" : "Nisab (Gold)";
  const calendarLabel = data.calendarType === "lunar" ? "Lunar (Hijri)" : "Solar";
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.textMuted);
  doc.text(nisabLabel, rightX + ledgerPad, cfgY);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.text);
  doc.text(formatCurrency(calculations.nisab, currency), rightX + colW - ledgerPad, cfgY, { align: "right" });
  
  cfgY += 7;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.textMuted);
  doc.text("Calendar", rightX + ledgerPad, cfgY);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.text);
  doc.text(calendarLabel, rightX + colW - ledgerPad, cfgY, { align: "right" });
  
  cfgY += 7;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.textMuted);
  doc.text("Rate Applied", rightX + ledgerPad, cfgY);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.text);
  doc.text(formatPercent(calculations.zakatRate), rightX + colW - ledgerPad, cfgY, { align: "right" });
  
  y += boxH + 8;

  // === PURIFICATION ALERT (if applicable) ===
  const totalPurification = calculations.interestToPurify + calculations.dividendsToPurify;
  if (totalPurification > 0) {
    const alertH = 16;
    drawRoundedRect(doc, cardX + pad, y, cardW - pad * 2, alertH, 2, [255, 248, 240] as [number, number, number], COLORS.border);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.danger);
    doc.text("✦ Purification Required", cardX + pad + 6, y + 6);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.textMuted);
    const parts: string[] = [];
    if (calculations.interestToPurify > 0) parts.push(`Interest: ${formatCurrency(calculations.interestToPurify, currency)}`);
    if (calculations.dividendsToPurify > 0) parts.push(`Non-Halal Dividends: ${formatCurrency(calculations.dividendsToPurify, currency)}`);
    doc.text(parts.join("  •  "), cardX + pad + 6, y + 12);
    
    y += alertH + 6;
  }

  // === FOOTER ===
  const footerY = cardY + cardH - 12;
  
  // Divider line
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.3);
  doc.line(cardX + pad, footerY - 4, cardX + cardW - pad, footerY - 4);
  
  // Footer text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.textLight);
  doc.text("Computed by ZakahFlow • zakah.vora.dev", cardX + pad, footerY);
  doc.text(`Generated ${dateStr}`, cardX + cardW - pad, footerY, { align: "right" });

  // Save PDF
  const fileName = calculationName
    ? `zakat-report-${calculationName.replace(/\s+/g, "-").toLowerCase()}.pdf`
    : `zakat-report-${new Date().toISOString().split("T")[0]}.pdf`;

  doc.save(fileName);
}
