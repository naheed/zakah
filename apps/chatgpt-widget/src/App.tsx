/*
 * Copyright (C) 2026 ZakatFlow
 *
 * AGPL-3.0-or-later
 */

import { useApp, useHostStyleVariables, useDocumentTheme } from '@modelcontextprotocol/ext-apps/react';
import { ZakatResultCard } from './components/ZakatResultCard';
import { MethodologyComparisonCard } from './components/MethodologyComparisonCard';
import type { ZakatResult, ComparisonResult } from './types';
import { useState, useCallback } from 'react';

/**
 * Root App component for the ZakatFlow ChatGPT widget.
 *
 * Connects to the MCP Apps bridge via useApp hook, receives tool results
 * as structuredContent, and renders the appropriate widget card.
 */
export function App() {
    const [zakatResult, setZakatResult] = useState<ZakatResult | null>(null);
    const [comparison, setComparison] = useState<ComparisonResult | null>(null);

    const { app, isConnected, error } = useApp({
        appInfo: {
            name: 'ZakatFlow Calculator',
            version: '0.1.0',
        },
        capabilities: {},
        onToolResult: useCallback((toolResult: { toolName: string; result: { structuredContent?: unknown } }) => {
            const content = toolResult.result?.structuredContent;
            if (!content || typeof content !== 'object') return;

            const data = content as Record<string, unknown>;

            if (data.type === 'comparison' && Array.isArray(data.comparisons)) {
                setComparison(data as unknown as ComparisonResult);
                setZakatResult(null);
            } else if (typeof data.zakatDue === 'number') {
                setZakatResult(data as unknown as ZakatResult);
                setComparison(null);
            }
        }, []),
    });

    // Apply ChatGPT host styles (fonts, colors, spacing)
    useHostStyleVariables(app);
    useDocumentTheme(app);

    // Error state
    if (error) {
        return (
            <div className="p-4 text-red-500 text-sm">
                Widget error: {error.message}
            </div>
        );
    }

    // Connecting state
    if (!isConnected) {
        return (
            <div className="p-4 flex items-center gap-2 text-[var(--zf-text-muted)]">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Connecting to ZakatFlow...</span>
            </div>
        );
    }

    // Waiting for first tool result
    if (!zakatResult && !comparison) {
        return (
            <div className="p-4 text-center text-[var(--zf-text-muted)] text-sm">
                <p>ZakatFlow widget ready. Waiting for calculation...</p>
            </div>
        );
    }

    // Render appropriate card
    return (
        <div className="p-2">
            {zakatResult && <ZakatResultCard result={zakatResult} />}
            {comparison && <MethodologyComparisonCard result={comparison} />}
        </div>
    );
}
