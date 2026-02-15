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


import { useState, useEffect } from "react";
import { DeviceFrame } from "@/components/ui/device-frame";
import { motion, AnimatePresence } from "framer-motion";
import { ResponsiveSankey } from "@nivo/sankey";
import { formatCurrency } from "@/lib/zakatCalculations";
import { FileText, Spinner, CheckCircle, ShieldCheck, DownloadSimple, ArrowRight, UploadSimple, Lock } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

// --- Types & Data ---

type DemoPhase =
    | "input"     // 0-4s: Manual input ease
    | "upload"    // 4-6s: Drag & drop file
    | "extract"   // 6-9s: Scanning/Extracting items
    | "visualize" // 9-14s: Nivo Sankey reveal
    | "report";   // 14-18s: Final CTA

const SANKEY_DATA = {
    nodes: [
        { id: "Total Wealth", nodeColor: "#3b82f6" },     // Blue ($595k)
        { id: "401(k)", nodeColor: "#94a3b8" },           // Gray (Exempt)
        { id: "Cash & Roth", nodeColor: "#22c55e" },      // Green (Zakatable)
        { id: "Passive ETFs", nodeColor: "#eab308" },     // Yellow (Split)
        { id: "Zakatable", nodeColor: "#8b5cf6" },        // Purple
        { id: "Exempt Assets", nodeColor: "#94a3b8" },    // Gray
        { id: "Retained", nodeColor: "#cbd5e1" },         // Slate
        { id: "Zakat Due", nodeColor: "#16a34a" }         // Green
    ],
    links: [
        { source: "Total Wealth", target: "401(k)", value: 320000 },
        { source: "Total Wealth", target: "Cash & Roth", value: 105000 },
        { source: "Total Wealth", target: "Passive ETFs", value: 150000 },

        { source: "401(k)", target: "Exempt Assets", value: 320000 }, // Under 59.5 Rule

        { source: "Cash & Roth", target: "Zakatable", value: 105000 },

        { source: "Passive ETFs", target: "Zakatable", value: 45000 }, // 30% Rule
        { source: "Passive ETFs", target: "Exempt Assets", value: 105000 },

        { source: "Zakatable", target: "Zakat Due", value: 3025 },
        { source: "Zakatable", target: "Retained", value: 146975 },
    ]
};

export function ProductDemo() {
    const [phase, setPhase] = useState<DemoPhase>("input");
    const [typedValue, setTypedValue] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);

    // --- Animation Loop ---
    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout> | null = null;

        const runSequence = async () => {
            // PHASE 1: INPUT (0s)
            setPhase("input");
            setTypedValue("");
            setUploadProgress(0);

            // Slower typing for "Ahmed's" larger number: $595,000
            await new Promise(r => setTimeout(r, 1000));
            const targetValue = "$595,000";
            for (let i = 0; i <= targetValue.length; i++) {
                await new Promise(r => setTimeout(r, 150)); // Slower typing (150ms)
                setTypedValue(targetValue.slice(0, i));
            }

            await new Promise(r => setTimeout(r, 1500)); // Longer pause

            // PHASE 2: UPLOAD (Start)
            setPhase("upload");
            await new Promise(r => setTimeout(r, 2000)); // 2s wait

            // PHASE 3: EXTRACT
            setPhase("extract");
            // Slower progress 
            for (let i = 0; i <= 100; i += 4) {
                setUploadProgress(i);
                await new Promise(r => setTimeout(r, 80)); // Slower progress
            }
            await new Promise(r => setTimeout(r, 1000));

            // PHASE 4: VISUALIZE
            setPhase("visualize");
            await new Promise(r => setTimeout(r, 8000)); // 8s to read the complex Ahmed chart

            // PHASE 5: REPORT
            setPhase("report");
            await new Promise(r => setTimeout(r, 5000)); // 5s to see CTA

            // RESTART
            timeoutId = setTimeout(runSequence, 100);
        };

        runSequence();

        return () => { if (timeoutId) clearTimeout(timeoutId); }; // Basic cleanup, though async loop is harder to cancel perfectly
    }, []);

    return (
        <div className="w-full max-w-2xl mx-auto perspective-[1200px] group">
            <motion.div
                initial={{ rotateX: 5, opacity: 0, y: 20 }}
                animate={{ rotateX: 0, opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="transform-style-3d transition-transform duration-700 group-hover:scale-[1.02]"
            >
                {/* Force light mode bg-zinc-50 for consistent contrast/A11y regardless of app theme */}
                <DeviceFrame className="h-[400px] sm:h-[480px] bg-zinc-50 text-slate-900">
                    <div className="h-full w-full p-6 sm:p-10 flex flex-col justify-center items-center relative overflow-hidden">

                        {/* Background Decor - ensuring light theme consistency */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 -z-10" />
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10" />

                        <AnimatePresence mode="wait">
                            {phase === "input" && (
                                <motion.div
                                    key="input"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="w-full max-w-md space-y-6"
                                >
                                    <div className="text-center space-y-2">
                                        <h3 className="text-xl font-bold text-slate-900">Total Assets</h3>
                                        <p className="text-slate-500 text-sm">Reviewing Ahmed's Portfolio</p>
                                    </div>

                                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-500 uppercase">Gross Wealth</label>
                                            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                                <span className="text-2xl font-medium text-slate-900">{typedValue}<span className="animate-pulse text-blue-500">|</span></span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* --- PHASE 2 & 3: UPLOAD & EXTRACT --- */}
                            {(phase === "upload" || phase === "extract") && (
                                <motion.div
                                    key="upload-extract"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    className="w-full max-w-md"
                                >
                                    <div className="bg-white p-6 rounded-xl border border-dashed border-blue-200 shadow-sm text-center space-y-4 relative overflow-hidden">
                                        {/* Progress Bar background for extract phase */}
                                        {phase === "extract" && (
                                            <motion.div
                                                className="absolute bottom-0 left-0 h-1 bg-blue-500"
                                                initial={{ width: "0%" }}
                                                animate={{ width: `${uploadProgress}%` }}
                                            />
                                        )}

                                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-500">
                                            {phase === "extract" ? <Spinner className="animate-spin w-6 h-6" /> : <UploadSimple className="w-6 h-6" />}
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-slate-900">
                                                {phase === "extract" ? "AI Analysis..." : "Ahmed_Portfolio.pdf"}
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {phase === "extract" ? "Separating 401(k) & Passive Assets" : "Drag & Drop Financial Statements"}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* --- PHASE 4: VISUALIZE (SANKEY) --- */}
                            {phase === "visualize" && (
                                <motion.div
                                    key="visualize"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, filter: "blur(10px)" }}
                                    className="w-full h-full absolute inset-0 p-6 flex flex-col"
                                >
                                    <div className="text-center mb-2 shrink-0">
                                        <h3 className="font-bold text-lg text-slate-900">Zakat Methodology</h3>
                                        <p className="text-xs text-slate-500">Applying the "Balanced" Approach</p>
                                    </div>

                                    {/* Container needs explicit height for Nivo to measure */}
                                    <div className="flex-1 min-h-0 w-full bg-white/50 rounded-lg border border-slate-200 relative overflow-hidden">
                                        <ResponsiveSankey
                                            data={SANKEY_DATA}
                                            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                                            align="justify"
                                            colors={(node: { nodeColor?: string }) => node.nodeColor ?? "#94a3b8"}
                                            nodeOpacity={1}
                                            nodeThickness={14}
                                            nodeInnerPadding={3}
                                            nodeSpacing={20}
                                            nodeBorderWidth={0}
                                            linkOpacity={0.3}
                                            linkBlendMode="multiply"
                                            enableLinkGradient={true}
                                            labelPosition="outside"
                                            labelOrientation="vertical"
                                            labelPadding={10}
                                            labelTextColor={{ from: 'color', modifiers: [['darker', 2]] }} // High contrast text
                                            theme={{
                                                labels: { text: { fontSize: 10, fontWeight: 700, fill: "#334155" } }, // Force Slate-700
                                            }}
                                        />
                                    </div>

                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 2.5 }}
                                        className="absolute bottom-8 right-8 bg-white p-3 rounded-lg shadow-xl border border-green-100 flex items-center gap-3 z-10"
                                    >
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold">Zakat Due</p>
                                            <p className="text-xl font-black text-green-600">$3,025</p>
                                        </div>
                                        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                            <CheckCircle weight="fill" className="w-5 h-5" />
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* --- PHASE 5: REPORT --- */}
                            {phase === "report" && (
                                <motion.div
                                    key="report"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-full max-w-sm"
                                >
                                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 text-center space-y-6">
                                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2 ring-4 ring-green-50/50">
                                            <ShieldCheck className="w-8 h-8 text-green-600" weight="duotone" />
                                        </div>

                                        <div className="space-y-1">
                                            <h3 className="text-xl font-bold text-slate-900">Ahmed's Report</h3>
                                            <p className="text-sm text-slate-500">Breakdown ready for download</p>
                                        </div>

                                        <div className="flex gap-3 justify-center">
                                            <Button className="w-full gap-2 shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 text-white">
                                                <DownloadSimple weight="bold" /> Download PDF
                                            </Button>
                                        </div>

                                        <div className="pt-4 border-t border-slate-100 border-dashed">
                                            <p className="text-[10px] text-slate-400 flex justify-center items-center gap-1.5">
                                                <Lock className="w-3 h-3" /> Data erased after session
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </DeviceFrame>

                {/* Reflection/Shadow for grounding */}
                <div className="absolute -bottom-12 left-10 right-10 h-8 bg-black/10 blur-2xl rounded-[100%] z-[-20]" />
            </motion.div>
        </div>
    );
}
