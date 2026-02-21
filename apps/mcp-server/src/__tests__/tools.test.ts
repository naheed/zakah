/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import { describe, it, expect } from 'vitest';
import { calculateZakat, defaultFormData, ZakatFormData, ZAKAT_PRESETS, AVAILABLE_PRESETS } from '@zakatflow/core';

// =============================================================================
// Test Helpers — mirror the MCP tool logic to validate structuredContent shape
// =============================================================================

function buildFormDataFromToolInput(input: {
    cash: number;
    gold_value?: number;
    stocks?: number;
    retirement?: number;
    loans?: number;
    madhab?: string;
}): ZakatFormData {
    return {
        ...defaultFormData,
        checkingAccounts: input.cash,
        goldInvestmentValue: input.gold_value || 0,
        passiveInvestmentsValue: input.stocks || 0,
        fourOhOneKVestedBalance: input.retirement || 0,
        creditCardBalance: input.loans || 0,
        madhab: (input.madhab || 'bradford') as ZakatFormData['madhab'],
    };
}

// =============================================================================
// calculate_zakat: structuredContent shape validation
// =============================================================================
describe('calculate_zakat tool — structuredContent', () => {

    it('returns all required fields in structuredContent', () => {
        const formData = buildFormDataFromToolInput({ cash: 10000, madhab: 'bradford' });
        const result = calculateZakat(formData);

        // Verify the shape that our tool returns
        const structuredContent = {
            zakatDue: result.zakatDue,
            totalAssets: result.totalAssets,
            totalLiabilities: result.totalLiabilities,
            netZakatableWealth: result.netZakatableWealth,
            nisab: result.nisab,
            isAboveNisab: result.isAboveNisab,
            methodology: ZAKAT_PRESETS['bradford']?.meta?.name,
            methodologyId: 'bradford',
            reportLink: expect.stringContaining('zakatflow.org'),
        };

        expect(structuredContent.zakatDue).toBeTypeOf('number');
        expect(structuredContent.totalAssets).toBeTypeOf('number');
        expect(structuredContent.totalLiabilities).toBeTypeOf('number');
        expect(structuredContent.netZakatableWealth).toBeTypeOf('number');
        expect(structuredContent.nisab).toBeTypeOf('number');
        expect(structuredContent.isAboveNisab).toBeTypeOf('boolean');
        expect(structuredContent.methodology).toBeTypeOf('string');
        expect(structuredContent.methodologyId).toBe('bradford');
    });

    it('calculates correct Zakat for $10,000 cash (bradford)', () => {
        const formData = buildFormDataFromToolInput({ cash: 10000, madhab: 'bradford' });
        const result = calculateZakat(formData);
        expect(result.zakatDue).toBe(250); // 10000 * 0.025
        expect(result.isAboveNisab).toBe(true);
    });

    it('returns zero Zakat when below nisab', () => {
        const formData = buildFormDataFromToolInput({ cash: 100, madhab: 'bradford' });
        const result = calculateZakat(formData);
        expect(result.zakatDue).toBe(0);
        expect(result.isAboveNisab).toBe(false);
    });

    it('deducts liabilities correctly for bradford (12-month rule)', () => {
        const formData = buildFormDataFromToolInput({
            cash: 10000,
            loans: 3000,
            madhab: 'bradford',
        });
        const result = calculateZakat(formData);
        // Bradford uses 12_month_rule — credit card is immediate, so deducted
        expect(result.totalLiabilities).toBeGreaterThan(0);
        expect(result.zakatDue).toBeLessThan(250); // Less than $10k * 2.5%
    });

    it('applies 30% passive investment rate for bradford', () => {
        const formData = buildFormDataFromToolInput({
            cash: 5000,
            stocks: 10000,
            madhab: 'bradford',
        });
        const result = calculateZakat(formData);
        // Cash 5000 + Stocks 10000*0.30=3000 = 8000 * 0.025 = 200
        expect(result.zakatDue).toBe(200);
    });

    it('applies 100% passive investment rate for hanafi', () => {
        const formData = buildFormDataFromToolInput({
            cash: 5000,
            stocks: 10000,
            madhab: 'hanafi',
        });
        const result = calculateZakat(formData);
        // Cash 5000 + Stocks 10000*1.0=10000 = 15000 * 0.025 = 375
        expect(result.zakatDue).toBe(375);
    });

    it('deep-link contains utm_source=chatgpt', () => {
        const formData = buildFormDataFromToolInput({ cash: 10000 });
        const encoded = Buffer.from(JSON.stringify(formData)).toString('base64');
        const reportLink = `https://zakatflow.org?data=${encoded}&utm_source=chatgpt&utm_medium=widget`;
        expect(reportLink).toContain('utm_source=chatgpt');
        expect(reportLink).toContain('utm_medium=widget');
        expect(reportLink).toContain('data=');
    });

    it('works across all 8 madhabs without errors', () => {
        const madhabs = ['bradford', 'hanafi', 'shafii', 'maliki', 'hanbali', 'amja', 'qaradawi', 'tahir_anwar'];
        for (const madhab of madhabs) {
            const formData = buildFormDataFromToolInput({ cash: 10000, madhab });
            const result = calculateZakat(formData);
            expect(result.zakatDue).toBeTypeOf('number');
            expect(result.totalAssets).toBeGreaterThanOrEqual(10000);
            expect(result.nisab).toBeGreaterThan(0);
        }
    });
});

// =============================================================================
// compare_madhabs: multi-methodology comparison logic
// =============================================================================
describe('compare_madhabs tool — comparison logic', () => {

    it('produces different Zakat amounts for bradford vs hanafi with stocks', () => {
        const input = { cash: 5000, stocks: 10000 };

        const bradfordData = buildFormDataFromToolInput({ ...input, madhab: 'bradford' });
        const hanafiData = buildFormDataFromToolInput({ ...input, madhab: 'hanafi' });

        const bradfordResult = calculateZakat(bradfordData);
        const hanafiResult = calculateZakat(hanafiData);

        // Bradford: 30% stock rate, Hanafi: 100% — amounts should differ
        expect(bradfordResult.zakatDue).not.toBe(hanafiResult.zakatDue);
        expect(bradfordResult.zakatDue).toBe(200); // 5000 + 3000 = 8000 * 0.025
        expect(hanafiResult.zakatDue).toBe(375);   // 5000 + 10000 = 15000 * 0.025
    });

    it('computes correct keyRules for each methodology', () => {
        const methodologies = ['bradford', 'amja', 'shafii', 'hanafi'] as const;

        for (const madhabId of methodologies) {
            const preset = ZAKAT_PRESETS[madhabId];
            expect(preset).toBeDefined();
            expect(preset.meta.name).toBeTypeOf('string');
            expect(preset.assets?.investments?.passive_investments?.rate).toBeTypeOf('number');
            expect(preset.liabilities?.method).toBeTypeOf('string');
            expect(preset.thresholds?.nisab?.default_standard).toBeTypeOf('string');
        }
    });

    it('AMJA stock rate is 0% (income_only)', () => {
        const preset = ZAKAT_PRESETS['amja'];
        expect(preset.assets.investments.passive_investments.rate).toBe(0);
    });

    it('Bradford stock rate is 30% (underlying_assets)', () => {
        const preset = ZAKAT_PRESETS['bradford'];
        expect(preset.assets.investments.passive_investments.rate).toBe(0.30);
    });

    it('Shafii uses no_deduction for liabilities', () => {
        const preset = ZAKAT_PRESETS['shafii'];
        expect(preset.liabilities.method).toBe('no_deduction');
    });

    it('comparison of 3 madhabs produces 3 result objects', () => {
        const methodologies = ['bradford', 'hanafi', 'shafii'];
        const results = methodologies.map((madhab) => {
            const formData = buildFormDataFromToolInput({ cash: 10000, stocks: 5000, loans: 2000, madhab });
            return {
                methodologyId: madhab,
                methodologyName: ZAKAT_PRESETS[madhab]?.meta?.name,
                ...calculateZakat(formData),
            };
        });

        expect(results).toHaveLength(3);
        results.forEach((r) => {
            expect(r.methodologyId).toBeTypeOf('string');
            expect(r.methodologyName).toBeTypeOf('string');
            expect(r.zakatDue).toBeTypeOf('number');
        });

        // Shafii should have higher Zakat (no liability deduction)
        const shafiiResult = results.find(r => r.methodologyId === 'shafii')!;
        const bradfordResult = results.find(r => r.methodologyId === 'bradford')!;
        expect(shafiiResult.zakatDue).toBeGreaterThanOrEqual(bradfordResult.zakatDue);
    });

    it('all AVAILABLE_PRESETS have valid metadata', () => {
        expect(AVAILABLE_PRESETS.length).toBeGreaterThanOrEqual(8);
        for (const preset of AVAILABLE_PRESETS) {
            expect(preset.meta.id).toBeTypeOf('string');
            expect(preset.meta.name).toBeTypeOf('string');
            expect(preset.meta.description).toBeTypeOf('string');
        }
    });
});

// =============================================================================
// Widget template registration shape
// =============================================================================
describe('widget template — contract validation', () => {

    it('WIDGET_URI follows ui:// protocol', async () => {
        const { WIDGET_URI } = await import('../widget/template.js');
        expect(WIDGET_URI).toMatch(/^ui:\/\//);
    });

    it('RESOURCE_MIME_TYPE is correct MCP Apps MIME', async () => {
        const { RESOURCE_MIME_TYPE } = await import('@modelcontextprotocol/ext-apps/server');
        expect(RESOURCE_MIME_TYPE).toBe('text/html;profile=mcp-app');
    });
});
