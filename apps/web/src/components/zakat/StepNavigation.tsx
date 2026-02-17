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
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { motion } from "framer-motion";

interface StepNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  isLastStep: boolean;
  currentStepTitle: string;
}

export function StepNavigation({
  onPrevious,
  onNext,
  canGoBack,
  canGoForward,
  isLastStep,
}: StepNavigationProps) {
  return (
    <motion.div 
      className="fixed bottom-4 left-4 right-4 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-card/95 backdrop-blur-md rounded-2xl border border-border shadow-float px-4 py-3 flex items-center justify-between">
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onPrevious();
              }}
              onPointerDown={(e) => e.stopPropagation()}
              disabled={!canGoBack}
              className="gap-2 h-12 min-w-[100px] touch-manipulation select-none"
            >
              <CaretLeft weight="bold" className="h-5 w-5" />
              Previous
            </Button>
          </motion.div>
          
          {!isLastStep && (
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                onPointerDown={(e) => e.stopPropagation()}
                disabled={!canGoForward}
                className="gap-2 h-12 min-w-[120px] touch-manipulation select-none"
              >
                Continue
                <CaretRight weight="bold" className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
