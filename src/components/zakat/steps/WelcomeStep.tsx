
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Lock, Calculator, Heart, GearSix, FolderOpen, Trash, CheckCircle } from "@phosphor-icons/react";
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
import { motion, Variants } from "framer-motion";

interface WelcomeStepProps {
  onNext: () => void;
  onLoadCalculation?: (calculation: SavedCalculation) => void;
}

// Asset coverage badges
const assetTypes = ["401(k) / IRA", "Crypto & NFTs", "Real Estate", "Stocks & RSUs"];

export function WelcomeStep({ onNext, onLoadCalculation }: WelcomeStepProps) {
  const { user, signInWithGoogle } = useAuth();
  const { data: metrics, isLoading: metricsLoading } = useUsageMetrics();

  const handleLoadCalculation = (calc: SavedCalculation) => {
    if (onLoadCalculation) {
      onLoadCalculation(calc);
    }
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
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
                <GearSix className="h-4 w-4" weight="bold" />
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
                      <FolderOpen className="w-3.5 h-3.5" weight="duotone" />
                      All Calculations
                    </Button>
                  </Link>
                  <Link to="/methodology">
                    <Button variant="outline" size="sm" className="gap-2">
                      <BookOpen className="w-3.5 h-3.5" weight="duotone" />
                      Methodology
                    </Button>
                  </Link>
                  <Link to="/settings#danger-zone">
                    <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
                      <Trash className="w-3.5 h-3.5" weight="duotone" />
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
                        <Calculator className="w-3 h-3 text-primary" weight="fill" />
                        {formatCount(metrics.allTime.calculations)} total calculations
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-primary" weight="fill" />
                        {formatLargeNumber(metrics.allTime.totalZakat)} Zakat calculated
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Right Side - CTA */}
            <div className="order-1 md:order-2 flex flex-col">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-2 tracking-tight">
                  Start a New Calculation
                </h1>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Begin a fresh Zakat calculation for this year.
                </p>

                <Button onClick={onNext} size="lg" className="w-full sm:w-auto gap-2 text-base h-12 mb-3 shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30">
                  New Calculation
                  <ArrowRight className="w-4 h-4" weight="bold" />
                </Button>

                <p className="text-sm text-muted-foreground">
                  Signed in as {user.email}
                </p>
              </motion.div>

              {/* Footer Links */}
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                  <Link
                    to="/methodology"
                    className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <BookOpen className="w-3 h-3" weight="duotone" />
                    Methodology
                  </Link>
                  <span className="text-muted-foreground/50">•</span>
                  <Link
                    to="/privacy"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy
                  </Link>
                  <span className="text-muted-foreground/50">•</span>
                  <Link
                    to="/terms"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Terms
                  </Link>
                  <span className="text-muted-foreground/50">•</span>
                  <Link
                    to="/about"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    About
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Questions? <a href="mailto:naheed@vora.dev" className="text-primary hover:underline">naheed@vora.dev</a>
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
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-8 md:py-12 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-tertiary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 md:gap-16 items-center relative z-10">
          {/* Left Side - CTA (Primary focus) */}
          <motion.div
            className="order-1 flex flex-col"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Brand Logo - Hero placement */}
            <motion.div variants={itemVariants} className="mb-8">
              <Logo size="lg" className="h-16 md:h-20 -ml-1" />
            </motion.div>

            {/* Main Headline - Display Style */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight leading-[1.1]"
            >
              Know Your Zakat<br />
              <span className="text-primary">in 5 Minutes</span>
            </motion.h1>

            {/* Asset Types Badges */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-2 mb-8"
            >
              {assetTypes.map((asset, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/50 border border-border text-sm font-medium text-muted-foreground">
                  <CheckCircle className="w-3.5 h-3.5 text-primary" weight="fill" />
                  {asset}
                </span>
              ))}
            </motion.div>

            {/* Subhead */}
            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg"
            >
              The most accurate Zakat calculator for modern finances. We handle the complexity of complex assets so you can fulfill your obligation with confidence.
            </motion.p>

            {/* Primary CTA */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                onClick={onNext}
                size="lg"
                className="gap-2 text-base h-12 px-8 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
              >
                Start Calculating
                <ArrowRight className="w-4 h-4" weight="bold" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={signInWithGoogle}
                className="gap-2 h-12 px-6 bg-background hover:bg-muted/50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign in to Save
              </Button>
            </motion.div>

            {/* Trust Badge */}
            <motion.div variants={itemVariants} className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/5 text-primary font-medium">
                <Lock className="w-3.5 h-3.5" weight="duotone" />
                Zero-Knowledge Encryption
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/5 text-primary font-medium">
                <Trash className="w-3.5 h-3.5" weight="duotone" />
                Session-Only Storage
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Interactive Demo (Proof) */}
          <motion.div
            className="order-2 relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="relative z-10 transform md:scale-105 transition-transform duration-700 hover:scale-[1.07]">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-tertiary/30 rounded-2xl blur-lg opacity-40" />
              <InteractiveDemo />
            </div>

            {/* Usage Metrics */}
            {!metricsLoading && metrics && metrics.allTime.uniqueSessions >= 5 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 text-center text-sm text-muted-foreground"
              >
                Trusted by thousands to calculate over{' '}
                <span className="font-semibold text-foreground">{formatLargeNumber(metrics.allTime.totalZakat)}</span>{' '}
                in Zakat.
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
