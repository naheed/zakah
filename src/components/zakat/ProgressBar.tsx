import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  section: 'intro' | 'assets' | 'liabilities' | 'results' | 'settings';
}

const sectionLabels = {
  intro: 'Getting Started',
  assets: 'Zakatable Assets',
  liabilities: 'Deductions',
  results: 'Your Zakat',
  settings: 'Settings',
};

const sectionColors = {
  intro: 'bg-primary',
  assets: 'bg-chart-1',
  liabilities: 'bg-chart-2',
  results: 'bg-chart-5',
  settings: 'bg-muted-foreground',
};

export function ProgressBar({ currentStep, totalSteps, section }: ProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{sectionLabels[section]}</span>
        <span className="text-muted-foreground">
          {currentStep + 1} of {totalSteps}
        </span>
      </div>
      <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", sectionColors[section])}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>
    </div>
  );
}
