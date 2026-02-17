/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReferral } from '@/hooks/useReferral';
import { useUsageMetrics } from '@/hooks/useUsageMetrics';
import { formatLargeNumber, formatCount } from '@zakatflow/core';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lock, Calculator, Heart } from '@phosphor-icons/react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { InteractiveDemo } from '@/components/zakat/landing/InteractiveDemo';
import { Logo } from '@/components/zakat/Logo';
import { Footer } from '@/components/zakat/Footer';
import { getPrimaryUrl } from '@/lib/domainConfig';

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
    // Navigate with query param to skip welcome and go directly to calculation
    navigate('/?start=1');
  };

  return (
    <>
      <Helmet>
        <title>You're Invited to Calculate Your Zakat | ZakatFlow</title>
        <meta name="description" content="A friend invited you to calculate your Zakat using ZakatFlow — free, privacy-focused, and your data is encrypted so only you can decrypt it." />
        <link rel="canonical" href={getPrimaryUrl('/invite')} />
        <meta property="og:url" content={getPrimaryUrl('/invite')} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
          <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Side - CTA */}
            <div className="order-1 flex flex-col">
              {/* Brand Logo */}
              <Logo size="lg" className="mb-4" />

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
                <span>Free • Save & resume with encrypted storage • Takes about 5 minutes</span>
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

        <Footer />
      </div>
    </>
  );
}
