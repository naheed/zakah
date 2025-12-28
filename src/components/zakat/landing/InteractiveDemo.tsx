import { useState, useEffect, useRef, useCallback } from "react";
import { FileText, Check, Loader2, Play } from "lucide-react";
import { formatCurrency } from "@/lib/zakatCalculations";
import { Button } from "@/components/ui/button";

// Animation phases
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
  | "zakat-split"
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

export function InteractiveDemo() {
  // Start with completed state - show the final result immediately
  const [phase, setPhase] = useState<AnimationPhase>("complete");
  const [showWatchOverlay, setShowWatchOverlay] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Typed values
  const typedCash = useTypingAnimation("$24,500", phase === "typing-cash", 100);
  const typedFilename = useTypingAnimation("Chase_Statement.pdf", phase === "upload-typing", 50);
  
  // Animation sequence controller - only runs when user triggers it
  useEffect(() => {
    if (phase === "idle" || phase === "complete") return;
    
    const timers: NodeJS.Timeout[] = [];
    
    // Phase 1: Start typing cash value (0-2s)
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
      timers.push(setTimeout(() => setPhase("zakat-split"), 1500));
    }
    if (phase === "zakat-split") {
      timers.push(setTimeout(() => {
        setPhase("complete");
        setShowWatchOverlay(true);
      }, 1500));
    }
    
    return () => timers.forEach(clearTimeout);
  }, [phase, animationKey]);
  
  // Start the animation sequence
  const handleWatchAnimation = useCallback(() => {
    setShowWatchOverlay(false);
    setPhase("idle");
    // Small delay then start
    setTimeout(() => {
      setPhase("typing-cash");
      setAnimationKey(prev => prev + 1);
    }, 100);
  }, []);
  
  const isAnimating = phase !== "complete" && phase !== "idle";
  const showCashInput = phase !== "idle" && phase !== "complete" ? true : phase === "complete";
  const showUpload = ["upload-start", "upload-typing", "upload-processing", "upload-complete", "aggregating", "sankey-reveal", "zakat-split", "complete"].includes(phase);
  const showAggregation = ["aggregating", "sankey-reveal", "zakat-split", "complete"].includes(phase);
  const showSankey = ["sankey-reveal", "zakat-split", "complete"].includes(phase);
  const showZakatSplit = ["zakat-split", "complete"].includes(phase);
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-md mx-auto"
    >
      {/* Glassmorphic card effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl" />
      
      <div className="relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-4 sm:p-5 shadow-lg overflow-hidden">
        {/* Watch Animation Overlay */}
        {showWatchOverlay && phase === "complete" && (
          <div 
            className="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-10 flex items-center justify-center cursor-pointer transition-opacity hover:bg-background/50"
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
          </div>
        )}
        
        {/* Header */}
        <div className="text-center mb-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Your Zakat Due</p>
          <div className="h-10 flex items-center justify-center">
            {showZakatSplit || phase === "complete" ? (
              <div className="flex items-center gap-3 animate-fade-in">
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold text-primary">
                    {formatCurrency(DEMO_DATA.conservativeZakat, "USD")}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Conservative</p>
                </div>
                <div className="h-6 w-px bg-border" />
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold text-primary/70">
                    {formatCurrency(DEMO_DATA.optimizedZakat, "USD")}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Optimized</p>
                </div>
              </div>
            ) : showSankey ? (
              <p className="text-2xl sm:text-3xl font-bold text-primary animate-fade-in">
                {formatCurrency(DEMO_DATA.conservativeZakat, "USD")}
              </p>
            ) : (
              <p className="text-2xl sm:text-3xl font-bold text-muted-foreground/30">—</p>
            )}
          </div>
        </div>
        
        {/* Animation Stages Container - More compact */}
        <div className="space-y-2 min-h-[160px]">
          {/* Stage 1: Manual Input */}
          <div 
            className={`transition-all duration-500 ${
              showCashInput ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="bg-muted/50 rounded-lg p-2.5 border border-border">
              <label className="text-[10px] text-muted-foreground mb-0.5 block">Cash & Savings</label>
              <div className="flex items-center">
                <span className="text-base font-semibold text-foreground">
                  {phase === "complete" ? "$24,500" : typedCash}
                  <span className={`inline-block w-0.5 h-4 bg-primary ml-0.5 ${
                    phase === "typing-cash" ? "animate-pulse" : "opacity-0"
                  }`} />
                </span>
              </div>
            </div>
          </div>
          
          {/* Stage 2: Document Upload */}
          <div 
            className={`transition-all duration-500 ${
              showUpload ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="bg-muted/50 rounded-lg p-2.5 border border-border">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  phase === "upload-complete" || phase === "complete" ? "bg-primary/20" : "bg-muted"
                }`}>
                  {phase === "upload-processing" ? (
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  ) : phase === "upload-complete" || showAggregation || phase === "complete" ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <FileText className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {phase === "complete" ? "Chase_Statement.pdf" : typedFilename}
                    <span className={`inline-block w-0.5 h-3 bg-primary ml-0.5 ${
                      phase === "upload-typing" ? "animate-pulse" : "opacity-0"
                    }`} />
                  </p>
                  <p className={`text-[10px] transition-colors ${
                    phase === "upload-complete" || showAggregation || phase === "complete"
                      ? "text-primary" 
                      : "text-muted-foreground"
                  }`}>
                    {phase === "upload-processing" 
                      ? "Extracting..." 
                      : phase === "upload-complete" || showAggregation || phase === "complete"
                        ? `✓ Extracted ${formatCurrency(DEMO_DATA.investmentsExtracted, "USD")} investments`
                        : "Bank statement"
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stage 3: Asset Aggregation Animation */}
          <div 
            className={`transition-all duration-700 ${
              showAggregation || phase === "complete" ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            {showSankey || phase === "complete" ? (
              <AnimatedSankeyChart 
                showZakatSplit={showZakatSplit || phase === "complete"}
                isAnimating={isAnimating}
              />
            ) : (
              <div className="flex justify-center py-3">
                <div className="flex items-center gap-2">
                  {[
                    { color: ASSET_COLORS.cash, delay: "0ms" },
                    { color: ASSET_COLORS.investments, delay: "100ms" },
                    { color: ASSET_COLORS.retirement, delay: "200ms" },
                    { color: ASSET_COLORS.other, delay: "300ms" },
                  ].map((asset, i) => (
                    <div
                      key={i}
                      className="w-2.5 h-2.5 rounded-full animate-pulse"
                      style={{ 
                        backgroundColor: asset.color,
                        animationDelay: asset.delay,
                      }}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-2">Calculating...</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Summary row */}
        <div className={`pt-3 border-t border-border flex justify-between items-center text-sm transition-opacity duration-500 ${
          showSankey || phase === "complete" ? "opacity-100" : "opacity-50"
        }`}>
          <div className="flex-1">
            <span className="text-xs text-muted-foreground">Net Zakatable Wealth</span>
          </div>
          <span className="font-semibold text-foreground text-sm">
            {showSankey || phase === "complete" ? formatCurrency(DEMO_DATA.netZakatable, "USD") : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}

// Simplified animated Sankey chart for the demo
function AnimatedSankeyChart({ 
  showZakatSplit, 
  isAnimating 
}: { 
  showZakatSplit: boolean;
  isAnimating: boolean;
}) {
  const width = 300;
  const height = 130;
  const nodeWidth = 8;
  const leftPadding = 6;
  const rightPadding = 6;
  
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
  
  // Zakat nodes (right side)
  const zakatX = width - rightPadding - nodeWidth;
  
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

  // Animation classes only when actively animating
  const nodeClass = isAnimating ? "sankey-node" : "";
  const pathClass = isAnimating ? "sankey-path" : "";
  const labelClass = isAnimating ? "sankey-label" : "";
  
  return (
    <div className="flex justify-center py-0.5">
      <svg width={width} height={height} className="overflow-visible">
        {isAnimating && (
          <style>{`
            .sankey-path {
              animation: sankey-draw 0.8s ease-out forwards;
            }
            .sankey-node {
              animation: sankey-appear 0.4s ease-out forwards;
            }
            .sankey-label {
              animation: sankey-fade 0.4s ease-out forwards;
            }
            @keyframes sankey-draw {
              0% { opacity: 0; }
              100% { opacity: 1; }
            }
            @keyframes sankey-appear {
              0% { opacity: 0; transform: scaleY(0); }
              100% { opacity: 1; transform: scaleY(1); }
            }
            @keyframes sankey-fade {
              0% { opacity: 0; }
              100% { opacity: 1; }
            }
          `}</style>
        )}
        
        {/* Asset nodes (left) */}
        {assetNodes.map((asset, i) => {
          const flowThickness = Math.max(5, (asset.value / totalAssets) * 32);
          const endY = centerY + (i + 0.5) * (centerHeight / assetNodes.length);
          
          return (
            <g key={asset.name}>
              <rect
                x={leftPadding}
                y={asset.y}
                width={nodeWidth}
                height={asset.height}
                rx={2}
                fill={asset.color}
                className={nodeClass}
                style={isAnimating ? { 
                  animationDelay: `${i * 80}ms`,
                  transformOrigin: `${leftPadding + nodeWidth/2}px ${asset.y + asset.height/2}px`
                } : undefined}
              />
              {/* Flow to center */}
              <path
                d={generatePath(
                  leftPadding + nodeWidth,
                  asset.y + asset.height / 2,
                  centerX,
                  endY,
                  flowThickness
                )}
                fill={asset.color}
                fillOpacity={0.25}
                className={pathClass}
                style={isAnimating ? { animationDelay: `${250 + i * 80}ms` } : undefined}
              />
            </g>
          );
        })}
        
        {/* Center node (Net Zakatable) */}
        <rect
          x={centerX}
          y={centerY}
          width={nodeWidth}
          height={centerHeight}
          rx={2}
          fill={ASSET_COLORS.net}
          className={nodeClass}
          style={isAnimating ? { animationDelay: "350ms", transformOrigin: `${centerX + nodeWidth/2}px ${centerY + centerHeight/2}px` } : undefined}
        />
        
        {/* Flow to Zakat */}
        {showZakatSplit ? (
          // Split into two zakat outputs
          <>
            {/* Conservative flow */}
            <path
              d={generatePath(
                centerX + nodeWidth,
                centerY + centerHeight * 0.35,
                zakatX,
                35,
                12
              )}
              fill={ASSET_COLORS.zakat}
              fillOpacity={0.35}
              className={pathClass}
              style={isAnimating ? { animationDelay: "500ms" } : undefined}
            />
            <rect
              x={zakatX}
              y={24}
              width={nodeWidth}
              height={22}
              rx={2}
              fill={ASSET_COLORS.zakat}
              className={nodeClass}
              style={isAnimating ? { animationDelay: "600ms", transformOrigin: `${zakatX + nodeWidth/2}px 35px` } : undefined}
            />
            
            {/* Optimized flow (smaller) */}
            <path
              d={generatePath(
                centerX + nodeWidth,
                centerY + centerHeight * 0.65,
                zakatX,
                78,
                10
              )}
              fill={ASSET_COLORS.zakat}
              fillOpacity={0.2}
              className={pathClass}
              style={isAnimating ? { animationDelay: "700ms" } : undefined}
            />
            <rect
              x={zakatX}
              y={68}
              width={nodeWidth}
              height={20}
              rx={2}
              fill={ASSET_COLORS.zakat}
              opacity={0.6}
              className={nodeClass}
              style={isAnimating ? { animationDelay: "800ms", transformOrigin: `${zakatX + nodeWidth/2}px 78px` } : undefined}
            />
            
            {/* Right-side labels */}
            <text
              x={zakatX - 3}
              y={32}
              textAnchor="end"
              className={`fill-foreground text-[8px] font-medium ${labelClass}`}
              style={isAnimating ? { animationDelay: "650ms" } : undefined}
            >
              Conservative
            </text>
            <text
              x={zakatX - 3}
              y={41}
              textAnchor="end"
              className={`fill-muted-foreground text-[7px] ${labelClass}`}
              style={isAnimating ? { animationDelay: "650ms" } : undefined}
            >
              $3,346
            </text>
            <text
              x={zakatX - 3}
              y={75}
              textAnchor="end"
              className={`fill-muted-foreground text-[8px] ${labelClass}`}
              style={isAnimating ? { animationDelay: "850ms" } : undefined}
            >
              Optimized
            </text>
            <text
              x={zakatX - 3}
              y={84}
              textAnchor="end"
              className={`fill-muted-foreground text-[7px] ${labelClass}`}
              style={isAnimating ? { animationDelay: "850ms" } : undefined}
            >
              $2,391
            </text>
          </>
        ) : (
          // Single zakat output
          <>
            <path
              d={generatePath(
                centerX + nodeWidth,
                centerY + centerHeight / 2,
                zakatX,
                height / 2,
                16
              )}
              fill={ASSET_COLORS.zakat}
              fillOpacity={0.35}
              className={pathClass}
              style={isAnimating ? { animationDelay: "500ms" } : undefined}
            />
            <rect
              x={zakatX}
              y={height / 2 - 14}
              width={nodeWidth}
              height={28}
              rx={2}
              fill={ASSET_COLORS.zakat}
              className={nodeClass}
              style={isAnimating ? { animationDelay: "600ms", transformOrigin: `${zakatX + nodeWidth/2}px ${height/2}px` } : undefined}
            />
          </>
        )}
        
        {/* Center node label */}
        <text
          x={centerX + nodeWidth / 2}
          y={height - 3}
          textAnchor="middle"
          className={`fill-muted-foreground text-[7px] ${labelClass}`}
          style={isAnimating ? { animationDelay: "400ms" } : undefined}
        >
          Net Zakatable
        </text>
      </svg>
    </div>
  );
}

export default InteractiveDemo;
