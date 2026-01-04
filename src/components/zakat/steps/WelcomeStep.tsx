import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Lock,
  Calculator,
  Heart,
  GearSix,
  FolderOpen,
  Trash,
  CheckCircle,
  Play,
  SignIn,
} from "@phosphor-icons/react";
import { Logo } from "../Logo";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUsageMetrics } from "@/hooks/useUsageMetrics";
import { useAssetPersistence } from "@/hooks/useAssetPersistence";
import { useZakatPersistence } from "@/hooks/useZakatPersistence";
import { formatLargeNumber, formatCount } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricsDisplay } from "../MetricsDisplay";
import { ReferralWidget } from "../ReferralWidget";
import { RecentCalculations } from "../RecentCalculations";
import { UserMenu } from "../UserMenu";
import { SavedCalculation } from "@/hooks/useSavedCalculations";
import { InteractiveDemo } from "../landing/InteractiveDemo";
import { Footer } from "../Footer";
import { AccountCard } from "@/components/assets/AccountCard";
import { Card, CardContent } from "@/components/ui/card";
import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { AssetAccount } from "@/types/assets";
import { ImpactStats } from "../ImpactStats";
import { useSavedCalculations } from "@/hooks/useSavedCalculations";
import { formatCurrency, calculateZakat, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE } from "@/lib/zakatCalculations";
import { useReferral } from "@/hooks/useReferral";
import { MiniReportWidget } from "../dashboard/MiniReportWidget";

interface WelcomeStepProps {
  onNext: () => void;
  onLoadCalculation?: (calculation: SavedCalculation) => void;
  onViewResults?: () => void;
}

// Asset coverage badges
const assetTypes = ["401(k) / IRA", "Crypto & NFTs", "Real Estate", "Stocks & RSUs"];

export function WelcomeStep({ onNext, onLoadCalculation, onViewResults }: WelcomeStepProps) {
  const { user, signInWithGoogle } = useAuth();
  const { data: metrics, isLoading: metricsLoading } = useUsageMetrics();
  const { stats: userStats, fetchStats: fetchUserStats } = useReferral();
  const { fetchAccounts } = useAssetPersistence();
  const { stepIndex, uploadedDocuments, lastUpdated, startFresh, reportReady, formData } = useZakatPersistence();
  const [accounts, setAccounts] = useState<AssetAccount[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(false);

  // Determine if anonymous user has an existing session
  const hasLocalSession = stepIndex > 0 || uploadedDocuments.length > 0;


  // Fetch accounts for logged-in user
  useEffect(() => {
    if (user) {
      setAccountsLoading(true);
      fetchAccounts().then(data => {
        setAccounts(data);
        setAccountsLoading(false);
      });
      // Fetch user referral stats
      fetchUserStats();
    }
  }, [user, fetchAccounts, fetchUserStats]);

  // Determine which stats to show
  const showUserImpact = userStats && userStats.totalReferrals > 5;
  const impactData = showUserImpact ? {
    title: "Your Impact",
    referrals: userStats.totalReferrals,
    assets: userStats.totalAssetsCalculated,
    zakat: userStats.totalZakatCalculated,
  } : {
    title: "Community Impact",
    referrals: metrics?.allTime.uniqueSessions || 0,
    assets: metrics?.allTime.totalAssets,
    zakat: metrics?.allTime.totalZakat,
  };

  // Get user's first name
  const firstName = user?.user_metadata?.full_name?.split(' ')[0];

  // ... rest of component ...

  // Replace lines 150-162 (ImpactStats render)
  // ...




  const handleLoadCalculation = (calc: SavedCalculation) => {
    if (onLoadCalculation) {
      onLoadCalculation(calc);
    }
  };

  const handleViewLocalReport = () => {
    if (onViewResults) {
      onViewResults();
    } else {
      onNext();
    }
  };

  // Format relative time for last updated
  const getRelativeTime = () => {
    if (!lastUpdated) return '';
    const now = new Date();
    const diff = now.getTime() - lastUpdated.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  // Fetch saved calculations for the Summary Card
  const { calculations: savedCalculations, loading: savedLoading } = useSavedCalculations();
  const latestCalculation = savedCalculations[0];

  // Calculate local results if report is ready (for Guest users)
  const localResult = reportReady ? calculateZakat(formData, SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE) : null;
  const displayZakatDue = latestCalculation ? latestCalculation.zakat_due : (localResult ? localResult.zakatDue : 0);

  console.debug('[WelcomeStep] Render State:', {
    hasLocalSession,
    reportReady,
    stepIndex,
    isUser: !!user,
    hasLatestCalc: !!latestCalculation,
    displayZakatDue
  });

  // UNIFIED DASHBOARD - shown to logged-in users OR anonymous users with session OR if report is ready OR if they have history
  // Also show if loading history to prevent flash of landing page
  if (user || hasLocalSession || reportReady || latestCalculation || savedLoading) {
    return (
      <div className="min-h-[85vh] flex flex-col font-work-sans">
        {/* Header - Minimal */}
        <div className="flex items-center justify-between px-6 py-4">
          <Logo size="md" />
          <div className="flex items-center gap-2">
            {!user && (
              <Link to="/settings">
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                  <GearSix className="h-5 w-5" weight="bold" />
                  <span className="sr-only">Settings</span>
                </Button>
              </Link>
            )}
            {user && <UserMenu />}
          </div>
        </div>

        <div className="flex-1 px-4 md:px-6 py-8 md:py-12 overflow-y-auto">
          <div className="w-full max-w-3xl mx-auto space-y-12">

            {/* 1. Hero Section: Greeting & Impact */}
            <div className="space-y-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-4">
                  Welcome back{firstName ? `, ${firstName}` : ''}
                </h1>

                {/* Impact Stats moved below Report Card */}
              </motion.div>
            </div>

            {/* 2. Primary Action Area */}
            <div className="space-y-6">

              {/* DASHBOARD LOGIC */}

              {/* 1. Continue In Progress (Priority: High) */}
              {hasLocalSession && !reportReady && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4 px-1">
                      <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">In Progress</h2>
                    </div>
                    <Card className="border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group shadow-lg shadow-primary/5" onClick={onNext}>
                      <CardContent className="p-6 md:p-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                            <Play weight="fill" className="w-6 h-6 ml-0.5" />
                          </div>
                          <div>
                            <p className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Continue where you left off</p>
                            <p className="text-muted-foreground">Step {stepIndex + 1} • Saved {getRelativeTime()}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </CardContent>
                    </Card>
                    <div className="text-center mt-3">
                      <Button variant="link" size="sm" onClick={() => { startFresh(); onNext(); }} className="text-muted-foreground hover:text-destructive text-xs">
                        Discard and start over
                      </Button>
                    </div>
                  </div>

                  {/* If user also has a past report, show it as a secondary widget */}
                  {latestCalculation && !savedLoading && (
                    <div className="pt-2 border-t border-dashed border-border/50">
                      <div className="flex items-center justify-between mb-3 px-1 mt-4">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Past Reports</h2>
                        <Link to="/calculations" className="text-xs text-primary hover:underline">View All</Link>
                      </div>
                      <MiniReportWidget calculation={latestCalculation} onLoad={handleLoadCalculation} />
                    </div>
                  )}
                </motion.div>
              )}

              {/* 2. Latest Report Hero (if NO active session or if Report Ready) */}
              {((latestCalculation && !savedLoading) || reportReady || savedLoading) && (!hasLocalSession || reportReady) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-4 px-1">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Latest Report</h2>
                    <Link to="/calculations" className="text-xs font-medium text-primary hover:underline">
                      View all history →
                    </Link>
                  </div>

                  {savedLoading ? (
                    <Skeleton className="h-[200px] w-full rounded-xl" />
                  ) : (
                    <Card
                      className="border-0 ring-1 ring-border/50 bg-gradient-to-br from-card to-muted/20 hover:to-muted/40 transition-all cursor-pointer group relative overflow-hidden shadow-xl shadow-primary/5"
                      onClick={() => latestCalculation ? handleLoadCalculation(latestCalculation) : handleViewLocalReport()}
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Calculator size={120} weight="fill" />
                      </div>

                      <CardContent className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between relative z-10">
                        <div>
                          <div className="flex items-center gap-2 mb-2 text-primary/80 font-medium text-sm">
                            <CheckCircle weight="fill" />
                            <span>Calculated {getRelativeTime() || 'recently'}</span>
                          </div>
                          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                            {formatCurrency(displayZakatDue || 0)}
                          </h3>
                          <p className="text-muted-foreground font-medium">Zakat Due</p>
                        </div>

                        <Button size="lg" className="shrink-0 gap-2 rounded-full px-6 h-12 shadow-lg shadow-primary/20">
                          View Full Report
                          <ArrowRight weight="bold" />
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Start New Button below Report */}
                  <div className="flex justify-center pt-6 pb-8">
                    <Button variant="outline" onClick={() => { startFresh(); onNext(); }} className="gap-2 text-muted-foreground hover:text-foreground">
                      <Calculator className="w-4 h-4" />
                      Start a new calculation
                    </Button>
                  </div>

                  {/* Impact Stats - Community or Personal (Moved Here) */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col items-center gap-8 border-t border-border/50 pt-8"
                  >
                    {(metrics || metricsLoading || userStats) ? (
                      <>
                        <ImpactStats
                          variant="flat"
                          isLoading={metricsLoading && !userStats}
                          totalReferrals={impactData.referrals}
                          totalAssetsCalculated={impactData.assets}
                          totalZakatCalculated={impactData.zakat}
                          title={impactData.title}
                          className="scale-90 md:scale-100 origin-top"
                        />
                        <div className="w-full max-w-md">
                          <ReferralWidget
                            variant="full"
                            title={showUserImpact ? undefined : "Join the movement"}
                          />
                        </div>
                      </>
                    ) : (
                      // Skeleton loader to prevent layout shift ("glitchy load")
                      <div className="w-full max-w-md space-y-4">
                        <Skeleton className="h-24 w-full rounded-xl" />
                        <Skeleton className="h-32 w-full rounded-xl" />
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}

              {/* 3. Empty State (Start New) - Only if NOTHING else matches */}
              {(!latestCalculation || !user) && !hasLocalSession && !reportReady && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-center"
                >
                  <Button
                    onClick={onNext}
                    size="lg"
                    className="h-16 px-10 text-lg rounded-full shadow-2xl shadow-primary/20 hover:scale-105 transition-transform"
                  >
                    <div className="flex items-center gap-3">
                      <Calculator weight="fill" className="w-6 h-6" />
                      <span>Start New Calculation</span>
                    </div>
                  </Button>
                </motion.div>
              )}

            </div>

            {/* 3. Auth Prompt (Anonymous Only) */}
            {!user && (
              <div className="max-w-md mx-auto">
                <Card className="border-dashed border-2 bg-muted/30">
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm">
                      <Lock className="w-5 h-5 text-muted-foreground" weight="duotone" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Sign in to save your progress</p>
                      <p className="text-sm text-muted-foreground mt-1">Sync across devices and verify your history.</p>
                    </div>
                    <Button variant="default" onClick={signInWithGoogle} className="w-full gap-2">
                      <SignIn className="w-4 h-4" />
                      Sign in with Google
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 4. Assets Section - Option A: Minimal List */}
            {user && (
              <div className="pt-8 border-t border-border/50">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-muted-foreground flex items-center gap-2">
                    <FolderOpen className="w-4 h-4" />
                    Assets
                  </h3>
                  <Link to="/assets" className="text-xs text-primary hover:underline">Manage All</Link>
                </div>

                {accountsLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : accounts.length > 0 ? (
                  <div className="space-y-4">
                    {/* Total Value Header */}
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Value</p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatCurrency(accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0))}
                      </p>
                    </div>

                    {/* Account List */}
                    <div className="space-y-2">
                      {accounts.slice(0, 4).map(acc => (
                        <Link
                          key={acc.id}
                          to={`/assets/${acc.id}`}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border/50 group"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                              {acc.name || 'Unnamed Account'}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-2">
                              <span>{acc.institution_name}</span>
                              <span className="text-muted-foreground/50">•</span>
                              <span>Added {new Date(acc.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </p>
                          </div>
                          <p className="font-semibold text-foreground ml-4">
                            {formatCurrency(acc.balance || 0)}
                          </p>
                        </Link>
                      ))}
                      {accounts.length > 4 && (
                        <p className="text-xs text-muted-foreground text-center py-2">
                          +{accounts.length - 4} more accounts
                        </p>
                      )}
                    </div>

                    {/* Add Account Button */}
                    <Link to="/assets/add">
                      <Button variant="outline" className="w-full">
                        + Add Account
                      </Button>
                    </Link>
                  </div>
                ) : (
                  /* Empty State */
                  <div className="text-center py-8 border border-dashed border-border rounded-lg">
                    <FolderOpen className="w-8 h-8 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-sm text-muted-foreground mb-4">No accounts added yet</p>
                    <Link to="/assets/add">
                      <Button variant="outline" size="sm">
                        + Add Account
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Standard Footer */}
        <Footer />

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
          <motion.div className="order-1 flex flex-col" variants={containerVariants} initial="hidden" animate="visible">
            {/* Brand Logo - Hero placement */}
            <motion.div variants={itemVariants} className="mb-8">
              <Logo size="lg" className="h-16 md:h-20 -ml-1" />
            </motion.div>

            {/* Main Headline - Display Style */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight leading-[1.1]"
            >
              Zakat,<br />
              <span className="text-primary">Clarified.</span>
            </motion.h1>

            {/* Asset Types Badges */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-8">
              {assetTypes.map((asset, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/50 border border-border text-sm font-medium text-muted-foreground"
                >
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
              Calculate your obligations with confidence. We help you navigate the complexity of modern assets—from RSUs to Crypto—so you can make informed choices.
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8"
              >
                <MetricsDisplay
                  assets={metrics.allTime.totalAssets}
                  zakat={metrics.allTime.totalZakat}
                />
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
