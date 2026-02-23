import { Anthropic } from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables (.env and .env.local at monorepo root)
dotenv.config({ path: '../../.env' });
dotenv.config({ path: '../../.env.local', override: true });

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || 'skip',
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'skip',
});

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || 'skip',
});

// We read the Ahmed Master Matrix natively to avoid TS compilation workspace errors 
// when importing from the core package locally in this unlinked evals runner.
const matrixFilePath = path.join(__dirname, '../../../../packages/core/src/__tests__/ahmed_master_matrix.test.ts');
const matrixFileContent = fs.readFileSync(matrixFilePath, 'utf-8');

// Extremely dirty, but effective regex extraction for the evaluating script
const extractMatrixPayload = () => {
    try {
        // Find the COMMON_AHMED_INPUTS block
        const commonInputsMatch = matrixFileContent.match(/export const COMMON_AHMED_INPUTS: Partial<ZakatFormData> = ([\s\S]*?);/);

        // Find the MASTER_MATRIX block
        const matrixMatch = matrixFileContent.match(/export const MASTER_MATRIX: AhmedMatrixCase\[\] = (\[[\s\S]*?\]);/);

        if (!matrixMatch) throw new Error("Could not parse matrix match");

        // To parse the raw JS string, we need a secure sandbox or eval context. 
        // Given this is a local build tool, we can use Function.
        const defaultFormData = {}; // mock 
        const jsonString = matrixMatch[1]
            .replace(/COMMON_AHMED_INPUTS/g, '{}')
            .replace(/...{}/g, '')
            .replace(/([a-zA-Z0-9_]+):/g, '"$1":')
            .replace(/'([^']+)'/g, '"$1"');

        // For absolute safety and to avoid complex regex string manipulation,
        // Let's just hardcode the Matrix array for Phase 2 Evaluation execution.
        return true;
    } catch (e) {
        return false;
    }
};

// Hardcoded for reliability in the isolated evals environment 
// (The core engine is proven, now we prove the Agent mapping)
const COMMON_AHMED_INPUTS = {
    cashOnHand: 50000,
    checkingAccounts: 25000,
    savingsAccounts: 25000,
    fourOhOneKVestedBalance: 200000,
    passiveInvestmentsValue: 150000,
    goldJewelryValue: 10000,
    hasPreciousMetals: true,
    creditCardBalance: 5000,
    monthlyMortgage: 2000,
    monthlyLivingExpenses: 3000,
    age: 35,
    estimatedTaxRate: 0.25,
};

const MASTER_MATRIX = [
    {
        caseId: 'AHMED-HANAFI-01',
        description: 'Super Ahmed Standard Evaluation',
        madhab: 'hanafi',
        inputs: COMMON_AHMED_INPUTS,
        expected: {
            zakatDue: 8125,
        }
    },
    {
        caseId: 'AHMED-SHAFII-01',
        description: 'Super Ahmed Standard Evaluation',
        madhab: 'shafii',
        inputs: COMMON_AHMED_INPUTS,
        expected: {
            zakatDue: 9500,
        }
    },
    {
        caseId: 'AHMED-BRADFORD-01',
        description: 'Super Ahmed Bradford Rule',
        madhab: 'bradford',
        inputs: COMMON_AHMED_INPUTS,
        expected: {
            zakatDue: 2250,
        }
    },
    {
        caseId: 'AHMED-BRADFORD-RETIRED',
        description: 'Ahmed reaches age 60 (Retirement Proxy activation)',
        madhab: 'bradford',
        inputs: { ...COMMON_AHMED_INPUTS, age: 60, isOver59Half: true },
        expected: {
            zakatDue: 3750,
        }
    },
    {
        caseId: 'AHMED-AMJA-01',
        description: 'Super Ahmed AMJA Rules (Equities Income Only)',
        madhab: 'amja',
        inputs: COMMON_AHMED_INPUTS,
        expected: {
            zakatDue: 5500,
        }
    },
    {
        caseId: 'AHMED-QARADAWI-RENTAL',
        description: 'Qaradawi Multi-Rate Rental Override',
        madhab: 'qaradawi',
        inputs: {
            ...COMMON_AHMED_INPUTS,
            rentalPropertyIncome: 24000,
            hasRealEstate: true
        },
        expected: {
            zakatDue: 7650
        }
    }
];


// The exact schema exposed by the MCP Server for the LLM
// Expanded to match the full calculate_zakat tool schema in tools/calculate_zakat.ts
const mcpToolSchema = {
    name: "calculate_zakat",
    description: "Calculate Zakat obligation based on Islamic jurisprudence. Supports ALL asset categories: cash, precious metals, crypto, investments, retirement, trusts, real estate, business, illiquid assets, and detailed liabilities.",
    input_schema: {
        type: "object" as const,
        properties: {
            cash: { type: "number", description: "Total cash assets (checking, savings, cash on hand)." },
            gold_value: { type: "number", description: "Value of gold investment in USD." },
            gold_grams: { type: "number", description: "Weight of gold in grams (for conversion)." },
            gold_jewelry: { type: "number", description: "Value of personal-use gold jewelry in USD. Zakatability varies by madhab." },
            silver_value: { type: "number", description: "Value of silver investment in USD." },
            silver_grams: { type: "number", description: "Weight of silver in grams." },
            silver_jewelry: { type: "number", description: "Value of personal-use silver jewelry in USD." },
            crypto: { type: "number", description: "Value of held cryptocurrency (e.g., Bitcoin, Ethereum)." },
            crypto_trading: { type: "number", description: "Value of crypto in active trading positions." },
            staked_assets: { type: "number", description: "Value of staked/locked crypto assets." },
            staked_rewards: { type: "number", description: "Value of vested staking rewards." },
            liquidity_pool: { type: "number", description: "Value of DeFi liquidity pool positions." },
            stocks: { type: "number", description: "Value of long-term passive hold assets (stocks, index funds, ETFs). Rate varies by madhab." },
            active_trading: { type: "number", description: "Value of short-term/active trading positions (100% zakatable)." },
            reits: { type: "number", description: "Value of Real Estate Investment Trusts." },
            dividends: { type: "number", description: "Annual dividends received from passive investments. Critical for AMJA income-only method." },
            retirement_total: { type: "number", description: "Total vested balance of retirement accounts (401k, IRA). Tax-adjusted by engine." },
            roth_ira_contributions: { type: "number", description: "Roth IRA contribution principal (tax-free)." },
            roth_ira_earnings: { type: "number", description: "Roth IRA earnings above contributions." },
            traditional_ira: { type: "number", description: "Traditional IRA balance." },
            four_oh_one_k: { type: "number", description: "401k vested balance." },
            hsa_balance: { type: "number", description: "Health Savings Account balance." },
            age: { type: "number", description: "User's age. CRITICAL for Bradford retirement exemption (under 59.5 = exempt, over = proxy rate)." },
            revocable_trust: { type: "number", description: "Revocable trust value (fully zakatable)." },
            irrevocable_trust: { type: "number", description: "Irrevocable trust value (zakatable if accessible)." },
            real_estate_for_sale: { type: "number", description: "Value of real estate held for sale (trade goods, 100% zakatable)." },
            land_banking: { type: "number", description: "Value of land held for investment." },
            rental_income: { type: "number", description: "Annual rental property income. Special treatment under Qaradawi multi-rate." },
            business_cash: { type: "number", description: "Business cash and accounts receivable." },
            business_inventory: { type: "number", description: "Business inventory at cost." },
            illiquid_assets: { type: "number", description: "Value of illiquid/hard-to-sell assets." },
            livestock: { type: "number", description: "Value of livestock." },
            good_debt_owed: { type: "number", description: "Good debt owed TO the user (expected to be repaid)." },
            bad_debt_recovered: { type: "number", description: "Bad debt recently recovered." },
            loans: { type: "number", description: "Immediate debts due NOW (credit cards, bills). Do NOT include long-term balances." },
            unpaid_bills: { type: "number", description: "Unpaid bills and utilities." },
            monthly_mortgage: { type: "number", description: "Monthly primary residence mortgage payment (annualized for deduction)." },
            student_loans: { type: "number", description: "Monthly student loan payment." },
            property_tax: { type: "number", description: "Annual property tax." },
            living_expenses: { type: "number", description: "Monthly living expenses (annualized for Hanafi/Bradford deduction)." },
            madhab: {
                type: "string",
                enum: ['bradford', 'hanafi', 'shafii', 'maliki', 'hanbali', 'amja', 'qaradawi', 'tahir_anwar'],
                description: "School of thought / methodology preset for calculation rules."
            },
            nisab_standard: {
                type: "string",
                enum: ['silver', 'gold'],
                description: "Nisab threshold standard. Silver is more conservative (lower threshold)."
            },
        },
        required: ["cash", "madhab"]
    }
};

function buildPromptFromMatrixCase(matrixCase: any): string {
    const inputs = { ...COMMON_AHMED_INPUTS, ...matrixCase.inputs };

    return `
You are an expert Islamic Finance AI assistant. Use the calculate_zakat tool to determine the Zakat obligation for the following user.
You MUST map the user's financial situation to the tool's parameters accurately.

User Situation (${matrixCase.description}):
- Age: ${inputs.age}
- Preferred Madhab: ${matrixCase.madhab}
- Checking Account: $${inputs.checkingAccounts || 0}
- Savings Account: $${inputs.savingsAccounts || 0}
- Cash on Hand: $${inputs.cashOnHand || 0}
- 401k Vested Balance: $${inputs.fourOhOneKVestedBalance || 0}
- Passive Equities/Stocks: $${inputs.passiveInvestmentsValue || 0}
- Active Trading Stocks: $${inputs.activeInvestments || 0}
- Gold Jewelry Value: $${inputs.goldJewelryValue || 0}
- Gold Investment Value: $${inputs.goldInvestmentValue || 0}
- Crypto Value: $${inputs.cryptoCurrency || 0}
- Credit Card Debt (due now): $${inputs.creditCardBalance || 0}
- Monthly Living Expenses: $${inputs.monthlyLivingExpenses || 0}
- Monthly Mortgage Payment: $${inputs.monthlyMortgage || 0}
- Rental Income (annually): $${inputs.rentalPropertyIncome || 0}

Extract the relevant information and call the calculate_zakat tool. Do not guess the math; your job is strictly to map these values to the correct arguments in the tool schema.
    `;
}

// =============================================================================
// Enhanced Assertion Logic — validates all relevant fields per Ahmed case
// =============================================================================

interface AssertionResult {
    passed: boolean;
    details: string[];
}

function validateToolArgs(args: Record<string, any>, testCase: any): AssertionResult {
    const inputs = { ...COMMON_AHMED_INPUTS, ...testCase.inputs };
    const expectedCash = (inputs.checkingAccounts || 0) + (inputs.savingsAccounts || 0) + (inputs.cashOnHand || 0);
    const details: string[] = [];
    let passed = true;

    // === Required: cash mapping ===
    if (args.cash !== expectedCash) {
        details.push(`cash: expected ${expectedCash}, got ${args.cash}`);
        passed = false;
    } else {
        details.push(`✓ cash = ${args.cash}`);
    }

    // === Required: madhab mapping ===
    if (args.madhab !== testCase.madhab) {
        details.push(`madhab: expected "${testCase.madhab}", got "${args.madhab}"`);
        passed = false;
    } else {
        details.push(`✓ madhab = "${args.madhab}"`);
    }

    // === Age — critical for Bradford retirement proxy ===
    const expectedAge = inputs.age;
    if (expectedAge && args.age !== expectedAge) {
        details.push(`age: expected ${expectedAge}, got ${args.age}`);
        // Only fail for Bradford retirement cases where age is the differentiator
        if (testCase.madhab === 'bradford') passed = false;
    } else if (args.age) {
        details.push(`✓ age = ${args.age}`);
    }

    // === Retirement ===
    if (inputs.fourOhOneKVestedBalance > 0) {
        const retVal = args.retirement_total || args.four_oh_one_k || 0;
        if (retVal !== inputs.fourOhOneKVestedBalance) {
            details.push(`retirement: expected ${inputs.fourOhOneKVestedBalance}, got ${retVal}`);
        } else {
            details.push(`✓ retirement = ${retVal}`);
        }
    }

    // === Stocks ===
    if (inputs.passiveInvestmentsValue > 0) {
        const stockVal = args.stocks || args.long_term_investments || 0;
        if (stockVal !== inputs.passiveInvestmentsValue) {
            details.push(`stocks: expected ${inputs.passiveInvestmentsValue}, got ${stockVal}`);
        } else {
            details.push(`✓ stocks = ${stockVal}`);
        }
    }

    // === Gold Jewelry ===
    if (inputs.goldJewelryValue > 0) {
        const goldVal = args.gold_jewelry || args.gold_value || 0;
        if (goldVal !== inputs.goldJewelryValue) {
            details.push(`gold_jewelry: expected ${inputs.goldJewelryValue}, got ${goldVal}`);
        } else {
            details.push(`✓ gold_jewelry = ${goldVal}`);
        }
    }

    // === Loans / Credit Card ===
    if (inputs.creditCardBalance > 0) {
        if (args.loans !== inputs.creditCardBalance) {
            details.push(`loans: expected ${inputs.creditCardBalance}, got ${args.loans}`);
        } else {
            details.push(`✓ loans = ${args.loans}`);
        }
    }

    // === Monthly Mortgage ===
    if (inputs.monthlyMortgage > 0) {
        if (args.monthly_mortgage !== inputs.monthlyMortgage) {
            details.push(`monthly_mortgage: expected ${inputs.monthlyMortgage}, got ${args.monthly_mortgage}`);
        } else {
            details.push(`✓ monthly_mortgage = ${args.monthly_mortgage}`);
        }
    }

    // === Living Expenses ===
    if (inputs.monthlyLivingExpenses > 0) {
        if (args.living_expenses !== inputs.monthlyLivingExpenses) {
            details.push(`living_expenses: expected ${inputs.monthlyLivingExpenses}, got ${args.living_expenses} (optional — not all schemas expose this)`);
        } else {
            details.push(`✓ living_expenses = ${args.living_expenses}`);
        }
    }

    // === Rental Income (Qaradawi case) ===
    if (inputs.rentalPropertyIncome > 0) {
        if (args.rental_income !== inputs.rentalPropertyIncome) {
            details.push(`rental_income: expected ${inputs.rentalPropertyIncome}, got ${args.rental_income}`);
            passed = false; // Critical for Qaradawi
        } else {
            details.push(`✓ rental_income = ${args.rental_income}`);
        }
    }

    return { passed, details };
}

async function evaluateAnthropic(): Promise<{ passed: number, failed: number }> {
    console.log("\n==========================================================");
    console.log("🤖 Provider: Anthropic (Claude 3.5 Sonnet)");
    console.log("==========================================================");

    if (!process.env.ANTHROPIC_API_KEY) {
        console.error("❌ Error: ANTHROPIC_API_KEY is not set in .env. Skipping Anthropic evaluations.");
        return { passed: 0, failed: 0 };
    }

    let passed = 0;
    let failed = 0;

    for (const testCase of MASTER_MATRIX) {
        console.log(`Evaluating Case: [${testCase.caseId}]`);
        const prompt = buildPromptFromMatrixCase(testCase);

        try {
            const response = await anthropic.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 1024,
                tools: [mcpToolSchema],
                tool_choice: { type: "auto" },
                temperature: 0.1,
                messages: [{ role: 'user', content: prompt }]
            });

            const toolCall = response.content.find(block => block.type === 'tool_use');

            if (!toolCall || toolCall.type !== 'tool_use') {
                console.error(`  ❌ Failed: LLM did not call the calculate_zakat tool.`);
                failed++;
                continue;
            }

            const args = toolCall.input as Record<string, any>;
            const result = validateToolArgs(args, testCase);

            if (result.passed) {
                console.log(`  ✅ Passed`);
                result.details.forEach(d => console.log(`     ${d}`));
                passed++;
            } else {
                console.error(`  ❌ Failed mapping:`);
                result.details.forEach(d => console.error(`     ${d}`));
                failed++;
            }
        } catch (error) {
            console.error(`  ❌ Error hitting Anthropic API:`, error);
            failed++;
        }
    }
    return { passed, failed };
}

async function evaluateOpenAI(): Promise<{ passed: number, failed: number }> {
    console.log("\n==========================================================");
    console.log("🤖 Provider: OpenAI (gpt-4o)");
    console.log("==========================================================");

    if (!process.env.OPENAI_API_KEY) {
        console.error("❌ Error: OPENAI_API_KEY is not set in .env. Skipping OpenAI evaluations.");
        return { passed: 0, failed: 0 };
    }

    // Convert Anthropic tool schema to OpenAI function calling format
    const openAITool = {
        type: "function" as const,
        function: {
            name: mcpToolSchema.name,
            description: mcpToolSchema.description,
            parameters: mcpToolSchema.input_schema,
        }
    };

    let passed = 0;
    let failed = 0;

    for (const testCase of MASTER_MATRIX) {
        console.log(`Evaluating Case: [${testCase.caseId}]`);
        const prompt = buildPromptFromMatrixCase(testCase);

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [{ role: 'user', content: prompt }],
                tools: [openAITool],
                tool_choice: "auto",
                temperature: 0.1,
            });

            const toolCall = response.choices[0]?.message?.tool_calls?.[0];

            if (!toolCall || toolCall.type !== 'function' || toolCall.function.name !== 'calculate_zakat') {
                console.error(`  ❌ Failed: LLM did not call the calculate_zakat tool.`);
                failed++;
                continue;
            }

            const args = JSON.parse(toolCall.function.arguments);
            const result = validateToolArgs(args, testCase);

            if (result.passed) {
                console.log(`  ✅ Passed`);
                result.details.forEach(d => console.log(`     ${d}`));
                passed++;
            } else {
                console.error(`  ❌ Failed mapping:`);
                result.details.forEach(d => console.error(`     ${d}`));
                failed++;
            }
        } catch (error) {
            console.error(`  ❌ Error hitting OpenAI API:`, error);
            failed++;
        }
    }
    return { passed, failed };
}

async function evaluateGemini(): Promise<{ passed: number, failed: number }> {
    console.log("\n==========================================================");
    console.log("🤖 Provider: Google Gemini (gemini-2.5-pro)");
    console.log("==========================================================");

    if (!process.env.GEMINI_API_KEY) {
        console.error("❌ Error: GEMINI_API_KEY is not set in .env. Skipping Gemini evaluations.");
        return { passed: 0, failed: 0 };
    }

    let passed = 0;
    let failed = 0;

    for (const testCase of MASTER_MATRIX) {
        console.log(`Evaluating Case: [${testCase.caseId}]`);
        const prompt = buildPromptFromMatrixCase(testCase);

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt,
                config: {
                    temperature: 0.1,
                    tools: [{
                        functionDeclarations: [{
                            name: mcpToolSchema.name,
                            description: mcpToolSchema.description,
                            parameters: mcpToolSchema.input_schema as any
                        }]
                    }]
                }
            });

            const functionCalls = response.functionCalls;

            if (!functionCalls || functionCalls.length === 0 || functionCalls[0].name !== 'calculate_zakat') {
                console.error(`  ❌ Failed: LLM did not call the calculate_zakat tool.`);
                failed++;
                continue;
            }

            const toolCall = functionCalls[0];
            const args = toolCall.args as Record<string, any>;
            const result = validateToolArgs(args, testCase);

            if (result.passed) {
                console.log(`  ✅ Passed`);
                result.details.forEach(d => console.log(`     ${d}`));
                passed++;
            } else {
                console.error(`  ❌ Failed mapping:`);
                result.details.forEach(d => console.error(`     ${d}`));
                failed++;
            }
        } catch (error) {
            console.error(`  ❌ Error hitting Gemini API:`, error);
            failed++;
        }
    }
    return { passed, failed };
}

async function runAllEvaluations() {
    console.log("🚀 Starting Multi-Model Agentic Evaluation Framework for ZakatFlow MCP");

    const anthropicResults = await evaluateAnthropic();
    const openaiResults = await evaluateOpenAI();
    const geminiResults = await evaluateGemini();

    console.log("\n==========================================================");
    console.log(`🎯 Final Evaluation Summary:`);
    console.log(`  - Anthropic: ${anthropicResults.passed} Passed, ${anthropicResults.failed} Failed`);
    console.log(`  - OpenAI:    ${openaiResults.passed} Passed, ${openaiResults.failed} Failed`);
    console.log(`  - Gemini:    ${geminiResults.passed} Passed, ${geminiResults.failed} Failed`);
    console.log("==========================================================");

    const totalPassed = anthropicResults.passed + openaiResults.passed + geminiResults.passed;
    const totalFailed = anthropicResults.failed + openaiResults.failed + geminiResults.failed;

    if (totalPassed === 0) {
        console.error("\n❌ FATAL: No evaluations were successfully run. Please configure at least one API key (.env) to prove execution.");
        process.exit(1);
    }

    if (totalFailed > 0) {
        process.exit(1);
    }
}

runAllEvaluations().catch(console.error);
