import { formatCurrency, Madhab } from "@/lib/zakatCalculations";
import { SealCheck, Minus, Equals, BookOpen } from "@phosphor-icons/react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ReportHeroProps {
    zakatDue: number;
    totalAssets: number;
    totalLiabilities: number;
    netZakatableWealth: number;
    currency: string;
    isAboveNisab: boolean;
    madhab: string;
}

export function ReportHero({
    zakatDue,
    totalAssets,
    totalLiabilities,
    netZakatableWealth,
    currency,
    isAboveNisab,
    madhab,
    className
}: ReportHeroProps & { className?: string }) {
    // Format helpers
    const wholeZakat = Math.floor(zakatDue);
    const decimalZakat = (zakatDue % 1).toFixed(2).substring(1); // .00

    // Madhab Label
    const madhabLabel = madhab ? (madhab.charAt(0).toUpperCase() + madhab.slice(1) + " Madhab") : "Standard Madhab";

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20
            }
        }
    };

    return (
        <motion.section
            className={cn("mb-10", className)}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">

                {/* The "Action" Card (Left) */}
                <motion.div
                    variants={itemVariants}
                    className="col-span-1 md:col-span-12 lg:col-span-5 border-2 border-primary/20 bg-card rounded-2xl p-7 relative flex flex-col justify-between min-h-[180px]"
                >
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <SealCheck weight="fill" className="text-primary text-xl" />
                            <span className="text-xs font-bold uppercase tracking-widest text-primary">
                                Fulfilling the Third Pillar
                            </span>
                        </div>
                        <div className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight break-words">
                            <AnimatedNumber
                                value={zakatDue}
                                format={(v) => formatCurrency(v, currency, 0)}
                            />
                        </div>
                    </div>

                    <div className="pt-4 mt-2">
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                            This amount represents 2.5% of your zakatable wealth, purified and ready for distribution to those in need.
                        </p>
                    </div>
                </motion.div>

                {/* The "Story" (Equation) (Right) */}
                <motion.div
                    variants={itemVariants}
                    className="col-span-1 md:col-span-12 lg:col-span-7 bg-surface-container-low rounded-2xl p-7 flex flex-col justify-center"
                >
                    <div className="flex flex-col sm:flex-row items-center justify-between text-center w-full mb-6 sm:mb-2 gap-4 sm:gap-0">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center sm:items-start">
                            <span className="text-[10px] uppercase text-muted-foreground font-bold mb-1 tracking-wider">Total Wealth</span>
                            <span className="text-xl font-bold text-foreground">{formatCurrency(totalAssets, currency, 0)}</span>
                        </div>

                        {/* Operator */}
                        <Minus weight="bold" className="text-muted-foreground/40 w-5 h-5 rotate-90 sm:rotate-0" />

                        {/* Step 2 */}
                        <div className="flex flex-col items-center sm:items-start">
                            <span className="text-[10px] uppercase text-muted-foreground font-bold mb-1 tracking-wider">Needs & Liabilities</span>
                            <span className="text-xl font-medium text-muted-foreground">({formatCurrency(totalLiabilities, currency, 0)})</span>
                        </div>

                        {/* Operator */}
                        <Equals weight="bold" className="text-muted-foreground/40 w-5 h-5 rotate-90 sm:rotate-0" />

                        {/* Step 3 */}
                        <div className="flex flex-col items-center sm:items-start">
                            <span className="text-[10px] uppercase text-muted-foreground font-bold mb-1 tracking-wider">Wealth to Purify</span>
                            <span className="text-2xl font-extrabold text-foreground">{formatCurrency(netZakatableWealth, currency, 0)}</span>
                        </div>
                    </div>

                    {/* Trust Signals */}
                    <div className="mt-4 pt-4 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center text-xs text-muted-foreground gap-3 sm:gap-0">
                        <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                            <span className="flex items-center gap-1.5">
                                <BookOpen weight="fill" className="text-primary w-4 h-4" />
                                {madhabLabel}
                            </span>
                        </div>
                        {isAboveNisab ? (
                            <span className="text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded">Nisab Met</span>
                        ) : (
                            <span className="text-muted-foreground font-semibold bg-muted px-2 py-0.5 rounded">Below Nisab</span>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
}
