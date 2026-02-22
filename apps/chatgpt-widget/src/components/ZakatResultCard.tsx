/*
 * Copyright (C) 2026 ZakatFlow
 *
 * AGPL-3.0-or-later
 */

import type { ZakatResult } from '../types';

interface Props {
    result: ZakatResult;
}

/**
 * Polished Zakat calculation result card.
 * Displays the calculated Zakat amount with animated breakdown, methodology badge,
 * nisab progress indicator, and a deep-link CTA to zakatflow.org.
 */
export function ZakatResultCard({ result }: Props) {
    const fmt = (v: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

    const nisabPercent = Math.min(100, (result.netZakatableWealth / result.nisab) * 100);

    const breakdownRows: [string, number][] = [
        ['Total Assets', result.totalAssets],
        ['Deductible Liabilities', result.totalLiabilities],
        ['Net Zakatable Wealth', result.netZakatableWealth],
        ['Nisab Threshold', result.nisab],
    ];

    return (
        <div className="zf-card animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold">
                        Z
                    </div>
                    <h2 className="text-base font-semibold text-[var(--zf-text)]">
                        Zakat Calculation
                    </h2>
                </div>
                <span className={`zf-badge ${result.isAboveNisab ? 'zf-badge--success' : 'zf-badge--warning'}`}>
                    {result.isAboveNisab ? result.methodology : 'Below Nisab'}
                </span>
            </div>

            {/* Hero Amount */}
            <div className="text-center py-4 mb-4 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 animate-slide-up">
                <p className="text-xs uppercase tracking-widest text-[var(--zf-text-muted)] mb-1">
                    Your Zakat Due
                </p>
                <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 tabular-nums">
                    {fmt(result.zakatDue)}
                </div>
                <p className="text-xs text-[var(--zf-text-muted)] mt-1">
                    2.5% of net zakatable wealth
                </p>
            </div>

            {/* Nisab Progress Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-xs text-[var(--zf-text-muted)] mb-1">
                    <span>Nisab threshold</span>
                    <span>{Math.round(nisabPercent)}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${result.isAboveNisab
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                                : 'bg-gradient-to-r from-orange-400 to-amber-400'
                            }`}
                        style={{ width: `${nisabPercent}%` }}
                    />
                </div>
            </div>

            {/* Breakdown */}
            <div className="border-t border-[var(--zf-border)] pt-3 mb-4 space-y-2">
                {breakdownRows.map(([label, value], i) => (
                    <div
                        key={label}
                        className="flex justify-between text-sm animate-slide-up"
                        style={{ animationDelay: `${i * 80}ms` }}
                    >
                        <span className="text-[var(--zf-text-muted)]">{label}</span>
                        <span className={`font-medium tabular-nums ${label === 'Net Zakatable Wealth' ? 'text-[var(--zf-text)] font-semibold' : 'text-[var(--zf-text)]'
                            }`}>
                            {fmt(value)}
                        </span>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <a
                href={result.reportLink}
                target="_blank"
                rel="noopener noreferrer"
                className="zf-cta group"
            >
                <span>View Full Report on ZakatFlow.org</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
            </a>

            {/* Disclaimer */}
            <p className="zf-disclaimer">
                ZakatFlow provides calculations, not fatwas. Consult a qualified scholar.
            </p>
        </div>
    );
}
