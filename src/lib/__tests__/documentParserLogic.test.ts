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

            // Cast to any to simulate messy AI output
            const result = mapLegacyData(legacy as any);
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
