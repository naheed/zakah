
import { Gavel, Scales, Calendar, Wallet, TrendUp, ShieldCheck, CurrencyBtc, Coins, Buildings, Storefront, HandCoins, Users, ListNumbers, Table, BookOpen, Warning } from "@phosphor-icons/react";

export const header = {
    title: "Methodology & References",
    intro: "Zakat rules are derived from the four Sunni schools of jurisprudence (Madhabs) and contemporary research. ZakatFlow empowers you to select the methodology that best aligns with your understanding, backed by clear evidence.",
    primaryInfluences: "Influenced by the works of Sheikh Joe Bradford and AAOIFI Shariah Standards. Our 'Balanced (Bradford)' mode follows his published methodology.",
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
        note: "The 'Bradford (Balanced)' mode is the default, offering a contemporary synthesis of fiqh suited for modern financial assets."
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
        zakatFlowApproach: "ZakatFlow applies the Maliki/Bradford standard (12-month deduction) for the Balanced mode. The Shafi'i position—that debt does not reduce Zakatable wealth—is implemented separately. Imam Al-Nawawi (Shafi'i school) argues that Zakat is a right attached to the specific asset, not a personal liability, so debts owed to others do not diminish it."
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
    intro: "Treatment depends on intent: Active Trading vs. Passive Holding.",
    mudir: {
        title: "Active Trading (Mudir)",
        text: "Stocks bought for short-term capital gain.",
        calculation: "Zakatable at 100% of market value."
    },
    muhtakir: {
        title: "Passive Holding (Muhtakir)",
        text: "Stocks held for long-term growth and dividends."
    },
    rule30: {
        title: "The 30% Rule (Bradford Mode)",
        standard: "AAOIFI Shariah Standard 35",
        description: "For passive investments, Zakat is due only on the underlying zakatable assets of the company (cash, receivables, inventory).",
        formula: "Market Value × 30%Proxy × 2.5% Rate",
        effectiveRate: "Effective rate: 0.75% of total portfolio value",
        note: "Other modes (Hanafi/Maliki/etc) may take a stricter view requiring 100% valuation if specific company data isn't available, but the 30% rule is widely accepted for ease."
    },
    exclusions: {
        title: "Exclusions",
        list: [
            { label: "Unvested RSUs", text: "Not owned yet (No Zakat)" },
            { label: "Stock Options", text: "Not owned until exercised" }
        ]
    },
    purification: {
        title: "Dividend Purification",
        text: "Impermissible income portion of dividends must be donated to charity."
    }
};
export const retirement = {
    id: "retirement",
    number: 6,
    title: "Retirement Accounts (401k, IRA)",
    icon: ShieldCheck,
    intro: "Retirement accounts are complex due to restricted access and penalties.",
    approachesIntro: "ZakatFlow applies rules based on your selected methodology:",
    approaches: [
        {
            title: "Bradford Mode (Balanced)",
            tag: "Recommended",
            description: "401(k) and IRA assets are EXEMPT from Zakat if you are under 59½.",
            basis: "Scholarly Basis: Sheikh Joe Bradford argues in his book \"Simple Zakat Guide: Understand and Calculate Your Zakat\" that the combined effect of the 10% penalty + income taxes (often 30-40% total) creates a substantial barrier similar to māl ḍimār (inaccessible wealth). This differs from other assets because the penalty is a Shariah-valid barrier (government restriction) rather than just a cost.",
            steps: [
                "Under 59½: $0 Zakat",
                "Over 59½: Zakatable on accessible amount"
            ],
            principles: [
                "Lacks Milk Tām: You don't have complete ownership—substantial portion goes to government",
                "Lacks Qudrah 'ala al-Tasarruf: The penalty creates a legal barrier to free disposition"
            ]
        },
        {
            title: "Hanafi / Maliki / Shafi'i / Hanbali",
            description: "Zakat is due on the 'Accessible Balance' (Net Cash Value).",
            basis: "The AMJA and general scholarly view is that despite the penalties, the wealth is owned. Dr. Yusuf Al-Qaradawi supports the view that Zakat is due on the net accessible amount or the invested portion once access is established.",
            steps: [
                "1. Take Vested Balance",
                "2. Deduct Taxes and Penalties (withdrawal cost)",
                "3. Pay 2.5% on the remaining 'Net' amount"
            ],
            principles: [
                "Wealth is owned even if difficult to access",
                "Deducting taxes/penalties determines true ownership value"
            ]
        }
    ],
    roth: {
        title: "Roth IRA",
        intro: "Roth contributions are post-tax and accessible:",
        points: [
            { label: "Contributions", text: "Always 100% Zakatable (can withdraw anytime)" },
            { label: "Earnings", text: "Follows same rules as 401(k) (Exempt in Bradford, Net Value in others)" }
        ]
    },
    hsa: {
        title: "HSA",
        text: "Fully Zakatable as it can be used for medical expenses at any time."
    },
    loans: {
        title: "401(k) Loans",
        text: "Loan proceeds are cash (Zakatable). The debt owed to your own 401(k) is NOT deductible."
    }
};
export const crypto = {
    id: "crypto",
    number: 7,
    title: "Cryptocurrency",
    icon: CurrencyBtc,
    intro: "Treated as currency or trade goods.",
    principle: {
        title: "General Rule",
        text: "Any crypto-asset purchased with the intent of short-term resale for profit (trading) is 100% Zakatable on its market value, regardless of the type of token or coin."
    },
    catA: {
        title: "Payment Tokens",
        intro: "BTC, ETH, Stablecoins",
        list: [
            { label: "Market Value", text: "Fully Zakatable" }
        ]
    },
    catB: {
        title: "Staking & DeFi",
        list: [
            { label: "Principal", text: "Fully Zakatable" },
            { label: "Rewards", text: "Zakatable when vested/claimed" }
        ]
    },
    nfts: {
        title: "NFTs",
        list: [
            { label: "For Trade", text: "Zakatable at market value" },
            { label: "Personal Collection", text: "Exempt (Qunya)" }
        ]
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
    intro: "Based on intent.",
    types: [
        {
            title: "Primary Home",
            ruling: "Exempt",
            text: "Personal use (qunya).",
            text1: "", desc1: "", text2: "", desc2: "", desc: ""
        },
        {
            title: "Rental Property",
            ruling: "Income Only",
            text: "Structure is exempt (productive asset). Net rental income held in cash is Zakatable.",
            text1: "", desc1: "", text2: "", desc2: "", desc: ""
        },
        {
            title: "Flipping",
            ruling: "Full Value",
            text: "Trade good. Entire market value is Zakatable.",
            text1: "", desc1: "", text2: "", desc2: "", desc: ""
        }
    ]
};
export const business = {
    id: "business",
    number: 10,
    title: "Business Assets",
    icon: Storefront,
    intro: "Zakat is on current assets, not fixed assets.",
    zakatable: {
        title: "Include",
        list: [
            { label: "Cash", text: "All business cash accounts" },
            { label: "Inventory", text: "Wholesale value of goods for sale" },
            { label: "Receivables", text: "Good debt owed to business" }
        ]
    },
    valuation: {
        title: "Valuation",
        text: "Value inventory at wholesale price (replacement cost)."
    },
    notZakatable: {
        title: "Exclude",
        list: [
            { label: "Equipment", text: "" },
            { label: "Fixtures", text: "" },
            { label: "Buildings", text: "" }
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
    intro: "Depends on ownership control.",
    revocable: { title: "Revocable", ruling: "Zakatable", text: "You still own it." },
    irrevocable: { title: "Irrevocable", intro: "", list: [{ label: "No Access", text: "Exempt" }, { label: "Access", text: "Zakatable" }] },
    custodial: { title: "Custodial", text: "Zakatable (guardian pays for child)." }
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
            "Assets: $45k Cash, $320k 401k (Vested), $60k Roth Contrib, $150k Passive ETF, $8k Jewelry",
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
            { label: "Gold Jewelry", value: "$8,000" },
            { label: "Total Gross", value: "$595,000", isTotal: true }
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
                title: "Bradford (Balanced)",
                details: [
                    "Cash: $57,000",
                    "401k: $0 (Exempt < 59½)",
                    "Roth: $60,000",
                    "Passive ETFs: $45,000 (30% Rule)",
                    "Jewelry: $0 (Exempt)",
                    "Total Assets: $162,000",
                    "Liabilities: -$41,000 (12-mo only)",
                    "Net Zakatable: $121,000"
                ],
                result: "$3,025"
            },
            {
                title: "Hanafi",
                details: [
                    "Cash: $57,000",
                    "401k: $185,600 (Net Accessible)",
                    "Roth: $60,000",
                    "Passive ETFs: $150,000 (100%)",
                    "Jewelry: $8,000 (Zakatable)",
                    "Total Assets: $460,600",
                    "Liabilities: -$241,000 (Full Deduction)",
                    "Net Zakatable: $219,600"
                ],
                result: "$5,490"
            },
            {
                title: "Maliki / Shafi'i",
                details: [
                    "Cash: $57,000",
                    "401k: $185,600 (Net Accessible)",
                    "Roth: $60,000",
                    "Passive ETFs: $150,000 (100%)",
                    "Jewelry: $0 (Exempt)",
                    "Total Assets: $452,600",
                    "Liabilities: -$41,000 (Immediate Only)",
                    "Net Zakatable: $411,600"
                ],
                result: "$10,290"
            },
            {
                title: "Hanbali",
                details: [
                    "Cash: $57,000",
                    "401k: $185,600 (Net Accessible)",
                    "Roth: $60,000",
                    "Passive ETFs: $150,000 (100%)",
                    "Jewelry: $0 (Exempt)",
                    "Total Assets: $452,600",
                    "Liabilities: -$241,000 (Full Deduction)",
                    "Net Zakatable: $211,600"
                ],
                result: "$5,290"
            }
        ]
    },
    summary: {
        title: "Impact",
        text: "Methodology matters. The same financial situation can result in Zakat ranging from $3,025 to $10,290 depending on how debts and assets are treated."
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
            id: 'balanced',
            label: 'Bradford (Balanced)',
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

