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

// Color palette
const COLORS = {
  primary: [34, 139, 84] as [number, number, number], // Emerald green
  primaryLight: [240, 253, 244] as [number, number, number],
  secondary: [59, 130, 246] as [number, number, number], // Blue
  accent: [139, 92, 246] as [number, number, number], // Purple
  warning: [234, 88, 12] as [number, number, number], // Orange
  danger: [220, 38, 38] as [number, number, number],
  text: [17, 24, 39] as [number, number, number],
  textMuted: [107, 114, 128] as [number, number, number],
  border: [229, 231, 235] as [number, number, number],
  background: [249, 250, 251] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  chart1: [34, 139, 84] as [number, number, number],
  chart2: [59, 130, 246] as [number, number, number],
  chart3: [168, 85, 247] as [number, number, number],
  chart4: [251, 146, 60] as [number, number, number],
  chart5: [236, 72, 153] as [number, number, number],
};

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

function drawSankeyVisualization(
  doc: jsPDF,
  breakdown: ZakatCalculations['assetBreakdown'],
  zakatDue: number,
  netZakatableWealth: number,
  currency: string,
  startY: number,
  pageWidth: number
): number {
  const chartX = 25;
  const chartWidth = pageWidth - 50;
  const chartHeight = 80;
  const barHeight = 12;
  
  // Filter out zero-value assets
  const assets = [
    { name: 'Cash & Liquid', value: breakdown.liquidAssets, color: COLORS.chart1 },
    { name: 'Investments', value: breakdown.investments, color: COLORS.chart2 },
    { name: 'Retirement', value: breakdown.retirement, color: COLORS.chart3 },
    { name: 'Real Estate', value: breakdown.realEstate, color: COLORS.chart4 },
    { name: 'Business', value: breakdown.business, color: COLORS.chart5 },
    { name: 'Other Assets', value: breakdown.otherAssets, color: COLORS.accent },
  ].filter(a => a.value > 0);
  
  if (assets.length === 0) return startY;
  
  const total = assets.reduce((sum, a) => sum + a.value, 0);
  
  // Draw title
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.text);
  doc.text('Asset Flow to Zakat', chartX, startY);
  
  let currentY = startY + 8;
  
  // Draw stacked horizontal bar
  let currentX = chartX;
  assets.forEach((asset, i) => {
    const barWidth = (asset.value / total) * chartWidth;
    doc.setFillColor(...asset.color);
    if (i === 0) {
      // First segment - rounded left corners
      doc.roundedRect(currentX, currentY, barWidth + 3, barHeight, 3, 3, 'F');
    } else if (i === assets.length - 1) {
      // Last segment - rounded right corners
      doc.roundedRect(currentX - 3, currentY, barWidth + 3, barHeight, 3, 3, 'F');
    } else {
      doc.rect(currentX, currentY, barWidth, barHeight, 'F');
    }
    currentX += barWidth;
  });
  
  currentY += barHeight + 8;
  
  // Draw legend grid
  const legendCols = 3;
  const legendColWidth = chartWidth / legendCols;
  doc.setFontSize(8);
  
  assets.forEach((asset, i) => {
    const col = i % legendCols;
    const row = Math.floor(i / legendCols);
    const x = chartX + col * legendColWidth;
    const y = currentY + row * 14;
    
    // Color dot
    doc.setFillColor(...asset.color);
    doc.circle(x + 3, y + 2, 2, 'F');
    
    // Label
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.textMuted);
    doc.text(asset.name, x + 8, y + 3.5);
    
    // Value
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.text);
    doc.text(formatCurrency(asset.value, currency), x + 8, y + 10);
  });
  
  const legendRows = Math.ceil(assets.length / legendCols);
  currentY += legendRows * 14 + 8;
  
  // Draw flow arrow to Zakat
  const arrowY = currentY;
  doc.setDrawColor(...COLORS.primary);
  doc.setLineWidth(0.5);
  
  // Draw flow lines from bar to Zakat box
  const centerX = pageWidth / 2;
  doc.line(chartX, arrowY, centerX - 30, arrowY);
  doc.line(centerX + 30, arrowY, chartX + chartWidth, arrowY);
  
  // Arrow pointing down
  doc.line(centerX, arrowY - 5, centerX, arrowY + 5);
  doc.line(centerX - 3, arrowY + 2, centerX, arrowY + 5);
  doc.line(centerX + 3, arrowY + 2, centerX, arrowY + 5);
  
  currentY += 12;
  
  // Draw Zakat Due box
  const zakatBoxWidth = 100;
  const zakatBoxHeight = 28;
  const zakatBoxX = (pageWidth - zakatBoxWidth) / 2;
  
  drawRoundedRect(doc, zakatBoxX, currentY, zakatBoxWidth, zakatBoxHeight, 4, COLORS.primary);
  
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Zakat Due (2.5%)', pageWidth / 2, currentY + 10, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(zakatDue, currency), pageWidth / 2, currentY + 22, { align: 'center' });
  
  return currentY + zakatBoxHeight + 10;
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
  
  // === HEADER SECTION ===
  // Background gradient effect (simulated with overlapping rectangles)
  doc.setFillColor(...COLORS.primaryLight);
  doc.rect(0, 0, pageWidth, 65, 'F');
  
  // Decorative accent line
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 4, 'F');
  
  // Title
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.text);
  doc.text('Zakat Calculation Report', pageWidth / 2, 22, { align: 'center' });
  
  // Subtitle with mosque emoji (using text)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.textMuted);
  doc.text('Your personalized Zakat calculation', pageWidth / 2, 30, { align: 'center' });
  
  // Calculation name and date row
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  doc.setFontSize(9);
  if (calculationName) {
    doc.text(`${calculationName}  •  ${dateStr}`, pageWidth / 2, 40, { align: 'center' });
  } else {
    doc.text(dateStr, pageWidth / 2, 40, { align: 'center' });
  }
  
  // === MAIN RESULT CARD ===
  const mainCardY = 50;
  const mainCardHeight = 50;
  
  if (calculations.isAboveNisab) {
    drawRoundedRect(doc, 20, mainCardY, pageWidth - 40, mainCardHeight, 6, COLORS.primary);
    
    doc.setTextColor(...COLORS.white);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Your Zakat Due', pageWidth / 2, mainCardY + 14, { align: 'center' });
    
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(calculations.zakatDue, currency), pageWidth / 2, mainCardY + 32, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `${formatPercent(calculations.zakatRate)} of ${formatCurrency(calculations.netZakatableWealth, currency)} net zakatable wealth`,
      pageWidth / 2, 
      mainCardY + 43, 
      { align: 'center' }
    );
  } else {
    drawRoundedRect(doc, 20, mainCardY, pageWidth - 40, mainCardHeight, 6, COLORS.background, COLORS.border);
    
    doc.setTextColor(...COLORS.textMuted);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Below Nisab Threshold', pageWidth / 2, mainCardY + 16, { align: 'center' });
    
    doc.setTextColor(...COLORS.text);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('No Zakat Due This Year', pageWidth / 2, mainCardY + 32, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.textMuted);
    doc.text(`Your wealth is below ${formatCurrency(calculations.nisab, currency)}`, pageWidth / 2, mainCardY + 43, { align: 'center' });
  }
  
  let yPos = mainCardY + mainCardHeight + 15;
  
  // === SANKEY-STYLE ASSET FLOW ===
  yPos = drawSankeyVisualization(
    doc,
    calculations.assetBreakdown,
    calculations.zakatDue,
    calculations.netZakatableWealth,
    currency,
    yPos,
    pageWidth
  );
  
  // === CALCULATION SUMMARY TABLE ===
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.text);
  doc.text('Calculation Summary', 25, yPos);
  yPos += 3;
  
  autoTable(doc, {
    startY: yPos,
    head: [['Item', 'Value']],
    body: [
      ['Total Zakatable Assets', formatCurrency(calculations.totalAssets, currency)],
      ['Total Deductions', `-${formatCurrency(calculations.totalLiabilities, currency)}`],
      ['Net Zakatable Wealth', formatCurrency(calculations.netZakatableWealth, currency)],
      [`Nisab (${data.nisabStandard === 'silver' ? 'Silver' : 'Gold'})`, formatCurrency(calculations.nisab, currency)],
      [`Zakat Rate (${data.calendarType === 'lunar' ? 'Lunar' : 'Solar'})`, formatPercent(calculations.zakatRate)],
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
    },
    alternateRowStyles: {
      fillColor: COLORS.background,
    },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 'auto', halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: 25, right: 25 },
    tableLineColor: COLORS.border,
    tableLineWidth: 0.1,
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // === SETTINGS SUMMARY (compact) ===
  drawRoundedRect(doc, 25, yPos, pageWidth - 50, 22, 4, COLORS.background, COLORS.border);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.textMuted);
  
  const settings = [
    `Calendar: ${data.calendarType === 'lunar' ? 'Lunar' : 'Solar'}`,
    `Nisab: ${data.nisabStandard === 'silver' ? 'Silver' : 'Gold'}`,
    `Mode: ${data.calculationMode === 'conservative' ? 'Conservative' : 'Optimized'}`,
    `Household: ${data.isHousehold ? 'Yes' : 'No'}`,
  ];
  
  doc.text('Settings: ' + settings.join('  •  '), 30, yPos + 13);
  
  yPos += 30;
  
  // === PURIFICATION SECTION ===
  const totalPurification = calculations.interestToPurify + calculations.dividendsToPurify;
  if (totalPurification > 0) {
    drawRoundedRect(doc, 25, yPos, pageWidth - 50, 28, 4, [255, 243, 243] as [number, number, number], [252, 165, 165] as [number, number, number]);
    
    doc.setTextColor(...COLORS.danger);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Purification Required', 30, yPos + 10);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.textMuted);
    let purifyText = 'Must donate (without reward): ';
    if (calculations.interestToPurify > 0) {
      purifyText += `Interest: ${formatCurrency(calculations.interestToPurify, currency)}`;
    }
    if (calculations.dividendsToPurify > 0) {
      if (calculations.interestToPurify > 0) purifyText += ', ';
      purifyText += `Non-Halal Dividends: ${formatCurrency(calculations.dividendsToPurify, currency)}`;
    }
    doc.text(purifyText, 30, yPos + 20);
    yPos += 36;
  }
  
  // === FOOTER ===
  // Decorative bottom line
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, pageHeight - 20, pageWidth, 2, 'F');
  
  doc.setTextColor(...COLORS.textMuted);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.text(
    'This report is for personal reference only. Consult a qualified scholar for complex situations.',
    pageWidth / 2,
    pageHeight - 12,
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