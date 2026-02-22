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
 * Side-by-side methodology comparison card widget.
 * Shows how different schools of thought affect Zakat calculation.
 *
 * Designed to render inside ChatGPT via the MCP Apps SDK.
 * Full implementation in Issue #29.
 */
export function MethodologyComparisonCard({ result }: Props) {
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

    const formatPercent = (value: number) => `${(value * 100).toFixed(0)}%`;

    return (
        <div className="border border-[var(--zf-border)] rounded-xl p-5 bg-[var(--zf-card-bg)] shadow-sm">
            {/* Header */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-[var(--zf-text)]">
                    Methodology Comparison
                </h2>
                <p className="text-sm text-[var(--zf-text-muted)]">
                    {result.comparisons.length} schools of thought compared
                </p>
            </div>

            {/* Comparison Grid */}
            <div className="space-y-3">
                {result.comparisons.map((entry: MethodologyEntry) => (
                    <div
                        key={entry.methodologyId}
                        className="border border-[var(--zf-border)] rounded-lg p-3"
                    >
                        {entry.error ? (
                            <div className="text-sm text-red-500">{entry.error}</div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-sm text-[var(--zf-text)]">
                                        {entry.methodologyName}
                                    </span>
                                    <span className="text-lg font-bold text-[var(--zf-text)]">
                                        {formatCurrency(entry.zakatDue)}
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-1 text-xs text-[var(--zf-text-muted)]">
                                    <div>
                                        <span className="block font-medium">Stocks</span>
                                        {formatPercent(entry.keyRules.passiveInvestmentRate)}
                                    </div>
                                    <div>
                                        <span className="block font-medium">Liabilities</span>
                                        {entry.keyRules.liabilityMethod.replace(/_/g, ' ')}
                                    </div>
                                    <div>
                                        <span className="block font-medium">Nisab</span>
                                        {entry.keyRules.nisabStandard}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Disclaimer */}
            <p className="text-[11px] text-[var(--zf-text-muted)] text-center mt-4">
                ZakatFlow provides calculations, not fatwas. Consult a qualified scholar.
            </p>
        </div>
    );
}
