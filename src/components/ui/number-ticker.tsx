import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface NumberTickerProps {
  value: number;
  duration?: number;
  className?: string;
  formatFn?: (value: number) => string;
  delay?: number;
}

export function NumberTicker({
  value,
  duration = 1.5,
  className = "",
  formatFn = (v) => v.toLocaleString(),
  delay = 0,
}: NumberTickerProps) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  
  // Spring animation for smooth counting
  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 20,
    duration: duration * 1000,
  });
  
  const displayValue = useTransform(springValue, (latest) => formatFn(Math.round(latest)));
  const [displayString, setDisplayString] = useState(formatFn(0));

  useEffect(() => {
    // Trigger when component mounts
    const timer = setTimeout(() => {
      setIsInView(true);
    }, delay * 1000);
    
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  useEffect(() => {
    const unsubscribe = displayValue.on("change", (latest) => {
      setDisplayString(latest);
    });
    return () => unsubscribe();
  }, [displayValue]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      {displayString}
    </motion.span>
  );
}
