/*
 * Copyright (C) 2026 ZakatFlow
 *
 * AGPL-3.0-or-later
 */

import { useApp, useHostStyleVariables } from '@modelcontextprotocol/ext-apps/react';
import { ZakatResultCard } from './components/ZakatResultCard';
import { MethodologyComparisonCard } from './components/MethodologyComparisonCard';
import { SessionProgressCard } from './components/SessionProgressCard';
import type { ZakatResult, ComparisonResult, SessionProgress } from './types';
import { useState, useCallback } from 'react';

/**
 * Root App component for the ZakatFlow ChatGPT widget.
 *
 * Connects to the MCP Apps bridge via useApp hook, receives tool results
 * via app.ontoolresult, and renders the appropriate widget card:
 * - calculate_zakat → ZakatResultCard
 * - compare_madhabs → MethodologyComparisonCard
 * - add_asset / session updates → SessionProgressCard
 */
export function App() {
    const [zakatResult, setZakatResult] = useState<ZakatResult | null>(null);
    const [comparison, setComparison] = useState<ComparisonResult | null>(null);
    const [sessionProgress, setSessionProgress] = useState<SessionProgress | null>(null);

    const handleToolResult = useCallback((toolResult: { structuredContent?: unknown }) => {
        const content = toolResult?.structuredContent;
        if (!content || typeof content !== 'object') return;

        const data = content as Record<string, unknown>;

        if (data.type === 'comparison' && Array.isArray(data.comparisons)) {
            setComparison(data as unknown as ComparisonResult);
            setZakatResult(null);
            setSessionProgress(null);
        } else if (data.type === 'session_progress' && Array.isArray(data.assets)) {
            setSessionProgress(data as unknown as SessionProgress);
        } else if (typeof data.zakatDue === 'number') {
            setZakatResult(data as unknown as ZakatResult);
            setComparison(null);
            setSessionProgress(null);
        }
    }, []);

    const { app, isConnected, error } = useApp({
        appInfo: {
            name: 'ZakatFlow Calculator',
            version: '0.2.0',
        },
        capabilities: {},
        onAppCreated: useCallback((app) => {
            app.ontoolresult = (result) => {
                handleToolResult(result);
            };
        }, [handleToolResult]),
    });

    // Apply ChatGPT host styles (fonts, colors, spacing, theme)
    useHostStyleVariables(app);

    // Error state
    if (error) {
        return (
            <div className="p-4 text-red-500 text-sm animate-fade-in">
                <p className="font-medium">Widget Error</p>
                <p className="text-xs mt-1 opacity-75">{error.message}</p>
            </div>
        );
    }

    // Connecting state
    if (!isConnected) {
        return (
            <div className="p-4 flex items-center gap-2.5 text-[var(--zf-text-muted)] animate-fade-in">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Connecting to ZakatFlow...</span>
            </div>
        );
    }

    // Waiting for first tool result
    if (!zakatResult && !comparison && !sessionProgress) {
        return (
            <div className="p-4 text-center text-[var(--zf-text-muted)] text-sm animate-fade-in">
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-lg font-bold">
                    Z
                </div>
                <p className="font-medium text-[var(--zf-text)]">ZakatFlow Ready</p>
                <p className="text-xs mt-0.5">Waiting for calculation...</p>
            </div>
        );
    }

    // Render appropriate card
    return (
        <div className="p-2">
            {sessionProgress && <SessionProgressCard session={sessionProgress} />}
            {zakatResult && <ZakatResultCard result={zakatResult} />}
            {comparison && <MethodologyComparisonCard result={comparison} />}
        </div>
    );
}
