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

import { Button } from "@/components/ui/button";
import { content as c } from "@/content";
import { finalCta } from "@/content/marketing";
import { ArrowRight, Lock, Timer } from "@phosphor-icons/react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface FinalCTAProps {
    onNext: () => void;
}

export function FinalCTA({ onNext }: FinalCTAProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });
    const blobScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1.1]);

    return (
        <section
            ref={sectionRef}
            className="py-20 md:py-28 px-4 relative overflow-hidden"
        >
            {/* Warm gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-primary/5 pointer-events-none" />
            <motion.div
                style={{ scale: blobScale }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none"
            />

            <ScrollReveal className="relative z-10 text-center max-w-xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {finalCta.heading}
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                    {finalCta.subhead}
                </p>

                <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Button
                        onClick={onNext}
                        size="lg"
                        className="gap-2 text-base h-14 px-10 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                    >
                        {finalCta.button}
                        <ArrowRight className="w-5 h-5" weight="bold" />
                    </Button>
                </motion.div>

                {/* Reassurance pills */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-8 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3" /> {finalCta.reassurance.noSignup}
                    </span>
                    <span className="text-border">·</span>
                    <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3" /> {finalCta.reassurance.encrypted}
                    </span>
                    <span className="text-border">·</span>
                    <span className="flex items-center gap-1">
                        <Timer className="w-3 h-3" /> {finalCta.reassurance.time}
                    </span>
                </div>
            </ScrollReveal>
        </section>
    );
}
