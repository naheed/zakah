import { Users, TrendingUp, Heart, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/zakatCalculations';
import { formatCount } from '@/lib/formatters';
import { cn } from '@/lib/utils';

const PRIVACY_THRESHOLD = 5;

interface PersonalMetricsProps {
    /** Number of direct + cascade referrals */
    totalReferrals: number;
    /** Sum of Zakat calculated by referrals */
    totalZakatCalculated?: number | null;
    /** Sum of assets evaluated by referrals */
    totalAssetsCalculated?: number | null;
    /** Currency for formatting */
    currency?: string;
    /** Variant: compact for WelcomeStep, full for standalone */
    variant?: 'compact' | 'full';
    /** Additional class names */
    className?: string;
    /** Callback when share is clicked */
    onShareClick?: () => void;
}

/**
 * PersonalMetrics - Displays user's referral impact with privacy thresholds
 * 
 * Privacy Rules:
 * - Below threshold (<5): Shows only user count, no aggregates
 * - Above threshold (>=5): Shows full aggregates (Zakat, Assets)
 */
export function PersonalMetrics({
    totalReferrals,
    totalZakatCalculated,
    totalAssetsCalculated,
    currency = 'USD',
    variant = 'compact',
    className,
    onShareClick,
}: PersonalMetricsProps) {
    const meetsThreshold = totalReferrals >= PRIVACY_THRESHOLD;
    const hasReferrals = totalReferrals > 0;

    if (variant === 'compact') {
        return (
            <div className={cn("p-4 rounded-xl bg-muted/30 border border-border", className)}>
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Heart className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">Your Impact</span>
                </div>

                {hasReferrals ? (
                    <div className="space-y-2">
                        {/* User count - always shown */}
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                                <span className="font-semibold">{totalReferrals}</span>
                                {' '}
                                {totalReferrals === 1 ? 'person' : 'people'} calculated Zakat via your link
                            </span>
                        </div>

                        {/* Aggregates - only shown above threshold */}
                        {meetsThreshold ? (
                            <motion.div
                                className="flex flex-wrap gap-4 text-sm"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                {totalZakatCalculated != null && (
                                    <div className="flex items-center gap-1.5">
                                        <TrendingUp className="w-3.5 h-3.5 text-success" />
                                        <span className="font-semibold">{formatCurrency(totalZakatCalculated, currency)}</span>
                                        <span className="text-muted-foreground">Zakat</span>
                                    </div>
                                )}
                                {totalAssetsCalculated != null && (
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-muted-foreground">·</span>
                                        <span className="font-semibold">{formatCount(totalAssetsCalculated)}</span>
                                        <span className="text-muted-foreground">assets</span>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <p className="text-xs text-muted-foreground italic">
                                Aggregated numbers will be shared once privacy threshold is met.
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="text-sm text-muted-foreground space-y-2">
                        <p>Share your invite link to see your impact here.</p>
                        {onShareClick && (
                            <button
                                onClick={onShareClick}
                                className="flex items-center gap-1.5 text-primary hover:underline text-xs"
                            >
                                <Share2 className="w-3 h-3" />
                                Share your link
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // Full variant - for standalone use
    return (
        <div className={cn("p-5 rounded-xl bg-muted/30 border border-border", className)}>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-4">
                Your Impact
            </p>

            {hasReferrals ? (
                <div className="space-y-4">
                    {/* User count - always shown */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-mono font-semibold text-foreground">
                                {totalReferrals}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {totalReferrals === 1 ? 'person' : 'people'} calculated
                            </p>
                        </div>
                    </div>

                    {/* Aggregates - only shown above threshold */}
                    {meetsThreshold ? (
                        <motion.div
                            className="flex items-center gap-6"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {totalZakatCalculated != null && (
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                                        <TrendingUp className="w-4 h-4 text-success" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-lg font-mono font-semibold text-foreground">
                                            {formatCurrency(totalZakatCalculated, currency)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Zakat calculated</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            {PRIVACY_THRESHOLD - totalReferrals} more referrals to see aggregated impact.
                        </p>
                    )}
                </div>
            ) : (
                <div className="text-center text-sm text-muted-foreground py-2">
                    <p>No referrals yet. Share your link to track your impact!</p>
                </div>
            )}
        </div>
    );
}
