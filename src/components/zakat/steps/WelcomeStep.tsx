import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Lock, Calculator, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const { user, signInWithGoogle } = useAuth();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Left Side - Introduction */}
        <div className="space-y-6">
          {/* Logo/Icon */}
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="text-2xl">🕌</span>
          </div>
          
          {/* Main Headline */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
              ZakatFlow
            </h1>
            <p className="text-lg text-muted-foreground">
              A comprehensive Zakat calculator for US Muslims, covering modern financial instruments.
            </p>
          </div>

          {/* Features */}
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="p-1.5 rounded-md bg-primary/10 mt-0.5">
                <Calculator className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">401(k), IRA, Stocks & Crypto</p>
                <p className="text-sm text-muted-foreground">Handles complex modern assets with scholarly guidance</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="p-1.5 rounded-md bg-primary/10 mt-0.5">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Based on Sheikh Joe Bradford</p>
                <p className="text-sm text-muted-foreground">Follows AMJA-aligned methodology</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="p-1.5 rounded-md bg-primary/10 mt-0.5">
                <Lock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Private & Secure</p>
                <p className="text-sm text-muted-foreground">Your financial data stays yours</p>
              </div>
            </li>
          </ul>

          {/* Methodology Link */}
          <div className="pt-2">
            <Link 
              to="/methodology" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Learn about our methodology & references
            </Link>
          </div>

          {/* Attribution */}
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Built by <span className="font-medium text-foreground">Naheed Vora</span>. 
              Provided on an as-is basis. This calculator is for informational purposes only 
              and does not constitute religious advice.
            </p>
          </div>
        </div>

        {/* Right Side - CTA */}
        <div className="flex flex-col items-center text-center p-8 md:p-10 rounded-2xl bg-muted/30 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {user ? "Welcome back!" : "Ready to calculate?"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {user 
              ? "Continue where you left off." 
              : "Most people finish in under 5 minutes."}
          </p>
          
          {/* Primary CTA */}
          <Button onClick={onNext} size="lg" className="w-full gap-2 text-base h-12 mb-4">
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Button>

          {/* Login Option for Non-Logged In Users */}
          {!user && (
            <>
              <div className="relative w-full my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-muted/30 px-2 text-muted-foreground">or</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={signInWithGoogle}
                className="w-full gap-2 h-11"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </Button>
              
              <p className="text-xs text-muted-foreground mt-4">
                Sign in to save and share calculations
              </p>
            </>
          )}

          {/* Logged in user info */}
          {user && (
            <p className="text-sm text-muted-foreground">
              Signed in as {user.email}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
