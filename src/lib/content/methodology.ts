
import { Gavel, Scales, Calendar, Wallet, TrendUp, ShieldCheck, CurrencyBtc, Coins, Buildings, Storefront, HandCoins, Users, ListNumbers, Table, BookOpen, Warning } from "@phosphor-icons/react";

export const methodologyContent = {
    header: {
        title: "Methodology & References",
        intro: "This comprehensive guide synthesizes scholarly works and methodologies from leading Islamic finance authorities to create a practical Zakat calculation framework for contemporary American Muslims.",
        primaryInfluences: "Sheikh Joe Bradford's \"Simple Zakat Guide\" and educational materials, the Assembly of Muslim Jurists of America (AMJA) fatwas, AAOIFI Shariah Standard 35, Islamic Finance Guru articles, and classical fiqh sources."
    },
    principles: {
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
    },
    nisab: {
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
                { label: "Gold Standard (85g)", text: "Approximately $6,500–$8,000 USD (varies with gold prices). This higher threshold exempts more people from Zakat." },
                { label: "Silver Standard (595g)", text: "Approximately $450–$600 USD (varies with silver prices). This lower threshold captures more Muslims in the obligation." }
            ]
        },
        consensus: {
            title: "Scholarly Consensus on Which to Use",
            text: "The majority of contemporary scholars, relief organizations, and Islamic finance researchers advocate for the silver standard when calculating Zakat on cash, bank accounts, and mixed financial assets. This position is based on two key Islamic legal principles:",
            principles: [
                { label: "Anfa' li'l-fuqara (Most beneficial for the poor)", text: "Using the lower threshold ensures more Zakat flows to those in need." },
                { label: "Ahwat (The precautionary principle)", text: "When in doubt, it is safer to pay Zakat than to risk neglecting an obligation." }
            ],
            note: "The gold standard remains valid for those whose wealth is held exclusively in physical gold bullion, as this directly matches the original measurement established by the Prophet (ﷺ)."
        },
        guidance: "Practical Guidance: If you possess wealth exceeding the silver niṣāb, you are undoubtedly wealthy enough to contribute. This conservative approach ensures no eligible Zakat is missed and maximizes benefit to Zakat recipients."
    },
    hawl: {
        id: "hawl",
        number: 3,
        title: "The Ḥawl (Zakat Year)",
        icon: Calendar,
        intro: "Zakat is an annual obligation, not a transaction tax. For wealth to be Zakatable, it must be held above the niṣāb threshold for one complete lunar year (ḥawl). The ḥawl begins when your assets first reach the niṣāb, or from the date you last paid Zakat.",
        lunarSolar: {
            title: "Lunar vs. Solar Year",
            lunar: {
                title: "Lunar Year (Islamic Calendar)",
                points: ["354 days in length", "Traditional Zakat rate: 2.5%", "Many Muslims align with Ramadan for spiritual benefits", "Follows the original practice of the Prophet (ﷺ)"]
            },
            solar: {
                title: "Solar Year (Gregorian Calendar)",
                points: ["365 days in length", "Adjusted Zakat rate: 2.577%", "Convenient for those using fiscal/calendar year", "Compensates for the longer year"]
            }
        },
        rateAdjustment: {
            title: "Why the Rate Adjustment?",
            text: "The solar year is approximately 11 days longer than the lunar year. Over a lifetime, this difference compounds significantly—33 solar years equal approximately 34 lunar years. Without adjustment, those using the solar calendar would pay less Zakat over their lifetime, shortchanging recipients.",
            formula: "2.5% × (365.25 ÷ 354.37) ≈ 2.577%"
        },
        dateChoice: {
            title: "Choosing Your Zakat Date",
            intro: "Select a date that is easy to remember and maintain consistently each year. Common choices include:",
            options: [
                "The first of Ramadan (lunar calendar)",
                "January 1st (convenient for financial planning)",
                "The anniversary of when you first exceeded the niṣāb",
                "Your birthday or another personally significant date"
            ],
            note: "Consistency matters more than the specific date. Once chosen, maintain the same Zakat date each year."
        }
    },
    liquid: {
        id: "liquid",
        number: 4,
        title: "Liquid Assets & Cash",
        icon: Wallet,
        intro: "The consensus among contemporary scholars is that fiat currency (USD, etc.) takes the ruling of gold and silver as a store of value and medium of exchange. Therefore, the entire closing balance of all liquid accounts on your Zakat date is liable for Zakat.",
        assets: {
            title: "What Counts as Liquid Assets",
            list: [
                { label: "Checking Accounts", text: "Full balance is Zakatable" },
                { label: "Savings Accounts", text: "Full balance is Zakatable (interest must be tracked separately)" },
                { label: "Cash on Hand", text: "Physical currency in your wallet, home safe, or anywhere else" },
                { label: "Digital Wallets", text: "PayPal, Venmo, CashApp, Zelle, Apple Pay Cash, and similar balances" },
                { label: "Foreign Currency", text: "Convert to USD at the current spot exchange rate on your Zakat date" },
                { label: "Money Market Accounts", text: "Treated the same as savings accounts" },
                { label: "Certificates of Deposit (CDs)", text: "Zakatable if accessible (even with penalty)" }
            ]
        },
        interest: {
            title: "Interest (Riba) Separation",
            text1: "According to Islamic law, interest earned is not considered owned wealth—it is \"impure\" money that does not belong to you. You cannot pay Zakat on interest, nor pay Zakat with interest money.",
            text2: "Interest must be purified by donating it to general charity. This is not Zakat and carries no spiritual reward—it is simply returning impure money. Track your year-to-date interest separately and donate it to charitable causes."
        }
    },
    stocks: {
        id: "stocks",
        number: 5,
        title: "Stocks & Investments",
        icon: TrendUp,
        intro: "The treatment of stocks depends on your intent (nawā). When you own shares, you own a percentage of the company entity—this creates two distinct categories with different Zakat implications, known in classical fiqh as Mudir (trader) vs Muhtakir (holder).",
        mudir: {
            title: "Mudir: Active Holdings (Trading)",
            text: "If you purchase stocks with the intention to sell in the short-term for capital gain (day trading, swing trading, momentum investing), you are classified as a Mudir (trader). The stocks are ʿurūḍ al-tijārah (commercial merchandise).",
            calculation: "Pay 2.5% (or 2.577% for solar year) on 100% of the market value on your Zakat date."
        },
        muhtakir: {
            title: "Muhtakir: Passive Holdings (Long-Term Investment)",
            text: "If shares are held for long-term appreciation and dividends (buy and hold strategy), you are classified as a Muhtakir (holder). In this case, Zakat shifts from the full market value to the company's Zakatable assets."
        },
        rule30: {
            title: "The 30% Rule: Derivation & Application",
            standard: "AAOIFI Shariah Standard 35 (SS35)",
            description: "Research by AAOIFI analyzed the balance sheets of Shariah-compliant companies and found that Net Current Assets (cash + receivables + inventory − current liabilities) average approximately 30% of market capitalization.",
            formula: "Market Value × 30% × 2.5% = Zakat Due",
            effectiveRate: "Effective rate: 0.75% of portfolio value",
            note: "This proxy is used because calculating precise Net Current Assets for each company in a diversified portfolio is impractical for individual investors."
        },
        exclusions: {
            title: "Important Exclusions",
            list: [
                { label: "Unvested RSUs", text: "Not Zakatable until vested—you don't own them yet" },
                { label: "ESPP", text: "Not Zakatable until shares are purchased and transferred to you" },
                { label: "Stock Options", text: "Not Zakatable until exercised and converted to actual shares" }
            ]
        },
        purification: {
            title: "Dividend Purification",
            text: "If a company derives revenue from impermissible sources (interest income, alcohol, gambling), that portion of dividends must be purified by donating to charity—separate from Zakat. Most Shariah-compliant screens allow up to 5% impermissible revenue."
        }
    },
    retirement: {
        id: "retirement",
        number: 6,
        title: "Retirement Accounts (401k, IRA, Roth)",
        icon: ShieldCheck,
        intro: "Retirement accounts present the most complex Zakat challenge in contemporary Islamic finance due to access restrictions, early withdrawal penalties, and deferred taxation. The central question is whether these funds meet the criteria of Milk Tām (complete possession) and Qudrah 'ala al-Tasarruf (ability to dispose).",
        approachesIntro: "ZakatFlow offers three calculation modes based on different scholarly interpretations:",
        approaches: [
            {
                title: "1. Conservative (Precautionary)",
                description: "Pay Zakat on the full gross value of all retirement accounts. This follows the principle of ahwat (precaution)—when in doubt, fulfill the maximum obligation.",
                basis: "Basis: Some scholars argue the funds ARE accessible (the penalty is a deterrent, not a prohibition), so full Zakat applies."
            },
            {
                title: "2. Optimized (Tax-Adjusted)",
                description: "Apply the Accessible Balance Method: deduct estimated taxes and early withdrawal penalties (if under 59½) to calculate the net accessible amount.",
                steps: [
                    "Start with Vested Balance only",
                    "Subtract 10% early withdrawal penalty (if under 59½)",
                    "Subtract estimated federal + state taxes",
                    "Result = Net Zakatable Value"
                ],
                basis: "Basis: AMJA position that it's unjust to pay Zakat on money that effectively belongs to the government (taxes/penalties)."
            },
            {
                title: "3. Bradford Exclusion Rule",
                tag: "New",
                description: "Traditional 401(k) and Traditional IRA accounts are fully exempt from Zakat if you are under age 59½.",
                basis: "Scholarly Basis: Sheikh Joe Bradford argues in \"Zakat on Retirement Plans Revisited\" that the combined effect of the 10% penalty + income taxes (often 30-40% total) creates a substantial barrier similar to māl ḍimār (inaccessible wealth).",
                principles: [
                    "Lacks Milk Tām: You don't have complete ownership—substantial portion goes to government",
                    "Lacks Qudrah 'ala al-Tasarruf: The penalty creates a legal barrier to free disposition",
                    "Roth IRA Contributions remain 100% Zakatable (accessible tax-free anytime)",
                    "Once you reach 59½, the penalty disappears and accounts become Zakatable (after-tax value)"
                ]
            }
        ],
        roth: {
            title: "Roth IRA (Special Treatment)",
            intro: "Roth IRAs function differently because contributions are made with after-tax dollars:",
            points: [
                { label: "Contributions (Principal)", text: "Can be withdrawn tax-free and penalty-free at any time. Always 100% Zakatable under all modes." },
                { label: "Earnings", text: "Subject to the 5-year rule and age 59½ requirement. Follow the same mode rules as 401(k)." }
            ]
        },
        hsa: {
            title: "HSA (Health Savings Account)",
            text: "HSA funds are fully accessible for qualified medical expenses without penalty at any age. Therefore, the entire HSA balance is fully Zakatable under all modes."
        },
        loans: {
            title: "Important Note on 401(k) Loans",
            text: "If you've taken a loan from your 401(k), that money is now cash in your possession (Zakatable as a liquid asset). The outstanding loan is NOT a deductible liability for Zakat purposes—you owe this money to yourself, not to an external creditor."
        }
    },
    crypto: {
        id: "crypto",
        number: 7,
        title: "Cryptocurrency & Digital Assets",
        icon: CurrencyBtc,
        intro: "Cryptocurrency occupies a unique position in Islamic jurisprudence, spanning the line between currency (thaman) and speculative trade goods (ʿurūḍ al-tijārah). The PDF methodology treats cryptocurrency at full market value.",
        principle: {
            title: "The Fundamental Principle",
            text: "Any crypto-asset purchased with the intent of short-term resale for profit (trading) is 100% Zakatable on its market value, regardless of the type of token or coin."
        },
        catA: {
            title: "Category A: Cryptocurrencies (Payment Tokens)",
            intro: "Major cryptocurrencies that function as mediums of exchange are treated as currency. Zakat is due on 100% of market value regardless of your holding intent.",
            list: [
                { label: "Bitcoin (BTC)", text: "Widely accepted as payment—fully Zakatable" },
                { label: "Ethereum (ETH)", text: "Used for transactions and gas fees—fully Zakatable" },
                { label: "Stablecoins (USDC, USDT, DAI)", text: "Pegged to fiat—fully Zakatable" }
            ]
        },
        catB: {
            title: "Category B: Staking & DeFi",
            list: [
                { label: "Staking Principal", text: "You retain ownership; fully Zakatable" },
                { label: "Staking Rewards (Vested)", text: "Only accessible rewards are Zakatable; locked rewards are exempt until possession" },
                { label: "Liquidity Pools", text: "Zakat on the current redeemable value (account for impermanent loss)" }
            ]
        },
        nfts: {
            title: "NFTs (Non-Fungible Tokens)",
            list: [
                { label: "NFTs held for resale", text: "Commercial merchandise—fully Zakatable at estimated market value" },
                { label: "NFTs kept for personal enjoyment", text: "Like art on your walls—generally exempt" }
            ]
        }
    },
    metals: {
        id: "metals",
        number: 8,
        title: "Gold, Silver & Jewelry",
        icon: Coins,
        intro: "Gold and silver hold special significance in Zakat law as they were the original basis for the niṣāb measurement and the only commodities explicitly mentioned in the Prophetic traditions.",
        alwaysZakatable: {
            title: "What Is Always Zakatable",
            list: [
                { label: "Gold and silver bullion", text: "Bars, ingots, coins held as investment—fully Zakatable" },
                { label: "Gold/silver in investment accounts", text: "Paper gold, gold ETFs—fully Zakatable" },
                { label: "Gold/silver coins", text: "Whether collectible or bullion—Zakatable on metal content value" }
            ]
        },
        jewelry: {
            title: "The Jewelry Controversy",
            intro: "The treatment of personal jewelry is one of the most debated topics in Zakat jurisprudence:",
            views: [
                { title: "Majority View (Shafi'i, Maliki, Hanbali)", text: "Jewelry that is permissible and worn regularly is exempt from Zakat. It is treated like clothing and other personal items." },
                { title: "Hanafi View (Ahwat)", text: "Gold and silver are inherently \"growing wealth\" (Nāmī) by nature, regardless of form. Therefore, even worn jewelry is Zakatable on its melt value." }
            ],
            precaution: {
                title: "Precautionary Stance (Bradford Recommendation)",
                text: "Given the strong Hanafi evidence and the principle of ahwat (precaution), paying Zakat on jewelry—especially large amounts kept in storage—is the safer approach. Daily-wear jewelry in modest amounts may reasonably follow the majority exemption."
            },
            valuation: {
                title: "Valuation Method",
                intro: "When paying Zakat on jewelry, calculate based on the melt value (scrap value) of the metal content only:",
                points: ["Gemstones are not Zakatable (unless the jewelry is trade inventory)", "Craftsmanship premium is not included", "Only the weight of gold/silver × current spot price"]
            }
        }
    },
    realEstate: {
        id: "realestate",
        number: 9,
        title: "Real Estate",
        icon: Buildings,
        intro: "Real estate treatment in Zakat depends entirely on the owner's intent. The same property can have vastly different Zakat implications based on how it is used or held.",
        types: [
            {
                title: "Primary Residence",
                ruling: "Ruling: Completely Exempt",
                text: "Your home used for personal shelter is qunya (personal use property) and is never subject to Zakat, regardless of its value."
            },
            {
                title: "Rental Property (Investment)",
                text1: "Property Value: Not Zakatable",
                desc1: "The property itself is a productive asset, similar to business equipment or machinery.",
                text2: "Net Rental Income: Zakatable",
                desc2: "Rental income that remains in your bank account on your Zakat date IS Zakatable as part of your liquid assets."
            },
            {
                title: "Property Held for Flipping/Resale",
                ruling: "Ruling: Fully Zakatable",
                text: "If property was purchased with the express intent to sell for profit, it is classified as trade goods.",
                desc: "Pay Zakat on the full current market value annually."
            }
        ]
    },
    business: {
        id: "business",
        number: 10,
        title: "Business Assets",
        icon: Storefront,
        intro: "For business owners, Zakat is calculated on the Zakatable portion of business assets, not the entire value of the business.",
        zakatable: {
            title: "What IS Zakatable",
            list: [
                { label: "Cash and bank balances", text: "All business cash accounts" },
                { label: "Accounts receivable", text: "Money owed to you by customers (if collectible)" },
                { label: "Inventory", text: "Goods held for sale" },
                { label: "Raw materials", text: "Materials intended for production and sale" }
            ]
        },
        valuation: {
            title: "Inventory Valuation Method",
            text: "Use wholesale/replacement cost, not retail selling price. This follows the principle that Zakat is calculated on what you could reasonably liquidate the inventory for, not the maximum retail value."
        },
        notZakatable: {
            title: "What Is NOT Zakatable",
            list: [
                { label: "Fixed assets", text: "Equipment, machinery, furniture used in business operations" },
                { label: "Real estate", text: "Buildings and land used for business (not held for resale)" },
                { label: "Vehicles", text: "Company cars, trucks used in operations" },
                { label: "Goodwill", text: "Brand value and intangible assets" }
            ]
        }
    },
    debts: {
        id: "debts",
        number: 11,
        title: "Debts & Liabilities",
        icon: HandCoins,
        receivables: {
            title: "Debts Owed TO You (Receivables)",
            intro: "Money that others owe you is potentially Zakatable, depending on the likelihood of collection:",
            good: {
                title: "Good Debt (Dayn Qawiyy)",
                text: "If the borrower is willing and able to pay, this debt is effectively like cash in your pocket. Pay Zakat on the full amount annually."
            },
            bad: {
                title: "Bad Debt (Dayn Da'if)",
                text: "If the borrower is unable or unwilling to pay, the debt is not Zakatable until actually collected."
            }
        },
        liabilities: {
            title: "Debts Owed BY You (Liabilities)",
            intro: "The classical schools differ on how debts reduce Zakatable wealth:",
            views: [
                { title: "Hanafi", text: "Full debt deduction allowed—Zakat only on net worth" },
                { title: "Maliki (Middle Path)", text: "Only debts due within one year are deductible" },
                { title: "Shafi'i/Hanbali", text: "No debt deduction—Zakat on gross wealth" }
            ],
            zakatFlowView: "ZakatFlow follows the Maliki middle path as adopted by AMJA: only immediate obligations (due within 12 months) reduce your Zakatable wealth."
        },
        deductible: {
            title: "Deductible Debts (Immediate Obligations)",
            list: [
                "Credit card balances (due immediately)",
                "Unpaid bills and invoices",
                "Short-term personal loans",
                "Business accounts payable due soon",
                "12 months of mortgage payments",
                "12 months of student loan payments",
                "12 months of car loan payments"
            ]
        },
        notDeductible: {
            title: "NOT Deductible",
            list: [
                "Full mortgage principal (only 12 months of payments)",
                "Full student loan balance (only 12 months of payments)",
                "401(k) loans: Not deductible—you owe this to yourself"
            ]
        },
        guidance: {
            title: "Practical Guidance",
            text: "The general principle: Deduct only what you are actually obligated to pay within the coming year. A 30-year mortgage does not negate 29 years of Zakat obligation."
        }
    },
    trusts: {
        id: "trusts",
        number: 12,
        title: "Trusts",
        icon: Users,
        intro: "Trusts add a layer of complexity to Zakat calculations because they separate legal ownership from beneficial use. The key is analyzing Milk Tām (complete possession)—specifically Raqabah (legal title) and Yad (ability to access and control).",
        revocable: {
            title: "Revocable Living Trusts",
            ruling: "Ruling: Fully Zakatable",
            text: "The Grantor retains full control and can revoke the trust at any time. Treat all assets in the trust as your personal property."
        },
        irrevocable: {
            title: "Irrevocable Trusts",
            intro: "In an irrevocable trust, the Grantor theoretically gives up ownership to a Trustee:",
            list: [
                { label: "If you CANNOT access principal", text: "Not Zakatable by you (lacks Milk Tām). The beneficiaries may have Zakat obligations when they receive distributions." },
                { label: "If you CAN access principal", text: "Zakatable as your property, despite the trust structure." }
            ]
        },
        custodial: {
            title: "Custodial Accounts (UTMA/UGMA)",
            text: "Assets in custodial accounts belong to the minor child, not the custodian parent. If the child's assets exceed the niṣāb, Zakat is due—typically paid by the parent on the child's behalf from the child's assets."
        }
    },
    example: {
        id: "example",
        number: 13,
        title: "Example: The Ahmed Family",
        icon: ListNumbers,
        intro: "To illustrate how different calculation modes affect Zakat, let's walk through a comprehensive example based on the methodology document.",
        profile: {
            title: "Family Profile",
            items: [
                "Ahmed (age 42) and Fatima (age 40)",
                "Using Silver Standard niṣāb (~$500)",
                "Combined tax rate: 32% (federal + state)",
                "Paying Zakat on Lunar Calendar (2.5%)"
            ]
        },
        assets: {
            title: "Their Assets",
            table: [
                { label: "Checking & Savings", value: "$45,000" },
                { label: "401(k) Vested Balance (Ahmed)", value: "$320,000" },
                { label: "Roth IRA Contributions (Fatima)", value: "$60,000" },
                { label: "Passive Index Funds", value: "$150,000" },
                { label: "Gold Jewelry (Fatima)", value: "$8,000" },
                { label: "Rental Income in Bank", value: "$12,000" },
                { label: "Total Gross Assets", value: "$595,000", isTotal: true }
            ]
        },
        liabilities: {
            title: "Their Liabilities",
            table: [
                { label: "Mortgage (12 months @ $3,000/mo)", value: "$36,000" },
                { label: "Credit Card Balance", value: "$5,000" },
                { label: "Total Deductible Liabilities", value: "$41,000", isTotal: true }
            ]
        },
        calculation: {
            title: "Calculation by Mode",
            modes: [
                {
                    title: "Mode 1: Conservative",
                    details: [
                        "Cash + Rental Income: $45,000 + $12,000 = $57,000",
                        "401(k) full value: $320,000",
                        "Roth Contributions: $60,000",
                        "Passive Stocks (100%): $150,000",
                        "Gold Jewelry (Hanafi): $8,000",
                        "Total Assets: $595,000",
                        "Less Liabilities: -$41,000",
                        "Net Zakatable: $554,000"
                    ],
                    result: "Zakat Due: $554,000 × 2.5% = $13,850"
                },
                {
                    title: "Mode 2: Optimized",
                    details: [
                        "Cash + Rental Income: $57,000",
                        "401(k) after tax/penalty: $320,000 × (1 - 0.32 - 0.10) = $185,600",
                        "Roth Contributions: $60,000",
                        "Passive Stocks (30% rule): $150,000 × 30% = $45,000",
                        "Gold Jewelry (Hanafi): $8,000",
                        "Total Assets: $355,600",
                        "Less Liabilities: -$41,000",
                        "Net Zakatable: $314,600"
                    ],
                    result: "Zakat Due: $314,600 × 2.5% = $7,865"
                },
                {
                    title: "Mode 3: Bradford Exclusion Rule",
                    details: [
                        "Cash + Rental Income: $57,000",
                        "401(k) (EXEMPT under 59½): $0",
                        "Roth Contributions (always zakatable): $60,000",
                        "Passive Stocks (30% rule): $45,000",
                        "Gold Jewelry (Hanafi): $8,000",
                        "Total Assets: $170,000",
                        "Less Liabilities: -$41,000",
                        "Net Zakatable: $129,000"
                    ],
                    result: "Zakat Due: $129,000 × 2.5% = $3,225"
                }
            ]
        },
        summary: {
            title: "Summary",
            text: "The Ahmed family's Zakat obligation ranges from $3,225 (Bradford) to $13,850 (Conservative) depending on which scholarly interpretation they follow. All three positions are valid—the choice depends on personal conviction and scholarly guidance."
        }
    },
    modes: {
        id: "modes",
        number: 14,
        title: "Calculation Modes Compared",
        icon: Table,
        intro: "ZakatFlow offers three calculation modes to accommodate different scholarly interpretations. This table summarizes how each asset type is treated under each mode.",
        comparisonTable: [
            { asset: "Cash & Liquid Assets", conservative: "100%", optimized: "100%", bradford: "100%" },
            { asset: "Active Stocks (Trading)", conservative: "100%", optimized: "100%", bradford: "100%" },
            { asset: "Passive Stocks (Long-term)", conservative: "100%", optimized: "30% rule", bradford: "30% rule" },
            { asset: "401(k)/IRA (under 59½)", conservative: "100%", optimized: "After tax/penalty", bradford: "EXEMPT" },
            { asset: "401(k)/IRA (59½+)", conservative: "100%", optimized: "After tax", bradford: "After tax" },
            { asset: "Roth IRA Contributions", conservative: "100%", optimized: "100%", bradford: "100%" },
            { asset: "Roth IRA Earnings (under 59½)", conservative: "100%", optimized: "After penalty", bradford: "EXEMPT" },
            { asset: "HSA Balance", conservative: "100%", optimized: "100%", bradford: "100%" },
            { asset: "Cryptocurrency", conservative: "100%", optimized: "100%", bradford: "100%" },
            { asset: "Gold & Silver", conservative: "100%", optimized: "100%", bradford: "100%" }
        ],
        notes: {
            title: "Choosing a Mode",
            text: "Conservative is for those who prefer maximum certainty and precaution. Optimized balances scholarly opinion with practical accessibility. Bradford follows Sheikh Joe Bradford's specific ruling on retirement accounts. All three are valid scholarly positions."
        }
    },
    references: {
        id: "references",
        number: 15,
        title: "References & Works Cited",
        icon: BookOpen,
        primary: {
            title: "Primary Sources",
            list: [
                { name: "Sheikh Joe Bradford", text: "\"Simple Zakat Guide: Understand and Calculate Your Zakat\" — A comprehensive book and methodology for American Muslims. Also: \"Zakat on Retirement Plans Revisited\" (article).", link: { url: "https://joebradford.net", display: "joebradford.net" } },
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
    }
};
