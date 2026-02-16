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


import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Check, Info, ListNumbers, Coins, TrendUp, ShieldCheck } from '@phosphor-icons/react';
import { ZAKAT_PRESETS } from '@/lib/config/presets';
import { ZakatMethodologyConfig } from '@/lib/config/types';

// Filter for verified presets only
const VERIFIED_PRESETS = Object.entries(ZAKAT_PRESETS)
    .filter(([_, config]) => config.meta.tier === 'verified')
    .sort((a, b) => a[1].meta.ui_label?.localeCompare(b[1].meta.ui_label || '') || 0);

interface RuleCardProps {
    title: string;
    icon: React.ComponentType<any>;
    config: ZakatMethodologyConfig;
    type: 'jewelry' | 'retirement' | 'stocks';
}

const RuleCard = ({ title, icon: Icon, config, type }: RuleCardProps) => {
    let status = "";
    let statusColor = "";
    let description = "";
    let basis = "";

    if (type === 'jewelry') {
        const rule = config.assets.precious_metals.jewelry;
        status = rule.zakatable ? "Zakatable" : "Exempt";
        statusColor = rule.zakatable ? "text-amber-600 bg-amber-50 border-amber-200" : "text-emerald-600 bg-emerald-50 border-emerald-200";
        description = rule.description || "";
        basis = rule.scholarly_basis || "";
    } else if (type === 'retirement') {
        const rule = config.assets.retirement;
        if (rule.zakatability === 'exempt' || rule.zakatability === 'deferred_upon_access') {
            status = "Exempt / Deferred";
            statusColor = "text-emerald-600 bg-emerald-50 border-emerald-200";
        } else {
            status = rule.zakatability === 'full' ? "100% Zakatable" : "Net Accessible";
            statusColor = "text-amber-600 bg-amber-50 border-amber-200";
        }
        description = rule.description || "";
        basis = rule.scholarly_basis || "";
    } else if (type === 'stocks') {
        const rule = config.assets.investments.passive_investments;
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
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full text-primary">
                            <Icon size={24} weight="duotone" />
                        </div>
                        <CardTitle className="text-base">{title}</CardTitle>
                    </div>
                    <Badge variant="outline" className={cn("font-semibold", statusColor)}>
                        {status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="p-4 rounded-lg bg-muted/20 border border-border">
                    <p className="text-sm text-foreground mb-3 leading-relaxed">{description}</p>
                    {basis && (
                        <div className="pt-3 border-t border-border/50">
                            <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">Scholarly Basis</p>
                            <p className="text-xs italic text-muted-foreground">"{basis}"</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

interface MethodologyExplorerProps {
    initialMode?: string;
}

export const MethodologyExplorer = ({ initialMode = 'bradford' }: MethodologyExplorerProps) => {
    const [selectedMode, setSelectedMode] = useState<string>(initialMode);
    const config = ZAKAT_PRESETS[selectedMode] || ZAKAT_PRESETS['bradford'];

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Method Selector */}
            <div className="sticky top-20 z-40 bg-background/95 backdrop-blur py-4 border-b border-border lg:static lg:bg-transparent lg:border-none lg:p-0">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 hidden lg:block text-center">Select Methodology</h3>
                <div className="flex flex-wrap justify-center gap-2">
                    {VERIFIED_PRESETS.map(([key, cfg]) => (
                        <button
                            key={key}
                            onClick={() => setSelectedMode(key)}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                                selectedMode === key
                                    ? "bg-primary text-primary-foreground border-primary shadow-md transform scale-105"
                                    : "bg-transparent text-muted-foreground border-border hover:bg-muted/20 hover:text-foreground"
                            )}
                        >
                            {cfg.meta.ui_label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Dynamic Rules */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedMode}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    {/* Intro Card - Full Width in Grid */}
                    <Card className="md:col-span-2 border-primary/20 bg-primary/5">
                        <CardContent className="pt-6">
                            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                <Info className="w-5 h-5 text-primary" />
                                How {config.meta.ui_label} Works
                            </h3>
                            <p className="text-sm text-foreground mb-4">{config.meta.description}</p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                                <div className="text-center p-3 bg-background rounded-lg border border-border">
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Nisab</p>
                                    <p className="font-bold text-foreground text-sm">{config.thresholds.nisab.default_standard}</p>
                                </div>
                                <div className="text-center p-3 bg-background rounded-lg border border-border">
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Debt</p>
                                    <p className="font-bold text-foreground text-sm capitalize">{config.liabilities.method.replace(/_/g, " ")}</p>
                                </div>
                                <div className="text-center p-3 bg-background rounded-lg border border-border">
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Source</p>
                                    <p className="font-bold text-primary text-sm truncate">{config.meta.author}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <RuleCard title="Gold & Silver Jewelry" icon={Coins} config={config} type="jewelry" />
                    <RuleCard title="Retirement Accounts" icon={ShieldCheck} config={config} type="retirement" />

                    {/* Stocks usually deserves prominence or paired with another if I add one later */}
                    <div className="md:col-span-2">
                        <RuleCard title="Stocks & Investments" icon={TrendUp} config={config} type="stocks" />
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
