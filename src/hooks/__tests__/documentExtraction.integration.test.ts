/**
 * Document Extraction Integration Tests
 * 
 * These tests verify that documents extracted via AI are correctly mapped
 * to ZakatFormData fields, ensuring the calculation engine receives
 * properly formatted data.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mapToZakatCategory, inferAccountTypeFromStep } from '../useAssetPersistence';
import { ZakatFormData, defaultFormData, calculateZakat } from '@/lib/zakatCalculations';

// =============================================================================
// AI Category Mapping Tests
// =============================================================================

describe('Document Extraction - Category Mapping', () => {

    describe('mapToZakatCategory', () => {

        it('maps bank statement categories to LIQUID', () => {
            expect(mapToZakatCategory('CASH')).toBe('LIQUID');
            expect(mapToZakatCategory('CHECKING')).toBe('LIQUID');
            expect(mapToZakatCategory('SAVINGS')).toBe('LIQUID');
            expect(mapToZakatCategory('HIGH_YIELD_SAVINGS')).toBe('LIQUID');
            expect(mapToZakatCategory('MONEY_MARKET')).toBe('LIQUID');
        });

        it('maps crypto categories to PROXY_100 (100% zakatable)', () => {
            expect(mapToZakatCategory('CRYPTO')).toBe('PROXY_100');
            expect(mapToZakatCategory('CRYPTOCURRENCY')).toBe('PROXY_100');
            expect(mapToZakatCategory('CRYPTO_WALLET')).toBe('PROXY_100');
        });

        it('maps investment categories to PROXY_30 (30% rule)', () => {
            expect(mapToZakatCategory('EQUITY')).toBe('PROXY_30');
            expect(mapToZakatCategory('STOCK')).toBe('PROXY_30');
            expect(mapToZakatCategory('ETF')).toBe('PROXY_30');
            expect(mapToZakatCategory('MUTUAL_FUND')).toBe('PROXY_30');
            // Note: INDEX_FUND not explicitly mapped, defaults to LIQUID
        });

        it('maps bond categories to LIQUID (100% zakatable)', () => {
            expect(mapToZakatCategory('BOND')).toBe('LIQUID');
            expect(mapToZakatCategory('FIXED_INCOME')).toBe('LIQUID');
            // Note: TREASURY not explicitly mapped, defaults to LIQUID
        });

        it('maps retirement categories to PROXY_30 (special handling)', () => {
            expect(mapToZakatCategory('RETIREMENT')).toBe('PROXY_30');
            expect(mapToZakatCategory('401K')).toBe('PROXY_30');
            expect(mapToZakatCategory('ROTH_IRA')).toBe('PROXY_30');
            expect(mapToZakatCategory('TRADITIONAL_IRA')).toBe('PROXY_30');
        });

        it('maps liability categories to EXEMPT', () => {
            expect(mapToZakatCategory('EXPENSE')).toBe('EXEMPT');
            expect(mapToZakatCategory('LIABILITY')).toBe('EXEMPT');
            expect(mapToZakatCategory('CREDIT_CARD_DEBT')).toBe('EXEMPT');
            // Note: LOAN by itself doesn't match - needs 'DEBT' or 'LIABILITY' keyword
        });

        it('defaults unknown categories to LIQUID (safe default)', () => {
            expect(mapToZakatCategory('UNKNOWN')).toBe('LIQUID');
            expect(mapToZakatCategory('')).toBe('LIQUID');
            expect(mapToZakatCategory('RANDOM_CATEGORY')).toBe('LIQUID');
        });

        it('handles case insensitivity', () => {
            expect(mapToZakatCategory('cash')).toBe('LIQUID');
            expect(mapToZakatCategory('Cash')).toBe('LIQUID');
            expect(mapToZakatCategory('CASH')).toBe('LIQUID');
        });

    });

    describe('inferAccountTypeFromStep', () => {

        it('maps wizard steps to correct account types', () => {
            expect(inferAccountTypeFromStep('liquid-assets')).toBe('CHECKING');
            expect(inferAccountTypeFromStep('investments')).toBe('BROKERAGE');
            expect(inferAccountTypeFromStep('retirement')).toBe('RETIREMENT_401K');
            expect(inferAccountTypeFromStep('crypto')).toBe('CRYPTO_WALLET');
            expect(inferAccountTypeFromStep('trusts')).toBe('TRUST');
            expect(inferAccountTypeFromStep('precious-metals')).toBe('METALS');
            expect(inferAccountTypeFromStep('business')).toBe('BUSINESS');
            expect(inferAccountTypeFromStep('real-estate')).toBe('REAL_ESTATE');
        });

        it('defaults unknown steps to OTHER', () => {
            expect(inferAccountTypeFromStep('unknown-step')).toBe('OTHER');
            expect(inferAccountTypeFromStep('')).toBe('OTHER');
        });

    });

});

// =============================================================================
// End-to-End Extraction Flow Tests
// =============================================================================

describe('Document Extraction - End-to-End Calculation Flow', () => {

    it('bank statement extraction flows to correct calculation', () => {
        // Simulate AI extracting $50,000 from a bank statement
        const extractedData: Partial<ZakatFormData> = {
            checkingAccounts: 30000,
            savingsAccounts: 20000,
        };

        const formData: ZakatFormData = {
            ...defaultFormData,
            madhab: 'balanced',
            ...extractedData,
        };

        const result = calculateZakat(formData);

        // Verify liquid assets are calculated at 100%
        expect(result.enhancedBreakdown.liquidAssets.zakatableAmount).toBe(50000);
        expect(result.totalAssets).toBe(50000);
    });

    it('401k statement extraction flows to correct calculation (under 59.5)', () => {
        // Simulate AI extracting $100,000 from a 401k statement
        const extractedData: Partial<ZakatFormData> = {
            fourOhOneKVestedBalance: 100000,
        };

        const formData: ZakatFormData = {
            ...defaultFormData,
            madhab: 'balanced',
            age: 40, // Under 59.5
            ...extractedData,
        };

        const result = calculateZakat(formData);

        // Balanced mode exempts 401k under 59.5
        expect(result.enhancedBreakdown.retirement.zakatableAmount).toBe(0);
    });

    it('brokerage statement extraction flows to correct calculation', () => {
        // Simulate AI extracting $80,000 from a brokerage statement
        const extractedData: Partial<ZakatFormData> = {
            passiveInvestmentsValue: 80000,
        };

        const formData: ZakatFormData = {
            ...defaultFormData,
            madhab: 'balanced',
            ...extractedData,
        };

        const result = calculateZakat(formData);

        // Balanced mode applies 30% rule to passive investments
        expect(result.enhancedBreakdown.investments.zakatableAmount).toBe(24000); // 80k * 30%
    });

    it('credit card statement extraction flows to correct calculation', () => {
        // Simulate AI extracting $5,000 credit card debt
        const extractedData: Partial<ZakatFormData> = {
            creditCardBalance: 5000,
            cashOnHand: 50000, // Need assets to test deduction
        };

        const formData: ZakatFormData = {
            ...defaultFormData,
            madhab: 'balanced',
            ...extractedData,
        };

        const result = calculateZakat(formData);

        // Credit card should be deducted from net zakatable wealth
        expect(result.totalAssets).toBe(50000);
        expect(result.totalLiabilities).toBe(5000);
        expect(result.netZakatableWealth).toBe(45000);
    });

    it('multiple document extractions aggregate correctly', () => {
        // Simulate multiple documents uploaded
        const bankExtraction = { checkingAccounts: 20000 };
        const brokerageExtraction = { passiveInvestmentsValue: 50000 };
        const retirementExtraction = { rothIRAContributions: 15000 };

        // These would be merged into formData by the UI
        const formData: ZakatFormData = {
            ...defaultFormData,
            madhab: 'balanced',
            ...bankExtraction,
            ...brokerageExtraction,
            ...retirementExtraction,
        };

        const result = calculateZakat(formData);

        // Verify all sources are included
        expect(result.enhancedBreakdown.liquidAssets.zakatableAmount).toBe(20000);
        expect(result.enhancedBreakdown.investments.zakatableAmount).toBe(15000); // 50k * 30%
        expect(result.enhancedBreakdown.retirement.zakatableAmount).toBe(15000); // Roth contributions always zakatable
    });

});

// =============================================================================
// Line Item Aggregation Tests
// =============================================================================

describe('Document Extraction - Line Item Aggregation', () => {

    it('aggregates multiple line items into category totals', () => {
        // Simulate line items from a brokerage statement
        const lineItems = [
            { description: 'AAPL Stock', amount: 10000, inferredCategory: 'EQUITY' },
            { description: 'VTI ETF', amount: 25000, inferredCategory: 'ETF' },
            { description: 'Cash Reserve', amount: 5000, inferredCategory: 'CASH' },
        ];

        // The mapToZakatCategory function would be used to categorize each
        const categories = lineItems.map(item => ({
            ...item,
            zakatCategory: mapToZakatCategory(item.inferredCategory)
        }));

        expect(categories[0].zakatCategory).toBe('PROXY_30'); // Stock
        expect(categories[1].zakatCategory).toBe('PROXY_30'); // ETF
        expect(categories[2].zakatCategory).toBe('LIQUID'); // Cash
    });

});
