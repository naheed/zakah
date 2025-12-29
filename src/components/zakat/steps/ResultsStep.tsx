import { ZakatFormData, formatCurrency, formatPercent, CalculationMode } from "@/lib/zakatCalculations";
import { StepHeader } from "../StepHeader";
import { InfoCard } from "../InfoCard";
import { Button } from "@/components/ui/button";
import { CheckCircle, WarningCircle, DownloadSimple, ArrowCounterClockwise, GearSix, FloppyDisk, SignIn, ShareNetwork, CaretDown, CaretUp, PencilSimple, EnvelopeSimple, WhatsappLogo, XLogo, FacebookLogo, Copy, Check, Heart, Sparkle, Users, Warning } from "@phosphor-icons/react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { generateZakatPDF } from "@/lib/generatePDF";
import { SaveCalculationDialog } from "../SaveCalculationDialog";
import { ShareDrawer } from "../ShareDrawer";
import { CharityRecommendations } from "../CharityRecommendations";
import { YearOverYearChart } from "../YearOverYearChart";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ZakatSankeyChart } from "../ZakatSankeyChart";
import { useTrackCalculation } from "@/hooks/useTrackCalculation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useReferral } from "@/hooks/useReferral";
import { useSavedCalculations } from "@/hooks/useSavedCalculations";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Confetti, useConfetti } from "@/components/ui/confetti";
import { NumberTicker } from "@/components/ui/number-ticker";
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
  } = calculations;
  
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
      await generateZakatPDF(data, calculations, calculationName);
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

  const handleEdit = () => {
    if (onEditCalculation) {
      onEditCalculation();
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      {/* Confetti celebration for above nisab */}
      <Confetti isActive={showConfetti} />

      <StepHeader
        title="Your Zakat Calculation"
        subtitle="Based on Sheikh Joe Bradford's methodology"
      />
      
      <div className="space-y-6">
        {/* 1. Main Result Card - The Aha! Moment with Spring Animation */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 20,
            delay: 0.1 
          }}
          className={`rounded-2xl p-8 text-center ${
            isAboveNisab 
              ? 'bg-tertiary text-tertiary-foreground' 
              : 'bg-surface-container-high text-foreground'
          }`}
        >
          {isAboveNisab ? (
            <>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 15,
                  delay: 0.3 
                }}
              >
                <CheckCircle weight="duotone" className="w-12 h-12 mx-auto mb-4 opacity-90" />
              </motion.div>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg opacity-90 mb-2 font-light"
              >
                Your Zakat Due
              </motion.p>
              <p className="text-5xl font-semibold font-serif mb-4 tracking-tight">
                <NumberTicker 
                  value={zakatDue} 
                  delay={0.5}
                  formatFn={(v) => formatCurrency(v, currency)}
                />
              </p>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-sm opacity-80"
              >
                {formatPercent(zakatRate)} of your net Zakatable wealth ({data.calendarType} year)
              </motion.p>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              >
                <WarningCircle weight="duotone" className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              </motion.div>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg mb-2 font-light"
              >
                Below Niṣāb Threshold
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-serif font-medium mb-4"
              >
                No Zakat Due This Year
              </motion.p>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-muted-foreground"
              >
                Your wealth is below {formatCurrency(nisab, currency)}
              </motion.p>
            </>
          )}
        </motion.div>

        {/* 2. Edit Strip - Quick Actions with stagger */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-3"
        >
          <Button 
            variant="outline" 
            className="flex-1 h-11 gap-2"
            onClick={handleEdit}
          >
            <PencilSimple weight="duotone" className="w-4 h-4" />
            Review & Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="flex-1 h-11 gap-2">
                <ArrowCounterClockwise weight="duotone" className="w-4 h-4" />
                Start New
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Start New Calculation?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will clear all your current data and start fresh. Make sure you've saved or downloaded your results if needed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset}>Start Fresh</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>
        
        {/* 3. Purification Alert (if applicable) */}
        <AnimatePresence>
          {totalPurification > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ delay: 0.7 }}
            className="bg-tertiary/10 border border-tertiary/30 rounded-xl p-4"
          >
            <h3 className="font-semibold text-tertiary-foreground mb-2">✨ Purification Required</h3>
              <p className="text-sm text-muted-foreground mb-3">
                The following amounts must be donated to charity (without reward expectation):
              </p>
              <div className="space-y-1">
                {interestToPurify > 0 && (
                  <p className="text-sm">
                    Interest (Riba): <strong>{formatCurrency(interestToPurify, currency)}</strong>
                  </p>
                )}
                {dividendsToPurify > 0 && (
                  <p className="text-sm">
                    Non-Halal Dividends: <strong>{formatCurrency(dividendsToPurify, currency)}</strong>
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. Save Section - For non-authenticated users */}
        {!user && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center space-y-4"
          >
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-2">Save Your Calculation</h3>
              <p className="text-muted-foreground text-sm">
                Create a free account to save this calculation and track your Zakat history.
              </p>
            </div>
            <Button onClick={handleSignIn} className="gap-2">
              <SignIn weight="duotone" className="w-4 h-4" />
              Sign In / Create Account
            </Button>
          </motion.div>
        )}

        {/* 5. Primary Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col gap-3"
        >
          <Button 
            variant="outline" 
            className="w-full h-12 gap-2"
            onClick={handleDownload}
            disabled={isGeneratingPDF}
          >
            <DownloadSimple weight="duotone" className="w-4 h-4" />
            {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
          </Button>
          {user && (
            <div className="flex flex-col sm:flex-row gap-3">
              <SaveCalculationDialog 
                formData={data}
                onSaved={onCalculationSaved}
                trigger={
                  <Button variant="outline" className="flex-1 h-12 gap-2">
                    <FloppyDisk weight="duotone" className="w-4 h-4" />
                    {savedCalculationId ? 'Save As New' : 'Save'}
                  </Button>
                }
              />
            </div>
          )}
        </motion.div>
        
        {/* 6. Collapsible Calculation Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Collapsible open={breakdownOpen} onOpenChange={setBreakdownOpen}>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <CollapsibleTrigger className="w-full p-4 border-b border-border bg-accent flex items-center justify-between hover:bg-accent/80 transition-colors">
                <h3 className="font-semibold text-foreground">View Calculation Breakdown</h3>
                {breakdownOpen ? (
                  <CaretUp weight="bold" className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <CaretDown weight="bold" className="w-5 h-5 text-muted-foreground" />
                )}
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                {/* Sankey Chart */}
                <div className="border-b border-border">
                  <div className="p-3 flex items-center justify-between bg-muted/30">
                    <span className="text-sm text-muted-foreground">Asset Flow to Zakat</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        const newMode = data.calculationMode === 'conservative' ? 'optimized' : 'conservative';
                        updateData({ calculationMode: newMode });
                      }}
                    >
                      <GearSix weight="duotone" className="w-4 h-4 mr-1" />
                      {data.calculationMode === 'conservative' ? 'Conservative' : 'Optimized'}
                    </Button>
                  </div>
                  
                  {showSettings && (
                    <div className="p-4 bg-muted/50 border-b border-border">
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Conservative:</strong> Pay on full asset values (safer)
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Optimized:</strong> Apply 30% rule for passive investments, deduct taxes/penalties from retirement
                      </p>
                    </div>
                  )}
                  
                  <div className={`${isMobile ? 'p-3' : 'p-6'} flex justify-center items-center overflow-x-auto`}>
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
                      currency={currency}
                      width={isMobile ? 340 : 580}
                      height={isMobile ? 280 : 380}
                      showLabels={!isMobile}
                      showFullscreenButton={true}
                    />
                  </div>
                </div>
                
                {/* Summary Table with staggered rows */}
                <div className="divide-y divide-border">
                  <BreakdownRow label="Total Zakatable Assets" value={formatCurrency(totalAssets, currency)} index={0} />
                  <BreakdownRow label="Total Deductions" value={`-${formatCurrency(totalLiabilities, currency)}`} variant="negative" index={1} />
                  <BreakdownRow label="Net Zakatable Wealth" value={formatCurrency(netZakatableWealth, currency)} bold index={2} />
                  <BreakdownRow label={`Niṣāb (${data.nisabStandard})`} value={formatCurrency(nisab, currency)} index={3} />
                  <BreakdownRow label={`Zakat Rate (${data.calendarType})`} value={formatPercent(zakatRate)} index={4} />
                  <BreakdownRow label="Zakat Due" value={formatCurrency(zakatDue, currency)} variant="positive" bold index={5} />
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </motion.div>
        
        {/* 7. Charity Recommendations (if Zakat due) */}
        {isAboveNisab && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <Collapsible open={charityOpen} onOpenChange={setCharityOpen}>
              <div className="border border-border rounded-xl overflow-hidden bg-card">
                <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Heart weight="duotone" className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-foreground">Where to Give Your Zakat</span>
                  </div>
                  {charityOpen ? (
                    <CaretUp weight="bold" className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <CaretDown weight="bold" className="w-5 h-5 text-muted-foreground" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 pt-0">
                    <CharityRecommendations zakatDue={zakatDue} currency={currency} />
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          </motion.div>
        )}

        {/* 8. Year-over-Year Trend (for authenticated users with history) */}
        {user && savedCalculations.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15 }}
          >
            <Collapsible open={trendOpen} onOpenChange={setTrendOpen}>
              <div className="border border-border rounded-xl overflow-hidden bg-card">
                <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Sparkle weight="duotone" className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-foreground">Your Zakat History</span>
                  </div>
                  {trendOpen ? (
                    <CaretUp weight="bold" className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <CaretDown weight="bold" className="w-5 h-5 text-muted-foreground" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 pt-0">
                    <YearOverYearChart 
                      calculations={savedCalculations} 
                      currentZakatDue={zakatDue}
                      currency={currency}
                    />
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          </motion.div>
        )}
        
        {/* 9. Celebration & Share Section - Combined */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <CelebrationShareSection 
            isAboveNisab={isAboveNisab} 
            currency={currency}
            formData={data}
            zakatDue={zakatDue}
            savedCalculationId={savedCalculationId}
          />
        </motion.div>

        {/* 10. Collapsible Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25 }}
        >
          <Collapsible open={disclaimerOpen} onOpenChange={setDisclaimerOpen}>
            <div className="border border-border rounded-xl overflow-hidden bg-muted/30">
              <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Warning weight="duotone" className="w-4 h-4" />
                  <span className="text-sm font-medium">What this calculator doesn't cover</span>
                </div>
                {disclaimerOpen ? (
                  <CaretUp weight="bold" className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <CaretDown weight="bold" className="w-5 h-5 text-muted-foreground" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 pt-0 text-sm text-muted-foreground space-y-2">
                  <p>This calculator does not cover:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Farming assets harvested for sale</li>
                    <li>Ḥarām earnings (bonds, interest income, etc.)</li>
                  </ul>
                  <p className="pt-2">
                    If you have these, please consult a specialist in Islamic Finance.
                  </p>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </motion.div>
      </div>
    </div>
  );
}

// Combined Celebration & Share Section Component
function CelebrationShareSection({ 
  isAboveNisab, 
  currency,
  formData,
  zakatDue,
  savedCalculationId
}: { 
  isAboveNisab: boolean; 
  currency: string;
  formData: ZakatFormData;
  zakatDue: number;
  savedCalculationId?: string;
}) {
  const { toast } = useToast();
  const { 
    referralCode, 
    stats, 
    isLoading, 
    isGenerating,
    generateReferralCode, 
    fetchStats,
    getInviteUrl 
  } = useReferral();
  const [copied, setCopied] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      const code = await generateReferralCode();
      if (code) {
        setInviteUrl(getInviteUrl(code));
      }
      fetchStats();
    };
    init();
  }, [generateReferralCode, fetchStats, getInviteUrl]);

  useEffect(() => {
    if (referralCode) {
      setInviteUrl(getInviteUrl(referralCode));
    }
  }, [referralCode, getInviteUrl]);

  const handleCopy = async () => {
    if (!inviteUrl) return;
    
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      toast({
        title: 'Link Copied',
        description: 'Share this link with friends and family.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Copy Failed',
        description: 'Please copy the link manually.',
        variant: 'destructive',
      });
    }
  };

  const shareMessage = encodeURIComponent(
    `I just calculated my Zakat using this amazing tool. It follows authentic Islamic methodology and makes the process so easy. Try it out: ${inviteUrl}`
  );

  const shareLinks = {
    email: `mailto:?subject=${encodeURIComponent('Calculate Your Zakat')}&body=${shareMessage}`,
    whatsapp: `https://wa.me/?text=${shareMessage}`,
    twitter: `https://twitter.com/intent/tweet?text=${shareMessage}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteUrl)}&quote=${shareMessage}`,
  };

  return (
    <div className="bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 rounded-xl overflow-hidden">
      {/* Celebration Message */}
      <div className="p-6 text-center border-b border-primary/10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <Heart weight="duotone" className="w-8 h-8 mx-auto mb-3 text-primary" />
        </motion.div>
        {isAboveNisab ? (
          <>
            <h3 className="font-semibold text-lg text-foreground mb-2">Congratulations!</h3>
            <p className="text-sm text-muted-foreground">
              Allah has blessed you with wealth above the niṣāb. By paying your Zakat, 
              you purify your wealth and fulfill one of the five pillars of Islam.
            </p>
          </>
        ) : (
          <>
            <h3 className="font-semibold text-lg text-foreground mb-2">Consider Voluntary Charity</h3>
            <p className="text-sm text-muted-foreground">
              While Zakat is not obligatory this year, you can still earn 
              rewards through voluntary charity (Sadaqah).
            </p>
          </>
        )}
      </div>

      {/* Share Section */}
      <div className="p-6 space-y-4">
        {/* Hadith Quote */}
        <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border/50">
          <p className="text-sm italic text-muted-foreground leading-relaxed text-center">
            "Whoever guides someone to goodness will have a reward like one who did it."
          </p>
          <p className="text-xs text-muted-foreground mt-2 font-medium text-center">
            — Prophet Muhammad ﷺ (Ṣaḥīḥ Muslim 1893)
          </p>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Share this tool with friends & family
        </p>

        {/* Share Buttons */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <a href={shareLinks.email} target="_blank" rel="noopener noreferrer">
              <EnvelopeSimple weight="duotone" className="w-4 h-4" />
              Email
            </a>
          </Button>
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer">
              <WhatsappLogo weight="duotone" className="w-4 h-4" />
              WhatsApp
            </a>
          </Button>
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
              <XLogo weight="duotone" className="w-4 h-4" />
              Twitter
            </a>
          </Button>
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
              <FacebookLogo weight="duotone" className="w-4 h-4" />
              Facebook
            </a>
          </Button>
        </div>

        {/* Personal Invite Link */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground text-center">Your personal invite link:</p>
          <div className="flex gap-2">
            <Input
              readOnly
              value={inviteUrl || 'Loading...'}
              className="font-mono text-xs bg-muted/50"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              disabled={!inviteUrl || isGenerating}
            >
              {copied ? (
                <Check weight="bold" className="w-4 h-4 text-primary" />
              ) : (
                <Copy weight="duotone" className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Referral Stats */}
        <AnimatePresence>
          {stats && stats.totalReferrals > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-primary/10 rounded-lg p-3 text-center"
            >
              <div className="flex items-center justify-center gap-2 text-sm">
                <Sparkle weight="fill" className="w-4 h-4 text-primary" />
                <span className="font-medium">{stats.totalReferrals}</span>
                <span className="text-muted-foreground">
                  {stats.totalReferrals === 1 ? 'calculation' : 'calculations'} through your shares
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Share with Spouse - Secondary */}
        <div className="pt-2 border-t border-border/50">
          <ShareDrawer 
            formData={formData} 
            zakatDue={zakatDue}
            calculationId={savedCalculationId}
          >
            <Button variant="ghost" size="sm" className="w-full gap-2 text-muted-foreground">
              <ShareNetwork weight="duotone" className="w-4 h-4" />
              Share calculation with spouse
            </Button>
          </ShareDrawer>
        </div>
      </div>
    </div>
  );
}

function BreakdownRow({ 
  label, 
  value, 
  variant = 'neutral',
  bold = false,
  color,
  index = 0,
}: { 
  label: string; 
  value: string; 
  variant?: 'positive' | 'negative' | 'neutral' | 'muted';
  bold?: boolean;
  color?: string;
  index?: number;
}) {
  const valueColors = {
    positive: 'text-success',
    negative: 'text-destructive',
    neutral: 'text-foreground',
    muted: 'text-muted-foreground',
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center justify-between p-4"
    >
      <div className="flex items-center gap-2">
        {color && (
          <span 
            className="w-3 h-3 rounded-full flex-shrink-0" 
            style={{ backgroundColor: color }}
          />
        )}
        <span className={`${bold ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
          {label}
        </span>
      </div>
      <span className={`font-mono ${bold ? 'font-bold text-lg' : ''} ${valueColors[variant]}`}>
        {value}
      </span>
    </motion.div>
  );
}
