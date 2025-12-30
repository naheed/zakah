import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Lock, Calculator, Heart, Settings as SettingsIcon, FolderOpen, Trash2 } from "lucide-react";
import { Logo } from "../Logo";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUsageMetrics, formatLargeNumber, formatCount } from "@/hooks/useUsageMetrics";
import { Skeleton } from "@/components/ui/skeleton";
import { ReferralWidget } from "../ReferralWidget";
import { RecentCalculations } from "../RecentCalculations";
import { UserMenu } from "../UserMenu";
import { SavedCalculation } from "@/hooks/useSavedCalculations";
import { InteractiveDemo } from "../landing/InteractiveDemo";
import { Footer } from "../Footer";

interface WelcomeStepProps {
  onNext: () => void;
  onLoadCalculation?: (calculation: SavedCalculation) => void;
}

// Asset coverage inline text
const assetTypes = ["401(k)s", "Crypto", "Real Estate", "RSUs"];

export function WelcomeStep({ onNext, onLoadCalculation }: WelcomeStepProps) {
  const { user, signInWithGoogle } = useAuth();
  const { data: metrics, isLoading: metricsLoading } = useUsageMetrics();

  const handleLoadCalculation = (calc: SavedCalculation) => {
    if (onLoadCalculation) {
      onLoadCalculation(calc);
    }
  };

  // Logged-in user experience
  if (user) {
    return (
      <div className="min-h-[85vh] flex flex-col">
        {/* Header for logged-in users */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
          <Logo size="sm" />
          <div className="flex items-center gap-2">
            <Link to="/settings">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <SettingsIcon className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </Link>
            <UserMenu />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-6">
          <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6 md:gap-12 items-start">
            {/* Left Side - Personalized Dashboard */}
            <div className="order-2 md:order-1 space-y-6">
              <RecentCalculations 
                onLoadCalculation={handleLoadCalculation}
                limit={3}
              />

              <ReferralWidget variant="compact" />

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Quick Actions</h3>
                <div className="flex flex-wrap gap-2">
                  <Link to="/calculations">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FolderOpen className="w-3.5 h-3.5" />
                      All Calculations
                    </Button>
                  </Link>
                  <Link to="/methodology">
                    <Button variant="outline" size="sm" className="gap-2">
                      <BookOpen className="w-3.5 h-3.5" />
                      Methodology
                    </Button>
                  </Link>
                  <Link to="/settings#danger-zone">
                    <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Data
                    </Button>
                  </Link>
                </div>
              </div>

              {(metricsLoading || (metrics && metrics.allTime.calculations > 0)) && (
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                  {metricsLoading ? (
                    <Skeleton className="h-4 w-48" />
                  ) : metrics && (
                    <>
                      <span className="flex items-center gap-1">
                        <Calculator className="w-3 h-3 text-primary" />
                        {formatCount(metrics.allTime.calculations)} total calculations
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-primary" />
                        {formatLargeNumber(metrics.allTime.totalZakat)} Zakat calculated
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Right Side - CTA */}
            <div className="order-1 md:order-2 flex flex-col">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-2 tracking-tight">
              Start a New Calculation
            </h1>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Begin a fresh Zakat calculation for this year.
            </p>
              
              <Button onClick={onNext} size="lg" className="w-full sm:w-auto gap-2 text-base h-12 mb-3">
                New Calculation
                <ArrowRight className="w-4 h-4" />
              </Button>

              <p className="text-sm text-muted-foreground">
                Signed in as {user.email}
              </p>

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
      </div>
    );
  }

  // First-time user experience - optimized landing page
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Side - CTA (Primary focus) */}
          <div className="order-1 flex flex-col">
           {/* Brand Logo - Hero placement, sized to match headline */}
            <Logo size="lg" className="mb-6 h-16 md:h-20" />
            
            {/* Main Headline - Benefit-focused */}
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-3 tracking-tight leading-tight">
              Know Your Zakat<br />in 5 Minutes
            </h1>
            
            {/* Subhead with inline asset types */}
            <p className="text-lg font-light text-muted-foreground mb-6 leading-relaxed">
              Handles {assetTypes.join(" • ")}—we simplify the complexity.
            </p>
            
            {/* Primary CTA */}
            <Button onClick={onNext} size="lg" className="w-full sm:w-auto gap-2 text-base h-12 mb-4">
              Start Calculating
              <ArrowRight className="w-4 h-4" />
            </Button>

            {/* Consolidated Trust Badge */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Lock className="w-4 h-4 text-primary" />
              <span>Encrypted & grounded in Islamic scholarship</span>
            </div>

            {/* Sign-in Section - Simplified */}
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={signInWithGoogle}
                className="gap-2 h-10"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign in with Google
              </Button>
              <span className="text-xs text-muted-foreground">to save calculations</span>
            </div>
          </div>

          {/* Right Side - Interactive Demo (Proof) */}
          <div className="order-2">
            <InteractiveDemo />
            
            {/* Usage Metrics - Social Proof (only show when 5+ unique sessions for privacy) */}
            {!metricsLoading && metrics && metrics.allTime.uniqueSessions >= 5 && (
              <p className="mt-6 text-center text-sm text-muted-foreground">
                We've helped evaluate{' '}
                <span className="font-medium text-foreground">{formatLargeNumber(metrics.allTime.totalAssets)}+</span>{' '}
                in assets and calculate{' '}
                <span className="font-medium text-foreground">{formatLargeNumber(metrics.allTime.totalZakat)}+</span>{' '}
                in Zakat.
              </p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
