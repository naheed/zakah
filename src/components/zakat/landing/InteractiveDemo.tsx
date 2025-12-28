import { useState, useEffect, useRef, useCallback } from "react";
import { FileText, Check, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/zakatCalculations";

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
  }, [isVisible]);
  
  // Reset animation when scrolling away and back
  const resetAnimation = useCallback(() => {
    hasAnimated.current = false;
    setPhase("idle");
    setIsVisible(false);
  }, []);
  
  const showCashInput = phase !== "idle";
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
        <div className="space-y-3 min-h-[220px]">
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
        
        {/* Summary row */}
        <div className={`pt-4 border-t border-border flex justify-between text-sm transition-opacity duration-500 ${
          showSankey ? "opacity-100" : "opacity-50"
        }`}>
          <span className="text-muted-foreground">Net Zakatable Wealth</span>
          <span className="font-semibold text-foreground">
            {showSankey ? formatCurrency(DEMO_DATA.netZakatable, "USD") : "—"}
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
  const width = 280;
  const height = 140;
  const nodeWidth = 12;
  const padding = 20;
  
  // Asset nodes (left side)
  const assets = [
    { name: "Cash", value: DEMO_DATA.cashValue, color: ASSET_COLORS.cash, y: 10 },
    { name: "Investments", value: DEMO_DATA.investmentsExtracted, color: ASSET_COLORS.investments, y: 40 },
    { name: "Retirement", value: DEMO_DATA.retirementValue, color: ASSET_COLORS.retirement, y: 70 },
    { name: "Other", value: DEMO_DATA.otherAssets, color: ASSET_COLORS.other, y: 100 },
  ];
  
  // Center node (Net Zakatable)
  const centerX = width * 0.45;
  const centerY = 10;
  const centerHeight = 120;
  
  // Zakat nodes (right side)
  const zakatX = width - padding - nodeWidth;
  const zakatY = 35;
  
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
  
  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
  
  return (
    <div className="flex justify-center py-2">
      <svg width={width} height={height} className="overflow-visible">
        <style>{`
          .sankey-path {
            animation: sankey-draw 0.8s ease-out forwards;
          }
          .sankey-node {
            animation: sankey-appear 0.4s ease-out forwards;
          }
          @keyframes sankey-draw {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          @keyframes sankey-appear {
            0% { opacity: 0; transform: scaleY(0); }
            100% { opacity: 1; transform: scaleY(1); }
          }
        `}</style>
        
        {/* Asset nodes (left) */}
        {assets.map((asset, i) => {
          const nodeHeight = Math.max(20, (asset.value / totalAssets) * 100);
          return (
            <g key={asset.name}>
              <rect
                x={padding}
                y={asset.y}
                width={nodeWidth}
                height={nodeHeight}
                rx={3}
                fill={asset.color}
                className="sankey-node"
                style={{ 
                  animationDelay: `${i * 100}ms`,
                  transformOrigin: `${padding + nodeWidth/2}px ${asset.y + nodeHeight/2}px`
                }}
              />
              {/* Flow to center */}
              <path
                d={generatePath(
                  padding + nodeWidth,
                  asset.y + nodeHeight / 2,
                  centerX,
                  centerY + (i + 0.5) * (centerHeight / assets.length),
                  Math.max(8, (asset.value / totalAssets) * 50)
                )}
                fill={asset.color}
                fillOpacity={0.3}
                className="sankey-path"
                style={{ animationDelay: `${300 + i * 100}ms` }}
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
          rx={3}
          fill={ASSET_COLORS.net}
          className="sankey-node"
          style={{ animationDelay: "400ms" }}
        />
        
        {/* Flow to Zakat */}
        {showZakatSplit ? (
          // Split into two zakat outputs
          <>
            {/* Conservative flow */}
            <path
              d={generatePath(
                centerX + nodeWidth,
                centerY + centerHeight * 0.3,
                zakatX,
                zakatY,
                20
              )}
              fill={ASSET_COLORS.zakat}
              fillOpacity={0.4}
              className="sankey-path"
              style={{ animationDelay: "600ms" }}
            />
            <rect
              x={zakatX}
              y={zakatY - 5}
              width={nodeWidth}
              height={30}
              rx={3}
              fill={ASSET_COLORS.zakat}
              className="sankey-node"
              style={{ animationDelay: "700ms" }}
            />
            
            {/* Optimized flow (smaller) */}
            <path
              d={generatePath(
                centerX + nodeWidth,
                centerY + centerHeight * 0.7,
                zakatX,
                zakatY + 55,
                14
              )}
              fill={ASSET_COLORS.zakat}
              fillOpacity={0.25}
              className="sankey-path"
              style={{ animationDelay: "800ms" }}
            />
            <rect
              x={zakatX}
              y={zakatY + 45}
              width={nodeWidth}
              height={22}
              rx={3}
              fill={ASSET_COLORS.zakat}
              opacity={0.6}
              className="sankey-node"
              style={{ animationDelay: "900ms" }}
            />
            
            {/* Labels */}
            <text
              x={zakatX + nodeWidth + 6}
              y={zakatY + 8}
              className="fill-foreground text-[9px] font-medium"
            >
              Conservative
            </text>
            <text
              x={zakatX + nodeWidth + 6}
              y={zakatY + 60}
              className="fill-muted-foreground text-[9px]"
            >
              Optimized
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
                zakatY + 20,
                25
              )}
              fill={ASSET_COLORS.zakat}
              fillOpacity={0.4}
              className="sankey-path"
              style={{ animationDelay: "600ms" }}
            />
            <rect
              x={zakatX}
              y={zakatY}
              width={nodeWidth}
              height={40}
              rx={3}
              fill={ASSET_COLORS.zakat}
              className="sankey-node"
              style={{ animationDelay: "700ms" }}
            />
          </>
        )}
        
        {/* Node labels */}
        <text
          x={centerX + nodeWidth / 2}
          y={centerY + centerHeight + 12}
          textAnchor="middle"
          className="fill-muted-foreground text-[8px]"
        >
          Net Zakatable
        </text>
      </svg>
    </div>
  );
}

export default InteractiveDemo;
