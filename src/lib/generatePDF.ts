import { pdf } from "@react-pdf/renderer";
import { ZakatFormData } from "./zakatCalculations";
import { ZakatPDFDocument, ZakatPDFData } from "@/components/zakat/ZakatPDFDocument";

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

export async function generateZakatPDF(
  data: ZakatFormData,
  calculations: ZakatCalculations,
  calculationName?: string,
): Promise<void> {
  // Transform data for PDF component
  const pdfData: ZakatPDFData = {
    currency: data.currency,
    calendarType: data.calendarType,
    nisabStandard: data.nisabStandard,
    calculationMode: data.calculationMode,
    zakatRate: calculations.zakatRate,
    totalAssets: calculations.totalAssets,
    totalLiabilities: calculations.totalLiabilities,
    netZakatableWealth: calculations.netZakatableWealth,
    nisab: calculations.nisab,
    isAboveNisab: calculations.isAboveNisab,
    zakatDue: calculations.zakatDue,
    interestToPurify: calculations.interestToPurify,
    dividendsToPurify: calculations.dividendsToPurify,
    assetBreakdown: {
      liquidAssets: calculations.assetBreakdown.liquidAssets,
      investments: calculations.assetBreakdown.investments,
      retirement: calculations.assetBreakdown.retirement,
      realEstate: calculations.assetBreakdown.realEstate,
      business: calculations.assetBreakdown.business,
      otherAssets: calculations.assetBreakdown.otherAssets,
    },
  };

  // Generate PDF blob using @react-pdf/renderer
  const blob = await pdf(
    ZakatPDFDocument({ data: pdfData, calculationName })
  ).toBlob();

  // Trigger download
  // Trigger download
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;

  const fileName = calculationName
    ? `zakat-report-${calculationName.replace(/\s+/g, "-").toLowerCase()}.pdf`
    : `zakat-report-${new Date().toISOString().split("T")[0]}.pdf`;

  link.download = fileName;
  document.body.appendChild(link);
  link.click();

  // Cleanup with delay to ensure download starts
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 500);
}
