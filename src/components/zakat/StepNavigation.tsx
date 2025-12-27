import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoBack}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        {!isLastStep && (
          <Button
            onClick={onNext}
            disabled={!canGoForward}
            className="gap-2"
          >
            Continue
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
