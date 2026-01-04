import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, CheckCircle } from "@phosphor-icons/react";
import { formatCurrency } from "@/lib/zakatCalculations";
import { SavedCalculation } from "@/hooks/useSavedCalculations";

interface MiniReportWidgetProps {
    calculation: SavedCalculation;
    onLoad: (calc: SavedCalculation) => void;
}

export function MiniReportWidget({ calculation, onLoad }: MiniReportWidgetProps) {
    const getRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <Card
            className="border-0 ring-1 ring-border/50 bg-card hover:bg-muted/30 transition-all cursor-pointer group shadow-sm"
            onClick={() => onLoad(calculation)}
        >
            <CardContent className="p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <CheckCircle weight="fill" className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                            Report Ready
                        </div>
                        <div className="font-bold text-foreground flex items-baseline gap-2">
                            <span>{formatCurrency(calculation.zakat_due || 0)}</span>
                            <span className="text-xs font-normal text-muted-foreground hidden sm:inline">
                                • {getRelativeTime(calculation.updated_at)}
                            </span>
                        </div>
                    </div>
                </div>

                <Button variant="ghost" size="sm" className="hidden sm:flex gap-2 text-primary group-hover:translate-x-1 transition-transform">
                    View
                    <ArrowRight weight="bold" />
                </Button>
                <ArrowRight className="sm:hidden w-4 h-4 text-muted-foreground" />
            </CardContent>
        </Card>
    );
}
