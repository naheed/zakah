import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Check, Sparkles } from "lucide-react";

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

// Color progression from muted to vibrant based on progress
const getProgressColor = (progress: number, section: string) => {
  // Base saturation increases with progress
  const saturationBoost = Math.min(progress / 100, 1);
  const lightnessReduction = saturationBoost * 10;
  
  // Section-specific hues
  const sectionHues: Record<string, number> = {
    intro: 142, // primary green
    assets: 221, // blue
    liabilities: 262, // purple
    results: 142, // success green
    settings: 215, // muted blue
  };
  
  const hue = sectionHues[section] || 142;
  const saturation = 50 + (saturationBoost * 30); // 50% to 80%
  const lightness = 55 - lightnessReduction; // 55% to 45%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export function ProgressBar({ currentStep, totalSteps, section }: ProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const [showCelebration, setShowCelebration] = useState(false);
  const prevProgressRef = useRef(progress);
  const prevSectionRef = useRef(section);
  
  // Detect section completion for celebration
  useEffect(() => {
    const sectionChanged = prevSectionRef.current !== section;
    const progressIncreased = progress > prevProgressRef.current;
    
    // Celebrate when completing a section (moving to next section)
    if (sectionChanged && progressIncreased) {
      setShowCelebration(true);
      
      // Haptic feedback on mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(15);
      }
      
      const timer = setTimeout(() => setShowCelebration(false), 800);
      return () => clearTimeout(timer);
    }
    
    prevProgressRef.current = progress;
    prevSectionRef.current = section;
  }, [progress, section]);
  
  const progressColor = getProgressColor(progress, section);
  
  return (
    <div className="space-y-2">
      {/* Section label only - cleaner without step count */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">{sectionLabels[section]}</span>
        <AnimatePresence>
          {showCelebration && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              <Sparkles className="h-4 w-4 text-chart-5" />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      
      {/* Progress track with end stop */}
      <div className="relative h-2.5 bg-muted/20 rounded-full overflow-hidden">
        {/* Active progress bar with color progression */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: progressColor }}
          initial={{ width: 0 }}
          animate={{ 
            width: `${progress}%`,
            boxShadow: progress > 50 
              ? `0 0 12px ${progressColor}40` 
              : 'none'
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        
        {/* Celebration pulse overlay */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: progressColor }}
              initial={{ opacity: 0.8, scale: 1 }}
              animate={{ opacity: 0, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>
        
        {/* M3 End stop indicator */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-muted-foreground/30 bg-background flex items-center justify-center">
          <AnimatePresence>
            {progress >= 100 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              >
                <Check className="h-2 w-2 text-chart-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
