import { useState, useEffect, useRef, useCallback } from "react";
import { FileText, Check, Loader2, Play, RotateCcw } from "lucide-react";
import { formatCurrency } from "@/lib/zakatCalculations";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { NumberTicker } from "@/components/ui/number-ticker";

// Animation phases - added "celebrating" for Material 3 Expressive celebration moment
type AnimationPhase = 
  | "idle"
  | "typing-cash"
  | "typed-cash"
  | "upload-start"
  | "upload-typing"
  | "upload-processing"
  | "upload-complete"
  | "aggregating"
  | "sankey-reveal"
  | "zakat-reveal"
  | "celebrating"
  | "complete";

// Mock data for the demo
const DEMO_DATA = {
  cashValue: 24500,
  investmentsExtracted: 67800,
  retirementValue: 38200,
  otherAssets: 11850,
  liabilities: 8500,
  netZakatable: 133850,
  conservativeZakat: 3346, // Full 2.5% on all
  optimizedZakat: 2391, // Excluding retirement
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
  const [selectedMode, setSelectedMode] = useState<"conservative" | "optimized">("conservative");
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Typed values
  const typedCash = useTypingAnimation("$24,500", phase === "typing-cash", 100);
  const typedFilename = useTypingAnimation("Chase_Statement.pdf", phase === "upload-typing", 50);
  
  // Animation sequence controller - only runs when user triggers it
  useEffect(() => {
    if (phase === "idle" || phase === "complete") return;
    
    const timers: NodeJS.Timeout[] = [];
    
    // Phase 1: Start typing cash value
    if (phase === "typing-cash") {
      timers.push(setTimeout(() => setPhase("typed-cash"), 1500));
    }
    if (phase === "typed-cash") {
      timers.push(setTimeout(() => setPhase("upload-start"), 500));
    }
    if (phase === "upload-start") {
      timers.push(setTimeout(() => setPhase("upload-typing"), 300));
    }
    if (phase === "upload-typing") {
      timers.push(setTimeout(() => setPhase("upload-processing"), 1400));
    }
    if (phase === "upload-processing") {
      timers.push(setTimeout(() => setPhase("upload-complete"), 800));
    }
    if (phase === "upload-complete") {
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
  const showUpload = ["upload-start", "upload-typing", "upload-processing", "upload-complete", "aggregating", "sankey-reveal", "zakat-reveal", "celebrating", "complete"].includes(phase);
  const showAggregation = ["aggregating", "sankey-reveal", "zakat-reveal", "celebrating", "complete"].includes(phase);
  const showSankey = ["sankey-reveal", "zakat-reveal", "celebrating", "complete"].includes(phase);
  const showZakatValue = ["zakat-reveal", "celebrating", "complete"].includes(phase);
  const isCelebrating = phase === "celebrating";
  
  const currentZakat = selectedMode === "conservative" ? DEMO_DATA.conservativeZakat : DEMO_DATA.optimizedZakat;
  const otherZakat = selectedMode === "conservative" ? DEMO_DATA.optimizedZakat : DEMO_DATA.conservativeZakat;
  const otherModeLabel = selectedMode === "conservative" ? "Optimized" : "Conservative";
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-md mx-auto"
    >
      {/* Glassmorphic card effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl" />
      
      <div className="relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-4 sm:p-5 shadow-lg overflow-hidden">
        {/* Floating Replay Button - Non-obscuring */}
        <AnimatePresence>
          {showReplayButton && phase === "complete" && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.3, ease: M3_EASING.emphasizedDecelerate }}
              className="absolute top-3 right-3 z-10"
            >
              <Button 
                variant="secondary" 
                size="sm" 
                className="gap-1.5 shadow-md text-xs px-2.5 py-1 h-7"
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
        <div className="text-center mb-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Your Zakat Due</p>
          <div className="h-12 flex items-center justify-center">
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
                    <div className="text-2xl sm:text-3xl font-bold text-primary">
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
                    className="mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors group"
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
                  className="text-lg text-muted-foreground/50"
                >
                  Calculating...
                </motion.p>
              ) : (
                <motion.p 
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-2xl sm:text-3xl font-bold text-muted-foreground/30"
                >
                  —
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Animation Stages Container with staggered choreography */}
        <motion.div 
          className="space-y-2 min-h-[160px]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Stage 1: Manual Input */}
          <motion.div 
            variants={itemVariants}
            className={`transition-all duration-500 ${
              showCashInput ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="bg-muted/50 rounded-lg p-2.5 border border-border">
              <label className="text-[10px] text-muted-foreground mb-0.5 block">Cash & Savings</label>
              <div className="flex items-center">
                <span className="text-base font-semibold text-foreground">
                  {phase === "complete" || phase === "celebrating" ? "$24,500" : typedCash}
                  <span className={`inline-block w-0.5 h-4 bg-primary ml-0.5 ${
                    phase === "typing-cash" ? "animate-pulse" : "opacity-0"
                  }`} />
                </span>
              </div>
            </div>
          </motion.div>
          
          {/* Stage 2: Document Upload */}
          <AnimatePresence>
            {showUpload && (
              <motion.div 
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: M3_EASING.emphasizedDecelerate }}
              >
                <div className="bg-muted/50 rounded-lg p-2.5 border border-border">
                  <div className="flex items-center gap-2.5">
                    <motion.div 
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        phase === "upload-complete" || showAggregation ? "bg-primary/20" : "bg-muted"
                      }`}
                      animate={phase === "upload-complete" ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {phase === "upload-processing" ? (
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      ) : showAggregation ? (
                        <Check className="w-4 h-4 text-primary" />
                      ) : (
                        <FileText className="w-4 h-4 text-muted-foreground" />
                      )}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {phase === "complete" || phase === "celebrating" ? "Chase_Statement.pdf" : typedFilename}
                        <span className={`inline-block w-0.5 h-3 bg-primary ml-0.5 ${
                          phase === "upload-typing" ? "animate-pulse" : "opacity-0"
                        }`} />
                      </p>
                      <p className={`text-[10px] transition-colors ${
                        showAggregation ? "text-primary" : "text-muted-foreground"
                      }`}>
                        {phase === "upload-processing" 
                          ? "Extracting..." 
                          : showAggregation
                            ? `✓ Extracted ${formatCurrency(DEMO_DATA.investmentsExtracted, "USD")} investments`
                            : "Bank statement"
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Stage 3: Asset Aggregation Animation / Sankey Chart */}
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
                          className="w-2.5 h-2.5 rounded-full"
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
                      <span className="text-xs text-muted-foreground ml-2">Calculating...</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Summary row */}
        <motion.div 
          className={`pt-3 border-t border-border flex justify-between items-center text-sm transition-opacity duration-500 ${
            showSankey ? "opacity-100" : "opacity-50"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: showSankey ? 1 : 0.5 }}
        >
          <div className="flex-1">
            <span className="text-xs text-muted-foreground">Net Zakatable Wealth</span>
          </div>
          <span className="font-semibold text-foreground text-sm">
            {showSankey ? formatCurrency(DEMO_DATA.netZakatable, "USD") : "—"}
          </span>
        </motion.div>
      </div>
    </div>
  );
}

// Simplified animated Sankey chart for the demo - Single Zakat output
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
  // Responsive width based on device
  const width = isMobile ? 260 : 300;
  const height = isMobile ? 115 : 130;
  const nodeWidth = isMobile ? 6 : 8;
  const leftPadding = isMobile ? 4 : 6;
  const rightPadding = isMobile ? 4 : 6;
  
  // Calculate total assets for proportional sizing
  const assets = [
    { name: "Cash", value: DEMO_DATA.cashValue, color: ASSET_COLORS.cash },
    { name: "Investments", value: DEMO_DATA.investmentsExtracted, color: ASSET_COLORS.investments },
    { name: "Retirement", value: DEMO_DATA.retirementValue, color: ASSET_COLORS.retirement },
    { name: "Other", value: DEMO_DATA.otherAssets, color: ASSET_COLORS.other },
  ];
  
  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
  
  // Calculate asset node heights and positions proportionally
  const assetSpacing = 4;
  const availableHeight = height - 16;
  let currentY = 8;
  
  const assetNodes = assets.map((asset) => {
    const nodeHeight = Math.max(12, (asset.value / totalAssets) * (availableHeight - assetSpacing * 3));
    const node = { ...asset, y: currentY, height: nodeHeight };
    currentY += nodeHeight + assetSpacing;
    return node;
  });
  
  // Center node (Net Zakatable)
  const centerX = width * 0.48;
  const centerY = 12;
  const centerHeight = height - 28;
  
  // Single Zakat node (right side)
  const zakatX = width - rightPadding - nodeWidth;
  const zakatY = height / 2 - 16;
  const zakatHeight = 32;
  
  // Generate curved path
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
        
        {/* Asset nodes (left) with staggered animation */}
        {assetNodes.map((asset, i) => {
          const flowThickness = Math.max(5, (asset.value / totalAssets) * 32);
          const endY = centerY + (i + 0.5) * (centerHeight / assetNodes.length);
          
          return (
            <g key={asset.name}>
              <motion.rect
                x={leftPadding}
                y={asset.y}
                width={nodeWidth}
                height={asset.height}
                rx={2}
                fill={asset.color}
                initial={isAnimating ? { scaleY: 0, opacity: 0 } : false}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.4, 
                  delay: i * 0.08,
                  ease: M3_EASING.emphasizedDecelerate 
                }}
                style={{ transformOrigin: `${leftPadding + nodeWidth/2}px ${asset.y + asset.height/2}px` }}
              />
              {/* Flow to center with path drawing effect */}
              <motion.path
                d={generatePath(
                  leftPadding + nodeWidth,
                  asset.y + asset.height / 2,
                  centerX,
                  endY,
                  flowThickness
                )}
                fill={asset.color}
                fillOpacity={0.25}
                initial={isAnimating ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.25 + i * 0.08 }}
              />
            </g>
          );
        })}
        
        {/* Center node (Net Zakatable) */}
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
        
        {/* Single Zakat output flow */}
        <motion.path
          d={generatePath(
            centerX + nodeWidth,
            centerY + centerHeight / 2,
            zakatX,
            height / 2,
            18
          )}
          fill={ASSET_COLORS.zakat}
          fillOpacity={0.35}
          initial={isAnimating ? { opacity: 0 } : false}
          animate={{ opacity: showZakatValue ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        />
        
        {/* Single Zakat node with celebration animation */}
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
          style={{ transformOrigin: `${zakatX + nodeWidth/2}px ${height/2}px` }}
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
              y={height / 2 - 4}
              textAnchor="end"
              className="fill-foreground text-[8px] font-medium capitalize"
            >
              {selectedMode}
            </text>
            <text
              x={zakatX - 4}
              y={height / 2 + 6}
              textAnchor="end"
              className="fill-muted-foreground text-[7px]"
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
          className="fill-muted-foreground text-[7px]"
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
