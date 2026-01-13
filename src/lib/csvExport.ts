import { ZakatReport } from "./zakatCalculations";
import { format } from "date-fns";
import { saveAs } from "file-saver";

export function generateCSV(report: ZakatReport, fileName: string = "zakat-report.csv") {
    const { input: formData, output: calculations } = report;
    const { currency, madhab } = formData;
    const {
        totalAssets,
        totalLiabilities,
        netZakatableWealth,
        zakatDue,
        interestToPurify,
        dividendsToPurify,
        enhancedBreakdown
    } = calculations;

    // Helper to escape commas for CSV
    const safe = (str: string | number) => `"${String(str).replace(/"/g, '""')}"`;
    const money = (val: number | undefined | null) => safe(((val || 0)).toFixed(2));

    const rows: string[][] = [];

    // 1. Header Info
    rows.push(["ZakatFlow Calculation Report"]);
    rows.push(["Date Generated", safe(format(new Date(), "PPpp"))]);
    rows.push(["Currency", safe(currency)]);
    rows.push(["Madhab", safe(madhab || "Standard")]);
    if (report.meta.referralCode) {
        rows.push(["Referral Code", safe(report.meta.referralCode)]);
    }
    rows.push([]);

    // 2. Summary
    rows.push(["SUMMARY"]);
    rows.push(["Total Zakatable Assets", money(totalAssets)]);
    rows.push(["Total Liabilities", money(totalLiabilities)]);
    rows.push(["Net Zakatable Wealth", money(netZakatableWealth)]);
    rows.push(["Zakat Due (2.5%)", money(zakatDue)]);
    rows.push([]);

    // 3. Purification
    if (interestToPurify > 0 || dividendsToPurify > 0) {
        rows.push(["PURIFICATION REQUIRED"]);
        rows.push(["Interest (Riba)", money(interestToPurify)]);
        rows.push(["Impure Dividends", money(dividendsToPurify)]);
        rows.push(["Total Purification", money(interestToPurify + dividendsToPurify)]);
        rows.push([]);
    }

    // 4. Asset Breakdown
    rows.push(["ASSET BREAKDOWN"]);
    rows.push([
        "Category",
        "Sub-Category",
        "Gross Amount",
        "Zakatable %",
        "Zakatable Amount",
        "Notes"
    ]);

    // Flatten EnhancedBreakdown
    const addCategory = (key: string, cat: any) => {
        if (cat.items && cat.items.length > 0) {
            // Detailed items
            cat.items.forEach((item: any) => {
                rows.push([
                    safe(cat.label),
                    safe(item.name || item.type || "Item"),
                    money(item.value),
                    safe((item.zakatablePercent * 100).toFixed(0) + "%"),
                    money(item.zakatableAmount),
                    safe(item.meta?.description || "") // Assuming meta might store description
                ]);
            });
            // Subtotal line? Maybe not needed for CSV import if we have details.
            // But if items are generic, we might just list the category total if no items exist?
            // The `enhancedBreakdown` mirrors the form inputs usually. 
            // If `items` is empty but total > 0 (e.g. manual input), list it.
        } else if (cat.total > 0) {
            rows.push([
                safe(cat.label),
                "General",
                money(cat.total),
                safe((cat.zakatablePercent * 100).toFixed(0) + "%"),
                money(cat.zakatableAmount),
                ""
            ]);
        }
    };

    // Iterate known keys
    const keys = [
        'liquidAssets', 'investments', 'retirement', 'realEstate',
        'business', 'preciousMetals', 'crypto', 'debtOwedToYou', 'otherAssets'
    ];

    keys.forEach(k => {
        // @ts-ignore
        const cat = enhancedBreakdown[k];
        if (cat) addCategory(k, cat);
    });

    rows.push([]);

    // 5. Liabilities Breakdown
    if (totalLiabilities > 0) {
        rows.push(["LIABILITIES DEDUCTED"]);

        const liabilityFields = [
            { key: 'creditCardBalance', label: 'Credit Card Balance' },
            { key: 'unpaidBills', label: 'Unpaid Bills' },
            { key: 'studentLoansDue', label: 'Student Loans (Due)' },
            { key: 'lateTaxPayments', label: 'Late Tax Payments' },
            { key: 'outstandingDebts', label: 'Other Debts' } // Assuming this exists or generic
        ];

        liabilityFields.forEach(l => {
            // @ts-ignore - Dynamic access
            const val = formData[l.key];
            if (val && val > 0) {
                rows.push(["Liability", safe(l.label), money(val), "100%", money(val), "Deductible"]);
            }
        });
        // Add total if no details found but total > 0 (fallback)
        // rows.push(["Total Liabilities", "", money(totalLiabilities), "100%", money(totalLiabilities), ""]);
    }

    // Convert to String
    const csvContent = rows.map(r => r.join(",")).join("\n");

    // Trigger Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, fileName);
}
