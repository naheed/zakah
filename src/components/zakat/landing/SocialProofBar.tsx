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

import { useUsageMetrics } from "@/hooks/useUsageMetrics";
import { formatLargeNumber } from "@/lib/formatters";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function SocialProofBar() {
    const { data: metrics, isLoading } = useUsageMetrics();

    if (isLoading || !metrics) return null;

    const assetsStr = formatLargeNumber(metrics.allTime.totalAssets);
    const zakatStr = formatLargeNumber(metrics.allTime.totalZakat);

    return (
        <ScrollReveal variant="fade" className="py-8 border-y border-border/30 bg-muted/20">
            <p className="text-center text-sm text-muted-foreground max-w-2xl mx-auto px-4">
                Our community has evaluated <span className="font-semibold text-foreground">{assetsStr}+</span> in assets
                and calculated <span className="font-semibold text-foreground">{zakatStr}+</span> in Zakat obligations.
            </p>
        </ScrollReveal>
    );
}
