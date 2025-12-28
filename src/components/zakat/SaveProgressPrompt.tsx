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
    const shouldShow = 
      !loading && 
      !user && 
      currentStepIndex >= PROMPT_AFTER_STEPS && 
      currentStepIndex < totalSteps - 1 && // Not on results
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
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-24 left-4 right-4 z-40 max-w-md mx-auto"
        >
          <div className="bg-card border border-border rounded-xl shadow-float p-4">
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" weight="bold" />
            </button>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <FloppyDisk className="w-5 h-5 text-primary" weight="fill" />
              </div>
              
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
                    className="gap-1.5 min-h-10"
                  >
                    <UserCirclePlus className="w-4 h-4" weight="bold" />
                    Create Account
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={handleDismiss}
                    className="min-h-10"
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
