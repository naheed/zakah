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
import { mapToZakatCategory } from '../useAssetPersistence';

describe('mapToZakatCategory', () => {
    it('maps Cash/Checking/Savings to LIQUID', () => {
        expect(mapToZakatCategory('CASH')).toBe('LIQUID');
        expect(mapToZakatCategory('CHECKING')).toBe('LIQUID');
        expect(mapToZakatCategory('SAVINGS')).toBe('LIQUID');
        expect(mapToZakatCategory('HIGH_YIELD_SAVINGS')).toBe('LIQUID');
    });

    it('maps Crypto to PROXY_100', () => {
        expect(mapToZakatCategory('CRYPTO')).toBe('PROXY_100');
        expect(mapToZakatCategory('CRYPTOCURRENCY')).toBe('PROXY_100');
    });

    it('maps Stocks/ETFs to PROXY_30', () => {
        expect(mapToZakatCategory('EQUITY')).toBe('PROXY_30');
        expect(mapToZakatCategory('STOCK')).toBe('PROXY_30');
        expect(mapToZakatCategory('ETF')).toBe('PROXY_30');
        expect(mapToZakatCategory('MUTUAL_FUND')).toBe('PROXY_30');
    });

    it('maps Bonds to LIQUID', () => {
        expect(mapToZakatCategory('BOND')).toBe('LIQUID');
        expect(mapToZakatCategory('FIXED_INCOME')).toBe('LIQUID');
    });

    it('maps Retirement accounts to PROXY_30', () => {
        expect(mapToZakatCategory('RETIREMENT')).toBe('PROXY_30');
        expect(mapToZakatCategory('401K')).toBe('PROXY_30');
        expect(mapToZakatCategory('ROTH_IRA')).toBe('PROXY_30');
    });

    it('maps Liabilities to EXEMPT', () => {
        expect(mapToZakatCategory('EXPENSE')).toBe('EXEMPT');
        expect(mapToZakatCategory('LIABILITY')).toBe('EXEMPT');
        expect(mapToZakatCategory('CREDIT_CARD_DEBT')).toBe('EXEMPT');
    });

    it('defaults to LIQUID for unknown categories', () => {
        expect(mapToZakatCategory('UNKNOWN_ASSET')).toBe('LIQUID');
        expect(mapToZakatCategory('')).toBe('LIQUID');
    });
});
