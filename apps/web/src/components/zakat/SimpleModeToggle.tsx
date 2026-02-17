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

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sparkle, ListChecks } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SimpleModeToggleProps {
  isSimpleMode: boolean;
  onToggle: (value: boolean) => void;
  className?: string;
}

export function SimpleModeToggle({ isSimpleMode, onToggle, className }: SimpleModeToggleProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4 p-4 rounded-xl bg-surface-container border border-border", className)}>
      <div className="flex items-center gap-3">
        <AnimatePresence mode="wait">
          {isSimpleMode ? (
            <motion.div
              key="simple"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="p-2 rounded-lg bg-tertiary/15"
            >
              <Sparkle weight="fill" className="w-5 h-5 text-tertiary" />
            </motion.div>
          ) : (
            <motion.div
              key="detailed"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="p-2 rounded-lg bg-primary/10"
            >
              <ListChecks weight="duotone" className="w-5 h-5 text-primary" />
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="space-y-0.5">
          <Label htmlFor="simple-mode" className="text-sm font-medium cursor-pointer">
            {isSimpleMode ? "Simple Mode" : "Detailed Mode"}
          </Label>
          <p className="text-xs text-muted-foreground">
            {isSimpleMode 
              ? "4 quick questions for basic calculations" 
              : "Comprehensive asset-by-asset breakdown"
            }
          </p>
        </div>
      </div>
      
      <Switch
        id="simple-mode"
        checked={!isSimpleMode}
        onCheckedChange={(value) => onToggle(!value)}
      />
    </div>
  );
}
