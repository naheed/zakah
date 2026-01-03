import { ZakatFormData, formatCurrency, formatPercent, CalculationMode, EnhancedAssetBreakdown, createZakatReport } from "@/lib/zakatCalculations";
import { StepHeader } from "../StepHeader";
import { InfoCard } from "../InfoCard";
import { Button } from "@/components/ui/button";
import { CheckCircle, WarningCircle, DownloadSimple, ArrowCounterClockwise, GearSix, FloppyDisk, SignIn, ShareNetwork, CaretDown, CaretUp, PencilSimple, EnvelopeSimple, WhatsappLogo, XLogo, FacebookLogo, Copy, Check, Heart, Sparkle, Users, Warning } from "@phosphor-icons/react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
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
import { ChevronDown } from "lucide-react";
import { SaveCalculationDialog } from "../SaveCalculationDialog";

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
  const showConfetti = useConfetti(isAboveNisab);

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
              {data.calculationMode === 'conservative' ? 'Conservative' : data.calculationMode === 'optimized' ? 'Optimized' : 'Bradford'} Mode
            </span>
            <span className="text-xs text-muted-foreground bg-white dark:bg-card border border-border px-2 py-0.5 rounded shadow-sm">
              {data.madhab ? (data.madhab.charAt(0).toUpperCase() + data.madhab.slice(1)) : 'Standard'} Madhab
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2">
            {/* Primary Action: Download PDF */}
            <Button
              onClick={handleDownload}
              disabled={isGeneratingPDF}
              className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-sm"
            >
              {isGeneratingPDF ? (
                <ArrowCounterClockwise className="w-4 h-4 animate-spin" />
              ) : (
                <DownloadSimple className="w-4 h-4" />
              )}
              {isGeneratingPDF ? 'Generating...' : 'Download Report'}
            </Button>

            {/* Secondary Actions: Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="w-10 px-0">
                  <ChevronDown className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                <DropdownMenuItem onClick={handleDownload}>
                  <DownloadSimple className="mr-2 h-4 w-4" />
                  <span>Download PDF</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadCSV}>
                  <FloppyDisk className="mr-2 h-4 w-4" />
                  <span>Export CSV Data</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                {user ? (
                  <DropdownMenuItem onClick={() => document.getElementById('save-calc-trigger')?.click()}>
                    <FloppyDisk className="mr-2 h-4 w-4" />
                    <span>Save to Account</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={handleSignIn}>
                    <SignIn className="mr-2 h-4 w-4" />
                    <span>Sign in to Save</span>
                  </DropdownMenuItem>
                )}
                {(onEditCalculation) && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleEdit}>
                      <PencilSimple className="mr-2 h-4 w-4" />
                      <span>Edit Inputs</span>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem onClick={handleReset} className="text-destructive focus:text-destructive">
                  <ArrowCounterClockwise className="mr-2 h-4 w-4" />
                  <span>Start Over</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
          calculationMode={data.calculationMode}
        />

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
              calculationMode: data.calculationMode,
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
          referralStats={stats || undefined} // Pass stats from useReferral
          referralCode={referralCode || undefined}
        />
      </div>

      {/* 3. Below Report Actions (Share, History, Restart) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Share Box */}
        <div className="bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Heart weight="fill" className="text-primary w-6 h-6" />
            <div>
              <h3 className="font-semibold text-foreground">Multiply Your Barakah</h3>
              <p className="text-xs text-muted-foreground">Share this tool to help others purify their wealth.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="bg-white dark:bg-card gap-2" onClick={() => {
              const url = "https://zakatflow.org"; // Use invite link if available
              navigator.clipboard.writeText(url);
              toast({ title: "Link Copied!" });
            }}>
              <Copy className="w-4 h-4" /> Copy Link
            </Button>
            {/* Could replace with CelebrationShareSection logic or components */}
            <Button variant="outline" size="sm" className="bg-white dark:bg-card gap-2 ml-auto" onClick={handleReset}>
              <ArrowCounterClockwise className="w-4 h-4" /> Start New
            </Button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-muted/30 border border-border rounded-2xl p-6 flex flex-col justify-center">
          <div className="flex items-start gap-3">
            <WarningCircle className="w-6 h-6 text-muted-foreground shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> This tool does not cover farming assets, livestock, or specialized complex assets.
                Calculations are based on selected scholarly opinions (Standard/Madhab/Bradford).
              </p>
              <p className="text-xs text-muted-foreground">
                Always consult with a local scholar for specific personal situations.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

