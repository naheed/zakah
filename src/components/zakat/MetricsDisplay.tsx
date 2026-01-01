import { formatLargeNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";

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
                Through your shares, people evaluated <span className="font-semibold text-foreground">{assetsStr}</span> in assets and calculated <span className="font-semibold text-foreground">{zakatStr}</span> in Zakat.
            </p>
        );
    }

    // Default 'global' variant
    return (
        <p className={cn("text-center text-sm text-muted-foreground", className)}>
            We've helped evaluate <span className="font-semibold text-foreground">{assetsStr}</span> in assets and calculate <span className="font-semibold text-foreground">{zakatStr}</span> in Zakat.
        </p>
    );
}
