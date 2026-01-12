import { Users, TrendUp, Sparkle, Wallet } from '@phosphor-icons/react';
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
    /** Variant: 'card' (default), 'flat', 'community', or 'compact' (Dashboard) */
    variant?: 'card' | 'flat' | 'community' | 'compact';
    /** Custom title override (default: "Your Impact") */
    title?: string;
    /** Custom footer message */
    footer?: React.ReactNode;
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
        return <ImpactStatsSkeleton variant={variant === 'community' ? 'card' : variant} className={className} />;
    }

    const meetsThreshold = totalReferrals >= PRIVACY_THRESHOLD;
    const isCommunity = variant === 'community';

    const isCompact = variant === 'compact';
    const Wrapper = motion.div;

    // Compact Variant: Single horizontal flow
    if (isCompact) {
        return (
            <Wrapper
                className={cn(
                    "bg-tertiary/5 border border-tertiary/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-muted-foreground",
                    className
                )}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-tertiary/10 rounded-full text-tertiary">
                        <Users className="w-4 h-4" weight="fill" />
                    </div>
                    <span className="font-semibold text-tertiary">
                        <AnimatedNumber value={totalReferrals} /> people
                    </span>
                </div>

                <span className="hidden sm:inline text-border">|</span>

                <p className="text-center sm:text-left">
                    evaluated <span className="font-semibold text-foreground"><AnimatedNumber value={totalAssetsCalculated || 0} format={formatLargeNumber} /></span> in assets
                    {' '}& calculated <span className="font-semibold text-primary"><AnimatedNumber value={totalZakatCalculated || 0} format={formatLargeNumber} /></span> in Zakat
                </p>
            </Wrapper>
        );
    }

    const wrapperClasses = (variant === 'card')
        ? "bg-tertiary/5 dark:bg-tertiary/10 border border-tertiary/20 dark:border-tertiary/20 rounded-3xl p-8"
        : (isCommunity)
            ? "bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-8 md:p-10 shadow-sm"
            : "";

    return (
        <Wrapper
            className={cn(wrapperClasses, "text-center space-y-6", className)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="space-y-1">
                <h3 className="text-xs font-bold tracking-widest text-tertiary uppercase">
                    {title}
                </h3>
            </div>

            {/* Main Stat: People Helped */}
            {!isCommunity && (
                <div className="flex flex-col items-center">
                    <div className="flex items-baseline justify-center gap-1">
                        <span className="text-6xl font-black tracking-tight text-tertiary-foreground dark:text-tertiary">
                            <AnimatedNumber value={totalReferrals} />
                        </span>
                    </div>
                    <p className="text-sm font-medium text-tertiary/60 dark:text-tertiary/80">
                        {totalReferrals === 1 ? 'person' : 'people'} calculated
                    </p>
                </div>
            )}

            {/* Community Variant: Hero Assets & Zakat (Refined) */}
            {isCommunity && (
                <div className="grid grid-cols-2 gap-8 md:gap-12 py-4">
                    {/* Assets - Hero */}
                    <div className="text-center space-y-2">
                        <div className="w-10 h-10 mx-auto rounded-full bg-tertiary/10 flex items-center justify-center mb-3">
                            <Wallet className="w-5 h-5 text-tertiary" weight="fill" />
                        </div>
                        <span className="block text-3xl md:text-4xl font-bold tracking-tight text-foreground font-serif">
                            <AnimatedNumber value={totalAssetsCalculated || 0} format={formatLargeNumber} />
                        </span>
                        <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            Assets Evaluated
                        </p>
                    </div>

                    {/* Zakat - Hero */}
                    <div className="text-center space-y-2">
                        <div className="w-10 h-10 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
                            <Sparkle className="w-5 h-5 text-primary" weight="fill" />
                        </div>
                        <span className="block text-3xl md:text-4xl font-bold tracking-tight text-foreground font-serif">
                            <AnimatedNumber value={totalZakatCalculated || 0} format={formatLargeNumber} />
                        </span>
                        <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary">
                            Zakat Calculated
                        </p>
                    </div>
                </div>
            )}

            {/* Secondary Stats: Assets & Zakat (default/flat variants only) */}
            {!isCommunity && meetsThreshold && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-tertiary/20">
                    {/* Assets */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-center gap-1.5 text-tertiary/70 mb-1">
                            <Wallet className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-lg font-bold text-foreground">
                            <AnimatedNumber
                                value={totalAssetsCalculated || 0}
                                format={formatLargeNumber}
                            />
                        </p>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                            Assets
                        </p>
                    </div>

                    {/* Zakat */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-center gap-1.5 text-primary/70 mb-1">
                            <Sparkle className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-lg font-bold text-primary">
                            {formatLargeNumber(totalZakatCalculated || 0)}
                        </p>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-primary/60">
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
                    <p className="text-xs text-muted-foreground italic">
                        Help {5 - totalReferrals} more people to see aggregated community impact
                    </p>
                </div>
            )}
        </Wrapper>
    );
}

function ImpactStatsSkeleton({ variant, className }: { variant: 'card' | 'flat' | 'compact' | 'community', className?: string }) {
    if (variant === 'compact') {
        return <Skeleton className={cn("h-14 w-full rounded-2xl", className)} />
    }
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
