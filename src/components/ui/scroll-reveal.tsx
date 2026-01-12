import { motion, useInView, Variants, UseInViewOptions } from "framer-motion";
import { useEffect, useRef, ReactNode, useState } from "react";
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
  fade: {
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
  scale: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
};

function supportsIntersectionObserver() {
  return typeof window !== "undefined" && "IntersectionObserver" in window;
}

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
  const [forceVisible, setForceVisible] = useState(false);

  // Fail-open: if IntersectionObserver is unavailable (or never fires in some iframes),
  // ensure content becomes visible so pages don't render as blank.
  useEffect(() => {
    if (!supportsIntersectionObserver()) {
      setForceVisible(true);
      return;
    }

    if (isInView) return;

    const el = ref.current;
    if (!el) return;

    // Only auto-reveal elements that should be visible on initial paint.
    const rect = el.getBoundingClientRect();
    const nearViewport = rect.top < window.innerHeight + 100;
    if (!nearViewport) return;

    const t = window.setTimeout(() => setForceVisible(true), 350);
    return () => window.clearTimeout(t);
  }, [isInView]);

  const shouldShow = forceVisible || isInView;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={shouldShow ? "visible" : "hidden"}
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
  const [forceVisible, setForceVisible] = useState(false);

  useEffect(() => {
    if (!supportsIntersectionObserver()) {
      setForceVisible(true);
      return;
    }

    if (isInView) return;

    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const nearViewport = rect.top < window.innerHeight + 100;
    if (!nearViewport) return;

    const t = window.setTimeout(() => setForceVisible(true), 350);
    return () => window.clearTimeout(t);
  }, [isInView]);

  const shouldShow = forceVisible || isInView;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={shouldShow ? "visible" : "hidden"}
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
  as?: "div" | "li" | "span";
}

export function StaggerItem({
  children,
  className,
  variant = "slide-up",
  as = "div",
}: StaggerItemProps) {
  const Component = as === "li" ? motion.li : as === "span" ? motion.span : motion.div;

  return (
    <Component
      variants={variants[variant]}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className={cn(className)}
    >
      {children}
    </Component>
  );
}
