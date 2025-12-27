/**
 * Zakat Calculator Content Management
 * 
 * This file centralizes all UI text content for consistency and easy updates.
 * Content is organized by step with a consistent structure.
 */

export interface StepContent {
  questionNumber: number;
  title: string;
  subtitle: string;
  learnMore?: {
    title: string;
    content: string;
  };
  tips?: Array<{
    title?: string;
    content: string;
  }>;
}

export interface FieldContent {
  label: string;
  description?: string;
  placeholder?: string;
  learnMore?: {
    title: string;
    content: string;
  };
}

// =============================================================================
// INTRO SECTION
// =============================================================================

export const nisabContent: StepContent = {
  questionNumber: 1,
  title: "What is your Niṣāb standard?",
  subtitle: "This determines the minimum threshold for Zakat obligation.",
  learnMore: {
    title: "Understanding Niṣāb",
    content: `The niṣāb is the minimum liable amount that a Muslim must have to be obligated to pay Zakat. This amount was set by our Prophet Muhammad (ﷺ).

There are two standards:
• **Silver Standard (595g)** - Recommended for cash and mixed assets
• **Gold Standard (85g)** - Valid for those holding wealth exclusively in gold

The majority of scholars advocate for the silver standard based on:
• *Anfa' li'l-fuqara* (most beneficial for the poor)
• *Ahwat* (precautionary principle)

We will automatically let you know if you're under the niṣāb amount at the end of your calculation.`,
  },
  tips: [
    {
      title: "Why Silver is Recommended",
      content: "The silver standard captures more Muslims in the Zakat obligation, which benefits the poor and is the more cautious approach.",
    },
  ],
};

export const hawlContent: StepContent = {
  questionNumber: 2,
  title: "Which calendar do you use?",
  subtitle: "This determines your Zakat rate based on the year length.",
  learnMore: {
    title: "Understanding the Ḥawl (Zakat Year)",
    content: `The ḥawl is your Zakat Year—like a fiscal year used to calculate your Zakat. It starts when your assets first reached the minimum niṣāb, or when you last paid Zakat.

**Calendar Options:**
• **Lunar (Islamic)** - 354 days, 2.5% rate, traditional method
• **Solar (Gregorian)** - 365 days, 2.577% rate, adjusted for longer year

**Why the Rate Difference?**
The solar year is 11 days longer than the lunar year. To ensure Zakat recipients aren't shortchanged over a lifetime (33 solar years ≈ 34 lunar years), the rate is adjusted: 2.5% × (365.25/354.37) ≈ 2.577%`,
  },
  tips: [
    {
      title: "Choosing Your Zakat Date",
      content: "Many Muslims choose to pay Zakat during Ramadan for extra blessings, or on the anniversary of when they first exceeded the niṣāb. Pick a date that's easy to remember.",
    },
  ],
};

export const familyContent: StepContent = {
  questionNumber: 3,
  title: "Are you calculating for yourself or your family?",
  subtitle: "Zakat is an individual obligation, but you can pay on behalf of family.",
  learnMore: {
    title: "Family & Zakat Obligations",
    content: `Zakat is due by **any person who owns the wealth**, whether man, woman, or child, if they possess above the niṣāb.

**Paying on Behalf of Family:**
If you choose to pay Zakat on behalf of your family, sum the total for each individual in the following questions.

**Example:** If your spouse has $5,000 in savings and you have $10,000, enter $15,000 for savings accounts.

**Children's Assets:**
Custodial accounts or trusts in children's names are also subject to Zakat if above the niṣāb. A parent or guardian typically pays on their behalf.`,
  },
};

export const categoriesContent: StepContent = {
  questionNumber: 4,
  title: "Which of these apply to you?",
  subtitle: "Select all that apply to personalize your calculation.",
  learnMore: {
    title: "Why We Ask This",
    content: `We'll always ask about cash, investments, and retirement accounts since most people have these.

The optional categories help us skip questions that don't apply to you, making the process faster. If you're unsure about a category, select it anyway—you can skip any question later.`,
  },
};

export const emailContent: StepContent = {
  questionNumber: 5,
  title: "Where should we send your results?",
  subtitle: "Optional: Get a copy of your calculation.",
  learnMore: {
    title: "Why Provide Email?",
    content: `Your email lets us send you a receipt of your calculation so you can:
• Save this year's Zakat amount and date
• Reference it when making your payment
• Compare with future years

**Privacy:** Your data is kept private and secure. We never share or sell your information.`,
  },
};

// =============================================================================
// ASSETS SECTION
// =============================================================================

export const liquidAssetsContent: StepContent = {
  questionNumber: 6,
  title: "What are your liquid assets?",
  subtitle: "Cash and money you can access immediately.",
  learnMore: {
    title: "What Counts as Liquid Assets?",
    content: `Liquid assets are wealth you can access quickly without penalties:

• **Checking Accounts** - All checking account balances
• **Savings Accounts** - Exclude interest earned (handled separately)
• **Cash on Hand** - Physical cash in your wallet or home
• **Digital Wallets** - PayPal, Venmo, CashApp, Zelle balances
• **Foreign Currency** - Convert to USD at today's spot rate

**Interest (Riba) Note:**
Interest is not considered owned wealth in Islamic law. You cannot pay Zakat on interest or with interest. We track it separately for purification (donation to charity without reward expectation).`,
  },
};

export const liquidAssetsFields: Record<string, FieldContent> = {
  checkingAccounts: {
    label: "Checking Accounts",
    description: "Total balance across all checking accounts",
  },
  savingsAccounts: {
    label: "Savings Accounts",
    description: "Total balance (exclude interest earned)",
  },
  cashOnHand: {
    label: "Cash on Hand",
    description: "Physical cash in wallet or home",
  },
  digitalWallets: {
    label: "Digital Wallets",
    description: "PayPal, Venmo, CashApp, Zelle",
  },
  foreignCurrency: {
    label: "Foreign Currency",
    description: "Converted to USD at today's rate",
  },
  interestEarned: {
    label: "Interest Earned (For Purification)",
    description: "Total interest this year—not Zakatable, but must be donated",
  },
};

export const investmentsContent: StepContent = {
  questionNumber: 7,
  title: "What investments do you have?",
  subtitle: "Stocks, funds, and brokerage accounts.",
  learnMore: {
    title: "How Investments Are Treated",
    content: `**Active Investments (Trading):**
Stocks held short-term (<365 days) for trading are treated as trade goods. Zakat is due on 100% of market value. Unvested RSUs, ESPP, or restricted shares are NOT subject to Zakat.

**Passive Investments (Long-Term):**
For long-term holdings (>365 days), Zakat shifts to the company's Zakatable assets (cash, receivables, inventory). Research shows these average ~30% of market cap (AAOIFI Standard 35).

**Dividend Purification:**
If a company derives revenue from impermissible sources (interest, alcohol, gambling), that portion of dividends must be donated to charity. Example: $1.00 dividend with 3% non-halal income = donate $0.03.`,
  },
};

export const retirementContent: StepContent = {
  questionNumber: 8,
  title: "What retirement accounts do you have?",
  subtitle: "401(k), IRA, Roth, HSA, and other tax-advantaged accounts.",
  learnMore: {
    title: "Retirement Account Zakat Rules",
    content: `**Roth IRA:**
• Principal (contributions) - Always accessible, always Zakatable
• Earnings - If under 59½, treated like 401(k) with penalty consideration

**Traditional 401(k) & IRA:**
• Vested balance is Zakatable
• Conservative: Pay on gross amount
• Optimized: Deduct estimated taxes and early withdrawal penalties

**Unvested 401(k) Match:**
Employer match that hasn't vested is NOT Zakatable—you don't own it yet.

**HSA (Health Savings Account):**
Fully accessible for medical expenses, therefore fully Zakatable.

**529 & ESA:**
Education accounts are accessible with penalty, treated similarly to retirement accounts.`,
  },
};

export const preciousMetalsContent: StepContent = {
  questionNumber: 9,
  title: "What precious metals do you own?",
  subtitle: "Gold, silver, and other precious metals.",
  learnMore: {
    title: "Precious Metals & Zakat",
    content: `Gold and silver have special significance in Zakat as they were the original basis for the niṣāb measurement.

**What to Include:**
• Gold jewelry (even if worn regularly—scholarly debate exists, but majority says Zakatable)
• Silver jewelry and items
• Gold/silver bullion and coins
• Precious metals in investment accounts

**Valuation:**
Use today's market value for the metal content, not necessarily the retail purchase price.`,
  },
};

export const cryptoContent: StepContent = {
  questionNumber: 10,
  title: "What cryptocurrency do you own?",
  subtitle: "Bitcoin, Ethereum, staking, DeFi, and digital assets.",
  learnMore: {
    title: "Cryptocurrency Zakat Treatment",
    content: `**Bitcoin, Ethereum & Major Crypto:**
Treated as currency. Zakat due on 100% of value.

**Altcoins, Tokens & NFTs (Trading):**
If held for trading/flipping, treated as trade goods. 100% Zakatable.

**Staked Assets:**
• Principal - Fully Zakatable
• Rewards - Only vested/accessible rewards are Zakatable
• Locked/unvested rewards are NOT Zakatable

**Liquidity Pools:**
Current redeemable value is Zakatable.

**NFTs (Personal Use):**
NFTs kept as art/collectibles (not for sale) are generally NOT Zakatable, similar to personal belongings.`,
  },
};

export const trustsContent: StepContent = {
  questionNumber: 11,
  title: "Do you have any trusts?",
  subtitle: "Revocable trusts, irrevocable trusts, and CLATs.",
  learnMore: {
    title: "Trust Zakat Treatment",
    content: `**Revocable Trusts:**
You retain control and can revoke at any time. Fully Zakatable.

**Irrevocable Trusts:**
• If you can access the assets → Zakatable
• If you cannot access → NOT Zakatable (you don't own it)

**Charitable Lead Annuity Trusts (CLATs):**
During the annuity term, the assets are committed to charity. NOT Zakatable until the term ends and assets return to you.`,
  },
};

export const realEstateContent: StepContent = {
  questionNumber: 12,
  title: "Do you have investment real estate?",
  subtitle: "Property for sale or generating rental income.",
  learnMore: {
    title: "Real Estate Zakat Rules",
    content: `**Property for Sale (Flipping):**
If you purchased property with intent to sell for profit, it's treated as trade goods. Zakat due on full market value.

**Rental Properties:**
The property itself is NOT Zakatable (it's a productive asset). However, net rental income that accumulates in your bank account IS Zakatable.

**Primary Residence:**
Your home is NOT Zakatable—it's a personal necessity.

**Second Homes:**
Vacation homes for personal use are generally NOT Zakatable unless held for sale.`,
  },
};

export const businessContent: StepContent = {
  questionNumber: 13,
  title: "Do you own a business?",
  subtitle: "Business cash, inventory, and receivables.",
  learnMore: {
    title: "Business Zakat",
    content: `**What's Zakatable:**
• Cash and bank balances
• Accounts receivable (money owed to you)
• Inventory (goods for sale at current value)
• Raw materials intended for sale

**What's NOT Zakatable:**
• Fixed assets (equipment, furniture, vehicles used in business)
• Real estate used for business operations
• Goodwill and intangible assets

**Valuation:**
Inventory should be valued at current selling price, not cost.`,
  },
};

export const illiquidAssetsContent: StepContent = {
  questionNumber: 14,
  title: "Do you have illiquid assets for sale?",
  subtitle: "Art, collectibles, or livestock held for sale.",
  learnMore: {
    title: "Illiquid Assets & Zakat",
    content: `**Trade Goods Principle:**
If you hold an asset with the intention to sell for profit, it's treated as trade goods and is Zakatable at market value.

**Examples:**
• Art or antiques held for investment/sale
• Collectibles (coins, stamps, memorabilia) for sale
• Livestock raised for sale

**Personal Use Exception:**
Items kept for personal enjoyment (art on your walls, your personal car) are NOT Zakatable.`,
  },
};

export const debtOwedContent: StepContent = {
  questionNumber: 15,
  title: "Is anyone owing you money?",
  subtitle: "Personal loans you expect to collect.",
  learnMore: {
    title: "Debt Owed to You",
    content: `**Good Debt (Collectible):**
If the borrower is willing and able to repay, this debt is like cash to you. Fully Zakatable.

**Bad Debt (Doubtful):**
If the borrower is unwilling or unable to pay, it's NOT Zakatable until actually recovered. If recovered later, pay Zakat for that year.

**Forgiven Debt:**
If you forgive a debt as charity, it's no longer an asset and not Zakatable.`,
  },
};

// =============================================================================
// LIABILITIES SECTION
// =============================================================================

export const liabilitiesContent: StepContent = {
  questionNumber: 16,
  title: "What are your immediate expenses?",
  subtitle: "Debts and expenses that reduce your Zakatable amount.",
  learnMore: {
    title: "Deductible Liabilities",
    content: `**What Can Be Deducted:**
Only immediate debts (due now or within the year) are deductible:

• Monthly living expenses
• Mortgage payments (12 months deductible per AMJA)
• Insurance premiums due
• Credit card balances (full balance due)
• Unpaid bills
• Student loan payments due this year

**What Cannot Be Deducted:**
• Future mortgage payments beyond 12 months
• Future student loan payments
• Long-term debts not yet due`,
  },
};

export const taxContent: StepContent = {
  questionNumber: 17,
  title: "Do you have outstanding taxes?",
  subtitle: "Property taxes, late payments, or fines due.",
  learnMore: {
    title: "Tax Deductions",
    content: `**Deductible Taxes:**
• Property taxes due this year
• Late tax payments owed
• Tax fines or penalties due

These reduce your Zakatable wealth because they are immediate obligations.

**Not Deductible:**
Estimated future tax liability is not deductible—only amounts actually due.`,
  },
};

// =============================================================================
// RESULTS SECTION
// =============================================================================

export const resultsContent: StepContent = {
  questionNumber: 18,
  title: "Your Zakat Calculation",
  subtitle: "Based on your financial information.",
};
