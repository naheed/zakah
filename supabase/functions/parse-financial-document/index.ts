import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
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

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing ${documentType} document (${mimeType})`);

    const systemPrompt = `You are a financial document analyzer specialized in extracting data from bank statements, brokerage statements, and retirement account statements for Zakat calculation purposes.

Your task is to extract ALL financial figures from the document and categorize them appropriately. Be thorough and extract every monetary value you can identify.

Return your analysis using the extract_financial_data function with the following categories:

1. **Liquid Assets** (checkingAccounts, savingsAccounts, cashOnHand, digitalWallets):
   - Checking account balances
   - Savings account balances
   - Money market accounts
   - PayPal, Venmo, CashApp balances

2. **Investments** (activeInvestments, passiveInvestmentsValue, dividends):
   - Stock holdings (market value)
   - ETF holdings
   - Mutual fund holdings
   - Dividend income received

3. **Retirement Accounts**:
   - rothIRAContributions: Roth IRA contribution basis
   - rothIRAEarnings: Roth IRA earnings/growth
   - fourOhOneKVestedBalance: 401(k) vested balance
   - traditionalIRABalance: Traditional IRA balance
   - hsaBalance: HSA account balance

4. **Cryptocurrency** (cryptoCurrency, cryptoTrading):
   - Bitcoin, Ethereum holdings
   - Other crypto assets

5. **Precious Metals** (goldValue, silverValue):
   - Gold holdings (coins, bars)
   - Silver holdings

6. **Interest Earned** (interestEarned):
   - Interest from savings accounts (for purification)

Always return numeric values only (no currency symbols). If a value is not found, omit it from the response.
Also return a summary of what you found and any notes about the document.`;

    const userPrompt = `Please analyze this ${documentType} document and extract all financial data for Zakat calculation. Focus on account balances, investment values, and any relevant financial figures.`;

    // Build content parts for Google Gemini API
    const parts: any[] = [
      { text: systemPrompt + "\n\n" + userPrompt }
    ];

    // Add the document as inline data
    if (mimeType.startsWith("image/") || mimeType === "application/pdf") {
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: documentBase64
        }
      });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: parts
          }
        ],
        tools: [
          {
            functionDeclarations: [
              {
                name: "extract_financial_data",
                description: "Extract and return structured financial data from the document",
                parameters: {
                  type: "object",
                  properties: {
                    // Liquid Assets
                    checkingAccounts: { type: "number", description: "Total checking account balance" },
                    savingsAccounts: { type: "number", description: "Total savings account balance" },
                    cashOnHand: { type: "number", description: "Physical cash amount" },
                    digitalWallets: { type: "number", description: "PayPal, Venmo, CashApp balances" },
                    foreignCurrency: { type: "number", description: "Foreign currency converted to USD" },
                    interestEarned: { type: "number", description: "Interest earned (for purification)" },
                    
                    // Investments
                    activeInvestments: { type: "number", description: "Short-term trading positions value" },
                    passiveInvestmentsValue: { type: "number", description: "Long-term stock/ETF holdings value" },
                    dividends: { type: "number", description: "Dividend income received" },
                    
                    // Retirement
                    rothIRAContributions: { type: "number", description: "Roth IRA contribution basis" },
                    rothIRAEarnings: { type: "number", description: "Roth IRA earnings" },
                    fourOhOneKVestedBalance: { type: "number", description: "401(k) vested balance" },
                    traditionalIRABalance: { type: "number", description: "Traditional IRA balance" },
                    hsaBalance: { type: "number", description: "HSA account balance" },
                    
                    // Crypto
                    cryptoCurrency: { type: "number", description: "Major crypto (BTC, ETH) value" },
                    cryptoTrading: { type: "number", description: "Altcoins and trading positions" },
                    
                    // Precious Metals
                    goldValue: { type: "number", description: "Gold holdings value" },
                    silverValue: { type: "number", description: "Silver holdings value" },
                    
                    // Metadata
                    summary: { type: "string", description: "Brief summary of what was found" },
                    documentDate: { type: "string", description: "Statement date if found" },
                    institutionName: { type: "string", description: "Bank or brokerage name" },
                    notes: { type: "string", description: "Any important notes or caveats" }
                  },
                  required: ["summary"]
                }
              }
            ]
          }
        ],
        toolConfig: {
          functionCallingConfig: {
            mode: "ANY"
          }
        }
      }),
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
        JSON.stringify({ error: "Failed to process document" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("Gemini response received:", JSON.stringify(data).substring(0, 500));

    // Extract the function call result from Google's response format
    const candidate = data.candidates?.[0];
    const content = candidate?.content;
    const functionCallPart = content?.parts?.find((part: any) => part.functionCall);
    
    if (!functionCallPart || functionCallPart.functionCall?.name !== "extract_financial_data") {
      console.error("No valid function call in response:", JSON.stringify(data));
      return new Response(
        JSON.stringify({ 
          error: "Could not extract data from document",
          extractedData: {},
          summary: "Unable to parse the document. Please ensure it's a clear image of a financial statement."
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Google returns args directly as an object, not as a JSON string
    const extractedData = functionCallPart.functionCall.args;
    console.log("Extracted data:", JSON.stringify(extractedData));

    return new Response(
      JSON.stringify({
        success: true,
        extractedData,
        summary: extractedData.summary || "Data extracted successfully",
        documentDate: extractedData.documentDate,
        institutionName: extractedData.institutionName,
        notes: extractedData.notes
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
