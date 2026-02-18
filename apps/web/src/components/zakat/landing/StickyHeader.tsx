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
import { Logo } from "../Logo";
import { ArrowRight } from "@phosphor-icons/react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface StickyHeaderProps {
    onNext: () => void;
    /** Y offset (px) at which the header appears — typically the CTA button's offsetTop */
    showAfter?: number;
    /** Ref to an element that, when visible, hides the sticky header (e.g. FinalCTA) */
    hideWhenVisible?: React.RefObject<HTMLElement>;
}

export function StickyHeader({ onNext, showAfter = 600, hideWhenVisible }: StickyHeaderProps) {
    const { scrollY } = useScroll();
    const [pastHero, setPastHero] = useState(false);
    const [bottomCtaVisible, setBottomCtaVisible] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setPastHero(latest > showAfter);
    });

    // IntersectionObserver to detect when FinalCTA enters viewport
    useEffect(() => {
        const el = hideWhenVisible?.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => setBottomCtaVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [hideWhenVisible]);

    const visible = pastHero && !bottomCtaVisible;

    return (
        <motion.header
            initial={{ y: -80 }}
            animate={{ y: visible ? 0 : -80 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
        >
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                <Logo size="sm" />
                <Button
                    onClick={onNext}
                    size="sm"
                    className="gap-1.5 shadow-sm"
                >
                    {c.common.buttons.startCalculating}
                    <ArrowRight className="w-3.5 h-3.5" weight="bold" />
                </Button>
            </div>
        </motion.header>
    );
}
