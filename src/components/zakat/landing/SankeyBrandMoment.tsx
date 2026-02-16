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

import { ResponsiveSankey } from "@nivo/sankey";
import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ASSET_COLORS } from "../sankey/constants";
import { formatCompactCurrency } from "@/lib/zakatCalculations";
import { ArrowDown, Wallet } from "@phosphor-icons/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { sankey } from "@/content/marketing";

// Balanced $505K dataset for better visual storytelling
// Distributed across 5 distinct asset classes to show complexity handling
const DEMO_NODES = [
    // Source Nodes (Assets)
    { id: "Business", displayName: "Business", nodeColor: ASSET_COLORS["Business"], isSource: true },
    { id: "Crypto", displayName: "Crypto", nodeColor: ASSET_COLORS["Crypto & Digital"], isSource: true },
    { id: "Gold", displayName: "Gold", nodeColor: ASSET_COLORS["Precious Metals"], isSource: true },
    { id: "Cash", displayName: "Cash", nodeColor: ASSET_COLORS["Cash & Savings"], isSource: true },
    { id: "Investments", displayName: "Investments", nodeColor: ASSET_COLORS["Investments"], isSource: true },

    // Target Nodes (Destinations)
    { id: "Zakat_Due", displayName: sankey.zakatDue, nodeColor: "#16a34a", isZakat: true },
    { id: "Retained", displayName: "Retained", nodeColor: "#cbd5e1", isRetained: true },
    { id: "Exempt", displayName: "Exempt", nodeColor: "#94a3b8", isExempt: true },
];

const DEMO_LINKS = [
    // Business ($140k) -> 40% Zakatable Inventory
    { source: "Business", target: "Zakat_Due", value: 1400 },   // 2.5% of $56k
    { source: "Business", target: "Retained", value: 54600 },   // Rest of zakatable
    { source: "Business", target: "Exempt", value: 84000 },       // Fixed assets

    // Crypto ($80k) -> 100% Zakatable
    { source: "Crypto", target: "Zakat_Due", value: 2000 },     // 2.5% of $80k
    { source: "Crypto", target: "Retained", value: 78000 },

    // Gold ($60k) -> 100% Zakatable
    { source: "Gold", target: "Zakat_Due", value: 1500 },     // 2.5% of $60k
    { source: "Gold", target: "Retained", value: 58500 },

    // Cash ($45k) -> 100% Zakatable
    { source: "Cash", target: "Zakat_Due", value: 1125 },   // 2.5% of $45k
    { source: "Cash", target: "Retained", value: 43875 },

    // Investments ($180k) -> 30% Zakatable
    { source: "Investments", target: "Zakat_Due", value: 1350 }, // 2.5% of $54k
    { source: "Investments", target: "Retained", value: 52650 },
    { source: "Investments", target: "Exempt", value: 126000 },
];

const DEMO_DATA = { nodes: DEMO_NODES, links: DEMO_LINKS };

export function SankeyBrandMoment() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(chartRef, { once: true, margin: "-100px" });
    const isMobile = useIsMobile();

    // Scroll-linked progress (desktop only)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const linkOpacity = useTransform(scrollYProgress, [0.15, 0.5], [0, 0.5]);

    // Accessibility: Reduced motion check
    const prefersReducedMotion = typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;

    return (
        <section ref={sectionRef} className="py-16 md:py-24 px-6 md:px-12 relative">
            <ScrollReveal className="text-center mb-12 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {sankey.heading} <span className="text-primary">{sankey.headingAccent}</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                    {sankey.personaIntro}
                </p>
            </ScrollReveal>

            {/* Sankey Chart */}
            <div
                ref={chartRef}
                className="max-w-4xl mx-auto md:sticky md:top-[10vh]"
                role="img"
                aria-label={`Sankey diagram showing Ahmed's $500K portfolio flowing through Zakat rules. $260K is exempt, $235K is retained, and $5.5K is calculated as Zakat Due.`}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="bg-card rounded-2xl border border-border/50 shadow-lg p-4 md:p-8 overflow-hidden">
                        <div style={{ height: 380 }} className="w-full">
                            <ResponsiveSankey
                                data={DEMO_DATA}
                                margin={{ top: 20, right: 120, bottom: 20, left: 160 }}
                                align="justify"
                                colors={(node: { nodeColor?: string }) => node.nodeColor || "#94a3b8"}
                                nodeOpacity={1}
                                nodeHoverOthersOpacity={0.35}
                                nodeThickness={16}
                                nodeSpacing={22}
                                nodeBorderWidth={0}
                                linkOpacity={isMobile || prefersReducedMotion ? 0.4 : 0.4}
                                linkBlendMode="normal"
                                linkHoverOthersOpacity={0.1}
                                linkContract={2}
                                enableLinkGradient={true}
                                labelPosition="outside"
                                labelOrientation="horizontal"
                                labelPadding={14}
                                labelTextColor={{ from: "color", modifiers: [["darker", 1.5]] }}
                                theme={{
                                    labels: { text: { fontSize: 11, fontWeight: 600 } },
                                }}
                                label={(node) => {
                                    const val = formatCompactCurrency(node.value, "USD");
                                    return `${node.id.replace(/_/g, " ")}\n${val}`;
                                }}
                                nodeTooltip={({ node }: any) => (
                                    <div className="bg-popover text-popover-foreground px-3 py-2 rounded-lg shadow-xl border border-border text-xs font-medium z-50">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: node.color }} />
                                            <span>{node.id.replace(/_/g, " ")}</span>
                                        </div>
                                        <div className="text-base font-bold">
                                            {formatCompactCurrency(node.value, "USD")}
                                        </div>
                                    </div>
                                )}
                                linkTooltip={({ link }: any) => (
                                    <div className="bg-popover text-popover-foreground px-3 py-2 rounded-lg shadow-xl border border-border text-xs font-medium z-50">
                                        <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                                            <span>{link.source.id.replace(/_/g, " ")}</span>
                                            <span className="text-primary">→</span>
                                            <span>{link.target.id.replace(/_/g, " ")}</span>
                                        </div>
                                        <div className="text-base font-bold">
                                            {formatCompactCurrency(link.value, "USD")}
                                        </div>
                                    </div>
                                )}
                            />
                        </div>

                        {/* Summary Footer */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border/30"
                        >
                            <div className="text-center">
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">{sankey.totalAssets}</span>
                                <span className="text-base font-bold font-mono">$500K</span>
                            </div>
                            <div className="text-center">
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center justify-center gap-1">
                                    <ArrowDown className="w-2.5 h-2.5" /> {sankey.deductions}
                                </span>
                                <span className="text-base font-bold font-mono text-muted-foreground">-$260K</span>
                            </div>
                            <div className="text-center">
                                <span className="text-[10px] uppercase tracking-wider text-primary font-semibold flex items-center justify-center gap-1">
                                    <Wallet className="w-2.5 h-2.5" /> {sankey.zakatDue}
                                </span>
                                <span className="text-base font-bold font-mono text-primary">$5,500</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Footnote */}
                    <p className="text-center text-[11px] text-muted-foreground/60 mt-4 italic">
                        {sankey.footnote}
                    </p>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1, y: [0, 10, 0] } : {}}
                transition={{ delay: 1.5, duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground/30"
            >
                <ArrowDown className="w-6 h-6" />
            </motion.div>
        </section>
    );
}
