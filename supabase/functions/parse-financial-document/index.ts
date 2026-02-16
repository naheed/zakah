import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { getCorsHeaders } from "../_shared/domainConfig.ts";

// --- Rate Limiting ---
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

function checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetIn: RATE_LIMIT_WINDOW_MS };
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetIn: record.resetTime - now };
  }
  
  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count, resetIn: record.resetTime - now };
}

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

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

// --- Unified Category → ZakatFormData Field Mapping ---
// This is the single source of truth for how extraction categories map to wizard fields.
// Category IDs must match those in src/lib/assetCategories.ts
const CATEGORY_TO_FORM_FIELD: Record<string, string | null> = {
  'CASH_CHECKING': 'checkingAccounts',
  'CASH_SAVINGS': 'savingsAccounts',
  'CASH_ON_HAND': 'cashOnHand',
  'CASH_DIGITAL_WALLET': 'digitalWallets',
  'INVESTMENT_STOCK': 'passiveInvestmentsValue',
  'INVESTMENT_MUTUAL_FUND': 'passiveInvestmentsValue',
  'INVESTMENT_BOND': 'passiveInvestmentsValue',
  'INVESTMENT_ACTIVE': 'activeInvestments',
  'INVESTMENT_REIT': 'reitsValue',
  'INCOME_DIVIDEND': 'dividends',
  'RETIREMENT_401K': 'fourOhOneKVestedBalance',
  'RETIREMENT_IRA': 'traditionalIRABalance',
  'RETIREMENT_ROTH': 'rothIRAContributions',
  'RETIREMENT_HSA': 'hsaBalance',
  'CRYPTO': 'cryptoCurrency',
  'CRYPTO_STAKED': 'stakedAssets',
  'COMMODITY_GOLD': 'goldInvestmentValue',
  'COMMODITY_SILVER': 'silverInvestmentValue',
  'LIABILITY_CREDIT_CARD': 'creditCardBalance',
  'LIABILITY_LOAN': 'studentLoansDue',
  'OTHER': 'cashOnHand',

  // Legacy category IDs (backward compat with old extractions in DB)
  'INVESTMENT_EQUITY': 'passiveInvestmentsValue',
  'INVESTMENT_FIXED_INCOME': 'passiveInvestmentsValue',
  'INCOME_INTEREST': null,
  'EXPENSE_UTILITY': null,
  'EXPENSE_GROCERY': null,
  'EXPENSE_TRANSPORT': null,
  'EXPENSE_INSURANCE': null,
};

function mapLineItemToLegacyField(item: ExtractionLineItem): string | null {
  const cat = item.inferredCategory.toUpperCase();
  return CATEGORY_TO_FORM_FIELD[cat] ?? null;
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

  return legacyData;
}

serve(async (req: Request) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // --- Rate Limiting Check ---
  const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
    || req.headers.get('cf-connecting-ip') 
    || 'anonymous';
  
  const rateCheck = checkRateLimit(clientIP);
  
  if (!rateCheck.allowed) {
    console.warn(`Rate limit exceeded for IP: ${clientIP.substring(0, 8)}...`);
    return new Response(
      JSON.stringify({ 
        error: "Rate limit exceeded. Please try again later.",
        retryAfter: Math.ceil(rateCheck.resetIn / 1000)
      }),
      { 
        status: 429, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "Retry-After": String(Math.ceil(rateCheck.resetIn / 1000)),
          "X-RateLimit-Remaining": "0"
        } 
      }
    );
  }

  try {
    const { documentBase64, documentType, mimeType, extractionType = 'financial_statement' } = await req.json();

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

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --- SECURITY: File Type Validation ---
    function validateFileType(base64: string, expectedMime: string): boolean {
      const signatures: Record<string, string[]> = {
        'application/pdf': ['JVBERi'],
        'image/jpeg': ['/9j/'],
        'image/png': ['iVBORw0KGgo'],
        'image/webp': ['UklGR']
      };

      const validSignatures = signatures[expectedMime];
      if (!validSignatures) return false;

      return validSignatures.some(sig => base64.startsWith(sig));
    }

    if (!validateFileType(documentBase64, mimeType)) {
      console.error(`Security Alert: Mime type ${mimeType} does not match file signature.`);
      return new Response(
        JSON.stringify({ error: "Invalid file type. File signature does not match declared type." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing ${documentType} document (${mimeType}), extractionType: ${extractionType}`);

    // --- PROMPT REGISTRY ---
    let systemPrompt = "";
    let tools = [];
    const STATEMENT_PROMPT = `You are an expert financial auditor for Zakat purification.

OBJECTIVE:
Extract every financial line item (holdings, balances, positions) from the document with extreme precision. Do not aggregate values yourself. List them individually so they can be classified correctly.

IMPORTANT: Only extract ASSET HOLDINGS and BALANCES. Do NOT extract expenses, transactions, or payment activity. Focus on what the person OWNS, not what they spent.

OUTPUT CATEGORIES (use EXACTLY these IDs for inferredCategory):
- CASH_CHECKING: Checking account balances
- CASH_SAVINGS: Savings accounts, Money Market accounts, CDs
- CASH_ON_HAND: Physical cash
- CASH_DIGITAL_WALLET: PayPal, Venmo, Apple Cash balances
- INVESTMENT_STOCK: Individual stocks, ETFs (e.g. AAPL, VTI, SPY)
- INVESTMENT_MUTUAL_FUND: Mutual funds (e.g. VFIAX, FXAIX)
- INVESTMENT_BOND: Bonds, fixed income, sukuk
- INVESTMENT_ACTIVE: Day trading positions, options contracts
- INVESTMENT_REIT: Real Estate Investment Trusts
- INCOME_DIVIDEND: Dividend payments or accumulated dividends
- RETIREMENT_401K: 401(k), 403(b), 457 plan balances
- RETIREMENT_IRA: Traditional IRA, SEP IRA
- RETIREMENT_ROTH: Roth IRA balances
- RETIREMENT_HSA: Health Savings Account balances
- CRYPTO: Bitcoin, Ethereum, cryptocurrency holdings
- CRYPTO_STAKED: Staked cryptocurrency or DeFi positions
- COMMODITY_GOLD: Gold holdings (physical or ETFs like GLD)
- COMMODITY_SILVER: Silver holdings (physical or ETFs like SLV)
- LIABILITY_CREDIT_CARD: Credit card debt/balance
- LIABILITY_LOAN: Loans, mortgages, student debt
- OTHER: Anything that doesn't fit above categories

DISTINGUISHING RULES:
- Individual stocks (AAPL, MSFT, GOOG) and ETFs (VTI, SPY, QQQ) → INVESTMENT_STOCK
- Mutual funds with 5-letter tickers ending in X (VFIAX, FXAIX) → INVESTMENT_MUTUAL_FUND
- "Cash & Cash Equivalents" or "Sweep" in a brokerage account → CASH_SAVINGS
- Day trading or options → INVESTMENT_ACTIVE
- If a brokerage holds BOTH stocks and a cash sweep, create SEPARATE line items for each

CRITICAL EXTRACTION RULES:
1. Extract exact amounts as numbers (no currency symbols).
2. Extract the 'description' exactly as it appears on the statement.
3. Provide a 'confidence' score (0.0 to 1.0) for your categorization.
4. For each distinct holding or balance, create a separate line item.

DATE EXTRACTION (CRITICAL):
- Look for "Statement Date", "Statement Period", "As of", or similar.
- The date MUST be a real date from the document, NOT made up.
- **CONVERSION REQUIRED:** You MUST convert the found date to **YYYY-MM-DD** format.
- Financial statements are historical - dates should be in the PAST.
- If you cannot find a clear date, leave empty.

ACCOUNT IDENTIFICATION (CRITICAL):
- Extract the 'institutionName' (e.g., "Charles Schwab", "Chase").
- Extract the 'accountName' (e.g., "Brokerage", "Checking", "Roth IRA").
- **Extract the 'accountId'**: The last 4 digits of the account number.
  - Look for "Account #", "Account Number", or patterns like "***5678".
  - Return ONLY the last 4 digits (e.g., "5678").
  - This is VITAL to distinguish multiple accounts at the same bank.
`;

    const RECEIPT_PROMPT = `You are an expert at parsing donation receipts and tax acknowledgement letters for Zakat tracking.

OBJECTIVE:
Extract structured details from a donation receipt.

CRITICAL FIELDS TO EXTRACT:
1. **Organization Name**: The Name of the charity or non-profit receiving the funds.
2. **Donation Amount**: The numeric value of the donation.
3. **Date**: The date the donation was made (YYYY-MM-DD). this is CRITICAL.
4. **Tax ID**: The EIN or Tax ID of the organization if present.
5. **Address**: The physical address of the organization if present.
6. **Donor Name**: The name of the person who donated.

RULES:
- If the document contains multiple donations (e.g. a yearly summary), extract the TOTAL amount for the 'donationAmount', or the most recent specific donation if ambiguous.
- Convert dates to YYYY-MM-DD.
- Return null for missing fields.
`;

    // --- TOOL DEFINITIONS ---

    const TOOLS_STATEMENT = [
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
                      inferredCategory: { type: "string", description: "One of the OUTPUT CATEGORIES (exact ID)" },
                      confidence: { type: "number", description: "Confidence 0.0-1.0" }
                    },
                    required: ["description", "amount", "inferredCategory"]
                  }
                },
                summary: { type: "string", description: "Brief summary of the document" },
                documentDate: { type: "string", description: "Statement date in YYYY-MM-DD format." },
                institutionName: { type: "string", description: "Financial institution name" },
                accountName: { type: "string", description: "Account type/nickname" },
                accountId: { type: "string", description: "Last 4 digits of account number" },
                notes: { type: "string", description: "Any important notes" },
              },
              required: ["lineItems", "summary", "documentDate", "institutionName", "accountName"]
            }
          }
        ]
      }
    ];

    const TOOLS_RECEIPT = [
      {
        functionDeclarations: [
          {
            name: "extract_donation_receipt",
            description: "Extract details from a donation receipt",
            parameters: {
              type: "object",
              properties: {
                organizationName: { type: "string", description: "Name of the charity" },
                donationAmount: { type: "number", description: "Total amount donated" },
                donationDate: { type: "string", description: "Date of donation (YYYY-MM-DD)" },
                taxId: { type: "string", description: "EIN/Tax ID of the charity" },
                address: { type: "string", description: "Address of the charity" },
                donorName: { type: "string", description: "Name of the donor" },
                paymentMethod: { type: "string", description: "Credit Card, Check, ACH, etc." },
                campaign: { type: "string", description: "Campaign or Fund name if specified" }
              },
              required: ["organizationName", "donationAmount", "donationDate"]
            }
          }
        ]
      }
    ];

    // --- SELECTION LOGIC ---
    if (extractionType === 'donation_receipt') {
      systemPrompt = RECEIPT_PROMPT;
      tools = TOOLS_RECEIPT;
    } else {
      systemPrompt = STATEMENT_PROMPT;
      tools = TOOLS_STATEMENT;
    }

    const userPrompt = `Analyze this ${documentType} and extract data.`;

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

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`;

    const requestBody = {
      contents: [{ parts }],
      tools: tools,
      toolConfig: {
        functionCallingConfig: {
          mode: "ANY",
          allowedFunctionNames: extractionType === 'donation_receipt' ? ["extract_donation_receipt"] : ["extract_financial_data"],
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

    // --- RESPONSE HANDLING ---
    if (!functionCallPart) {
      console.error("No function call in Gemini response. Full response:", JSON.stringify(data).substring(0, 1000));
      return new Response(
        JSON.stringify({ error: "AI could not extract structured data from this document. Please try a clearer image or PDF." }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const args = functionCallPart.functionCall.args || {};

    if (extractionType === 'donation_receipt') {
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            organizationName: (args as any).organizationName,
            donationAmount: (args as any).donationAmount,
            donationDate: (args as any).donationDate,
            taxId: (args as any).taxId,
            address: (args as any).address,
            donorName: (args as any).donorName,
            paymentMethod: (args as any).paymentMethod,
            campaign: (args as any).campaign
          }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Default: Asset Statement Logic
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
      if (isNaN(parsedDate.getTime()) || parsedDate > today) {
        console.log(`Invalid or future date detected: ${documentDate}, using today's date`);
        documentDate = today.toISOString().split('T')[0];
      }
    } else {
      documentDate = new Date().toISOString().split('T')[0];
    }

    return new Response(
      JSON.stringify({
        success: true,
        lineItems,
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
