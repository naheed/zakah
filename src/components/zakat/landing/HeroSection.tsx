import { Button } from "@/components/ui/button";
import { formatCompactCurrency } from "@/lib/zakatCalculations";
import { ArrowRight, FilePdf, FileCsv, ShieldCheck, Lock } from "@phosphor-icons/react";
import { ProductDemo } from "./ProductDemo";
import { useUsageMetrics } from "@/hooks/useUsageMetrics";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { hero, trustBadges } from "@/content/marketing";

interface HeroSectionProps {
    onNext: () => void;
    ctaRef?: React.RefObject<HTMLButtonElement>;
}

export function HeroSection({ onNext, ctaRef }: HeroSectionProps) {
    const { data: metrics, isLoading: metricsLoading } = useUsageMetrics();
    const sectionRef = useRef<HTMLElement>(null);

    // Parallax for background blobs
    // Check reduced motion preference
    const prefersReducedMotion = typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;

    const { scrollY } = useScroll();
    const blobY = useTransform(scrollY, [0, 600], [0, prefersReducedMotion ? 0 : 150]);

    return (
        <section
            ref={sectionRef}
            className="min-h-[90vh] flex flex-col justify-center px-6 md:px-12 py-12 md:py-20 relative overflow-hidden"
        >
            {/* Parallax background blobs */}
            <motion.div
                style={{ y: blobY }}
                className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none"
            />
            <motion.div
                style={{ y: blobY }}
                className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none"
            />

            <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
                <div className="text-left space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
                            {hero.headline} <br />
                            <span className="text-primary">{hero.headlineAccent}</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl">
                            Navigate your complex portfolio—401(k)s, crypto, gold, trusts, and more—across <a href="/methodology" className="text-foreground underline decoration-dotted underline-offset-4 hover:text-primary transition-colors">8 scholarly methodologies</a>. Generate a detailed PDF or CSV report in minutes. Private, secure, and accurate.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            ref={ctaRef}
                            size="lg"
                            onClick={onNext}
                            className="gap-2 text-lg h-14 px-8 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all font-semibold"
                        >
                            {hero.cta}
                            <ArrowRight className="w-5 h-5" weight="bold" />
                        </Button>

                        <div className="flex flex-col gap-2 text-sm text-muted-foreground pt-1">
                            <a href="#" className="flex items-center gap-2 hover:text-foreground transition-colors">
                                <FilePdf className="w-4 h-4" /> {hero.previewPdf}
                            </a>
                            <a href="#" className="flex items-center gap-2 hover:text-foreground transition-colors">
                                <FileCsv className="w-4 h-4" /> {hero.downloadCsv}
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground/80 font-medium">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" weight="duotone" />
                            <span>{trustBadges.encryption}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-emerald-500" weight="duotone" />
                            <span>{trustBadges.sessionOnly}</span>
                        </div>
                    </div>

                    {!metricsLoading && metrics && (
                        <div className="pt-4 border-t border-border/40">
                            <p className="text-sm font-medium text-muted-foreground">
                                Trusted by community members who have calculated
                                <span className="text-foreground font-bold mx-1">{formatCompactCurrency(metrics.allTime.totalZakat, "USD")}</span>
                                in Zakat.
                            </p>
                        </div>
                    )}
                </div>

                <div className="hidden lg:block relative">
                    <ProductDemo />
                </div>
            </div>

            {/* Scroll Cue */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 2,
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground/50 hidden md:block"
            >
                <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] uppercase tracking-widest font-medium">Scroll</span>
                    <ArrowRight className="w-4 h-4 rotate-90" />
                </div>
            </motion.div>
        </section>
    );
}
