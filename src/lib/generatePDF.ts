import jsPDF from 'jspdf';
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

// Color palette - professional and clean
const COLORS = {
  primary: [34, 139, 84] as [number, number, number], // Emerald green
  primaryLight: [236, 253, 245] as [number, number, number],
  text: [17, 24, 39] as [number, number, number],
  textMuted: [107, 114, 128] as [number, number, number],
  border: [229, 231, 235] as [number, number, number],
  background: [249, 250, 251] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  // Asset colors - matching the web chart (lighter versions for flows)
  cashColor: [34, 197, 94] as [number, number, number], // Green
  cashColorLight: [187, 247, 208] as [number, number, number],
  investColor: [59, 130, 246] as [number, number, number], // Blue
  investColorLight: [191, 219, 254] as [number, number, number],
  retireColor: [139, 92, 246] as [number, number, number], // Purple
  retireColorLight: [221, 214, 254] as [number, number, number],
  realEstateColor: [249, 115, 22] as [number, number, number], // Orange
  realEstateColorLight: [254, 215, 170] as [number, number, number],
  businessColor: [236, 72, 153] as [number, number, number], // Pink
  businessColorLight: [251, 207, 232] as [number, number, number],
  otherColor: [6, 182, 212] as [number, number, number], // Cyan
  otherColorLight: [165, 243, 252] as [number, number, number],
};

// Asset category configurations
const ASSET_CONFIG: { key: keyof ZakatCalculations['assetBreakdown']; name: string; color: [number, number, number]; colorLight: [number, number, number] }[] = [
  { key: 'liquidAssets', name: 'Cash & Savings', color: COLORS.cashColor, colorLight: COLORS.cashColorLight },
  { key: 'investments', name: 'Investments', color: COLORS.investColor, colorLight: COLORS.investColorLight },
  { key: 'retirement', name: 'Retirement', color: COLORS.retireColor, colorLight: COLORS.retireColorLight },
  { key: 'realEstate', name: 'Real Estate', color: COLORS.realEstateColor, colorLight: COLORS.realEstateColorLight },
  { key: 'business', name: 'Business', color: COLORS.businessColor, colorLight: COLORS.businessColorLight },
  { key: 'otherAssets', name: 'Other Assets', color: COLORS.otherColor, colorLight: COLORS.otherColorLight },
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

function drawSankeyChart(
  doc: jsPDF,
  breakdown: ZakatCalculations['assetBreakdown'],
  zakatDue: number,
  netZakatableWealth: number,
  currency: string,
  startY: number,
  pageWidth: number
): number {
  const margin = 25;
  
  // Filter assets with values
  const assets = ASSET_CONFIG.filter(a => breakdown[a.key] > 0).map(a => ({
    ...a,
    value: breakdown[a.key],
  }));
  
  if (assets.length === 0) return startY;
  
  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
  
  const chartHeight = 85;
  const nodeWidth = 10;
  
  // Column positions - spread across the width
  const leftColX = margin + 75;
  const centerColX = pageWidth / 2 - nodeWidth / 2;
  const rightColX = pageWidth - margin - 75;
  
  // Calculate node positions for left side (assets)
  const nodePadding = 3;
  const availableHeight = chartHeight - (assets.length - 1) * nodePadding;
  
  interface NodePos { x: number; y: number; h: number; name: string; value: number; color: [number, number, number]; colorLight: [number, number, number] }
  const assetNodes: NodePos[] = [];
  
  let currentY = startY;
  assets.forEach(asset => {
    const nodeHeight = Math.max(10, (asset.value / totalAssets) * availableHeight);
    assetNodes.push({
      x: leftColX,
      y: currentY,
      h: nodeHeight,
      name: asset.name,
      value: asset.value,
      color: asset.color,
      colorLight: asset.colorLight,
    });
    currentY += nodeHeight + nodePadding;
  });
  
  // Center node (Net Zakatable Wealth)
  const centerNode = {
    x: centerColX,
    y: startY,
    h: chartHeight,
  };
  
  // Zakat node (right side)
  const zakatHeight = Math.max(25, chartHeight * 0.3);
  const zakatNode = {
    x: rightColX,
    y: startY + (chartHeight - zakatHeight) / 2,
    h: zakatHeight,
  };
  
  // Draw flows from assets to center (using light colors for visibility)
  let centerYOffset = 0;
  assetNodes.forEach(node => {
    const flowHeight = (node.value / totalAssets) * chartHeight;
    const targetYMid = startY + centerYOffset + flowHeight / 2;
    
    // Draw simplified flow band
    doc.setFillColor(...node.colorLight);
    
    const srcX = leftColX + nodeWidth;
    const srcY = node.y;
    const srcH = node.h;
    const tgtX = centerColX;
    const tgtY = startY + centerYOffset;
    const tgtH = flowHeight;
    
    // Draw as quadrilateral
    doc.triangle(srcX, srcY, srcX, srcY + srcH, tgtX, tgtY + tgtH / 2, 'F');
    doc.triangle(srcX, srcY, tgtX, tgtY + tgtH / 2, tgtX, tgtY, 'F');
    doc.triangle(srcX, srcY + srcH, tgtX, tgtY + tgtH, tgtX, tgtY + tgtH / 2, 'F');
    
    centerYOffset += flowHeight;
  });
  
  // Draw flows from center to zakat (colored by asset contribution)
  let zakatYOffset = 0;
  let centerFlowYOffset = 0;
  assetNodes.forEach(node => {
    const zakatContribution = (node.value / totalAssets) * zakatDue;
    const zakatFlowHeight = (zakatContribution / zakatDue) * zakatNode.h;
    const centerFlowHeight = (node.value / totalAssets) * chartHeight;
    
    doc.setFillColor(...node.colorLight);
    
    const srcX = centerColX + nodeWidth;
    const srcY = startY + centerFlowYOffset;
    const srcH = centerFlowHeight;
    const tgtX = rightColX;
    const tgtY = zakatNode.y + zakatYOffset;
    const tgtH = zakatFlowHeight;
    
    // Draw flow
    doc.triangle(srcX, srcY + srcH / 2 - 5, srcX, srcY + srcH / 2 + 5, tgtX, tgtY + tgtH / 2, 'F');
    doc.triangle(srcX, srcY + srcH / 2 - 5, tgtX, tgtY, tgtX, tgtY + tgtH / 2, 'F');
    doc.triangle(srcX, srcY + srcH / 2 + 5, tgtX, tgtY + tgtH, tgtX, tgtY + tgtH / 2, 'F');
    
    zakatYOffset += zakatFlowHeight;
    centerFlowYOffset += centerFlowHeight;
  });
  
  // Draw asset nodes with labels
  assetNodes.forEach(node => {
    doc.setFillColor(...node.color);
    doc.roundedRect(node.x, node.y, nodeWidth, node.h, 2, 2, 'F');
    
    // Label to the left
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.text);
    doc.text(node.name, node.x - 5, node.y + node.h / 2 - 2, { align: 'right' });
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.textMuted);
    doc.text(formatCurrency(node.value, currency), node.x - 5, node.y + node.h / 2 + 5, { align: 'right' });
  });
  
  // Draw center node
  doc.setFillColor(...COLORS.border);
  doc.roundedRect(centerNode.x, centerNode.y, nodeWidth, centerNode.h, 2, 2, 'F');
  
  // Center label below
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.text);
  doc.text('Net Zakatable', centerNode.x + nodeWidth / 2, centerNode.y + centerNode.h + 10, { align: 'center' });
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.textMuted);
  doc.text(formatCurrency(netZakatableWealth, currency), centerNode.x + nodeWidth / 2, centerNode.y + centerNode.h + 17, { align: 'center' });
  
  // Draw zakat node
  doc.setFillColor(...COLORS.primary);
  doc.roundedRect(zakatNode.x, zakatNode.y, nodeWidth, zakatNode.h, 2, 2, 'F');
  
  // Zakat label to the right
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.text);
  doc.text('Zakat Due', zakatNode.x + nodeWidth + 5, zakatNode.y + zakatNode.h / 2 - 2);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primary);
  doc.text(formatCurrency(zakatDue, currency), zakatNode.x + nodeWidth + 5, zakatNode.y + zakatNode.h / 2 + 7);
  
  return startY + chartHeight + 25;
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
  const margin = 25;
  
  // === HEADER ===
  // Accent bar at top
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 5, 'F');
  
  // Title
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.text);
  doc.text('Zakat Calculation Report', pageWidth / 2, 25, { align: 'center' });
  
  // Date
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.textMuted);
  doc.text(dateStr, pageWidth / 2, 33, { align: 'center' });
  
  // === MAIN RESULT CARD ===
  let yPos = 45;
  
  if (calculations.isAboveNisab) {
    // Green result card
    drawRoundedRect(doc, margin, yPos, pageWidth - margin * 2, 45, 6, COLORS.primary);
    
    doc.setTextColor(...COLORS.white);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Your Zakat Due', pageWidth / 2, yPos + 14, { align: 'center' });
    
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(calculations.zakatDue, currency), pageWidth / 2, yPos + 32, { align: 'center' });
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `${formatPercent(calculations.zakatRate)} of ${formatCurrency(calculations.netZakatableWealth, currency)} net zakatable wealth`,
      pageWidth / 2, 
      yPos + 42, 
      { align: 'center' }
    );
  } else {
    // Gray result card
    drawRoundedRect(doc, margin, yPos, pageWidth - margin * 2, 45, 6, COLORS.background, COLORS.border);
    
    doc.setTextColor(...COLORS.textMuted);
    doc.setFontSize(10);
    doc.text('Below Nisab Threshold', pageWidth / 2, yPos + 14, { align: 'center' });
    
    doc.setTextColor(...COLORS.text);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('No Zakat Due This Year', pageWidth / 2, yPos + 30, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.textMuted);
    doc.text(`Your wealth is below ${formatCurrency(calculations.nisab, currency)}`, pageWidth / 2, yPos + 40, { align: 'center' });
  }
  
  yPos += 55;
  
  // === SANKEY CHART ===
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.text);
  doc.text('Asset Flow to Zakat', margin, yPos);
  
  yPos += 10;
  yPos = drawSankeyChart(
    doc,
    calculations.assetBreakdown,
    calculations.zakatDue,
    calculations.netZakatableWealth,
    currency,
    yPos,
    pageWidth
  );
  
  // === CALCULATION DETAILS ===
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.text);
  doc.text('Calculation Details', margin, yPos);
  
  yPos += 8;
  
  // Simple key-value list
  const details = [
    ['Total Zakatable Assets', formatCurrency(calculations.totalAssets, currency)],
    ['Deductions (Liabilities)', `-${formatCurrency(calculations.totalLiabilities, currency)}`],
    ['Net Zakatable Wealth', formatCurrency(calculations.netZakatableWealth, currency)],
    [`Nisab (${data.nisabStandard === 'silver' ? 'Silver' : 'Gold'} Standard)`, formatCurrency(calculations.nisab, currency)],
    [`Zakat Rate (${data.calendarType === 'lunar' ? 'Lunar' : 'Solar'} Year)`, formatPercent(calculations.zakatRate)],
  ];
  
  doc.setFontSize(9);
  details.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.textMuted);
    doc.text(label, margin, yPos);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.text);
    doc.text(value, pageWidth - margin, yPos, { align: 'right' });
    
    yPos += 7;
  });
  
  // Divider
  yPos += 3;
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;
  
  // Final Zakat Due row
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.text);
  doc.text('Zakat Due', margin, yPos);
  doc.setTextColor(...COLORS.primary);
  doc.text(formatCurrency(calculations.zakatDue, currency), pageWidth - margin, yPos, { align: 'right' });
  
  yPos += 15;
  
  // === SETTINGS (compact) ===
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.textMuted);
  const settingsText = `Settings: ${data.calendarType === 'lunar' ? 'Lunar' : 'Solar'} Calendar • ${data.nisabStandard === 'silver' ? 'Silver' : 'Gold'} Nisab • ${data.calculationMode === 'conservative' ? 'Conservative' : 'Optimized'} Mode`;
  doc.text(settingsText, pageWidth / 2, yPos, { align: 'center' });
  
  // === PURIFICATION (if needed) ===
  const totalPurification = calculations.interestToPurify + calculations.dividendsToPurify;
  if (totalPurification > 0) {
    yPos += 12;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 38, 38);
    doc.text('⚠ Purification Required', margin, yPos);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.textMuted);
    let purifyText = '';
    if (calculations.interestToPurify > 0) {
      purifyText += `Interest: ${formatCurrency(calculations.interestToPurify, currency)}`;
    }
    if (calculations.dividendsToPurify > 0) {
      if (calculations.interestToPurify > 0) purifyText += ', ';
      purifyText += `Non-Halal Dividends: ${formatCurrency(calculations.dividendsToPurify, currency)}`;
    }
    doc.text(purifyText, margin + 45, yPos);
  }
  
  // === FOOTER ===
  // Bottom accent bar
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, pageHeight - 18, pageWidth, 3, 'F');
  
  doc.setTextColor(...COLORS.textMuted);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Generated on ${dateStr} • zakah.vora.dev`,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );
  
  // Save PDF
  const fileName = calculationName 
    ? `zakat-report-${calculationName.replace(/\s+/g, '-').toLowerCase()}.pdf`
    : `zakat-report-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
