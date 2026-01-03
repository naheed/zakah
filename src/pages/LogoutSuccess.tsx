import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { CheckCircle, Share, ArrowRight, Copy, Check } from 'lucide-react';
import { WhatsappLogo, XLogo } from '@phosphor-icons/react';
import { Logo } from '@/components/zakat/Logo';
import { PersonalMetrics } from '@/components/zakat/PersonalMetrics';
import { Button } from '@/components/ui/button';
import { useUsageMetrics } from '@/hooks/useUsageMetrics';
import { DOMAIN_CONFIG } from '@/lib/domainConfig';
import { cn } from '@/lib/utils';

const PRIVACY_THRESHOLD = 5;

export default function LogoutSuccess() {
    const { data: metrics, isLoading } = useUsageMetrics();
    const [copied, setCopied] = useState(false);

    const shareUrl = `https://${DOMAIN_CONFIG.primary}`;
    const shareText = "I use ZakatFlow to calculate my Zakat - a beautiful, privacy-first calculator. Check it out!";

    const handleCopy = async () => {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleWhatsApp = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
    };

    const handleTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    };

    // Check if we can show metrics (privacy threshold)
    const canShowMetrics = metrics && metrics.allTime.uniqueSessions >= PRIVACY_THRESHOLD;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Helmet>
                <title>Signed Out - ZakatFlow</title>
            </Helmet>

            {/* Header */}
            <header className="px-4 py-4">
                <Logo size="sm" />
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-8">
                <motion.div
                    className="w-full max-w-md text-center space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.23, 0.58, 0.32, 0.95] }}
                >
                    {/* Gentle Success Icon */}
                    <motion.div
                        className="relative mx-auto w-16 h-16"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                    >
                        <div className="w-full h-full rounded-full bg-success/10 flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-success" strokeWidth={1.5} />
                        </div>
                    </motion.div>

                    {/* Heading */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-xl font-semibold text-foreground mb-2">
                            You're signed out
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Your data is secure and encrypted. Only you can access it.
                        </p>
                    </motion.div>

                    {/* Community Trends - Using PersonalMetrics component */}
                    {!isLoading && canShowMetrics && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <PersonalMetrics
                                totalReferrals={metrics.allTime.calculations}
                                totalZakatCalculated={null}
                                totalAssetsCalculated={null}
                                variant="full"
                            />
                        </motion.div>
                    )}

                    {/* Share Section - Now feels more like "help others" */}
                    <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <div className="flex items-center gap-2 justify-center text-muted-foreground">
                            <Share className="w-3.5 h-3.5" />
                            <p className="text-sm">Know someone who needs to calculate their Zakat?</p>
                        </div>

                        <div className="flex items-center justify-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                    "gap-1.5 transition-all",
                                    copied && "bg-success/10 border-success text-success"
                                )}
                                onClick={handleCopy}
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-3.5 h-3.5" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3.5 h-3.5" />
                                        Copy Link
                                    </>
                                )}
                            </Button>

                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-[#25D366] hover:bg-[#25D366]/10 hover:border-[#25D366]"
                                onClick={handleWhatsApp}
                            >
                                <WhatsappLogo className="w-4 h-4" weight="fill" />
                            </Button>

                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 hover:bg-foreground/5"
                                onClick={handleTwitter}
                            >
                                <XLogo className="w-4 h-4" weight="fill" />
                            </Button>
                        </div>
                    </motion.div>

                    {/* Sign Back In */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <Link to="/auth">
                            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                                Sign back in
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="px-4 py-6 text-center">
                <Link to="/">
                    <Button variant="link" size="sm" className="text-xs text-muted-foreground">
                        ← Back to home
                    </Button>
                </Link>
            </footer>
        </div>
    );
}
