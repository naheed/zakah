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

import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ReactNode, useCallback } from "react";

interface StepTransitionProps {
  children: ReactNode;
  stepKey: string;
  direction: number; // 1 for forward, -1 for backward
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};

const stepTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 35,
};

const SWIPE_THRESHOLD = 50;
const SWIPE_VELOCITY_THRESHOLD = 500;

export function StepTransition({
  children,
  stepKey,
  direction,
  onSwipeLeft,
  onSwipeRight,
}: StepTransitionProps) {
  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const { offset, velocity } = info;

      // Check if swipe exceeds threshold
      if (
        offset.x < -SWIPE_THRESHOLD ||
        velocity.x < -SWIPE_VELOCITY_THRESHOLD
      ) {
        onSwipeLeft?.();
      } else if (
        offset.x > SWIPE_THRESHOLD ||
        velocity.x > SWIPE_VELOCITY_THRESHOLD
      ) {
        onSwipeRight?.();
      }
    },
    [onSwipeLeft, onSwipeRight]
  );

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={stepKey}
        custom={direction}
        variants={stepVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={stepTransition}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="touch-pan-y"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
