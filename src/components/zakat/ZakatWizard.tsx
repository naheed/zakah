import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { calculateZakat, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, ZakatFormData } from "@/lib/zakatCalculations";
import { useZakatPersistence } from "@/hooks/useZakatPersistence";
import { usePresence } from "@/hooks/usePresence";
import { WelcomeStep } from "./steps/WelcomeStep";
import { CategorySelectionStep } from "./steps/CategorySelectionStep";
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
import { ProgressBar } from "./ProgressBar";
import { StepNavigation } from "./StepNavigation";
import { ContinueSessionDialog } from "./ContinueSessionDialog";
import { StepNavigatorDrawer } from "./StepNavigatorDrawer";
import { UserMenu } from "./UserMenu";
import { PresenceIndicator } from "./PresenceIndicator";
import { Menu, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadedDocument } from "@/lib/documentTypes";
import { SavedCalculation } from "@/hooks/useSavedCalculations";

type StepId = 
  | 'welcome'
  | 'currency'
  | 'categories'
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
  // Core assets - get to the "aha moment" fast
  { id: 'liquid-assets', title: 'Cash & Bank', section: 'assets' },
  { id: 'investments', title: 'Investments', section: 'assets' },
  { id: 'retirement', title: 'Retirement', section: 'assets' },
  // Conditional assets
  { id: 'precious-metals', title: 'Precious Metals', section: 'assets', condition: (data) => data.hasPreciousMetals },
  { id: 'crypto', title: 'Crypto', section: 'assets', condition: (data) => data.hasCrypto },
  { id: 'trusts', title: 'Trusts', section: 'assets', condition: (data) => data.hasTrusts },
  { id: 'real-estate', title: 'Real Estate', section: 'assets', condition: (data) => data.hasRealEstate },
  { id: 'business', title: 'Business', section: 'assets', condition: (data) => data.hasBusiness },
  { id: 'illiquid-assets', title: 'Other Assets', section: 'assets', condition: (data) => data.hasIlliquidAssets },
  { id: 'debt-owed-to-you', title: 'Receivables', section: 'assets', condition: (data) => data.hasDebtOwedToYou },
  // Liabilities
  { id: 'liabilities', title: 'Deductions', section: 'liabilities' },
  { id: 'tax', title: 'Taxes', section: 'liabilities', condition: (data) => data.hasTaxPayments },
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
  
  
  const goToNext = () => {
    if (currentStepIndex < activeSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const goToPrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < activeSteps.length) {
      setCurrentStepIndex(index);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
        return <WelcomeStep onNext={goToNext} />;
      case 'categories':
        return <CategorySelectionStep data={formData} updateData={updateFormData} questionNumber={questionNumber} />;
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
                <Button variant="ghost" size="icon" className="shrink-0 -ml-2">
                  <Menu className="h-5 w-5" />
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
                <Button variant="ghost" size="icon" className="shrink-0">
                  <SettingsIcon className="h-5 w-5" />
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
        {renderStep()}
      </main>
      
      {!isWelcomePage && (
        <StepNavigation
          onPrevious={goToPrevious}
          onNext={goToNext}
          canGoBack={currentStepIndex > 0}
          canGoForward={currentStepIndex < activeSteps.length - 1}
          isLastStep={currentStep.id === 'results'}
          currentStepTitle={currentStep.title}
        />
      )}
    </div>
  );
}
