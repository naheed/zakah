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

import { Calculator, UploadSimple, Bank, ArrowRight, ArrowDown } from "@phosphor-icons/react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";

const WAYS = [
    {
        icon: Calculator,
        title: "Enter manually",
        description: "Guided wizard walks you through every asset class — cash, stocks, crypto, gold, and more.",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        icon: UploadSimple,
        title: "Upload a statement",
        description: "Drop a bank or brokerage PDF — AI extracts the numbers and maps them to Zakat categories.",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
    },
    {
        icon: Bank,
        title: "Connect your bank",
        description: "Link via Plaid for real-time balances. Your data is encrypted with a key only you control.",
        color: "text-violet-500",
        bg: "bg-violet-500/10",
    },
];

interface ThreeWaysInProps {
    onNext: () => void;
}

export function ThreeWaysIn({ onNext }: ThreeWaysInProps) {
    return (
        <section className="py-16 md:py-24 px-4 relative">
            <ScrollReveal className="text-center mb-12 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Start however you're comfortable
                </h2>
                <p className="text-muted-foreground">
                    Three paths, one result — an accurate, methodology-aware Zakat calculation.
                </p>
            </ScrollReveal>

            <StaggerContainer className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
                {WAYS.map((way) => (
                    <StaggerItem key={way.title}>
                        <motion.div
                            whileHover={{ y: -4, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="bg-card rounded-2xl border border-border/50 p-6 h-full flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${way.bg} flex items-center justify-center mb-5`}>
                                <way.icon className={`w-7 h-7 ${way.color}`} weight="duotone" />
                            </div>
                            <h3 className="font-semibold text-lg text-foreground mb-2">{way.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed flex-1">{way.description}</p>
                        </motion.div>
                    </StaggerItem>
                ))}
            </StaggerContainer>

            {/* CTA below cards */}
            <ScrollReveal delay={0.3} className="text-center mt-10">
                <motion.button
                    onClick={onNext}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:underline text-base"
                >
                    Start Calculating <ArrowRight className="w-4 h-4" weight="bold" />
                </motion.button>
            </ScrollReveal>

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
