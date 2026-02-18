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

import { useEffect } from "react";
import { useSpring, useMotionValue, useTransform, motion } from "framer-motion";

interface AnimatedNumberProps {
    value: number;
    /** Optional formatter function (e.g. currency) */
    format?: (value: number) => string;
    className?: string;
    /** Spring config for the animation */
    springOptions?: {
        bounce?: number;
        duration?: number; // Note: frame-motion spring duration is calculated from stiffness/damping usually, but we can try to approximate or use specific spring tweaks
        stiffness?: number;
        damping?: number;
        mass?: number;
    };
}

export function AnimatedNumber({
    value,
    format,
    className,
    springOptions = {
        stiffness: 150, // Snappy spring — settles ~3x faster
        damping: 30,    // High damping = minimal overshoot
        mass: 1,
    }
}: AnimatedNumberProps) {
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, springOptions);

    // Update target when value changes
    useEffect(() => {
        motionValue.set(value);
    }, [value, motionValue]);

    // Create a display value that formats the number on every frame
    const displayValue = useTransform(springValue, (latest) => {
        if (format) {
            return format(latest);
        }
        // Default integer formatting if no formatter provided
        return Math.round(latest).toLocaleString();
    });

    return <motion.span className={className}>{displayValue}</motion.span>;
}
