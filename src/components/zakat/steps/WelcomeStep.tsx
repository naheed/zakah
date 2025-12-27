import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Calculator, BookOpen } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="flex flex-col items-center text-center max-w-2xl mx-auto py-8">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <Calculator className="w-10 h-10 text-primary" />
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
        Calculate Your Zakat
      </h1>
      
      <p className="text-lg text-muted-foreground mb-8 max-w-lg">
        A comprehensive Zakat calculator based on authentic Islamic scholarship, 
        tailored for modern financial instruments and US tax-advantaged accounts.
      </p>
      
      <div className="grid gap-4 w-full max-w-md mb-8">
        <FeatureItem
          icon={<Shield className="w-5 h-5" />}
          title="Privacy First"
          description="Your data stays private and secure"
        />
        <FeatureItem
          icon={<BookOpen className="w-5 h-5" />}
          title="Scholarly Guidance"
          description="Based on Sheikh Joe Bradford's methodology"
        />
        <FeatureItem
          icon={<Calculator className="w-5 h-5" />}
          title="Complete Coverage"
          description="Stocks, crypto, retirement accounts & more"
        />
      </div>
      
      <Button onClick={onNext} size="lg" className="gap-2 text-lg px-8">
        Get Started
        <ArrowRight className="w-5 h-5" />
      </Button>
      
      <p className="text-sm text-muted-foreground mt-6">
        Takes about 10-15 minutes to complete
      </p>
    </div>
  );
}

function FeatureItem({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border text-left">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
