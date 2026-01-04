import { Users, TrendingUp, Sparkles, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/zakatCalculations';
import { formatCount, formatLargeNumber } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';

const PRIVACY_THRESHOLD = 5;

interface ImpactStatsProps {
    /** Number of direct + cascade referrals */
    totalReferrals: number;
    /** Sum of Zakat calculated by referrals */
    totalZakatCalculated?: number | null;
    /** Sum of assets evaluated by referrals */
    totalAssetsCalculated?: number | null;
    /** Currency for formatting */
    currency?: string;
    /** Loading state */
    isLoading?: boolean;
    /** Additional class names */
    className?: string;
    /** Variant: 'card' (default) or 'flat' */
    variant?: 'card' | 'flat';
}

/**
 * ImpactStats - Universal component for displaying user impact
 * Design: Material 3 Expressive (Clean, Big Numbers, Soulful)
 */
export function ImpactStats({
    totalReferrals,
    totalZakatCalculated,
    totalAssetsCalculated,
    currency = 'USD',
    isLoading = false,
    className,
    variant = 'card',
    title = "Your Impact",
    footer
}: ImpactStatsProps) {

    if (isLoading) {
        return <ImpactStatsSkeleton variant={variant} className={className} />;
    }

    const meetsThreshold = totalReferrals >= PRIVACY_THRESHOLD;

    const Wrapper = variant === 'card' ? motion.div : motion.div;
    const wrapperClasses = variant === 'card'
        ? "bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-3xl p-8"
        : "";

    return (
        <Wrapper
            className={cn(wrapperClasses, "text-center space-y-6", className)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="space-y-1">
                <h3 className="text-xs font-bold tracking-widest text-amber-700/70 dark:text-amber-500/70 uppercase">
                    {title}
                </h3>
            </div>

            {/* Main Stat: People Helped */}
            <div className="flex flex-col items-center">
                <div className="flex items-baseline justify-center gap-1">
                    <span className="text-6xl font-black tracking-tight text-amber-900 dark:text-amber-100 font-work-sans">
                        <AnimatedNumber value={totalReferrals} />
                    </span>
                </div>
                <p className="text-sm font-medium text-amber-800/60 dark:text-amber-400">
                    {totalReferrals === 1 ? 'person' : 'people'} calculated
                </p>
            </div>

            {/* Secondary Stats: Assets & Zakat */}
            {meetsThreshold && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-amber-200/30 dark:border-amber-800/30">
                    {/* Assets */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-center gap-1.5 text-amber-700/70 dark:text-amber-500/70 mb-1">
                            <Wallet className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-lg font-bold text-amber-900 dark:text-amber-100">
                            <AnimatedNumber
                                value={totalAssetsCalculated || 0}
                                format={formatLargeNumber}
                            />
                        </p>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-amber-800/40 dark:text-amber-500/50">
                            Assets
                        </p>
                    </div>

                    {/* Zakat */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-center gap-1.5 text-green-700/70 dark:text-green-500/70 mb-1">
                            <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-lg font-bold text-amber-900 dark:text-amber-100">
                            {formatLargeNumber(totalZakatCalculated || 0)}
                        </p>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-amber-800/40 dark:text-amber-500/50">
                            Zakat
                        </p>
                    </div>
                </div>
            )}

            {footer ? (
                <div className="pt-2">
                    {footer}
                </div>
            ) : !meetsThreshold && totalReferrals > 0 && (
                <div className="pt-2">
                    <p className="text-xs text-amber-800/50 dark:text-amber-500/50 italic">
                        Help {5 - totalReferrals} more people to see aggregated community impact
                    </p>
                </div>
            )}
        </Wrapper>
    );
}

function ImpactStatsSkeleton({ variant, className }: { variant: 'card' | 'flat', className?: string }) {
    if (variant === 'flat') {
        return (
            <div className={cn("text-center space-y-4", className)}>
                <Skeleton className="h-4 w-24 mx-auto" />
                <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                <Skeleton className="h-4 w-32 mx-auto" />
            </div>
        )
    }
    return (
        <div className={cn("bg-muted/20 rounded-3xl p-8 space-y-6", className)}>
            <Skeleton className="h-4 w-24 mx-auto" />
            <div className="space-y-2">
                <Skeleton className="h-16 w-32 mx-auto" />
                <Skeleton className="h-4 w-40 mx-auto" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/10">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    )
}
