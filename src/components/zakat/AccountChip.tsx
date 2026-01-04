/**
 * AccountChip Component
 * 
 * Material 3 Expressive chip for selecting existing accounts in the wizard.
 * Shows account name, balance, and recency indicator.
 */

import { forwardRef } from 'react';
import { Check, Clock } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/zakatCalculations';

interface AccountChipProps {
    name: string;
    institutionName?: string;
    balance: number;
    updatedAt: string;
    selected?: boolean;
    onClick?: () => void;
    className?: string;
}

/**
 * Get relative time string (e.g., "2 weeks ago", "Nov 15")
 */
function getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

    // Return formatted date for older
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export const AccountChip = forwardRef<HTMLButtonElement, AccountChipProps>(
    ({ name, institutionName, balance, updatedAt, selected, onClick, className }, ref) => {
        const isRecent = new Date(updatedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Within 30 days

        return (
            <button
                ref={ref}
                type="button"
                onClick={onClick}
                className={cn(
                    // Base styles - Material 3 Expressive
                    "relative flex flex-col items-start gap-1 p-3 rounded-2xl border-2 transition-all",
                    "min-w-[140px] max-w-[180px] text-left shrink-0",

                    // Default state
                    "border-border bg-card hover:bg-muted/50 hover:border-primary/30",

                    // Selected state
                    selected && "border-primary bg-primary/5 ring-2 ring-primary/20",

                    className
                )}
            >
                {/* Selected indicator */}
                {selected && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <Check weight="bold" className="w-3 h-3" />
                    </div>
                )}

                {/* Account name */}
                <p className={cn(
                    "font-semibold text-sm truncate w-full",
                    selected ? "text-primary" : "text-foreground"
                )}>
                    {name}
                </p>

                {/* Institution subtitle */}
                {institutionName && (
                    <p className="text-xs text-muted-foreground truncate w-full">
                        {institutionName}
                    </p>
                )}

                {/* Balance */}
                <p className="font-bold text-base text-foreground">
                    {formatCurrency(balance)}
                </p>

                {/* Recency badge */}
                <div className={cn(
                    "flex items-center gap-1 text-[10px]",
                    isRecent ? "text-primary" : "text-muted-foreground"
                )}>
                    <Clock weight="fill" className="w-3 h-3" />
                    <span>{getRelativeTime(updatedAt)}</span>
                </div>
            </button>
        );
    }
);

AccountChip.displayName = 'AccountChip';
