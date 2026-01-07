import { useNavigate } from 'react-router-dom';
import { HandHeart, ArrowRight, CalendarBlank, Clock, CheckCircle } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/zakatCalculations';

interface ZakatDashboardProps {
    /** Total Zakat calculated for current Hawl year */
    calculatedAmount: number;
    /** Total donations made this Hawl year */
    donatedAmount: number;
    /** Hawl start date */
    hawlStart?: string;
    /** Hawl end date */
    hawlEnd?: string;
    /** Days remaining in Hawl year */
    daysRemaining?: number;
    /** Number of donations logged */
    donationCount?: number;
}

/**
 * ZakatDashboard - Shows Zakat donation progress for logged-in users
 * 
 * Material 3 Expressive design with:
 * - Progress bar visualization
 * - Quick actions to track/add donations
 * - Hawl period indicator
 */
export function ZakatDashboard({
    calculatedAmount,
    donatedAmount,
    hawlStart,
    hawlEnd,
    daysRemaining = 0,
    donationCount = 0,
}: ZakatDashboardProps) {
    const navigate = useNavigate();

    const remaining = Math.max(0, calculatedAmount - donatedAmount);
    const percentComplete = calculatedAmount > 0
        ? Math.round((donatedAmount / calculatedAmount) * 100)
        : 0;
    const isComplete = percentComplete >= 100;

    // Format date for display
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <HandHeart className="w-4 h-4 text-primary" weight="duotone" />
                        </div>
                        <h3 className="font-semibold text-foreground">Your Zakat</h3>
                    </div>
                    {hawlStart && hawlEnd && (
                        <Badge variant="secondary" className="text-[10px] gap-1">
                            <CalendarBlank className="w-3 h-3" />
                            {formatDate(hawlStart)} → {formatDate(hawlEnd)}
                        </Badge>
                    )}
                </div>

                {/* Progress Section */}
                <div className="space-y-3 mb-4">
                    <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-foreground">
                            {formatCurrency(remaining)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            remaining of {formatCurrency(calculatedAmount)}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "absolute left-0 top-0 h-full rounded-full transition-all duration-500",
                                isComplete ? "bg-primary" : "bg-primary/70"
                            )}
                            style={{ width: `${Math.min(percentComplete, 100)}%` }}
                        />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                        <span className={cn(
                            "flex items-center gap-1",
                            isComplete ? "text-primary" : "text-muted-foreground"
                        )}>
                            {isComplete ? (
                                <>
                                    <CheckCircle weight="fill" className="w-3 h-3" />
                                    Fully distributed!
                                </>
                            ) : (
                                `${percentComplete}% distributed`
                            )}
                        </span>
                        {daysRemaining > 0 && (
                            <span className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {daysRemaining} days left
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate('/donations')}
                    >
                        {donationCount > 0 ? `${donationCount} Donations` : 'Track Donations'}
                    </Button>
                    <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate('/donations')}
                    >
                        Add Donation
                        <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
