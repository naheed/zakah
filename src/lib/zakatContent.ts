/**
 * Zakat Calculator Content Management
 * 
 * Content based on "The Jurisprudence of Wealth: A Comprehensive Treatise on 
 * Zakat Calculation for the Contemporary American Muslim" and Sheikh Joe Bradford's methodology.
 * 
 * This file centralizes all UI text content for consistency and easy updates.
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
    title: "Understanding the Niṣāb Threshold",
    content: `The niṣāb acts as the "poverty line in reverse"—it is the threshold of sufficiency. Wealth below this limit is exempt, while wealth above it triggers the Zakat obligation.

**Historical Basis:**
The Prophet Muhammad (ﷺ) set the niṣāb for gold at 20 mithqals (≈85 grams) and for silver at 200 dirhams (≈595 grams).

**The Modern Divergence:**
• **Gold Standard** (85g) ≈ $6,500–$7,000 USD — exempts more people
• **Silver Standard** (595g) ≈ $450–$550 USD — captures more Muslims in the obligation

**Scholarly Consensus:**
The majority of scholars, relief organizations, and researchers advocate for the **silver standard** for cash and mixed assets, based on:
• *Anfa' li'l-fuqarā'* — most beneficial for the poor
• *Aḥwaṭ* — the precautionary principle

The gold standard remains valid for those holding wealth exclusively in gold bullion.

**Calculation Mode Selection:**
On this page, you also choose how to treat complex assets like retirement accounts:
• **Conservative** — Pay on full asset values (safest)
• **Optimized** — Deduct taxes and penalties (accessible balance)
• **Bradford Exclusion** — Exempt Traditional 401(k)/IRA under 59½ (per Sheikh Joe Bradford's ruling on *milk tām*)`,
  },
  tips: [
    {
      title: "Why Silver is Recommended",
      content: "If one possesses wealth exceeding the silver niṣāb, they are undoubtedly wealthy enough to contribute. This ensures no eligible Zakat is missed.",
    },
    {
      title: "Choosing a Calculation Mode",
      content: "All three modes are valid scholarly positions. Conservative is safest, Optimized balances practicality, and Bradford Exclusion follows a specific fiqh ruling on ownership requirements.",
    },
  ],
};

export const hawlContent: StepContent = {
  questionNumber: 2,
  title: "Which calendar do you use?",
  subtitle: "This determines your Zakat rate based on the year length.",
  learnMore: {
    title: "Understanding the Ḥawl (Zakat Year)",
    content: `Zakat is an **annual obligation**, not a transaction tax. The asset must be held for one full year (ḥawl). The ḥawl starts when your assets first reached the niṣāb, or when you last paid Zakat.

**Lunar Year (Islamic Calendar):**
• 354 days long
• Traditional 2.5% rate
• Many Muslims align this with Ramadan for extra blessings

**Solar Year (Gregorian Calendar):**
• 365 days long
• Adjusted rate of 2.577%

**Why the Rate Difference?**
The solar year is 11 days longer. To prevent shortchanging Zakat recipients over a lifetime (33 solar years ≈ 34 lunar years), the rate is adjusted:

**2.5% × (365.25 ÷ 354.37) ≈ 2.577%**

This ensures your charity is precise regardless of which calendar you use.`,
  },
  tips: [
    {
      title: "Choosing Your Zakat Date",
      content: "Pick a date that's easy to remember—Ramadan, January 1st, or the anniversary of when you first exceeded the niṣāb. Consistency matters more than the specific date.",
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

**Individual Obligation:**
Each family member who owns wealth above niṣāb has their own Zakat obligation. A wife's jewelry, a child's custodial account—each is calculated separately.

**Paying on Behalf of Family:**
If you choose to pay Zakat on behalf of your family, **sum the total for each individual** in the following questions.

**Children's Assets:**
Custodial accounts (UTMA/UGMA), trusts in children's names, and any wealth owned by minors is subject to Zakat if above the niṣāb. A parent or guardian typically pays on their behalf.`,
  },
};

export const categoriesContent: StepContent = {
  questionNumber: 1,
  title: "What assets do you have?",
  subtitle: "Select all that apply to personalize your calculation.",
  learnMore: {
    title: "Personalizing Your Calculation",
    content: `We use **Progressive Disclosure**—showing simple options first, with advanced questions only when relevant to you.

**Always Asked:**
• Cash & Bank Accounts
• Stocks & Investments  
• Retirement Accounts

These are asked of everyone because most Americans have them.

**Optional Categories:**
The checkboxes below help us skip questions that don't apply to you. If you're unsure about a category, select it anyway—you can leave any question blank later.`,
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

**Privacy:** Your data stays on your device. We never share or sell your information.`,
  },
};

// =============================================================================
// ASSETS SECTION
// =============================================================================

export const liquidAssetsContent: StepContent = {
  questionNumber: 2,
  title: "What are your liquid assets?",
  subtitle: "Cash and money you can access immediately.",
  learnMore: {
    title: "Liquid Assets & The Fiat Economy",
    content: `The consensus among contemporary scholars is that **fiat currency (USD) takes the ruling of gold and silver** as a store of value. Therefore, the entire closing balance of all liquid accounts on your Zakat date is liable.

**What Counts:**
• **Checking & Savings Accounts** — Full balance is Zakatable
• **Cash on Hand** — Physical currency in your wallet or home
• **Digital Wallets** — PayPal, Venmo, CashApp, Zelle balances
• **Foreign Currency** — Convert to USD at today's spot rate (not purchase price)

**Interest (Riba) Separation:**
According to Islamic law, interest is not considered owned wealth—it is "impure" money that does not belong to you. You **cannot pay Zakat on interest, nor with interest**. This amount must be purified (donated to charity without reward expectation) and is tracked separately.`,
  },
  tips: [
    {
      title: "Interest Purification",
      content: "Year-to-date interest must be donated to general charity. It is not Zakat and carries no spiritual reward—it is simply returning impure money.",
    },
  ],
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
    title: "Stocks & The Mudir/Muḥtakir Distinction",
    content: `The treatment of stocks depends on your **intent and trading behavior**. Classical scholars distinguished between two types of investors:

**Mudir (Active Trader):**
If you buy stocks to sell short-term for capital gain (day trading, swing trading), the stock is **commercial merchandise** (ʿurūḍ al-tijārah). Zakat is due on **100% of market value**.

*Note: Unvested RSUs, ESPP, and restricted shares are NOT Zakatable—you lack milk tām (complete ownership).*

**Muḥtakir (Long-Term Investor):**
If shares are held for appreciation and dividends (buy and hold), Zakat shifts to the **company's Zakatable assets** (cash, receivables, inventory).

**The 30% Rule (AAOIFI Shariah Standard 35):**
Calculating precise Net Current Assets for hundreds of companies is impractical. AAOIFI's research shows the liquid/zakatable assets of Shariah-compliant companies average ~30% of market cap.

This proxy gives an effective rate of **0.75% of market value** (30% × 2.5%).

**Dividend Purification:**
If a company derives <5% revenue from impermissible sources (interest, alcohol, gambling), that portion of dividends must be donated to charity—separate from Zakat.`,
  },
  tips: [
    {
      title: "Which Category Are You?",
      content: "Mudir: trades frequently, holds < 1 year, intent is capital gain. Muḥtakir: buy-and-hold, holds > 1 year, intent is dividends/long-term growth.",
    },
    {
      title: "Conservative vs Optimized",
      content: "Conservative mode pays on 100% of passive investments. Optimized mode applies the 30% rule. Both are valid scholarly positions.",
    },
  ],
};

export const retirementContent: StepContent = {
  questionNumber: 8,
  title: "What retirement accounts do you have?",
  subtitle: "401(k), IRA, Roth, HSA, and other tax-advantaged accounts.",
  learnMore: {
    title: "Three Approaches to Retirement Account Zakat",
    content: `Retirement accounts present the most complex Zakat challenge due to access restrictions and deferred taxes. The debate centers on **Milk Tām** (complete ownership) and **Qudrah ʿala al-Taṣarruf** (ability to dispose).

**1. Conservative Mode:**
Pay Zakat on the **full vested balance**. This is the safest approach—if in doubt, pay more.

**2. Optimized Mode (AMJA Position):**
The funds ARE accessible—the penalty is a deterrent, not a prohibition. However, it's unjust to pay Zakat on money that belongs to the government.
• Start with **Vested Balance**
• Subtract 10% early withdrawal penalty (if under 59½)
• Subtract estimated federal + state taxes
• Result = Net Zakatable Value

**3. Bradford Exclusion Rule:**
Sheikh Joe Bradford argues that Traditional 401(k)/IRA accounts under age 59½ **lack milk tām entirely**:
• The 10% penalty + taxes create a legal barrier
• This resembles **māl ḍimār** (inaccessible wealth)
• Such accounts are fully **exempt** until age 59½

**Roth IRA (Dual Treatment):**
• **Contributions** — Accessible tax-free anytime → Fully Zakatable in ALL modes
• **Earnings** — Subject to penalty if under 59½ → Treated per your chosen mode

**HSA Accounts:** Fully accessible for medical expenses → Fully Zakatable.`,
  },
  tips: [
    {
      title: "Which Mode Should I Choose?",
      content: "Conservative if you want certainty. Optimized for practical balance. Bradford if you follow Sheikh Joe Bradford's fiqh reasoning on ownership requirements.",
    },
    {
      title: "401(k) Loans",
      content: "If you have taken a 401(k) loan, that money is now cash in hand (Zakatable). The loan is NOT a deductible liability—you owe it to yourself.",
    },
  ],
};

export const preciousMetalsContent: StepContent = {
  questionNumber: 9,
  title: "What precious metals do you own?",
  subtitle: "Gold, silver, and other precious metals.",
  learnMore: {
    title: "Gold, Silver & The Jewelry Debate",
    content: `Gold and silver have special significance—they were the original basis for the niṣāb measurement.

**What to Include:**
• Gold and silver bullion and coins
• Gold/silver in investment accounts
• Jewelry (see debate below)

**The Jewelry Controversy:**
• **Majority View (Shafi'i, Maliki, Hanbali):** Permissible jewelry worn regularly is exempt—treated like clothing
• **Hanafi View:** Gold and silver are inherently "growing wealth" (Nami). Zakat is due on the melt value.

**US Contextual Ruling (Bradford):**
Daily-wear jewelry may be exempt under the majority view. However, "excessive" amounts (heavy gold sets kept in safety deposit boxes, never worn) should follow the Hanafi view to avoid hoarding (Kanz).

**Valuation:**
If paying Zakat, value only the **melt value** (scrap value) of the metal content. Gemstones and craftsmanship are not Zakatable unless the jewelry is trade inventory.`,
  },
};

export const cryptoContent: StepContent = {
  questionNumber: 10,
  title: "What cryptocurrency do you own?",
  subtitle: "Bitcoin, Ethereum, staking, DeFi, and digital assets.",
  learnMore: {
    title: "Cryptocurrency & Digital Assets",
    content: `Cryptocurrency spans the line between **currency (thaman)** and **speculative trade goods (urud al-tijarah)**. The distinction is driven by usage and intent.

**Category A: Crypto as Currency**
Major cryptocurrencies (BTC, ETH) accepted as mediums of exchange are treated as currency. Zakat due on **100% of market value** at 2.5%.

**Category B: Crypto as Trade Goods**
Altcoins, tokens, or NFTs purchased primarily for flipping are commercial merchandise. **100% of market value** is Zakatable.

**Category C: Staking & DeFi**
• **Staking Principal** — You retain ownership; fully Zakatable
• **Staking Rewards** — Only vested/accessible rewards are Zakatable; locked rewards are exempt until possession
• **Liquidity Pools** — Zakat on the current redeemable value of underlying assets (account for impermanent loss)

**NFTs for Personal Use:**
NFTs kept as art/collectibles (not for sale) are generally exempt, similar to personal belongings.`,
  },
};

export const trustsContent: StepContent = {
  questionNumber: 11,
  title: "Do you have any trusts?",
  subtitle: "Revocable trusts, irrevocable trusts, and CLATs.",
  learnMore: {
    title: "Trusts & The Question of Ownership",
    content: `Trusts require analyzing who holds **Milk** (ownership)—specifically **Raqabah** (legal title) and **Yad** (ability to access).

**Revocable Living Trusts:**
The Grantor retains full control and can revoke at any time. The trust is merely a legal shell.
→ **Fully Zakatable** — treat assets as personal property.

**Irrevocable Trusts:**
The Grantor theoretically gives up ownership to a Trustee.
• If the Grantor CANNOT access principal → **NOT Zakatable** (lacks Milk Tam)
• If the Grantor CAN access principal → **Zakatable**

**Note:** Being a "Grantor Trust" for tax purposes doesn't mean you owe Zakat. Zakat is based on access and ownership, not tax liability.

**CLATs (Charitable Lead Annuity Trusts):**
A "Split-Interest" trust where charity receives annuity for a set term, then remaining assets go to heirs.
• **During the term:** No Zakat—charity owns the usufruct, heirs lack possession
• **After the term:** Heirs begin paying Zakat when assets transfer`,
  },
};

export const realEstateContent: StepContent = {
  questionNumber: 12,
  title: "Do you have investment real estate?",
  subtitle: "Property for sale or generating rental income.",
  learnMore: {
    title: "Real Estate Zakat Rules",
    content: `Real estate treatment depends entirely on **intent**.

**Primary Residence:**
Completely exempt. A home used for shelter is *qunya* (personal use).

**Investment Property (Rental):**
• The property value itself is **NOT Zakatable** (it's a productive asset, like business equipment)
• **Net rental income** remaining in your bank at year-end IS Zakatable

**Investment Property (Flipping):**
If purchased with express intent to sell for profit, it's *urud al-tijarah* (trade goods).
→ **Full market value** is Zakatable annually
If cash is tight, liquidate other assets to pay, or record as a debt to be paid upon sale.

**Vehicles:**
• Personal cars are exempt
• Uber/Lyft vehicles are exempt (tool of trade)—Zakat is due on the earnings (cash), not the car`,
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
• Inventory (goods for sale at current selling price)
• Raw materials intended for sale

**What's NOT Zakatable:**
• Fixed assets (equipment, furniture, vehicles used in business)
• Real estate used for business operations
• Goodwill and intangible assets

**Inventory Valuation:**
Value at **current selling price**, not cost. This follows the treatment of trade goods in classical fiqh.`,
  },
};

export const illiquidAssetsContent: StepContent = {
  questionNumber: 14,
  title: "Do you have illiquid assets for sale?",
  subtitle: "Art, collectibles, or livestock held for sale.",
  learnMore: {
    title: "Illiquid Assets & The Trade Goods Principle",
    content: `If you hold an asset **with the intention to sell for profit**, it's treated as trade goods and is Zakatable at market value.

**Examples of Zakatable Illiquid Assets:**
• Art or antiques held for investment/sale
• Collectibles (coins, stamps, memorabilia) for sale
• Livestock raised for sale

**Personal Use Exception:**
Items kept for personal enjoyment are NOT Zakatable:
• Art on your walls
• Your personal car
• Collectibles you're keeping

**The Nama' Requirement:**
Assets must have potential for growth to be Zakatable. Personal items lack Nama' and are exempt.`,
  },
};

export const debtOwedContent: StepContent = {
  questionNumber: 15,
  title: "Is anyone owing you money?",
  subtitle: "Personal loans you expect to collect.",
  learnMore: {
    title: "Receivables: Good Debt vs Bad Debt",
    content: `**Good Debt (Dayn Qawiyy):**
If the borrower is willing and able to pay, and you can collect at will, this debt is **like cash in your pocket**. Fully Zakatable annually.

**Bad Debt (Dayn Da'if):**
If the borrower is delinquent, bankrupt, or denying the debt, Zakat is NOT due until the money is actually received.

Once recovered, Zakat is paid for **one year only**, even if the debt was outstanding for ten years.

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
    title: "The Maliki Middle Path on Debt Deduction",
    content: `Debt deductibility is one of the most contentious issues in modern Zakat jurisprudence. The classical schools held opposing views:

**The Classical Extremes:**
• **Hanafi:** All debts fully deductible → A millionaire with a large mortgage pays $0 Zakat
• **Shāfiʿī:** Debt does not prevent Zakat at all → Even the heavily indebted must pay

**The Maliki Middle Path (Modern Synthesis):**
The Maliki position—adopted by AMJA and contemporary scholars—offers a balanced approach: only **immediate debts due within the Zakat period** are deductible.

This prevents *dayn al-mustaghriq* (overwhelming debt) from eliminating Zakat obligations entirely, while still providing relief for genuine short-term obligations.

**Deductible (Immediate Obligations):**
• Credit card balances (due in full)
• Unpaid bills (utility, medical) due immediately
• Next 12 months of mortgage/rent payments
• Current student loan payments due

**NOT Deductible (Future Obligations):**
• Remaining 29 years of mortgage principal
• Deferred student loans not yet due
• 401(k) loans (you owe it to yourself!)

This ensures the wealthy homeowner cannot escape Zakat through long-term leverage, while renters with modest savings are not unfairly burdened.`,
  },
  tips: [
    {
      title: "Why 12 Months?",
      content: "The 12-month rule for mortgages comes from AMJA guidance—it represents the immediate portion of a long-term obligation that affects your current liquidity.",
    },
  ],
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

**NOT Deductible:**
Estimated future tax liability is not deductible—only amounts actually due today.`,
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
