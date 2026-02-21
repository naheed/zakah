import { Anthropic } from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables (.env at monorepo root)
dotenv.config({ path: '../../.env' });

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
const mcpToolSchema = {
    name: "calculate_zakat",
    description: "Calculate Zakat based on Islamic financial rules.",
    input_schema: {
        type: "object" as const,
        properties: {
            cash: { type: "number", description: "Total cash assets (checking, savings, cash on hand)." },
            gold_value: { type: "number", description: "Value of gold investment/jewelry in USD." },
            gold_grams: { type: "number", description: "Weight of gold in grams." },
            silver_value: { type: "number", description: "Value of silver investment/jewelry in USD." },
            silver_grams: { type: "number", description: "Weight of silver in grams." },
            short_term_investments: { type: "number", description: "Value of active trading assets or short-term investments (100% zakatable)." },
            long_term_investments: { type: "number", description: "Value of long-term passive hold assets (stocks, funds) - subject to 30% proxy rule." },
            retirement_total: { type: "number", description: "Total vested balance of retirement accounts (401k, IRA)." },
            age: { type: "number", description: "User's age (crucial for retirement exemption rules)." },
            loans: { type: "number", description: "Start with 0. ONLY include immediate debts due NOW (credit cards, bills, past due). DO NOT include long-term mortgage/student loan balances here." },
            monthly_mortgage: { type: "number", description: "Monthly payment for primary residence mortgage (deductible for 12 months)." },
            madhab: {
                type: "string",
                enum: ['bradford', 'hanafi', 'shafii', 'maliki', 'hanbali', 'amja', 'qaradawi'],
                description: "School of thought for calculation rules."
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
            const inputs = { ...COMMON_AHMED_INPUTS, ...testCase.inputs };
            const expectedCash = (inputs.checkingAccounts || 0) + (inputs.savingsAccounts || 0) + (inputs.cashOnHand || 0);

            let casePassed = true;
            if (args.cash !== expectedCash) casePassed = false;
            if (args.madhab !== testCase.madhab) casePassed = false;
            if (testCase.madhab === 'bradford' && testCase.inputs?.age === 60 && args.age !== 60) casePassed = false;

            if (casePassed) {
                console.log(`  ✅ Passed`);
                passed++;
            } else {
                console.error(`  ❌ Failed mapping. Expected cash=$${expectedCash}, madhab=${testCase.madhab}. Got:`, args);
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
            const inputs = { ...COMMON_AHMED_INPUTS, ...testCase.inputs };
            const expectedCash = (inputs.checkingAccounts || 0) + (inputs.savingsAccounts || 0) + (inputs.cashOnHand || 0);

            let casePassed = true;
            if (args.cash !== expectedCash) casePassed = false;
            if (args.madhab !== testCase.madhab) casePassed = false;
            if (testCase.madhab === 'bradford' && testCase.inputs?.age === 60 && args.age !== 60) casePassed = false;

            if (casePassed) {
                console.log(`  ✅ Passed`);
                passed++;
            } else {
                console.error(`  ❌ Failed mapping. Expected cash=$${expectedCash}, madhab=${testCase.madhab}. Got:`, args);
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
            const inputs = { ...COMMON_AHMED_INPUTS, ...testCase.inputs };
            const expectedCash = (inputs.checkingAccounts || 0) + (inputs.savingsAccounts || 0) + (inputs.cashOnHand || 0);

            let casePassed = true;
            if (args.cash !== expectedCash) casePassed = false;
            if (args.madhab !== testCase.madhab) casePassed = false;
            if (testCase.madhab === 'bradford' && testCase.inputs?.age === 60 && args.age !== 60) casePassed = false;

            if (casePassed) {
                console.log(`  ✅ Passed`);
                passed++;
            } else {
                console.error(`  ❌ Failed mapping. Expected cash=$${expectedCash}, madhab=${testCase.madhab}. Got:`, args);
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

    const totalFailed = anthropicResults.failed + openaiResults.failed + geminiResults.failed;

    // We exit 0 if both are skipped (no keys) so CI doesn't crash unnecessarily without keys,
    // but we exit 1 if an actual evaluation ran and failed.
    if (totalFailed > 0) {
        process.exit(1);
    }
}

runAllEvaluations().catch(console.error);
