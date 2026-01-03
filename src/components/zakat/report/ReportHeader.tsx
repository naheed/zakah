import { format } from "date-fns";

interface ReportHeaderProps {
    userName?: string;
    reportDate: Date;
    reportId?: string;
}

export function ReportHeader({ userName, reportDate, reportId }: ReportHeaderProps) {
    // Mock Hijri date for now (or use library if available)
    // Simple fallback logic
    const hijriDate = "Jumada II 4, 1447 AH"; // Dynamic calc would be better but keeping simple for UI

    return (
        <header className="flex flex-col sm:flex-row justify-between items-start mb-10 pb-6 border-b border-border">
            <div>
                {/* Bismillah */}
                <div className="font-arabic text-xl text-primary/80 mb-4">بسم الله الرحمن الرحيم</div>

                <h1 className="text-3xl font-extrabold tracking-tight text-foreground leading-none mb-1">
                    {reportDate.getFullYear()} Zakat Record
                </h1>
                <p className="text-sm text-muted-foreground font-medium">
                    Prepared for <span className="text-foreground font-bold">{userName || "Servant of Allah"}</span>
                </p>
            </div>

            <div className="text-left sm:text-right flex flex-col items-start sm:items-end mt-4 sm:mt-0">
                <div className="mb-2">
                    <div className="font-bold text-xl text-primary tracking-tight flex items-center gap-2">
                        ZakatFlow
                    </div>
                </div>
                <div className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">Date Generated</div>
                <div className="text-sm font-medium text-foreground">
                    {format(reportDate, "MMM d, yyyy")}
                </div>
                <div className="text-xs text-muted-foreground">
                    {hijriDate}
                </div>
                {reportId && (
                    <div className="text-[10px] text-muted-foreground/40 font-mono mt-1">Ref: {reportId}</div>
                )}
            </div>
        </header>
    );
}
