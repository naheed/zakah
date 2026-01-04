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
import { useReferral } from "@/hooks/useReferral";

// ... existing imports ...

export function WelcomeStep({ onNext, onLoadCalculation }: WelcomeStepProps) {
  const { user, signInWithGoogle } = useAuth();
  const { data: metrics, isLoading: metricsLoading } = useUsageMetrics();
  const { stats: userStats, fetchStats: fetchUserStats } = useReferral();
  const { fetchAccounts } = useAssetPersistence();
  const { stepIndex, uploadedDocuments, lastUpdated, startFresh } = useZakatPersistence();
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
    footer: null
  } : {
    title: "Community Impact",
    referrals: metrics?.allTime.uniqueSessions || 0,
    assets: metrics?.allTime.totalAssets,
    zakat: metrics?.allTime.totalZakat,
    footer: (
      <div className="pt-4 text-xs text-muted-foreground">
        <p className="font-medium text-amber-900/80 dark:text-amber-100/80 mb-1">Join the movement</p>
        <p className="text-muted-foreground/70">
          Help 5 people calculate their Zakat to unlock your personal impact dashboard.
        </p>
      </div>
    )
  };

  // Get user's first name
  const firstName = user?.user_metadata?.full_name?.split(' ')[0];

  // ... rest of component ...

  // Replace lines 150-162 (ImpactStats render)
  // ...


  // Get user's first name
  const firstName = user?.user_metadata?.full_name?.split(' ')[0];

  const handleLoadCalculation = (calc: SavedCalculation) => {
    if (onLoadCalculation) {
      onLoadCalculation(calc);
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

  // UNIFIED DASHBOARD - shown to logged-in users OR anonymous users with session
  if (user || hasLocalSession) {
    return (
      <div className="min-h-[85vh] flex flex-col font-work-sans">
        {/* Header - Minimal, no sign-in button here (moved to center card for anon) */}
        <div className="flex items-center justify-between px-6 py-4">
          <Logo size="sm" />
          <div className="flex items-center gap-2">
            <Link to="/settings">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                <GearSix className="h-5 w-5" weight="bold" />
                <span className="sr-only">Settings</span>
              </Button>
            </Link>
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

                {/* Impact Widget - Top Motivation */}
                {/* Impact Widget - Top Motivation */}
                {(metrics || metricsLoading || userStats) && (
                  <div className="flex justify-center mt-6">
                    <ImpactStats
                      variant="flat"
                      isLoading={metricsLoading && !userStats}
                      totalReferrals={impactData.referrals}
                      totalAssetsCalculated={impactData.assets}
                      totalZakatCalculated={impactData.zakat}
                      title={impactData.title}
                      footer={impactData.footer}
                      className="scale-90 md:scale-100 origin-top"
                    />
                  </div>
                )}
              </motion.div>
            </div>

            {/* 2. Primary Action Area */}
            <div className="space-y-6">

              {/* Scenario A: User has a saved calculation (Hero Summary) */}
              {user && latestCalculation && !savedLoading && (
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

                  <Card
                    className="border-0 ring-1 ring-border/50 bg-gradient-to-br from-card to-muted/20 hover:to-muted/40 transition-all cursor-pointer group relative overflow-hidden shadow-xl shadow-primary/5"
                    onClick={() => handleLoadCalculation(latestCalculation)}
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
                          {formatCurrency(latestCalculation.zakat_due || 0)}
                        </h3>
                        <p className="text-muted-foreground font-medium">Zakat Due</p>
                      </div>

                      <Button size="lg" className="shrink-0 gap-2 rounded-full px-6 h-12 shadow-lg shadow-primary/20">
                        View Full Report
                        <ArrowRight weight="bold" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Scenario B: Anonymous Session (Continue) */}
              {!user && hasLocalSession && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-4 px-1">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">In Progress</h2>
                  </div>
                  <Card className="border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group" onClick={onNext}>
                    <CardContent className="p-6 md:p-8 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                          <Play weight="fill" className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Continue where you left off</p>
                          <p className="text-muted-foreground">Step {stepIndex + 1} • Saved {getRelativeTime()}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardContent>
                  </Card>
                  <div className="text-center mt-4">
                    <Button variant="link" size="sm" onClick={startFresh} className="text-muted-foreground hover:text-destructive">
                      Start over completely
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Scenario C: No Data (Start New) - Only show if NO latest calculation used as hero */}
              {(!latestCalculation || !user) && !hasLocalSession && (
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

              {/* Always show "Start New" as a secondary option if Hero is present */}
              {user && latestCalculation && (
                <div className="flex justify-center pt-4">
                  <Button variant="outline" onClick={onNext} className="gap-2 text-muted-foreground hover:text-foreground">
                    <Calculator className="w-4 h-4" />
                    Start a new calculation
                  </Button>
                </div>
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

            {/* 4. Secondary Features (Assets & Referrals) */}
            {user && (
              <div className="grid md:grid-cols-2 gap-6 pt-8 border-t border-border/50">
                {/* Assets Mini-Dashboard */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-muted-foreground flex items-center gap-2">
                      <FolderOpen className="w-4 h-4" />
                      Assets
                    </h3>
                    <Link to="/assets" className="text-xs text-primary hover:underline">Manage All</Link>
                  </div>

                  {/* Quick Add Button */}
                  <Link to="/assets/add">
                    <Button variant="outline" className="w-full h-auto py-4 justify-start gap-4 hover:border-primary hover:bg-primary/5 group">
                      <div className="w-8 h-8 rounded-full bg-muted group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                        <span className="text-xl leading-none mb-0.5 text-muted-foreground group-hover:text-primary">+</span>
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-foreground">Connect Account</div>
                        <div className="text-xs text-muted-foreground">Link bank, crypto, or manual entry</div>
                      </div>
                    </Button>
                  </Link>

                  {/* Account List Summary */}
                  <div className="space-y-2">
                    {accountsLoading ? (
                      <div className="h-10 bg-muted/20 rounded animate-pulse" />
                    ) : accounts.length > 0 ? (
                      accounts.slice(0, 2).map(acc => (
                        <div key={acc.id} className="flex items-center justify-between text-sm p-2 rounded hover:bg-muted/50 transition-colors">
                          <span className="font-medium truncate max-w-[120px]">{acc.institution_name}</span>
                          <span className="text-muted-foreground">{formatCurrency(acc.balance || 0)}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic pl-1">No accounts connected yet.</p>
                    )}
                  </div>
                </div>

                {/* Referral Widget */}
                <div className="space-y-4">
                  <h3 className="font-bold text-muted-foreground flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Impact
                  </h3>
                  <ReferralWidget variant="compact" />
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Simple Footer Text */}
        <div className="py-6 text-center text-xs text-muted-foreground/60">
          <Link to="/methodology" className="hover:text-foreground transition-colors mr-4">Methodology</Link>
          <Link to="/privacy" className="hover:text-foreground transition-colors mr-4">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
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
