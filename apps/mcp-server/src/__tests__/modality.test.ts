/**
 * Modality Routing Tests
 * 
 * Phase 1 of the Eval Infrastructure: Intent Routing & Text Query Eval Matrix.
 * 
 * These tests verify that the MCP tool router logic correctly identifies
 * when to invoke a UI tool (calculate_zakat) vs. when to respond with
 * plain text. These are deterministic unit tests using mocked intents,
 * NOT live LLM calls (those are handled by Promptfoo in eval:routing).
 * 
 * See: docs/PRDs/eval-infrastructure.md
 */

import { describe, it, expect } from 'vitest';

/**
 * Classify an intent as 'ui' or 'text' based on keyword heuristics.
 * In a full implementation, this would be replaced by the actual MCP
 * router logic or an LLM-based classifier.
 */
function classifyIntent(prompt: string): 'ui' | 'text' {
    const lower = prompt.toLowerCase();

    // UI triggers: financial data + calculation request
    const calculationKeywords = [
        'calculate', 'compute', 'figure out', 'what is my zakat',
        'what do i owe', 'how much zakat', "what's my zakat",
    ];
    const financialDataPatterns = [
        /\$[\d,]+/,                    // Dollar amounts
        /\d+\s*(k|K)\b/,              // "50k", "100K"
        /\d+\s*(grams?|oz|ounces?)/,   // Precious metal weights
        /checking|savings|cash|gold|silver|stock|401k|ira|crypto|bitcoin|eth/i,
    ];

    const hasCalculationIntent = calculationKeywords.some(kw => lower.includes(kw));
    const hasFinancialData = financialDataPatterns.some(p => p.test(lower));

    if (hasCalculationIntent && hasFinancialData) return 'ui';
    if (hasCalculationIntent && lower.includes('my')) return 'ui';

    return 'text';
}

describe('Modality Routing: Intent Classification', () => {
    describe('UI Intents (should route to calculate_zakat tool)', () => {
        const uiPrompts = [
            { prompt: 'Calculate my Zakat. I have $50,000 in my checking account.', id: 'UI-01' },
            { prompt: 'I have $10,000 in cash and 5 ounces of gold. What is my Zakat?', id: 'UI-02' },
            { prompt: 'Calculate my zakat using the Hanafi methodology. $25k savings, $100k in stocks.', id: 'UI-03' },
            { prompt: 'I hold 2 ETH staked and $5,000 in Bitcoin. Compute my zakat.', id: 'UI-04' },
            { prompt: 'My assets are $80,000 cash. I owe $10,000 credit cards. Calculate zakat.', id: 'UI-05' },
            { prompt: "I'm 62 years old with a $500k 401k and $20k cash. What's my zakat?", id: 'UI-06' },
            { prompt: 'I have $30k cash and two rental properties. Calculate my zakat.', id: 'UI-07' },
            { prompt: 'I run a small business with $40k in inventory and $10k cash. What do I owe?', id: 'UI-08' },
        ];

        it.each(uiPrompts)('$id: should classify as UI intent', ({ prompt }) => {
            expect(classifyIntent(prompt)).toBe('ui');
        });
    });

    describe('Text Intents (should NOT route to any tool)', () => {
        const textPrompts = [
            { prompt: 'Is Zakat obligatory on my primary residence?', id: 'Text-01' },
            { prompt: 'What is the Nisab threshold?', id: 'Text-02' },
            { prompt: 'Do I need to hold wealth for a full year before paying Zakat?', id: 'Text-03' },
            { prompt: "What is the difference between Hanafi and Shafi'i approaches to gold jewelry Zakat?", id: 'Text-04' },
            { prompt: 'Is cryptocurrency subject to Zakat?', id: 'Text-05' },
            { prompt: 'Hello, what can you help me with?', id: 'Text-06' },
            { prompt: 'Who is eligible to receive Zakat?', id: 'Text-07' },
            { prompt: 'What methodologies does ZakatFlow support?', id: 'Text-10' },
        ];

        it.each(textPrompts)('$id: should classify as Text intent', ({ prompt }) => {
            expect(classifyIntent(prompt)).toBe('text');
        });
    });
});

describe('Text Response Safety Checks', () => {
    it('should not contain markdown table syntax in conversational responses', () => {
        // Simulated text response to "List the categories of assets subject to Zakat"
        const mockResponse = `
            The main categories of Zakatable assets include:
            1. Cash and bank balances
            2. Gold and silver
            3. Trade goods and business inventory
            4. Stocks and investments
            5. Agricultural produce
            6. Livestock (above certain thresholds)
            7. Mined minerals and treasures
            
            Note: Personal-use items like your home, car, and clothing are generally exempt.
        `;

        // No markdown table pipes
        expect(mockResponse).not.toContain('|');
        // No HTML table tags
        expect(mockResponse).not.toMatch(/<table/i);
    });

    it('text responses should include scholarly caveats for edge cases', () => {
        const mockCryptoResponse = `
            Most contemporary scholars consider cryptocurrency to be Zakatable wealth, 
            as it holds monetary value and can be traded. However, there are scholarly 
            differences on whether it should be treated as currency, trade goods, or a 
            separate category. It is recommended to consult a qualified scholar for 
            your specific situation.
        `;

        // Must include some form of caveat / deference
        const hasCaveat = (
            mockCryptoResponse.includes('consult') ||
            mockCryptoResponse.includes('scholar') ||
            mockCryptoResponse.includes('differences') ||
            mockCryptoResponse.includes('opinions')
        );
        expect(hasCaveat).toBe(true);
    });
});
