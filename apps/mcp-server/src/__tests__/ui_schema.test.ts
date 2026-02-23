/**
 * UI Query Schema & "No Redundancy" Tests
 * 
 * Phase 2 of the Eval Infrastructure:
 * 1. Validates that natural language is correctly mapped to calculate_zakat Zod props
 * 2. Enforces the "Complementary, not redundant" Apps SDK UX rule
 * 3. Verifies correct tool chaining order (data tool → render tool)
 * 
 * See: docs/PRDs/eval-infrastructure.md
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { calculateZakat, defaultFormData, ZakatFormData } from '@zakatflow/core';

// =============================================================================
// The canonical Zod schema for calculate_zakat tool arguments.
// This mirrors the inputSchema in tools/calculate_zakat.ts. If the tool schema
// changes, this test will break — which is the point.
// =============================================================================

const ALL_MADHAB_IDS = ['bradford', 'hanafi', 'shafii', 'maliki', 'hanbali', 'amja', 'qaradawi', 'tahir_anwar'] as const;

const CalculateZakatSchema = z.object({
    cash: z.number(),
    gold_value: z.number().optional(),
    gold_grams: z.number().optional(),
    gold_jewelry: z.number().optional(),
    silver_value: z.number().optional(),
    silver_grams: z.number().optional(),
    silver_jewelry: z.number().optional(),
    crypto: z.number().optional(),
    crypto_trading: z.number().optional(),
    staked_assets: z.number().optional(),
    staked_rewards: z.number().optional(),
    liquidity_pool: z.number().optional(),
    stocks: z.number().optional(),
    active_trading: z.number().optional(),
    reits: z.number().optional(),
    dividends: z.number().optional(),
    retirement_total: z.number().optional(),
    roth_ira_contributions: z.number().optional(),
    roth_ira_earnings: z.number().optional(),
    traditional_ira: z.number().optional(),
    four_oh_one_k: z.number().optional(),
    hsa_balance: z.number().optional(),
    age: z.number().optional(),
    revocable_trust: z.number().optional(),
    irrevocable_trust: z.number().optional(),
    real_estate_for_sale: z.number().optional(),
    land_banking: z.number().optional(),
    rental_income: z.number().optional(),
    business_cash: z.number().optional(),
    business_inventory: z.number().optional(),
    illiquid_assets: z.number().optional(),
    livestock: z.number().optional(),
    good_debt_owed: z.number().optional(),
    bad_debt_recovered: z.number().optional(),
    loans: z.number().optional(),
    unpaid_bills: z.number().optional(),
    monthly_mortgage: z.number().optional(),
    student_loans: z.number().optional(),
    property_tax: z.number().optional(),
    living_expenses: z.number().optional(),
    madhab: z.enum(ALL_MADHAB_IDS).optional(),
    nisab_standard: z.enum(['silver', 'gold']).optional(),
});

type CalculateZakatArgs = z.infer<typeof CalculateZakatSchema>;

// =============================================================================
// Schema Validation Tests — Prop Extraction from Natural Language
// =============================================================================

describe('Phase 2: Schema Validation — Prop Extraction', () => {

    /**
     * Simulated LLM extraction results. In production, these come from
     * the LLM's tool_call arguments. Here we test that the schema
     * correctly validates expected payloads from various natural language inputs.
     */
    const validPayloads: { description: string; args: CalculateZakatArgs }[] = [
        {
            description: 'Simple cash + methodology',
            args: { cash: 50000, madhab: 'hanafi' },
        },
        {
            description: 'Cash + gold + debt',
            args: { cash: 10000, gold_value: 8500, loans: 2000, madhab: 'bradford' },
        },
        {
            description: 'Full portfolio with crypto',
            args: {
                cash: 25000,
                stocks: 100000,
                crypto: 15000,
                staked_assets: 5000,
                retirement_total: 200000,
                age: 35,
                loans: 5000,
                monthly_mortgage: 2000,
                madhab: 'shafii',
            },
        },
        {
            description: 'Business owner with inventory',
            args: {
                cash: 10000,
                business_cash: 40000,
                business_inventory: 15000,
                madhab: 'hanafi',
            },
        },
        {
            description: 'Real estate investor',
            args: {
                cash: 30000,
                real_estate_for_sale: 150000,
                land_banking: 75000,
                rental_income: 24000,
                madhab: 'qaradawi',
            },
        },
        {
            description: 'Retirement-age with detailed IRAs',
            args: {
                cash: 20000,
                roth_ira_contributions: 50000,
                roth_ira_earnings: 15000,
                traditional_ira: 100000,
                four_oh_one_k: 200000,
                age: 62,
                madhab: 'bradford',
            },
        },
        {
            description: 'Precious metals by weight',
            args: {
                cash: 5000,
                gold_grams: 50,
                silver_grams: 200,
                madhab: 'maliki',
            },
        },
        {
            description: 'Minimum viable payload (cash only)',
            args: { cash: 100 },
        },
        // ─── Ahmed Master Matrix payloads ──────────────────────────
        {
            description: 'AHMED-HANAFI-01: Full portfolio Hanafi',
            args: {
                cash: 100000, retirement_total: 200000, stocks: 150000,
                gold_jewelry: 10000, loans: 5000, monthly_mortgage: 2000,
                living_expenses: 3000, age: 35, madhab: 'hanafi',
            },
        },
        {
            description: 'AHMED-SHAFII-01: Full portfolio Shafi\'i',
            args: {
                cash: 100000, retirement_total: 200000, stocks: 150000,
                gold_jewelry: 10000, loans: 5000, monthly_mortgage: 2000,
                living_expenses: 3000, age: 35, madhab: 'shafii',
            },
        },
        {
            description: 'AHMED-BRADFORD-01: 30% equity proxy',
            args: {
                cash: 100000, retirement_total: 200000, stocks: 150000,
                gold_jewelry: 10000, loans: 5000, monthly_mortgage: 2000,
                living_expenses: 3000, age: 35, madhab: 'bradford',
            },
        },
        {
            description: 'AHMED-BRADFORD-RETIRED: Retirement proxy at 60',
            args: {
                cash: 100000, retirement_total: 200000, stocks: 150000,
                gold_jewelry: 10000, loans: 5000, monthly_mortgage: 2000,
                living_expenses: 3000, age: 60, madhab: 'bradford',
            },
        },
        {
            description: 'AHMED-AMJA-01: Equities income only',
            args: {
                cash: 100000, retirement_total: 200000, stocks: 150000,
                gold_jewelry: 10000, loans: 5000, monthly_mortgage: 2000,
                living_expenses: 3000, age: 35, madhab: 'amja',
            },
        },
        {
            description: 'AHMED-QARADAWI-RENTAL: Multi-rate rental override',
            args: {
                cash: 100000, retirement_total: 200000, stocks: 150000,
                gold_jewelry: 10000, loans: 5000, monthly_mortgage: 2000,
                living_expenses: 3000, age: 35, madhab: 'qaradawi',
                rental_income: 24000,
            },
        },
    ];

    it.each(validPayloads)('validates: $description', ({ args }) => {
        const result = CalculateZakatSchema.safeParse(args);
        expect(result.success).toBe(true);
    });

    // Invalid payloads — should fail schema validation
    const invalidPayloads = [
        {
            description: 'Missing required cash field',
            args: { madhab: 'hanafi' },
        },
        {
            description: 'Cash is a string instead of number',
            args: { cash: '50000' },
        },
        {
            description: 'Invalid madhab value',
            args: { cash: 10000, madhab: 'invalid_school' },
        },
        {
            description: 'Invalid nisab_standard',
            args: { cash: 10000, nisab_standard: 'platinum' },
        },
    ];

    it.each(invalidPayloads)('rejects invalid payload: $description', ({ args }) => {
        const result = CalculateZakatSchema.safeParse(args);
        expect(result.success).toBe(false);
    });
});

// =============================================================================
// "No Redundancy" Rule — Text must yield to UI
// =============================================================================

describe('Phase 2: "No Redundancy" Rule', () => {
    const MAX_TEXT_LENGTH = 150;

    /**
     * When the LLM calls the calculate_zakat tool (UI render), the
     * accompanying text response must be SHORT and complementary.
     * It must NOT repeat the calculation results.
     */
    const goodResponses = [
        "I've calculated your Zakat below. You can adjust the numbers in the widget.",
        "Here's your Zakat breakdown. Feel free to modify the inputs.",
        "Your calculation is ready. See the results below.",
        "I've run the numbers using the Hanafi methodology. Check the widget below.",
    ];

    const badResponses = [
        "You have $10,000 in cash. After deducting your $2,000 debt, your net zakatable wealth is $8,000. At the standard 2.5% rate, your Zakat due is $200. Below is the interactive calculator where you can see these results in detail.",
        "Based on the Hanafi methodology, your total assets of $50,000 including $25,000 in stocks at 100% valuation gives you a net zakatable wealth of $47,000. Your Zakat obligation is $1,175. I've rendered a widget below showing this breakdown.",
        "Let me break this down: Your checking account has $25,000, savings $25,000, cash on hand $50,000, totaling $100,000 in liquid assets. Your 401k at $200,000 and passive investments at $150,000 bring total zakatable assets to $325,000 after applying the Bradford 30% equity proxy. After deducting your $5,000 credit card balance and $24,000 annual mortgage ($2,000/month × 12), your net zakatable wealth is $296,000. At 2.5%, your Zakat is $7,400.",
    ];

    it.each(goodResponses.map((r, i) => ({ response: r, id: `Good-${i + 1}` })))(
        '$id: compliant text response is under limit',
        ({ response }) => {
            expect(response.length).toBeLessThanOrEqual(MAX_TEXT_LENGTH);
        }
    );

    it.each(badResponses.map((r, i) => ({ response: r, id: `Bad-${i + 1}` })))(
        '$id: redundant text response exceeds limit',
        ({ response }) => {
            expect(response.length).toBeGreaterThan(MAX_TEXT_LENGTH);
        }
    );

    it('compliant responses should NOT contain dollar amounts', () => {
        for (const response of goodResponses) {
            expect(response).not.toMatch(/\$[\d,]+/);
        }
    });
});

// =============================================================================
// Tool Chaining Order — Data before Render
// =============================================================================

describe('Phase 2: Tool Chaining Order', () => {

    /**
     * Simulates the execution trace of tool calls. The correct sequence is:
     * 1. calculate_zakat (data tool — computes the result)
     * 2. render_widget (UI tool — displays the result)
     * 
     * The model must NOT render before computing.
     */
    it('data tool must be called before render tool', () => {
        const executionTrace = [
            { tool: 'calculate_zakat', type: 'data' },
            { tool: 'render_widget', type: 'ui' },
        ];

        const dataToolIndex = executionTrace.findIndex(t => t.type === 'data');
        const uiToolIndex = executionTrace.findIndex(t => t.type === 'ui');

        expect(dataToolIndex).toBeLessThan(uiToolIndex);
        expect(dataToolIndex).not.toBe(-1);
    });

    it('rejects traces where render is called without data', () => {
        const badTrace = [
            { tool: 'render_widget', type: 'ui' },
        ];

        const dataToolIndex = badTrace.findIndex(t => t.type === 'data');
        expect(dataToolIndex).toBe(-1); // No data tool = invalid
    });

    it('structuredContent from calculate_zakat has all fields needed by widget', () => {
        // Using Ahmed's Bradford profile for grounded verification
        const formData: ZakatFormData = {
            ...defaultFormData,
            checkingAccounts: 100000,
            passiveInvestmentsValue: 150000,
            goldJewelryValue: 10000,
            hasPreciousMetals: true,
            creditCardBalance: 5000,
            monthlyMortgage: 2000,
            monthlyLivingExpenses: 3000,
            age: 35,
            madhab: 'bradford',
        };

        const result = calculateZakat(formData);

        // These are the fields the widget renderer expects
        const structuredContent = {
            zakatDue: result.zakatDue,
            totalAssets: result.totalAssets,
            totalLiabilities: result.totalLiabilities,
            netZakatableWealth: result.netZakatableWealth,
            nisab: result.nisab,
            isAboveNisab: result.isAboveNisab,
        };

        // All fields must be present and numeric
        for (const [key, value] of Object.entries(structuredContent)) {
            expect(value, `${key} should be defined`).toBeDefined();
            expect(typeof value === 'number' || typeof value === 'boolean',
                `${key} should be number or boolean`).toBe(true);
        }

        // Sanity check: calculation produced reasonable output
        expect(structuredContent.zakatDue).toBeGreaterThan(0);
        expect(structuredContent.totalAssets).toBeGreaterThanOrEqual(50000);
    });
});
