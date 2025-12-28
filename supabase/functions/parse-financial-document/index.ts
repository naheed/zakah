import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://zakahflow.com',
  'https://www.zakahflow.com',
  'https://zakatflow.com',
  'https://www.zakatflow.com',
];

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  // Allow Lovable preview domains
  if (/^https:\/\/[a-z0-9-]+\.lovableproject\.com$/.test(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+\.lovable\.app$/.test(origin)) return true;
  // Allow localhost for dev
  if (origin.startsWith('http://localhost:')) return true;
  return ALLOWED_ORIGINS.includes(origin);
}

function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = origin && isOriginAllowed(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

// Build document-type-specific extraction guidance
function getDocumentTypeGuidance(documentType: string): string {
  const normalizedType = documentType.toLowerCase();
  
  if (normalizedType.includes("bank")) {
    return `BANK STATEMENT: Extract ending balance as checkingAccounts or savingsAccounts. Note interest earned.`;
  }
  if (normalizedType.includes("brokerage") || normalizedType.includes("investment")) {
    return `BROKERAGE: Extract total portfolio value as passiveInvestmentsValue. Note dividends received.`;
  }
  if (normalizedType.includes("401") || normalizedType.includes("retirement") || normalizedType.includes("ira") || normalizedType.includes("hsa")) {
    return `RETIREMENT ACCOUNT: For 401k use fourOhOneKVestedBalance. For Traditional IRA use traditionalIRABalance. For Roth IRA separate contributions vs earnings. For HSA use hsaBalance.`;
  }
  if (normalizedType.includes("credit card")) {
    return `CREDIT CARD STATEMENT ANALYSIS:
1. Extract the statement/closing balance as creditCardBalance
2. Categorize ALL transactions into these expense categories:
   - utilitiesExpenses: Electric, gas, water, internet, phone, cable, streaming services (Netflix, Spotify, etc.)
   - groceriesExpenses: Supermarkets, grocery stores (Costco, Safeway, Whole Foods, Trader Joe's, etc.), food delivery
   - transportExpenses: Gas stations, public transit, Uber/Lyft, parking, tolls, car maintenance
   - insuranceExpenses: Health insurance, auto insurance, life insurance, home/renters insurance premiums
   - monthlyLivingExpenses: Sum of utilities + groceries + transport for total essential spending
3. Sum up each category from the transaction list. Be thorough - scan every transaction.`;
  }
  if (normalizedType.includes("crypto")) {
    return `CRYPTO: Extract BTC/ETH as cryptoCurrency. Altcoins as cryptoTrading. Note staked assets.`;
  }
  if (normalizedType.includes("mortgage")) {
    return `MORTGAGE: Extract monthly payment as monthlyMortgage.`;
  }
  if (normalizedType.includes("insurance")) {
    return `INSURANCE: Extract premium as insuranceExpenses.`;
  }
  
  return `GENERAL: Extract all account balances and categorize appropriately.`;
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // JWT is verified by Supabase (verify_jwt = true in config)
  // The request will be rejected before reaching here if no valid JWT

  try {
    const { documentBase64, documentType, mimeType } = await req.json();

    if (!documentBase64) {
      return new Response(
        JSON.stringify({ error: "Document data is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate document size (max 10MB base64 ~ 7.5MB file)
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

    console.log(`Processing ${documentType} document (${mimeType}), base64 length: ${documentBase64.length}`);

    const documentGuidance = getDocumentTypeGuidance(documentType);

    const systemPrompt = `You are a financial document analyzer for Zakat calculations. Extract ALL monetary values accurately.

DOCUMENT TYPE: ${documentType}
${documentGuidance}

ASSET FIELDS:
- checkingAccounts, savingsAccounts: Bank account balances
- digitalWallets: PayPal, Venmo, CashApp balances
- interestEarned: Interest income for purification
- activeInvestments: Short-term trading positions
- passiveInvestmentsValue: Long-term stocks, ETFs, mutual funds
- dividends: Dividend income received
- rothIRAContributions: Roth IRA contributions basis
- rothIRAEarnings: Roth IRA earnings
- fourOhOneKVestedBalance: 401k vested balance
- traditionalIRABalance: Traditional IRA balance
- hsaBalance: HSA balance
- cryptoCurrency: Bitcoin, Ethereum value
- cryptoTrading: Altcoins value
- goldValue, silverValue: Precious metals
- realEstateForSale, rentalPropertyIncome: Real estate
- businessCashAndReceivables, businessInventory: Business assets

LIABILITY/EXPENSE FIELDS:
- utilitiesExpenses: Electric, gas, water, internet, phone, cable, streaming (Netflix, Spotify, etc.)
- groceriesExpenses: Supermarkets, grocery stores, food delivery apps
- transportExpenses: Gas, public transit, rideshare (Uber/Lyft), parking, tolls
- insuranceExpenses: Health, auto, life, home/renters insurance premiums
- monthlyLivingExpenses: Total of utilities + groceries + transport
- monthlyMortgage: Monthly mortgage payment
- creditCardBalance: Credit card statement balance
- unpaidBills: Outstanding bills
- studentLoansDue: Student loans due in 12 months
- propertyTax: Property tax due

RULES:
- Put ALL numeric fields into extractedData as an array of objects: { field: string, amount: number }
- Use field names exactly as listed above (e.g., checkingAccounts, creditCardBalance)
- Return numeric values only (no currency symbols)
- Omit fields with no data found (do not return 0)
- For credit cards: SCAN EVERY TRANSACTION and categorize into utilitiesExpenses, groceriesExpenses, transportExpenses, insuranceExpenses
- Calculate monthlyLivingExpenses as sum of utilities + groceries + transport
- Also include summary, documentDate, institutionName, and notes`;

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

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`;
    
    const requestBody = {
      contents: [{ parts }],
      tools: [
        {
          functionDeclarations: [
            {
              name: "extract_financial_data",
              description: "Extract structured financial data from document",
parameters: {
                type: "object",
                properties: {
                  extractedData: {
                    type: "array",
                    description:
                      "List of extracted numeric fields as {field, amount}. Use only field names listed in the prompt.",
                    items: {
                      type: "object",
                      properties: {
                        field: { type: "string", description: "Zakat field name" },
                        amount: { type: "number", description: "Numeric value" },
                      },
                      required: ["field", "amount"],
                    },
                  },
                  summary: { type: "string", description: "Summary of extracted data" },
                  documentDate: { type: "string", description: "Statement date" },
                  institutionName: { type: "string", description: "Institution name" },
                  notes: { type: "string", description: "Important notes" },
                },
                required: ["summary", "extractedData"],
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
          summary: "Unable to parse the document. Please ensure it is a clear image of a financial statement."
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const args = functionCallPart.functionCall.args || {};

    const extractedData: Record<string, number> = {};
    const raw = (args as any).extractedData;

    if (Array.isArray(raw)) {
      for (const item of raw) {
        const field = item?.field;
        const amount = item?.amount;
        if (typeof field === "string" && typeof amount === "number" && Number.isFinite(amount)) {
          extractedData[field] = amount;
        }
      }
    } else if (raw && typeof raw === "object") {
      // Backwards compatibility if model returns an object map
      for (const [k, v] of Object.entries(raw)) {
        if (typeof v === "number" && Number.isFinite(v)) extractedData[k] = v;
      }
    }

    console.log("Extracted data:", JSON.stringify({ extractedData, summary: (args as any).summary }));

    return new Response(
      JSON.stringify({
        success: true,
        extractedData,
        summary: (args as any).summary || "Data extracted successfully",
        documentDate: (args as any).documentDate,
        institutionName: (args as any).institutionName,
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