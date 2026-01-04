import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Gear } from "@phosphor-icons/react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Step {
  id: string;
  title: string;
  section: 'intro' | 'assets' | 'liabilities' | 'results';
}

interface StepNavigatorDrawerProps {
  steps: Step[];
  currentStepIndex: number;
  onStepSelect: (index: number) => void;
  children: React.ReactNode;
}

const sectionLabels = {
  intro: 'Getting Started',
  assets: 'Zakatable Assets',
  liabilities: 'Deductions',
  results: 'Your Zakat',
};

const sectionColors = {
  intro: 'bg-primary',
  assets: 'bg-chart-1',
  liabilities: 'bg-chart-2',
  results: 'bg-chart-5',
};

export function StepNavigatorDrawer({
  steps,
  currentStepIndex,
  onStepSelect,
  children,
}: StepNavigatorDrawerProps) {
  const [open, setOpen] = useState(false);

  // Group steps by section
  const groupedSteps = steps.reduce((acc, step, index) => {
    if (!acc[step.section]) {
      acc[step.section] = [];
    }
    acc[step.section].push({ ...step, index });
    return acc;
  }, {} as Record<string, (Step & { index: number })[]>);

  const handleStepClick = (index: number) => {
    onStepSelect(index);
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-left pb-2">
          <DrawerTitle>Jump to step</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-8 overflow-y-auto">
          {(['intro', 'assets', 'liabilities', 'results'] as const).map((section) => {
            const sectionSteps = groupedSteps[section];
            if (!sectionSteps?.length) return null;

            return (
              <div key={section} className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn("w-2 h-2 rounded-full", sectionColors[section])} />
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    {sectionLabels[section]}
                  </span>
                </div>
                <div className="space-y-1 ml-4">
                  {sectionSteps.map((step) => {
                    const isCompleted = step.index < currentStepIndex;
                    const isCurrent = step.index === currentStepIndex;

                    return (
                      <button
                        key={step.id}
                        onClick={() => handleStepClick(step.index)}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-lg text-left transition-all",
                          isCurrent
                            ? "bg-primary/10 border border-primary/30"
                            : "hover:bg-accent",
                          isCompleted && !isCurrent && "opacity-70"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                              isCurrent
                                ? "bg-primary text-primary-foreground"
                                : isCompleted
                                  ? "bg-muted text-muted-foreground"
                                  : "bg-muted/50 text-muted-foreground"
                            )}
                          >
                            {isCompleted ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              step.index + 1
                            )}
                          </div>
                          <span
                            className={cn(
                              "text-sm",
                              isCurrent ? "font-medium text-foreground" : "text-muted-foreground"
                            )}
                          >
                            {step.title}
                          </span>
                        </div>
                        {isCurrent && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

        </div>
      </DrawerContent>
    </Drawer>
  );
}
