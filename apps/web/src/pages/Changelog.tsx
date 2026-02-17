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
        version: "0.32.0",
        date: "2026-02-17",
        title: "Open Source Community Launch",
        added: [
            "Documentation Overhaul: Comprehensive contributor guide with three contribution tracks",
            "Style Guide: Code, content, and documentation standards for human and AI contributors",
            "ZMCS Contributor Call: Actively seeking scholars to audit and verify methodology presets"
        ],
        changed: [
            "README: Expanded as the primary Getting Started guide with contribution tracks",
            "CONTRIBUTING.md: Complete rewrite with style guides and contribution workflows",
            "Technical Documentation: Audit and update of all docs across web and MCP packages"
        ]
    },
    {
        version: "0.31.0",
        date: "2026-02-16",
        title: "Open Source Limitless Intelligence",
        added: [
            "Model Context Protocol (MCP): Connect ZakatFlow to ChatGPT/Claude for context-aware answers",
            "Open Source: Repository is now public under AGPL-3.0",
            "Deep Link Reports: Generate base64-encoded report links via MCP tools"
        ],
        changed: [
            "Waitlist Removed: Application is now fully open for public use"
        ]
    },
    {
        version: "0.30.0",
        date: "2026-02-16",
        title: "Real-Time Methodology Engine",
        added: [
            "Interactive Comparison Tool: Switch between 'Theory' rules and 'Practice' case study",
            "Real-Time Logic: Runs the actual Zakat engine in the browser for 100% accuracy",
            "Ahmed Family Case Study: Standardized profile to demonstrate rule differences (e.g. Jewelry exemptions)"
        ],
        changed: [
            "Methodology Explorer: Enhanced UI with dynamic calculation visualization"
        ]
    },
    {
        version: "0.29.0",
        date: "2026-02-15",
        title: "Visual & UX Polish",
        added: [
            "Financial Statement Hero: Realistic report card design",
            "Phosphor Icons: Complete migration for unified visual language",
            "Scroll UX: Consistent navigation cues across all devices"
        ],
        changed: [
            "Footer: Simplified scholarly methodology citation",
            "Privacy Badges: clearer 'Session Encrypted' status"
        ]
    },
    {
        version: "0.28.0",
        date: "2026-02-15",
        title: "Security & Classification Overhaul",
        added: [
            "AGPL-3.0 License: Codebase is now fully open source",
            "Two-Tier Encryption: Choice between Managed (Ease) and Sovereign (Max Privacy) keys",
            "Plaid Encryption: Bank tokens now encrypted with user-derived keys"
        ],
        fixed: [
            "Upload Classification: Improved AI mapping for uploaded statements",
            "Bank Sync: Better category detection for Plaid accounts"
        ]
    },
    {
        version: "0.27.0",
        date: "2026-02-14",
        title: "Methodology Engine (ZMCS)",
        added: [
            "ZMCS v2.0: Schema-driven calculation engine for 8 methodologies",
            "New Scholars: AMJA, Imam Tahir Anwar, and Al-Qaradawi support",
            "Dynamic Nisab: Real-time gold/silver price fetching"
        ]
    },
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
