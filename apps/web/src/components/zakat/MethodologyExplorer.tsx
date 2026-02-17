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


import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Check, Info, ListNumbers, Coins, TrendUp, ShieldCheck, ArrowsLeftRight, Calculator, BookOpen } from '@phosphor-icons/react';
import { ZAKAT_PRESETS } from '@zakatflow/core';
import { ZakatMethodologyConfig } from '@zakatflow/core';
import { calculateZakat, ZakatCalculationResult, formatCurrency } from '@zakatflow/core';
import { AHMED_PROFILE } from '@/lib/caseStudyData';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Filter for verified presets only
const VERIFIED_PRESETS = Object.entries(ZAKAT_PRESETS)
    .filter(([_, config]) => config.meta.tier === 'official')
    .sort((a, b) => a[1].meta.ui_label?.localeCompare(b[1].meta.ui_label || '') || 0);

interface RuleCardProps {
    title: string;
    icon: React.ComponentType<any>;
    config: ZakatMethodologyConfig;
    type: 'jewelry' | 'retirement' | 'stocks';
    className?: string;
    viewMode: 'theory' | 'practice';
    calculationResult?: ZakatCalculationResult;
}

const RuleCard = ({ title, icon: Icon, config, type, className, viewMode, calculationResult }: RuleCardProps) => {
    let status = "";
    let statusColor = "";
    let description = "";
    let basis = "";

    // Practice Mode Values
    let practiceValue = "";
    let practiceLabel = "";
    let practiceExplanation = "";

    if (type === 'jewelry') {
        const rule = config.assets.precious_metals.jewelry;
        // Theory
        status = rule.zakatable ? "Zakatable" : "Exempt";
        statusColor = rule.zakatable ? "text-amber-600 bg-amber-50 border-amber-200" : "text-emerald-600 bg-emerald-50 border-emerald-200";
        description = rule.description || "";
        basis = rule.scholarly_basis || "";

        // Practice
        if (calculationResult) {
            // Ahmed has $8,000 in jewelry
            const zakatableAmount = calculationResult.enhancedBreakdown.preciousMetals.zakatableAmount;
            // Since Ahmed's only PM is jewelry ($8k), we can infer:
            const isZakatable = zakatableAmount > 0;
            practiceValue = formatCurrency(isZakatable ? 8000 : 0);
            practiceLabel = "Ahmed's $8,000 Gold";
            practiceExplanation = isZakatable
                ? "Full value is included in calculation."
                : "Excluded from calculation (personal use).";
        }
    } else if (type === 'retirement') {
        const rule = config.assets.retirement;
        // Theory
        if (rule.zakatability === 'exempt' || rule.zakatability === 'deferred_upon_access') {
            status = "Exempt / Deferred";
            statusColor = "text-emerald-600 bg-emerald-50 border-emerald-200";
        } else {
            status = rule.zakatability === 'full' ? "100% Zakatable" : "Net Accessible";
            statusColor = "text-amber-600 bg-amber-50 border-amber-200";
        }
        description = rule.description || "";
        basis = rule.scholarly_basis || "";

        // Practice
        if (calculationResult) {
            // Ahmed has $320k 401k + $60k Roth = $380k
            const zakatableAmount = calculationResult.enhancedBreakdown.retirement.zakatableAmount;
            practiceValue = formatCurrency(zakatableAmount);
            practiceLabel = "Ahmed's $380,000 Retirement";
            practiceExplanation = zakatableAmount === 0
                ? "Exempt because Ahmed is under 59½."
                : `Assessable amount after deductions/rules.`;
        }
    } else if (type === 'stocks') {
        const rule = config.assets.investments.passive_investments;
        // Theory
        if (rule.treatment === 'market_value') {
            status = "100% Market Value";
            statusColor = "text-amber-600 bg-amber-50 border-amber-200";
        } else if (rule.treatment === 'income_only') {
            status = "Dividends Only";
            statusColor = "text-emerald-600 bg-emerald-50 border-emerald-200";
        } else {
            status = `${(rule.rate * 100).toFixed(0)}% of Market Value`;
            statusColor = "text-blue-600 bg-blue-50 border-blue-200";
        }
        description = rule.description || "";
        basis = rule.scholarly_basis || "";

        // Practice
        if (calculationResult) {
            // Ahmed has $150k Passive + $30k REITs = $180k
            // We use the investments category zakatable amount
            const zakatableAmount = calculationResult.enhancedBreakdown.investments.zakatableAmount;
            practiceValue = formatCurrency(zakatableAmount);
            practiceLabel = "Ahmed's $180,000 Investments";
            practiceExplanation = (rule.treatment as string) === 'percentage'
                ? `Only ${(rule.rate * 100).toFixed(0)}% is assessed (proxy for underlying assets).`
                : "Full market value is assessed.";
        }
    }

    return (
        <Card className={cn("h-full overflow-hidden transition-all duration-300", className, viewMode === 'practice' ? "ring-2 ring-primary/5 border-primary/20 bg-primary/5 shadow-md" : "")}>
            <CardHeader className="pb-3 px-4 pt-4">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <div className={cn("p-1.5 rounded-md shrink-0 transition-colors", viewMode === 'practice' ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary")}>
                            {viewMode === 'practice' ? <Calculator size={18} weight="fill" /> : <Icon size={18} weight="duotone" />}
                        </div>
                        <span className="text-sm font-bold leading-tight">{title}</span>
                    </div>
                    <Badge variant="outline" className={cn("font-semibold text-[10px] px-1.5 h-5 whitespace-nowrap transition-colors", statusColor)}>
                        {status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <AnimatePresence mode="wait">
                    {viewMode === 'theory' ? (
                        <motion.div
                            key="theory"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="p-3 rounded-lg bg-muted/30 border border-border/50 h-full flex flex-col justify-between"
                        >
                            <div>
                                <p className="text-xs text-foreground mb-3 leading-relaxed">{description}</p>
                            </div>
                            {basis && (
                                <div className="pt-2 border-t border-border/40 mt-auto">
                                    <p className="text-[10px] font-bold text-muted-foreground/70 mb-0.5 uppercase tracking-wide">Scholarly Basis</p>
                                    <p className="text-[10px] italic text-muted-foreground leading-tight">"{basis}"</p>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="practice"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="p-3 rounded-lg bg-background border border-border/50 h-full flex flex-col justify-between shadow-sm relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-2 opacity-10">
                                <Icon size={64} weight="duotone" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{practiceLabel}</p>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-2xl font-black text-foreground tracking-tighter">{practiceValue}</span>
                                    <span className="text-[10px] text-muted-foreground font-medium uppercase">Zakatable</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">{practiceExplanation}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
};

interface MethodologyExplorerProps {
    initialMode?: string;
}

export const MethodologyExplorer = ({ initialMode = 'bradford' }: MethodologyExplorerProps) => {
    const [modeA, setModeA] = useState<string>(initialMode);
    const [modeB, setModeB] = useState<string>('hanafi');
    const [viewMode, setViewMode] = useState<'theory' | 'practice'>('theory');

    const configA = ZAKAT_PRESETS[modeA] || ZAKAT_PRESETS['bradford'];
    const configB = ZAKAT_PRESETS[modeB] || ZAKAT_PRESETS['hanafi'];

    // Real-time calculation using engine
    const resultsA = useMemo(() => calculateZakat(AHMED_PROFILE, undefined, undefined, configA), [modeA]);
    const resultsB = useMemo(() => calculateZakat(AHMED_PROFILE, undefined, undefined, configB), [modeB]);

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Control Bar */}
            <div className="sticky top-20 z-40 bg-background/95 backdrop-blur p-4 rounded-xl border border-border shadow-sm mb-8 space-y-6">

                {/* Method Selectors */}
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 justify-center">
                    <div className="w-full md:w-64 space-y-1.5">
                        <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Methodology A</Label>
                        <Select value={modeA} onValueChange={setModeA}>
                            <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Select Methodology" />
                            </SelectTrigger>
                            <SelectContent>
                                {VERIFIED_PRESETS.map(([key, cfg]) => (
                                    <SelectItem key={key} value={key}>
                                        {cfg.meta.ui_label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="hidden md:flex items-center justify-center pt-6">
                        <div className="p-2 rounded-full bg-muted text-muted-foreground">
                            <ArrowsLeftRight size={20} />
                        </div>
                    </div>

                    <div className="w-full md:w-64 space-y-1.5">
                        <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Methodology B</Label>
                        <Select value={modeB} onValueChange={setModeB}>
                            <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Select Methodology" />
                            </SelectTrigger>
                            <SelectContent>
                                {VERIFIED_PRESETS.map(([key, cfg]) => (
                                    <SelectItem key={key} value={key}>
                                        {cfg.meta.ui_label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Mode Toggle */}
                <div className="flex justify-center border-t border-border pt-4">
                    <div className="flex items-center gap-3 bg-muted/30 p-1.5 rounded-full border border-border/50">
                        <button
                            onClick={() => setViewMode('theory')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                                viewMode === 'theory'
                                    ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <BookOpen size={16} weight={viewMode === 'theory' ? "fill" : "duotone"} />
                            Theory (Rules)
                        </button>
                        <button
                            onClick={() => setViewMode('practice')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                                viewMode === 'practice'
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Calculator size={16} weight={viewMode === 'practice' ? "fill" : "duotone"} />
                            Practice (Case Study)
                        </button>
                    </div>
                </div>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* HEADERS */}
                <div className="hidden md:block text-center pb-2 border-b-2 border-primary/20">
                    <h3 className="font-bold text-lg text-primary">{configA.meta.ui_label}</h3>
                    {viewMode === 'practice' && <p className="text-xs text-primary/70 font-mono mt-1">Total Zakat: {formatCurrency(resultsA.zakatDue)}</p>}
                </div>
                <div className="hidden md:block text-center pb-2 border-b-2 border-muted">
                    <h3 className="font-bold text-lg text-foreground">{configB.meta.ui_label}</h3>
                    {viewMode === 'practice' && <p className="text-xs text-muted-foreground font-mono mt-1">Total Zakat: {formatCurrency(resultsB.zakatDue)}</p>}
                </div>

                {/* OVERVIEW SECTION */}
                <div className="md:col-span-2 text-center pt-4 pb-2">
                    <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center justify-center gap-2">
                        <Info size={16} /> Overview
                    </h4>
                </div>

                {/* Overview Card A */}
                <Card className={cn("border-primary/20 bg-primary/5 transition-all", viewMode === 'practice' ? "ring-2 ring-primary/10" : "")}>
                    <CardHeader className="pb-2 md:hidden">
                        <CardTitle className="text-primary">{configA.meta.ui_label}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <p className="text-sm text-foreground mb-4 min-h-[3rem]">{configA.meta.description}</p>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="p-2 bg-background rounded border">
                                <span className="block text-muted-foreground text-[10px] uppercase">Nisab</span>
                                <span className="font-bold">{configA.thresholds.nisab.default_standard}</span>
                            </div>
                            <div className="p-2 bg-background rounded border">
                                <span className="block text-muted-foreground text-[10px] uppercase">Debt</span>
                                <span className="font-bold capitalize">{configA.liabilities.method.replace(/_/g, " ")}</span>
                            </div>
                            <div className="p-2 bg-background rounded border">
                                <span className="block text-muted-foreground text-[10px] uppercase">Total Due</span>
                                <span className={cn("font-bold truncate", viewMode === 'practice' ? "text-primary" : "")}>
                                    {viewMode === 'practice' ? formatCurrency(resultsA.zakatDue) : "---"}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Overview Card B */}
                <Card className="border-border">
                    <CardHeader className="pb-2 md:hidden">
                        <CardTitle>{configB.meta.ui_label}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <p className="text-sm text-foreground mb-4 min-h-[3rem]">{configB.meta.description}</p>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="p-2 bg-muted/30 rounded border">
                                <span className="block text-muted-foreground text-[10px] uppercase">Nisab</span>
                                <span className="font-bold">{configB.thresholds.nisab.default_standard}</span>
                            </div>
                            <div className="p-2 bg-muted/30 rounded border">
                                <span className="block text-muted-foreground text-[10px] uppercase">Debt</span>
                                <span className="font-bold capitalize">{configB.liabilities.method.replace(/_/g, " ")}</span>
                            </div>
                            <div className="p-2 bg-muted/30 rounded border">
                                <span className="block text-muted-foreground text-[10px] uppercase">Ref</span>
                                <span className="font-bold truncate" title={configB.meta.reference?.authority || configB.meta.author}>
                                    {configB.meta.reference?.authority || "ZakatFlow"}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* JEWELRY SECTION */}
                <div className="md:col-span-2 text-center pt-8 pb-2">
                    <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center justify-center gap-2">
                        <Coins size={16} /> Gold & Silver Jewelry
                    </h4>
                </div>
                <RuleCard title="Gold & Silver Jewelry" icon={Coins} config={configA} type="jewelry" className="border-primary/20" viewMode={viewMode} calculationResult={resultsA} />
                <RuleCard title="Gold & Silver Jewelry" icon={Coins} config={configB} type="jewelry" viewMode={viewMode} calculationResult={resultsB} />

                {/* RETIREMENT SECTION */}
                <div className="md:col-span-2 text-center pt-8 pb-2">
                    <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center justify-center gap-2">
                        <ShieldCheck size={16} /> Retirement Accounts
                    </h4>
                </div>
                <RuleCard title="Retirement Accounts" icon={ShieldCheck} config={configA} type="retirement" className="border-primary/20" viewMode={viewMode} calculationResult={resultsA} />
                <RuleCard title="Retirement Accounts" icon={ShieldCheck} config={configB} type="retirement" viewMode={viewMode} calculationResult={resultsB} />

                {/* STOCKS SECTION */}
                <div className="md:col-span-2 text-center pt-8 pb-2">
                    <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center justify-center gap-2">
                        <TrendUp size={16} /> Stocks & Investments
                    </h4>
                </div>
                <RuleCard title="Stocks & Investments" icon={TrendUp} config={configA} type="stocks" className="border-primary/20" viewMode={viewMode} calculationResult={resultsA} />
                <RuleCard title="Stocks & Investments" icon={TrendUp} config={configB} type="stocks" viewMode={viewMode} calculationResult={resultsB} />

            </div>
        </div>
    );
};
