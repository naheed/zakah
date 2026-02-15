import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ArticleLayout } from "@/components/layout/ArticleLayout";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface Release {
    version: string;
    date: string;
    title?: string;
    added?: string[];
    changed?: string[];
    fixed?: string[];
}

const RELEASES: Release[] = [
    {
        version: "0.25.0",
        date: "2026-02-07",
        title: "Asset Class Expansion",
        added: [
            "Service Business Toggle: Consultants/freelancers support",
            "Land Banking: Input for undeveloped land investments",
            "REITs: Equity REITs input with Shariah warning",
            "New Zakat range logic for Ahmed example ($5,125 - $12,915)"
        ],
        changed: [
            "Updated ZakatFormData interface with new asset fields",
            "Refined document extraction mappings"
        ]
    },
    {
        version: "0.19.0",
        date: "2026-02-07",
        title: "Compliance & Clarity",
        added: [
            "Jewelry Governance: Explicit handling of 'Excessive vs Personal'",
            "Precious Metals Split: Investment Gold vs Jewelry inputs",
            "Content Strategy: 3-Tier model with deep links to jurisprudence"
        ],
        fixed: [
            "Critical Bug: Metals calculation using gross value instead of zakatable portion"
        ]
    },
    {
        version: "0.18.0",
        date: "2026-01-20",
        title: "Product Reality",
        added: [
            "Interactive Demo: Live Sankey chart animation on landing page",
            "Sample Data Downloads: PDF/CSV preview without sign-up"
        ],
        changed: [
            "Design System Audit: Removed redundant badges, improved copy"
        ]
    },
    {
        version: "0.14.0",
        date: "2026-01-11",
        title: "Jurisprudence Overhaul",
        added: [
            "5 Distinct Madhab Calculation Modes (Hanafi, Shafi'i, Maliki, Hanbali, Balanced)",
            "Accurate Debt Deduction Rules per school",
            "Asset-Level Schema for Mudir/Muhtakir distinction"
        ]
    },
    {
        version: "0.13.0",
        date: "2026-01-11",
        title: "Plaid Bank Sync",
        added: [
            "Connect Bank Flow via Plaid Link",
            "Automated Asset Sync & Smart Mapping",
            "AES-256-GCM Encryption for Access Tokens"
        ]
    },
    {
        version: "0.11.0",
        date: "2026-01-06",
        title: "Donation Tracking",
        added: [
            "Receipt Scanning via Gemini AI",
            "Year-to-Date Donation Tracking",
            "Recurring Donation Support"
        ]
    }
];

export default function Changelog() {
    const headerContent = (
        <Text variant="lead">
            A timeline of features, fixes, and improvements.
        </Text>
    );

    return (
        <ArticleLayout
            title="Changelog"
            description="Full developer changelog with release notes, bug fixes, and feature additions for ZakatFlow."
            urlPath="/changelog"
            headerContent={headerContent}
        >
            <div className="space-y-8">
                {RELEASES.map((release) => (
                    <ScrollReveal key={release.version}>
                        <div className="relative flex items-start gap-4">
                            {/* Timeline dot */}
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border bg-background shadow-sm shrink-0 mt-1">
                                <div className="w-3 h-3 bg-primary rounded-full" />
                            </div>

                            {/* Content Card */}
                            <div className="bg-card border rounded-xl shadow-sm p-6 flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                                    <div>
                                        <span className="font-mono text-sm text-primary font-medium">v{release.version}</span>
                                        {release.title && (
                                            <h3 className="text-lg font-serif font-medium mt-1">{release.title}</h3>
                                        )}
                                    </div>
                                    <time className="text-sm text-muted-foreground font-mono">{release.date}</time>
                                </div>

                                <div className="space-y-4 text-sm">
                                    {release.added && (
                                        <div>
                                            <h4 className="font-medium mb-2 flex items-center gap-2">
                                                <span className="bg-success-container text-on-success-container rounded px-1.5 py-0.5 text-xs">Added</span>
                                            </h4>
                                            <ul className="list-disc pl-4 space-y-1 text-muted-foreground marker:text-success">
                                                {release.added.map((item, i) => (
                                                    <li key={i}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {release.changed && (
                                        <div>
                                            <h4 className="font-medium mb-2 flex items-center gap-2">
                                                <span className="bg-primary-container text-on-primary-container rounded px-1.5 py-0.5 text-xs">Changed</span>
                                            </h4>
                                            <ul className="list-disc pl-4 space-y-1 text-muted-foreground marker:text-primary">
                                                {release.changed.map((item, i) => (
                                                    <li key={i}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {release.fixed && (
                                        <div>
                                            <h4 className="font-medium mb-2 flex items-center gap-2">
                                                <span className="bg-destructive/10 text-destructive rounded px-1.5 py-0.5 text-xs">Fixed</span>
                                            </h4>
                                            <ul className="list-disc pl-4 space-y-1 text-muted-foreground marker:text-destructive">
                                                {release.fixed.map((item, i) => (
                                                    <li key={i}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                ))}
            </div>

            <div className="text-center pt-4">
                <p className="text-muted-foreground">End of public history.</p>
            </div>
        </ArticleLayout>
    );
}
