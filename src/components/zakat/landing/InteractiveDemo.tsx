import { useState, useEffect, useRef, useCallback } from "react";
import { FileText, Check, Loader2, Play, RotateCcw, Landmark } from "lucide-react";
import { formatCurrency } from "@/lib/zakatCalculations";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { NumberTicker } from "@/components/ui/number-ticker";

// Animation phases - including retirement/401(k) upload step
type AnimationPhase = 
  | "idle"
  | "typing-cash"
  | "typed-cash"
  | "upload-start"
  | "upload-typing"
  | "upload-processing"
  | "upload-complete"
  // NEW: 401(k) upload phases
  | "retirement-upload-start"
  | "retirement-upload-typing"
  | "retirement-scanning"
  | "retirement-upload-complete"
  | "aggregating"
  | "sankey-reveal"
  | "zakat-reveal"
  | "celebrating"
  | "complete";

// Mock data for the demo - updated with realistic 401(k) values
const DEMO_DATA = {
  cashValue: 24500,
  investmentsExtracted: 67800,
  // 401(k) with zakatable calculation (65% after 25% tax + 10% early withdrawal penalty)
  retirement401k: 487500,
  retirement401kTaxRate: 0.25,
  retirement401kPenalty: 0.10,
  retirement401kZakatable: 316875, // $487,500 * (1 - 0.25 - 0.10) = $316,875
  retirement401kZakatablePercent: 65,
  otherAssets: 11850,
  liabilities: 8500,
  // Recalculated totals with 401(k)
  netZakatable: 412525, // 24500 + 67800 + 316875 (optimized 401k) + 11850 - 8500
  netZakatableConservative: 583150, // Full 401k value
  conservativeZakat: 14579, // 2.5% on full 401k ($583,150)
  optimizedZakat: 10313, // 2.5% on optimized 401k ($412,525)
};

// Asset colors matching the Sankey chart
const ASSET_COLORS = {
  cash: "#22c55e",
  investments: "#3b82f6",
  retirement: "#8b5cf6",
  other: "#06b6d4",
  liabilities: "#ef4444",
  net: "#64748b",
  zakat: "#22c55e",
};

// Material 3 Expressive easing curves - using cubicBezier format for framer-motion
const M3_EASING = {
  emphasized: [0.2, 0, 0, 1] as [number, number, number, number],
  emphasizedDecelerate: [0.05, 0.7, 0.1, 1] as [number, number, number, number],
  emphasizedAccelerate: [0.3, 0, 0.8, 0.15] as [number, number, number, number],
  standard: [0.2, 0, 0, 1] as [number, number, number, number],
};

// Typing animation hook
function useTypingAnimation(
  text: string,
  isActive: boolean,
  speed: number = 80
): string {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    if (!isActive) {
      setDisplayText("");
      return;
    }
    
    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    
    return () => clearInterval(interval);
  }, [text, isActive, speed]);
  
  return displayText;
}

// Staggered container variants for Material 3 choreography
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: M3_EASING.emphasizedDecelerate,
    }
  }
};

export function InteractiveDemo() {
  // Start with completed state - show the final result immediately
  const [phase, setPhase] = useState<AnimationPhase>("complete");
  const [showReplayButton, setShowReplayButton] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);
  const [selectedMode, setSelectedMode] = useState<"conservative" | "optimized">("optimized");
  const [scanProgress, setScanProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Typed values
  const typedCash = useTypingAnimation("$24,500", phase === "typing-cash", 100);
  const typedFilename = useTypingAnimation("Chase_Statement.pdf", phase === "upload-typing", 50);
  const typedRetirementFilename = useTypingAnimation("Fidelity_401k.pdf", phase === "retirement-upload-typing", 50);
  
  // Scan progress animation
  useEffect(() => {
    if (phase === "retirement-scanning") {
      setScanProgress(0);
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 36); // 1.8s total
      return () => clearInterval(interval);
    }
  }, [phase]);
  
  // Animation sequence controller - only runs when user triggers it
  useEffect(() => {
    if (phase === "idle" || phase === "complete") return;
    
    const timers: NodeJS.Timeout[] = [];
    
    // Phase 1: Start typing cash value
    if (phase === "typing-cash") {
      timers.push(setTimeout(() => setPhase("typed-cash"), 1500));
    }
    if (phase === "typed-cash") {
      timers.push(setTimeout(() => setPhase("upload-start"), 400));
    }
    if (phase === "upload-start") {
      timers.push(setTimeout(() => setPhase("upload-typing"), 200));
    }
    if (phase === "upload-typing") {
      timers.push(setTimeout(() => setPhase("upload-processing"), 1200));
    }
    if (phase === "upload-processing") {
      timers.push(setTimeout(() => setPhase("upload-complete"), 700));
    }
    // NEW: 401(k) upload sequence
    if (phase === "upload-complete") {
      timers.push(setTimeout(() => setPhase("retirement-upload-start"), 400));
    }
    if (phase === "retirement-upload-start") {
      timers.push(setTimeout(() => setPhase("retirement-upload-typing"), 200));
    }
    if (phase === "retirement-upload-typing") {
      timers.push(setTimeout(() => setPhase("retirement-scanning"), 1000));
    }
    if (phase === "retirement-scanning") {
      timers.push(setTimeout(() => setPhase("retirement-upload-complete"), 2000));
    }
    if (phase === "retirement-upload-complete") {
      timers.push(setTimeout(() => setPhase("aggregating"), 500));
    }
    if (phase === "aggregating") {
      timers.push(setTimeout(() => setPhase("sankey-reveal"), 1000));
    }
    if (phase === "sankey-reveal") {
      timers.push(setTimeout(() => setPhase("zakat-reveal"), 1200));
    }
    // Extended celebration phase for Material 3 Expressive
    if (phase === "zakat-reveal") {
      timers.push(setTimeout(() => setPhase("celebrating"), 2000));
    }
    if (phase === "celebrating") {
      timers.push(setTimeout(() => {
        setPhase("complete");
        // Show replay button after a delay so users can appreciate the final state
        setTimeout(() => setShowReplayButton(true), 2000);
      }, 3000));
    }
    
    return () => timers.forEach(clearTimeout);
  }, [phase, animationKey]);
  
  // Start the animation sequence
  const handleWatchAnimation = useCallback(() => {
    setShowReplayButton(false);
    setPhase("idle");
    setScanProgress(0);
    // Small delay then start
    setTimeout(() => {
      setPhase("typing-cash");
      setAnimationKey(prev => prev + 1);
    }, 100);
  }, []);

  // Toggle between conservative and optimized
  const handleToggleMode = useCallback(() => {
    setSelectedMode(prev => prev === "conservative" ? "optimized" : "conservative");
  }, []);
  
  const isAnimating = !["complete", "idle"].includes(phase);
  const showCashInput = phase !== "idle";
  const showUpload = ["upload-start", "upload-typing", "upload-processing", "upload-complete", "retirement-upload-start", "retirement-upload-typing", "retirement-scanning", "retirement-upload-complete", "aggregating", "sankey-reveal", "zakat-reveal", "celebrating", "complete"].includes(phase);
  const showRetirementUpload = ["retirement-upload-start", "retirement-upload-typing", "retirement-scanning", "retirement-upload-complete", "aggregating", "sankey-reveal", "zakat-reveal", "celebrating", "complete"].includes(phase);
  const showAggregation = ["aggregating", "sankey-reveal", "zakat-reveal", "celebrating", "complete"].includes(phase);
  const showSankey = ["sankey-reveal", "zakat-reveal", "celebrating", "complete"].includes(phase);
  const showZakatValue = ["zakat-reveal", "celebrating", "complete"].includes(phase);
  const isCelebrating = phase === "celebrating";
  const isRetirementScanning = phase === "retirement-scanning";
  const isRetirementComplete = ["retirement-upload-complete", "aggregating", "sankey-reveal", "zakat-reveal", "celebrating", "complete"].includes(phase);
  
  const currentZakat = selectedMode === "conservative" ? DEMO_DATA.conservativeZakat : DEMO_DATA.optimizedZakat;
  const otherZakat = selectedMode === "conservative" ? DEMO_DATA.optimizedZakat : DEMO_DATA.conservativeZakat;
  const otherModeLabel = selectedMode === "conservative" ? "Optimized" : "Conservative";
  const currentNetZakatable = selectedMode === "conservative" ? DEMO_DATA.netZakatableConservative : DEMO_DATA.netZakatable;
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-md mx-auto"
    >
      {/* Glassmorphic card effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl" />
      
      <div className="relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-3 sm:p-4 shadow-lg overflow-hidden">
        {/* Floating Replay Button - Non-obscuring */}
        <AnimatePresence>
          {showReplayButton && phase === "complete" && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.3, ease: M3_EASING.emphasizedDecelerate }}
              className="absolute top-2.5 right-2.5 z-10"
            >
              <Button 
                variant="secondary" 
                size="sm" 
                className="gap-1.5 shadow-md text-xs px-2 py-0.5 h-6"
                onClick={handleWatchAnimation}
              >
                <RotateCcw className="w-3 h-3" />
                Replay
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Initial Play Overlay - Only shown on first load before any animation */}
        <AnimatePresence>
          {phase === "complete" && !showReplayButton && animationKey === 0 && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-10 flex items-center justify-center cursor-pointer"
              onClick={handleWatchAnimation}
            >
              <Button 
                variant="secondary" 
                size="sm" 
                className="gap-2 shadow-lg"
                onClick={handleWatchAnimation}
              >
                <Play className="w-4 h-4" />
                See how it works
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Header with Zakat Value */}
        <div className="text-center mb-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Your Zakat Due</p>
          <div className="h-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {showZakatValue ? (
                <motion.div
                  key="zakat-value"
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ 
                    opacity: 1, 
                    scale: isCelebrating ? [1, 1.08, 1] : 1,
                    y: 0,
                  }}
                  transition={{ 
                    duration: 0.5,
                    ease: M3_EASING.emphasizedDecelerate,
                    scale: isCelebrating ? {
                      duration: 0.6,
                      times: [0, 0.5, 1],
                      ease: "easeInOut"
                    } : undefined
                  }}
                  className="flex flex-col items-center"
                >
                  {/* Main Zakat Value with celebration glow */}
                  <motion.div 
                    className={`relative ${isCelebrating ? 'zakat-glow' : ''}`}
                    animate={isCelebrating ? {
                      filter: [
                        "drop-shadow(0 0 0px hsl(var(--primary)))",
                        "drop-shadow(0 0 12px hsl(var(--primary)))",
                        "drop-shadow(0 0 4px hsl(var(--primary)))"
                      ]
                    } : {}}
                    transition={{ duration: 1.5, repeat: isCelebrating ? Infinity : 0, repeatType: "reverse" }}
                  >
                    <div className="text-xl sm:text-2xl font-bold text-primary">
                      {phase === "zakat-reveal" ? (
                        <NumberTicker 
                          value={currentZakat} 
                          formatFn={(v) => formatCurrency(v, "USD")}
                          duration={1.2}
                        />
                      ) : (
                        formatCurrency(currentZakat, "USD")
                      )}
                    </div>
                  </motion.div>
                  
                  {/* Toggle Button */}
                  <motion.button
                    onClick={handleToggleMode}
                    className="mt-0.5 flex items-center gap-1.5 text-[9px] text-muted-foreground hover:text-foreground transition-colors group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="capitalize font-medium text-primary/80">{selectedMode}</span>
                    <span className="text-muted-foreground/60">·</span>
                    <span className="group-hover:underline">{otherModeLabel}: {formatCurrency(otherZakat, "USD")}</span>
                  </motion.button>
                </motion.div>
              ) : showSankey ? (
                <motion.p 
                  key="calculating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-base text-muted-foreground/50"
                >
                  Calculating...
                </motion.p>
              ) : (
                <motion.p 
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xl sm:text-2xl font-bold text-muted-foreground/30"
                >
                  —
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Animation Stages Container with staggered choreography */}
        <motion.div 
          className="space-y-1.5 min-h-[180px]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Stage 1: Manual Input - Reduced size */}
          <motion.div 
            variants={itemVariants}
            className={`transition-all duration-500 ${
              showCashInput ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="bg-muted/50 rounded-lg p-2 border border-border">
              <label className="text-[9px] text-muted-foreground mb-0.5 block">Cash & Savings</label>
              <div className="flex items-center">
                <span className="text-sm font-semibold text-foreground">
                  {phase === "complete" || phase === "celebrating" ? "$24,500" : typedCash}
                  <span className={`inline-block w-0.5 h-3.5 bg-primary ml-0.5 ${
                    phase === "typing-cash" ? "animate-pulse" : "opacity-0"
                  }`} />
                </span>
              </div>
            </div>
          </motion.div>
          
          {/* Stage 2: Bank Statement Upload - Reduced size */}
          <AnimatePresence>
            {showUpload && (
              <motion.div 
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: M3_EASING.emphasizedDecelerate }}
              >
                <div className="bg-muted/50 rounded-lg p-2 border border-border">
                  <div className="flex items-center gap-2">
                    <motion.div 
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                        phase === "upload-complete" || showRetirementUpload ? "bg-primary/20" : "bg-muted"
                      }`}
                      animate={phase === "upload-complete" ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {phase === "upload-processing" ? (
                        <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                      ) : showRetirementUpload ? (
                        <Check className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {phase === "complete" || phase === "celebrating" || showRetirementUpload ? "Chase_Statement.pdf" : typedFilename}
                        <span className={`inline-block w-0.5 h-2.5 bg-primary ml-0.5 ${
                          phase === "upload-typing" ? "animate-pulse" : "opacity-0"
                        }`} />
                      </p>
                      <p className={`text-[9px] transition-colors ${
                        showRetirementUpload ? "text-primary" : "text-muted-foreground"
                      }`}>
                        {phase === "upload-processing" 
                          ? "Extracting..." 
                          : showRetirementUpload
                            ? `✓ ${formatCurrency(DEMO_DATA.investmentsExtracted, "USD")} investments`
                            : "Bank statement"
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Stage 3: 401(k) Statement Upload with Scan Animation */}
          <AnimatePresence>
            {showRetirementUpload && (
              <motion.div 
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: M3_EASING.emphasizedDecelerate }}
              >
                <div className="bg-muted/50 rounded-lg p-2 border border-border">
                  <div className="flex items-center gap-2">
                    {/* Icon with scan animation */}
                    <motion.div 
                      className={`relative w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden transition-colors ${
                        isRetirementComplete ? "bg-primary/20" : "bg-muted"
                      }`}
                      animate={phase === "retirement-upload-complete" ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {isRetirementComplete ? (
                        <Check className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <Landmark className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                      {/* Scan line animation */}
                      {isRetirementScanning && (
                        <motion.div 
                          className="absolute left-0 right-0 h-0.5 bg-primary"
                          animate={{ y: [-14, 14, -14] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                        />
                      )}
                    </motion.div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {isRetirementComplete || phase === "retirement-scanning" ? "Fidelity_401k.pdf" : typedRetirementFilename}
                        <span className={`inline-block w-0.5 h-2.5 bg-primary ml-0.5 ${
                          phase === "retirement-upload-typing" ? "animate-pulse" : "opacity-0"
                        }`} />
                      </p>
                      <AnimatePresence mode="wait">
                        {isRetirementScanning ? (
                          <motion.p 
                            key="scanning"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-[9px] text-muted-foreground"
                          >
                            Analyzing retirement account...
                          </motion.p>
                        ) : isRetirementComplete ? (
                          <motion.p 
                            key="complete"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-[9px] text-primary"
                          >
                            ✓ {formatCurrency(DEMO_DATA.retirement401k, "USD")} → {DEMO_DATA.retirement401kZakatablePercent}% = {formatCurrency(DEMO_DATA.retirement401kZakatable, "USD")}
                          </motion.p>
                        ) : (
                          <motion.p 
                            key="pending"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-[9px] text-muted-foreground"
                          >
                            401(k) statement
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  
                  {/* Scan progress bar */}
                  {isRetirementScanning && (
                    <motion.div 
                      className="mt-1.5 h-0.5 bg-muted rounded-full overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${scanProgress}%` }}
                        transition={{ duration: 0.05 }}
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Stage 4: Asset Aggregation Animation / Sankey Chart - Enlarged */}
          <AnimatePresence mode="wait">
            {(showAggregation || phase === "complete") && (
              <motion.div
                key={showSankey ? "sankey" : "aggregating"}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: M3_EASING.emphasizedDecelerate }}
              >
                {showSankey ? (
                  <AnimatedSankeyChart 
                    showZakatValue={showZakatValue}
                    isAnimating={isAnimating && !["celebrating", "complete"].includes(phase)}
                    isCelebrating={isCelebrating}
                    isMobile={isMobile}
                    selectedMode={selectedMode}
                  />
                ) : (
                  <div className="flex justify-center py-3">
                    <div className="flex items-center gap-2">
                      {[
                        { color: ASSET_COLORS.cash, delay: 0 },
                        { color: ASSET_COLORS.investments, delay: 0.1 },
                        { color: ASSET_COLORS.retirement, delay: 0.2 },
                        { color: ASSET_COLORS.other, delay: 0.3 },
                      ].map((asset, i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: asset.color }}
                          animate={{ 
                            scale: [1, 1.3, 1],
                            opacity: [0.6, 1, 0.6]
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: asset.delay,
                          }}
                        />
                      ))}
                      <span className="text-[10px] text-muted-foreground ml-2">Calculating...</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Summary row */}
        <motion.div 
          className={`pt-2 border-t border-border flex justify-between items-center text-xs transition-opacity duration-500 ${
            showSankey ? "opacity-100" : "opacity-50"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: showSankey ? 1 : 0.5 }}
        >
          <div className="flex-1">
            <span className="text-[10px] text-muted-foreground">Net Zakatable Wealth</span>
          </div>
          <span className="font-semibold text-foreground text-xs">
            {showSankey ? formatCurrency(currentNetZakatable, "USD") : "—"}
          </span>
        </motion.div>
      </div>
    </div>
  );
}

// Proper Sankey chart with top-edge alignment and multi-colored Zakat flows
function AnimatedSankeyChart({ 
  showZakatValue, 
  isAnimating,
  isCelebrating,
  isMobile = false,
  selectedMode
}: { 
  showZakatValue: boolean;
  isAnimating: boolean;
  isCelebrating: boolean;
  isMobile?: boolean;
  selectedMode: "conservative" | "optimized";
}) {
  // Enlarged responsive dimensions
  const width = isMobile ? 280 : 340;
  const height = isMobile ? 140 : 165;
  const nodeWidth = isMobile ? 6 : 8;
  const leftPadding = isMobile ? 4 : 6;
  const rightPadding = isMobile ? 4 : 6;
  
  // Calculate total assets for proportional sizing - now including 401(k)
  const retirement401kValue = selectedMode === "conservative" 
    ? DEMO_DATA.retirement401k 
    : DEMO_DATA.retirement401kZakatable;
    
  const assets = [
    { name: "Cash", value: DEMO_DATA.cashValue, color: ASSET_COLORS.cash },
    { name: "Investments", value: DEMO_DATA.investmentsExtracted, color: ASSET_COLORS.investments },
    { name: "401(k)", value: retirement401kValue, color: ASSET_COLORS.retirement },
    { name: "Other", value: DEMO_DATA.otherAssets, color: ASSET_COLORS.other },
  ];
  
  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
  const currentZakat = selectedMode === "conservative" 
    ? DEMO_DATA.conservativeZakat 
    : DEMO_DATA.optimizedZakat;
  
  // Available height for the chart content
  const topMargin = 8;
  const bottomMargin = 16; // Space for label
  const availableHeight = height - topMargin - bottomMargin;
  
  // Left side: Asset nodes - proportional heights stacked from top
  const assetSpacing = 3;
  const totalSpacing = assetSpacing * (assets.length - 1);
  const leftNodeAreaHeight = availableHeight;
  
  let leftY = topMargin;
  const assetNodes = assets.map((asset) => {
    const proportion = asset.value / totalAssets;
    const nodeHeight = Math.max(10, proportion * (leftNodeAreaHeight - totalSpacing));
    const node = { ...asset, y: leftY, height: nodeHeight, proportion };
    leftY += nodeHeight + assetSpacing;
    return node;
  });
  
  // Center node (Net Zakatable) - spans the full height of incoming flows
  const centerX = width * 0.48;
  const centerY = topMargin;
  const centerHeight = availableHeight;
  
  // Calculate flow positions on center node - stacked from top (proportional)
  let centerFlowY = centerY;
  const flowPositions = assetNodes.map((asset) => {
    const flowThickness = asset.proportion * centerHeight;
    const position = {
      asset,
      sourceY: asset.y + asset.height / 2,
      targetY: centerFlowY + flowThickness / 2,
      thickness: flowThickness,
      topY: centerFlowY, // Top edge of this flow on center node
    };
    centerFlowY += flowThickness;
    return position;
  });
  
  // Zakat node - height proportional to zakat rate (2.5%), positioned to receive all flows
  const zakatX = width - rightPadding - nodeWidth;
  const zakatProportion = currentZakat / totalAssets;
  const zakatHeight = Math.max(30, zakatProportion * centerHeight * 4); // Scale up for visibility
  const zakatY = centerY + (centerHeight - zakatHeight) / 2; // Center vertically
  
  // Calculate each asset's contribution to Zakat (proportional to their share of total)
  let zakatFlowY = zakatY;
  const zakatFlowPositions = flowPositions.map((flow) => {
    const zakatContribution = flow.asset.proportion * zakatHeight;
    const position = {
      ...flow,
      zakatTargetY: zakatFlowY + zakatContribution / 2,
      zakatThickness: zakatContribution,
      zakatTopY: zakatFlowY,
    };
    zakatFlowY += zakatContribution;
    return position;
  });
  
  // Generate curved path for Sankey flows
  const generatePath = (
    startX: number, 
    startY: number, 
    endX: number, 
    endY: number,
    thickness: number
  ) => {
    const midX = (startX + endX) / 2;
    return `
      M ${startX} ${startY - thickness / 2}
      C ${midX} ${startY - thickness / 2}, ${midX} ${endY - thickness / 2}, ${endX} ${endY - thickness / 2}
      L ${endX} ${endY + thickness / 2}
      C ${midX} ${endY + thickness / 2}, ${midX} ${startY + thickness / 2}, ${startX} ${startY + thickness / 2}
      Z
    `;
  };
  
  return (
    <div className="flex justify-center py-0.5">
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          {/* Glow filter for celebration */}
          <filter id="zakatGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Asset nodes (left) and flows to center - staggered animation */}
        {flowPositions.map((flow, i) => (
          <g key={flow.asset.name}>
            {/* Asset node rect */}
            <motion.rect
              x={leftPadding}
              y={flow.asset.y}
              width={nodeWidth}
              height={flow.asset.height}
              rx={2}
              fill={flow.asset.color}
              initial={isAnimating ? { scaleY: 0, opacity: 0 } : false}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ 
                duration: 0.4, 
                delay: i * 0.08,
                ease: M3_EASING.emphasizedDecelerate 
              }}
              style={{ transformOrigin: `${leftPadding + nodeWidth/2}px ${flow.asset.y + flow.asset.height/2}px` }}
            />
            
            {/* Flow from asset to center - maintaining asset color, stacked on center */}
            <motion.path
              d={generatePath(
                leftPadding + nodeWidth,
                flow.sourceY,
                centerX,
                flow.targetY,
                flow.thickness
              )}
              fill={flow.asset.color}
              fillOpacity={0.45}
              initial={isAnimating ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25 + i * 0.08 }}
            />
            
            {/* Asset label */}
            <motion.text
              x={leftPadding + nodeWidth + 4}
              y={flow.asset.y + flow.asset.height / 2 + 3}
              className="fill-muted-foreground text-[6px]"
              initial={isAnimating ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.08 }}
            >
              {flow.asset.name}
            </motion.text>
          </g>
        ))}
        
        {/* Center node (Net Zakatable) - spans full height */}
        <motion.rect
          x={centerX}
          y={centerY}
          width={nodeWidth}
          height={centerHeight}
          rx={2}
          fill={ASSET_COLORS.net}
          initial={isAnimating ? { scaleY: 0, opacity: 0 } : false}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35, ease: M3_EASING.emphasizedDecelerate }}
          style={{ transformOrigin: `${centerX + nodeWidth/2}px ${centerY + centerHeight/2}px` }}
        />
        
        {/* Multi-colored Zakat flows - each asset's color continues to Zakat node */}
        {zakatFlowPositions.map((flow, i) => (
          <motion.path
            key={`zakat-flow-${flow.asset.name}`}
            d={generatePath(
              centerX + nodeWidth,
              flow.targetY, // Start from where left flow enters center
              zakatX,
              flow.zakatTargetY, // End at stacked position on Zakat node
              flow.zakatThickness
            )}
            fill={flow.asset.color}
            fillOpacity={0.55}
            initial={isAnimating ? { opacity: 0 } : false}
            animate={{ opacity: showZakatValue ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.5 + i * 0.06 }}
          />
        ))}
        
        {/* Zakat node with celebration animation - proportional height */}
        <motion.rect
          x={zakatX}
          y={zakatY}
          width={nodeWidth}
          height={zakatHeight}
          rx={2}
          fill={ASSET_COLORS.zakat}
          filter={isCelebrating ? "url(#zakatGlow)" : undefined}
          initial={isAnimating ? { scaleY: 0, opacity: 0 } : false}
          animate={{ 
            scaleY: 1, 
            opacity: showZakatValue ? 1 : 0,
            scale: isCelebrating ? [1, 1.1, 1] : 1,
          }}
          transition={{ 
            duration: 0.5, 
            delay: 0.6,
            ease: M3_EASING.emphasizedDecelerate,
            scale: isCelebrating ? { duration: 1, repeat: Infinity, repeatType: "reverse" } : undefined
          }}
          style={{ transformOrigin: `${zakatX + nodeWidth/2}px ${zakatY + zakatHeight/2}px` }}
        />
        
        {/* Zakat label with mode indicator */}
        {showZakatValue && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <text
              x={zakatX - 4}
              y={zakatY + zakatHeight / 2 - 4}
              textAnchor="end"
              className="fill-foreground text-[7px] font-medium capitalize"
            >
              {selectedMode}
            </text>
            <text
              x={zakatX - 4}
              y={zakatY + zakatHeight / 2 + 5}
              textAnchor="end"
              className="fill-muted-foreground text-[6px]"
            >
              2.5% Zakat
            </text>
          </motion.g>
        )}
        
        {/* Center node label */}
        <motion.text
          x={centerX + nodeWidth / 2}
          y={height - 3}
          textAnchor="middle"
          className="fill-muted-foreground text-[6px]"
          initial={isAnimating ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Net Zakatable
        </motion.text>
      </svg>
    </div>
  );
}

export default InteractiveDemo;
