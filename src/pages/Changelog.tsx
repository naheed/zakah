import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, GitCommit } from "@phosphor-icons/react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { cn } from "@/lib/utils";

// This content would ideally be parsed from the CHANGELOG.md file.
// For now, we will manually structure the key releases to match the content plan.
// Updates here should mirror specific sections of CHANGELOG.md

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
    return (
        <>
            <Helmet>
                <title>Developer Changelog | ZakatFlow</title>
                <meta
                    name="description"
                    content="Full developer changelog with release notes, bug fixes, and feature additions for ZakatFlow."
                />
                <link rel="canonical" href="https://www.zakatflow.org/changelog" />
            </Helmet>

            <div className="min-h-screen bg-background">
                {/* Navigation Bar */}
                <div className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container flex h-14 items-center">
                        <Link to="/about">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Back to About
                            </Button>
                        </Link>
                        <div className="ml-auto font-medium text-sm text-muted-foreground hidden md:block">
                            Release Notes
                        </div>
                    </div>
                </div>

                <div className="container py-10 lg:py-16 max-w-4xl">
                    <ScrollReveal>
                        <header className="space-y-4 border-b pb-8 mb-12">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                <GitCommit className="w-4 h-4" />
                                Engineering Updates
                            </div>
                            <h1 className="text-4xl md:text-5xl font-serif text-foreground leading-tight">
                                Changelog
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                A timeline of features, fixes, and improvements.
                            </p>
                        </header>
                    </ScrollReveal>

                    <div className="space-y-16 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                        {RELEASES.map((release, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <ScrollReveal key={release.version}>
                                    <div className={cn(
                                        "relative flex items-center justify-between md:justify-normal gap-8",
                                        // Desktop: Zig-zag (Even=Left, Odd=Right)
                                        isEven ? "md:flex-row-reverse" : "md:flex-row",
                                        // Mobile: Always standard row (Icon Left, Card Right)
                                        "flex-row"
                                    )}>

                                        {/* Icon */}
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border bg-background shadow shrink-0 z-10 md:order-1">
                                            <div className="w-3 h-3 bg-primary rounded-full" />
                                        </div>

                                        {/* Content Card */}
                                        <div className={cn(
                                            "bg-card border rounded-xl shadow-sm p-6",
                                            // Mobile: Full width minus icon area
                                            "w-[calc(100%-4rem)]",
                                            // Desktop: 45% width
                                            "md:w-[calc(50%-2rem)]"
                                        )}>
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
                                                        <h4 className="font-medium mb-2 flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                                            <span className="bg-emerald-100 dark:bg-emerald-900/30 rounded px-1.5 py-0.5 text-xs">Added</span>
                                                        </h4>
                                                        <ul className="list-disc pl-4 space-y-1 text-muted-foreground marker:text-emerald-500">
                                                            {release.added.map((item, i) => (
                                                                <li key={i}>{item}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {release.changed && (
                                                    <div>
                                                        <h4 className="font-medium mb-2 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                                            <span className="bg-blue-100 dark:bg-blue-900/30 rounded px-1.5 py-0.5 text-xs">Changed</span>
                                                        </h4>
                                                        <ul className="list-disc pl-4 space-y-1 text-muted-foreground marker:text-blue-500">
                                                            {release.changed.map((item, i) => (
                                                                <li key={i}>{item}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {release.fixed && (
                                                    <div>
                                                        <h4 className="font-medium mb-2 flex items-center gap-2 text-rose-600 dark:text-rose-400">
                                                            <span className="bg-rose-100 dark:bg-rose-900/30 rounded px-1.5 py-0.5 text-xs">Fixed</span>
                                                        </h4>
                                                        <ul className="list-disc pl-4 space-y-1 text-muted-foreground marker:text-rose-500">
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
                            );
                        })}
                    </div>

                    <div className="mt-16 text-center">
                        <p className="text-muted-foreground">End of public history.</p>
                    </div>
                </div>
            </div>
        </>
    );
}
