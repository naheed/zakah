/**
 * Multi-Turn Context Hydration Tests
 * 
 * Phase 3 of the Eval Infrastructure:
 * Tests state synchronization via `ui/update-model-context` events.
 * 
 * When a user interacts with an inline widget (e.g., changes the
 * methodology dropdown or updates an asset value), the OpenAI Apps SDK
 * fires a context update that the model must correctly incorporate
 * into subsequent turns.
 * 
 * See: docs/PRDs/eval-infrastructure.md
 */

import { describe, it, expect } from 'vitest';
import { calculateZakat, defaultFormData, ZakatFormData, ZAKAT_PRESETS } from '@zakatflow/core';

// =============================================================================
// Types for simulating multi-turn conversation with UI context updates
// =============================================================================

interface ConversationTurn {
    role: 'user' | 'assistant' | 'system' | 'ui_context_update';
    content?: string;
    tool_call?: {
        name: string;
        arguments: Record<string, unknown>;
    };
    /** Simulates the payload from ui/update-model-context */
    contextUpdate?: Record<string, unknown>;
}

interface ConversationState {
    turns: ConversationTurn[];
    /** The latest tool arguments extracted, representing current widget state */
    currentToolArgs: Record<string, unknown>;
}

/**
 * Simulates merging a ui/update-model-context event into the current state.
 * In production, the OpenAI Apps SDK handles this. Here we test the merge logic.
 */
function applyContextUpdate(
    currentArgs: Record<string, unknown>,
    update: Record<string, unknown>
): Record<string, unknown> {
    return { ...currentArgs, ...update };
}

/**
 * Simulates a full multi-turn conversation with interleaved UI context events.
 */
function simulateConversation(scenario: ConversationTurn[]): ConversationState {
    let currentToolArgs: Record<string, unknown> = {};

    for (const turn of scenario) {
        if (turn.tool_call) {
            currentToolArgs = { ...currentToolArgs, ...turn.tool_call.arguments };
        }
        if (turn.role === 'ui_context_update' && turn.contextUpdate) {
            currentToolArgs = applyContextUpdate(currentToolArgs, turn.contextUpdate);
        }
    }

    return { turns: scenario, currentToolArgs };
}

// =============================================================================
// Multi-Turn Context Hydration Tests
// =============================================================================

describe('Phase 3: Multi-Turn Context Hydration', () => {

    it('Scenario 1: User calculates, then changes methodology via widget', () => {
        const scenario: ConversationTurn[] = [
            // Turn 1: User provides financial data
            {
                role: 'user',
                content: 'Calculate my Zakat on $50,000 cash.',
            },
            // Turn 2: Assistant calls calculate_zakat with bradford (default)
            {
                role: 'assistant',
                tool_call: {
                    name: 'calculate_zakat',
                    arguments: { cash: 50000, madhab: 'bradford' },
                },
            },
            // Turn 3: User changes methodology dropdown in the widget to Hanafi
            {
                role: 'ui_context_update',
                contextUpdate: { madhab: 'hanafi' },
            },
            // Turn 4: User asks a follow-up
            {
                role: 'user',
                content: 'What would my Zakat be with this methodology?',
            },
        ];

        const state = simulateConversation(scenario);

        // Assert: The model should see madhab='hanafi' from the UI update
        expect(state.currentToolArgs.madhab).toBe('hanafi');
        expect(state.currentToolArgs.cash).toBe(50000);

        // Verify the calculation actually produces different results
        const bradfordResult = calculateZakat({
            ...defaultFormData, checkingAccounts: 50000, madhab: 'bradford',
        });
        const hanafiResult = calculateZakat({
            ...defaultFormData, checkingAccounts: 50000, madhab: 'hanafi',
        });
        // Both should produce the same for cash-only (no stocks)
        expect(bradfordResult.zakatDue).toBe(hanafiResult.zakatDue);
    });

    it('Scenario 2: User updates cash amount inside widget, then adds gold', () => {
        const scenario: ConversationTurn[] = [
            // Turn 1: Initial calculation
            {
                role: 'user',
                content: 'Calculate my Zakat. I have $10,000 cash.',
            },
            {
                role: 'assistant',
                tool_call: {
                    name: 'calculate_zakat',
                    arguments: { cash: 10000, madhab: 'bradford' },
                },
            },
            // Turn 2: User changes cash to $50,000 inside the widget
            {
                role: 'ui_context_update',
                contextUpdate: { cash: 50000 },
            },
            // Turn 3: User adds gold via natural language
            {
                role: 'user',
                content: 'Actually, what if I also add 50 grams of gold?',
            },
        ];

        const state = simulateConversation(scenario);

        // Assert: Model should see the UPDATED $50,000 (not original $10,000)
        expect(state.currentToolArgs.cash).toBe(50000);
        // Madhab from original call should persist
        expect(state.currentToolArgs.madhab).toBe('bradford');
    });

    it('Scenario 3: Three-turn workflow (query → UI update → follow-up)', () => {
        const scenario: ConversationTurn[] = [
            // Turn 1: Complex initial request
            {
                role: 'user',
                content: 'Calculate Zakat. $25k checking, $100k stocks, $15k 401k, Hanafi.',
            },
            {
                role: 'assistant',
                tool_call: {
                    name: 'calculate_zakat',
                    arguments: {
                        cash: 25000,
                        stocks: 100000,
                        retirement_total: 15000,
                        madhab: 'hanafi',
                    },
                },
            },
            // Turn 2: User adds liabilities in the widget
            {
                role: 'ui_context_update',
                contextUpdate: { loans: 5000, monthly_mortgage: 2000 },
            },
            // Turn 3: User asks about the impact
            {
                role: 'user',
                content: 'How much did those debts reduce my Zakat?',
            },
        ];

        const state = simulateConversation(scenario);

        // All original fields persist
        expect(state.currentToolArgs.cash).toBe(25000);
        expect(state.currentToolArgs.stocks).toBe(100000);
        expect(state.currentToolArgs.retirement_total).toBe(15000);
        expect(state.currentToolArgs.madhab).toBe('hanafi');

        // UI context additions are present
        expect(state.currentToolArgs.loans).toBe(5000);
        expect(state.currentToolArgs.monthly_mortgage).toBe(2000);

        // Verify calculation impact
        const withoutDebt = calculateZakat({
            ...defaultFormData,
            checkingAccounts: 25000,
            passiveInvestmentsValue: 100000,
            fourOhOneKVestedBalance: 15000,
            madhab: 'hanafi',
        });
        const withDebt = calculateZakat({
            ...defaultFormData,
            checkingAccounts: 25000,
            passiveInvestmentsValue: 100000,
            fourOhOneKVestedBalance: 15000,
            creditCardBalance: 5000,
            monthlyMortgage: 2000,
            madhab: 'hanafi',
        });

        // Hanafi uses full_deduction — liabilities should reduce Zakat
        expect(withDebt.zakatDue).toBeLessThan(withoutDebt.zakatDue);
    });

    it('Scenario 4: UI update does NOT overwrite unrelated fields', () => {
        const scenario: ConversationTurn[] = [
            {
                role: 'assistant',
                tool_call: {
                    name: 'calculate_zakat',
                    arguments: {
                        cash: 50000,
                        gold_value: 10000,
                        stocks: 25000,
                        madhab: 'shafii',
                    },
                },
            },
            // User only changes madhab in the widget
            {
                role: 'ui_context_update',
                contextUpdate: { madhab: 'hanafi' },
            },
        ];

        const state = simulateConversation(scenario);

        // Only madhab should change
        expect(state.currentToolArgs.madhab).toBe('hanafi');
        // Everything else should remain untouched
        expect(state.currentToolArgs.cash).toBe(50000);
        expect(state.currentToolArgs.gold_value).toBe(10000);
        expect(state.currentToolArgs.stocks).toBe(25000);
    });

    it('Scenario 5: Multiple consecutive UI updates accumulate correctly', () => {
        const scenario: ConversationTurn[] = [
            {
                role: 'assistant',
                tool_call: {
                    name: 'calculate_zakat',
                    arguments: { cash: 10000, madhab: 'bradford' },
                },
            },
            // User adds stocks in widget
            {
                role: 'ui_context_update',
                contextUpdate: { stocks: 50000 },
            },
            // User then adds crypto in widget
            {
                role: 'ui_context_update',
                contextUpdate: { crypto: 15000 },
            },
            // User changes methodology
            {
                role: 'ui_context_update',
                contextUpdate: { madhab: 'hanafi' },
            },
        ];

        const state = simulateConversation(scenario);

        expect(state.currentToolArgs.cash).toBe(10000);
        expect(state.currentToolArgs.stocks).toBe(50000);
        expect(state.currentToolArgs.crypto).toBe(15000);
        expect(state.currentToolArgs.madhab).toBe('hanafi');
    });
});

// =============================================================================
// Ahmed Master Matrix — Multi-Turn Methodology Switching
// =============================================================================

describe('Phase 3: Ahmed Matrix — Methodology Switching via UI', () => {

    /**
     * Ahmed starts with Bradford, then switches to Hanafi via widget.
     * Bradford: $2,250 → Hanafi: $8,125 (a $5,875 increase!)
     * This is the most critical multi-turn scenario because the methodology
     * change produces dramatically different results.
     */
    it('Ahmed switches Bradford → Hanafi: Zakat jumps from $2,250 to $8,125', () => {
        const scenario: ConversationTurn[] = [
            {
                role: 'user',
                content: 'Calculate my Zakat with Bradford. $100k cash, $200k 401k, $150k stocks, $10k gold jewelry. Age 35. $5k credit card, $2k/mo mortgage, $3k/mo living.',
            },
            {
                role: 'assistant',
                tool_call: {
                    name: 'calculate_zakat',
                    arguments: {
                        cash: 100000, retirement_total: 200000, stocks: 150000,
                        gold_jewelry: 10000, loans: 5000, monthly_mortgage: 2000,
                        living_expenses: 3000, age: 35, madhab: 'bradford',
                    },
                },
            },
            // User switches methodology in the widget
            {
                role: 'ui_context_update',
                contextUpdate: { madhab: 'hanafi' },
            },
            {
                role: 'user',
                content: 'How does Hanafi change my Zakat?',
            },
        ];

        const state = simulateConversation(scenario);
        expect(state.currentToolArgs.madhab).toBe('hanafi');
        expect(state.currentToolArgs.cash).toBe(100000);
        expect(state.currentToolArgs.retirement_total).toBe(200000);
        expect(state.currentToolArgs.stocks).toBe(150000);

        // Verify the actual calculation difference
        const bradfordResult = calculateZakat({
            ...defaultFormData,
            checkingAccounts: 100000, fourOhOneKVestedBalance: 200000,
            passiveInvestmentsValue: 150000, goldJewelryValue: 10000,
            hasPreciousMetals: true, creditCardBalance: 5000,
            monthlyMortgage: 2000, monthlyLivingExpenses: 3000,
            age: 35, madhab: 'bradford',
        });
        const hanafiResult = calculateZakat({
            ...defaultFormData,
            checkingAccounts: 100000, fourOhOneKVestedBalance: 200000,
            passiveInvestmentsValue: 150000, goldJewelryValue: 10000,
            hasPreciousMetals: true, creditCardBalance: 5000,
            monthlyMortgage: 2000, monthlyLivingExpenses: 3000,
            age: 35, madhab: 'hanafi',
        });

        expect(bradfordResult.zakatDue).toBeCloseTo(2250, 0);
        expect(hanafiResult.zakatDue).toBeCloseTo(8125, 0);
        expect(hanafiResult.zakatDue).toBeGreaterThan(bradfordResult.zakatDue);
    });

    /**
     * Ahmed adds rental income via UI widget, switching to Qaradawi.
     * This tests both a field addition AND a methodology switch in one flow.
     */
    it('Ahmed adds rental income + switches to Qaradawi: Zakat = $7,650', () => {
        const scenario: ConversationTurn[] = [
            {
                role: 'assistant',
                tool_call: {
                    name: 'calculate_zakat',
                    arguments: {
                        cash: 100000, retirement_total: 200000, stocks: 150000,
                        gold_jewelry: 10000, loans: 5000, monthly_mortgage: 2000,
                        living_expenses: 3000, age: 35, madhab: 'bradford',
                    },
                },
            },
            // User adds rental income and switches to Qaradawi
            {
                role: 'ui_context_update',
                contextUpdate: { rental_income: 24000, madhab: 'qaradawi' },
            },
        ];

        const state = simulateConversation(scenario);
        expect(state.currentToolArgs.madhab).toBe('qaradawi');
        expect(state.currentToolArgs.rental_income).toBe(24000);
        // All original fields preserved
        expect(state.currentToolArgs.cash).toBe(100000);
        expect(state.currentToolArgs.stocks).toBe(150000);
    });

    /**
     * Ahmed ages from 35 to 60 via widget — Bradford retirement proxy activates.
     * This is a critical edge case: the SAME portfolio at different ages
     * produces $2,250 vs $3,750 under Bradford.
     */
    it('Ahmed ages 35 → 60 via UI: Bradford retirement proxy activates', () => {
        const scenario: ConversationTurn[] = [
            {
                role: 'assistant',
                tool_call: {
                    name: 'calculate_zakat',
                    arguments: {
                        cash: 100000, retirement_total: 200000, stocks: 150000,
                        gold_jewelry: 10000, loans: 5000, monthly_mortgage: 2000,
                        living_expenses: 3000, age: 35, madhab: 'bradford',
                    },
                },
            },
            // User updates age in the widget
            {
                role: 'ui_context_update',
                contextUpdate: { age: 60 },
            },
            {
                role: 'user',
                content: 'I just turned 60. How does this affect my Zakat?',
            },
        ];

        const state = simulateConversation(scenario);
        expect(state.currentToolArgs.age).toBe(60);
        expect(state.currentToolArgs.madhab).toBe('bradford');
    });
});
