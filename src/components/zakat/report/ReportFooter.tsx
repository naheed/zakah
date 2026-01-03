import { formatCurrency } from "@/lib/zakatCalculations";
import { Sparkle } from "@phosphor-icons/react";
import { ReferralWidget } from "../ReferralWidget";

interface ReportFooterProps {
    interestToPurify: number;
    dividendsToPurify: number;
    currency: string;
    referralStats?: { totalReferrals: number; totalAssetsCalculated: number; totalZakatCalculated: number };
    referralCode?: string;
}

export function ReportFooter({ interestToPurify, dividendsToPurify, currency, referralStats, referralCode }: ReportFooterProps) {
    const totalPurification = interestToPurify + dividendsToPurify;

    return (
        <footer className="mt-12 space-y-8">

            {/* Purification (Gentle) */}
            <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-5 border border-amber-100 dark:border-amber-900/30">
                <div className="flex items-center gap-2 mb-2 text-amber-700 dark:text-amber-500">
                    <Sparkle weight="fill" className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Cleansing Your Portfolio</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed max-w-2xl">
                        Your investments generated <span className="font-bold">{formatCurrency(totalPurification, currency)}</span> in incidental earnings (interest/dividends). Re-channeling this amount to charity purifies your remaining wealth.
                    </p>
                    <div className="text-[10px] text-amber-700 dark:text-amber-500 font-medium opacity-75 shrink-0 bg-amber-100/50 dark:bg-amber-900/40 px-3 py-1.5 rounded-full">
                        *Recommended: Give to general relief (Sadaqah)
                    </div>
                </div>
            </div>

            {/* Impact (Enhanced Widget) - Full Width */}
            <div className="w-full">
                <ReferralWidget currency={currency} variant="full" />
            </div>

            <div className="text-center mt-4 border-t border-border/50 pt-8">
                <p className="text-sm font-arabic text-muted-foreground mb-1">تقبل الله منا ومنكم صالح الأعمال</p>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Empowering your spiritual journey • ZakatFlow 2026</p>
            </div>
        </footer>
    );
}
