import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Lock, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ZakatSankeyMock } from "../ZakatSankeyChart";

interface WelcomeStepProps {
  onNext: () => void;
}

function MockReportPreview() {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Glassmorphic card effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl" />
      
      <div className="relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-4 sm:p-6 shadow-lg">
        {/* Header */}
        <div className="text-center mb-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Your Zakat Due</p>
          <p className="text-3xl sm:text-4xl font-bold text-primary">$3,346</p>
          <p className="text-sm text-muted-foreground mt-1">2.5% of zakatable wealth</p>
        </div>

        {/* Sankey Chart - centered */}
        <div className="flex justify-center items-center py-4">
          <ZakatSankeyMock />
        </div>

        {/* Summary row */}
        <div className="pt-4 border-t border-border flex justify-between text-sm">
          <span className="text-muted-foreground">Net Zakatable Wealth</span>
          <span className="font-semibold text-foreground">$133,850</span>
        </div>
      </div>
    </div>
  );
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const { user, signInWithGoogle } = useAuth();

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6 md:gap-12 items-center">
        {/* Left Side - Mock Report Preview */}
        <div className="order-2 md:order-1">
          <MockReportPreview />
          
          {/* CTA pointer for mobile - hidden on desktop */}
          <div className="mt-4 flex justify-center md:hidden">
            <button 
              onClick={onNext}
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <span>Start calculating above</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          {/* Trust indicators below preview */}
          <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Check className="w-3 h-3 text-primary" /> Based on scholarly guidance
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3 h-3 text-primary" /> 401(k), IRA, crypto
            </span>
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-primary" /> Private & secure
            </span>
          </div>
        </div>

        {/* Right Side - CTA */}
        <div className="order-1 md:order-2 flex flex-col">
          {/* Headline */}
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 tracking-tight">
            Calculate Your Zakat
          </h1>
          <p className="text-muted-foreground mb-6">
            Get your personalized Zakat calculation in under 2 minutes.
          </p>
          
          {/* Primary CTA */}
          <Button onClick={onNext} size="lg" className="w-full sm:w-auto gap-2 text-base h-12 mb-3">
            Start Calculating
            <ArrowRight className="w-4 h-4" />
          </Button>

          {/* Login Option for Non-Logged In Users */}
          {!user && (
            <>
              <div className="relative w-full sm:w-auto my-3">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">or continue with</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={signInWithGoogle}
                className="w-full sm:w-auto gap-2 h-10"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </Button>
              
              <p className="text-xs text-muted-foreground mt-3">
                Sign in to securely retrieve your previous calculations
              </p>
            </>
          )}

          {user && (
            <p className="text-sm text-muted-foreground">
              Signed in as {user.email}
            </p>
          )}

          {/* Footer Links */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <Link 
                to="/methodology" 
                className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <BookOpen className="w-3 h-3" />
                Methodology
              </Link>
              <span className="text-muted-foreground/50">•</span>
              <Link 
                to="/privacy" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-muted-foreground/50">•</span>
              <Link 
                to="/terms" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Built by Naheed Vora • Provided as-is
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Questions or feedback? <a href="mailto:naheed@vora.dev" className="text-primary hover:underline">naheed@vora.dev</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
