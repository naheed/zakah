import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Lock, Shield, Calculator, DollarSign, Heart, Settings as SettingsIcon, FolderOpen, Trash2, Landmark, Bitcoin, Building2, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ZakatSankeyMock } from "../ZakatSankeyChart";
import { useUsageMetrics, formatLargeNumber, formatCount } from "@/hooks/useUsageMetrics";
import { Skeleton } from "@/components/ui/skeleton";
import { ReferralWidget } from "../ReferralWidget";
import { RecentCalculations } from "../RecentCalculations";
import { UserMenu } from "../UserMenu";
import { SavedCalculation } from "@/hooks/useSavedCalculations";
import { HowItWorks } from "../landing/HowItWorks";
import { AssetTypeGrid } from "../landing/AssetTypeGrid";
import { MethodologyTeaser } from "../landing/MethodologyTeaser";

interface WelcomeStepProps {
  onNext: () => void;
  onLoadCalculation?: (calculation: SavedCalculation) => void;
}

// Asset coverage badges for first-time users
const assetBadges = [
  { icon: Landmark, label: "401(k) & IRA" },
  { icon: Bitcoin, label: "Crypto" },
  { icon: Building2, label: "Real Estate" },
  { icon: Briefcase, label: "RSUs & ESPP" },
];

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

        {/* Sankey Chart - centered with animation */}
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

// Trust badges for the hero section
function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center gap-3 mt-4">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
        <Shield className="w-4 h-4 text-primary" />
        <span>Private & Secure</span>
      </div>
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
        <Lock className="w-4 h-4 text-primary" />
        <span>Data stays local</span>
      </div>
    </div>
  );
}

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
          <span className="text-lg font-bold bg-gradient-to-r from-[#1e4d7a] to-[#4ade80] bg-clip-text text-transparent">
            Zakat Flow
          </span>
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
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 tracking-tight">
                Start a New Calculation
              </h1>
              <p className="text-muted-foreground mb-6">
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

  // First-time user experience - full landing page
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-12 md:py-16">
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Side - Mock Report Preview */}
          <div className="order-2 md:order-1">
            <MockReportPreview />
            
            {/* Usage Metrics - Social Proof */}
            {(metricsLoading || (metrics && metrics.allTime.calculations > 0)) && (
              <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm">
                {metricsLoading ? (
                  <>
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-32" />
                  </>
                ) : metrics && (
                  <>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Calculator className="w-4 h-4 text-primary" />
                      <span className="font-medium text-foreground">{formatCount(metrics.allTime.calculations)}</span> calculations
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="font-medium text-foreground">{formatLargeNumber(metrics.allTime.totalAssets)}</span> evaluated
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Heart className="w-4 h-4 text-primary" />
                      <span className="font-medium text-foreground">{formatLargeNumber(metrics.allTime.totalZakat)}</span> Zakat calculated
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right Side - CTA */}
          <div className="order-1 md:order-2 flex flex-col">
            {/* Brand Name */}
            <span className="text-2xl font-bold bg-gradient-to-r from-[#1e4d7a] to-[#4ade80] bg-clip-text text-transparent mb-4">
              Zakat Flow
            </span>
            
            {/* Main Headline - Benefit-focused */}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight leading-tight">
              Know Your Zakat<br />in 2 Minutes
            </h1>
            
            {/* Subhead - Address complexity */}
            <p className="text-lg text-muted-foreground mb-4">
              401(k)s, crypto, rental income—we handle the complexity.
            </p>

            {/* Asset Coverage Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {assetBadges.map((badge, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="gap-1.5 px-3 py-1 text-xs font-medium"
                >
                  <badge.icon className="w-3.5 h-3.5" />
                  {badge.label}
                </Badge>
              ))}
            </div>
            
            {/* Primary CTA */}
            <Button onClick={onNext} size="lg" className="w-full sm:w-auto gap-2 text-base h-12 mb-3">
              Start Calculating
              <ArrowRight className="w-4 h-4" />
            </Button>

            {/* Trust Badges */}
            <TrustBadges />

            {/* Login Option */}
            <div className="mt-6">
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
                Sign in to securely save your calculations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Asset Type Coverage Grid */}
      <AssetTypeGrid />

      {/* Methodology Teaser */}
      <MethodologyTeaser />

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
            <Link 
              to="/methodology" 
              className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Methodology
            </Link>
            <span className="text-muted-foreground/50">•</span>
            <Link 
              to="/privacy" 
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-muted-foreground/50">•</span>
            <Link 
              to="/terms" 
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
          <div className="text-center text-xs text-muted-foreground space-y-1">
            <p>Built by Naheed Vora • Provided as-is</p>
            <p>Questions or feedback? <a href="mailto:naheed@vora.dev" className="text-primary hover:underline">naheed@vora.dev</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
