import { motion, useInView, Variants, UseInViewOptions } from "framer-motion";
import { useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  margin?: UseInViewOptions["margin"];
  variant?: "fade" | "slide-up" | "slide-left" | "slide-right" | "scale";
}

const variants: Record<string, Variants> = {
  "fade": {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "slide-up": {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
  "slide-left": {
    hidden: { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0 },
  },
  "slide-right": {
    hidden: { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0 },
  },
  "scale": {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = 0.5,
  once = true,
  margin = "-50px",
  variant = "slide-up",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants[variant]}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay,
        duration,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
  margin?: UseInViewOptions["margin"];
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  once = true,
  margin = "-50px",
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  variant?: "fade" | "slide-up" | "slide-left" | "slide-right" | "scale";
}

export function StaggerItem({
  children,
  className,
  variant = "slide-up",
}: StaggerItemProps) {
  return (
    <motion.div
      variants={variants[variant]}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
