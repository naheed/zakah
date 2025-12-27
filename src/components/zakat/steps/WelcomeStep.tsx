import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="flex flex-col items-center text-center max-w-lg mx-auto py-12 px-4">
      {/* Logo/Icon */}
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
        <span className="text-3xl">🕌</span>
      </div>
      
      {/* Main Headline */}
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
        Calculate Your Zakat
      </h1>
      
      {/* Subheadline */}
      <p className="text-lg text-muted-foreground mb-8">
        A simple, scholarly approach for US Muslims
      </p>
      
      {/* Trust Indicators */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-10">
        <span>✓ Based on Sheikh Joe Bradford</span>
        <span>✓ 401(k), IRA, crypto & more</span>
        <span>✓ Private & secure</span>
      </div>
      
      {/* CTA Button */}
      <Button onClick={onNext} size="lg" className="gap-2 text-base px-8 h-12">
        Get Started
        <ArrowRight className="w-4 h-4" />
      </Button>
      
      {/* Time Estimate */}
      <p className="text-sm text-muted-foreground mt-6">
        Most people finish in 5 minutes
      </p>
    </div>
  );
}
