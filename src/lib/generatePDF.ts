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

export function generateZakatPDF(
  data: ZakatFormData,
  calculations: ZakatCalculations,
  calculationName?: string
): void {
  const doc = new jsPDF();
  const { currency } = data;
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFontSize(24);
  doc.setTextColor(41, 98, 255);
  doc.text('Zakat Calculation Report', pageWidth / 2, 25, { align: 'center' });
  
  // Subtitle
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text('Based on Sheikh Joe Bradford\'s methodology', pageWidth / 2, 33, { align: 'center' });
  
  // Calculation name and date
  doc.setFontSize(10);
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  if (calculationName) {
    doc.text(`Calculation: ${calculationName}`, pageWidth / 2, 42, { align: 'center' });
    doc.text(`Generated: ${dateStr}`, pageWidth / 2, 48, { align: 'center' });
  } else {
    doc.text(`Generated: ${dateStr}`, pageWidth / 2, 42, { align: 'center' });
  }
  
  let yPos = calculationName ? 58 : 52;
  
  // Main Result Box
  doc.setFillColor(41, 98, 255);
  doc.roundedRect(20, yPos, pageWidth - 40, 35, 3, 3, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  
  if (calculations.isAboveNisab) {
    doc.text('Your Zakat Due', pageWidth / 2, yPos + 12, { align: 'center' });
    doc.setFontSize(28);
    doc.text(formatCurrency(calculations.zakatDue, currency), pageWidth / 2, yPos + 26, { align: 'center' });
  } else {
    doc.text('Below Nisab Threshold', pageWidth / 2, yPos + 14, { align: 'center' });
    doc.setFontSize(16);
    doc.text('No Zakat Due This Year', pageWidth / 2, yPos + 26, { align: 'center' });
  }
  
  yPos += 45;
  
  // Calculation Settings
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text('Calculation Settings', 20, yPos);
  yPos += 5;
  
  autoTable(doc, {
    startY: yPos,
    head: [['Setting', 'Value']],
    body: [
      ['Calendar Type', data.calendarType === 'lunar' ? 'Lunar (Hijri)' : 'Solar (Gregorian)'],
      ['Nisab Standard', data.nisabStandard === 'silver' ? 'Silver' : 'Gold'],
      ['Calculation Mode', data.calculationMode === 'conservative' ? 'Conservative' : 'Optimized'],
      ['Household Calculation', data.isHousehold ? 'Yes' : 'No'],
    ],
    theme: 'striped',
    headStyles: { fillColor: [41, 98, 255] },
    margin: { left: 20, right: 20 },
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // Asset Breakdown
  doc.setFontSize(14);
  doc.text('Asset Breakdown', 20, yPos);
  yPos += 5;
  
  const assetRows: [string, string][] = [];
  if (calculations.assetBreakdown.liquidAssets > 0) {
    assetRows.push(['Liquid Assets', formatCurrency(calculations.assetBreakdown.liquidAssets, currency)]);
  }
  if (calculations.assetBreakdown.investments > 0) {
    assetRows.push(['Investments', formatCurrency(calculations.assetBreakdown.investments, currency)]);
  }
  if (calculations.assetBreakdown.retirement > 0) {
    assetRows.push(['Retirement Accounts', formatCurrency(calculations.assetBreakdown.retirement, currency)]);
  }
  if (calculations.assetBreakdown.realEstate > 0) {
    assetRows.push(['Real Estate', formatCurrency(calculations.assetBreakdown.realEstate, currency)]);
  }
  if (calculations.assetBreakdown.business > 0) {
    assetRows.push(['Business Assets', formatCurrency(calculations.assetBreakdown.business, currency)]);
  }
  if (calculations.assetBreakdown.otherAssets > 0) {
    assetRows.push(['Other Assets', formatCurrency(calculations.assetBreakdown.otherAssets, currency)]);
  }
  if (calculations.assetBreakdown.exemptAssets > 0) {
    assetRows.push(['Exempt Assets (Not Zakatable)', formatCurrency(calculations.assetBreakdown.exemptAssets, currency)]);
  }
  
  if (assetRows.length > 0) {
    autoTable(doc, {
      startY: yPos,
      head: [['Category', 'Amount']],
      body: assetRows,
      theme: 'striped',
      headStyles: { fillColor: [41, 98, 255] },
      margin: { left: 20, right: 20 },
    });
    yPos = (doc as any).lastAutoTable.finalY + 10;
  }
  
  // Calculation Summary
  doc.setFontSize(14);
  doc.text('Calculation Summary', 20, yPos);
  yPos += 5;
  
  autoTable(doc, {
    startY: yPos,
    head: [['Item', 'Value']],
    body: [
      ['Total Zakatable Assets', formatCurrency(calculations.totalAssets, currency)],
      ['Total Deductions', `-${formatCurrency(calculations.totalLiabilities, currency)}`],
      ['Net Zakatable Wealth', formatCurrency(calculations.netZakatableWealth, currency)],
      [`Nisab (${data.nisabStandard})`, formatCurrency(calculations.nisab, currency)],
      [`Zakat Rate (${data.calendarType})`, formatPercent(calculations.zakatRate)],
      ['Zakat Due', formatCurrency(calculations.zakatDue, currency)],
    ],
    theme: 'striped',
    headStyles: { fillColor: [41, 98, 255] },
    margin: { left: 20, right: 20 },
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // Purification Section (if applicable)
  const totalPurification = calculations.interestToPurify + calculations.dividendsToPurify;
  if (totalPurification > 0) {
    doc.setFillColor(255, 235, 235);
    doc.roundedRect(20, yPos, pageWidth - 40, 30, 3, 3, 'F');
    
    doc.setTextColor(180, 0, 0);
    doc.setFontSize(12);
    doc.text('Purification Required', 25, yPos + 10);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    let purifyText = 'The following must be donated to charity: ';
    if (calculations.interestToPurify > 0) {
      purifyText += `Interest: ${formatCurrency(calculations.interestToPurify, currency)}`;
    }
    if (calculations.dividendsToPurify > 0) {
      if (calculations.interestToPurify > 0) purifyText += ', ';
      purifyText += `Non-Halal Dividends: ${formatCurrency(calculations.dividendsToPurify, currency)}`;
    }
    doc.text(purifyText, 25, yPos + 20);
    yPos += 40;
  }
  
  // Footer
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.text(
    'This report is for personal reference only. Consult a qualified scholar for complex situations.',
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: 'center' }
  );
  
  // Save PDF
  const fileName = calculationName 
    ? `zakat-calculation-${calculationName.replace(/\s+/g, '-').toLowerCase()}.pdf`
    : `zakat-calculation-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
