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

import { formatCurrency } from "@/lib/zakatCalculations";
import { Sparkle, HandHeart, ArrowRight } from "@phosphor-icons/react";
import { ReferralWidget } from "../ReferralWidget";
import { Link } from "react-router-dom";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import { useState } from "react";

interface ReportFooterProps {
    interestToPurify: number;
    dividendsToPurify: number;
    currency: string;
    zakatDue?: number; // Pass to donations page
    referralStats?: { totalReferrals: number; totalAssetsCalculated: number | null; totalZakatCalculated: number | null };
    referralCode?: string;
}

export function ReportFooter({ interestToPurify, dividendsToPurify, currency, zakatDue, referralStats, referralCode }: ReportFooterProps) {
    const totalPurification = interestToPurify + dividendsToPurify;

    // Build donations URL with Zakat amount
    const donationsUrl = zakatDue ? `/donations?zakatDue=${zakatDue}` : '/donations';

    const [feedbackSent, setFeedbackSent] = useState(false);

    const handleFeedback = (sentiment: string) => {
        trackEvent('Feedback', AnalyticsEvents.FEEDBACK.REACTION, sentiment);
        setFeedbackSent(true);
    };

    return (
        <footer className="mt-12 space-y-8">

            {/* Purification (Gentle) */}
            {totalPurification > 0 && (
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
            )}

            {/* Track Donations CTA */}
            <Link
                to={donationsUrl}
                className="block bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-xl p-5 transition-colors group"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <HandHeart className="w-5 h-5 text-primary" weight="duotone" />
                        </div>
                        <div>
                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Track Your Zakat Donations</p>
                            <p className="text-sm text-muted-foreground">Already made a donation? Log it here to track your progress.</p>
                        </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </div>
            </Link>

            {/* Feedback Loop */}
            <div className="bg-muted/50 rounded-xl p-6 text-center border border-border/50">
                {!feedbackSent ? (
                    <>
                        <p className="text-sm font-medium text-foreground mb-4">How was your experience?</p>
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <button
                                onClick={() => handleFeedback('love')}
                                className="text-2xl hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                                aria-label="Love it"
                            >
                                😍
                            </button>
                            <button
                                onClick={() => handleFeedback('good')}
                                className="text-2xl hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                                aria-label="Good"
                            >
                                🙂
                            </button>
                            <button
                                onClick={() => handleFeedback('okay')}
                                className="text-2xl hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                                aria-label="Okay"
                            >
                                😐
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-sm font-medium text-primary mb-4 p-2 bg-primary/10 rounded-lg inline-block">
                        Thank you for your feedback!
                    </p>
                )}

                <Link
                    to="https://forms.gle/PrsqKbRZpkJS4tyh7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                    onClick={() => trackEvent('Feedback', AnalyticsEvents.FEEDBACK.SURVEY_CLICK)}
                >
                    <p className="text-xs text-primary hover:underline flex items-center justify-center gap-1">
                        Take our 3-5 min survey <ArrowRight className="w-3 h-3" />
                    </p>
                </Link>
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
