/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */


import { Gavel, Scales, Calendar, Wallet, TrendUp, ShieldCheck, CurrencyBtc, Coins, Buildings, Storefront, HandCoins, Users, ListNumbers, Table, BookOpen, Warning } from "@phosphor-icons/react";

export const header = {
    title: "Methodology & References",
    intro: "Zakat rules are derived from the four Sunni schools of jurisprudence (Madhabs) and contemporary research. ZakatFlow empowers you to select the methodology that best aligns with your understanding, backed by clear evidence.",
    primaryInfluences: "Influenced by the works of Sheikh Joe Bradford and AAOIFI Shariah Standards. Our 'Sheikh Joe Bradford' mode follows his published methodology.",
    scholarsNote: "Note: AMJA (Assembly of Muslim Jurists of America) has distinct positions on retirement accounts. Their fatwa requires Zakat on the net withdrawable amount annually—differing from Sheikh Bradford's exemption for those under 59½. We plan to add AMJA as a separate option in a future update."
};
export const principles = {
    id: "principles",
    number: 1,
    title: "Core Legal Principles",
    icon: Gavel,
    intro: "Islamic jurisprudence establishes specific conditions that must be met for wealth to be subject to Zakat. Understanding these principles is essential for correctly applying Zakat rules to modern financial instruments.",
    conditionsTitle: "The Five Conditions for Zakatable Wealth",
    conditions: [
        {
            number: 1,
            title: "Milk Tām (Complete Ownership)",
            description: "You must have both legal title (raqabah) and beneficial use (yad). Wealth that you legally own but cannot access or control lacks complete ownership.",
            example: "Example: Unvested 401(k) employer match—you don't own it yet until vesting occurs."
        },
        {
            number: 2,
            title: "Qudrah 'ala al-Tasarruf (Ability to Dispose)",
            description: "You must have the practical ability to access and use the wealth. Legal barriers, severe penalties, or restrictions that prevent reasonable access may negate this condition.",
            example: "Example: This is the key principle behind the Bradford Exclusion Rule for retirement accounts."
        },
        {
            number: 3,
            title: "Nāmī (Growth Potential)",
            description: "The asset must have inherent potential for growth or productivity. Cash, investments, and trade goods are nāmī by nature. Personal items like clothing and furniture are not.",
            example: "Example: Gold is considered nāmī even when held as jewelry (Hanafi view) because it retains monetary nature."
        },
        {
            number: 4,
            title: "Above the Niṣāb Threshold",
            description: "Total Zakatable wealth must exceed the minimum threshold (niṣāb) of either 85 grams of gold or 595 grams of silver equivalent."
        },
        {
            number: 5,
            title: "Ḥawl (One Year Passage)",
            description: "The wealth must be held above niṣāb for one complete lunar year (354 days) or solar year (365 days with adjusted rate)."
        }
    ],
    malDimar: {
        title: "Special Classification: Māl Ḍimār",
        description: "Māl Ḍimār refers to wealth that is inaccessible, at risk, or uncertain. Classical examples include money held by a debtor who may not repay, or wealth in a distant land with no means of access.",
        modern: "Modern applications include: disputed funds in litigation, frozen accounts, and—under the Bradford interpretation—retirement accounts with significant access barriers for those under 59½."
    },
    intent: {
        title: "Intent (Nawā) in Asset Classification",
        description: "Your intention when acquiring an asset determines its Zakat treatment:",
        list: [
            { label: "Trade (Tijārah)", text: "Assets held for resale are ʿurūḍ al-tijārah—100% of market value is Zakatable" },
            { label: "Personal Use (Qunya)", text: "Items for personal use (home, car, clothing) are exempt from Zakat" },
            { label: "Investment (Istithmār)", text: "Passive investments may follow the 30% rule for underlying Zakatable assets" }
        ]
    }
};
export const madhahSchools = {
    id: "madhabs",
    number: 1.5,
    title: "Schools of Thought (Madhabs)",
    icon: Gavel,
    intro: "ZakatFlow supports the four major Sunni schools of jurisprudence plus a specialized modern methodology. Your selection determines how specific assets like jewelry, retirement accounts, and debts are treated.",
    overview: {
        title: "Supported Methodologies",
        text: "You can toggle between these modes at any time to see how they impact your calculation.",
        note: "The 'Sheikh Joe Bradford' mode is the default, offering a contemporary synthesis of fiqh suited for modern financial assets."
    },
    jewelryRuling: {
        title: "Zakat on Personal Jewelry",
        intro: "One of the most significant differences between schools concerns gold and silver jewelry worn for personal adornment:",
        schools: [
            {
                name: "Hanafi",
                ruling: "Zakatable",
                text: "Gold and silver are inherently 'growing wealth' (nāmī). Even worn jewelry is Zakatable on its melt value if it meets the nisab.",
                evidence: "Hadith: 'There is no gold or silver whose owner does not pay its due except that on the Day of Resurrection, plates of fire will be heated...' (Sahih Muslim 987)"
            },
            {
                name: "Shafi'i, Maliki, Hanbali",
                ruling: "Exempt",
                text: "Jewelry worn for permissible personal adornment is exempt from Zakat (qunya), similar to clothing.",
                evidence: "Based on the practice of Aisha (RA) and other companions who did not pay Zakat on jewelry used for adornment."
            },
            {
                name: "Bradford",
                ruling: "Zakatable",
                text: "Advises the precautionary approach (Ahwat): Gold and silver are Zakatable regardless of use. This aligns with the Hanafi view and avoids the risk of underpaying.",
                evidence: "Prefers the 'safer' opinion to ensure the obligation is definitely discharged. Dr. Yusuf Al-Qaradawi also considers paying on worn jewelry 'better and safer' (Ahwat) although he acknowledges the validity of the exemption."
            }
        ],
        zakatFlowApproach: "If you select Hanafi mode, jewelry is included. In all other modes, personal jewelry is exempt."
    },
    debtRuling: {
        title: "Debt Deduction",
        intro: "The schools differ on whether personal debts reduce your Zakatable wealth:",
        schools: [
            {
                name: "Hanafi",
                ruling: "Full Deduction",
                text: "Debts payable are fully deductible from Zakatable assets.",
                evidence: "Zakat is due on 'net' wealth."
            },
            {
                name: "Maliki",
                ruling: "12-month limit",
                text: "Only immediate debt obligations (due within the coming year) are deductible.",
                evidence: "Distinction between immediate and long-term liabilities."
            },
            {
                name: "Shafi'i",
                ruling: "No Deduction",
                text: "Debts do not prevent Zakat obligation. You pay on what you possess.",
                evidence: "Ownership is established regardless of debt."
            },
            {
                name: "Hanbali",
                ruling: "Full Deduction",
                text: "Similar to Hanafi, debts are deductible.",
                evidence: "Settling debts takes precedence."
            }
        ],
        zakatFlowApproach: "ZakatFlow applies the Maliki/Bradford standard (12-month deduction) for the Sheikh Joe Bradford mode. The Shafi'i position—that debt does not reduce Zakatable wealth—is implemented separately. Imam Al-Nawawi (Shafi'i school) argues that Zakat is a right attached to the specific asset, not a personal liability, so debts owed to others do not diminish it."
    },
    practicalGuidance: {
        title: "Choosing Your Mode",
        points: [
            "Bradford: Best for most users. Balanced, modern approach.",
            "Hanafi: Select if you follow the Hanafi school (includes jewelry).",
            "Maliki/Shafi'i: Select if you adhere to these schools (jewelry exempt).",
            "Hanbali: Select if you adhere to the Hanbali school."
        ]
    },
    references: [
        "Fiqh al-Zakah by Dr. Yusuf al-Qaradawi",
        "Al-Mughni by Ibn Qudamah",
        "AMJA Fatwas",
        "Joe Bradford's Zakat Guide"
    ]
};
export const nisab = {
    id: "nisab",
    number: 2,
    title: "The Niṣāb Threshold",
    icon: Scales,
    intro: "The niṣāb is the minimum amount of wealth a Muslim must possess before Zakat becomes obligatory. It acts as the \"poverty line in reverse\"—wealth below this limit is exempt, while wealth at or above it triggers the Zakat obligation.",
    historical: {
        title: "Historical Foundation",
        intro: "The Prophet Muhammad (ﷺ) established two niṣāb measurements:",
        items: [
            { label: "Gold", text: "20 mithqals, equivalent to approximately 85 grams (≈3 ounces)" },
            { label: "Silver", text: "200 dirhams, equivalent to approximately 595 grams (≈21 ounces)" }
        ],
        note: "In the Prophet's time, these two amounts were roughly equivalent in purchasing power. Today, due to the divergence between gold and silver prices, they represent vastly different thresholds."
    },
    divergence: {
        title: "The Modern Divergence",
        items: [
            { label: "Gold Standard (85g)", text: "Approximately $6,500–$8,000 USD. Higher threshold, exempts more people." },
            { label: "Silver Standard (595g)", text: "Approximately $450–$600 USD. Lower threshold, safer for the poor." }
        ]
    },
    consensus: {
        title: "Widely Accepted View",
        text: "Many contemporary scholars advocate for the silver standard for cash and liquid assets to maximize benefit for the poor (anfa' li'l-fuqara), though the gold standard remains a valid opinion for higher thresholds.",
        principles: [
            { label: "Anfa' li'l-fuqara", text: "Most beneficial for the poor." },
            { label: "Ahwat", text: "Precautionary principle." }
        ],
        note: "ZakatFlow uses the Silver Standard by default."
    },
    guidance: "If you possess wealth exceeding the silver niṣāb, you are considered wealthy enough to contribute."
};
export const hawl = {
    id: "hawl",
    number: 3,
    title: "The Ḥawl (Zakat Year)",
    icon: Calendar,
    intro: "Zakat is an annual obligation. Wealth must be held for one complete lunar year (ḥawl).",
    lunarSolar: {
        title: "Lunar vs. Solar Year",
        lunar: {
            title: "Lunar Year (Hijri)",
            points: ["354 days", "Rate: 2.5%", "Traditional method"]
        },
        solar: {
            title: "Solar Year (Gregorian)",
            points: ["365 days", "Rate: 2.577%", "Adjusted to equal lunar amount over time"]
        }
    },
    rateAdjustment: {
        title: "Why 2.577%?",
        text: "Since the solar year is 11 days longer, the rate is adjusted proportionally so the total Zakat paid over a lifetime is identical.",
        formula: "2.5% × (365.25 ÷ 354.37) ≈ 2.577%"
    },
    dateChoice: {
        title: "Choosing Your Date",
        intro: "Select a consistent date each year, such as:",
        options: [
            "1st of Ramadan",
            "January 1st",
            "Anniversary of reaching Nisab"
        ],
        note: "Consistency is key."
    }
};
export const liquid = {
    id: "liquid",
    number: 4,
    title: "Liquid Assets & Cash",
    icon: Wallet,
    intro: "Fiat currency takes the ruling of gold/silver. The entire closing balance of all liquid accounts on your Zakat date is liable.",
    assets: {
        title: "Zakatable Assets",
        list: [
            { label: "Checking/Savings", text: "Full balance is Zakatable" },
            { label: "Cash on Hand", text: "Physical currency" },
            { label: "Digital Wallets", text: "Venmo, PayPal, Crypto balances" },
            { label: "Foreign Currency", text: "Converted to local currency value" }
        ]
    },
    interest: {
        title: "Interest (Riba)",
        text1: "Interest is impure and not owned. It must be donated to charity (purified) and is not subject to Zakat.",
        text2: "Exclude interest from your Zakat calculation."
    }
};
export const stocks = {
    id: "stocks",
    number: 5,
    title: "Stocks & Investments",
    icon: TrendUp,
    intro: "Treatment depends on intent (trade vs. hold), ownership status (vested vs. unvested), and methodology (30% proxy vs. 100% market value).",
    mudir: {
        title: "Active Trading (Mudir)",
        text: "Stocks bought for short-term capital gain (day trading, swing trading).",
        calculation: "Zakatable at 100% of market value."
    },
    muhtakir: {
        title: "Passive Holding (Muhtakir)",
        text: "Stocks held for long-term growth and dividends. Zakat shifts to the company's underlying zakatable assets."
    },
    rule30: {
        title: "The 30% Rule (Bradford Mode)",
        standard: "AAOIFI Shariah Standard 35",
        description: "For passive investments, Zakat is due only on the underlying zakatable assets of the company (cash, receivables, inventory). Research shows this averages ~30% of market cap for Shariah-compliant companies.",
        formula: "Market Value × 30% Proxy × 2.5% Rate = 0.75% effective rate",
        effectiveRate: "Effective rate: 0.75% of total portfolio value",
        alternativeProxy: "NZF UK uses a 25% proxy (0.625% effective rate). Both are scholarly approximations.",
        note: "Traditional schools (Hanafi/Maliki/Shafi'i/Hanbali) may require 100% valuation if specific company financials aren't available."
    },
    employeeCompensation: {
        title: "Employee Compensation Plans",
        intro: "Modern employee equity creates complex ownership questions:",
        types: [
            {
                label: "RSUs (Restricted Stock Units)",
                text: "NOT Zakatable until vested. Upon vesting, you own the shares—include at market value.",
                detail: "Vesting triggers ownership (Milk). Before vesting, you have a promise, not property."
            },
            {
                label: "ESPP (Employee Stock Purchase Plan)",
                text: "Once shares are purchased and held, apply intent rules. Short-term = 100%. Long-term = 30% rule.",
                detail: "The discounted purchase creates instant value. If you flip quickly, treat as trade goods (Mudir)."
            },
            {
                label: "Stock Options (ISO/NQSO)",
                text: "NOT Zakatable until exercised. You own the option, not the underlying shares.",
                detail: "Upon exercise, the shares become yours. At that point, include at market value minus strike price."
            },
            {
                label: "Phantom Stock / SARs",
                text: "Cash-settled awards are NOT equity ownership. Zakatable only when paid out as cash.",
                detail: "You never own shares—these are deferred compensation arrangements."
            }
        ]
    },
    exclusions: {
        title: "Summary: Not Zakatable",
        list: [
            { label: "Unvested RSUs", text: "Not owned yet—promise of future shares" },
            { label: "Unexercised Options", text: "Right to buy, not ownership" },
            { label: "Unvested Employer Match", text: "Not yours until vesting" }
        ]
    },
    purification: {
        title: "Dividend Purification",
        text: "If a company derives <5% revenue from impermissible sources (interest, alcohol, gambling), that portion of dividends must be donated to charity—separate from Zakat."
    }
};
export const retirement = {
    id: "retirement",
    number: 6,
    title: "Retirement Accounts (401k, IRA, 403b, 457, Pension)",
    icon: ShieldCheck,
    intro: "Retirement accounts present complex Zakat questions due to access restrictions, penalties, and deferred taxation. Two major scholarly approaches exist.",
    approachesIntro: "ZakatFlow applies rules based on your selected methodology:",
    approaches: [
        {
            title: "Sheikh Joe Bradford",
            tag: "Recommended",
            description: "Traditional retirement accounts (401(k), 403(b), 457(b), Traditional IRA) are EXEMPT from Zakat if you are under 59½.",
            basis: "Scholarly Basis: Sheikh Joe Bradford argues in his book \"Simple Zakat Guide\" that the combined effect of the 10% penalty + income taxes (often 30-40% total) creates a substantial barrier similar to māl ḍimār (inaccessible wealth). The penalty is a government-imposed legal barrier, not merely a cost of access.",
            steps: [
                "Under 59½: $0 Zakat (exempt)",
                "Over 59½: Zakatable on accessible amount",
                "Age 55 exception: If separated from service after 55, 401(k)/403(b) may be accessible"
            ],
            principles: [
                "Lacks Milk Tām: A substantial portion goes to government, not you",
                "Lacks Qudrah 'ala al-Tasarruf: The penalty creates a legal barrier to free disposition",
                "Similar to Māl Ḍimār: Wealth in the hands of an uncertain debtor (the government)"
            ]
        },
        {
            title: "AMJA / Traditional Schools",
            description: "Zakat is due on the 'Net Accessible Value' (balance minus taxes/penalties).",
            basis: "AMJA Fatwa #77832: Despite penalties, the wealth is legally owned. Dr. Yusuf Al-Qaradawi similarly supports Zakat on the net accessible amount. The penalty is merely a cost of liquidation, not a Shariah-valid barrier.",
            steps: [
                "1. Take Vested Balance only (not employer unvested match)",
                "2. Deduct applicable Taxes and Penalties",
                "3. Pay 2.5% on the remaining 'Net' amount annually"
            ],
            principles: [
                "Ownership (Milk) is established upon vesting",
                "Ability to access exists—the penalty is just a cost",
                "The asset has Nama' (growth potential)"
            ]
        }
    ],
    accountTypes: {
        title: "Account Type Specifics",
        types: [
            { label: "401(k) / 403(b) / 457(b)", text: "Follow the rules above based on age and access" },
            { label: "Traditional IRA", text: "Same as 401(k)—subject to 10% penalty before 59½" },
            { label: "SEP-IRA / SIMPLE IRA", text: "Same as Traditional IRA. Note: SIMPLE IRA has 25% penalty if withdrawn within 2 years" },
            { label: "Defined Benefit Pension", text: "Only accessible upon retirement. Apply Bradford exemption or AMJA net-value based on vested amount" },
            { label: "Deferred Compensation (457)", text: "Governmental 457(b) has no 10% penalty—may be more accessible. Private 457(b) follows standard rules" }
        ]
    },
    roth: {
        title: "Roth IRA & Roth 401(k)",
        intro: "Roth accounts have a split treatment due to contribution accessibility:",
        points: [
            { label: "Contributions", text: "Always 100% Zakatable—you can withdraw anytime without penalty or tax" },
            { label: "Earnings", text: "Follows same rules as Traditional (Exempt in Bradford mode under 59½, Net Value in AMJA mode)" },
            { label: "5-Year Rule", text: "Qualified distributions require 5-year holding. Before that, earnings may have penalties." }
        ]
    },
    hsa: {
        title: "Health Savings Account (HSA)",
        text: "Fully Zakatable. Unlike retirement accounts, HSA funds can be used for qualified medical expenses at any time, any age, without penalty. This unlimited accessibility makes them zakatable.",
        tip: "After age 65, HSA funds can be used for non-medical expenses (taxed as income but no penalty)—still Zakatable."
    },
    education: {
        title: "Education Accounts (529 / ESA / UTMA)",
        intro: "Education savings have unique considerations:",
        points: [
            { label: "529 Plans", text: "Accessible (10% penalty + taxes on non-qualified). Consider Zakatable on net value." },
            { label: "Shariah Compliance", text: "Verify the underlying investments are halal. Many 529 plans invest in bonds or mixed funds." },
            { label: "Coverdell ESA", text: "Similar to 529—Zakatable on accessible amount." },
            { label: "UTMA/UGMA", text: "Custodied for minor. Guardian pays Zakat on child's behalf." }
        ]
    },
    loans: {
        title: "401(k) Loans",
        text: "Loan proceeds are cash in your possession (Zakatable). The debt owed back to your own 401(k) is NOT deductible—you're paying yourself."
    }
};
export const crypto = {
    id: "crypto",
    number: 7,
    title: "Cryptocurrency & Digital Assets",
    icon: CurrencyBtc,
    intro: "Crypto spans the line between currency (thaman), trade goods (ʿurūḍ al-tijārah), and novel digital assets. Treatment depends on usage and intent.",
    principle: {
        title: "General Principle",
        text: "Any crypto-asset purchased with the intent of short-term resale for profit is treated as trade goods—100% of market value is Zakatable at 2.5%. Long-term holdings follow the same rule unless held as personal utility (exempt)."
    },
    classification: {
        title: "Asset Classification",
        types: [
            { label: "Payment Tokens (BTC, ETH, Stablecoins)", text: "Treated as currency. Fully Zakatable at market value." },
            { label: "Utility Tokens", text: "If held for use (not speculation), may be exempt like personal property. If traded, Zakatable." },
            { label: "Security Tokens", text: "Represent ownership claims. Apply stock/equity Zakat rules." },
            { label: "Governance Tokens", text: "If actively traded, Zakatable. If held for governance only, scholars differ." }
        ]
    },
    staking: {
        title: "Staking & Validator Rewards",
        intro: "Staking is generally considered permissible as a service of network validation, not riba (interest).",
        types: [
            { label: "Principal (Staked Amount)", text: "You retain ownership. Fully Zakatable on market value." },
            { label: "Vested/Claimed Rewards", text: "Zakatable once in your possession (claimable to your wallet)." },
            { label: "Locked/Unvested Rewards", text: "Not yet in your possession (māl ḍimār)—exempt until vested." },
            { label: "Unbonding Period", text: "During unbonding (typically 21-28 days), assets are still yours—Zakatable." }
        ],
        note: "Running your own validator is considered the most Shariah-compliant staking approach. Delegated staking to third parties requires trust in their compliance."
    },
    defi: {
        title: "DeFi & Liquidity Pools",
        intro: "Decentralized finance introduces complexity around ownership and value calculation.",
        types: [
            { label: "Liquidity Pool Position", text: "Zakatable on current redeemable value of underlying assets (not LP token price)." },
            { label: "Impermanent Loss", text: "Account for the actual value you can withdraw today, not original deposit." },
            { label: "Yield Farming Rewards", text: "Zakatable when claimed/vested. Locked rewards are exempt." },
            { label: "Lending Protocols", text: "Interest-bearing positions may be impermissible. Purify the interest portion and donate separately." }
        ],
        caution: "Many DeFi protocols involve riba (interest). Consult a scholar about the permissibility of specific protocols before considering Zakat on them."
    },
    nfts: {
        title: "NFTs (Non-Fungible Tokens)",
        intro: "NFT treatment depends entirely on intent (Niyyah):",
        types: [
            { label: "Trade NFTs (Flipping)", text: "Zakatable at current market value. Treat as trade goods." },
            { label: "Personal Collection (Art, PFP)", text: "Exempt if held for personal enjoyment, not for sale (Qunya)." },
            { label: "Utility NFTs (Access Passes)", text: "If used for access/utility, generally exempt. If speculative, Zakatable." }
        ]
    },
    valuation: {
        title: "Valuation on Zakat Date",
        text: "Use the market price on your Zakat date (not purchase price). If price is volatile, use a reasonable average or end-of-day price. Multiple exchanges? Use the exchange you'd actually sell on."
    }
};
export const metals = {
    id: "metals",
    number: 8,
    title: "Gold & Silver",
    icon: Coins,
    intro: "Gold and silver hold special significance in Zakat law as they were the original basis for the niṣāb measurement.",
    alwaysZakatable: {
        title: "Investment Bullion",
        list: [
            { label: "Bars/Coins", text: "Always Zakatable" },
            { label: "Digital Gold", text: "Always Zakatable" }
        ]
    },
    jewelry: {
        title: "Jewelry",
        intro: "See 'Schools of Thought' section. Hanafi includes it; others exempt it.",
        views: [
            { title: "Hanafi", text: "Zakatable on melt value." },
            { title: "Others", text: "Exempt if for personal use." }
        ],
        precaution: {
            title: "Valuation",
            text: "If paying, use melt value of metal only (exclude gems/labor)."
        },
        valuation: {
            title: "How to Value",
            intro: "",
            points: ["Weight of Gold x Spot Price"]
        }
    },
};
export const realEstate = {
    id: "realestate",
    number: 9,
    title: "Real Estate",
    icon: Buildings,
    intro: "Real estate treatment depends entirely on intent (Niyyah) and usage. The same property can be exempt or fully Zakatable based on how it's held.",
    principle: {
        title: "The Intent Principle",
        text: "Intent at acquisition determines treatment. Changing intent (e.g., from personal use to sale) restarts the Hawl from the date of the new intention."
    },
    types: [
        {
            title: "Primary Home",
            ruling: "Exempt",
            text: "Personal residence is Qunya (personal use asset)—not Zakatable. This is consensus across all schools.",
            detail: "Fixed assets used for personal living are not subject to Zakat. This includes the house, furniture, and vehicles for personal use."
        },
        {
            title: "Rental Property (Income-Generating)",
            ruling: "Income Only (Majority)",
            text: "The structure itself is exempt as a productive asset. Net rental income (after expenses) is Zakatable once it accumulates and a year passes.",
            detail: "Majority scholarly view: rental properties are like agricultural land—you pay Zakat on the produce (income), not the land itself. Some scholars suggest 5-10% of gross rent (analogous to agricultural produce), though 2.5% on net income held in cash is more common.",
            alternative: "Alternative View (Dr. Yusuf Al-Qaradawi): Treat rental properties as investment capital. Calculate 2.5% Zakat on the market value of the property plus any retained rental income."
        },
        {
            title: "Flipping / Trade Property",
            ruling: "Full Market Value",
            text: "Properties purchased with intent to resell for profit are trade goods (ʿurūḍ al-tijārah). The entire market value is Zakatable.",
            detail: "Apply Mudir (active trader) rules: annual valuation at market price. This includes house flippers, developers, and real estate traders."
        },
        {
            title: "Land Banking / Speculation",
            ruling: "Full Market Value (Majority)",
            text: "Undeveloped land held for appreciation is a trade asset. Zakatable annually at 2.5% of market value.",
            detail: "NZF UK Position: If land was purchased with intent to sell for profit, Zakat is due annually on its approximate sale price. Alternative: Some scholars permit deferring payment until sale—then pay for all past years.",
            malikiView: "Maliki View: If held as Muhtakir (speculator), Zakat may be due only for one year upon sale. Majority view of annual payment is considered safer."
        },
        {
            title: "Undecided Intent",
            ruling: "Potentially Exempt",
            text: "If genuinely undecided about whether to sell, develop, or hold—Zakat may not be due until intent is clarified.",
            detail: "Once you decide to sell, the Hawl begins from that date of intention."
        }
    ],
    reits: {
        title: "REITs (Real Estate Investment Trusts)",
        intro: "REIT shares are treated like stock shares, not direct property ownership:",
        types: [
            { label: "Equity REITs", text: "Zakatable at 2.5% of market value. Ensure the REIT is Shariah-compliant (avoids interest-based income)." },
            { label: "Mortgage REITs", text: "Generally impermissible (invest in interest-bearing loans). Avoid these entirely." },
            { label: "Dividends", text: "Add accumulated REIT dividends to your cash holdings for Zakat calculation." }
        ],
        note: "Source: ZakatFinance.com, Islamic Finance Guru"
    },
    vacation: {
        title: "Vacation Home / Second Property",
        ruling: "Exempt (if for personal use)",
        text: "A second home used for personal vacation is Qunya—not Zakatable. If occasionally rented, the rental income (not property value) is Zakatable."
    },
    rawLand: {
        title: "Raw Land (Agricultural)",
        ruling: "Produce Only",
        text: "Agricultural land itself is exempt. Zakat is due on the produce (crops, livestock) at harvest—typically 5% (irrigated) or 10% (rain-fed).",
        detail: "The land is a tool of production, not a trade asset."
    },
    references: {
        title: "Scholarly References",
        sources: [
            "NZF UK - Zakat on Property Guide",
            "Dr. Yusuf Al-Qaradawi - Fiqh al-Zakat",
            "IslamQA.org - Land Zakat Fatwas",
            "ZakatFinance.com - REITs and Real Estate"
        ]
    }
};
export const business = {
    id: "business",
    number: 10,
    title: "Business Assets",
    icon: Storefront,
    intro: "Business Zakat focuses on current assets (cash, inventory, receivables), not fixed assets used in operations. The calculation follows AAOIFI Financial Accounting Standard (FAS) 39.",
    principle: {
        title: "Net Current Assets Method",
        text: "Zakat = (Current Assets - Current Liabilities) × 2.5%. This is the corporate Zakat standard used by Islamic financial institutions globally.",
        source: "AAOIFI Shariah Standard No. 35"
    },
    zakatable: {
        title: "Zakatable Business Assets",
        list: [
            { label: "Cash & Bank Balances", text: "All business cash accounts, including foreign currency converted to local rates" },
            { label: "Inventory (Finished Goods)", text: "Current market/resale value on Zakat date, not purchase cost" },
            { label: "Inventory (Raw Materials)", text: "Market replacement cost" },
            { label: "Work-in-Progress (WIP)", text: "Current value of unfinished products—include materials + labor invested" },
            { label: "Accounts Receivable (Good Debt)", text: "Amounts owed by solvent customers expected to pay" },
            { label: "Short-term Investments", text: "Marketable securities, bonds (if permissible), or held-for-trading stocks" },
            { label: "Prepaid Expenses (Recoverable)", text: "Only if refundable or convertible to cash" }
        ]
    },
    valuation: {
        title: "Inventory Valuation",
        text: "Value inventory at current market price (resale value) on your Zakat date—not historical cost.",
        detail: "If resale price is difficult to determine, use wholesale/replacement cost. Legal ownership triggers Zakat, even if physical possession is elsewhere.",
        source: "SeekersGuidance, NZF UK, ZakatFinance.com"
    },
    notZakatable: {
        title: "Exempt (Fixed Assets)",
        intro: "Assets essential for business operations are not Zakatable—only the income they generate:",
        list: [
            { label: "Equipment & Machinery", text: "Tools of production, not trade goods" },
            { label: "Fixtures & Furniture", text: "Office and store fixtures" },
            { label: "Buildings & Property", text: "Operational premises (not held for sale)" },
            { label: "Vehicles (Business Use)", text: "Delivery trucks, company cars" },
            { label: "Intellectual Property", text: "Patents, trademarks (unless being sold)" }
        ]
    },
    goodwill: {
        title: "Goodwill & Intangibles",
        ruling: "Exempt",
        text: "Goodwill is an intangible asset not held for resale. It represents reputation, customer relationships, and brand value—not zakatable wealth.",
        detail: "Fiqh principles focus on tangible, liquid, growing wealth. Goodwill fails these criteria.",
        source: "Islamic Finance Guru, AAOIFI implications"
    },
    serviceBusiness: {
        title: "Service Businesses (Consultants, Freelancers, SaaS)",
        intro: "Service businesses lack significant inventory. Zakat treatment differs:",
        text: "Zakat is primarily due on net profits and accumulated cash—not on capital equipment or the business itself.",
        types: [
            { label: "Cash & Savings", text: "Fully Zakatable" },
            { label: "Accounts Receivable", text: "Good debt is Zakatable" },
            { label: "Equipment (Laptops, Tools)", text: "Exempt—tools of the trade" },
            { label: "Net Profits", text: "Once held for a year, Zakatable at 2.5%" }
        ],
        source: "Dr. Yusuf Al-Qaradawi, Fiqh al-Zakat: service income is like agricultural produce—taxed on the yield, not the land."
    },
    familyLLC: {
        title: "Family LLCs & Holding Companies",
        text: "For pass-through entities, Zakat liability falls on individual owners proportionally—not the company itself.",
        detail: "Each family member calculates their share of the LLC's zakatable assets (cash, inventory, receivables) after deducting their share of current liabilities.",
        source: "NZF UK, ResearchGate Islamic Finance Studies"
    },
    references: {
        title: "Scholarly References",
        sources: [
            "AAOIFI Financial Accounting Standard (FAS) 39",
            "Dr. Yusuf Al-Qaradawi - Fiqh al-Zakat",
            "NZF UK - Zakat on Business Guide",
            "Islamic Relief - Business Zakat Calculator",
            "SeekersGuidance - Business Inventory Fatwas"
        ]
    }
};
export const debts = {
    id: "debts",
    number: 11,
    title: "Debts & Liabilities",
    icon: HandCoins,
    receivables: {
        title: "Owed TO You",
        intro: "",
        good: { title: "Good Debt", text: "Zakatable immediately." },
        bad: { title: "Bad Debt", text: "Zakatable only when received." }
    },
    liabilities: {
        title: "Owed BY You",
        intro: "Deduct immediate debts (due within 12 months).",
        views: [] as string[],
        zakatFlowView: "ZakatFlow follows the Maliki/Bradford view: only immediate obligations (due within 12 months) reduce your Zakatable wealth. The Shafi'i mode applies no deduction at all."
    },
    deductible: {
        title: "Deductible",
        list: ["Unpaid bills", "Upcoming year's mortgage payments", "Credit card balances"]
    },
    notDeductible: {
        title: "Not Deductible",
        list: ["Long-term mortgage principal", "Future years' student loans"]
    },
    guidance: { title: "Guidance", text: "Deduct only what you are actually obligated to pay within the coming year." }
};
export const trusts = {
    id: "trusts",
    number: 12,
    title: "Trusts",
    icon: Users,
    intro: "Trust treatment depends on who holds 'full ownership' (Milk Tām). The key question: Can you freely access and dispose of the assets?",
    principle: {
        title: "The Ownership Principle",
        text: "Zakat is only obligatory on wealth that is fully owned. Promises of future wealth, conditional grants, and assets under another's control do not meet this criterion.",
        source: "Classical Fiqh, IlmGate.org"
    },
    revocable: {
        title: "Revocable Trust (Living Trust)",
        ruling: "Zakatable by Settlor",
        text: "The settlor retains the power to revoke, amend, or terminate the trust. From a Zakat perspective, the assets are still effectively owned by the settlor.",
        detail: "Since you can reclaim the assets at any time, you have full ownership. Pay Zakat on the zakatable assets within the trust as if they were in your personal accounts.",
        malaysiaNote: "Malaysia: The nature of living trusts where the settlor retains control may conflict with Islamic principles of Hibah (gift) and succession—IIUM Law Journal research."
    },
    irrevocable: {
        title: "Irrevocable Trust",
        intro: "The settlor has permanently relinquished ownership. Zakat liability shifts based on beneficiary access:",
        list: [
            { label: "No Immediate Access", text: "Beneficiary cannot freely access funds → Exempt until distribution" },
            { label: "Current Access/Distribution", text: "Beneficiary receives and controls funds → Zakatable to beneficiary" },
            { label: "Discretionary Trust", text: "Trustee decides distributions → Exempt until distribution is made" }
        ],
        detail: "The beneficiary becomes liable for Zakat only when they gain proprietorship, possession, and full ownership of the distributed income or capital.",
        source: "IlmGate.org, fatwa.org.au"
    },
    custodial: {
        title: "Custodial Accounts (UTMA/UGMA)",
        ruling: "Zakatable",
        text: "Assets belong to the child, but the guardian/custodian is responsible for paying Zakat from the child's property.",
        detail: "Many scholars hold that Zakat is obligatory on the property of orphans and minors. The guardian manages the payment on behalf of the minor.",
        source: "SemanticScholar, classical Hanafi/Shafi'i position"
    },
    trustees: {
        title: "Trustees",
        ruling: "Not Liable",
        text: "Trustees are mere agents managing trust property—they are not owners. Zakat is never the trustee's personal obligation.",
        detail: "The obligation falls on either the settlor (revocable) or beneficiary (irrevocable upon distribution)."
    },
    waqf: {
        title: "Waqf (Charitable Endowment)",
        ruling: "Exempt",
        text: "Waqf assets are not privately owned—ownership has been transferred to Allah for perpetual charitable benefit.",
        detail: "Once an asset is designated as Waqf, it cannot be sold, transferred, or given away. Zakat is not levied on public or charitable endowments.",
        source: "waqf.org, zatca.gov.sa, Cambridge University Press"
    },
    minors: {
        title: "Minor Beneficiaries",
        intro: "Differing scholarly views on Zakat for minors:",
        views: [
            { position: "Majority (Hanafi, Shafi'i)", text: "Zakat is obligatory on the property of orphans and minors. The guardian pays from the child's wealth." },
            { position: "Minority View", text: "Some scholars hold that Zakat is not obligatory until the child reaches maturity (bulugh)." },
            { position: "Child Trust Fund (UK)", text: "NZF UK: May be permissible to defer Zakat until funds are accessible. Once accessible, backdate and pay for all prior years." }
        ],
        source: "IlmGate.org, NZF UK"
    },
    unitTrusts: {
        title: "Unit Trust Funds (Malaysia)",
        ruling: "Zakatable as Trade Goods",
        text: "The Selangor Fatwa Committee ruled that Zakat on unit trusts should be based on 'Arud Tijarah (trade goods) at 2.5% of the value of shares and income generated.",
        source: "HRMARS, Selangor State Fatwa Committee"
    },
    indonesia: {
        title: "Indonesian Fatwas (MUI)",
        text: "The Indonesian Ulema Council (MUI) mandates Zakat on legal entities if their assets meet general provisions of Islamic law: Nisab, Hawl, and 2.5% rate.",
        detail: "Indonesia exhibits 'fatwa pluralism' with various Islamic organizations issuing guidelines, which can lead to diverse interpretations.",
        source: "ResearchGate, UII Indonesia, BAZNAS"
    },
    references: {
        title: "Global Scholarly References",
        sources: [
            "IlmGate.org - Trusts and Zakat Analysis",
            "NZF UK - Zakat on Trusts Guide",
            "fatwa.org.au - Australian Fatwa Council",
            "IIUM Law Journal - Malaysia Living Trusts",
            "Selangor State Fatwa Committee - Unit Trusts",
            "Indonesian Ulema Council (MUI) - Corporate Zakat",
            "ZATCA Saudi Arabia - Charitable Trusts"
        ]
    }
};
export const example = {
    id: "example",
    number: 13,
    title: "Example: The Ahmed Family",
    icon: ListNumbers,
    intro: "See how the calculation changes based on the methodology.",
    profile: {
        title: "Profile",
        items: [
            "Ahmed (42), Fatima (40)",
            "Assets: $45k Cash, $320k 401k (Vested), $60k Roth Contrib, $150k Passive ETF, $30k REITs, $75k Land Banking, $8k Jewelry",
            "Liabilities: $36k (12-mo Mortgage), $200k (Remaining Mortgage), $5k Credit Card"
        ]
    },
    assets: {
        title: "Assets",
        table: [
            { label: "Cash & Savings", value: "$45,000" },
            { label: "Rental Income", value: "$12,000" },
            { label: "401k (Vested)", value: "$320,000" },
            { label: "Roth Contributions", value: "$60,000" },
            { label: "Passive ETFs", value: "$150,000" },
            { label: "REITs", value: "$30,000" },
            { label: "Land Banking", value: "$75,000" },
            { label: "Gold Jewelry", value: "$8,000" },
            { label: "Total Gross", value: "$700,000", isTotal: true }
        ]
    },
    liabilities: {
        title: "Liabilities",
        table: [
            { label: "Mortgage (Current Year)", value: "$36,000" },
            { label: "Mortgage (Remaining)", value: "$200,000" },
            { label: "Credit Card", value: "$5,000" },
            { label: "Total Liabilities", value: "$241,000", isTotal: true }
        ]
    },
    calculation: {
        title: "Results by Mode",
        modes: [
            {
                title: "Sheikh Joe Bradford",
                details: [
                    "Cash: $57,000",
                    "401k: $0 (Exempt < 59½)",
                    "Roth: $60,000",
                    "Passive ETFs: $45,000 (30% Rule)",
                    "REITs: $9,000 (30% Rule)",
                    "Land Banking: $75,000 (100%)",
                    "Jewelry: $0 (Exempt)",
                    "Total Assets: $246,000",
                    "Liabilities: -$41,000 (12-mo only)",
                    "Net Zakatable: $205,000"
                ],
                result: "$5,125"
            },
            {
                title: "Hanafi",
                details: [
                    "Cash: $57,000",
                    "401k: $185,600 (Net Accessible)",
                    "Roth: $60,000",
                    "Passive ETFs: $150,000 (100%)",
                    "REITs: $30,000 (100%)",
                    "Land Banking: $75,000 (100%)",
                    "Jewelry: $8,000 (Zakatable)",
                    "Total Assets: $565,600",
                    "Liabilities: -$241,000 (Full Deduction)",
                    "Net Zakatable: $324,600"
                ],
                result: "$8,115"
            },
            {
                title: "Maliki / Shafi'i",
                details: [
                    "Cash: $57,000",
                    "401k: $185,600 (Net Accessible)",
                    "Roth: $60,000",
                    "Passive ETFs: $150,000 (100%)",
                    "REITs: $30,000 (100%)",
                    "Land Banking: $75,000 (100%)",
                    "Jewelry: $0 (Exempt)",
                    "Total Assets: $557,600",
                    "Liabilities: -$41,000 (Immediate Only)",
                    "Net Zakatable: $516,600"
                ],
                result: "$12,915"
            },
            {
                title: "Hanbali",
                details: [
                    "Cash: $57,000",
                    "401k: $185,600 (Net Accessible)",
                    "Roth: $60,000",
                    "Passive ETFs: $150,000 (100%)",
                    "REITs: $30,000 (100%)",
                    "Land Banking: $75,000 (100%)",
                    "Jewelry: $0 (Exempt)",
                    "Total Assets: $557,600",
                    "Liabilities: -$241,000 (Full Deduction)",
                    "Net Zakatable: $316,600"
                ],
                result: "$7,915"
            }
        ]
    },
    summary: {
        title: "Impact",
        text: "Methodology matters. The same financial situation can result in Zakat ranging from $5,125 to $12,915 depending on how debts and assets are treated. REITs follow the same 30%/100% rule as passive investments."
    }
};
export const modes = {
    id: "modes",
    number: 14,
    title: "Comparison Table",
    icon: Table,
    intro: "Quick reference for asset treatment.",
    comparisonTable: [
        { asset: "Passive Investments", bradford: "30% Rule", hanafi: "100% Market", maliki: "100% Market", hanbali: "100% Market" },
        { asset: "401k/IRA (Under 59½)", bradford: "Exempt", hanafi: "Net Accessible", maliki: "Net Accessible", hanbali: "Net Accessible" },
        { asset: "Personal Jewelry", bradford: "Zakatable", hanafi: "Zakatable", maliki: "Exempt", hanbali: "Exempt" },
        { asset: "Debts (Deductible)", bradford: "12-Month", hanafi: "Full Deduction", maliki: "12-Month", hanbali: "Full Deduction" }
    ],
    notes: {
        title: "",
        text: ""
    }
};
export const faq = {
    id: "faq",
    number: 14.5,
    title: "Common Questions",
    icon: Warning,
    intro: "Answers to frequently asked questions about Zakat distribution and special cases.",
    forgivingDebt: {
        title: "Can I Forgive a Debt as Zakat?",
        question: "If someone owes me money, can I count forgiving that debt as my Zakat payment?",
        majorityView: {
            label: "Majority View (Hanafi, Hanbali, Maliki)",
            ruling: "No",
            explanation: "Zakat requires Tamlik—the transfer of ownership of an asset to the recipient. Forgiving a debt extinguishes a liability but does not transfer anything. The poor person does not 'receive' wealth; they simply owe less."
        },
        minorityView: {
            label: "Minority View (Some Shafi'i scholars, Hasan al-Basri)",
            ruling: "Yes, in limited cases",
            explanation: "Some hold that relieving a debtor qualifies as supporting Al-Gharimin (the indebted), one of the eight Zakat categories explicitly mentioned in the Quran (9:60)."
        },
        recommendation: "If you wish to forgive a debt, consider: (1) Calculate the debt amount, (2) Pay that amount as Zakat to a separate eligible recipient, (3) Then forgive the original debt as Sadaqah (voluntary charity). This satisfies both the Tamlik requirement and your charitable intent."
    },
    fiSabilAllah: {
        title: "What Does 'Fi Sabil Allah' Mean?",
        question: "Can Zakat funds be used for any 'good cause'?",
        classicalView: {
            label: "Classical Position (Ibn Qudamah, Al-Mughni)",
            ruling: "Restricted to defense and Jihad",
            explanation: "Ibn Qudamah explicitly argues that 'Fi Sabil Allah' (In the Cause of God), when unqualified in legal texts, refers to the defense of the Muslim community. He specifically argues against using Zakat for Hajj pilgrimage."
        },
        modernView: {
            label: "Contemporary Extension",
            ruling: "Broader interpretation",
            explanation: "Some modern scholars extend this category to include Da'wah (Islamic education and propagation), Islamic schools, and intellectual defense of Islam. This remains debated."
        },
        recommendation: "If you follow the traditional opinion, direct your 'Fi Sabil Allah' portion to refugee relief, humanitarian organizations, or verified Islamic relief efforts. Consult your local scholar for guidance specific to your situation."
    }
};
export const references = {
    id: "references",
    number: 15,
    title: "References & Works Cited",
    icon: BookOpen,
    primary: {
        title: "Primary Sources",
        list: [
            { name: "Sheikh Joe Bradford", text: "\"Simple Zakat Guide: Understand and Calculate Your Zakat\" — A comprehensive book and methodology for American Muslims.", link: { url: "https://joebradford.net", display: "joebradford.net" } },
            { name: "Assembly of Muslim Jurists of America (AMJA)", text: "Fatwas on Zakat, retirement accounts, mortgage deduction, and contemporary financial instruments. Fatwa #77832 on Retirement Accounts.", link: { url: "https://www.amjaonline.org", display: "amjaonline.org" } },
            { name: "AAOIFI Shariah Standard 35", text: "\"Zakah\" — Technical standard from the Accounting and Auditing Organization for Islamic Financial Institutions. Source of the 30% rule for passive investments." },
            { name: "Islamic Finance Guru", text: "Detailed guides on Zakat for cryptocurrency, investments, and modern assets.", link: { url: "https://www.islamicfinanceguru.com", display: "islamicfinanceguru.com" } },
            { name: "National Zakat Foundation (NZF UK)", text: "Practical Zakat calculation guidance and scholarly resources.", link: { url: "https://nzf.org.uk", display: "nzf.org.uk" } },
            { name: "Zakat.fyi", text: "Modern Zakat calculation resources and educational content." }
        ]
    },
    classical: {
        title: "Classical Fiqh Sources",
        list: [
            { name: "Al-Mughni", text: "Ibn Qudamah (Hanbali compendium on comparative fiqh)" },
            { name: "Al-Majmu' Sharh al-Muhadhdhab", text: "Imam Nawawi (Shafi'i school)" },
            { name: "Fiqh al-Zakah", text: "Dr. Yusuf al-Qaradawi (comprehensive modern treatise)" },
            { name: "Badai' al-Sanai'", text: "Al-Kasani (Hanafi school)" }
        ]
    },
    concepts: {
        title: "Key Concepts Referenced",
        list: [
            { name: "Milk Tām", text: "Complete possession — the requirement that you have full ownership and access to wealth for Zakat to apply" },
            { name: "Qudrah 'ala al-Tasarruf", text: "Ability to dispose — practical capacity to access and use wealth freely" },
            { name: "Māl Ḍimār", text: "Inaccessible or at-risk wealth — exempt from Zakat until recovered/accessible" },
            { name: "ʿUrūḍ al-Tijārah", text: "Trade goods — merchandise held for sale, Zakatable at full market value" },
            { name: "Qunya", text: "Personal use property — items used personally that are exempt from Zakat" },
            { name: "Nāmī", text: "Growing/productive wealth — assets that have potential for growth" },
            { name: "Ḥawl", text: "The lunar year period wealth must be held above niṣāb for Zakat to become obligatory" },
            { name: "Nawā", text: "Intent — the purpose for which an asset is held, determining its Zakat classification" },
            { name: "Ahwat", text: "Precautionary principle — when in doubt, take the safer position" },
            { name: "Anfa' li'l-fuqara", text: "Most beneficial for the poor — principle favoring interpretations that increase Zakat flow" }
        ]
    },
    disclaimer: {
        title: "Disclaimer",
        text: "This methodology guide is provided for educational and informational purposes only. It does not constitute religious advice. For specific rulings on your personal situation, please consult a qualified Islamic scholar or your local imam."
    }
};
export const explorer = {
    modes: [
        {
            id: 'bradford',
            label: 'Sheikh Joe Bradford',
            rules: {
                jewelry: 'Zakatable (Ahwat)',
                retirement: 'Exempt (< 59½)',
                passive: '30% Rule'
            }
        },
        {
            id: 'hanafi',
            label: 'Hanafi',
            rules: {
                retirement: 'Purification Deductible',
                pension: 'Accessible Only',
                gold: 'Zakatable',
                jewelry: 'Zakatable (Silver/Gold)',
                passive: '100% Market'
            }
        },
        {
            id: 'shafii',
            label: "Shafi'i",
            rules: {
                retirement: 'Purification Deductible',
                pension: 'Accessible Only',
                gold: 'Zakatable',
                jewelry: 'Exempt (Permissible)',
                passive: '100% Market'
            }
        },
        {
            id: 'maliki',
            label: 'Maliki',
            rules: {
                retirement: 'Purification Deductible',
                pension: 'Accessible Only',
                gold: 'Zakatable',
                jewelry: 'Exempt (Permissible)',
                passive: '100% Market'
            }
        },
        {
            id: 'hanbali',
            label: 'Hanbali',
            rules: {
                retirement: 'Purification Deductible',
                pension: 'Accessible Only',
                gold: 'Zakatable',
                jewelry: 'Exempt (Permissible)',
                passive: '100% Market'
            }
        }
    ] as const,
    impactLabels: {
        lowest: "Lowest",
        moderate: "Moderate",
        highest: "Highest"
    },
    ruleHighlights: {
        jewelry: {
            hanafi: "Zakatable (Hanafi View)",
            bradford: "Zakatable (Bradford View)",
            majority: "Exempt (Majority View)"
        },
        stocks: {
            passive: {
                title: "30% Rule (Passive)"
            },
            default: {
                title: "100% Market Value (Default)",
                description: "Holdings are valued at 100% of market value for passive investments, unless specific company financials allow for Net Current Asset calculation."
            }
        }
    }
};

