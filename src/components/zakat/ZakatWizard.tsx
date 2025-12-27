import { useState } from "react";
import { ZakatFormData, defaultFormData, calculateZakat, SILVER_PRICE_PER_OUNCE } from "@/lib/zakatCalculations";
import { WelcomeStep } from "./steps/WelcomeStep";
import { CurrencyStep } from "./steps/CurrencyStep";
import { NisabStep } from "./steps/NisabStep";
import { HawlStep } from "./steps/HawlStep";
import { FamilyStep } from "./steps/FamilyStep";
import { CategorySelectionStep } from "./steps/CategorySelectionStep";
import { EmailStep } from "./steps/EmailStep";
import { LiquidAssetsStep } from "./steps/LiquidAssetsStep";
import { PreciousMetalsStep } from "./steps/PreciousMetalsStep";
import { InvestmentsStep } from "./steps/InvestmentsStep";
import { RetirementStep } from "./steps/RetirementStep";
import { RealEstateStep } from "./steps/RealEstateStep";
import { BusinessStep } from "./steps/BusinessStep";
import { IlliquidAssetsStep } from "./steps/IlliquidAssetsStep";
import { DebtOwedToYouStep } from "./steps/DebtOwedToYouStep";
import { LiabilitiesStep } from "./steps/LiabilitiesStep";
import { TaxStep } from "./steps/TaxStep";
import { ResultsStep } from "./steps/ResultsStep";
import { ProgressBar } from "./ProgressBar";
import { StepNavigation } from "./StepNavigation";

type StepId = 
  | 'welcome'
  | 'currency'
  | 'nisab'
  | 'hawl'
  | 'family'
  | 'categories'
  | 'email'
  | 'liquid-assets'
  | 'precious-metals'
  | 'investments'
  | 'retirement'
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
  { id: 'currency', title: 'Currency', section: 'intro' },
  { id: 'nisab', title: 'Niṣāb', section: 'intro' },
  { id: 'hawl', title: 'Ḥawl', section: 'intro' },
  { id: 'family', title: 'Family', section: 'intro' },
  { id: 'categories', title: 'Categories', section: 'intro' },
  { id: 'email', title: 'Email', section: 'intro' },
  { id: 'liquid-assets', title: 'Liquid Assets', section: 'assets' },
  { id: 'precious-metals', title: 'Precious Metals', section: 'assets', condition: (data) => data.hasPreciousMetals },
  { id: 'investments', title: 'Investments', section: 'assets' },
  { id: 'retirement', title: 'Retirement', section: 'assets' },
  { id: 'real-estate', title: 'Real Estate', section: 'assets', condition: (data) => data.hasRealEstate },
  { id: 'business', title: 'Business', section: 'assets', condition: (data) => data.hasBusiness },
  { id: 'illiquid-assets', title: 'Illiquid Assets', section: 'assets', condition: (data) => data.hasIlliquidAssets },
  { id: 'debt-owed-to-you', title: 'Debt Owed', section: 'assets', condition: (data) => data.hasDebtOwedToYou },
  { id: 'liabilities', title: 'Expenses', section: 'liabilities' },
  { id: 'tax', title: 'Taxes', section: 'liabilities', condition: (data) => data.hasTaxPayments },
  { id: 'results', title: 'Results', section: 'results' },
];

export function ZakatWizard() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<ZakatFormData>(defaultFormData);
  
  const getActiveSteps = () => {
    return allSteps.filter(step => !step.condition || step.condition(formData));
  };
  
  const activeSteps = getActiveSteps();
  const currentStep = activeSteps[currentStepIndex];
  
  const updateFormData = (updates: Partial<ZakatFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };
  
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
  
  const calculations = calculateZakat(formData, SILVER_PRICE_PER_OUNCE);
  
  const renderStep = () => {
    switch (currentStep.id) {
      case 'welcome':
        return <WelcomeStep onNext={goToNext} />;
      case 'currency':
        return <CurrencyStep data={formData} updateData={updateFormData} />;
      case 'nisab':
        return <NisabStep currency={formData.currency} />;
      case 'hawl':
        return <HawlStep />;
      case 'family':
        return <FamilyStep />;
      case 'categories':
        return <CategorySelectionStep data={formData} updateData={updateFormData} />;
      case 'email':
        return <EmailStep data={formData} updateData={updateFormData} />;
      case 'liquid-assets':
        return <LiquidAssetsStep data={formData} updateData={updateFormData} />;
      case 'precious-metals':
        return <PreciousMetalsStep data={formData} updateData={updateFormData} />;
      case 'investments':
        return <InvestmentsStep data={formData} updateData={updateFormData} />;
      case 'retirement':
        return <RetirementStep data={formData} updateData={updateFormData} />;
      case 'real-estate':
        return <RealEstateStep data={formData} updateData={updateFormData} />;
      case 'business':
        return <BusinessStep data={formData} updateData={updateFormData} />;
      case 'illiquid-assets':
        return <IlliquidAssetsStep data={formData} updateData={updateFormData} />;
      case 'debt-owed-to-you':
        return <DebtOwedToYouStep data={formData} updateData={updateFormData} />;
      case 'liabilities':
        return <LiabilitiesStep data={formData} updateData={updateFormData} />;
      case 'tax':
        return <TaxStep data={formData} updateData={updateFormData} />;
      case 'results':
        return <ResultsStep data={formData} calculations={calculations} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <ProgressBar 
            currentStep={currentStepIndex} 
            totalSteps={activeSteps.length}
            section={currentStep.section}
          />
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
