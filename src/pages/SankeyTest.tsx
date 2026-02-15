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

import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ChartLineUp } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ZakatSankeyChart } from "@/components/zakat/ZakatSankeyChart";
import { useState } from "react";
import { EnhancedAssetBreakdown, AssetCategory } from "@/lib/zakatCalculations";

/**
 * SankeyTest - Test page for the enhanced Sankey chart
 * Uses mock data to quickly verify 10-category visualization
 */
export default function SankeyTest() {
    const [mode, setMode] = useState<"conservative" | "optimized" | "moderate">("conservative");

    // Create mock EnhancedAssetBreakdown for testing
    const createMockBreakdown = (calcMode: string): EnhancedAssetBreakdown => {
        const passiveZakatablePercent = calcMode === "conservative" ? 1.0 : 0.30;
        const retirementZakatablePercent = calcMode === "bradford" ? 0 : (calcMode === "conservative" ? 0.65 : 0.35);

        return {
            liquidAssets: {
                label: "Cash & Savings",
                color: "#22c55e",
                items: [
                    { name: "Checking", value: 30000 },
                    { name: "Savings", value: 20000 },
                ],
                total: 50000,
                zakatableAmount: 50000,
                zakatablePercent: 1.0,
                percentOfNetZakatable: 0,
            },
            preciousMetals: {
                label: "Precious Metals",
                color: "#eab308",
                items: [
                    { name: "Gold", value: 15000 },
                    { name: "Silver", value: 5000 },
                ],
                total: 20000,
                zakatableAmount: 20000,
                zakatablePercent: 1.0,
                percentOfNetZakatable: 0,
            },
            crypto: {
                label: "Crypto & Digital",
                color: "#8b5cf6",
                items: [
                    { name: "Bitcoin", value: 12000 },
                ],
                total: 12000,
                zakatableAmount: 12000,
                zakatablePercent: 1.0,
                percentOfNetZakatable: 0,
            },
            investments: {
                label: "Investments",
                color: "#3b82f6",
                items: [
                    { name: "Active Stocks", value: 50000, zakatablePercent: 1.0 },
                    { name: "Passive (Index)", value: 80000, zakatablePercent: passiveZakatablePercent },
                ],
                total: 130000,
                zakatableAmount: 50000 + (80000 * passiveZakatablePercent),
                zakatablePercent: (50000 + (80000 * passiveZakatablePercent)) / 130000,
                percentOfNetZakatable: 0,
            },
            retirement: {
                label: "Retirement",
                color: "#ec4899",
                items: [
                    { name: "401(k) Vested", value: 100000, zakatablePercent: retirementZakatablePercent },
                ],
                total: 100000,
                zakatableAmount: 100000 * retirementZakatablePercent,
                zakatablePercent: retirementZakatablePercent,
                percentOfNetZakatable: 0,
            },
            trusts: {
                label: "Trusts",
                color: "#14b8a6",
                items: [
                    { name: "Revocable Trust", value: 25000 },
                ],
                total: 25000,
                zakatableAmount: 25000,
                zakatablePercent: 1.0,
                percentOfNetZakatable: 0,
            },
            realEstate: {
                label: "Real Estate",
                color: "#f97316",
                items: [],
                total: 0,
                zakatableAmount: 0,
                zakatablePercent: 1.0,
                percentOfNetZakatable: 0,
            },
            business: {
                label: "Business",
                color: "#06b6d4",
                items: [
                    { name: "Inventory", value: 10000 },
                    { name: "Receivables", value: 5000 },
                ],
                total: 15000,
                zakatableAmount: 15000,
                zakatablePercent: 1.0,
                percentOfNetZakatable: 0,
            },
            debtOwedToYou: {
                label: "Debt Owed to You",
                color: "#64748b",
                items: [
                    { name: "Good Debts", value: 3000 },
                ],
                total: 3000,
                zakatableAmount: 3000,
                zakatablePercent: 1.0,
                percentOfNetZakatable: 0,
            },
            illiquidAssets: {
                label: "Illiquid Assets",
                color: "#a855f7",
                items: [],
                total: 0,
                zakatableAmount: 0,
                zakatablePercent: 1.0,
                percentOfNetZakatable: 0,
            },
            liabilities: {
                label: "Liabilities",
                color: "#ef4444",
                items: [
                    { name: "Living Expenses", value: 5000 },
                    { name: "Credit Card", value: 2500 },
                ],
                total: 7500,
            },
            exempt: {
                label: "Exempt Assets",
                color: "#9ca3af",
                items: [],
                total: 0,
            },
        };
    };

    const enhancedBreakdown = createMockBreakdown(mode);

    // Calculate totals from the categories that have zakatable assets
    const zakatableCategories: (keyof EnhancedAssetBreakdown)[] = [
        "liquidAssets", "preciousMetals", "crypto", "investments",
        "retirement", "trusts", "realEstate", "business", "debtOwedToYou", "illiquidAssets"
    ];

    const totalZakatable = zakatableCategories.reduce((sum, key) => {
        const cat = enhancedBreakdown[key] as AssetCategory;
        return sum + (cat?.zakatableAmount || 0);
    }, 0);

    const totalLiabilities = enhancedBreakdown.liabilities.total;
    const netZakatableWealth = Math.max(0, totalZakatable - totalLiabilities);
    const zakatDue = netZakatableWealth * 0.025;
    const zakatRate = 0.025;

    // Old format for backward compatibility
    const oldData = {
        liquidAssets: enhancedBreakdown.liquidAssets.total +
            enhancedBreakdown.preciousMetals.total +
            enhancedBreakdown.crypto.total,
        investments: enhancedBreakdown.investments.total,
        retirement: enhancedBreakdown.retirement.total,
        realEstate: enhancedBreakdown.realEstate.total,
        business: enhancedBreakdown.business.total,
        otherAssets: enhancedBreakdown.trusts.total +
            enhancedBreakdown.debtOwedToYou.total +
            enhancedBreakdown.illiquidAssets.total,
        totalLiabilities,
        zakatDue,
        netZakatableWealth,
        zakatRate,
    };

    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>Sankey Test | DevTools</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* Header */}
            <div className="sticky top-0 z-10 bg-card border-b border-border">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-3">
                        <Link to="/dev">
                            <Button variant="ghost" size="icon" className="-ml-2">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div className="flex items-center gap-2">
                            <ChartLineUp className="h-5 w-5 text-emerald-500" weight="duotone" />
                            <h1 className="text-lg font-semibold text-foreground">Sankey Chart Test</h1>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Mode Toggle */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Calculation Mode</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            {(["conservative", "moderate", "optimized"] as const).map((m) => (
                                <Button
                                    key={m}
                                    variant={mode === m ? "default" : "outline"}
                                    onClick={() => setMode(m)}
                                    className="capitalize"
                                >
                                    {m}
                                </Button>
                            ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                            Mode affects: Passive investments ({mode === "conservative" ? "100%" : "30%"} zakatable),
                            Retirement ({mode === "conservative" ? "65%" : "35%"} zakatable)
                        </p>
                    </CardContent>
                </Card>

                {/* Sankey Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Enhanced Sankey (10 Categories)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ZakatSankeyChart
                            data={oldData}
                            enhancedData={{
                                enhancedBreakdown,
                                totalLiabilities,
                                zakatDue,
                                netZakatableWealth,
                                zakatRate,
                                calculationMode: mode,
                                madhab: "Hanafi",
                            }}
                            currency="USD"
                            width={800}
                            height={450}
                            showLabels={true}
                            showFullscreenButton={true}
                        />
                    </CardContent>
                </Card>

                {/* Data Breakdown */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Asset Breakdown (Mode: {mode})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            {zakatableCategories.map((key) => {
                                const cat = enhancedBreakdown[key] as AssetCategory;
                                if (!cat || cat.total === 0) return null;
                                return (
                                    <div key={key} className="p-3 rounded-lg bg-muted">
                                        <div className="font-medium" style={{ color: cat.color }}>{cat.label}</div>
                                        <div className="text-muted-foreground">
                                            ${cat.total.toLocaleString()} → {Math.round(cat.zakatablePercent * 100)}% = ${cat.zakatableAmount.toLocaleString()}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                            <div>
                                <span className="text-muted-foreground mr-2">Net Zakatable: </span>
                                <span className="font-bold">${netZakatableWealth.toLocaleString()}</span>
                            </div>
                            <div className="font-bold text-lg text-primary">
                                Zakat Due: ${zakatDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
