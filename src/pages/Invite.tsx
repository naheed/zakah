import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReferral } from '@/hooks/useReferral';
import { useUsageMetrics, formatLargeNumber, formatCount } from '@/hooks/useUsageMetrics';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lock, Calculator, Heart, BookOpen } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { InteractiveDemo } from '@/components/zakat/landing/InteractiveDemo';

// Asset coverage inline text
const assetTypes = ["401(k)s", "Crypto", "Real Estate", "RSUs"];

export default function Invite() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { storeReferralCode } = useReferral();
  const { data: metrics, isLoading: metricsLoading } = useUsageMetrics();

  // Store the referral code in sessionStorage when user arrives
  useEffect(() => {
    if (code) {
      storeReferralCode(code);
    }
  }, [code, storeReferralCode]);

  const handleStartCalculation = () => {
    navigate('/');
  };

  return (
    <>
      <Helmet>
        <title>You're Invited to Calculate Your Zakat | Zakat Flow</title>
        <meta name="description" content="A friend invited you to calculate your Zakat using Zakat Flow - a free, privacy-focused tool based on authentic Islamic methodology." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
          <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Side - CTA */}
            <div className="order-1 flex flex-col">
              {/* Brand Name */}
              <span className="text-2xl font-semibold font-serif text-transparent bg-clip-text mb-4" style={{ backgroundImage: 'var(--gradient-brand)' }}>
                Zakat Flow
              </span>
              
              {/* Main Headline - Invitation focused */}
              <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-3 tracking-tight leading-tight">
                A Friend Invited You<br />to Calculate Zakat
              </h1>
              
              {/* Hadith quote - subtle inline */}
              <blockquote className="text-base italic text-muted-foreground mb-4 border-l-2 border-primary/30 pl-3">
                "Whoever guides someone to goodness will have a reward like one who did it."
                <span className="block text-xs mt-1 not-italic">— Prophet Muhammad ﷺ</span>
              </blockquote>
              
              {/* Subhead with inline asset types */}
              <p className="text-lg font-light text-muted-foreground mb-6 leading-relaxed">
                Handles {assetTypes.join(" • ")}—we simplify the complexity.
              </p>
              
              {/* Primary CTA */}
              <Button onClick={handleStartCalculation} size="lg" className="w-full sm:w-auto gap-2 text-base h-12 mb-4">
                Calculate My Zakat
                <ArrowRight className="w-4 h-4" />
              </Button>

              {/* Consolidated Trust Badge */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Lock className="w-4 h-4 text-primary" />
                <span>Free • No account required • Takes about 5 minutes</span>
              </div>
            </div>

            {/* Right Side - Interactive Demo */}
            <div className="order-2">
              <InteractiveDemo />
              
              {/* Usage Metrics - Social Proof (only show when 5+ unique sessions for privacy) */}
              {!metricsLoading && metrics && metrics.allTime.uniqueSessions >= 5 && (
                <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Calculator className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">{formatCount(metrics.allTime.calculations)}</span> calculations
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Heart className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">{formatLargeNumber(metrics.allTime.totalZakat)}</span> Zakat calculated
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Consolidated Footer */}
        <footer className="py-6 px-4 border-t border-border">
          <div className="max-w-4xl mx-auto">
            {/* Methodology citation + links in one row */}
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-muted-foreground mb-3">
              <span>Based on AMJA, AAOIFI & Sheikh Joe Bradford</span>
              <span className="text-muted-foreground/50">•</span>
              <Link 
                to="/methodology" 
                className="text-primary hover:underline"
              >
                Methodology
              </Link>
              <span className="text-muted-foreground/50">•</span>
              <Link 
                to="/privacy" 
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <span className="text-muted-foreground/50">•</span>
              <Link 
                to="/terms" 
                className="hover:text-foreground transition-colors"
              >
                Terms
              </Link>
            </div>
            <div className="text-center text-xs text-muted-foreground">
              <p>Built by Naheed Vora • <a href="mailto:naheed@vora.dev" className="text-primary hover:underline">naheed@vora.dev</a></p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
