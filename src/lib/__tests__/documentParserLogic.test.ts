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
import { mapLegacyData, aggregateResults } from '../documentParserLogic';
import { ZakatFormData } from '../zakatTypes';

describe('Document Parser Logic', () => {

    describe('mapLegacyData', () => {
        it('should map flat fields correctly', () => {
            const legacy = {
                cashOnHand: 5000,
                checkingAccounts: 2000,
                savingsAccounts: 0, // Should be filtered out
            };

            const result = mapLegacyData(legacy);
            expect(result).toEqual({
                cashOnHand: 5000,
                checkingAccounts: 2000,
            });
            expect(result.savingsAccounts).toBeUndefined();
        });

        it('should map legacy goldValue to goldInvestmentValue', () => {
            const legacy = {
                goldValue: 1000,
            };

            const result = mapLegacyData(legacy);
            expect(result.goldInvestmentValue).toBe(1000);
        });

        it('should prioritize explicit goldInvestmentValue if present', () => {
            const legacy = {
                goldValue: 500,        // Legacy AI output
                goldInvestmentValue: 1000, // Explicit new AI output
            };

            const result = mapLegacyData(legacy);
            expect(result.goldInvestmentValue).toBe(1000);
        });

        it('should filter out null/undefined/0 values', () => {
            const legacy: Record<string, number | null | undefined> = {
                cashOnHand: 100,
                cryptoCurrency: 0,
                activeInvestments: null,
                dividends: undefined,
            };

            // Simulate messy AI output (extra keys, nulls) - mapLegacyData accepts Record<string, unknown>
            const result = mapLegacyData(legacy);
            expect(result).toEqual({
                cashOnHand: 100,
            });
            expect(Object.keys(result)).toHaveLength(1);
        });
    });

    describe('aggregateResults', () => {
        it('should sum numerical values across objects', () => {
            const input: Partial<ZakatFormData>[] = [
                { cashOnHand: 100, checkingAccounts: 50 },
                { cashOnHand: 200, goldInvestmentValue: 500 },
                { checkingAccounts: 50 }
            ];

            const result = aggregateResults(input);

            expect(result).toEqual({
                cashOnHand: 300,
                checkingAccounts: 100,
                goldInvestmentValue: 500,
            });
        });

        it('should return empty object for empty input', () => {
            const result = aggregateResults([]);
            expect(result).toEqual({});
        });

        it('should handle single input', () => {
            const input: Partial<ZakatFormData>[] = [{ cashOnHand: 100 }];
            const result = aggregateResults(input);
            expect(result).toEqual({ cashOnHand: 100 });
        });
    });
});
