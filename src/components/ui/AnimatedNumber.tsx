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
        stiffness: 75,
        damping: 15,
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
