import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ZakatFormData, formatCurrency, formatPercent } from './zakatCalculations';

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

// Color palette - vibrant and professional
const COLORS = {
  primary: [34, 139, 84] as [number, number, number], // Emerald green
  primaryLight: [236, 253, 245] as [number, number, number],
  primaryDark: [22, 101, 52] as [number, number, number],
  secondary: [59, 130, 246] as [number, number, number], // Blue
  accent: [139, 92, 246] as [number, number, number], // Purple
  warning: [234, 88, 12] as [number, number, number], // Orange
  danger: [220, 38, 38] as [number, number, number],
  text: [17, 24, 39] as [number, number, number],
  textMuted: [107, 114, 128] as [number, number, number],
  border: [229, 231, 235] as [number, number, number],
  background: [249, 250, 251] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  // Asset colors - matching the web chart
  cashColor: [34, 139, 84] as [number, number, number], // Green
  investColor: [59, 130, 246] as [number, number, number], // Blue
  retireColor: [139, 92, 246] as [number, number, number], // Purple
  realEstateColor: [251, 146, 60] as [number, number, number], // Orange
  businessColor: [236, 72, 153] as [number, number, number], // Pink
  otherColor: [99, 102, 241] as [number, number, number], // Indigo
};

// Asset category configurations
const ASSET_CONFIG: { key: keyof ZakatCalculations['assetBreakdown']; name: string; fullName: string; color: [number, number, number] }[] = [
  { key: 'liquidAssets', name: 'Cash & Savings', fullName: 'Bank accounts, cash, gold, silver, crypto', color: COLORS.cashColor },
  { key: 'investments', name: 'Investments', fullName: 'Stocks, bonds, mutual funds, brokerage', color: COLORS.investColor },
  { key: 'retirement', name: 'Retirement', fullName: '401(k), IRA, pension (net of penalties)', color: COLORS.retireColor },
  { key: 'realEstate', name: 'Real Estate', fullName: 'Investment properties for income', color: COLORS.realEstateColor },
  { key: 'business', name: 'Business', fullName: 'Inventory, receivables, cash', color: COLORS.businessColor },
  { key: 'otherAssets', name: 'Other', fullName: 'Trusts, debts owed, other assets', color: COLORS.otherColor },
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
    doc.roundedRect(x, y, w, h, r, r, 'FD');
  } else {
    doc.roundedRect(x, y, w, h, r, r, 'F');
  }
}

function drawSankeyFlowDiagram(
  doc: jsPDF,
  breakdown: ZakatCalculations['assetBreakdown'],
  zakatDue: number,
  netZakatableWealth: number,
  currency: string,
  startY: number,
  pageWidth: number
): number {
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  
  // Filter assets with values
  const assets = ASSET_CONFIG.filter(a => breakdown[a.key] > 0).map(a => ({
    ...a,
    value: breakdown[a.key],
  }));
  
  if (assets.length === 0) return startY;
  
  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
  
  // Section Title with decorative line
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.text);
  doc.text('Asset Flow to Zakat', margin, startY);
  
  // Decorative underline
  doc.setDrawColor(...COLORS.primary);
  doc.setLineWidth(2);
  doc.line(margin, startY + 3, margin + 50, startY + 3);
  
  let currentY = startY + 16;
  
  // === SANKEY-STYLE VISUALIZATION ===
  const chartHeight = 100;
  const leftColumnX = margin;
  const leftColumnWidth = 90;
  const centerColumnX = margin + 100;
  const centerColumnWidth = 60;
  const rightColumnX = pageWidth - margin - 80;
  const rightColumnWidth = 60;
  
  // Calculate proportional heights for left column (assets)
  const maxBarHeight = chartHeight - 10;
  let currentBarY = currentY;
  
  const assetBars: { x: number; y: number; w: number; h: number; color: [number, number, number]; name: string; value: number }[] = [];
  
  assets.forEach((asset, i) => {
    const barHeight = Math.max(15, (asset.value / totalAssets) * maxBarHeight);
    assetBars.push({
      x: leftColumnX,
      y: currentBarY,
      w: leftColumnWidth,
      h: barHeight,
      color: asset.color,
      name: asset.name,
      value: asset.value,
    });
    currentBarY += barHeight + 4;
  });
  
  // Draw asset bars
  assetBars.forEach((bar, i) => {
    // Rounded rectangle for asset
    doc.setFillColor(...bar.color);
    const radius = 3;
    doc.roundedRect(bar.x, bar.y, bar.w, bar.h, radius, radius, 'F');
    
    // Asset name and value inside bar if tall enough
    if (bar.h >= 12) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.white);
      doc.text(bar.name, bar.x + 4, bar.y + bar.h / 2 - 1);
      
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text(formatCurrency(bar.value, currency), bar.x + 4, bar.y + bar.h / 2 + 6);
    }
    
    // Draw flow line to center
    const flowMidY = bar.y + bar.h / 2;
    const centerMidY = currentY + chartHeight / 2;
    
    // Curved bezier-like path (simplified as lines with opacity)
    doc.setDrawColor(...bar.color);
    doc.setLineWidth(Math.max(0.5, bar.h / 10));
    
    // Start point to control point 1
    const startX = bar.x + bar.w;
    const endX = centerColumnX;
    const cp1X = startX + 15;
    const cp2X = endX - 15;
    
    // Draw gradient-like flow (multiple lines with decreasing opacity simulated by lighter colors)
    for (let j = 0; j < 3; j++) {
      const offset = j * 2;
      const alpha = 1 - j * 0.3;
      const lineColor = bar.color.map(c => Math.min(255, c + (1 - alpha) * 100)) as [number, number, number];
      doc.setDrawColor(...lineColor);
      doc.setLineWidth(Math.max(0.3, bar.h / 15));
      
      // Simplified curved path using line segments
      const steps = 10;
      let prevX = startX;
      let prevY = flowMidY;
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        const x = Math.pow(1-t, 3) * startX + 3 * Math.pow(1-t, 2) * t * cp1X + 3 * (1-t) * t * t * cp2X + Math.pow(t, 3) * endX;
        const y = Math.pow(1-t, 3) * flowMidY + 3 * Math.pow(1-t, 2) * t * flowMidY + 3 * (1-t) * t * t * centerMidY + Math.pow(t, 3) * centerMidY;
        doc.line(prevX, prevY + offset, x, y + offset);
        prevX = x;
        prevY = y;
      }
    }
  });
  
  // Draw center column (Net Zakatable Wealth)
  const centerBoxY = currentY + 10;
  const centerBoxHeight = chartHeight - 20;
  
  drawRoundedRect(doc, centerColumnX, centerBoxY, centerColumnWidth, centerBoxHeight, 4, COLORS.primaryLight, COLORS.primary);
  
  // Center column text
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.text);
  doc.text('Net Zakatable', centerColumnX + centerColumnWidth / 2, centerBoxY + centerBoxHeight / 2 - 8, { align: 'center' });
  doc.text('Wealth', centerColumnX + centerColumnWidth / 2, centerBoxY + centerBoxHeight / 2 - 1, { align: 'center' });
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primary);
  doc.text(formatCurrency(netZakatableWealth, currency), centerColumnX + centerColumnWidth / 2, centerBoxY + centerBoxHeight / 2 + 10, { align: 'center' });
  
  // Draw flow from center to Zakat Due
  const centerMidY = centerBoxY + centerBoxHeight / 2;
  const zakatBoxY = currentY + (chartHeight - 50) / 2;
  const zakatMidY = zakatBoxY + 25;
  
  doc.setDrawColor(...COLORS.primary);
  doc.setLineWidth(2);
  
  // Flow arrow
  const flowStartX = centerColumnX + centerColumnWidth;
  const flowEndX = rightColumnX;
  
  for (let j = 0; j < 3; j++) {
    const offset = j * 3 - 3;
    const alpha = 1 - j * 0.25;
    const lineColor = COLORS.primary.map(c => Math.min(255, c + (1 - alpha) * 80)) as [number, number, number];
    doc.setDrawColor(...lineColor);
    doc.setLineWidth(1.5 - j * 0.3);
    
    const steps = 8;
    let prevX = flowStartX;
    let prevY = centerMidY;
    const cp1X = flowStartX + 15;
    const cp2X = flowEndX - 15;
    
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      const x = Math.pow(1-t, 3) * flowStartX + 3 * Math.pow(1-t, 2) * t * cp1X + 3 * (1-t) * t * t * cp2X + Math.pow(t, 3) * flowEndX;
      const y = Math.pow(1-t, 3) * centerMidY + 3 * Math.pow(1-t, 2) * t * centerMidY + 3 * (1-t) * t * t * zakatMidY + Math.pow(t, 3) * zakatMidY;
      doc.line(prevX, prevY + offset, x, y + offset);
      prevX = x;
      prevY = y;
    }
  }
  
  // Draw Zakat Due box (prominent)
  drawRoundedRect(doc, rightColumnX, zakatBoxY, rightColumnWidth, 50, 5, COLORS.primary);
  
  // Zakat Due text
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.white);
  doc.text('Zakat Due', rightColumnX + rightColumnWidth / 2, zakatBoxY + 14, { align: 'center' });
  
  doc.setFontSize(7);
  doc.text('(2.5%)', rightColumnX + rightColumnWidth / 2, zakatBoxY + 22, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(zakatDue, currency), rightColumnX + rightColumnWidth / 2, zakatBoxY + 38, { align: 'center' });
  
  currentY += chartHeight + 15;
  
  // === ASSET BREAKDOWN CARDS ===
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.text);
  doc.text('Asset Breakdown', margin, currentY);
  currentY += 8;
  
  // Draw asset cards in a grid (2 columns)
  const cardWidth = (contentWidth - 10) / 2;
  const cardHeight = 24;
  const cardPadding = 4;
  
  assets.forEach((asset, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cardX = margin + col * (cardWidth + 10);
    const cardY = currentY + row * (cardHeight + 6);
    
    // Card background
    drawRoundedRect(doc, cardX, cardY, cardWidth, cardHeight, 3, COLORS.white, COLORS.border);
    
    // Color indicator
    doc.setFillColor(...asset.color);
    doc.roundedRect(cardX + 3, cardY + 3, 4, cardHeight - 6, 2, 2, 'F');
    
    // Asset name
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.text);
    doc.text(asset.name, cardX + 12, cardY + 10);
    
    // Asset description
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.textMuted);
    const truncatedDesc = asset.fullName.length > 40 ? asset.fullName.substring(0, 37) + '...' : asset.fullName;
    doc.text(truncatedDesc, cardX + 12, cardY + 17);
    
    // Value
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.text);
    doc.text(formatCurrency(asset.value, currency), cardX + cardWidth - cardPadding, cardY + 13, { align: 'right' });
  });
  
  const assetRows = Math.ceil(assets.length / 2);
  currentY += assetRows * (cardHeight + 6) + 10;
  
  return currentY;
}

export function generateZakatPDF(
  data: ZakatFormData,
  calculations: ZakatCalculations,
  calculationName?: string
): void {
  const doc = new jsPDF();
  const { currency } = data;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  
  // === HEADER SECTION ===
  // Full-width header background
  doc.setFillColor(...COLORS.primaryLight);
  doc.rect(0, 0, pageWidth, 70, 'F');
  
  // Decorative top accent bar
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 6, 'F');
  
  // Logo/Brand circle
  doc.setFillColor(...COLORS.primary);
  doc.circle(pageWidth / 2, 22, 10, 'F');
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Z', pageWidth / 2, 26, { align: 'center' });
  
  // Title
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.text);
  doc.text('Zakat Calculation Report', pageWidth / 2, 45, { align: 'center' });
  
  // Subtitle
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.textMuted);
  doc.text('Your personalized Zakat calculation', pageWidth / 2, 53, { align: 'center' });
  
  // Date and name
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  doc.setFontSize(9);
  const headerInfo = calculationName ? `${calculationName}  •  ${dateStr}` : dateStr;
  doc.text(headerInfo, pageWidth / 2, 62, { align: 'center' });
  
  // === MAIN RESULT CARD ===
  let yPos = 80;
  const mainCardHeight = 55;
  
  if (calculations.isAboveNisab) {
    // Main card
    drawRoundedRect(doc, margin, yPos, pageWidth - margin * 2, mainCardHeight, 8, COLORS.primary);
    
    doc.setTextColor(...COLORS.white);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Your Zakat Due', pageWidth / 2, yPos + 16, { align: 'center' });
    
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(calculations.zakatDue, currency), pageWidth / 2, yPos + 38, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `${formatPercent(calculations.zakatRate)} of ${formatCurrency(calculations.netZakatableWealth, currency)} net zakatable wealth`,
      pageWidth / 2, 
      yPos + 50, 
      { align: 'center' }
    );
  } else {
    drawRoundedRect(doc, margin, yPos, pageWidth - margin * 2, mainCardHeight, 8, COLORS.background, COLORS.border);
    
    doc.setTextColor(...COLORS.textMuted);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Below Nisab Threshold', pageWidth / 2, yPos + 16, { align: 'center' });
    
    doc.setTextColor(...COLORS.text);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('No Zakat Due This Year', pageWidth / 2, yPos + 35, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.textMuted);
    doc.text(`Your wealth is below ${formatCurrency(calculations.nisab, currency)}`, pageWidth / 2, yPos + 48, { align: 'center' });
  }
  
  yPos += mainCardHeight + 15;
  
  // === SANKEY FLOW VISUALIZATION ===
  yPos = drawSankeyFlowDiagram(
    doc,
    calculations.assetBreakdown,
    calculations.zakatDue,
    calculations.netZakatableWealth,
    currency,
    yPos,
    pageWidth
  );
  
  // === CALCULATION SUMMARY TABLE ===
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.text);
  doc.text('Calculation Summary', margin, yPos);
  
  // Decorative underline
  doc.setDrawColor(...COLORS.primary);
  doc.setLineWidth(2);
  doc.line(margin, yPos + 3, margin + 55, yPos + 3);
  
  yPos += 8;
  
  autoTable(doc, {
    startY: yPos,
    head: [['Item', 'Value']],
    body: [
      ['Total Zakatable Assets', formatCurrency(calculations.totalAssets, currency)],
      ['Total Deductions', `-${formatCurrency(calculations.totalLiabilities, currency)}`],
      ['Net Zakatable Wealth', formatCurrency(calculations.netZakatableWealth, currency)],
      [`Nisab Threshold (${data.nisabStandard === 'silver' ? 'Silver' : 'Gold'})`, formatCurrency(calculations.nisab, currency)],
      [`Zakat Rate (${data.calendarType === 'lunar' ? 'Lunar' : 'Solar'} Year)`, formatPercent(calculations.zakatRate)],
      ['Zakat Due', formatCurrency(calculations.zakatDue, currency)],
    ],
    theme: 'plain',
    headStyles: { 
      fillColor: COLORS.background,
      textColor: COLORS.textMuted,
      fontStyle: 'bold',
      fontSize: 8,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: COLORS.text,
      cellPadding: 4,
    },
    alternateRowStyles: {
      fillColor: COLORS.background,
    },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 'auto', halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: margin, right: margin },
    tableLineColor: COLORS.border,
    tableLineWidth: 0.1,
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 12;
  
  // === SETTINGS BADGE ===
  const settingsHeight = 20;
  drawRoundedRect(doc, margin, yPos, pageWidth - margin * 2, settingsHeight, 4, COLORS.background, COLORS.border);
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.textMuted);
  
  const settings = [
    `Calendar: ${data.calendarType === 'lunar' ? 'Lunar' : 'Solar'}`,
    `Nisab: ${data.nisabStandard === 'silver' ? 'Silver' : 'Gold'}`,
    `Mode: ${data.calculationMode === 'conservative' ? 'Conservative' : 'Optimized'}`,
    `Household: ${data.isHousehold ? 'Yes' : 'No'}`,
  ];
  
  doc.text('Settings: ' + settings.join('  •  '), margin + 6, yPos + 12);
  
  yPos += settingsHeight + 10;
  
  // === PURIFICATION SECTION ===
  const totalPurification = calculations.interestToPurify + calculations.dividendsToPurify;
  if (totalPurification > 0 && yPos < pageHeight - 60) {
    const purifyBg: [number, number, number] = [254, 242, 242];
    const purifyBorder: [number, number, number] = [252, 165, 165];
    
    drawRoundedRect(doc, margin, yPos, pageWidth - margin * 2, 32, 4, purifyBg, purifyBorder);
    
    doc.setTextColor(...COLORS.danger);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('⚠ Purification Required', margin + 8, yPos + 12);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.textMuted);
    let purifyText = 'Must donate (without reward expectation): ';
    if (calculations.interestToPurify > 0) {
      purifyText += `Interest: ${formatCurrency(calculations.interestToPurify, currency)}`;
    }
    if (calculations.dividendsToPurify > 0) {
      if (calculations.interestToPurify > 0) purifyText += ', ';
      purifyText += `Non-Halal Dividends: ${formatCurrency(calculations.dividendsToPurify, currency)}`;
    }
    doc.text(purifyText, margin + 8, yPos + 24);
  }
  
  // === FOOTER ===
  // Decorative bottom bar
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, pageHeight - 22, pageWidth, 3, 'F');
  
  doc.setTextColor(...COLORS.textMuted);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.text(
    'This report is for personal reference only. Consult a qualified scholar for complex situations.',
    pageWidth / 2,
    pageHeight - 13,
    { align: 'center' }
  );
  
  doc.setFont('helvetica', 'normal');
  doc.text(
    'Built by Naheed Vora • zakatcalculator.app',
    pageWidth / 2,
    pageHeight - 7,
    { align: 'center' }
  );
  
  // Save PDF
  const fileName = calculationName 
    ? `zakat-calculation-${calculationName.replace(/\s+/g, '-').toLowerCase()}.pdf`
    : `zakat-calculation-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
