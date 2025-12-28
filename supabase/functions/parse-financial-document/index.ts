import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Build document-type-specific extraction guidance
function getDocumentTypeGuidance(documentType: string): string {
  const typeGuidance: Record<string, string> = {
    "bank statement": `
BANK STATEMENT EXTRACTION:
- Look for "Current Balance", "Available Balance", "Ending Balance" for account totals
- Identify if it's a Checking or Savings account from the account type or name
- Extract interest earned/paid during the statement period
- Look for digital wallet transfers (PayPal, Venmo, Zelle) as potential digital wallet balances
- Note the statement date and institution name from the header`,

    "brokerage statement": `
BROKERAGE STATEMENT EXTRACTION:
- Extract total portfolio/account value as passiveInvestmentsValue
- Look for individual stock positions and their market values
- Identify ETF and mutual fund holdings
- Extract dividend income received during the period
- Look for short-term trading activity for activeInvestments
- Note unrealized gains/losses in the summary`,

    "retirement statement": `
RETIREMENT ACCOUNT STATEMENT EXTRACTION:
- Identify account type: 401(k), Traditional IRA, Roth IRA, HSA, 403(b), 457
- For Roth IRA: Separate contributions (basis) from earnings if shown
- For 401(k): Look for "Vested Balance" specifically, note employer match separately
- Extract total account balance
- Note any distributions/withdrawals during the period`,

    "credit card statement": `
CREDIT CARD STATEMENT EXTRACTION:
- Extract the "Statement Balance", "Current Balance", or "Amount Due" as creditCardBalance
- IMPORTANT: Analyze ALL transactions to categorize monthly spending:
  * Insurance payments (health, auto, life, home, renters insurance)
  * Rent or mortgage payments
  * Utilities (electric, gas, water, internet, phone)
  * Groceries and food (supermarkets, grocery stores)
  * Transportation (gas stations, public transit, ride-sharing, car payments)
  * Subscriptions and recurring charges
- Sum up recurring monthly expenses to estimate monthlyLivingExpenses
- Sum up all insurance-related payments for insuranceExpenses
- Note payment due date and minimum payment`,

    "crypto statement": `
CRYPTOCURRENCY STATEMENT EXTRACTION:
- Extract total portfolio value
- Identify major holdings (Bitcoin, Ethereum) for cryptoCurrency
- Identify altcoins and trading positions for cryptoTrading
- Look for staked assets and staking rewards
- Identify liquidity pool positions
- Note any DeFi positions`,

    "financial statement": `
GENERAL FINANCIAL STATEMENT EXTRACTION:
- Extract all account balances visible
- Categorize by account type (checking, savings, investment, retirement)
- Look for any debt balances (credit cards, loans)
- Note interest earned or paid
- Identify the reporting period and institution`,

    "tax document": `
TAX DOCUMENT EXTRACTION:
- Look for W-2 income information
- Extract 1099 dividend and interest income
- Note any estimated tax payments made
- Identify retirement contributions (IRA, 401k)
- Look for property tax payments`,

    "insurance statement": `
INSURANCE STATEMENT EXTRACTION:
- Extract premium amounts (monthly or annual)
- Identify insurance type (health, auto, life, home, renters)
- Note payment frequency to calculate monthly cost
- Record as insuranceExpenses`,

    "utility bill": `
UTILITY BILL EXTRACTION:
- Extract the amount due as part of monthlyLivingExpenses
- Note the service type (electric, gas, water, internet, phone)
- Identify if it's a monthly recurring charge`,

    "mortgage statement": `
MORTGAGE STATEMENT EXTRACTION:
- Extract monthly payment amount for monthlyMortgage
- Note principal, interest, taxes, and insurance breakdown if shown
- Identify escrow payments for property tax`,

    "student loan statement": `
STUDENT LOAN STATEMENT EXTRACTION:
- Extract monthly payment amount
- Note total balance outstanding
- Identify amount due in next 12 months for studentLoansDue`,
  };

  return typeGuidance[documentType.toLowerCase()] || typeGuidance["financial statement"];
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

    const systemPrompt = `You are an expert financial document analyzer for Zakat (Islamic charitable giving) calculations. Your task is to extract ALL relevant financial data from documents accurately and comprehensively.

## EXTRACTION PRINCIPLES:
1. Be THOROUGH - extract every monetary value you can identify
2. Be PRECISE - use exact figures from the document, not estimates (unless estimating expenses)
3. Be CONSERVATIVE - when uncertain, note it in the summary rather than guessing
4. CATEGORIZE correctly - place values in the right fields based on their nature

## DOCUMENT TYPE DETECTED: ${documentType}
${documentGuidance}

## EXTRACTION CATEGORIES:

### ASSETS (Zakatable Wealth)

**Liquid Assets:**
- checkingAccounts: Checking account balances
- savingsAccounts: Savings account balances (including money market)
- cashOnHand: Physical cash mentioned
- digitalWallets: PayPal, Venmo, CashApp, Zelle balances
- foreignCurrency: Foreign currency holdings (convert to USD)
- interestEarned: Interest income (needed for purification calculations)

**Investments:**
- activeInvestments: Short-term trading positions, stocks held < 1 year
- passiveInvestmentsValue: Long-term holdings - stocks, ETFs, mutual funds, bonds
- dividends: Dividend income received during the period

**Retirement Accounts:**
- rothIRAContributions: Roth IRA contribution basis (original contributions)
- rothIRAEarnings: Roth IRA earnings/growth portion
- fourOhOneKVestedBalance: 401(k) VESTED balance only
- fourOhOneKUnvestedMatch: 401(k) unvested employer match (if shown)
- traditionalIRABalance: Traditional IRA total balance
- hsaBalance: Health Savings Account balance
- iraWithdrawals: IRA withdrawals during the year
- esaWithdrawals: Education Savings Account withdrawals
- fiveTwentyNineWithdrawals: 529 plan withdrawals

**Cryptocurrency:**
- cryptoCurrency: Bitcoin, Ethereum, major crypto holdings value
- cryptoTrading: Altcoins, trading positions value
- stakedAssets: Staked cryptocurrency value
- stakedRewardsVested: Vested staking rewards
- liquidityPoolValue: DeFi liquidity pool positions

**Precious Metals:**
- goldValue: Gold coins, bars, bullion (not jewelry worn)
- silverValue: Silver coins, bars, bullion

**Real Estate:**
- realEstateForSale: Properties held for sale (inventory)
- rentalPropertyIncome: Net rental income received

**Business:**
- businessCashAndReceivables: Business cash and accounts receivable
- businessInventory: Business inventory value

**Trusts:**
- revocableTrustValue: Revocable trust assets (you control)
- irrevocableTrustValue: Irrevocable trust value (if you have access)
- clatValue: Charitable Lead Annuity Trust value

**Other Assets:**
- illiquidAssetsValue: Art, collectibles, other valuable items
- livestockValue: Livestock holdings

**Debts Owed TO You:**
- goodDebtOwedToYou: Money others owe you (collectible)
- badDebtRecovered: Previously written-off debt you recovered

### LIABILITIES (Deductions)

**Monthly Expenses (estimate from spending patterns):**
- monthlyLivingExpenses: Estimated monthly essential expenses including:
  * Rent or housing costs
  * Utilities (electric, gas, water, internet, phone)
  * Groceries and essential food
  * Transportation (gas, public transit, car payments)
  * Essential subscriptions
  
- insuranceExpenses: Monthly insurance costs including:
  * Health insurance premiums
  * Auto insurance premiums
  * Life insurance premiums
  * Home/renters insurance premiums
  
- monthlyMortgage: Monthly mortgage/rent payment

**Debts:**
- creditCardBalance: Total credit card debt/statement balance
- unpaidBills: Outstanding utility or other bills
- studentLoansDue: Student loan payments due in next 12 months
- propertyTax: Property tax due/payable
- lateTaxPayments: Overdue tax payments

## OUTPUT INSTRUCTIONS:
- Return ONLY numeric values (no currency symbols, no commas)
- If a value is not found or not applicable, OMIT it (don't return 0)
- For credit card statements: Estimate monthlyLivingExpenses by analyzing recurring charges
- For credit card statements: Sum all insurance payments for insuranceExpenses
- Provide a clear summary of what was extracted
- Note the document date and institution name
- Add any important caveats or uncertainties in notes`;

    const userPrompt = `Please analyze this ${documentType} document and extract all financial data for Zakat calculation.

FOCUS AREAS:
1. Account balances and asset values
2. Income received (interest, dividends, rental)
3. Debts and liabilities
4. For credit card/bank statements: Analyze transactions to estimate monthly living expenses and insurance costs

Extract every relevant figure you can identify. Be thorough but accurate.`;

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

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`;

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
                description: "Extract and return structured financial data from the document for Zakat calculation",
                parameters: {
                  type: "object",
                  properties: {
                    // Liquid Assets
                    checkingAccounts: { type: "number", description: "Total checking account balance" },
                    savingsAccounts: { type: "number", description: "Total savings account balance including money market" },
                    cashOnHand: { type: "number", description: "Physical cash amount mentioned" },
                    digitalWallets: { type: "number", description: "PayPal, Venmo, CashApp, Zelle balances" },
                    foreignCurrency: { type: "number", description: "Foreign currency converted to USD" },
                    interestEarned: { type: "number", description: "Interest income earned (for purification)" },
                    
                    // Investments
                    activeInvestments: { type: "number", description: "Short-term trading positions value" },
                    passiveInvestmentsValue: { type: "number", description: "Long-term stock/ETF/mutual fund holdings value" },
                    dividends: { type: "number", description: "Dividend income received during period" },
                    
                    // Retirement
                    rothIRAContributions: { type: "number", description: "Roth IRA contribution basis" },
                    rothIRAEarnings: { type: "number", description: "Roth IRA earnings/growth" },
                    fourOhOneKVestedBalance: { type: "number", description: "401(k) vested balance only" },
                    fourOhOneKUnvestedMatch: { type: "number", description: "401(k) unvested employer match" },
                    traditionalIRABalance: { type: "number", description: "Traditional IRA total balance" },
                    hsaBalance: { type: "number", description: "HSA account balance" },
                    iraWithdrawals: { type: "number", description: "IRA withdrawals during year" },
                    esaWithdrawals: { type: "number", description: "ESA withdrawals during year" },
                    fiveTwentyNineWithdrawals: { type: "number", description: "529 plan withdrawals" },
                    
                    // Crypto
                    cryptoCurrency: { type: "number", description: "Bitcoin, Ethereum major crypto value" },
                    cryptoTrading: { type: "number", description: "Altcoins and trading positions value" },
                    stakedAssets: { type: "number", description: "Staked cryptocurrency value" },
                    stakedRewardsVested: { type: "number", description: "Vested staking rewards" },
                    liquidityPoolValue: { type: "number", description: "DeFi liquidity pool positions" },
                    
                    // Precious Metals
                    goldValue: { type: "number", description: "Gold bullion/coins value" },
                    silverValue: { type: "number", description: "Silver bullion/coins value" },
                    
                    // Real Estate
                    realEstateForSale: { type: "number", description: "Properties held for sale value" },
                    rentalPropertyIncome: { type: "number", description: "Net rental income received" },
                    
                    // Business
                    businessCashAndReceivables: { type: "number", description: "Business cash and receivables" },
                    businessInventory: { type: "number", description: "Business inventory value" },
                    
                    // Trusts
                    revocableTrustValue: { type: "number", description: "Revocable trust assets" },
                    irrevocableTrustValue: { type: "number", description: "Irrevocable trust value" },
                    clatValue: { type: "number", description: "CLAT value" },
                    
                    // Other Assets
                    illiquidAssetsValue: { type: "number", description: "Art, collectibles value" },
                    livestockValue: { type: "number", description: "Livestock value" },
                    
                    // Debts Owed To You
                    goodDebtOwedToYou: { type: "number", description: "Collectible debts owed to you" },
                    badDebtRecovered: { type: "number", description: "Recovered bad debt" },
                    
                    // Liabilities - Monthly Expenses
                    monthlyLivingExpenses: { type: "number", description: "Estimated monthly essential expenses (rent, utilities, groceries, transport)" },
                    insuranceExpenses: { type: "number", description: "Monthly insurance premiums (health, auto, life, home)" },
                    monthlyMortgage: { type: "number", description: "Monthly mortgage payment" },
                    
                    // Liabilities - Debts
                    creditCardBalance: { type: "number", description: "Total credit card statement balance" },
                    unpaidBills: { type: "number", description: "Outstanding unpaid bills" },
                    studentLoansDue: { type: "number", description: "Student loan payments due in next 12 months" },
                    propertyTax: { type: "number", description: "Property tax due" },
                    lateTaxPayments: { type: "number", description: "Overdue tax payments" },
                    
                    // Metadata
                    summary: { type: "string", description: "Brief summary of what was extracted from the document" },
                    documentDate: { type: "string", description: "Statement date or period covered" },
                    institutionName: { type: "string", description: "Bank, brokerage, or issuer name" },
                    notes: { type: "string", description: "Important caveats, uncertainties, or additional context" }
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
