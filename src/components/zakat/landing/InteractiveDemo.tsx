import { useState, useEffect, useRef, useCallback } from "react";
import { FileText, Check, Loader2, RefreshCw } from "lucide-react";
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
  const [phase, setPhase] = useState<AnimationPhase>("idle");
  const [isVisible, setIsVisible] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  
  // Typed values
  const typedCash = useTypingAnimation("$24,500", phase === "typing-cash", 100);
  const typedFilename = useTypingAnimation("Chase_Statement.pdf", phase === "upload-typing", 50);
  
  // Intersection observer to trigger animation when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            setIsVisible(true);
            hasAnimated.current = true;
          }
        });
      },
      { threshold: 0.3 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  // Animation sequence controller
  useEffect(() => {
    if (!isVisible) return;
    
    const timers: NodeJS.Timeout[] = [];
    
    // Phase 1: Start typing cash value (0-2s)
    timers.push(setTimeout(() => setPhase("typing-cash"), 500));
    timers.push(setTimeout(() => setPhase("typed-cash"), 2000));
    
    // Phase 2: Document upload (2-4.5s)
    timers.push(setTimeout(() => setPhase("upload-start"), 2500));
    timers.push(setTimeout(() => setPhase("upload-typing"), 2800));
    timers.push(setTimeout(() => setPhase("upload-processing"), 4200));
    timers.push(setTimeout(() => setPhase("upload-complete"), 5000));
    
    // Phase 3: Aggregation (5-6s)
    timers.push(setTimeout(() => setPhase("aggregating"), 5500));
    
    // Phase 4: Sankey reveal (6-8s)
    timers.push(setTimeout(() => setPhase("sankey-reveal"), 6500));
    
    // Phase 5: Zakat split reveal (8-10s)
    timers.push(setTimeout(() => setPhase("zakat-split"), 8000));
    
    // Complete
    timers.push(setTimeout(() => setPhase("complete"), 9500));
    
    return () => timers.forEach(clearTimeout);
  }, [isVisible, animationKey]);
  
  // Replay animation
  const handleReplay = useCallback(() => {
    setPhase("idle");
    setIsVisible(false);
    hasAnimated.current = false;
    
    // Trigger restart after a brief delay
    setTimeout(() => {
      setIsVisible(true);
      hasAnimated.current = true;
      setAnimationKey(prev => prev + 1);
    }, 100);
  }, []);
  
  const showCashInput = phase !== "idle";
  const showUpload = ["upload-start", "upload-typing", "upload-processing", "upload-complete", "aggregating", "sankey-reveal", "zakat-split", "complete"].includes(phase);
  const showAggregation = ["aggregating", "sankey-reveal", "zakat-split", "complete"].includes(phase);
  const showSankey = ["sankey-reveal", "zakat-split", "complete"].includes(phase);
  const showZakatSplit = ["zakat-split", "complete"].includes(phase);
  const showReplay = phase === "complete";
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-md mx-auto"
    >
      {/* Glassmorphic card effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl" />
      
      <div className="relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-4 sm:p-6 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="text-center mb-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Your Zakat Due</p>
          <div className="h-10 flex items-center justify-center">
            {showZakatSplit ? (
              <div className="flex items-center gap-3 animate-fade-in">
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-primary">
                    {formatCurrency(DEMO_DATA.conservativeZakat, "USD")}
                  </p>
                  <p className="text-xs text-muted-foreground">Conservative</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-primary/70">
                    {formatCurrency(DEMO_DATA.optimizedZakat, "USD")}
                  </p>
                  <p className="text-xs text-muted-foreground">Optimized</p>
                </div>
              </div>
            ) : showSankey ? (
              <p className="text-3xl sm:text-4xl font-bold text-primary animate-fade-in">
                {formatCurrency(DEMO_DATA.conservativeZakat, "USD")}
              </p>
            ) : (
              <p className="text-3xl sm:text-4xl font-bold text-muted-foreground/30">—</p>
            )}
          </div>
          {showZakatSplit && (
            <p className="text-xs text-muted-foreground mt-1 animate-fade-in">
              2.5% of zakatable wealth
            </p>
          )}
        </div>
        
        {/* Animation Stages Container */}
        <div className="space-y-3 min-h-[200px]">
          {/* Stage 1: Manual Input */}
          <div 
            className={`transition-all duration-500 ${
              showCashInput ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="bg-muted/50 rounded-lg p-3 border border-border">
              <label className="text-xs text-muted-foreground mb-1 block">Cash & Savings</label>
              <div className="flex items-center">
                <span className="text-lg font-semibold text-foreground">
                  {typedCash}
                  <span className={`inline-block w-0.5 h-5 bg-primary ml-0.5 ${
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
            <div className="bg-muted/50 rounded-lg p-3 border border-border">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  phase === "upload-complete" ? "bg-primary/20" : "bg-muted"
                }`}>
                  {phase === "upload-processing" ? (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  ) : phase === "upload-complete" || showAggregation ? (
                    <Check className="w-5 h-5 text-primary animate-scale-in" />
                  ) : (
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {typedFilename}
                    <span className={`inline-block w-0.5 h-4 bg-primary ml-0.5 ${
                      phase === "upload-typing" ? "animate-pulse" : "opacity-0"
                    }`} />
                  </p>
                  <p className={`text-xs transition-colors ${
                    phase === "upload-complete" || showAggregation 
                      ? "text-primary" 
                      : "text-muted-foreground"
                  }`}>
                    {phase === "upload-processing" 
                      ? "Extracting..." 
                      : phase === "upload-complete" || showAggregation
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
              showAggregation ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            {showSankey ? (
              <AnimatedSankeyChart 
                showZakatSplit={showZakatSplit}
                isAnimating={phase === "sankey-reveal"}
              />
            ) : (
              <div className="flex justify-center py-4">
                <div className="flex items-center gap-2">
                  {[
                    { color: ASSET_COLORS.cash, delay: "0ms" },
                    { color: ASSET_COLORS.investments, delay: "100ms" },
                    { color: ASSET_COLORS.retirement, delay: "200ms" },
                    { color: ASSET_COLORS.other, delay: "300ms" },
                  ].map((asset, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-full animate-pulse"
                      style={{ 
                        backgroundColor: asset.color,
                        animationDelay: asset.delay,
                      }}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">Calculating...</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Summary row with replay button */}
        <div className={`pt-4 border-t border-border flex justify-between items-center text-sm transition-opacity duration-500 ${
          showSankey ? "opacity-100" : "opacity-50"
        }`}>
          <div className="flex-1">
            <span className="text-muted-foreground">Net Zakatable Wealth</span>
          </div>
          <span className="font-semibold text-foreground">
            {showSankey ? formatCurrency(DEMO_DATA.netZakatable, "USD") : "—"}
          </span>
          {showReplay && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReplay}
              className="ml-2 h-7 w-7 text-muted-foreground hover:text-foreground"
              aria-label="Replay animation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          )}
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
  const width = 320;
  const height = 160;
  const nodeWidth = 10;
  const leftPadding = 8;
  const rightPadding = 8;
  
  // Calculate total assets for proportional sizing
  const assets = [
    { name: "Cash", value: DEMO_DATA.cashValue, color: ASSET_COLORS.cash },
    { name: "Investments", value: DEMO_DATA.investmentsExtracted, color: ASSET_COLORS.investments },
    { name: "Retirement", value: DEMO_DATA.retirementValue, color: ASSET_COLORS.retirement },
    { name: "Other", value: DEMO_DATA.otherAssets, color: ASSET_COLORS.other },
  ];
  
  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
  
  // Calculate asset node heights and positions proportionally
  const assetSpacing = 6;
  const availableHeight = height - 20;
  let currentY = 10;
  
  const assetNodes = assets.map((asset) => {
    const nodeHeight = Math.max(16, (asset.value / totalAssets) * (availableHeight - assetSpacing * 3));
    const node = { ...asset, y: currentY, height: nodeHeight };
    currentY += nodeHeight + assetSpacing;
    return node;
  });
  
  // Center node (Net Zakatable)
  const centerX = width * 0.48;
  const centerY = 15;
  const centerHeight = height - 35;
  
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
  
  return (
    <div className="flex justify-center py-1">
      <svg width={width} height={height} className="overflow-visible">
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
        
        {/* Asset nodes (left) */}
        {assetNodes.map((asset, i) => {
          const flowThickness = Math.max(6, (asset.value / totalAssets) * 40);
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
                className="sankey-node"
                style={{ 
                  animationDelay: `${i * 80}ms`,
                  transformOrigin: `${leftPadding + nodeWidth/2}px ${asset.y + asset.height/2}px`
                }}
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
                className="sankey-path"
                style={{ animationDelay: `${250 + i * 80}ms` }}
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
          className="sankey-node"
          style={{ animationDelay: "350ms", transformOrigin: `${centerX + nodeWidth/2}px ${centerY + centerHeight/2}px` }}
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
                45,
                16
              )}
              fill={ASSET_COLORS.zakat}
              fillOpacity={0.35}
              className="sankey-path"
              style={{ animationDelay: "500ms" }}
            />
            <rect
              x={zakatX}
              y={30}
              width={nodeWidth}
              height={30}
              rx={2}
              fill={ASSET_COLORS.zakat}
              className="sankey-node"
              style={{ animationDelay: "600ms", transformOrigin: `${zakatX + nodeWidth/2}px 45px` }}
            />
            
            {/* Optimized flow (smaller) */}
            <path
              d={generatePath(
                centerX + nodeWidth,
                centerY + centerHeight * 0.65,
                zakatX,
                100,
                12
              )}
              fill={ASSET_COLORS.zakat}
              fillOpacity={0.2}
              className="sankey-path"
              style={{ animationDelay: "700ms" }}
            />
            <rect
              x={zakatX}
              y={88}
              width={nodeWidth}
              height={24}
              rx={2}
              fill={ASSET_COLORS.zakat}
              opacity={0.6}
              className="sankey-node"
              style={{ animationDelay: "800ms", transformOrigin: `${zakatX + nodeWidth/2}px 100px` }}
            />
            
            {/* Right-side labels */}
            <text
              x={zakatX - 4}
              y={42}
              textAnchor="end"
              className="fill-foreground text-[9px] font-medium sankey-label"
              style={{ animationDelay: "650ms" }}
            >
              Conservative
            </text>
            <text
              x={zakatX - 4}
              y={53}
              textAnchor="end"
              className="fill-muted-foreground text-[8px] sankey-label"
              style={{ animationDelay: "650ms" }}
            >
              $3,346
            </text>
            <text
              x={zakatX - 4}
              y={97}
              textAnchor="end"
              className="fill-muted-foreground text-[9px] sankey-label"
              style={{ animationDelay: "850ms" }}
            >
              Optimized
            </text>
            <text
              x={zakatX - 4}
              y={108}
              textAnchor="end"
              className="fill-muted-foreground text-[8px] sankey-label"
              style={{ animationDelay: "850ms" }}
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
                20
              )}
              fill={ASSET_COLORS.zakat}
              fillOpacity={0.35}
              className="sankey-path"
              style={{ animationDelay: "500ms" }}
            />
            <rect
              x={zakatX}
              y={height / 2 - 18}
              width={nodeWidth}
              height={36}
              rx={2}
              fill={ASSET_COLORS.zakat}
              className="sankey-node"
              style={{ animationDelay: "600ms", transformOrigin: `${zakatX + nodeWidth/2}px ${height/2}px` }}
            />
          </>
        )}
        
        {/* Center node label */}
        <text
          x={centerX + nodeWidth / 2}
          y={height - 4}
          textAnchor="middle"
          className="fill-muted-foreground text-[8px] sankey-label"
          style={{ animationDelay: "400ms" }}
        >
          Net Zakatable
        </text>
      </svg>
    </div>
  );
}

export default InteractiveDemo;
