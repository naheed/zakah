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

import { describe, it, expect } from 'vitest';
import { mapToAssetCategory } from '../useAssetPersistence';

describe('mapToAssetCategory', () => {
    it('maps Cash/Checking/Savings to structural categories', () => {
        expect(mapToAssetCategory('CASH')).toBe('CASH_ON_HAND');
        expect(mapToAssetCategory('CHECKING')).toBe('CASH_CHECKING');
        expect(mapToAssetCategory('SAVINGS')).toBe('CASH_SAVINGS');
        expect(mapToAssetCategory('HIGH_YIELD_SAVINGS')).toBe('HIGH_YIELD_SAVINGS'); // Preserved if unknown but passed through
    });

    it('maps Crypto to CRYPTO', () => {
        expect(mapToAssetCategory('CRYPTO')).toBe('CRYPTO');
        expect(mapToAssetCategory('CRYPTOCURRENCY')).toBe('CRYPTO');
    });

    it('maps Stocks/ETFs to INVESTMENT_STOCK', () => {
        expect(mapToAssetCategory('EQUITY')).toBe('INVESTMENT_STOCK');
        expect(mapToAssetCategory('STOCK')).toBe('INVESTMENT_STOCK');
        expect(mapToAssetCategory('ETF')).toBe('INVESTMENT_STOCK');
        expect(mapToAssetCategory('MUTUAL_FUND')).toBe('INVESTMENT_MUTUAL_FUND');
    });

    it('maps Bonds to INVESTMENT_BOND', () => {
        expect(mapToAssetCategory('BOND')).toBe('INVESTMENT_BOND');
        expect(mapToAssetCategory('FIXED_INCOME')).toBe('INVESTMENT_BOND');
    });

    it('maps Retirement accounts to structural types', () => {
        expect(mapToAssetCategory('RETIREMENT')).toBe('RETIREMENT_401K');
        expect(mapToAssetCategory('401K')).toBe('RETIREMENT_401K');
        expect(mapToAssetCategory('ROTH_IRA')).toBe('RETIREMENT_ROTH');
    });

    it('maps Liabilities to LIABILITY equivalents', () => {
        expect(mapToAssetCategory('EXPENSE')).toBe('EXPENSE'); // Pass through
        expect(mapToAssetCategory('LIABILITY')).toBe('LIABILITY_LOAN');
        expect(mapToAssetCategory('CREDIT_CARD_DEBT')).toBe('LIABILITY_CREDIT_CARD');
    });

    it('preserves unknown categories directly', () => {
        expect(mapToAssetCategory('UNKNOWN_ASSET')).toBe('UNKNOWN_ASSET');
        expect(mapToAssetCategory('')).toBe('');
    });
});
