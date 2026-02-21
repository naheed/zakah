/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * Document Extraction Integration Tests
 * 
 * These tests verify that documents extracted via AI are correctly mapped
 * to ZakatFormData fields, ensuring the calculation engine receives
 * properly formatted data.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mapToAssetCategory, inferAccountTypeFromStep } from '../useAssetPersistence';
import { ZakatFormData, defaultFormData, calculateZakat } from '@zakatflow/core';

// =============================================================================
// AI Category Mapping Tests
// =============================================================================

describe('Document Extraction - Category Mapping', () => {

    describe('mapToAssetCategory', () => {

        it('maps bank statement categories to CASH equivalents', () => {
            expect(mapToAssetCategory('CASH')).toBe('CASH_ON_HAND');
            expect(mapToAssetCategory('CHECKING')).toBe('CASH_CHECKING');
            expect(mapToAssetCategory('SAVINGS')).toBe('CASH_SAVINGS');
            expect(mapToAssetCategory('HIGH_YIELD_SAVINGS')).toBe('HIGH_YIELD_SAVINGS'); // passed through
            expect(mapToAssetCategory('MONEY_MARKET')).toBe('CASH_SAVINGS');
        });

        it('maps crypto categories to CRYPTO', () => {
            expect(mapToAssetCategory('CRYPTO')).toBe('CRYPTO');
            expect(mapToAssetCategory('CRYPTOCURRENCY')).toBe('CRYPTO');
            expect(mapToAssetCategory('CRYPTO_WALLET')).toBe('CRYPTO_WALLET'); // passed through
        });

        it('maps investment categories to INVESTMENT_STOCK etc', () => {
            expect(mapToAssetCategory('EQUITY')).toBe('INVESTMENT_STOCK');
            expect(mapToAssetCategory('STOCK')).toBe('INVESTMENT_STOCK');
            expect(mapToAssetCategory('ETF')).toBe('INVESTMENT_STOCK');
            expect(mapToAssetCategory('MUTUAL_FUND')).toBe('INVESTMENT_MUTUAL_FUND');
            // Note: INDEX_FUND not explicitly mapped, will pass through
        });

        it('maps bond categories to INVESTMENT_BOND', () => {
            expect(mapToAssetCategory('BOND')).toBe('INVESTMENT_BOND');
            expect(mapToAssetCategory('FIXED_INCOME')).toBe('INVESTMENT_BOND');
        });

        it('maps retirement categories to structural equivalents', () => {
            expect(mapToAssetCategory('RETIREMENT')).toBe('RETIREMENT_401K');
            expect(mapToAssetCategory('401K')).toBe('RETIREMENT_401K');
            expect(mapToAssetCategory('ROTH_IRA')).toBe('RETIREMENT_ROTH');
            expect(mapToAssetCategory('TRADITIONAL_IRA')).toBe('RETIREMENT_IRA');
        });

        it('maps liability categories to LIABILITY equivalents', () => {
            expect(mapToAssetCategory('EXPENSE')).toBe('EXPENSE'); // Pass through
            expect(mapToAssetCategory('LIABILITY')).toBe('LIABILITY_LOAN');
            expect(mapToAssetCategory('CREDIT_CARD_DEBT')).toBe('LIABILITY_CREDIT_CARD');
        });

        it('preserves unknown categories (legacy mapping strips to LIQUID but semantic retains it)', () => {
            expect(mapToAssetCategory('UNKNOWN')).toBe('UNKNOWN');
            expect(mapToAssetCategory('RANDOM_CATEGORY')).toBe('RANDOM_CATEGORY');
        });

        it('handles case insensitivity by returning uppercased', () => {
            expect(mapToAssetCategory('cash')).toBe('CASH_ON_HAND');
            expect(mapToAssetCategory('Cash')).toBe('CASH_ON_HAND');
            expect(mapToAssetCategory('CASH')).toBe('CASH_ON_HAND');
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
        const extractedData: Partial<ZakatFormData> = {
            checkingAccounts: 30000,
            savingsAccounts: 20000,
        };

        const formData: ZakatFormData = {
            ...defaultFormData,
            madhab: 'bradford',
            ...extractedData,
        };

        const result = calculateZakat(formData);
        expect(result.enhancedBreakdown.liquidAssets.zakatableAmount).toBe(50000);
        expect(result.totalAssets).toBe(50000);
    });

    it('401k statement extraction flows to correct calculation (under 59.5)', () => {
        const extractedData: Partial<ZakatFormData> = {
            fourOhOneKVestedBalance: 100000,
        };

        const formData: ZakatFormData = {
            ...defaultFormData,
            madhab: 'bradford',
            age: 40,
            ...extractedData,
        };

        const result = calculateZakat(formData);
        expect(result.enhancedBreakdown.retirement.zakatableAmount).toBe(0);
    });

    it('brokerage statement extraction flows to correct calculation', () => {
        const extractedData: Partial<ZakatFormData> = {
            passiveInvestmentsValue: 80000,
        };

        const formData: ZakatFormData = {
            ...defaultFormData,
            madhab: 'bradford',
            ...extractedData,
        };

        const result = calculateZakat(formData);
        expect(result.enhancedBreakdown.investments.zakatableAmount).toBe(24000);
    });

    it('credit card statement extraction flows to correct calculation', () => {
        const extractedData: Partial<ZakatFormData> = {
            creditCardBalance: 5000,
            cashOnHand: 50000,
        };

        const formData: ZakatFormData = {
            ...defaultFormData,
            madhab: 'bradford',
            ...extractedData,
        };

        const result = calculateZakat(formData);
        expect(result.totalAssets).toBe(50000);
        expect(result.totalLiabilities).toBe(5000);
        expect(result.netZakatableWealth).toBe(45000);
    });

    it('multiple document extractions aggregate correctly', () => {
        const bankExtraction = { checkingAccounts: 20000 };
        const brokerageExtraction = { passiveInvestmentsValue: 50000 };
        const retirementExtraction = { rothIRAContributions: 15000 };

        const formData: ZakatFormData = {
            ...defaultFormData,
            madhab: 'bradford',
            ...bankExtraction,
            ...brokerageExtraction,
            ...retirementExtraction,
        };

        const result = calculateZakat(formData);
        expect(result.enhancedBreakdown.liquidAssets.zakatableAmount).toBe(20000);
        expect(result.enhancedBreakdown.investments.zakatableAmount).toBe(15000);
        expect(result.enhancedBreakdown.retirement.zakatableAmount).toBe(15000);
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

        // The mapToAssetCategory function would be used to categorize each
        const categories = lineItems.map(item => ({
            ...item,
            assetCategory: mapToAssetCategory(item.inferredCategory)
        }));

        expect(categories[0].assetCategory).toBe('INVESTMENT_STOCK'); // Stock
        expect(categories[1].assetCategory).toBe('INVESTMENT_STOCK'); // ETF
        expect(categories[2].assetCategory).toBe('CASH_ON_HAND'); // Cash
    });

});
