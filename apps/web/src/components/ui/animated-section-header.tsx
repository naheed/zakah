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

import { motion, useInView } from "framer-motion";
import { useRef, ReactNode, ElementType } from "react";
import { cn } from "@/lib/utils";

interface AnimatedSectionHeaderProps {
  number?: number;
  icon?: ReactNode;
  title: string;
  id?: string;
  className?: string;
  as?: ElementType;
}

export function AnimatedSectionHeader({
  number,
  icon,
  title,
  id,
  className,
  as: Tag = "h2",
}: AnimatedSectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div
      ref={ref}
      id={id}
      className={cn("flex items-center gap-3 mb-6", className)}
    >
      {/* Animated number badge */}
      {number !== undefined && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1,
          }}
          className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"
        >
          <span className="text-lg font-semibold text-primary font-serif">
            {number}
          </span>
        </motion.div>
      )}

      {/* Animated icon */}
      {icon && !number && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1,
          }}
          className="p-2 rounded-lg bg-primary/10 shrink-0"
        >
          {icon}
        </motion.div>
      )}

      {/* Animated title with reveal */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          delay: 0.2,
        }}
      >
        <Tag className="text-2xl font-semibold text-foreground font-serif">
          {title}
        </Tag>
      </motion.div>
    </div>
  );
}
