/*
 * Copyright (C) 2026 ZakatFlow
 *
 * AGPL-3.0-or-later
 */

import type { SessionProgress, SessionAsset } from '../types';

interface Props {
    session: SessionProgress;
}

const ASSET_ICONS: Record<string, string> = {
    cash: '💵',
    gold: '🥇',
    silver: '🥈',
    stocks: '📈',
    retirement: '🏦',
    loans: '📋',
};

const ASSET_LABELS: Record<string, string> = {
    cash: 'Cash & Checking',
    gold: 'Gold Investments',
    silver: 'Silver',
    stocks: 'Stocks & Funds',
    retirement: 'Retirement Accounts',
    loans: 'Liabilities',
};

/**
 * Interactive session progress card.
 * Shows the running state of a multi-turn Zakat calculation session,
 * including added assets, a running total, and the "next step" hint.
 */
export function SessionProgressCard({ session }: Props) {
    const fmt = (v: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

    const totalAssets = session.assets
        .filter(a => a.type !== 'loans')
        .reduce((sum, a) => sum + a.amount, 0);

    const totalLiabilities = session.assets
        .filter(a => a.type === 'loans')
        .reduce((sum, a) => sum + a.amount, 0);

    const progressSteps: SessionAsset['type'][] = ['cash', 'gold', 'stocks', 'retirement', 'loans'];
    const completedTypes = new Set(session.assets.map(a => a.type));
    const completedCount = progressSteps.filter(s => completedTypes.has(s)).length;

    return (
        <div className="zf-card animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                        ✦
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-[var(--zf-text)]">
                            Session Progress
                        </h2>
                        <p className="text-xs text-[var(--zf-text-muted)]">
                            {session.assets.length} asset{session.assets.length !== 1 ? 's' : ''} added
                        </p>
                    </div>
                </div>
                <span className="zf-badge zf-badge--info">
                    {completedCount}/{progressSteps.length} categories
                </span>
            </div>

            {/* Progress dots */}
            <div className="flex gap-1.5 mb-4">
                {progressSteps.map((step) => (
                    <div
                        key={step}
                        className={`flex-1 h-1.5 rounded-full transition-colors duration-500 ${completedTypes.has(step as SessionAsset['type'])
                            ? 'bg-gradient-to-r from-violet-400 to-purple-500'
                            : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                        title={ASSET_LABELS[step] || step}
                    />
                ))}
            </div>

            {/* Assets List */}
            {session.assets.length > 0 && (
                <div className="space-y-1.5 mb-4">
                    {session.assets.map((asset: SessionAsset, i: number) => (
                        <div
                            key={`${asset.type}-${i}`}
                            className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 animate-slide-up"
                            style={{ animationDelay: `${i * 60}ms` }}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-base">{ASSET_ICONS[asset.type] || '💰'}</span>
                                <span className="text-sm text-[var(--zf-text)]">
                                    {ASSET_LABELS[asset.type] || asset.type}
                                </span>
                            </div>
                            <span className={`text-sm font-medium tabular-nums ${asset.type === 'loans'
                                ? 'text-red-500'
                                : 'text-[var(--zf-text)]'
                                }`}>
                                {asset.type === 'loans' ? '−' : ''}{fmt(asset.amount)}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Running Totals */}
            <div className="border-t border-[var(--zf-border)] pt-3 space-y-1.5">
                <div className="flex justify-between text-sm">
                    <span className="text-[var(--zf-text-muted)]">Total Assets</span>
                    <span className="font-semibold tabular-nums text-[var(--zf-text)]">
                        {fmt(totalAssets)}
                    </span>
                </div>
                {totalLiabilities > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-[var(--zf-text-muted)]">Liabilities</span>
                        <span className="font-semibold tabular-nums text-red-500">
                            −{fmt(totalLiabilities)}
                        </span>
                    </div>
                )}
                {session.runningZakat !== undefined && (
                    <div className="flex justify-between text-sm pt-1 border-t border-dashed border-[var(--zf-border)]">
                        <span className="text-[var(--zf-text-muted)]">Estimated Zakat</span>
                        <span className="font-bold tabular-nums text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                            {fmt(session.runningZakat)}
                        </span>
                    </div>
                )}
            </div>

            {/* Next step hint */}
            {session.nextHint && (
                <div className="mt-3 px-3 py-2 rounded-lg bg-violet-50 dark:bg-violet-950/20 text-xs text-[var(--zf-text-muted)]">
                    💡 {session.nextHint}
                </div>
            )}
        </div>
    );
}
