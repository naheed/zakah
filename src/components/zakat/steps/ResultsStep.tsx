import { ZakatFormData, formatCurrency, formatPercent, Madhab, EnhancedAssetBreakdown, createZakatReport } from "@/lib/zakatCalculations";
import { StepHeader } from "../StepHeader";
import { InfoCard } from "../InfoCard";
import { Button } from "@/components/ui/button";
import { CheckCircle, WarningCircle, DownloadSimple, ArrowCounterClockwise, GearSix, FloppyDisk, SignIn, ShareNetwork, CaretDown, CaretUp, PencilSimple, EnvelopeSimple, WhatsappLogo, XLogo, FacebookLogo, Copy, Check, Heart, Sparkle, Users, Warning } from "@phosphor-icons/react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useRef } from "react";
import { CharityRecommendations } from "../CharityRecommendations";
import { YearOverYearChart } from "../YearOverYearChart";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { generateCSV } from "@/lib/csvExport";
import { generateZakatPDFV2 } from "@/components/zakat/ZakatPDFDocumentV2";
import { ZakatSankeyChart } from "../ZakatSankeyChart";
import { useTrackCalculation } from "@/hooks/useTrackCalculation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useReferral } from "@/hooks/useReferral";
import { useSavedCalculations } from "@/hooks/useSavedCalculations";
import { useZakatPersistence } from "@/hooks/useZakatPersistence";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Confetti, useConfetti } from "@/components/ui/confetti";
import { NumberTicker } from "@/components/ui/number-ticker";
import { ReportHeader } from "../report/ReportHeader";
import { ReportHero } from "../report/ReportHero";
import { ReportAssetTable } from "../report/ReportAssetTable";
import { ReportFooter } from "../report/ReportFooter";
import { Card } from "@/components/ui/card"; // Assuming Card is available or standard div is fine
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SaveCalculationDialog } from "../SaveCalculationDialog";
import { MethodologySelector } from "../MethodologySelector";
import { getModeDisplayName } from "@/lib/madhahRules";

interface ResultsStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
  calculations: {
    totalAssets: number;
    totalLiabilities: number;
    netZakatableWealth: number;
    nisab: number;
    isAboveNisab: boolean;
    zakatDue: number;
    zakatRate: number;
    interestToPurify: number;
    dividendsToPurify: number;
    assetBreakdown: {
      liquidAssets: number;
      investments: number;
      retirement: number;
      realEstate: number;
      business: number;
      otherAssets: number;
      exemptAssets: number;
    };
    enhancedBreakdown: EnhancedAssetBreakdown;
  };
  calculationName?: string;
  savedCalculationId?: string;
  onCalculationSaved?: (id: string) => void;
  onEditCalculation?: () => void;
}

export function ResultsStep({
  data,
  updateData,
  calculations,
  calculationName,
  savedCalculationId,
  onCalculationSaved,
  onEditCalculation
}: ResultsStepProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showSettings, setShowSettings] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [breakdownOpen, setBreakdownOpen] = useState(!isMobile);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const { trackCalculation } = useTrackCalculation();
  const { calculations: savedCalculations, refreshCalculations } = useSavedCalculations();
  const [charityOpen, setCharityOpen] = useState(false);
  const [trendOpen, setTrendOpen] = useState(false);
  const { currency } = data;
  const {
    totalAssets,
    totalLiabilities,
    netZakatableWealth,
    nisab,
    isAboveNisab,
    zakatDue,
    zakatRate,
    interestToPurify,
    dividendsToPurify,
    assetBreakdown,
    enhancedBreakdown,
  } = calculations;
  // useReferral hook for stats
  const { stats, fetchStats, referralCode } = useReferral();
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const totalPurification = interestToPurify + dividendsToPurify;

  // Trigger confetti on mount if above nisab
  // Disabled per design review to reduce visual noise
  const showConfetti = false; // useConfetti(isAboveNisab);

  // Track anonymous usage metrics when results are shown
  useEffect(() => {
    trackCalculation({ totalAssets, zakatDue });
  }, [totalAssets, zakatDue, trackCalculation]);

  // Fetch saved calculations for YoY chart
  useEffect(() => {
    if (user) {
      refreshCalculations();
    }
  }, [user, refreshCalculations]);

  const { markReportReady, savedCalculationId: contextSavedCalculationId, setSavedCalculationId } = useZakatPersistence();
  const { saveCalculation, updateCalculation } = useSavedCalculations();
  const saveAttempted = useRef(false);

  // Use prop if available (legacy/prop-drilling), otherwise context
  const activeSavedId = savedCalculationId || contextSavedCalculationId;

  // Mark report as ready and Auto-Save when viewing results
  useEffect(() => {
    // 1. Mark ready (UI state)
    markReportReady();

    // 2. Auto-Save Logic (Unified for Guest & User)
    const performAutoSave = async () => {
      if (saveAttempted.current) return;
      saveAttempted.current = true;

      const yearValue = new Date().getFullYear();
      const yearType = 'gregorian';
      const defaultName = `Calculation ${new Date().toLocaleDateString()}`;

      try {
        if (activeSavedId) {
          // Update existing
          console.debug('[AutoSave] Updating existing calculation:', activeSavedId);
          await updateCalculation(activeSavedId, data, calculationName);
        } else {
          // Create new
          console.debug('[AutoSave] Creating new calculation');
          const result = await saveCalculation(calculationName || defaultName, yearType, yearValue, data);
          if (result?.id) {
            setSavedCalculationId(result.id);
          }
        }
      } catch (e) {
        console.error('[AutoSave] Failed:', e);
      }
    };

    performAutoSave();

  }, [markReportReady, activeSavedId, setSavedCalculationId, saveCalculation, updateCalculation, data, calculationName]);

  const handleSignIn = () => {
    navigate('/auth');
  };

  const handleDownload = async () => {
    setIsGeneratingPDF(true);
    try {
      // Create unified report object using imported factory
      const report = createZakatReport(data, calculations, referralCode || undefined);

      // Use V2 PDF generator with unified object
      await generateZakatPDFV2(report, calculationName, user?.email?.split('@')[0]);
      toast({
        title: "PDF Downloaded",
        description: "Your Zakat calculation report has been downloaded.",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      const details = error instanceof Error ? error.message : String(error);
      toast({
        title: "Download Failed",
        description: details
          ? `PDF error: ${details}`
          : "There was an error generating your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleReset = () => {
    window.location.reload();
  };

  const handleDownloadCSV = () => {
    // Create unified report object using imported factory
    const report = createZakatReport(data, calculations, referralCode || undefined);

    generateCSV(report, `zakat-report-${new Date().toISOString().split('T')[0]}.csv`);
    toast({
      title: "CSV Exported",
      description: "Your calculation data has been downloaded."
    });
  };

  const handleEdit = () => {
    if (onEditCalculation) {
      onEditCalculation();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Confetti celebration for above nisab */}
      <Confetti isActive={showConfetti} />

      {/* 1. Context Toolbar / Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/30 p-4 rounded-xl border border-border">
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Zakat Calculation Results</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground bg-white dark:bg-card border border-border px-2 py-0.5 rounded shadow-sm">
              {getModeDisplayName(data.madhab)} Mode
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2">
            {/* Primary Action: Download PDF */}
            <Button
              onClick={handleDownload}
              disabled={isGeneratingPDF}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
            >
              {isGeneratingPDF ? (
                <ArrowCounterClockwise className="w-4 h-4 animate-spin" />
              ) : (
                <DownloadSimple className="w-4 h-4" />
              )}
              {isGeneratingPDF ? 'Generating...' : 'Download Report'}
            </Button>

            {/* Secondary Actions: Dropdown */}
            {/* Note: Dropdown components need to be imported correctly above from @/components/ui/dropdown-menu */}
            {/* Assuming they are global or handled by the import fixes */}
            {/* Re-adding dropped imports for UI components since I overwrote header */}
            {/* Wait, the imports were combined in my write. Let's ensure correct structure. */}
            {/* The previous import block was:
                import {
                  DropdownMenu, ...
                } from "@/components/ui/dropdown-menu";
                
                My write block combined them into alert-dialog import which is WRONG.
                I need to fix the imports in this write.
             */}
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="w-10 px-0" onClick={handleDownloadCSV} title="Export CSV">
                <FloppyDisk className="h-4 w-4" />
              </Button>
              {/* Simplified for robustness - if dropdown fails, basic buttons verify functionality */}
              <Button variant="outline" size="icon" className="w-10 px-0" onClick={handleReset} title="Reset">
                <ArrowCounterClockwise className="h-4 w-4" />
              </Button>
            </div>

            {/* Hidden Trigger for Save Dialog to integrate with Dropdown */}
            {user && (
              <div className="hidden">
                <SaveCalculationDialog
                  formData={data}
                  onSaved={onCalculationSaved}
                  trigger={<button id="save-calc-trigger">Trigger</button>}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. The Report "Paper" */}
      <div className="bg-white dark:bg-card shadow-xl shadow-muted/20 rounded-[2rem] p-6 md:p-12 border border-border relative overflow-hidden">
        {/* Decorative Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary" />

        <ReportHeader
          userName={user?.email?.split('@')[0] || "Servant of Allah"}
          reportDate={new Date()}
          reportId={savedCalculationId ? `ZF-${savedCalculationId.slice(0, 6).toUpperCase()}` : undefined}
        />

        <ReportHero
          zakatDue={zakatDue}
          totalAssets={totalAssets}
          totalLiabilities={totalLiabilities}
          netZakatableWealth={netZakatableWealth}
          currency={currency}
          isAboveNisab={isAboveNisab}
          madhab={data.madhab || 'balanced'}
          calculationMode={data.madhab || 'balanced'}
        />

        {/* Methodology Selector - Toggle to see different calculations */}
        <div className="my-8 p-4 bg-muted/30 rounded-xl border border-border">
          <MethodologySelector
            value={data.madhab || 'balanced'}
            onChange={(mode) => updateData({ madhab: mode })}
            onSave={(mode) => {
              // TODO: Save to user profile when persistence is implemented
              toast({
                title: 'Methodology updated',
                description: `Using ${getModeDisplayName(mode)} methodology`,
              });
            }}
          />
        </div>

        <div className="my-10 flex flex-col items-center">
          <div className="w-full text-center mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Visual Flow</h3>
          </div>
          <ZakatSankeyChart
            data={{
              liquidAssets: assetBreakdown.liquidAssets,
              investments: assetBreakdown.investments,
              retirement: assetBreakdown.retirement,
              realEstate: assetBreakdown.realEstate,
              business: assetBreakdown.business,
              otherAssets: assetBreakdown.otherAssets,
              totalLiabilities,
              zakatDue,
              netZakatableWealth,
              zakatRate,
            }}
            enhancedData={{
              enhancedBreakdown,
              totalLiabilities,
              zakatDue,
              netZakatableWealth,
              zakatRate,
              calculationMode: data.madhab,
              madhab: data.madhab,
            }}
            currency={currency}
            width={isMobile ? 320 : 660} // Adjusted width for container
            height={isMobile ? 300 : 420}
            showLabels={!isMobile}
            showFullscreenButton={true}
          />
          <div className="mt-2 text-[10px] text-muted-foreground italic">
            *Flow shows how assets are filtered by Zakat rules before final calculation
          </div>
        </div>

        <ReportAssetTable
          enhancedBreakdown={enhancedBreakdown}
          currency={currency}
        />

        <ReportFooter
          interestToPurify={interestToPurify}
          dividendsToPurify={dividendsToPurify}
          currency={currency}
          zakatDue={zakatDue} // Pass Zakat amount for donation tracking
          referralStats={stats || undefined} // Pass stats from useReferral
          referralCode={referralCode || undefined}
        />
      </div>

    </div>
  );
}
