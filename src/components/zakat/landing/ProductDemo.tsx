import { DeviceFrame } from "@/components/ui/device-frame";
import { motion } from "framer-motion";
import { ShieldCheck, DownloadSimple, CheckCircle, Lock, FileText, CalendarBlank } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { reportCard } from "@/content/marketing";

export function ProductDemo() {
    return (
        <div className="w-full max-w-2xl mx-auto perspective-[1200px] group">
            <motion.div
                initial={{ rotateX: 5, opacity: 0, y: 20 }}
                animate={{ rotateX: 0, opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="transform-style-3d transition-transform duration-700 group-hover:scale-[1.02]"
            >
                {/* Device Frame - Light mode forced for consistency */}
                <DeviceFrame className="h-[400px] sm:h-[480px] bg-zinc-50 text-slate-900 border-zinc-200">
                    <div className="h-full w-full p-6 sm:p-10 flex flex-col items-center justify-center relative overflow-hidden">

                        {/* Background Ambiance */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 -z-10" />

                        {/* The Report Card - "Financial Statement" */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="bg-white w-full max-w-sm rounded-[16px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] border border-slate-200 overflow-hidden relative"
                        >
                            {/* Header */}
                            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">ZakatFlow Statement</span>
                                </div>
                                <span className="text-[10px] items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium hidden sm:flex">
                                    <Lock className="w-3 h-3" /> {reportCard.privacyBadge}
                                </span>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-6">
                                {/* Title & Meta */}
                                <div className="space-y-1">
                                    <h3 className="font-serif text-xl text-slate-900">{reportCard.title}</h3>
                                    <p className="text-xs text-slate-400 font-medium">{reportCard.period} • {reportCard.userName}</p>
                                </div>

                                {/* The Math */}
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>{reportCard.totalAssetsLabel}</span>
                                        <span className="font-mono text-slate-700">{reportCard.totalAssetsValue}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>{reportCard.liabilitiesLabel}</span>
                                        <span className="font-mono text-red-500/80">{reportCard.liabilitiesValue}</span>
                                    </div>
                                    <div className="h-px bg-slate-100 my-2" />
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="text-slate-600">{reportCard.netAssetsLabel}</span>
                                        <span className="font-mono text-slate-900">{reportCard.netAssetsValue}</span>
                                    </div>
                                </div>

                                {/* The Outcome */}
                                <div className="pt-2">
                                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex items-center justify-between">
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{reportCard.zakatDueLabel}</span>
                                        <span className="text-2xl font-bold text-slate-900 tracking-tight font-mono">{reportCard.zakatDueValue}</span>
                                    </div>
                                </div>

                                {/* Action */}
                                <Button className="w-full h-11 gap-2 shadow-sm bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-all">
                                    <FileText className="w-4 h-4 text-emerald-400" weight="fill" />
                                    Download PDF Report
                                </Button>
                            </div>
                        </motion.div>

                    </div>
                </DeviceFrame>

                {/* Reflection/Shadow for grounding */}
                <div className="absolute -bottom-12 left-12 right-12 h-12 bg-black/5 blur-3xl rounded-[100%] z-[-20]" />
            </motion.div>
        </div>
    );
}
