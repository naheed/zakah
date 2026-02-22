/*
 * Copyright (C) 2026 ZakatFlow
 *
 * AGPL-3.0-or-later
 */

import { describe, it, expect } from 'vitest';
import type { ZakatResult, ComparisonResult, MethodologyEntry } from '../types';

// ---------------------------------------------------------------------------
// Type Contract Tests — ensure structuredContent shapes match MCP server
// ---------------------------------------------------------------------------

describe('Widget Types — ZakatResult', () => {
    const validResult: ZakatResult = {
        zakatDue: 250,
        totalAssets: 10000,
        totalLiabilities: 0,
        netZakatableWealth: 10000,
        nisab: 5520,
        isAboveNisab: true,
        methodology: 'Bradford Method',
        methodologyId: 'bradford',
        reportLink: 'https://zakatflow.org?data=abc&utm_source=chatgpt',
    };

    it('has all required numeric fields', () => {
        expect(validResult.zakatDue).toBeTypeOf('number');
        expect(validResult.totalAssets).toBeTypeOf('number');
        expect(validResult.totalLiabilities).toBeTypeOf('number');
        expect(validResult.netZakatableWealth).toBeTypeOf('number');
        expect(validResult.nisab).toBeTypeOf('number');
    });

    it('has boolean isAboveNisab', () => {
        expect(validResult.isAboveNisab).toBeTypeOf('boolean');
    });

    it('has methodology strings', () => {
        expect(validResult.methodology).toBeTypeOf('string');
        expect(validResult.methodologyId).toBeTypeOf('string');
    });

    it('has reportLink URL', () => {
        expect(validResult.reportLink).toContain('zakatflow.org');
        expect(validResult.reportLink).toContain('utm_source=chatgpt');
    });
});

describe('Widget Types — ComparisonResult', () => {
    const validComparison: ComparisonResult = {
        type: 'comparison',
        comparisons: [
            {
                methodologyId: 'bradford',
                methodologyName: 'Bradford Method',
                zakatDue: 200,
                totalAssets: 15000,
                totalLiabilities: 2000,
                netZakatableWealth: 8000,
                nisab: 5520,
                isAboveNisab: true,
                keyRules: {
                    passiveInvestmentRate: 0.30,
                    liabilityMethod: '12_month_rule',
                    nisabStandard: 'silver',
                },
            },
            {
                methodologyId: 'hanafi',
                methodologyName: 'Hanafi',
                zakatDue: 375,
                totalAssets: 15000,
                totalLiabilities: 0,
                netZakatableWealth: 15000,
                nisab: 5520,
                isAboveNisab: true,
                keyRules: {
                    passiveInvestmentRate: 1.0,
                    liabilityMethod: 'full',
                    nisabStandard: 'silver',
                },
            },
        ],
    };

    it('has type "comparison"', () => {
        expect(validComparison.type).toBe('comparison');
    });

    it('has array of comparisons', () => {
        expect(Array.isArray(validComparison.comparisons)).toBe(true);
        expect(validComparison.comparisons.length).toBe(2);
    });

    it('each entry has keyRules', () => {
        for (const entry of validComparison.comparisons) {
            expect(entry.keyRules.passiveInvestmentRate).toBeTypeOf('number');
            expect(entry.keyRules.liabilityMethod).toBeTypeOf('string');
            expect(entry.keyRules.nisabStandard).toBeTypeOf('string');
        }
    });

    it('different methodologies produce different zakatDue', () => {
        const [bradford, hanafi] = validComparison.comparisons;
        expect(bradford.zakatDue).not.toBe(hanafi.zakatDue);
    });
});

describe('Widget Package Structure', () => {
    it('exports types correctly', async () => {
        // Verify the module can be imported without errors
        const types = await import('../types');
        expect(types).toBeDefined();
    });

    it('ZakatResultCard component exists', async () => {
        const mod = await import('../components/ZakatResultCard');
        expect(typeof mod.ZakatResultCard).toBe('function');
    });

    it('MethodologyComparisonCard component exists', async () => {
        const mod = await import('../components/MethodologyComparisonCard');
        expect(typeof mod.MethodologyComparisonCard).toBe('function');
    });
});
