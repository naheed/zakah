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

import { useNavigate } from 'react-router-dom';
import { HandHeart, ArrowRight, CalendarBlank, Clock, CheckCircle } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/zakatCalculations';
import { content as c } from '@/content';

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
                        <h3 className="font-semibold text-foreground">{c.dashboard.zakatProgress.sectionTitle}</h3>
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
                            {c.dashboard.zakatProgress.remainingOf(formatCurrency(calculatedAmount))}
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
                                    {c.dashboard.zakatProgress.fullyDistributed}
                                </>
                            ) : (
                                c.dashboard.zakatProgress.percentDistributed(percentComplete)
                            )}
                        </span>
                        {daysRemaining > 0 && (
                            <span className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {c.dashboard.zakatProgress.daysLeft(daysRemaining)}
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
                        {donationCount > 0 ? c.dashboard.donations.donationsCount(donationCount) : c.dashboard.donations.trackDonations}
                    </Button>
                    <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate('/donations')}
                    >
                        {c.dashboard.donations.addDonation}
                        <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
