/*
 * Copyright (C) 2026 ZakatFlow
 *
 * AGPL-3.0-or-later
 */

import type { ComparisonResult, MethodologyEntry } from '../types';

interface Props {
    result: ComparisonResult;
}

/**
 * Polished methodology comparison card with winner highlight,
 * animated entries, and key rule badges.
 */
export function MethodologyComparisonCard({ result }: Props) {
    const fmt = (v: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

    const fmtPct = (v: number) => `${(v * 100).toFixed(0)}%`;

    // Find the lowest Zakat amount (most conservative)
    const validEntries = result.comparisons.filter(e => !e.error);
    const minZakat = Math.min(...validEntries.map(e => e.zakatDue));
    const maxZakat = Math.max(...validEntries.map(e => e.zakatDue));

    return (
        <div className="zf-card animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                    ⚖
                </div>
                <div>
                    <h2 className="text-base font-semibold text-[var(--zf-text)]">
                        Methodology Comparison
                    </h2>
                    <p className="text-xs text-[var(--zf-text-muted)]">
                        {result.comparisons.length} schools of thought
                    </p>
                </div>
            </div>

            {/* Range summary */}
            {validEntries.length >= 2 && (
                <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-xs text-[var(--zf-text-muted)]">
                    <span>Range:</span>
                    <span className="font-semibold text-[var(--zf-text)]">{fmt(minZakat)}</span>
                    <span>→</span>
                    <span className="font-semibold text-[var(--zf-text)]">{fmt(maxZakat)}</span>
                </div>
            )}

            {/* Comparison Entries */}
            <div className="space-y-2.5">
                {result.comparisons.map((entry: MethodologyEntry, i: number) => {
                    const isLowest = entry.zakatDue === minZakat && !entry.error;
                    const barWidth = maxZakat > 0 ? (entry.zakatDue / maxZakat) * 100 : 0;

                    return (
                        <div
                            key={entry.methodologyId}
                            className={`relative border rounded-lg p-3 transition-all animate-slide-up ${isLowest
                                    ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/10'
                                    : 'border-[var(--zf-border)]'
                                }`}
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            {entry.error ? (
                                <div className="text-sm text-red-500">{entry.error}</div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-medium text-sm text-[var(--zf-text)]">
                                                {entry.methodologyName}
                                            </span>
                                            {isLowest && (
                                                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                    Lowest
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-lg font-bold tabular-nums text-[var(--zf-text)]">
                                            {fmt(entry.zakatDue)}
                                        </span>
                                    </div>

                                    {/* Relative bar */}
                                    <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden mb-2">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ease-out ${isLowest
                                                    ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                                                    : 'bg-gradient-to-r from-blue-400 to-indigo-400'
                                                }`}
                                            style={{ width: `${barWidth}%` }}
                                        />
                                    </div>

                                    {/* Key Rules */}
                                    <div className="flex gap-1.5 flex-wrap">
                                        <span className="zf-rule-tag">
                                            Stocks {fmtPct(entry.keyRules.passiveInvestmentRate)}
                                        </span>
                                        <span className="zf-rule-tag">
                                            {entry.keyRules.liabilityMethod.replace(/_/g, ' ')}
                                        </span>
                                        <span className="zf-rule-tag">
                                            {entry.keyRules.nisabStandard} nisab
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Disclaimer */}
            <p className="zf-disclaimer">
                ZakatFlow provides calculations, not fatwas. Consult a qualified scholar.
            </p>
        </div>
    );
}
