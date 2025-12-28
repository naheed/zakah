import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
    return `CREDIT CARD: Extract statement balance as creditCardBalance. Analyze transactions to estimate monthlyLivingExpenses (rent, utilities, groceries, transport) and insuranceExpenses (health, auto, life, home insurance payments).`;
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

LIABILITY FIELDS:
- monthlyLivingExpenses: Estimate monthly essentials (rent, utilities, groceries, transport) from spending patterns
- insuranceExpenses: Monthly insurance costs (health, auto, life, home)
- monthlyMortgage: Monthly mortgage payment
- creditCardBalance: Credit card statement balance
- unpaidBills: Outstanding bills
- studentLoansDue: Student loans due in 12 months
- propertyTax: Property tax due

RULES:
- Return numeric values only, no currency symbols
- Omit fields with no data found
- For credit cards: Analyze transactions to estimate monthly expenses
- Include summary, documentDate, institutionName, and notes`;

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

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
                    // Liquid Assets
                    checkingAccounts: { type: "number", description: "Checking account balance" },
                    savingsAccounts: { type: "number", description: "Savings account balance" },
                    cashOnHand: { type: "number", description: "Physical cash" },
                    digitalWallets: { type: "number", description: "Digital wallet balances" },
                    foreignCurrency: { type: "number", description: "Foreign currency in USD" },
                    interestEarned: { type: "number", description: "Interest income" },
                    
                    // Investments
                    activeInvestments: { type: "number", description: "Short-term trading value" },
                    passiveInvestmentsValue: { type: "number", description: "Long-term investments value" },
                    dividends: { type: "number", description: "Dividend income" },
                    
                    // Retirement
                    rothIRAContributions: { type: "number", description: "Roth IRA contributions" },
                    rothIRAEarnings: { type: "number", description: "Roth IRA earnings" },
                    fourOhOneKVestedBalance: { type: "number", description: "401k vested balance" },
                    fourOhOneKUnvestedMatch: { type: "number", description: "401k unvested match" },
                    traditionalIRABalance: { type: "number", description: "Traditional IRA balance" },
                    hsaBalance: { type: "number", description: "HSA balance" },
                    iraWithdrawals: { type: "number", description: "IRA withdrawals" },
                    esaWithdrawals: { type: "number", description: "ESA withdrawals" },
                    fiveTwentyNineWithdrawals: { type: "number", description: "529 withdrawals" },
                    
                    // Crypto
                    cryptoCurrency: { type: "number", description: "Major crypto value" },
                    cryptoTrading: { type: "number", description: "Altcoins value" },
                    stakedAssets: { type: "number", description: "Staked crypto" },
                    stakedRewardsVested: { type: "number", description: "Staking rewards" },
                    liquidityPoolValue: { type: "number", description: "Liquidity pools" },
                    
                    // Precious Metals
                    goldValue: { type: "number", description: "Gold value" },
                    silverValue: { type: "number", description: "Silver value" },
                    
                    // Real Estate
                    realEstateForSale: { type: "number", description: "Property for sale" },
                    rentalPropertyIncome: { type: "number", description: "Rental income" },
                    
                    // Business
                    businessCashAndReceivables: { type: "number", description: "Business cash" },
                    businessInventory: { type: "number", description: "Inventory value" },
                    
                    // Trusts
                    revocableTrustValue: { type: "number", description: "Revocable trust" },
                    irrevocableTrustValue: { type: "number", description: "Irrevocable trust" },
                    clatValue: { type: "number", description: "CLAT value" },
                    
                    // Other Assets
                    illiquidAssetsValue: { type: "number", description: "Illiquid assets" },
                    livestockValue: { type: "number", description: "Livestock" },
                    
                    // Debts Owed To You
                    goodDebtOwedToYou: { type: "number", description: "Collectible debt owed to you" },
                    badDebtRecovered: { type: "number", description: "Recovered bad debt" },
                    
                    // Liabilities
                    monthlyLivingExpenses: { type: "number", description: "Monthly essentials estimate" },
                    insuranceExpenses: { type: "number", description: "Monthly insurance costs" },
                    monthlyMortgage: { type: "number", description: "Monthly mortgage" },
                    creditCardBalance: { type: "number", description: "Credit card balance" },
                    unpaidBills: { type: "number", description: "Unpaid bills" },
                    studentLoansDue: { type: "number", description: "Student loans due" },
                    propertyTax: { type: "number", description: "Property tax due" },
                    lateTaxPayments: { type: "number", description: "Late tax payments" },
                    
                    // Metadata
                    summary: { type: "string", description: "Summary of extracted data" },
                    documentDate: { type: "string", description: "Statement date" },
                    institutionName: { type: "string", description: "Institution name" },
                    notes: { type: "string", description: "Important notes" }
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
