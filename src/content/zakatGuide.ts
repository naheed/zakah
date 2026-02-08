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
  /** Methodology-specific intro shown immediately below header */
  introByMethodology?: {
    balanced?: {
      summary: string;
      deepLink?: string;
    };
    hanafi?: {
      summary: string;
      deepLink?: string;
    };
    shafii?: {
      summary: string;
      deepLink?: string;
    };
    maliki?: {
      summary: string;
      deepLink?: string;
    };
    hanbali?: {
      summary: string;
      deepLink?: string;
    };
  };
  /** Tips shown with the question. Use 'summary' for always-visible text, 'details' for expandable content */
  tips?: Array<{
    /** Short text always visible (required) */
    summary: string;
    /** Detailed explanation shown when expanded (optional) */
    details?: string;
    /** Fiqh source citation (optional) */
    source?: string;
    /** Visual variant: 'tip' (amber), 'info' (blue), 'warning' (orange) */
    variant?: 'tip' | 'info' | 'warning';
    /** @deprecated Use summary instead */
    title?: string;
    /** @deprecated Use summary/details instead */
    content?: string;
  }>;
  items?: Array<{
    id: string;
    label: string;
    description: string;
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

// [REPLACEMENT_1]
export const nisabContent: StepContent = {
  questionNumber: 1,
  title: "What is your Niṣāb standard?",
  subtitle: "This determines the minimum threshold for Zakat obligation.",
  introByMethodology: {
    balanced: {
      summary: "We recommend silver standard (~$550 USD) to ensure no eligible Zakat is missed. This follows the precautionary principle (aḥwaṭ) used by most relief organizations.",
      deepLink: "/methodology#nisab",
    },
    hanafi: {
      summary: "The Hanafi school uses silver standard for cash/mixed assets and gold standard for gold holdings only. This ensures Zakat benefits more recipients.",
      deepLink: "/methodology#nisab",
    },
    shafii: {
      summary: "Shafi'i view uses silver standard (~$550 USD) for all assets, maximizing charity following the majority scholarly opinion.",
      deepLink: "/methodology#nisab",
    },
    maliki: {
      summary: "Maliki view uses silver standard for most wealth. This lower threshold ensures more people fulfill their Zakat obligation.",
      deepLink: "/methodology#nisab",
    },
    hanbali: {
      summary: "Hanbali view uses silver standard (~595g ≈ $550). Ensures the obligation is met using the more conservative threshold.",
      deepLink: "/methodology#nisab",
    },
  },
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

The gold standard remains valid for those holding wealth exclusively in gold bullion.`,
  },
  // Tips removed: Redundant with Intro
  tips: [],
};

// [REPLACEMENT_2]
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
      summary: "Pick a date that's easy to remember—Ramadan, January 1st, or when you first exceeded niṣāb.",
      details: "Consistency matters more than the specific date. Many Muslims align Zakat with Ramadan for extra blessings.",
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
  items: [
    {
      id: 'hasPreciousMetals',
      label: 'Gold & Silver',
      description: 'e.g., jewelry, coins, bullion, bars',
    },
    {
      id: 'hasCrypto',
      label: 'Cryptocurrency',
      description: 'e.g., Bitcoin, Ethereum, staking rewards',
    },
    {
      id: 'hasTrusts',
      label: 'Trusts & Estates',
      description: 'e.g., revocable trust, family trust',
    },
    {
      id: 'hasRealEstate',
      label: 'Rental or Flip Property',
      description: 'e.g., rental income, property for sale',
    },
    {
      id: 'hasBusiness',
      label: 'Business Assets',
      description: 'e.g., inventory, receivables, business cash',
    },
    {
      id: 'hasIlliquidAssets',
      label: 'Collectibles for Sale',
      description: 'e.g., art, antiques, livestock to sell',
    },
    {
      id: 'hasDebtOwedToYou',
      label: 'Money Owed to You',
      description: 'e.g., personal loans you expect to collect',
    },
    {
      id: 'hasTaxPayments',
      label: 'Outstanding Taxes',
      description: 'e.g., property tax, late payments due',
    },
  ]
};

export const emailContent: StepContent = {
  questionNumber: 5,
  title: "Where should we send your results?",
  subtitle: "Optional: Get a copy of your calculation.",
  learnMore: {
    title: "Why Provide Email?",
    content: `Your email lets us send you a receipt of your calculation so you can:
• Save this year's Zakat amount and date
• Reference it when fulfilling your obligation
• Compare with future years

**Privacy:** Your data stays on your device. We never share or sell your information.`,
  },
};

export const liquidAssetsContent: StepContent = {
  questionNumber: 2,
  title: "What are your liquid assets?",
  subtitle: "Cash and money you can access immediately.",
  introByMethodology: {
    balanced: {
      summary: "All cash and bank balances are fully Zakatable. Interest earned is 'impure' money—donate it separately without counting as Zakat.",
      deepLink: "/methodology#liquid",
    },
    hanafi: {
      summary: "Fiat currency takes the ruling of gold/silver. Your entire closing balance is Zakatable. Interest must be purified and donated separately.",
      deepLink: "/methodology#liquid",
    },
    shafii: {
      summary: "Shafi'i view: All liquid assets are fully Zakatable. Interest is impure and must be donated separately to charity.",
      deepLink: "/methodology#liquid",
    },
    maliki: {
      summary: "Maliki view: Cash and equivalents are fully Zakatable. Interest (Riba) must be purified through charitable donation.",
      deepLink: "/methodology#liquid",
    },
    hanbali: {
      summary: "Hanbali view: All accessible cash is Zakatable. Interest earnings must be donated to charity (not as Zakat).",
      deepLink: "/methodology#liquid",
    },
  },
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
  // Tips removed: Redundant with Intro
  tips: [],
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

// [REPLACEMENT_4] - Investments: Mudir/Muhtakir & 30% Rule
export const investmentsContent: StepContent = {
  questionNumber: 7,
  title: "What investments do you have?",
  subtitle: "Stocks, funds, and brokerage accounts.",
  introByMethodology: {
    balanced: {
      summary: "Long-term investments use the 30% rule (effective 0.75% rate). Only company's liquid assets are Zakatable, not full market cap. Active traders pay on full value.",
      deepLink: "/methodology#investments",
    },
    hanafi: {
      summary: "All investments are valued at 100% market value. Unvested RSUs and stock options are exempt until they vest (you don't own them yet).",
      deepLink: "/methodology#investments",
    },
    shafii: {
      summary: "Shafi'i view: Zakat on 100% of market value for all investments. The company's assets are valued through your share ownership.",
      deepLink: "/methodology#investments",
    },
    maliki: {
      summary: "Maliki view: Active trading (Mudir) = annual 100% valuation. Long-term (Muhtakir) = Zakat on underlying assets or upon sale.",
      deepLink: "/methodology#investments",
    },
    hanbali: {
      summary: "Hanbali view: Stocks are Zakatable at 100% market value. Intent (Niyyah) is key—trade stocks vs. investment stocks.",
      deepLink: "/methodology#investments",
    },
  },
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
  // Tips removed: Redundant with Intro
  tips: [],
};

// [RESTORED_MIDDLE_ASSETS]
export const retirementContent: StepContent = {
  questionNumber: 8,
  title: "What retirement accounts do you have?",
  subtitle: "401(k), IRA, Roth, HSA, and other tax-advantaged accounts.",
  introByMethodology: {
    balanced: {
      summary: "Traditional 401(k)/IRA under 59½ are exempt—early withdrawal penalties make them inaccessible wealth (māl ḍimār). Roth contributions are Zakatable since they're accessible.",
      deepLink: "/methodology#retirement",
    },
    hanafi: {
      summary: "The Hanafi school views retirement accounts as Zakatable on the net accessible amount. Zakat is due on what you could withdraw today (balance minus taxes and penalties).",
      deepLink: "/methodology#retirement",
    },
    shafii: {
      summary: "Shafi'i view: Zakat is due on the net accessible amount (balance minus taxes/penalties). Ownership exists despite restrictions.",
      deepLink: "/methodology#retirement",
    },
    maliki: {
      summary: "Maliki view: Retirement assets are Zakatable on the net accessible amount. The Muhtakir principle may apply to deferred accounts.",
      deepLink: "/methodology#retirement",
    },
    hanbali: {
      summary: "Hanbali view: Wealth is owned once vested. Calculate Zakat on net accessible value (after tax/penalty deductions).",
      deepLink: "/methodology#retirement",
    },
  },
  learnMore: {
    title: "Retirement Accounts & Complete Ownership",
    content: `Retirement accounts present a unique Zakat challenge due to access restrictions and deferred taxes. The key principle is **Milk Tām** (complete ownership).

**Our Approach (Bradford Methodology):**
Sheikh Joe Bradford argues that Traditional 401(k)/IRA accounts under age 59½ **lack milk tām**:
• The 10% penalty + taxes create a legal barrier to access
• This resembles **māl ḍimār** (inaccessible wealth)
• Such accounts are **exempt** until age 59½

**Roth IRA (Dual Treatment):**
• **Contributions** — Accessible tax-free anytime → Fully Zakatable
• **Earnings** — Subject to penalty if under 59½ → Exempt until 59½

**HSA Accounts:** Fully accessible for medical expenses → Fully Zakatable.

**After Age 59½:** All retirement accounts become fully accessible and are Zakatable at 100% of value.`,
  },
  tips: [
    {
      summary: "401(k) loan? That money is now cash in hand and Zakatable. The loan is NOT deductible—you owe it to yourself.",
      variant: "warning",
    },
  ],
};

export const preciousMetalsContent: StepContent = {
  questionNumber: 9,
  title: "What precious metals do you own?",
  subtitle: "Gold, silver, and other precious metals.",
  introByMethodology: {
    balanced: {
      summary: "Investment bullion is always Zakatable at melt value. Personal jewelry follows the precautionary (Ahwat) approach—enter it separately and we'll include it to be safe.",
      deepLink: "/methodology#metals",
    },
    hanafi: {
      summary: "Hanafi view: All gold and silver is Zakatable at melt value—both investment bullion AND personal jewelry. Gold/silver are inherently 'growing wealth' (Nāmī) regardless of form.",
      deepLink: "/methodology#metals",
    },
    shafii: {
      summary: "Shafi'i view: Investment bullion is Zakatable. Personal jewelry for permissible adornment is EXEMPT—unless excessive (beyond local custom/'urf) or held for hoarding.",
      deepLink: "/methodology#metals",
    },
    maliki: {
      summary: "Maliki view: Investment bullion is Zakatable. Personal jewelry for adornment is EXEMPT. 'Excessive' jewelry (Isrāf) or investment jewelry is Zakatable.",
      deepLink: "/methodology#metals",
    },
    hanbali: {
      summary: "Hanbali view: Investment bullion is Zakatable. Personal jewelry for permissible use is EXEMPT. Jewelry held for investment or hoarding (Kanz) is Zakatable.",
      deepLink: "/methodology#metals",
    },
  },
  learnMore: {
    title: "Gold, Silver & The Jewelry Debate",
    content: `Gold and silver have special significance—they were the original basis for the niṣāb measurement.

**What to Include:**
• Gold and silver bullion and coins (Always Zakatable)
• Gold/silver in investment accounts
• Excessive or Hoarded Jewelry (see below)

**The Jewelry Controversy:**
• **Majority View (Shafi'i, Maliki, Hanbali):** Jewelry is **exempt** if it is for:
  1. Personal adornment (permissible usage)
  2. Not excessive in amount (defined by custom/'urf')
  3. Not held for investment/hoarding
• **Hanafi View:** Gold and silver are inherently "growing wealth" (Nami). Zakat is due on the melt value regardless of usage.

**US Contextual Ruling (Bradford):**
Standard, daily-wear jewelry is exempt (Majority view). However, **excessive amounts** (e.g., heavy gold sets kept in safes, never worn) or jewelry held as a store of value should follow the Hanafi view to avoid hoarding (Kanz).

**How to Enter:**
• **Investment Gold:** Enter coins, bars, and **excessive/investment jewelry** here to ensure Zakat is calculated.
• **Jewelry Gold:** Enter strictly personal, wearable jewelry here. The calculator will exempt this for Balanced/Shafi'i modes.

**Valuation:**
Value only the **melt value** (scrap value) of the metal content. Gemstones and craftsmanship are not Zakatable.`,
  },
  tips: [
    {
      summary: "If your jewelry is 'excessive' (beyond custom) or held for investment, enter it as Investment Gold.",
      details: "The exemption only applies to customary personal adornment. Hoarded wealth disguised as jewelry is Zakatable (Shafi'i/Maliki/Hanbali).",
      source: "Reliance of the Traveller f1.3 / Mukhtasar Khalil",
      variant: "warning",
    },
  ],
};

export const cryptoContent: StepContent = {
  questionNumber: 10,
  title: "What cryptocurrency do you own?",
  subtitle: "Bitcoin, Ethereum, staking, DeFi, and digital assets.",
  introByMethodology: {
    balanced: {
      summary: "We distinguish between 'Currency' coins (BTC/ETH) and 'Utility' tokens. Zakat is due on the market value of currency-like assets and trade positions.",
      deepLink: "/methodology#crypto",
    },
    hanafi: {
      summary: "Any crypto asset with market value that can be exchanged is generally considered 'Māl' (wealth) and is Zakatable at market value.",
      deepLink: "/methodology#crypto",
    },
    shafii: {
      summary: "Shafi'i view: Crypto is analogous to currency (thaman) or trade goods. Market value on your Zakat date is fully Zakatable.",
      deepLink: "/methodology#crypto",
    },
    maliki: {
      summary: "Maliki view: Crypto for trading is Mudir treatment (annual valuation). Long-term holds may follow Muhtakir rules (Zakat upon sale).",
      deepLink: "/methodology#crypto",
    },
    hanbali: {
      summary: "Hanbali view: Crypto is treated as trade goods if held for profit. Full market value is Zakatable. Staking rewards are Zakatable when vested.",
      deepLink: "/methodology#crypto",
    },
  },
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
  introByMethodology: {
    balanced: {
      summary: "Revocable trusts are fully Zakatable (you own the assets). Irrevocable trusts are only Zakatable if you have access to the principal.",
      deepLink: "/methodology#trusts",
    },
    hanafi: {
      summary: "Ownership (Milk) is the key. If you control the trust assets, Zakat is due. If ownership is transferred completely to beneficiaries, they pay Zakat.",
      deepLink: "/methodology#trusts",
    },
    shafii: {
      summary: "Shafi'i view: Zakat follows ownership. If the trust assets are technically yours to access/revoke, Zakat is mandatory on them.",
      deepLink: "/methodology#trusts",
    },
    maliki: {
      summary: "Maliki view: Ownership (Milk) determines Zakat. Grantor trusts where you retain control are Zakatable.",
      deepLink: "/methodology#trusts",
    },
    hanbali: {
      summary: "Hanbali view: Emphasis on Niyyah (intent). If you can access/dispose of trust assets, they are Zakatable.",
      deepLink: "/methodology#trusts",
    },
  },
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
  introByMethodology: {
    balanced: {
      summary: "Rental properties: Pay Zakat on net rental income, not property value. Flipping properties: Pay Zakat on full market value (trade goods).",
      deepLink: "/methodology#realestate",
    },
    hanafi: {
      summary: "Hanafi view: Rental property itself is exempt (productive asset). Only the accumulated rental income is Zakatable.",
      deepLink: "/methodology#realestate",
    },
    shafii: {
      summary: "Shafi'i/Majority view: No Zakat on the value of rental property. Zakat is only due on the rental income designated for savings.",
      deepLink: "/methodology#realestate",
    },
  },
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
  introByMethodology: {
    balanced: {
      summary: "Zakat is due on current assets (Cash + Inventory + Receivables) minus short-term liabilities. Fixed assets (machines, furniture) are exempt.",
      deepLink: "/methodology#business",
    },
    hanafi: {
      summary: "Trade goods (Urud al-Tijarah) are Zakatable at current market value. Raw materials and finished goods are included; equipment is exempt.",
      deepLink: "/methodology#business",
    },
    shafii: {
      summary: "Business assets held for trade are Zakatable. Calculate: (Liquid Assets + Inventory) - Immediate Debts.",
      deepLink: "/methodology#business",
    },
  },
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
  introByMethodology: {
    balanced: {
      summary: "Assets held for sale are trade goods—Zakatable at current market value. Items kept for personal enjoyment are exempt.",
      deepLink: "/methodology#business",
    },
    hanafi: {
      summary: "Hanafi view: Trade goods (ʿurūḍ al-tijārah) are Zakatable at year-end market value. Personal collectibles are exempt.",
      deepLink: "/methodology#business",
    },
    shafii: {
      summary: "Shafi'i view: Trade goods are Zakatable annually at market value. Personal use items (qunya) are exempt.",
      deepLink: "/methodology#business",
    },
    maliki: {
      summary: "Maliki view: If you actively trade (Mudir), pay annually. If you hold for appreciation (Muhtakir), Zakat is due only upon sale.",
      deepLink: "/methodology#business",
    },
    hanbali: {
      summary: "Hanbali view: Trade goods are Zakatable at year-end market value. Intent to sell is key—changing intent to personal use breaks the cycle.",
      deepLink: "/methodology#business",
    },
  },
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
  title: "Do others owe you money?",
  subtitle: "Personal loans you gave to others that you expect to collect.",
  introByMethodology: {
    balanced: {
      summary: "Good debt (collectible) is Zakatable annually. Bad debt (unlikely to be collected) is only Zakatable when actually recovered—for one year only.",
      deepLink: "/methodology#debts",
    },
    hanafi: {
      summary: "Hanafi view: Good debt is Zakatable annually. Bad debt is Zakatable when recovered, but you must pay for all past years it was owed.",
      deepLink: "/methodology#debts",
    },
    shafii: {
      summary: "Shafi'i view: Good debt is Zakatable annually. Bad debt is Zakatable when recovered, for one year only (not retroactive).",
      deepLink: "/methodology#debts",
    },
    maliki: {
      summary: "Maliki view: Good debt is Zakatable annually. Bad debt is Zakatable when recovered, for one year only—same as Shafi'i.",
      deepLink: "/methodology#debts",
    },
    hanbali: {
      summary: "Hanbali view: Good debt is Zakatable annually. Bad debt follows the one-year-upon-recovery rule.",
      deepLink: "/methodology#debts",
    },
  },
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

// [REPLACEMENT_6] - Liabilities (Deductible logic)
export const liabilitiesContent: StepContent = {
  questionNumber: 16,
  title: "What are your immediate expenses?",
  subtitle: "Debts and expenses that reduce your Zakatable amount.",
  introByMethodology: {
    balanced: {
      summary: "Only immediate debts due within 12 months are deductible. Long-term mortgage principal and deferred loans don't reduce your Zakatable wealth.",
      deepLink: "/methodology#debts",
    },
    hanafi: {
      summary: "Hanafi view: All debts are fully deductible from Zakatable wealth. Include mortgage principal, student loans, and all outstanding obligations.",
      deepLink: "/methodology#debts",
    },
    shafii: {
      summary: "Shafi'i view: Debts do NOT reduce your Zakatable wealth. Zakat is attached to the asset itself, not your net worth.",
      deepLink: "/methodology#debts",
    },
    maliki: {
      summary: "Maliki view: Only immediate debts (12 months) are deductible—and only if you lack fixed assets to cover them.",
      deepLink: "/methodology#debts",
    },
    hanbali: {
      summary: "Hanbali view: Debts are fully deductible from Zakatable wealth (similar to Hanafi). Pay Zakat on net wealth.",
      deepLink: "/methodology#debts",
    },
  },
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
  // Tips removed: Redundant with Intro
  tips: [],
};

// [REPLACEMENT_7] - Tax Content
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
  title: "Your Zakat Obligation",
  subtitle: "Based on your financial information.",
};
