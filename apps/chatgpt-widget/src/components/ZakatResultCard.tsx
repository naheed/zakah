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
 * Zakat calculation result card widget.
 * Displays the calculated Zakat amount, breakdown, and a deep-link to zakatflow.org.
 *
 * Designed to render inside ChatGPT via the MCP Apps SDK.
 * Full implementation in Issue #29.
 */
export function ZakatResultCard({ result }: Props) {
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

    return (
        <div className="border border-[var(--zf-border)] rounded-xl p-5 bg-[var(--zf-card-bg)] shadow-sm">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[var(--zf-text)]">
                    Zakat Calculation
                </h2>
                <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${result.isAboveNisab
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        }`}
                >
                    {result.isAboveNisab ? result.methodology : 'Below Nisab'}
                </span>
            </div>

            {/* Amount */}
            <div className="text-3xl font-bold text-[var(--zf-text)] mb-1">
                {formatCurrency(result.zakatDue)}
            </div>
            <p className="text-sm text-[var(--zf-text-muted)] mb-4">
                {result.isAboveNisab
                    ? `Above nisab threshold (${formatCurrency(result.nisab)})`
                    : 'Below nisab — no Zakat obligation'}
            </p>

            {/* Breakdown */}
            <div className="border-t border-[var(--zf-border)] pt-4 mb-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    {[
                        ['Total Assets', result.totalAssets],
                        ['Deductible Liabilities', result.totalLiabilities],
                        ['Net Zakatable Wealth', result.netZakatableWealth],
                        ['Nisab Threshold', result.nisab],
                    ].map(([label, value]) => (
                        <div key={label as string} className="flex justify-between col-span-2">
                            <span className="text-[var(--zf-text-muted)]">{label as string}</span>
                            <span className="font-medium text-[var(--zf-text)]">
                                {formatCurrency(value as number)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <a
                href={result.reportLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-2.5 rounded-lg bg-[var(--zf-primary)] text-white text-sm font-medium hover:bg-[var(--zf-primary-light)] transition-colors no-underline"
            >
                View Full Report on ZakatFlow.org
            </a>

            {/* Disclaimer */}
            <p className="text-[11px] text-[var(--zf-text-muted)] text-center mt-3">
                ZakatFlow provides calculations, not fatwas. Consult a qualified scholar.
            </p>
        </div>
    );
}
