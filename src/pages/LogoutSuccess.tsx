import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from '@phosphor-icons/react';
import { Logo } from '@/components/zakat/Logo';
import { ReferralWidget } from '@/components/zakat/ReferralWidget';
import { ImpactStats } from '@/components/zakat/ImpactStats';
import { Button } from '@/components/ui/button';
import { useUsageMetrics } from '@/hooks/useUsageMetrics';
import { cn } from '@/lib/utils';

const PRIVACY_THRESHOLD = 5;

export default function LogoutSuccess() {
    const { data: metrics, isLoading } = useUsageMetrics();

    // Check if we can show metrics (privacy threshold)
    const canShowMetrics = metrics && metrics.allTime.uniqueSessions >= 0; // Show for all, component handles threshold message

    return (
        <div className="min-h-screen bg-[#FDFCF8] dark:bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <Helmet>
                <title>Signed Out - ZakatFlow</title>
            </Helmet>

            {/* Background Decorations */}
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

            <div className="w-full max-w-md space-y-10 relative z-10">

                {/* 1. Header & Logo (Centered & Big) */}
                <motion.div
                    className="flex flex-col items-center text-center space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="scale-125">
                        <Logo size="lg" />
                    </div>

                    <div className="space-y-2">
                        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-6 h-6 text-green-700 dark:text-green-500" strokeWidth={2.5} />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground font-work-sans">
                            You're signed out
                        </h1>
                        <p className="text-base text-muted-foreground max-w-xs mx-auto">
                            Your data is secure and encrypted. Only you can access it.
                        </p>
                    </div>
                </motion.div>

                {/* 2. Impact Card (Universal Widget) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <ImpactStats
                        isLoading={isLoading}
                        totalReferrals={metrics?.allTime.calculations || 0}
                        totalZakatCalculated={metrics?.allTime.totalZakat || 0}
                        title="Community Impact"
                    />
                </motion.div>

                {/* 3. Share Action (Refined) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="space-y-6"
                >
                    <ReferralWidget variant="compact" />

                    {/* Sign Back In */}
                    <div className="text-center pt-4">
                        <Link to="/auth">
                            <Button variant="link" size="lg" className="text-base font-medium text-amber-900/60 dark:text-amber-100/60 hover:text-primary gap-2 transition-colors">
                                Sign back in
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </motion.div>

            </div>

            {/* Footer Info */}
            <div className="absolute bottom-6 left-0 right-0 text-center">
                <p className="text-xs text-muted-foreground/30 font-medium tracking-widest uppercase">ZakatFlow • Secure Calculation</p>
            </div>
        </div>
    );
}
