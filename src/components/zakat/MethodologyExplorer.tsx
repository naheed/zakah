
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { methodologyContent } from '@/lib/content/methodology';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Check, CaretDown, CaretUp, Info, ListNumbers, Coins, TrendUp, ShieldCheck } from '@phosphor-icons/react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

type CalculationMode = 'bradford' | 'hanafi' | 'maliki' | 'hanbali';

const MODES: { id: CalculationMode; label: string; rules: any }[] = [
    {
        id: 'bradford',
        label: 'Bradford (Balanced)',
        rules: {
            jewelry: 'Zakatable (Ahwat)',
            retirement: 'Exempt (< 59½)',
            passive: '30% Rule'
        }
    },
    {
        id: 'hanafi',
        label: 'Hanafi',
        rules: {
            jewelry: 'Zakatable',
            retirement: 'Net Accessible',
            passive: '100% Market'
        }
    },
    {
        id: 'maliki',
        label: 'Maliki / Shafi\'i',
        rules: {
            jewelry: 'Exempt',
            retirement: 'Net Accessible',
            passive: '100% Market'
        }
    },
    {
        id: 'hanbali',
        label: 'Hanbali',
        rules: {
            jewelry: 'Exempt',
            retirement: 'Net Accessible',
            passive: '100% Market'
        }
    }
];

const AHMED_IMPACT = {
    bradford: { amount: 3025, label: "Lowest" },
    hanafi: { amount: 5490, label: "Moderate" },
    maliki: { amount: 10290, label: "Highest" },
    hanbali: { amount: 5290, label: "Moderate" }
};

const RuleCard = ({ title, icon: Icon, mode, content }: any) => {
    let displayText = "";
    let displayTitle = "";
    let displayEvidence = "";
    let displayBasis = "";

    if (title.includes("Jewelry")) {
        let school;
        if (mode === 'hanafi') {
            school = content.schools.find((s: any) => s.name === 'Hanafi');
            displayTitle = "Zakatable (Hanafi View)";
        } else if (mode === 'bradford') {
            school = content.schools.find((s: any) => s.name === 'Bradford');
            displayTitle = "Zakatable (Bradford View)";
        } else {
            school = content.schools.find((s: any) => s.name.includes('Shafi'));
            displayTitle = "Exempt (Majority View)";
        }
        displayText = school?.text;
        displayEvidence = school?.evidence;

    } else if (title.includes("Retirement")) {
        let approach;
        if (mode === 'bradford') {
            approach = content.approaches[0]; // Bradford is index 0
        } else {
            approach = content.approaches[1]; // Others are index 1
        }
        displayText = approach?.description;
        displayTitle = approach?.title;
        displayBasis = approach?.basis;

    } else if (title.includes("Stocks")) {
        if (mode === 'bradford') {
            displayText = content.rule30.description;
            displayTitle = "30% Rule (Passive)";
            displayBasis = content.rule30.standard;
        } else {
            displayText = "Holdings are valued at 100% of market value for passive investments, unless specific company financials allow for Net Current Asset calculation.";
            displayTitle = "100% Market Value (Default)";
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                        <Icon size={24} weight="duotone" />
                    </div>
                    <div>
                        <CardTitle className="text-base">{title}</CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="p-4 rounded-lg bg-card border border-border">
                    <h4 className="font-semibold text-foreground mb-2">{displayTitle}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{displayText}</p>

                    {displayEvidence && (
                        <div className="mt-3 pt-3 border-t border-border/50">
                            <p className="text-xs font-semibold text-primary mb-1">Evidence (Dalil):</p>
                            <p className="text-xs italic text-muted-foreground">"{displayEvidence}"</p>
                        </div>
                    )}

                    {displayBasis && (
                        <div className="mt-3 pt-3 border-t border-border/50">
                            <p className="text-xs font-semibold text-primary mb-1">Scholarly Basis:</p>
                            <p className="text-xs italic text-muted-foreground">"{displayBasis}"</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export const MethodologyExplorer = () => {
    const [selectedMode, setSelectedMode] = useState<CalculationMode>('bradford');
    const content = methodologyContent;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
            {/* Main Content Column */}
            <div className="lg:col-span-8 space-y-12">

                {/* Mode Selector (Mobile Sticky) */}
                <div className="sticky top-20 z-40 bg-background/95 backdrop-blur py-4 border-b border-border lg:static lg:bg-transparent lg:border-none lg:p-0">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground hidden lg:block">Select Methodology</h3>
                        <div className="flex flex-wrap gap-2">
                            {MODES.map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => setSelectedMode(mode.id)}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                                        selectedMode === mode.id
                                            ? "bg-primary text-primary-foreground border-primary shadow-md transform scale-105"
                                            : "bg-transparent text-muted-foreground border-border hover:bg-muted/20 hover:text-foreground"
                                    )}
                                >
                                    {mode.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Dynamic Rules Section */}
                <div className="space-y-8 min-h-[600px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedMode}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-8"
                        >
                            {/* Introduction Card */}
                            <Card className="border-primary/20 bg-primary/5">
                                <CardContent className="pt-6">
                                    <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                        <Info className="w-5 h-5 text-primary" />
                                        How {MODES.find(m => m.id === selectedMode)?.label} Works
                                    </h3>
                                    <div className="grid grid-cols-3 gap-4 mt-4">
                                        {Object.entries(MODES.find(m => m.id === selectedMode)?.rules || {}).map(([key, val]: any) => (
                                            <div key={key} className="text-center p-3 bg-background rounded-lg border border-border shadow-sm">
                                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">{key}</p>
                                                <p className="font-bold text-foreground text-sm">{val}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Jewelry Rule */}
                            <RuleCard
                                title={content.madhahSchools.jewelryRuling.title}
                                icon={Coins}
                                mode={selectedMode}
                                content={content.madhahSchools.jewelryRuling}
                            />

                            {/* Retirement Rule */}
                            <RuleCard
                                title={content.retirement.title}
                                icon={ShieldCheck}
                                mode={selectedMode}
                                content={content.retirement}
                            />

                            {/* Stocks/Passive Rule */}
                            <RuleCard
                                title={content.stocks.title}
                                icon={TrendUp}
                                mode={selectedMode}
                                content={content.stocks}
                            />

                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Sticky Sidebar Widget */}
            <div className="lg:col-span-4">
                <div className="sticky top-24 space-y-6">
                    <Card className="bg-slate-900 text-white border-slate-800 shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <ListNumbers className="w-24 h-24" />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">IMPACT DEMO</CardTitle>
                            <CardDescription className="text-slate-300">
                                The Ahmed Family
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-slate-400 mb-1">Total Zakat Due</p>
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={selectedMode}
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="text-4xl font-bold text-emerald-400"
                                        >
                                            ${AHMED_IMPACT[selectedMode].amount.toLocaleString()}
                                        </motion.div>
                                    </AnimatePresence>
                                    <Badge variant="outline" className="mt-2 text-slate-300 border-slate-700 bg-slate-800/50">
                                        {AHMED_IMPACT[selectedMode].label} Estimate
                                    </Badge>
                                </div>

                                <div className="pt-4 border-t border-slate-700 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Jewelry</span>
                                        <span className={['hanafi', 'bradford'].includes(selectedMode) ? "text-emerald-400" : "text-emerald-400"}>
                                            {['hanafi', 'bradford'].includes(selectedMode) ? 'Included' : 'Exempt'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">401k</span>
                                        <span className={selectedMode === 'bradford' ? "text-emerald-400" : "text-amber-400"}>
                                            {selectedMode === 'bradford' ? 'Exempt' : 'Taxed'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Debts</span>
                                        <span className={['hanafi', 'hanbali'].includes(selectedMode) ? "text-emerald-400" : "text-amber-400"}>
                                            {['hanafi', 'hanbali'].includes(selectedMode) ? 'Full Deduct' : '12-Month'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="p-4 rounded-lg bg-transparent border border-border text-sm text-muted-foreground">
                        <p>
                            <strong>Why this matters:</strong> Choosing a methodology isn't just about math—it's about following a conviction.
                            ZakatFlow empowers you to calculate 100% correctly according to your school.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
