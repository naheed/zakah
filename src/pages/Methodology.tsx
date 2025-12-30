import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { Footer } from "@/components/zakat/Footer";
import { getPrimaryUrl } from "@/lib/domainConfig";
import { ReadingProgress } from "@/components/ui/reading-progress";
import { FloatingToc } from "@/components/ui/floating-toc";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { AnimatedSectionHeader } from "@/components/ui/animated-section-header";
import { 
  ArrowLeft, 
  Scales, 
  Calendar, 
  Coins, 
  Buildings, 
  TrendUp, 
  ShieldCheck, 
  Wallet, 
  CurrencyBtc, 
  Storefront, 
  HandCoins, 
  Users, 
  BookOpen,
  Warning
} from "@phosphor-icons/react";

const tocItems = [
  { id: "nisab", number: 1, label: "The Niṣāb Threshold" },
  { id: "hawl", number: 2, label: "The Ḥawl (Zakat Year)" },
  { id: "liquid", number: 3, label: "Liquid Assets & Cash" },
  { id: "stocks", number: 4, label: "Stocks & Investments" },
  { id: "retirement", number: 5, label: "Retirement Accounts" },
  { id: "crypto", number: 6, label: "Cryptocurrency" },
  { id: "metals", number: 7, label: "Gold, Silver & Jewelry" },
  { id: "realestate", number: 8, label: "Real Estate" },
  { id: "business", number: 9, label: "Business Assets" },
  { id: "debts", number: 10, label: "Debts & Liabilities" },
  { id: "trusts", number: 11, label: "Trusts" },
  { id: "references", number: 12, label: "References" },
];

const Methodology = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <>
      <Helmet>
        <title>Zakat Methodology & References - ZakatFlow</title>
        <meta 
          name="description" 
          content="Comprehensive scholarly methodology and Islamic jurisprudence behind ZakatFlow's Zakat calculations. Based on AMJA guidance, Joe Bradford's works, and Islamic Finance Guru." 
        />
        <link rel="canonical" href={getPrimaryUrl('/methodology')} />
        <meta property="og:url" content={getPrimaryUrl('/methodology')} />
      </Helmet>
      
      <ReadingProgress />
      <FloatingToc items={tocItems} />
      
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back Button */}
          <ScrollReveal>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="mb-8 gap-2"
            >
              <ArrowLeft className="w-4 h-4" weight="bold" />
              Back to Calculator
            </Button>
          </ScrollReveal>

          {/* Header */}
          <ScrollReveal delay={0.1}>
            <header className="mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-serif">
                Methodology & References
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                This comprehensive guide was compiled using Gemini 3.0 Deep Research, synthesizing and organizing 
                the scholarly works and methodologies from leading Islamic finance authorities to create a practical 
                Zakat calculation framework for contemporary American Muslims.
              </p>
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Primary Influences:</strong> The methodology draws heavily from 
                  Sheikh Joe Bradford's "Simple Zakat Guide" and educational materials, the Assembly of Muslim Jurists 
                  of America (AMJA) fatwas, Zakat.fyi resources, Islamic Finance Guru articles, and AAOIFI Shariah Standard 35.
                </p>
              </div>
            </header>
          </ScrollReveal>

          {/* Sections */}
          <div className="space-y-16">
            
            {/* Nisab Section */}
            <section id="nisab">
              <AnimatedSectionHeader 
                number={1} 
                title="The Niṣāb Threshold" 
                icon={<Scales className="w-5 h-5 text-primary" weight="duotone" />}
              />
              
              <div className="space-y-4 text-muted-foreground">
                <ScrollReveal>
                  <p>
                    The niṣāb is the minimum amount of wealth a Muslim must possess before Zakat becomes obligatory. 
                    It acts as the "poverty line in reverse"—wealth below this limit is exempt, while wealth at or 
                    above it triggers the Zakat obligation.
                  </p>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Historical Foundation</h3>
                  <p>
                    The Prophet Muhammad (ﷺ) established two niṣāb measurements:
                  </p>
                </ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-2" staggerDelay={0.05}>
                  <StaggerItem><li><strong className="text-foreground">Gold:</strong> 20 mithqals, equivalent to approximately 85 grams (≈3 ounces)</li></StaggerItem>
                  <StaggerItem><li><strong className="text-foreground">Silver:</strong> 200 dirhams, equivalent to approximately 595 grams (≈21 ounces)</li></StaggerItem>
                </StaggerContainer>
                <ScrollReveal>
                  <p>
                    In the Prophet's time, these two amounts were roughly equivalent in purchasing power. Today, 
                    due to the divergence between gold and silver prices, they represent vastly different thresholds.
                  </p>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">The Modern Divergence</h3>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <ul className="space-y-3">
                      <li>
                        <strong className="text-foreground">Gold Standard (85g):</strong> Approximately $6,500–$8,000 USD (varies with gold prices). 
                        This higher threshold exempts more people from Zakat.
                      </li>
                      <li>
                        <strong className="text-foreground">Silver Standard (595g):</strong> Approximately $450–$600 USD (varies with silver prices). 
                        This lower threshold captures more Muslims in the obligation.
                      </li>
                    </ul>
                  </div>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Scholarly Consensus on Which to Use</h3>
                  <p>
                    The majority of contemporary scholars, relief organizations, and Islamic finance researchers 
                    advocate for the <strong className="text-foreground">silver standard</strong> when calculating Zakat on cash, 
                    bank accounts, and mixed financial assets. This position is based on two key Islamic legal principles:
                  </p>
                </ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-2" staggerDelay={0.05}>
                  <StaggerItem>
                    <li>
                      <strong className="text-foreground"><em>Anfa' li'l-fuqara</em> (Most beneficial for the poor):</strong> Using 
                      the lower threshold ensures more Zakat flows to those in need.
                    </li>
                  </StaggerItem>
                  <StaggerItem>
                    <li>
                      <strong className="text-foreground"><em>Ahwat</em> (The precautionary principle):</strong> When in doubt, 
                      it is safer to pay Zakat than to risk neglecting an obligation.
                    </li>
                  </StaggerItem>
                </StaggerContainer>
                <ScrollReveal>
                  <p>
                    The gold standard remains valid for those whose wealth is held exclusively in physical gold bullion, 
                    as this directly matches the original measurement established by the Prophet (ﷺ).
                  </p>
                </ScrollReveal>

                <ScrollReveal>
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mt-6">
                    <p className="text-sm">
                      <strong className="text-foreground">Practical Guidance:</strong> If you possess wealth exceeding the silver 
                      niṣāb, you are undoubtedly wealthy enough to contribute. This conservative approach ensures no 
                      eligible Zakat is missed and maximizes benefit to Zakat recipients.
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </section>

            <Separator />

            {/* Hawl Section */}
            <section id="hawl">
              <AnimatedSectionHeader 
                number={2} 
                title="The Ḥawl (Zakat Year)" 
                icon={<Calendar className="w-5 h-5 text-primary" weight="duotone" />}
              />
              
              <div className="space-y-4 text-muted-foreground">
                <ScrollReveal>
                  <p>
                    Zakat is an <strong className="text-foreground">annual obligation</strong>, not a transaction tax. 
                    For wealth to be Zakatable, it must be held above the niṣāb threshold for one complete lunar year (ḥawl). 
                    The ḥawl begins when your assets first reach the niṣāb, or from the date you last paid Zakat.
                  </p>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Lunar vs. Solar Year</h3>
                </ScrollReveal>
                
                <ScrollReveal>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <h4 className="font-medium text-foreground mb-2">Lunar Year (Islamic Calendar)</h4>
                      <ul className="text-sm space-y-1">
                        <li>• 354 days in length</li>
                        <li>• Traditional Zakat rate: <strong className="text-foreground">2.5%</strong></li>
                        <li>• Many Muslims align with Ramadan for spiritual benefits</li>
                        <li>• Follows the original practice of the Prophet (ﷺ)</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <h4 className="font-medium text-foreground mb-2">Solar Year (Gregorian Calendar)</h4>
                      <ul className="text-sm space-y-1">
                        <li>• 365 days in length</li>
                        <li>• Adjusted Zakat rate: <strong className="text-foreground">2.577%</strong></li>
                        <li>• Convenient for those using fiscal/calendar year</li>
                        <li>• Compensates for the longer year</li>
                      </ul>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Why the Rate Adjustment?</h3>
                  <p>
                    The solar year is approximately 11 days longer than the lunar year. Over a lifetime, this difference 
                    compounds significantly—33 solar years equal approximately 34 lunar years. Without adjustment, 
                    those using the solar calendar would pay less Zakat over their lifetime, shortchanging recipients.
                  </p>
                  <p className="mt-2">
                    The adjusted rate is calculated as: <code className="px-2 py-1 rounded bg-muted text-foreground">2.5% × (365.25 ÷ 354.37) ≈ 2.577%</code>
                  </p>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Choosing Your Zakat Date</h3>
                  <p>
                    Select a date that is easy to remember and maintain consistently each year. Common choices include:
                  </p>
                </ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-1" staggerDelay={0.05}>
                  <StaggerItem><li>The first of Ramadan (lunar calendar)</li></StaggerItem>
                  <StaggerItem><li>January 1st (convenient for financial planning)</li></StaggerItem>
                  <StaggerItem><li>The anniversary of when you first exceeded the niṣāb</li></StaggerItem>
                  <StaggerItem><li>Your birthday or another personally significant date</li></StaggerItem>
                </StaggerContainer>
                <ScrollReveal>
                  <p className="mt-2">
                    <strong className="text-foreground">Consistency matters more than the specific date.</strong> Once chosen, 
                    maintain the same Zakat date each year.
                  </p>
                </ScrollReveal>
              </div>
            </section>

            <Separator />

            {/* Liquid Assets Section */}
            <section id="liquid">
              <AnimatedSectionHeader 
                number={3} 
                title="Liquid Assets & Cash" 
                icon={<Wallet className="w-5 h-5 text-primary" weight="duotone" />}
              />
              
              <div className="space-y-4 text-muted-foreground">
                <ScrollReveal>
                  <p>
                    The consensus among contemporary scholars is that <strong className="text-foreground">fiat currency (USD, etc.) 
                    takes the ruling of gold and silver</strong> as a store of value and medium of exchange. Therefore, the 
                    entire closing balance of all liquid accounts on your Zakat date is liable for Zakat.
                  </p>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">What Counts as Liquid Assets</h3>
                </ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-2" staggerDelay={0.05}>
                  <StaggerItem><li><strong className="text-foreground">Checking Accounts:</strong> Full balance is Zakatable</li></StaggerItem>
                  <StaggerItem><li><strong className="text-foreground">Savings Accounts:</strong> Full balance is Zakatable (interest must be tracked separately)</li></StaggerItem>
                  <StaggerItem><li><strong className="text-foreground">Cash on Hand:</strong> Physical currency in your wallet, home safe, or anywhere else</li></StaggerItem>
                  <StaggerItem><li><strong className="text-foreground">Digital Wallets:</strong> PayPal, Venmo, CashApp, Zelle, Apple Pay Cash, and similar balances</li></StaggerItem>
                  <StaggerItem><li><strong className="text-foreground">Foreign Currency:</strong> Convert to USD at the current spot exchange rate on your Zakat date</li></StaggerItem>
                  <StaggerItem><li><strong className="text-foreground">Money Market Accounts:</strong> Treated the same as savings accounts</li></StaggerItem>
                  <StaggerItem><li><strong className="text-foreground">Certificates of Deposit (CDs):</strong> Zakatable if accessible (even with penalty)</li></StaggerItem>
                </StaggerContainer>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Interest (Riba) Separation</h3>
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm">
                      According to Islamic law, interest earned is not considered owned wealth—it is "impure" money that 
                      does not belong to you. You <strong className="text-foreground">cannot pay Zakat on interest, nor pay 
                      Zakat with interest money</strong>.
                    </p>
                    <p className="text-sm mt-2">
                      Interest must be <strong className="text-foreground">purified</strong> by donating it to general charity. 
                      This is not Zakat and carries no spiritual reward—it is simply returning impure money. Track your 
                      year-to-date interest separately and donate it to charitable causes.
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </section>

            <Separator />

            {/* Stocks Section */}
            <section id="stocks">
              <AnimatedSectionHeader 
                number={4} 
                title="Stocks & Investments" 
                icon={<TrendUp className="w-5 h-5 text-primary" weight="duotone" />}
              />
              
              <div className="space-y-4 text-muted-foreground">
                <ScrollReveal>
                  <p>
                    The treatment of stocks depends on your <strong className="text-foreground">intent</strong>. When you own 
                    shares, you own a percentage of the company entity—this creates two distinct categories with different 
                    Zakat implications.
                  </p>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Active Holdings (Trading)</h3>
                  <p>
                    If you purchase stocks with the intention to sell in the short-term for capital gain (day trading, 
                    swing trading, momentum investing), the stocks are classified as <strong className="text-foreground">commercial 
                    merchandise (ʿurūḍ al-tijārah)</strong>.
                  </p>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border mt-2">
                    <p className="font-medium text-foreground">Zakat Calculation:</p>
                    <p className="text-sm">Pay 2.5% (or 2.577% for solar year) on <strong>100% of the market value</strong> on your Zakat date.</p>
                  </div>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Passive Holdings (Long-Term Investment)</h3>
                  <p>
                    If shares are held for long-term appreciation and dividends (buy and hold strategy), the shareholder 
                    is considered a passive investor, not a trader. In this case, Zakat shifts from the full market value 
                    to the <strong className="text-foreground">company's Zakatable assets</strong>.
                  </p>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">The 30% Rule (AAOIFI Standard 35)</h3>
                  <p>
                    Research by AAOIFI shows that the liquid/zakatable assets of Shariah-compliant companies 
                    average approximately <strong className="text-foreground">30% of market capitalization</strong>.
                  </p>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border mt-2">
                    <p className="font-medium text-foreground">Practical Calculation (30% Rule):</p>
                    <p className="text-sm">
                      Market Value × 30% × 2.5% = Zakat Due<br />
                      This gives an effective rate of approximately <strong className="text-foreground">0.75% of market value</strong>.
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Important Exclusions</h3>
                </ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-2" staggerDelay={0.05}>
                  <StaggerItem><li><strong className="text-foreground">Unvested RSUs:</strong> Not Zakatable until vested—you don't own them yet</li></StaggerItem>
                  <StaggerItem><li><strong className="text-foreground">ESPP:</strong> Not Zakatable until shares are purchased and transferred to you</li></StaggerItem>
                  <StaggerItem><li><strong className="text-foreground">Stock Options:</strong> Not Zakatable until exercised and converted to actual shares</li></StaggerItem>
                </StaggerContainer>
              </div>
            </section>

            <Separator />

            {/* Retirement Section */}
            <section id="retirement">
              <AnimatedSectionHeader 
                number={5} 
                title="Retirement Accounts (401k, IRA, Roth)" 
                icon={<ShieldCheck className="w-5 h-5 text-primary" weight="duotone" />}
              />
              
              <div className="space-y-4 text-muted-foreground">
                <ScrollReveal>
                  <p>
                    Retirement accounts present the most complex Zakat challenge in contemporary Islamic finance due to 
                    access restrictions, early withdrawal penalties, and deferred taxation. The central question is 
                    whether these funds meet the criterion of <strong className="text-foreground">Milk Tām (complete possession)</strong>.
                  </p>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">The AMJA/Bradford Position</h3>
                  <p>
                    According to Sheikh Joe Bradford and AMJA guidance, retirement funds <strong className="text-foreground">ARE 
                    technically accessible</strong>—the 10% early withdrawal penalty is a deterrent, not a legal prohibition.
                  </p>
                  <p className="mt-2">
                    However, it would be <strong className="text-foreground">unjust to pay Zakat on money that effectively 
                    belongs to the government</strong> (in the form of taxes and penalties).
                  </p>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">The Accessible Balance Method</h3>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <ol className="list-decimal pl-4 space-y-2 text-sm">
                      <li>Start with your <strong className="text-foreground">Vested Balance</strong> only (unvested employer match is exempt)</li>
                      <li>Subtract the <strong className="text-foreground">10% early withdrawal penalty</strong> (if under age 59½)</li>
                      <li>Subtract your <strong className="text-foreground">estimated federal income tax</strong> at your marginal rate</li>
                      <li>Subtract your <strong className="text-foreground">estimated state income tax</strong> if applicable</li>
                      <li>The result is your <strong className="text-foreground">Net Zakatable Value</strong></li>
                    </ol>
                  </div>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Account-Specific Rules</h3>
                  
                  <h4 className="font-medium text-foreground mt-4">Traditional 401(k) & Traditional IRA</h4>
                </ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-1 text-sm" staggerDelay={0.05}>
                  <StaggerItem><li>Contributions were made pre-tax</li></StaggerItem>
                  <StaggerItem><li>Withdrawals are taxed as ordinary income</li></StaggerItem>
                  <StaggerItem><li>Apply the Accessible Balance Method above</li></StaggerItem>
                  <StaggerItem><li>Once you reach 59½, the 10% penalty no longer applies—only deduct estimated taxes</li></StaggerItem>
                </StaggerContainer>

                <ScrollReveal>
                  <h4 className="font-medium text-foreground mt-4">Roth IRA (Special Treatment)</h4>
                  <p className="text-sm">
                    Roth IRAs function differently because contributions are made with after-tax dollars:
                  </p>
                </ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-1 text-sm" staggerDelay={0.05}>
                  <StaggerItem><li><strong className="text-foreground">Contributions (Principal):</strong> Can be withdrawn tax-free and penalty-free at any time. <strong>Fully Zakatable</strong>.</li></StaggerItem>
                  <StaggerItem><li><strong className="text-foreground">Earnings:</strong> Subject to the 5-year rule and age 59½ requirement. Apply the Accessible Balance Method.</li></StaggerItem>
                </StaggerContainer>

                <ScrollReveal>
                  <h4 className="font-medium text-foreground mt-4">HSA (Health Savings Account)</h4>
                  <p className="text-sm">
                    HSA funds are fully accessible for qualified medical expenses without penalty at any age. Therefore, 
                    the entire HSA balance is <strong className="text-foreground">fully Zakatable</strong>.
                  </p>
                </ScrollReveal>

                <ScrollReveal>
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mt-6">
                    <p className="text-sm font-medium text-foreground">Important Note on 401(k) Loans</p>
                    <p className="text-sm mt-1">
                      If you've taken a loan from your 401(k), that money is now cash in your possession (Zakatable as 
                      a liquid asset). The outstanding loan is <strong>NOT a deductible liability</strong> for Zakat 
                      purposes—you owe this money to yourself, not to an external creditor.
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </section>

            <Separator />

            {/* Crypto Section */}
            <section id="crypto">
              <AnimatedSectionHeader 
                number={6} 
                title="Cryptocurrency & Digital Assets" 
                icon={<CurrencyBtc className="w-5 h-5 text-primary" weight="duotone" />}
              />
              
              <div className="space-y-4 text-muted-foreground">
                <ScrollReveal>
                  <p>
                    Cryptocurrency occupies a unique position in Islamic jurisprudence, spanning the line between 
                    <strong className="text-foreground"> currency (thaman)</strong> and <strong className="text-foreground">speculative 
                    trade goods (ʿurūḍ al-tijārah)</strong>.
                  </p>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">The Fundamental Principle</h3>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-sm">
                      Any crypto-asset purchased with the <strong className="text-foreground">intent of short-term resale for 
                      profit</strong> (trading) is <strong className="text-foreground">100% Zakatable</strong> on its market value, 
                      regardless of the type of token or coin.
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Category A: Cryptocurrencies (Payment Tokens)</h3>
                  <p>
                    Major cryptocurrencies that function as mediums of exchange are treated as 
                    <strong className="text-foreground"> currency</strong>. Zakat is due on <strong className="text-foreground">100% 
                    of market value</strong> regardless of your holding intent.
                  </p>
                </ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-1 text-sm" staggerDelay={0.05}>
                  <StaggerItem><li><strong className="text-foreground">Bitcoin (BTC):</strong> Widely accepted as payment—fully Zakatable</li></StaggerItem>
                  <StaggerItem><li><strong className="text-foreground">Ethereum (ETH):</strong> Used for transactions and gas fees—fully Zakatable</li></StaggerItem>
                  <StaggerItem><li><strong className="text-foreground">Stablecoins (USDC, USDT, DAI):</strong> Pegged to fiat—fully Zakatable</li></StaggerItem>
                </StaggerContainer>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Category B: Utility & Platform Tokens</h3>
                  <p>
                    Tokens used within specific ecosystems that are <strong className="text-foreground">not 
                    held for resale</strong> but for their utility may be exempt from Zakat.
                  </p>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">NFTs (Non-Fungible Tokens)</h3>
                </ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-1 text-sm" staggerDelay={0.05}>
                  <StaggerItem><li><strong className="text-foreground">NFTs held for resale:</strong> Commercial merchandise—fully Zakatable at estimated market value</li></StaggerItem>
                  <StaggerItem><li><strong className="text-foreground">NFTs kept for personal enjoyment:</strong> Like art on your walls—generally exempt</li></StaggerItem>
                </StaggerContainer>
              </div>
            </section>

            <Separator />

            {/* Precious Metals Section */}
            <section id="metals">
              <AnimatedSectionHeader 
                number={7} 
                title="Gold, Silver & Jewelry" 
                icon={<Coins className="w-5 h-5 text-primary" weight="duotone" />}
              />
              
              <div className="space-y-4 text-muted-foreground">
                <ScrollReveal>
                  <p>
                    Gold and silver hold special significance in Zakat law as they were the original basis for the 
                    niṣāb measurement and the only commodities explicitly mentioned in the Prophetic traditions.
                  </p>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">What Is Always Zakatable</h3>
                </ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-2" staggerDelay={0.05}>
                  <StaggerItem><li><strong className="text-foreground">Gold and silver bullion:</strong> Bars, ingots, coins held as investment—fully Zakatable</li></StaggerItem>
                  <StaggerItem><li><strong className="text-foreground">Gold/silver in investment accounts:</strong> Paper gold, gold ETFs—fully Zakatable</li></StaggerItem>
                  <StaggerItem><li><strong className="text-foreground">Gold/silver coins:</strong> Whether collectible or bullion—Zakatable on metal content value</li></StaggerItem>
                </StaggerContainer>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">The Jewelry Controversy</h3>
                  <p>
                    The treatment of personal jewelry is one of the most debated topics in Zakat jurisprudence:
                  </p>
                </ScrollReveal>
                
                <ScrollReveal>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <h4 className="font-medium text-foreground mb-2">Majority View (Shafi'i, Maliki, Hanbali)</h4>
                      <p className="text-sm">
                        Jewelry that is <strong className="text-foreground">permissible and worn regularly</strong> is exempt 
                        from Zakat. It is treated like clothing and other personal items.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <h4 className="font-medium text-foreground mb-2">Hanafi View</h4>
                      <p className="text-sm">
                        Gold and silver are inherently <strong className="text-foreground">"growing wealth" (Nāmī)</strong> by 
                        nature, regardless of form. Therefore, even worn jewelry is Zakatable on its melt value.
                      </p>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Valuation Method</h3>
                  <p>
                    When paying Zakat on jewelry, calculate based on the <strong className="text-foreground">melt value 
                    (scrap value)</strong> of the metal content only:
                  </p>
                </ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-1 text-sm" staggerDelay={0.05}>
                  <StaggerItem><li>Gemstones are not Zakatable (unless the jewelry is trade inventory)</li></StaggerItem>
                  <StaggerItem><li>Craftsmanship premium is not included</li></StaggerItem>
                  <StaggerItem><li>Only the weight of gold/silver × current spot price</li></StaggerItem>
                </StaggerContainer>
              </div>
            </section>

            <Separator />

            {/* Real Estate Section */}
            <section id="realestate">
              <AnimatedSectionHeader 
                number={8} 
                title="Real Estate" 
                icon={<Buildings className="w-5 h-5 text-primary" weight="duotone" />}
              />
              
              <div className="space-y-4 text-muted-foreground">
                <ScrollReveal>
                  <p>
                    Real estate treatment in Zakat depends entirely on the owner's <strong className="text-foreground">intent</strong>. 
                    The same property can have vastly different Zakat implications based on how it is used or held.
                  </p>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Primary Residence</h3>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="font-medium text-foreground">Ruling: Completely Exempt</p>
                    <p className="text-sm mt-1">
                      Your home used for personal shelter is <em>qunya</em> (personal use property) and is never subject 
                      to Zakat, regardless of its value.
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Rental Property (Investment)</h3>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="font-medium text-foreground">Property Value: Not Zakatable</p>
                    <p className="text-sm mt-1">
                      The property itself is a <strong className="text-foreground">productive asset</strong>, similar to 
                      business equipment or machinery.
                    </p>
                    <p className="font-medium text-foreground mt-3">Net Rental Income: Zakatable</p>
                    <p className="text-sm mt-1">
                      Rental income that remains in your bank account on your Zakat date IS Zakatable as part of your 
                      liquid assets.
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Property Held for Flipping/Resale</h3>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="font-medium text-foreground">Ruling: Fully Zakatable</p>
                    <p className="text-sm mt-1">
                      If property was purchased with the <strong className="text-foreground">express intent to sell for 
                      profit</strong>, it is classified as trade goods.
                    </p>
                    <p className="text-sm mt-2">
                      Pay Zakat on the <strong className="text-foreground">full current market value</strong> annually.
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </section>

            <Separator />

            {/* Business Section */}
            <section id="business">
              <AnimatedSectionHeader 
                number={9} 
                title="Business Assets" 
                icon={<Storefront className="w-5 h-5 text-primary" weight="duotone" />}
              />
              
              <div className="space-y-4 text-muted-foreground">
                <ScrollReveal>
                  <p>
                    For business owners, Zakat is calculated on the <strong className="text-foreground">Zakatable portion 
                    of business assets</strong>, not the entire value of the business.
                  </p>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">What IS Zakatable</h3>
                </ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-2" staggerDelay={0.05}>
                  <StaggerItem><li><strong className="text-foreground">Cash and bank balances:</strong> All business cash accounts</li></StaggerItem>
                  <StaggerItem><li><strong className="text-foreground">Accounts receivable:</strong> Money owed to you by customers (if collectible)</li></StaggerItem>
                  <StaggerItem><li><strong className="text-foreground">Inventory:</strong> Goods held for sale, valued at current selling price</li></StaggerItem>
                  <StaggerItem><li><strong className="text-foreground">Raw materials:</strong> Materials intended for production and sale</li></StaggerItem>
                </StaggerContainer>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">What Is NOT Zakatable</h3>
                </ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-2" staggerDelay={0.05}>
                  <StaggerItem><li><strong className="text-foreground">Fixed assets:</strong> Equipment, machinery, furniture used in business operations</li></StaggerItem>
                  <StaggerItem><li><strong className="text-foreground">Real estate:</strong> Buildings and land used for business (not held for resale)</li></StaggerItem>
                  <StaggerItem><li><strong className="text-foreground">Vehicles:</strong> Company cars, trucks used in operations</li></StaggerItem>
                  <StaggerItem><li><strong className="text-foreground">Goodwill:</strong> Brand value and intangible assets</li></StaggerItem>
                </StaggerContainer>
              </div>
            </section>

            <Separator />

            {/* Debts Section */}
            <section id="debts">
              <AnimatedSectionHeader 
                number={10} 
                title="Debts & Liabilities" 
                icon={<HandCoins className="w-5 h-5 text-primary" weight="duotone" />}
              />
              
              <div className="space-y-4 text-muted-foreground">
                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground">Debts Owed TO You (Receivables)</h3>
                  <p>
                    Money that others owe you is potentially Zakatable, depending on the likelihood of collection:
                  </p>
                </ScrollReveal>
                
                <ScrollReveal>
                  <h4 className="font-medium text-foreground mt-4">Good Debt (Dayn Qawiyy)</h4>
                  <p className="text-sm">
                    If the borrower is <strong className="text-foreground">willing and able to pay</strong>, this debt is effectively 
                    <strong className="text-foreground"> like cash in your pocket</strong>. Pay Zakat on the full amount annually.
                  </p>
                </ScrollReveal>

                <ScrollReveal>
                  <h4 className="font-medium text-foreground mt-4">Bad Debt (Dayn Da'if)</h4>
                  <p className="text-sm">
                    If the borrower is <strong className="text-foreground">unable or unwilling to pay</strong>, the 
                    debt is not Zakatable until actually collected.
                  </p>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Debts Owed BY You (Liabilities)</h3>
                  
                  <h4 className="font-medium text-foreground mt-4">Deductible Debts</h4>
                </ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-1 text-sm" staggerDelay={0.05}>
                  <StaggerItem><li>Debts due within the coming year (current portion)</li></StaggerItem>
                  <StaggerItem><li>Credit card balances</li></StaggerItem>
                  <StaggerItem><li>Short-term personal loans</li></StaggerItem>
                  <StaggerItem><li>Business accounts payable due soon</li></StaggerItem>
                </StaggerContainer>

                <ScrollReveal>
                  <h4 className="font-medium text-foreground mt-4">Non-Deductible (or Limited Deduction)</h4>
                </ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-1 text-sm" staggerDelay={0.05}>
                  <StaggerItem><li><strong className="text-foreground">Long-term mortgage:</strong> Only the portion due in the next 12 months is deductible</li></StaggerItem>
                  <StaggerItem><li><strong className="text-foreground">Student loans:</strong> Only the upcoming year's payments</li></StaggerItem>
                  <StaggerItem><li><strong className="text-foreground">Car loans:</strong> Only the upcoming year's payments</li></StaggerItem>
                  <StaggerItem><li><strong className="text-foreground">401(k) loans:</strong> Not deductible—you owe this to yourself</li></StaggerItem>
                </StaggerContainer>

                <ScrollReveal>
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mt-6">
                    <p className="text-sm font-medium text-foreground">Practical Guidance</p>
                    <p className="text-sm mt-1">
                      The general principle: Deduct only what you are <strong className="text-foreground">actually obligated 
                      to pay within the coming year</strong>. A 30-year mortgage does not negate 29 years of Zakat obligation.
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </section>

            <Separator />

            {/* Trusts Section */}
            <section id="trusts">
              <AnimatedSectionHeader 
                number={11} 
                title="Trusts" 
                icon={<Users className="w-5 h-5 text-primary" weight="duotone" />}
              />
              
              <div className="space-y-4 text-muted-foreground">
                <ScrollReveal>
                  <p>
                    Trusts add a layer of complexity to Zakat calculations because they separate legal ownership from 
                    beneficial use. The key is analyzing <strong className="text-foreground">Milk Tām (complete possession)</strong>—
                    specifically <em>Raqabah</em> (legal title) and <em>Yad</em> (ability to access and control).
                  </p>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Revocable Living Trusts</h3>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="font-medium text-foreground">Ruling: Fully Zakatable</p>
                    <p className="text-sm mt-1">
                      The Grantor retains full control and can revoke the trust at any time. Treat all assets in the 
                      trust as your personal property.
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Irrevocable Trusts</h3>
                  <p>
                    In an irrevocable trust, the Grantor theoretically gives up ownership to a Trustee:
                  </p>
                </ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-2 text-sm" staggerDelay={0.05}>
                  <StaggerItem>
                    <li>
                      <strong className="text-foreground">If you CANNOT access principal:</strong> Not Zakatable by you 
                      (lacks Milk Tām). The beneficiaries may have Zakat obligations when they receive distributions.
                    </li>
                  </StaggerItem>
                  <StaggerItem>
                    <li>
                      <strong className="text-foreground">If you CAN access principal:</strong> Zakatable as your property, 
                      despite the trust structure.
                    </li>
                  </StaggerItem>
                </StaggerContainer>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Custodial Accounts (UTMA/UGMA)</h3>
                  <p className="text-sm">
                    Assets in custodial accounts belong to the minor child, not the custodian parent. If the child's 
                    assets exceed the niṣāb, Zakat is due—typically paid by the parent on the child's behalf from the 
                    child's assets.
                  </p>
                </ScrollReveal>
              </div>
            </section>

            <Separator />

            {/* References Section */}
            <section id="references" className="pt-8">
              <AnimatedSectionHeader 
                number={12} 
                title="References & Further Reading" 
                icon={<BookOpen className="w-5 h-5 text-primary" weight="duotone" />}
              />
              
              <div className="space-y-6">
                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mb-3">Primary Sources</h3>
                </ScrollReveal>
                <StaggerContainer className="space-y-3 text-muted-foreground" staggerDelay={0.05}>
                  <StaggerItem>
                    <div>
                      <strong className="text-foreground">Sheikh Joe Bradford</strong>
                      <p className="text-sm">
                        "Simple Zakat Guide: Understand and Calculate Your Zakat" — A comprehensive book and methodology 
                        for American Muslims. Available at <a href="https://joebradford.net" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">joebradford.net</a>
                      </p>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div>
                      <strong className="text-foreground">Assembly of Muslim Jurists of America (AMJA)</strong>
                      <p className="text-sm">
                        Fatwas on Zakat, retirement accounts, and contemporary financial instruments. 
                        Available at <a href="https://www.amjaonline.org" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">amjaonline.org</a>
                      </p>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div>
                      <strong className="text-foreground">AAOIFI Shariah Standard 35</strong>
                      <p className="text-sm">
                        "Zakah" — Technical standard from the Accounting and Auditing Organization for Islamic 
                        Financial Institutions.
                      </p>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div>
                      <strong className="text-foreground">Islamic Finance Guru</strong>
                      <p className="text-sm">
                        Detailed guides on Zakat for cryptocurrency, investments, and modern assets. 
                        Available at <a href="https://www.islamicfinanceguru.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">islamicfinanceguru.com</a>
                      </p>
                    </div>
                  </StaggerItem>
                </StaggerContainer>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mb-3 mt-6">Key Concepts Referenced</h3>
                </ScrollReveal>
                <StaggerContainer className="space-y-2 text-sm text-muted-foreground" staggerDelay={0.05}>
                  <StaggerItem><li className="list-none"><strong className="text-foreground">Milk Tām:</strong> Complete possession — the requirement that you have full ownership and access to wealth for Zakat to apply</li></StaggerItem>
                  <StaggerItem><li className="list-none"><strong className="text-foreground">ʿUrūḍ al-Tijārah:</strong> Trade goods — merchandise held for sale, Zakatable at full market value</li></StaggerItem>
                  <StaggerItem><li className="list-none"><strong className="text-foreground">Qunya:</strong> Personal use property — items used personally that are exempt from Zakat</li></StaggerItem>
                  <StaggerItem><li className="list-none"><strong className="text-foreground">Nāmī:</strong> Growing/productive wealth — assets that have potential for growth</li></StaggerItem>
                  <StaggerItem><li className="list-none"><strong className="text-foreground">Ḥawl:</strong> The lunar year period wealth must be held above niṣāb for Zakat to become obligatory</li></StaggerItem>
                </StaggerContainer>

                <ScrollReveal>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-start gap-3">
                      <Warning className="w-5 h-5 text-muted-foreground mt-0.5" weight="duotone" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Disclaimer</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          This methodology guide is provided for educational and informational purposes only. It does not 
                          constitute religious advice. For specific rulings on your personal situation, please consult a 
                          qualified Islamic scholar or your local imam.
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </section>
          </div>

          {/* CTA Button */}
          <ScrollReveal>
            <div className="mt-16 pt-8 border-t border-border text-center">
              <Button onClick={() => navigate("/")} className="gap-2">
                Start Calculating Your Zakat
                <ArrowLeft className="w-4 h-4 rotate-180" weight="bold" />
              </Button>
            </div>
          </ScrollReveal>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default Methodology;
