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
