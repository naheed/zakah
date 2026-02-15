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

import { formatLargeNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { content as c } from "@/content";

interface MetricsDisplayProps {
    assets: number;
    zakat: number;
    variant?: 'global' | 'referral';
    className?: string;
    isLoading?: boolean;
}

export function MetricsDisplay({
    assets,
    zakat,
    variant = 'global',
    className,
    isLoading = false
}: MetricsDisplayProps) {

    if (isLoading) {
        return <div className={cn("animate-pulse h-5 w-64 bg-muted rounded", className)} />;
    }

    const assetsStr = formatLargeNumber(assets);
    const zakatStr = formatLargeNumber(zakat);

    if (variant === 'referral') {
        return (
            <p className={cn("text-sm text-muted-foreground", className)}>
                {c.settings.metrics.referral(assetsStr, zakatStr)}
            </p>
        );
    }

    // Default 'global' variant
    return (
        <p className={cn("text-center text-sm text-muted-foreground", className)}>
            {c.settings.metrics.global(assetsStr, zakatStr)}
        </p>
    );
}

