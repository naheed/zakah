import { useEffect, useState } from "react";
import { calculateZakat, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, ZakatFormData } from "@/lib/zakatCalculations";
import { useZakatPersistence } from "@/hooks/useZakatPersistence";
import { WelcomeStep } from "./steps/WelcomeStep";
import { NisabStep } from "./steps/NisabStep";
import { HawlStep } from "./steps/HawlStep";
import { FamilyStep } from "./steps/FamilyStep";
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
import { ShareDrawer } from "./ShareDrawer";
import { DocumentsManager } from "./DocumentsManager";
import { UserMenu } from "./UserMenu";
import { SaveCalculationDialog } from "./SaveCalculationDialog";
import { Menu, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadedDocument } from "@/lib/documentTypes";
import { SavedCalculation } from "@/hooks/useSavedCalculations";

type StepId = 
  | 'welcome'
  | 'currency'
  | 'nisab'
  | 'hawl'
  | 'family'
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

const allSteps: Step[] = [
  { id: 'welcome', title: 'Welcome', section: 'intro' },
  { id: 'nisab', title: 'Niṣāb', section: 'intro' },
  { id: 'hawl', title: 'Ḥawl', section: 'intro' },
  { id: 'family', title: 'Family', section: 'intro' },
  { id: 'categories', title: 'Categories', section: 'intro' },
  { id: 'liquid-assets', title: 'Liquid Assets', section: 'assets' },
  { id: 'precious-metals', title: 'Precious Metals', section: 'assets', condition: (data) => data.hasPreciousMetals },
  { id: 'crypto', title: 'Crypto', section: 'assets', condition: (data) => data.hasCrypto },
  { id: 'investments', title: 'Investments', section: 'assets' },
  { id: 'retirement', title: 'Retirement', section: 'assets' },
  { id: 'trusts', title: 'Trusts', section: 'assets', condition: (data) => data.hasTrusts },
  { id: 'real-estate', title: 'Real Estate', section: 'assets', condition: (data) => data.hasRealEstate },
  { id: 'business', title: 'Business', section: 'assets', condition: (data) => data.hasBusiness },
  { id: 'illiquid-assets', title: 'Illiquid Assets', section: 'assets', condition: (data) => data.hasIlliquidAssets },
  { id: 'debt-owed-to-you', title: 'Debt Owed', section: 'assets', condition: (data) => data.hasDebtOwedToYou },
  { id: 'liabilities', title: 'Expenses', section: 'liabilities' },
  { id: 'tax', title: 'Taxes', section: 'liabilities', condition: (data) => data.hasTaxPayments },
  { id: 'results', title: 'Results', section: 'results' },
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
        const resultsIndex = allSteps.findIndex(s => s.id === 'results');
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
  
  const renderStep = () => {
    // Common props for asset steps
    const assetStepProps = {
      data: formData,
      updateData: updateFormData,
      uploadedDocuments,
      onDocumentAdded: handleDocumentAdded,
      onRemoveDocument: removeDocument,
    };

    switch (currentStep.id) {
      case 'welcome':
        return <WelcomeStep onNext={goToNext} />;
      case 'nisab':
        return <NisabStep data={formData} updateData={updateFormData} />;
      case 'hawl':
        return <HawlStep data={formData} updateData={updateFormData} />;
      case 'family':
        return <FamilyStep data={formData} updateData={updateFormData} />;
      case 'categories':
        return <CategorySelectionStep data={formData} updateData={updateFormData} />;
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

      {/* Header with Progress */}
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

            {/* Progress Bar - clickable to open drawer */}
            <div className="flex-1">
              <ProgressBar 
                currentStep={currentStepIndex} 
                totalSteps={activeSteps.length}
                section={currentStep.section}
              />
            </div>

            {/* Documents Manager */}
            <DocumentsManager 
              documents={uploadedDocuments} 
              onRemoveDocument={removeDocument} 
            />

            {/* Share Button */}
            <ShareDrawer 
              formData={formData} 
              zakatDue={calculations.zakatDue}
              calculationId={savedCalculationId}
            >
              <Button variant="ghost" size="icon" className="shrink-0">
                <Share2 className="h-5 w-5" />
                <span className="sr-only">Share with spouse</span>
              </Button>
            </ShareDrawer>

            {/* User Menu */}
            <UserMenu />
          </div>
        </div>
      </div>
      
      <main className="max-w-4xl mx-auto px-4 py-8 pb-32">
        {renderStep()}
      </main>
      
      {currentStep.id !== 'welcome' && (
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
