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
import { Button } from "@/components/ui/button";
import { FloppyDisk, X, UserCirclePlus } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface SaveProgressPromptProps {
  currentStepIndex: number;
  totalSteps: number;
  onDismiss: () => void;
  onSave?: () => void;
}

const PROMPT_AFTER_STEPS = 3;
const DISMISS_KEY = 'zakat-save-prompt-dismissed';

export function SaveProgressPrompt({
  currentStepIndex,
  totalSteps,
  onDismiss,
  onSave,
}: SaveProgressPromptProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already dismissed this session
    const dismissed = sessionStorage.getItem(DISMISS_KEY);
    if (dismissed) {
      setHasBeenDismissed(true);
      return;
    }

    // Show prompt after PROMPT_AFTER_STEPS questions (not on results)
    // Show prompt ONLY after the report is generated (Results Step)
    const shouldShow =
      !loading &&
      !user &&
      currentStepIndex === totalSteps - 1 && // Only on results
      !hasBeenDismissed;

    if (shouldShow) {
      // Delay showing to not interrupt the user immediately
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [currentStepIndex, totalSteps, user, loading, hasBeenDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setHasBeenDismissed(true);
    sessionStorage.setItem(DISMISS_KEY, 'true');
    onDismiss();
  };

  const handleSignUp = () => {
    handleDismiss();
    navigate('/auth');
  };

  // Don't render for logged-in users
  if (user || loading) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-24 left-4 right-4 z-50 max-w-md mx-auto"
        >
          <div className="bg-card border border-border rounded-xl shadow-float p-4 shadow-xl">
            <button
              onClick={handleDismiss}
              aria-label="Dismiss save prompt"
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" weight="bold" />
            </button>

            <div className="flex items-start gap-3">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 1 }}
                >
                  <FloppyDisk className="w-5 h-5 text-primary" weight="fill" />
                </motion.div>
              </motion.div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground text-sm">
                  Save your progress?
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Create a free account to save your calculation and access it anytime.
                </p>

                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    onClick={handleSignUp}
                    className="gap-1.5 min-h-10 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <UserCirclePlus className="w-4 h-4" weight="bold" />
                    Create Account
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDismiss}
                    className="min-h-10 hover:bg-muted"
                  >
                    Maybe later
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
