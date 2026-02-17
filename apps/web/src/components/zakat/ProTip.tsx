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

import { useState, useEffect } from "react";
import { Lightbulb, X } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProTipProps {
  tipKey: string;
  children: React.ReactNode;
  className?: string;
}

export function ProTip({ tipKey, children, className }: ProTipProps) {
  const storageKey = `protip-dismissed-${tipKey}`;
  const [isDismissed, setIsDismissed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(storageKey) === 'true';
  });

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem(storageKey, 'true');
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn(
          "flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20",
          className
        )}
      >
        <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" weight="fill" />
        <p className="text-sm text-foreground flex-1">{children}</p>
        <button
          onClick={handleDismiss}
          className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
          aria-label="Dismiss tip"
        >
          <X className="w-4 h-4" weight="bold" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
