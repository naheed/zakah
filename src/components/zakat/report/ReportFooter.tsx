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
        <footer className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8">

            {/* Purification (Gentle) */}
            <div className="col-span-1 md:col-span-6 bg-amber-50 dark:bg-amber-950/20 rounded-xl p-5 flex flex-col justify-between h-full border border-amber-100 dark:border-amber-900/30">
                <div>
                    <div className="flex items-center gap-2 mb-2 text-amber-700 dark:text-amber-500">
                        <Sparkle weight="fill" className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Cleansing Your Portfolio</span>
                    </div>
                    <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed mb-3">
                        Your investments generated <span className="font-bold">{formatCurrency(totalPurification, currency)}</span> in incidental earnings (interest/dividends). Re-channeling this amount to charity purifies your remaining wealth.
                    </p>
                </div>
                <div className="text-[10px] text-amber-700 dark:text-amber-500 font-medium opacity-75">
                    *Recommended: Give to general relief (Sadaqah)
                </div>
            </div>

            {/* Impact (Enhanced Widget) */}
            <div className="col-span-1 md:col-span-6 h-full">
                <ReferralWidget currency={currency} variant="full" />
            </div>

            <div className="col-span-1 md:col-span-12 text-center mt-2 border-t border-border pt-6">
                <p className="text-sm font-arabic text-muted-foreground mb-1">تقبل الله منا ومنكم صالح الأعمال</p>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Empowering your spiritual journey • ZakatFlow 2026</p>
            </div>
        </footer>
    );
}
