/**
 * Ahmed Master Matrix — MCP Tool Mapping Ground Truth Tests
 * 
 * These tests verify end-to-end correctness of the MCP tool pipeline:
 * 
 * Natural Language (Ahmed's profile) → MCP Tool Args → Core Engine → Expected Output
 * 
 * Each test case simulates what the MCP tool receives from the LLM's
 * tool_call and verifies the calculation output matches the Ahmed Master
 * Matrix proven values from packages/core.
 * 
 * See: packages/core/src/__tests__/ahmed_master_matrix.test.ts
 * See: docs/PRDs/eval-infrastructure.md
 */

import { describe, it, expect } from 'vitest';
import { calculateZakat, defaultFormData, ZakatFormData } from '@zakatflow/core';

// =============================================================================
// Ahmed's Common Profile (as the MCP tool would receive it from the LLM)
// =============================================================================

const AHMED_MCP_ARGS = {
    cash: 100000,           // $50k on-hand + $25k checking + $25k savings
    retirement_total: 200000,
    stocks: 150000,
    gold_jewelry: 10000,
    loans: 5000,            // credit card
    monthly_mortgage: 2000,
    living_expenses: 3000,
    age: 35,
};

/**
 * Mirrors the MCP tool's mapping logic from tool args → ZakatFormData.
 * This is the exact same transformation done in tools/calculate_zakat.ts.
 */
function mcpArgsToFormData(args: Record<string, any>): ZakatFormData {
    return {
        ...defaultFormData,
        checkingAccounts: args.cash || 0,
        goldInvestmentValue: args.gold_value || 0,
        goldJewelryValue: args.gold_jewelry || 0,
        silverInvestmentValue: args.silver_value || 0,
        silverJewelryValue: args.silver_jewelry || 0,
        cryptoCurrency: args.crypto || 0,
        cryptoTrading: args.crypto_trading || 0,
        stakedAssets: args.staked_assets || 0,
        stakedRewardsVested: args.staked_rewards || 0,
        liquidityPoolValue: args.liquidity_pool || 0,
        passiveInvestmentsValue: (args.stocks || 0) + (args.reits || 0),
        activeInvestments: args.active_trading || 0,
        dividends: args.dividends || 0,
        fourOhOneKVestedBalance: args.retirement_total || 0,
        rothIRAContributions: args.roth_ira_contributions || 0,
        rothIRAEarnings: args.roth_ira_earnings || 0,
        traditionalIRABalance: args.traditional_ira || 0,
        hsaBalance: args.hsa_balance || 0,
        age: args.age || 30,
        revocableTrustValue: args.revocable_trust || 0,
        irrevocableTrustValue: args.irrevocable_trust || 0,
        irrevocableTrustAccessible: !!(args.irrevocable_trust && args.irrevocable_trust > 0),
        hasTrusts: !!(args.revocable_trust || args.irrevocable_trust),
        realEstateForSale: args.real_estate_for_sale || 0,
        landBankingValue: args.land_banking || 0,
        rentalPropertyIncome: args.rental_income || 0,
        hasRealEstate: !!(args.real_estate_for_sale || args.land_banking || args.rental_income),
        businessCashAndReceivables: args.business_cash || 0,
        businessInventory: args.business_inventory || 0,
        hasBusiness: !!(args.business_cash || args.business_inventory),
        illiquidAssetsValue: args.illiquid_assets || 0,
        livestockValue: args.livestock || 0,
        hasIlliquidAssets: !!(args.illiquid_assets || args.livestock),
        goodDebtOwedToYou: args.good_debt_owed || 0,
        badDebtRecovered: args.bad_debt_recovered || 0,
        hasDebtOwedToYou: !!(args.good_debt_owed || args.bad_debt_recovered),
        creditCardBalance: args.loans || 0,
        unpaidBills: args.unpaid_bills || 0,
        monthlyMortgage: args.monthly_mortgage || 0,
        studentLoansDue: args.student_loans || 0,
        propertyTax: args.property_tax || 0,
        monthlyLivingExpenses: args.living_expenses || 0,
        madhab: (args.madhab || 'bradford') as ZakatFormData['madhab'],
        nisabStandard: args.nisab_standard || 'silver',
        hasPreciousMetals: !!(args.gold_value || args.gold_jewelry || args.silver_value || args.silver_jewelry),
    };
}

// =============================================================================
// Ahmed Master Matrix — Ground Truth Test Suite
// =============================================================================

describe('Ahmed Master Matrix: MCP Tool → Core Engine Ground Truth', () => {

    it('[AHMED-HANAFI-01] Hanafi: $8,125 Zakat', () => {
        const args = { ...AHMED_MCP_ARGS, madhab: 'hanafi' };
        const formData = mcpArgsToFormData(args);
        const result = calculateZakat(formData);

        expect(result.totalAssets).toBe(390000);
        expect(result.totalLiabilities).toBe(65000);
        expect(result.netZakatableWealth).toBe(325000);
        expect(result.zakatDue).toBeCloseTo(8125, 0);
    });

    it('[AHMED-SHAFII-01] Shafi\'i: $9,500 Zakat (no debt deduction, jewelry exempt)', () => {
        const args = { ...AHMED_MCP_ARGS, madhab: 'shafii' };
        const formData = mcpArgsToFormData(args);
        const result = calculateZakat(formData);

        expect(result.totalAssets).toBe(380000);
        expect(result.totalLiabilities).toBe(0);
        expect(result.netZakatableWealth).toBe(380000);
        expect(result.zakatDue).toBeCloseTo(9500, 0);
    });

    it('[AHMED-BRADFORD-01] Bradford: $2,250 Zakat (30% equity proxy, 401k exempt at 35)', () => {
        const args = { ...AHMED_MCP_ARGS, madhab: 'bradford' };
        const formData = mcpArgsToFormData(args);
        const result = calculateZakat(formData);

        expect(result.totalAssets).toBe(155000);
        expect(result.totalLiabilities).toBe(65000);
        expect(result.netZakatableWealth).toBe(90000);
        expect(result.zakatDue).toBeCloseTo(2250, 0);
    });

    it('[AHMED-BRADFORD-RETIRED] Bradford at age 60: $3,750 Zakat (retirement proxy activates)', () => {
        const args = { ...AHMED_MCP_ARGS, madhab: 'bradford', age: 60 };
        const formData = mcpArgsToFormData(args);
        // Bradford needs isOver59Half flag for retirement inclusion
        formData.isOver59Half = true;
        const result = calculateZakat(formData);

        expect(result.totalAssets).toBe(215000);
        expect(result.totalLiabilities).toBe(65000);
        expect(result.netZakatableWealth).toBe(150000);
        expect(result.zakatDue).toBeCloseTo(3750, 0);
    });

    it('[AHMED-AMJA-01] AMJA: $5,500 Zakat (equities income only = $0)', () => {
        const args = { ...AHMED_MCP_ARGS, madhab: 'amja' };
        const formData = mcpArgsToFormData(args);
        const result = calculateZakat(formData);

        expect(result.totalAssets).toBe(230000);
        expect(result.totalLiabilities).toBe(10000);
        expect(result.netZakatableWealth).toBe(220000);
        expect(result.zakatDue).toBeCloseTo(5500, 0);
    });

    it('[AHMED-QARADAWI-RENTAL] Qaradawi: $7,650 Zakat (multi-rate rental override)', () => {
        const args = {
            ...AHMED_MCP_ARGS,
            madhab: 'qaradawi',
            rental_income: 24000,
        };
        const formData = mcpArgsToFormData(args);
        formData.hasRealEstate = true;
        const result = calculateZakat(formData);

        expect(result.totalAssets).toBe(299000);
        expect(result.totalLiabilities).toBe(65000);
        expect(result.netZakatableWealth).toBe(234000);
        expect(result.zakatDue).toBeCloseTo(7650, 0);
    });
});

// =============================================================================
// MCP Mapping Parity — Ensure the MCP transform produces the same inputs
// as the core test suite uses directly
// =============================================================================

describe('Ahmed Matrix: MCP Mapping Parity w/ Core Engine', () => {

    it('MCP cash mapping aggregates to $100,000', () => {
        const formData = mcpArgsToFormData(AHMED_MCP_ARGS);
        // MCP puts all cash into checkingAccounts (single field)
        // Core test splits across cashOnHand + checkingAccounts + savingsAccounts
        // Both should produce the same total
        expect(formData.checkingAccounts).toBe(100000);
    });

    it('MCP retirement mapping matches core fourOhOneKVestedBalance', () => {
        const formData = mcpArgsToFormData(AHMED_MCP_ARGS);
        expect(formData.fourOhOneKVestedBalance).toBe(200000);
    });

    it('MCP stock mapping matches core passiveInvestmentsValue', () => {
        const formData = mcpArgsToFormData(AHMED_MCP_ARGS);
        expect(formData.passiveInvestmentsValue).toBe(150000);
    });

    it('MCP liability mapping preserves all deduction fields', () => {
        const formData = mcpArgsToFormData(AHMED_MCP_ARGS);
        expect(formData.creditCardBalance).toBe(5000);
        expect(formData.monthlyMortgage).toBe(2000);
        expect(formData.monthlyLivingExpenses).toBe(3000);
    });
});
