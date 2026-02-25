/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * ZakatPDFDocument V2 - "The Wealth Purity Statement"
 * 
 * Design: Single Page A4 (Soulful Theme)
 * - Header: Bismillah, Title, Date
 * - Hero: Action Card + Equation
 * - Table: Detailed breakdown
 * - Footer: Purification + Impact
 */

import React from "react";
import {
    Document,
    Page,
    View,
    Text,
    StyleSheet,
    Font,
    Image,
    Link,
    Svg,
    Path,
} from "@react-pdf/renderer";
import { DOMAIN_CONFIG } from "@/lib/domainConfig";
import { EnhancedAssetBreakdown, AssetCategory, ZakatFormData, ZakatReport, Madhab, ZAKAT_PRESETS, DEFAULT_CONFIG } from "@zakatflow/core";
// QR code removed for cleaner reports
import { getAssetRuleExplanations, getMethodologyDisplayName } from "@zakatflow/core";

// Font imports from assets
import loraRegular from "@/assets/pdf-fonts/Lora-Regular.ttf?url";
import loraSemiBold from "@/assets/pdf-fonts/Lora-SemiBold.ttf?url";
import workSansRegular from "@/assets/pdf-fonts/WorkSans-Regular.ttf?url";
import workSansMedium from "@/assets/pdf-fonts/WorkSans-Medium.ttf?url";
import workSansSemiBold from "@/assets/pdf-fonts/WorkSans-SemiBold.ttf?url";
import notoNaskhArabic from "@/assets/pdf-fonts/NotoNaskhArabic-Regular.ttf?url";
import logo from "@/assets/zakatflow-logo.png";

// Register fonts
Font.register({
    family: "Lora",
    fonts: [
        { src: loraRegular, fontWeight: 400 },
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

Font.register({
    family: "NotoNaskhArabic",
    src: notoNaskhArabic,
});

// Color palette (Emerald Theme)
const COLORS = {
    primary: "#047857", // Emerald 700
    primaryLight: "#D1FAE5", // Emerald 100
    primaryDark: "#064E3B", // Emerald 900
    text: "#111827", // Gray 900
    textMuted: "#6B7280", // Gray 500
    textLight: "#9CA3AF", // Gray 400
    border: "#E5E7EB", // Gray 200
    bgSurface: "#F9FAFB", // Gray 50
    danger: "#DC2626",
    dangerBg: "#FEF2F2",
    amber: "#D97706",
    amberBg: "#FFFBEB",
    indigo: "#4F46E5",
    indigoBg: "#EEF2FF",
    white: "#FFFFFF",
    gray100: "#F3F4F6",
};

// Styles
const styles = StyleSheet.create({
    page: {
        backgroundColor: COLORS.white,
        padding: 40, // 40pt padding (~14mm) matches CSS padding
        fontFamily: "WorkSans",
        fontSize: 9,
        color: COLORS.text,
    },
    // Top Bar (Print context)
    topBar: {
        height: 6,
        backgroundColor: COLORS.primary,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
    },
    // Header
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 24,
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray100, // Light border
        paddingBottom: 20,
    },
    bismillah: {
        fontFamily: "NotoNaskhArabic",
        fontSize: 14,
        color: COLORS.primaryDark,
        marginBottom: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 800, // ExtraBold equivalent
        color: COLORS.text,
        lineHeight: 1,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 9,
        color: COLORS.textMuted,
        fontWeight: 500,
    },
    headerRight: {
        alignItems: "flex-end",
    },
    logoText: {
        fontSize: 12,
        fontWeight: 600,
        color: COLORS.primary,
        marginBottom: 6,
    },
    dateLabel: {
        fontSize: 7,
        fontWeight: 700,
        color: COLORS.textLight,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    dateValue: {
        fontSize: 9,
        fontWeight: 500,
        color: COLORS.text,
    },
    hijriValue: {
        fontSize: 8,
        color: COLORS.textMuted,
    },

    // Hero Section (Grid)
    heroSection: {
        flexDirection: "row",
        gap: 20,
        marginBottom: 30,
        height: 120, // Approx height
    },
    // Left Card (Action)
    actionCard: {
        flex: 5,
        borderWidth: 1.5,
        borderColor: COLORS.primary,
        borderRadius: 12,
        padding: 16,
        justifyContent: "space-between",
        position: "relative",
    },
    actionLabelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 8,
    },
    actionLabel: {
        fontSize: 7,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 1,
        color: COLORS.primary,
    },
    actionAmount: {
        fontFamily: "WorkSans",
        fontSize: 32,
        fontWeight: 800,
        color: COLORS.text,
        letterSpacing: -1,
    },
    actionText: {
        fontSize: 8,
        color: COLORS.textMuted,
        fontWeight: 500,
        marginTop: 8,
        lineHeight: 1.4,
    },

    // Right Card (Equation)
    equationCard: {
        flex: 7,
        backgroundColor: COLORS.bgSurface,
        borderRadius: 12,
        padding: 16,
        justifyContent: "center",
    },
    equationRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    equationCol: {
        alignItems: "flex-start",
    },
    eqnLabel: {
        fontSize: 6,
        fontWeight: 700,
        textTransform: "uppercase",
        color: COLORS.textLight,
        marginBottom: 2,
        letterSpacing: 0.5,
    },
    eqnValue: {
        fontSize: 14,
        fontWeight: 700,
        color: COLORS.text,
    },
    eqnOperator: {
        fontSize: 14,
        color: COLORS.textLight,
    },
    trustRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: 8,
        marginTop: 4,
    },
    trustBadge: {
        fontSize: 7,
        color: COLORS.textMuted,
        flexDirection: "row",
        alignItems: "center",
    },
    nisabBadge: {
        fontSize: 7,
        fontWeight: 600,
        color: COLORS.primary,
        backgroundColor: COLORS.primaryLight,
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 4,
    },

    // Table Section
    tableHeaderRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray100, // Light border
        paddingBottom: 6,
        marginBottom: 8,
    },
    tableHeaderCell: {
        fontSize: 6,
        fontWeight: 700,
        color: COLORS.textLight,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    // Columns (Widths)
    col1: { width: "45%" }, // Asset Class
    col2: { width: "15%", textAlign: "right" }, // Gross
    col3: { width: "15%", textAlign: "center" }, // Weight
    col4: { width: "25%", textAlign: "right" }, // Zakatable

    tableRow: {
        flexDirection: "row",
        paddingVertical: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.border,
        alignItems: "center",
    },
    iconBox: {
        width: 20,
        height: 20,
        backgroundColor: COLORS.bgSurface,
        borderRadius: 6,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    categoryLabel: {
        fontSize: 9,
        fontWeight: 700, // Bold
        color: COLORS.text,
    },
    categorySub: {
        fontSize: 7,
        color: COLORS.textMuted,
        marginTop: 1,
    },
    cellMono: {
        fontFamily: "WorkSans", // Or monospace font if available, limiting to WorkSans
        fontSize: 9,
        color: COLORS.textMuted,
    },
    weightBadge: {
        fontSize: 7,
        fontWeight: 700,
        backgroundColor: COLORS.bgSurface,
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 4,
        color: COLORS.textMuted,
        alignSelf: "center",
    },
    cellBold: {
        fontSize: 9,
        fontWeight: 700,
        color: COLORS.text,
    },

    // Footer
    footerGrid: {
        flexDirection: "row",
        gap: 20,
        marginTop: 20,
        marginBottom: 20,
    },
    footerCard: {
        flex: 1,
        borderRadius: 8,
        padding: 12,
        justifyContent: "space-between",
    },
    footerCardTitle: {
        fontSize: 7,
        fontWeight: 700,
        textTransform: "uppercase",
        marginBottom: 4,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    footerCardText: {
        fontSize: 8,
        lineHeight: 1.4,
        marginBottom: 8,
    },
    footerCardSub: {
        fontSize: 6,
        fontWeight: 500,
        opacity: 0.7,
    },

    // Bottom
    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        borderTopWidth: 1,
        borderTopColor: COLORS.gray100, // Light border
        paddingTop: 16,
    },
    bottomText: {
        fontSize: 7,
        color: COLORS.textLight,
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    arabicFooter: {
        fontFamily: "NotoNaskhArabic",
        fontSize: 9,
        color: COLORS.textLight,
        marginBottom: 4,
        textAlign: "center",
        width: "100%",
        position: "absolute",
        bottom: 20,
    }
});

// Types match V2
export interface ZakatPDFDataV2 {
    userName?: string;
    currency: string;
    calendarType: "lunar" | "solar";
    calendarLabel: string;
    nisabStandard: "gold" | "silver";
    nisabLabel: string;
    nisabValue: number;
    calculationMode: string;
    calculationModeLabel: string;
    madhab?: string;
    madhabLabel?: string;
    zakatRate: number;
    grossAssets: number;
    totalZakatableAssets: number;
    totalLiabilities: number;
    netZakatableWealth: number;
    totalExempt: number;
    isAboveNisab: boolean;
    zakatDue: number;
    interestToPurify: number;
    dividendsToPurify: number;
    enhancedBreakdown: EnhancedAssetBreakdown;
    generatedAt: string;
    generatedAtHijri: string;
    reportId: string;
    referralCode?: string;
    formData?: ZakatFormData;
    referralStats?: {
        totalReferrals: number;
        totalZakatCalculated: number | null;
        thresholdMet: boolean;
    };
}

// Helpers
function formatCurrency(amount: number, currency: string = "USD", digits: number = 0): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(amount);
}

function formatCompactCurrency(amount: number, currency: string = "USD"): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        notation: "compact",
        maximumFractionDigits: 1
    }).format(amount);
}

function formatPercent(value: number): string {
    return `${(value * 100).toFixed(0)}%`;
}

// QR code generation removed — was unused clutter in printed reports

// Icon Helper (Simple geometric or text-based icons for PDF reliability)
const AssetIcon = ({ type }: { type: string }) => {
    // We use a simple colored Text char inside the box
    // To achieve "Million Bucks" look, we keep it subtle.
    let char = "A";
    let color = COLORS.textMuted;

    switch (type) {
        case 'liquidAssets': char = "$"; color = COLORS.primary; break;
        case 'investments': char = "📈"; color = COLORS.indigo; break; // Emojis might work depending on font support? WorkSans support likely no emoji.
        case 'retirement': char = "P"; color = COLORS.danger; break; // Piggy
        case 'preciousMetals': char = "G"; color = COLORS.amber; break;
        case 'crypto': char = "B"; color = "#8B5CF6"; break;
        case 'realEstate': char = "H"; color = "#F97316"; break;
        case 'business': char = "S"; color = "#06B6D4"; break;
        case 'debtOwedToYou': char = "D"; color = COLORS.textMuted; break;
        default: char = "•";
    }

    // Since emoji support is flaky in react-pdf without specific fonts, we use letters.
    // Or we can draw a Path. Let's try drawing a simple Circle/Path.
    // Actually, simple letters centered in a box look very "Design System"-like.
    return (
        <View style={[styles.iconBox]}>
            <Text style={{ fontSize: 10, color: color, fontWeight: 700 }}>{char}</Text>
        </View>
    );
};

// Main Document
export function ZakatPDFDocumentV2({
    data,
    calculationName,
}: {
    data: ZakatPDFDataV2;
    calculationName?: string;
}) {
    // Import logo inside component or top level? Top level is better. 
    // Wait, I can't changing imports here. I need to do it at the top of the file.
    // I will modify the start of the file for the import, and then this block for usage.
    // Let's assume I will do TWO edits. One for imports, one for usage.
    // THIS EDIT IS FOR USAGE.

    const rules = getAssetRuleExplanations(data.madhab as Madhab || 'bradford');

    const categories = [
        { key: 'liquidAssets', cat: data.enhancedBreakdown.liquidAssets, sub: rules.liquidAssets.sub, ruling: rules.liquidAssets.ruling },
        { key: 'investments', cat: data.enhancedBreakdown.investments, sub: rules.investments.sub, ruling: rules.investments.ruling },
        { key: 'retirement', cat: data.enhancedBreakdown.retirement, sub: rules.retirement.sub, ruling: rules.retirement.ruling },
        { key: 'preciousMetals', cat: data.enhancedBreakdown.preciousMetals, sub: rules.preciousMetals.sub, ruling: rules.preciousMetals.ruling },
        { key: 'crypto', cat: data.enhancedBreakdown.crypto, sub: rules.crypto.sub, ruling: rules.crypto.ruling },
        { key: 'realEstate', cat: data.enhancedBreakdown.realEstate, sub: rules.realEstate.sub, ruling: rules.realEstate.ruling },
        { key: 'business', cat: data.enhancedBreakdown.business, sub: rules.business.sub, ruling: rules.business.ruling },
        { key: 'debtOwedToYou', cat: data.enhancedBreakdown.debtOwedToYou, sub: rules.debtOwedToYou.sub, ruling: rules.debtOwedToYou.ruling },
    ].filter(c => c.cat.total > 0);

    const totalPurification = data.interestToPurify + data.dividendsToPurify;

    return (
        <Document title="Zakat Report" author="ZakatFlow">
            <Page size="A4" style={styles.page}>
                {/* Decorative Top Bar */}
                <View style={styles.topBar} />

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.bismillah}>بسم الله الرحمن الرحيم</Text>
                        <Text style={styles.title}>{new Date().getFullYear()} Zakat Record</Text>
                        <Text style={styles.subtitle}>Prepared for <Text style={{ fontWeight: 700, color: COLORS.text }}>{data.userName || "Valued Believer"}</Text></Text>
                    </View>
                    <View style={styles.headerRight}>
                        <View style={{ marginBottom: 4 }}>
                            {/* Logo Image */}
                            <Image src={logo} style={{ width: 100, height: 'auto' }} />
                        </View>
                        <Text style={styles.dateLabel}>DATE GENERATED</Text>
                        <Text style={styles.dateValue}>{data.generatedAt}</Text>
                        <Text style={styles.hijriValue}>{data.generatedAtHijri}</Text>
                    </View>
                </View>

                {/* Hero */}
                <View style={styles.heroSection}>
                    {/* Action Card */}
                    <View style={styles.actionCard}>
                        <View>
                            <View style={styles.actionLabelRow}>
                                {/* Check Icon (Draw Path) */}
                                <Svg width={12} height={12} viewBox="0 0 24 24">
                                    <Path d="M22,12A10,10,0,1,1,12,2,10,10,0,0,1,22,12ZM19.29,7.29a1,1,0,0,0-1.41,0L10.59,14.59,6.12,10.12a1,1,0,1,0-1.41,1.41l5.17,5.17a1,1,0,0,0,1.41,0L19.29,8.71A1,1,0,0,0,19.29,7.29Z" fill={COLORS.primary} />
                                </Svg>
                                <Text style={styles.actionLabel}>Fulfilling the Third Pillar</Text>
                            </View>
                            <Text style={styles.actionAmount}>
                                {formatCurrency(Math.round(data.zakatDue), data.currency, 0)}
                            </Text>
                        </View>
                        <Text style={styles.actionText}>
                            This amount represents 2.5% of your zakatable wealth, purified and ready for distribution to those in need.
                        </Text>
                    </View>

                    {/* Equation Card */}
                    <View style={styles.equationCard}>
                        <View style={styles.equationRow}>
                            <View style={styles.equationCol}>
                                <Text style={styles.eqnLabel}>Total Wealth</Text>
                                <Text style={styles.eqnValue}>{formatCompactCurrency(data.grossAssets, data.currency)}</Text>
                            </View>
                            <Text style={styles.eqnOperator}>—</Text>
                            <View style={styles.equationCol}>
                                <Text style={styles.eqnLabel}>Needs & Liabilities</Text>
                                <Text style={[styles.eqnValue, { color: COLORS.textMuted }]}>({formatCompactCurrency(data.totalLiabilities, data.currency)})</Text>
                            </View>
                            <Text style={styles.eqnOperator}>=</Text>
                            <View style={styles.equationCol}>
                                <Text style={styles.eqnLabel}>Wealth to Purify</Text>
                                <Text style={styles.eqnValue}>{formatCompactCurrency(data.netZakatableWealth, data.currency)}</Text>
                            </View>
                        </View>

                        <View style={styles.trustRow}>
                            <View style={styles.trustBadge}>
                                {/* Book Icon */}
                                <Svg width={8} height={8} viewBox="0 0 24 24" style={{ marginRight: 2 }}>
                                    <Path d="M18,2H6C4.9,2,4,2.9,4,4v16c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V4C20,2.9,19.1,2,18,2z M6,4h5v8l-2.5-1.5L6,12V4z" fill={COLORS.primary} />
                                </Svg>
                                <Text>{data.madhabLabel || "Hanafi"} Methodology</Text>
                            </View>
                            {data.isAboveNisab && (
                                <Text style={styles.nisabBadge}>Nisab Met</Text>
                            )}
                        </View>
                    </View>
                </View>

                {/* Table Header */}
                <View style={{ marginTop: 10, flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
                        <Text style={[styles.dateLabel, { color: COLORS.text }]}>PORTFOLIO COMPOSITION</Text>
                        <Text style={{ fontSize: 7, color: COLORS.textLight }}>Values rounded for clarity</Text>
                    </View>

                    <View style={styles.tableHeaderRow}>
                        <Text style={[styles.tableHeaderCell, styles.col1]}>Asset Class</Text>
                        <Text style={[styles.tableHeaderCell, styles.col2]}>Gross Value</Text>
                        <Text style={[styles.tableHeaderCell, styles.col3]}>Zakat Weight</Text>
                        <Text style={[styles.tableHeaderCell, styles.col4]}>Zakatable Amount</Text>
                    </View>

                    {/* Rows */}
                    {categories.map((row, idx) => (
                        <View key={idx} style={styles.tableRow}>
                            <View style={[styles.col1, { flexDirection: 'row', alignItems: 'center' }]}>
                                {/* Icons removed for polish */}
                                <View>
                                    <Text style={styles.categoryLabel}>{row.cat.label}</Text>
                                    <Text style={styles.categorySub}>{row.sub}</Text>
                                </View>
                            </View>
                            <Text style={[styles.col2, styles.cellMono]}>{formatCurrency(row.cat.total, data.currency, 0)}</Text>
                            <View style={[styles.col3, { alignItems: 'center' }]}>
                                {row.ruling === "100%" ? (
                                    <Text style={{ fontSize: 8, color: COLORS.textLight, fontWeight: 700 }}>100%</Text>
                                ) : (
                                    <Text style={[styles.weightBadge, { backgroundColor: COLORS.bgSurface, color: COLORS.indigo }]}>{row.ruling}</Text>
                                )}
                            </View>
                            <Text style={[styles.col4, styles.cellBold]}>{formatCurrency(row.cat.zakatableAmount, data.currency, 0)}</Text>
                        </View>
                    ))}

                    {categories.length === 0 && (
                        <Text style={{ padding: 20, textAlign: 'center', color: COLORS.textMuted }}>No assets recorded.</Text>
                    )}

                    {/* Liabilities Table */}
                    {data.formData && (() => {
                        const hasAnyInputs = [
                            'monthlyLivingExpenses', 'insuranceExpenses', 'creditCardBalance',
                            'unpaidBills', 'monthlyMortgage', 'studentLoansDue',
                            'propertyTax', 'lateTaxPayments'
                        ].some(key => {
                            const val = data.formData![key as keyof ZakatFormData] as number | undefined;
                            return val && val > 0;
                        });

                        if (!hasAnyInputs) return null;

                        return (
                            <View style={{ marginTop: 16 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
                                    <Text style={[styles.dateLabel, { color: COLORS.danger }]}>LIABILITIES DEDUCTED</Text>
                                </View>
                                <View style={styles.tableHeaderRow}>
                                    <Text style={[styles.tableHeaderCell, styles.col1]}>Debt Category</Text>
                                    <Text style={[styles.tableHeaderCell, styles.col2]}>Amount</Text>
                                    <Text style={[styles.tableHeaderCell, styles.col3]}>Rule</Text>
                                    <Text style={[styles.tableHeaderCell, styles.col4]}>Deduction</Text>
                                </View>

                                {(() => {
                                    const effectiveConfig = ZAKAT_PRESETS[data.madhab || 'bradford'] || DEFAULT_CONFIG;
                                    const liabRules = effectiveConfig.liabilities;
                                    const personalRules = liabRules.personal_debt;
                                    const types = (personalRules.types || {}) as Record<string, string>;

                                    const liabilityFields = [
                                        { key: 'monthlyLivingExpenses', label: 'Living Expenses', ruleType: types.living_expenses, isRecurring: true },
                                        { key: 'insuranceExpenses', label: 'Insurance', ruleType: types.insurance, isRecurring: false },
                                        { key: 'creditCardBalance', label: 'Credit Card Balance', ruleType: types.credit_cards, isRecurring: false },
                                        { key: 'unpaidBills', label: 'Unpaid Bills', ruleType: types.unpaid_bills, isRecurring: false },
                                        { key: 'monthlyMortgage', label: 'Housing/Mortgage', ruleType: types.housing, isRecurring: true },
                                        { key: 'studentLoansDue', label: 'Student Loans', ruleType: types.student_loans, isRecurring: true },
                                        { key: 'propertyTax', label: 'Property Tax', ruleType: types.taxes, isRecurring: false },
                                        { key: 'lateTaxPayments', label: 'Late Tax Payments', ruleType: types.taxes, isRecurring: false },
                                    ];

                                    return liabilityFields.map((l, idx) => {
                                        const val = data.formData![l.key as keyof ZakatFormData] as number | undefined;
                                        if (!val || val <= 0) return null;

                                        let ruleDesc = l.ruleType || "Global Fallback";
                                        let deduction = 0;
                                        let multiplier = 1;

                                        if (liabRules.method === 'no_deduction') {
                                            deduction = 0;
                                            ruleDesc = "Not Deductible";
                                        } else if (personalRules.deductible) {
                                            if (personalRules.types) {
                                                const rule = l.ruleType;
                                                if (rule === 'full' || rule === '12_months') multiplier = l.isRecurring ? 12 : 1;
                                                else if (rule === 'none') multiplier = 0;
                                                else multiplier = 1; // current_due
                                            } else {
                                                const isAnnual = liabRules.method === 'full_deduction' || liabRules.method === '12_month_rule';
                                                multiplier = isAnnual && l.isRecurring ? 12 : 1;
                                            }
                                            deduction = val * multiplier;
                                            if (l.isRecurring && multiplier === 12) ruleDesc = "Annualized (12 Mo.)";
                                            else if (multiplier === 1) ruleDesc = l.isRecurring ? "Current Mo." : "Full Value";
                                            else if (multiplier === 0) ruleDesc = "Not Deductible";
                                        }

                                        // Always render the row if they inputted a value to show it wasn't lost
                                        // if (deduction <= 0) return null;

                                        return (
                                            <View key={`liab-${idx}`} style={styles.tableRow}>
                                                <View style={[styles.col1, { flexDirection: 'row', alignItems: 'center' }]}>
                                                    <View>
                                                        <Text style={styles.categoryLabel}>{l.label}</Text>
                                                        <Text style={styles.categorySub}>Personal Debt</Text>
                                                    </View>
                                                </View>
                                                <Text style={[styles.col2, styles.cellMono]}>{formatCurrency(val, data.currency, 0)}</Text>
                                                <View style={[styles.col3, { alignItems: 'center' }]}>
                                                    <Text style={[styles.weightBadge, { backgroundColor: COLORS.dangerBg, color: COLORS.danger }]}>{ruleDesc}</Text>
                                                </View>
                                                <Text style={[styles.col4, styles.cellBold]}>{deduction > 0 ? `-${formatCurrency(deduction, data.currency, 0)}` : formatCurrency(0, data.currency, 0)}</Text>
                                            </View>
                                        );
                                    });
                                })()}
                            </View>
                        );
                    })()}
                </View>

                {/* Footer Cards */}
                <View style={styles.footerGrid}>
                    {/* Purification */}
                    {totalPurification > 0 && (
                        <View style={[styles.footerCard, { backgroundColor: COLORS.amberBg, borderColor: COLORS.amber, borderWidth: 0.5 }]} >
                            <Text style={[styles.footerCardTitle, { color: COLORS.amber }]}>
                                {/* Sparkle Icon Placeholder */}
                                • Cleansing Your Portfolio
                            </Text>
                            <Text style={[styles.footerCardText, { color: "#78350F" }]}>
                                Your investments generated <Text style={{ fontWeight: 700 }}>{formatCurrency(totalPurification, data.currency, 0)}</Text> in incidental earnings (interest/dividends). Re-channeling this amount to charity purifies your remaining wealth.
                            </Text>
                            <Text style={[styles.footerCardSub, { color: "#92400E" }]}>* Recommended: Give to general relief (Sadaqah)</Text>
                        </View>
                    )}

                    {/* Impact */}
                    <View style={[styles.footerCard, { backgroundColor: COLORS.indigoBg, borderColor: COLORS.indigo, borderWidth: 0.5 }]} >
                        <Text style={[styles.footerCardTitle, { color: COLORS.indigo }]}>
                            • Your Cycle of Good
                        </Text>
                        <Text style={[styles.footerCardText, { color: "#312E81" }]}>
                            {data.referralStats && data.referralStats.totalReferrals > 0 ? (
                                <>By sharing ZakatFlow, you helped <Text style={{ fontWeight: 700 }}>{data.referralStats.totalReferrals} {data.referralStats.totalReferrals === 1 ? 'person' : 'others'}</Text> evaluate their wealth.{data.referralStats.thresholdMet && data.referralStats.totalZakatCalculated != null ? <> Your influence has facilitated <Text style={{ fontWeight: 700 }}>{formatCompactCurrency(data.referralStats.totalZakatCalculated, data.currency)}</Text> in Zakat distributions.</> : null}</>
                            ) : (
                                <>Share ZakatFlow with family and friends to help them fulfill their obligation — and track your collective impact here.</>
                            )}
                        </Text>
                        <Text style={[styles.footerCardSub, { color: "#4338CA" }]}>May this be a continuing charity (Sadaqah Jariyah) for you.</Text>
                    </View>
                </View>

                {/* Bottom */}
                <View style={styles.bottomRow}>
                    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                        <Text style={styles.bottomText}>ZAKATFLOW 2026</Text>
                    </View>
                    <View>
                        {/* Center Arabic Text */}
                        <Text style={{ fontFamily: "NotoNaskhArabic", fontSize: 9, color: COLORS.textLight }}> تقبل الله منا ومنكم صالح الأعمال</Text>
                        <Text style={{ fontSize: 6, color: COLORS.textLight, textAlign: 'center', marginTop: 2, textTransform: 'uppercase', letterSpacing: 1 }}>Empowering Your Spiritual Journey</Text>
                    </View>
                </View>

            </Page>
        </Document>
    );
}

// generateQRDataUrl export removed

// Main Generator Function
import { pdf } from "@react-pdf/renderer";
import { saveAs } from 'file-saver';
// Types imported at top level

export async function generateZakatPDFV2(
    report: ZakatReport,
    calculationName: string = "Zakat Calculation",
    userName?: string,
    referralStats?: { totalReferrals: number; totalZakatCalculated: number | null; thresholdMet: boolean }
) {
    const { input: data, output: calculations } = report;

    // Create Document Component
    const doc = (
        <ZakatPDFDocumentV2
            data={{
                userName: userName,
                currency: data.currency,
                calendarType: data.calendarType,
                calendarLabel: data.calendarType === 'lunar' ? 'Lunar (Hijri)' : 'Solar (Gregorian)',
                nisabStandard: data.nisabStandard,
                nisabLabel: data.nisabStandard === 'gold' ? 'Gold Standard' : 'Silver Standard',
                nisabValue: calculations.nisab || 0,
                calculationMode: data.madhab,
                calculationModeLabel: getMethodologyDisplayName(data.madhab || 'bradford'),
                madhabLabel: getMethodologyDisplayName(data.madhab || 'bradford'),
                zakatRate: data.isSimpleMode ? 0.025 : 0.0257, // Approx
                grossAssets: calculations.totalAssets || 0,
                totalZakatableAssets: calculations.netZakatableWealth + calculations.totalLiabilities, // Approx
                totalLiabilities: calculations.totalLiabilities || 0,
                netZakatableWealth: calculations.netZakatableWealth || 0,
                totalExempt: calculations.assetBreakdown?.exemptAssets || 0,
                isAboveNisab: calculations.isAboveNisab,
                zakatDue: calculations.zakatDue || 0,
                interestToPurify: calculations.interestToPurify || 0,
                dividendsToPurify: calculations.dividendsToPurify || 0,
                enhancedBreakdown: calculations.enhancedBreakdown as EnhancedAssetBreakdown, // Use actual breakdown!
                madhab: data.madhab, // Pass methodology for rule explanations
                generatedAt: new Date().toLocaleDateString(),
                generatedAtHijri: "1447 AH",
                reportId: report.meta.reportId, // Use ID from report object
                formData: data, // Pass in original form payload for liability itemization
                referralStats: referralStats || undefined,
            }}
            calculationName={calculationName}
        />
    );

    const blob = await pdf(doc).toBlob();
    saveAs(blob, `ZakatReport-${new Date().toISOString().split('T')[0]}.pdf`);
}

