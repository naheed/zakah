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
import { StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";
import {
    CurrencyDollar,
    ChartLine,
    Bank as BankIcon,
    CurrencyBtc,
    Medal,
    Storefront,
    House,
    TreeStructure,
    Handshake,
    Package,
    ArrowDown,
} from "@phosphor-icons/react";
import { whatsCovered } from "@/content/marketing";
import { ASSET_COLORS } from "../sankey/constants";

// Icon mapping (content comes from marketing.ts)
const ASSET_ICONS: Record<string, any> = {
    "Cash & Savings": CurrencyDollar,
    "Investments": ChartLine,
    "Retirement": BankIcon,
    "Crypto & Digital": CurrencyBtc,
    "Precious Metals": Medal,
    "Business": Storefront,
    "Real Estate": House,
    "Trusts": TreeStructure,
    "Debts Owed to You": Handshake,
    "Illiquid Assets": Package,
};

// Color mapping for traditions
const TRADITION_STYLES: Record<string, string> = {
    "Modern": "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/50",
    "Modern Fiqh": "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border-indigo-200/50 dark:border-indigo-800/50",
    "Hanafi": "bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300 border-teal-200/50 dark:border-teal-800/50",
    "Classical": "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-200/50 dark:border-amber-800/50",
};

export function WhatsCovered() {
    return (
        <section className="py-16 md:py-24 px-4 bg-transparent relative">
            <ScrollReveal className="text-center mb-12 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {whatsCovered.heading}
                </h2>
                <p className="text-muted-foreground">
                    {whatsCovered.subhead}
                </p>
            </ScrollReveal>

            {/* Methodology pills */}
            <StaggerContainer className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
                {whatsCovered.methodologies.map((m) => {
                    const style = TRADITION_STYLES[m.tradition] || TRADITION_STYLES["Classical"];
                    return (
                        <StaggerItem key={m.name} variant="scale">
                            <motion.div
                                whileHover={{ scale: 1.04 }}
                                className="bg-card rounded-xl border border-border/50 p-4 text-center shadow-sm hover:shadow-md transition-shadow cursor-default h-full flex flex-col justify-center items-center gap-2"
                            >
                                <p className="font-semibold text-sm text-foreground leading-tight">{m.name}</p>
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${style}`}>
                                    {m.tradition}
                                </span>
                                <p className="text-[10px] text-muted-foreground/80 leading-tight">
                                    {m.key}
                                </p>
                            </motion.div>
                        </StaggerItem>
                    );
                })}
            </StaggerContainer>

            {/* Asset class icons */}
            <StaggerContainer staggerDelay={0.06} className="max-w-3xl mx-auto grid grid-cols-5 sm:grid-cols-5 gap-4">
                {whatsCovered.assets.map((a) => {
                    const Icon = ASSET_ICONS[a.id];
                    const color = ASSET_COLORS[a.id] || "#94a3b8";

                    return (
                        <StaggerItem key={a.id} variant="fade">
                            <div className="flex flex-col items-center gap-2 group cursor-default">
                                <div
                                    className="w-12 h-12 rounded-xl bg-card border border-border/30 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300"
                                    style={{ color: color }}
                                >
                                    <Icon className="w-6 h-6" weight="duotone" />
                                </div>
                                <span className="text-[11px] text-muted-foreground font-medium text-center leading-tight">{a.label}</span>
                            </div>
                        </StaggerItem>
                    );
                })}
            </StaggerContainer>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1, y: [0, 10, 0] }}
                viewport={{ once: true }}
                transition={{ delay: 1, duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground/30"
            >
                <ArrowDown className="w-6 h-6" />
            </motion.div>
        </section>
    );
}
