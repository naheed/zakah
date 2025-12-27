import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  section: 'intro' | 'assets' | 'liabilities' | 'results';
}

const sectionLabels = {
  intro: 'Getting Started',
  assets: 'Zakatable Assets',
  liabilities: 'Expenses & Liabilities',
  results: 'Your Zakat',
};

const sectionColors = {
  intro: 'bg-primary',
  assets: 'bg-chart-1',
  liabilities: 'bg-chart-2',
  results: 'bg-chart-5',
};

export function ProgressBar({ currentStep, totalSteps, section }: ProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{sectionLabels[section]}</span>
        <span className="text-muted-foreground">
          Step {currentStep + 1} of {totalSteps}
        </span>
      </div>
      <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
        <div
          className={cn("h-full transition-all duration-500 ease-out rounded-full", sectionColors[section])}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
