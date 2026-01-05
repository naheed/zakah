/**
 * Generate Zakat PDF V2 - "The Wealth Purity Statement"
 */

import { pdf } from "@react-pdf/renderer";
import { ZakatFormData, calculateZakat, EnhancedAssetBreakdown } from "./zakatCalculations";
import { ZakatPDFDocumentV2, ZakatPDFDataV2, generateQRDataUrl } from "@/components/zakat/ZakatPDFDocumentV2";

// Convert Gregorian to Hijri (simple approximation)
function toHijriDate(date: Date): string {
    // Hijri calendar approximation
    // This is a simplified calculation - for production, use a proper library
    const gregorianDays = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
    const hijriEpochDays = Math.floor(new Date(622, 6, 16).getTime() / (1000 * 60 * 60 * 24));
    const daysSinceHijri = gregorianDays - hijriEpochDays;
    const hijriYear = Math.floor(daysSinceHijri / 354.37) + 1;
    const daysInYear = daysSinceHijri % 354.37;
    const hijriMonth = Math.floor(daysInYear / 29.5) + 1;
    const hijriDay = Math.floor(daysInYear % 29.5) + 1;

    const months = [
        "Muharram", "Safar", "Rabi' I", "Rabi' II",
        "Jumada I", "Jumada II", "Rajab", "Sha'ban",
        "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
    ];

    return `${months[Math.min(hijriMonth - 1, 11)]} ${hijriDay}, ${hijriYear} AH`;
}

// Generate unique report ID
function generateReportId(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "ZF-";
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Get calculation mode label - 4 fiqh-based modes
// Modes: bradford, hanafi, maliki-shafii, hanbali
function getModeLabel(mode: string): string {
    switch (mode) {
        case "bradford": return "Bradford (Balanced)";
        case "hanafi": return "Hanafi";
        case "maliki-shafii": return "Maliki/Shafi'i";
        case "hanbali": return "Hanbali";
        default: return "Bradford (Balanced)";
    }
}

// Get madhab label
function getMadhabLabel(madhab?: string): string {
    switch (madhab) {
        case "hanafi": return "Hanafi";
        case "maliki": return "Maliki";
        case "shafii": return "Shafi'i";
        case "hanbali": return "Hanbali";
        case "balanced": return "Balanced (Multiple Schools)";
        default: return "Balanced (Multiple Schools)";
    }
}

export async function generateZakatPDFV2(
    formData: ZakatFormData,
    calculationName?: string,
    userName?: string
): Promise<void> {
    // Calculate zakat with enhanced breakdown
    const calculations = calculateZakat(formData);

    const date = new Date();
    const dateStr = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
    const hijriStr = toHijriDate(date);
    const reportId = generateReportId();

    // Build QR data
    const qrData = {
        v: "2.0",
        id: reportId,
        d: date.toISOString().split("T")[0],
        c: formData.currency,
        a: calculations.totalAssets,
        l: calculations.totalLiabilities,
        n: calculations.netZakatableWealth,
        z: calculations.zakatDue,
        m: formData.madhab || "balanced",
        r: calculations.zakatRate,
    };

    // Generate QR code
    const qrDataUrl = await generateQRDataUrl(qrData);

    // Calculate gross assets (before zakatable adjustments)
    const grossAssets = Object.values(calculations.enhancedBreakdown)
        .filter((cat): cat is { total: number } =>
            typeof cat === "object" && "total" in cat && cat !== calculations.enhancedBreakdown.liabilities && cat !== calculations.enhancedBreakdown.exempt
        )
        .reduce((sum, cat) => sum + (cat.total || 0), 0);

    // Build PDF data
    const pdfData: ZakatPDFDataV2 = {
        userName,
        currency: formData.currency,
        calendarType: formData.calendarType,
        calendarLabel: formData.calendarType === "lunar" ? "Lunar (Hijri)" : "Solar (Gregorian)",
        nisabStandard: formData.nisabStandard,
        nisabLabel: formData.nisabStandard === "gold" ? "Gold Standard" : "Silver Standard",
        nisabValue: calculations.nisab,
        calculationMode: formData.calculationMode,
        calculationModeLabel: getModeLabel(formData.calculationMode),
        madhab: formData.madhab,
        madhabLabel: getMadhabLabel(formData.madhab),
        zakatRate: calculations.zakatRate,
        grossAssets,
        totalZakatableAssets: calculations.totalAssets,
        totalLiabilities: calculations.totalLiabilities,
        netZakatableWealth: calculations.netZakatableWealth,
        totalExempt: calculations.enhancedBreakdown.exempt.total,
        isAboveNisab: calculations.isAboveNisab,
        zakatDue: calculations.zakatDue,
        interestToPurify: calculations.interestToPurify,
        dividendsToPurify: calculations.dividendsToPurify,
        enhancedBreakdown: calculations.enhancedBreakdown,
        generatedAt: dateStr,
        generatedAtHijri: hijriStr,
        reportId,
    };

    // Generate PDF
    const blob = await pdf(
        ZakatPDFDocumentV2({ data: pdfData, calculationName, qrDataUrl })
    ).toBlob();

    // Trigger download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const fileName = calculationName
        ? `zakat-report-${calculationName.replace(/\s+/g, "-").toLowerCase()}.pdf`
        : `zakat-report-${date.toISOString().split("T")[0]}.pdf`;

    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, 500);
}
