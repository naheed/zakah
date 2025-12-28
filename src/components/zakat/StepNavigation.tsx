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
              onClick={onPrevious}
              disabled={!canGoBack}
              className="gap-2 h-12 min-w-[100px] touch-manipulation"
            >
              <CaretLeft weight="bold" className="h-5 w-5" />
              Previous
            </Button>
          </motion.div>
          
          {!isLastStep && (
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onNext}
                disabled={!canGoForward}
                className="gap-2 h-12 min-w-[120px] touch-manipulation"
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
