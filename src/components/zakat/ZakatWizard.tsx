import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { calculateZakat, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, ZakatFormData } from "@/lib/zakatCalculations";
import { useZakatPersistence } from "@/hooks/useZakatPersistence";
import { usePresence } from "@/hooks/usePresence";
import { WelcomeStep } from "./steps/WelcomeStep";
import { CategorySelectionStep } from "./steps/CategorySelectionStep";
import { SimpleModeStep } from "./steps/SimpleModeStep";
import { LiquidAssetsStep } from "./steps/LiquidAssetsStep";
import { PreciousMetalsStep } from "./steps/PreciousMetalsStep";
import { CryptoStep } from "./steps/CryptoStep";
import { InvestmentsStep } from "./steps/InvestmentsStep";
import { RetirementStep } from "./steps/RetirementStep";
import { TrustsStep } from "./steps/TrustsStep";
import { RealEstateStep } from "./steps/RealEstateStep";
import { BusinessStep } from "./steps/BusinessStep";
import { IlliquidAssetsStep } from "./steps/IlliquidAssetsStep";
import { DebtOwedToYouStep } from "./steps/DebtOwedToYouStep";
import { LiabilitiesStep } from "./steps/LiabilitiesStep";
import { TaxStep } from "./steps/TaxStep";
import { ResultsStep } from "./steps/ResultsStep";
import { SimpleModeToggle } from "./SimpleModeToggle";
import { ProgressBar } from "./ProgressBar";
import { StepNavigation } from "./StepNavigation";
import { ContinueSessionDialog } from "./ContinueSessionDialog";
import { StepNavigatorDrawer } from "./StepNavigatorDrawer";
import { UserMenu } from "./UserMenu";
import { SaveProgressPrompt } from "./SaveProgressPrompt";
import { PresenceIndicator } from "./PresenceIndicator";
import { List, GearSix } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { UploadedDocument } from "@/lib/documentTypes";
import { SavedCalculation } from "@/hooks/useSavedCalculations";

// Animation variants for step transitions
const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
  }),
};

const stepTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 35,
};

const SWIPE_THRESHOLD = 50;
const SWIPE_VELOCITY_THRESHOLD = 500;

type StepId = 
  | 'welcome'
  | 'currency'
  | 'categories'
  | 'simple-mode'
  | 'liquid-assets'
  | 'precious-metals'
  | 'crypto'
  | 'investments'
  | 'retirement'
  | 'trusts'
  | 'real-estate'
  | 'business'
  | 'illiquid-assets'
  | 'debt-owed-to-you'
  | 'liabilities'
  | 'tax'
  | 'results';

interface Step {
  id: StepId;
  title: string;
  section: 'intro' | 'assets' | 'liabilities' | 'results';
  condition?: (data: ZakatFormData) => boolean;
}

// Simplified steps: Settings are now in a separate /settings page
const allSteps: Step[] = [
  { id: 'welcome', title: 'Welcome', section: 'intro' },
  { id: 'categories', title: 'Asset Types', section: 'intro' },
  // Simple mode step (replaces detailed steps when active)
  { id: 'simple-mode', title: 'Quick Calculate', section: 'assets', condition: (data) => data.isSimpleMode },
  // Core assets - get to the "aha moment" fast (hidden in simple mode)
  { id: 'liquid-assets', title: 'Cash & Bank', section: 'assets', condition: (data) => !data.isSimpleMode },
  { id: 'investments', title: 'Investments', section: 'assets', condition: (data) => !data.isSimpleMode },
  { id: 'retirement', title: 'Retirement', section: 'assets', condition: (data) => !data.isSimpleMode },
  // Conditional assets (hidden in simple mode)
  { id: 'precious-metals', title: 'Precious Metals', section: 'assets', condition: (data) => !data.isSimpleMode && data.hasPreciousMetals },
  { id: 'crypto', title: 'Crypto', section: 'assets', condition: (data) => !data.isSimpleMode && data.hasCrypto },
  { id: 'trusts', title: 'Trusts', section: 'assets', condition: (data) => !data.isSimpleMode && data.hasTrusts },
  { id: 'real-estate', title: 'Real Estate', section: 'assets', condition: (data) => !data.isSimpleMode && data.hasRealEstate },
  { id: 'business', title: 'Business', section: 'assets', condition: (data) => !data.isSimpleMode && data.hasBusiness },
  { id: 'illiquid-assets', title: 'Other Assets', section: 'assets', condition: (data) => !data.isSimpleMode && data.hasIlliquidAssets },
  { id: 'debt-owed-to-you', title: 'Receivables', section: 'assets', condition: (data) => !data.isSimpleMode && data.hasDebtOwedToYou },
  // Liabilities (hidden in simple mode)
  { id: 'liabilities', title: 'Deductions', section: 'liabilities', condition: (data) => !data.isSimpleMode },
  { id: 'tax', title: 'Taxes', section: 'liabilities', condition: (data) => !data.isSimpleMode && data.hasTaxPayments },
  // Results - the aha moment!
  { id: 'results', title: 'Your Zakat', section: 'results' },
];

export function ZakatWizard() {
  const {
    formData,
    stepIndex: currentStepIndex,
    setStepIndex: setCurrentStepIndex,
    updateFormData,
    uploadedDocuments,
    addDocument,
    removeDocument,
    hasExistingSession,
    lastUpdated,
    continueSession,
    startFresh,
    isLoaded,
    setFormData,
  } = useZakatPersistence();

  const [calculationName, setCalculationName] = useState<string | undefined>();
  const [savedCalculationId, setSavedCalculationId] = useState<string | undefined>();
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  // Presence tracking for collaborative editing
  const { presentUsers, updatePresence } = usePresence(savedCalculationId);
  
  // Check for loaded calculation from saved calculations page
  useEffect(() => {
    const loadedCalc = localStorage.getItem('zakat-load-calculation');
    if (loadedCalc) {
      try {
        const calc: SavedCalculation = JSON.parse(loadedCalc);
        setFormData(calc.form_data);
        setCalculationName(calc.name);
        setSavedCalculationId(calc.id);
        // Go to results step
        const activeSteps = getActiveSteps();
        const resultsIndex = activeSteps.findIndex(s => s.id === 'results');
        if (resultsIndex >= 0) {
          setCurrentStepIndex(resultsIndex);
        }
      } catch (e) {
        console.error('Error loading calculation:', e);
      }
      localStorage.removeItem('zakat-load-calculation');
    }
  }, [setFormData, setCurrentStepIndex]);
  
  const getActiveSteps = () => {
    return allSteps.filter(step => !step.condition || step.condition(formData));
  };
  
  const activeSteps = getActiveSteps();
  const currentStep = activeSteps[currentStepIndex] || activeSteps[0];
  
  
  const goToNext = useCallback(() => {
    if (currentStepIndex < activeSteps.length - 1) {
      setDirection(1);
      setCurrentStepIndex(currentStepIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStepIndex, activeSteps.length, setCurrentStepIndex]);
  
  const goToPrevious = useCallback(() => {
    if (currentStepIndex > 0) {
      setDirection(-1);
      setCurrentStepIndex(currentStepIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStepIndex, setCurrentStepIndex]);

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < activeSteps.length) {
      setDirection(index > currentStepIndex ? 1 : -1);
      setCurrentStepIndex(index);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStepIndex, activeSteps.length, setCurrentStepIndex]);

  // Swipe gesture handlers
  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const { offset, velocity } = info;

      if (
        offset.x < -SWIPE_THRESHOLD ||
        velocity.x < -SWIPE_VELOCITY_THRESHOLD
      ) {
        goToNext();
      } else if (
        offset.x > SWIPE_THRESHOLD ||
        velocity.x > SWIPE_VELOCITY_THRESHOLD
      ) {
        goToPrevious();
      }
    },
    [goToNext, goToPrevious]
  );

  // Update presence when step changes
  useEffect(() => {
    if (savedCalculationId && currentStep) {
      updatePresence(currentStep.title);
    }
  }, [savedCalculationId, currentStep, updatePresence]);

  // Wrapper for adding documents that also updates form values
  const handleDocumentAdded = (doc: Omit<UploadedDocument, 'id' | 'uploadedAt'>) => {
    addDocument(doc);
  };
  
  const calculations = calculateZakat(formData, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE);

  // Don't render until we've loaded persisted data
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Check if we're on welcome page
  const isWelcomePage = currentStep.id === 'welcome';

  // Progress and question numbering should exclude the welcome step (but include results)
  const progressSteps = activeSteps.filter(s => s.id !== 'welcome');
  const progressStepIndexRaw = progressSteps.findIndex(s => s.id === currentStep.id);
  const progressStepIndex = progressStepIndexRaw >= 0 ? progressStepIndexRaw : progressSteps.length - 1;

  // Calculate question number (1-indexed, excluding welcome)
  const getQuestionNumber = () => {
    if (currentStep.id === 'welcome') {
      return undefined;
    }
    return progressStepIndex + 1;
  };

  const questionNumber = getQuestionNumber();
  
  // Handle loading a saved calculation from WelcomeStep
  const handleLoadCalculation = (calc: SavedCalculation) => {
    setFormData(calc.form_data);
    setCalculationName(calc.name);
    setSavedCalculationId(calc.id);
    // Go to results step
    const activeStepsNow = allSteps.filter(step => !step.condition || step.condition(calc.form_data));
    const resultsIndex = activeStepsNow.findIndex(s => s.id === 'results');
    if (resultsIndex >= 0) {
      setCurrentStepIndex(resultsIndex);
    }
  };

  const renderStep = () => {
    // Common props for asset steps
    const assetStepProps = {
      data: formData,
      updateData: updateFormData,
      uploadedDocuments,
      onDocumentAdded: handleDocumentAdded,
      onRemoveDocument: removeDocument,
      questionNumber,
    };

    switch (currentStep.id) {
      case 'welcome':
        return <WelcomeStep onNext={goToNext} onLoadCalculation={handleLoadCalculation} />;
      case 'categories':
        return (
          <div className="space-y-6">
            <SimpleModeToggle
              isSimpleMode={formData.isSimpleMode}
              onToggle={(value) => updateFormData({ isSimpleMode: value })}
            />
            {!formData.isSimpleMode && (
              <CategorySelectionStep data={formData} updateData={updateFormData} questionNumber={questionNumber} />
            )}
          </div>
        );
      case 'simple-mode':
        return <SimpleModeStep data={formData} updateData={updateFormData} questionNumber={questionNumber} />;
      case 'liquid-assets':
        return <LiquidAssetsStep {...assetStepProps} />;
      case 'precious-metals':
        return <PreciousMetalsStep {...assetStepProps} />;
      case 'crypto':
        return <CryptoStep {...assetStepProps} />;
      case 'investments':
        return <InvestmentsStep {...assetStepProps} />;
      case 'retirement':
        return <RetirementStep {...assetStepProps} />;
      case 'trusts':
        return <TrustsStep {...assetStepProps} />;
      case 'real-estate':
        return <RealEstateStep {...assetStepProps} />;
      case 'business':
        return <BusinessStep {...assetStepProps} />;
      case 'illiquid-assets':
        return <IlliquidAssetsStep {...assetStepProps} />;
      case 'debt-owed-to-you':
        return <DebtOwedToYouStep {...assetStepProps} />;
      case 'liabilities':
        return <LiabilitiesStep {...assetStepProps} />;
      case 'tax':
        return <TaxStep {...assetStepProps} />;
      case 'results':
        return (
          <ResultsStep 
            data={formData} 
            updateData={updateFormData} 
            calculations={calculations} 
            calculationName={calculationName}
            savedCalculationId={savedCalculationId}
            onCalculationSaved={setSavedCalculationId}
            onEditCalculation={() => setCurrentStepIndex(1)}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Continue Session Dialog */}
      <ContinueSessionDialog
        open={hasExistingSession}
        lastUpdated={lastUpdated}
        onContinue={continueSession}
        onStartFresh={startFresh}
        onLoadServerCalculation={handleLoadCalculation}
      />

      {/* Header with Progress - hidden on welcome page */}
      {!isWelcomePage && (
        <div className="sticky top-0 z-10 bg-card border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              {/* Step Navigator Button */}
              <StepNavigatorDrawer
                steps={activeSteps}
                currentStepIndex={currentStepIndex}
                onStepSelect={goToStep}
              >
                <Button variant="ghost" size="icon" className="shrink-0 -ml-2 min-h-12 min-w-12">
                  <List className="h-5 w-5" weight="bold" />
                  <span className="sr-only">Navigate steps</span>
                </Button>
              </StepNavigatorDrawer>

              {/* Progress Bar */}
              <div className="flex-1">
                <ProgressBar 
                  currentStep={progressStepIndex} 
                  totalSteps={progressSteps.length}
                  section={currentStep.section}
                />
              </div>

              {/* Settings Button */}
              <Link to="/settings">
                <Button variant="ghost" size="icon" className="shrink-0 min-h-12 min-w-12">
                  <GearSix className="h-5 w-5" weight="bold" />
                  <span className="sr-only">Settings</span>
                </Button>
              </Link>

              {/* Presence Indicator - shows other users editing */}
              {presentUsers.length > 0 && (
                <PresenceIndicator users={presentUsers} />
              )}

              {/* User Menu */}
              <UserMenu />
            </div>
          </div>
        </div>
      )}
      
      <main className={`max-w-4xl mx-auto px-4 ${isWelcomePage ? 'py-4' : 'py-8 pb-32'}`}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep.id}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={stepTransition}
            drag={!isWelcomePage ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
            className="touch-pan-y"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {!isWelcomePage && (
        <>
          <SaveProgressPrompt
            currentStepIndex={currentStepIndex}
            totalSteps={activeSteps.length}
            onDismiss={() => {}}
          />
          <StepNavigation
            onPrevious={goToPrevious}
            onNext={goToNext}
            canGoBack={currentStepIndex > 0}
            canGoForward={currentStepIndex < activeSteps.length - 1}
            isLastStep={currentStep.id === 'results'}
            currentStepTitle={currentStep.title}
          />
        </>
      )}
    </div>
  );
}
