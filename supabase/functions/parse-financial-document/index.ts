import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorsHeaders } from "../_shared/domainConfig.ts";

// --- Types & Interfaces ---

interface ExtractionLineItem {
  description: string;
  amount: number;
  inferredCategory: string;
  confidence?: number;
}

interface LegacyExtractedData {
  [key: string]: number;
}

// --- Helper Functions ---

// Maps AI inferred category to Legacy Zakat Field
function mapLineItemToLegacyField(item: ExtractionLineItem): string | null {
  const cat = item.inferredCategory.toUpperCase();
  const desc = item.description.toLowerCase();

  // 1. CASH / LIQUID - Prioritize category over description
  if (cat.includes("CHECKING")) return "checkingAccounts";
  if (cat.includes("CASH") || cat.includes("SAVINGS") || cat.includes("MONEY_MARKET")) {
    if (cat.includes("SAVINGS")) return "savingsAccounts";
    // Default cash to checking if not explicitly savings
    if (desc.includes("check")) return "checkingAccounts";
    return "savingsAccounts";
  }

  // 2. RETIREMENT
  if (cat.includes("RETIREMENT") || cat.includes("401K") || cat.includes("IRA")) {
    if (desc.includes("roth")) return "rothIRAEarnings";
    if (desc.includes("401")) return "fourOhOneKVestedBalance";
    return "traditionalIRABalance";
  }

  // 3. INVESTMENTS
  if (cat.includes("EQUITY") || cat.includes("STOCK") || cat.includes("ETF") || cat.includes("MUTUAL")) {
    return "passiveInvestmentsValue";
  }
  if (cat.includes("FIXED_INCOME") || cat.includes("BOND")) {
    return "passiveInvestmentsValue";
  }
  if (cat.includes("CRYPTO")) {
    return "cryptoCurrency";
  }
  if (cat.includes("COMMODITY") || cat.includes("GOLD") || cat.includes("SILVER")) {
    return "goldValue";
  }

  // 4. LIABILITIES / EXPENSES
  if (cat.includes("EXPENSE") || cat.includes("BILL") || cat.includes("UTILITY")) {
    if (desc.includes("grocery") || desc.includes("food")) return "groceriesExpenses";
    if (desc.includes("transport") || desc.includes("gas") || desc.includes("uber")) return "transportExpenses";
    if (desc.includes("insurance")) return "insuranceExpenses";
    return "utilitiesExpenses";
  }
  if (cat.includes("DEBT") || cat.includes("LOAN") || cat.includes("CREDIT")) {
    if (desc.includes("student")) return "studentLoansDue";
    if (desc.includes("mortgage")) return "monthlyMortgage";
    return "creditCardBalance";
  }

  // 5. INCOME
  if (cat.includes("DIVIDEND")) return "dividends";
  if (cat.includes("INTEREST")) return "interestEarned";

  return null;
}

// Aggregates granular line items into the flat legacy format
function aggregateLegacyData(lineItems: ExtractionLineItem[]): LegacyExtractedData {
  const legacyData: LegacyExtractedData = {};

  for (const item of lineItems) {
    const field = mapLineItemToLegacyField(item);
    if (field) {
      legacyData[field] = (legacyData[field] || 0) + item.amount;
    }
  }

  // Derived fields
  if (legacyData["utilitiesExpenses"] || legacyData["groceriesExpenses"] || legacyData["transportExpenses"]) {
    legacyData["monthlyLivingExpenses"] =
      (legacyData["utilitiesExpenses"] || 0) +
      (legacyData["groceriesExpenses"] || 0) +
      (legacyData["transportExpenses"] || 0);
  }

  return legacyData;
}

serve(async (req: any) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentBase64, documentType, mimeType } = await req.json();

    if (!documentBase64) {
      return new Response(
        JSON.stringify({ error: "Document data is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (documentBase64.length > 10 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: "Document too large. Maximum size is 10MB." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // @ts-ignore
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing ${documentType} document (${mimeType}), base64 length: ${documentBase64.length}`);

    // V2 System Prompt: Line Item Extraction
    const systemPrompt = `You are an expert financial auditor for Zakat purification.

OBJECTIVE:
Extract every financial line item from the document with extreme precision. Do not aggregate values yourself. List them individually so they can be classified correctly.

OUTPUT CATEGORIES (use these for inferredCategory):
- CASH_CHECKING: Checking account balances
- CASH_SAVINGS: Savings, Money Market, CD balances
- INVESTMENT_EQUITY: Stocks, ETFs, Mutual Funds
- INVESTMENT_FIXED_INCOME: Bonds, Sukuk, Fixed Income funds
- RETIREMENT_401K: 401k balances
- RETIREMENT_IRA: Traditional or Sep IRA
- RETIREMENT_ROTH: Roth IRA
- CRYPTO: Cryptocurrency holdings
- COMMODITY_GOLD: Gold holdings
- COMMODITY_SILVER: Silver holdings
- EXPENSE_UTILITY: Electricity, water, internet, phone
- EXPENSE_GROCERY: Food and household supplies
- EXPENSE_TRANSPORT: Gas, public transit, vehicle maintenance
- EXPENSE_INSURANCE: Health, auto, home premiums
- LIABILITY_CREDIT_CARD: Credit card debt
- LIABILITY_LOAN: Installment loans, mortgages
- INCOME_DIVIDEND: Dividend payments
- INCOME_INTEREST: Interest/Riba payments (for purification)
- OTHER: Anything that doesn't fit

CRITICAL EXTRACTION RULES:
1. Extract exact amounts as numbers (no currency symbols).
2. For "Cash & Cash Equivalents" in a brokerage, use CASH_SAVINGS.
3. Extract the 'description' exactly as it appears on the statement.
4. Provide a 'confidence' score (0.0 to 1.0) for your categorization.
5. For each distinct holding or balance, create a separate line item.

DATE EXTRACTION (CRITICAL):
- Look for "Statement Date", "Statement Period", "As of", or similar.
- The date MUST be a real date from the document, NOT made up.
- **CONVERSION REQUIRED:** You MUST convert the found date to **YYYY-MM-DD** format.
  - Source: "October 31, 2025" -> Output: "2025-10-31"
  - Source: "10/31/25" -> Output: "2025-10-31"
- Financial statements are historical - dates should be in the PAST.
- If you cannot find a clear date, use today's date or leave empty.

ACCOUNT IDENTIFICATION (CRITICAL):
- Extract the 'institutionName' (e.g., "Charles Schwab", "Chase").
- Extract the 'accountName' (e.g., "Brokerage", "Checking", "Roth IRA").
- **Extract the 'accountId'**: The last 4 digits of the account number.
  - Look for "Account #", "Account Number", or patterns like "***5678".
  - Return ONLY the last 4 digits (e.g., "5678").
  - This is VITAL to distinguish multiple accounts at the same bank.
`;

    const userPrompt = `Analyze this ${documentType} and extract financial data for Zakat calculation.`;

    const parts: any[] = [
      { text: systemPrompt + "\n\n" + userPrompt }
    ];

    if (mimeType.startsWith("image/") || mimeType === "application/pdf") {
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: documentBase64
        }
      });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const requestBody = {
      contents: [{ parts }],
      tools: [
        {
          functionDeclarations: [
            {
              name: "extract_financial_data",
              description: "Extract structured financial line items from document",
              parameters: {
                type: "object",
                properties: {
                  lineItems: {
                    type: "array",
                    description: "List of extracted line items.",
                    items: {
                      type: "object",
                      properties: {
                        description: { type: "string", description: "Description as shown on statement" },
                        amount: { type: "number", description: "Numeric value" },
                        inferredCategory: { type: "string", description: "One of the OUTPUT CATEGORIES" },
                        confidence: { type: "number", description: "Confidence 0.0-1.0" }
                      },
                      required: ["description", "amount", "inferredCategory"]
                    }
                  },
                  summary: { type: "string", description: "Brief summary of the document" },
                  documentDate: { type: "string", description: "Statement date in YYYY-MM-DD format. MUST be a real date from the document, in the past. Example: 2025-11-29" },
                  institutionName: { type: "string", description: "Financial institution name (e.g., Charles Schwab, Fidelity, Vanguard)" },
                  accountName: { type: "string", description: "Account type/nickname (e.g., Brokerage, Roth IRA)" },
                  accountId: { type: "string", description: "Last 4 digits of account number (e.g. '1234') for deduplication" },
                  notes: { type: "string", description: "Any important notes" },
                },
                required: ["lineItems", "summary", "documentDate", "institutionName", "accountName"]
              }
            }
          ]
        }
      ],
      toolConfig: {
        functionCallingConfig: {
          mode: "ANY",
          allowedFunctionNames: ["extract_financial_data"],
        },
      },
    };

    console.log("Request body size:", JSON.stringify(requestBody).length);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 403) {
        return new Response(
          JSON.stringify({ error: "API key invalid or quota exceeded." }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Failed to process document", details: errorText }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("Gemini response received:", JSON.stringify(data).substring(0, 500));

    const candidate = data.candidates?.[0];
    const content = candidate?.content;
    const functionCallPart = content?.parts?.find((part: any) => part.functionCall);

    if (!functionCallPart || functionCallPart.functionCall?.name !== "extract_financial_data") {
      console.error("No valid function call in response:", JSON.stringify(data));
      return new Response(
        JSON.stringify({
          error: "Could not extract data from document",
          extractedData: {},
          lineItems: [],
          summary: "Unable to parse the document. Please ensure it is a clear image of a financial statement."
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const args = functionCallPart.functionCall.args || {};
    const lineItems: ExtractionLineItem[] = (args as any).lineItems || [];

    // Aggregate for backward compatibility with existing UI
    const extractedData = aggregateLegacyData(lineItems);

    console.log("Extracted line items count:", lineItems.length);
    console.log("Aggregated Legacy Data:", JSON.stringify(extractedData));

    // Validate and sanitize documentDate
    let documentDate = (args as any).documentDate;
    if (documentDate) {
      const parsedDate = new Date(documentDate);
      const today = new Date();
      // If date is in the future or invalid, use today's date
      if (isNaN(parsedDate.getTime()) || parsedDate > today) {
        console.log(`Invalid or future date detected: ${documentDate}, using today's date`);
        documentDate = today.toISOString().split('T')[0];
      }
    } else {
      // No date found, use today
      documentDate = new Date().toISOString().split('T')[0];
    }

    return new Response(
      JSON.stringify({
        success: true,
        // V2 Data (granular)
        lineItems,
        // Legacy Data (aggregated for existing UI)
        extractedData,
        summary: (args as any).summary || "Data extracted successfully",
        documentDate,
        institutionName: (args as any).institutionName,
        accountName: (args as any).accountName,
        accountId: (args as any).accountId,
        notes: (args as any).notes,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error processing document:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});