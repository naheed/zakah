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
  Warning,
  Gavel,
  ListNumbers,
  Table,
  Calculator
} from "@phosphor-icons/react";

const tocItems = [
  { id: "principles", number: 1, label: "Core Legal Principles" },
  { id: "nisab", number: 2, label: "The Niṣāb Threshold" },
  { id: "hawl", number: 3, label: "The Ḥawl (Zakat Year)" },
  { id: "liquid", number: 4, label: "Liquid Assets & Cash" },
  { id: "stocks", number: 5, label: "Stocks & Investments" },
  { id: "retirement", number: 6, label: "Retirement Accounts" },
  { id: "crypto", number: 7, label: "Cryptocurrency" },
  { id: "metals", number: 8, label: "Gold, Silver & Jewelry" },
  { id: "realestate", number: 9, label: "Real Estate" },
  { id: "business", number: 10, label: "Business Assets" },
  { id: "debts", number: 11, label: "Debts & Liabilities" },
  { id: "trusts", number: 12, label: "Trusts" },
  { id: "example", number: 13, label: "Example: The Ahmed Family" },
  { id: "modes", number: 14, label: "Calculation Modes Compared" },
  { id: "references", number: 15, label: "References & Works Cited" },
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
          content="Comprehensive scholarly methodology and Islamic jurisprudence behind ZakatFlow's Zakat calculations. Based on AMJA guidance, Sheikh Joe Bradford's works, and AAOIFI standards." 
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
                This comprehensive guide synthesizes scholarly works and methodologies from leading Islamic finance 
                authorities to create a practical Zakat calculation framework for contemporary American Muslims.
              </p>
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Primary Influences:</strong> Sheikh Joe Bradford's "Simple Zakat Guide" 
                  and educational materials, the Assembly of Muslim Jurists of America (AMJA) fatwas, AAOIFI Shariah 
                  Standard 35, Islamic Finance Guru articles, and classical fiqh sources.
                </p>
              </div>
            </header>
          </ScrollReveal>

          {/* Sections */}
          <div className="space-y-16">
            
            {/* NEW: Core Legal Principles Section */}
            <section id="principles">
              <AnimatedSectionHeader 
                number={1} 
                title="Core Legal Principles" 
                icon={<Gavel className="w-5 h-5 text-primary" weight="duotone" />}
              />
              
              <div className="space-y-4 text-muted-foreground">
                <ScrollReveal>
                  <p>
                    Islamic jurisprudence establishes specific conditions that must be met for wealth to be subject to 
                    Zakat. Understanding these principles is essential for correctly applying Zakat rules to modern 
                    financial instruments.
                  </p>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">The Five Conditions for Zakatable Wealth</h3>
                </ScrollReveal>
                
                <StaggerContainer className="space-y-4" staggerDelay={0.08}>
                  <StaggerItem>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <h4 className="font-medium text-foreground flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">1</span>
                        Milk Tām (Complete Ownership)
                      </h4>
                      <p className="text-sm mt-2">
                        You must have both <strong className="text-foreground">legal title (raqabah)</strong> and 
                        <strong className="text-foreground"> beneficial use (yad)</strong>. Wealth that you legally own 
                        but cannot access or control lacks complete ownership.
                      </p>
                      <p className="text-xs mt-2 text-primary/80 italic">
                        Example: Unvested 401(k) employer match—you don't own it yet until vesting occurs.
                      </p>
                    </div>
                  </StaggerItem>
                  
                  <StaggerItem>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <h4 className="font-medium text-foreground flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">2</span>
                        Qudrah 'ala al-Tasarruf (Ability to Dispose)
                      </h4>
                      <p className="text-sm mt-2">
                        You must have the <strong className="text-foreground">practical ability to access and use</strong> the 
                        wealth. Legal barriers, severe penalties, or restrictions that prevent reasonable access may 
                        negate this condition.
                      </p>
                      <p className="text-xs mt-2 text-primary/80 italic">
                        Example: This is the key principle behind the Bradford Exclusion Rule for retirement accounts.
                      </p>
                    </div>
                  </StaggerItem>
                  
                  <StaggerItem>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <h4 className="font-medium text-foreground flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">3</span>
                        Nāmī (Growth Potential)
                      </h4>
                      <p className="text-sm mt-2">
                        The asset must have <strong className="text-foreground">inherent potential for growth or 
                        productivity</strong>. Cash, investments, and trade goods are nāmī by nature. Personal items 
                        like clothing and furniture are not.
                      </p>
                      <p className="text-xs mt-2 text-primary/80 italic">
                        Example: Gold is considered nāmī even when held as jewelry (Hanafi view) because it retains 
                        monetary nature.
                      </p>
                    </div>
                  </StaggerItem>
                  
                  <StaggerItem>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <h4 className="font-medium text-foreground flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">4</span>
                        Above the Niṣāb Threshold
                      </h4>
                      <p className="text-sm mt-2">
                        Total Zakatable wealth must <strong className="text-foreground">exceed the minimum threshold 
                        (niṣāb)</strong> of either 85 grams of gold or 595 grams of silver equivalent.
                      </p>
                    </div>
                  </StaggerItem>
                  
                  <StaggerItem>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <h4 className="font-medium text-foreground flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">5</span>
                        Ḥawl (One Year Passage)
                      </h4>
                      <p className="text-sm mt-2">
                        The wealth must be held above niṣāb for <strong className="text-foreground">one complete lunar 
                        year (354 days)</strong> or solar year (365 days with adjusted rate).
                      </p>
                    </div>
                  </StaggerItem>
                </StaggerContainer>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-8">Special Classification: Māl Ḍimār</h3>
                  <div className="p-4 rounded-lg bg-tertiary/10 border border-tertiary/20 mt-3">
                    <p className="text-sm">
                      <strong className="text-foreground">Māl Ḍimār</strong> refers to wealth that is 
                      <strong className="text-foreground"> inaccessible, at risk, or uncertain</strong>. Classical 
                      examples include money held by a debtor who may not repay, or wealth in a distant land with 
                      no means of access.
                    </p>
                    <p className="text-sm mt-2">
                      Modern applications include: disputed funds in litigation, frozen accounts, and—under the 
                      Bradford interpretation—retirement accounts with significant access barriers for those under 59½.
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Intent (Nawā) in Asset Classification</h3>
                  <p>
                    Your <strong className="text-foreground">intention when acquiring an asset</strong> determines its 
                    Zakat treatment:
                  </p>
                </ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-2" staggerDelay={0.05}>
                  <StaggerItem>
                    <li>
                      <strong className="text-foreground">Trade (Tijārah):</strong> Assets held for resale are 
                      <em> ʿurūḍ al-tijārah</em>—100% of market value is Zakatable
                    </li>
                  </StaggerItem>
                  <StaggerItem>
                    <li>
                      <strong className="text-foreground">Personal Use (Qunya):</strong> Items for personal use 
                      (home, car, clothing) are exempt from Zakat
                    </li>
                  </StaggerItem>
                  <StaggerItem>
                    <li>
                      <strong className="text-foreground">Investment (Istithmār):</strong> Passive investments may 
                      follow the 30% rule for underlying Zakatable assets
                    </li>
                  </StaggerItem>
                </StaggerContainer>
              </div>
            </section>

            <Separator />
            
            {/* Nisab Section */}
            <section id="nisab">
              <AnimatedSectionHeader 
                number={2} 
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
                number={3} 
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
                number={4} 
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

            {/* Stocks Section - ENHANCED */}
            <section id="stocks">
              <AnimatedSectionHeader 
                number={5} 
                title="Stocks & Investments" 
                icon={<TrendUp className="w-5 h-5 text-primary" weight="duotone" />}
              />
              
              <div className="space-y-4 text-muted-foreground">
                <ScrollReveal>
                  <p>
                    The treatment of stocks depends on your <strong className="text-foreground">intent (nawā)</strong>. When you own 
                    shares, you own a percentage of the company entity—this creates two distinct categories with different 
                    Zakat implications, known in classical fiqh as <em>Mudir</em> (trader) vs <em>Muhtakir</em> (holder).
                  </p>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Mudir: Active Holdings (Trading)</h3>
                  <p>
                    If you purchase stocks with the intention to sell in the short-term for capital gain (day trading, 
                    swing trading, momentum investing), you are classified as a <strong className="text-foreground">Mudir 
                    (trader)</strong>. The stocks are <strong className="text-foreground">ʿurūḍ al-tijārah</strong> (commercial merchandise).
                  </p>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border mt-2">
                    <p className="font-medium text-foreground">Zakat Calculation:</p>
                    <p className="text-sm">Pay 2.5% (or 2.577% for solar year) on <strong>100% of the market value</strong> on your Zakat date.</p>
                  </div>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Muhtakir: Passive Holdings (Long-Term Investment)</h3>
                  <p>
                    If shares are held for long-term appreciation and dividends (buy and hold strategy), you are classified 
                    as a <strong className="text-foreground">Muhtakir (holder)</strong>. In this case, Zakat shifts from the 
                    full market value to the <strong className="text-foreground">company's Zakatable assets</strong>.
                  </p>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">The 30% Rule: Derivation & Application</h3>
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm font-medium text-foreground">AAOIFI Shariah Standard 35 (SS35)</p>
                    <p className="text-sm mt-2">
                      Research by AAOIFI analyzed the balance sheets of Shariah-compliant companies and found that 
                      <strong className="text-foreground"> Net Current Assets</strong> (cash + receivables + inventory − current liabilities) 
                      average approximately <strong className="text-foreground">30% of market capitalization</strong>.
                    </p>
                    <div className="mt-3 p-3 bg-background rounded border border-border">
                      <p className="text-sm font-mono">
                        Market Value × 30% × 2.5% = Zakat Due<br />
                        <span className="text-muted-foreground">Effective rate: <strong className="text-foreground">0.75% of portfolio value</strong></span>
                      </p>
                    </div>
                    <p className="text-xs mt-3 text-muted-foreground">
                      This proxy is used because calculating precise Net Current Assets for each company in a 
                      diversified portfolio is impractical for individual investors.
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

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Dividend Purification</h3>
                  <p className="text-sm">
                    If a company derives revenue from impermissible sources (interest income, alcohol, gambling), that 
                    portion of dividends must be <strong className="text-foreground">purified</strong> by donating to 
                    charity—separate from Zakat. Most Shariah-compliant screens allow up to 5% impermissible revenue.
                  </p>
                </ScrollReveal>
              </div>
            </section>

            <Separator />

            {/* Retirement Section - ENHANCED with Bradford Rule */}
            <section id="retirement">
              <AnimatedSectionHeader 
                number={6} 
                title="Retirement Accounts (401k, IRA, Roth)" 
                icon={<ShieldCheck className="w-5 h-5 text-primary" weight="duotone" />}
              />
              
              <div className="space-y-4 text-muted-foreground">
                <ScrollReveal>
                  <p>
                    Retirement accounts present the most complex Zakat challenge in contemporary Islamic finance due to 
                    access restrictions, early withdrawal penalties, and deferred taxation. The central question is 
                    whether these funds meet the criteria of <strong className="text-foreground">Milk Tām</strong> (complete 
                    possession) and <strong className="text-foreground">Qudrah 'ala al-Tasarruf</strong> (ability to dispose).
                  </p>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Three Scholarly Approaches</h3>
                  <p className="mb-4">
                    ZakatFlow offers three calculation modes based on different scholarly interpretations:
                  </p>
                </ScrollReveal>

                <StaggerContainer className="space-y-4" staggerDelay={0.08}>
                  <StaggerItem>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <h4 className="font-medium text-foreground">1. Conservative (Precautionary)</h4>
                      <p className="text-sm mt-2">
                        Pay Zakat on the <strong className="text-foreground">full gross value</strong> of all retirement 
                        accounts. This follows the principle of <em>ahwat</em> (precaution)—when in doubt, fulfill the 
                        maximum obligation.
                      </p>
                      <p className="text-xs mt-2 text-muted-foreground">
                        Basis: Some scholars argue the funds ARE accessible (the penalty is a deterrent, not a prohibition), 
                        so full Zakat applies.
                      </p>
                    </div>
                  </StaggerItem>
                  
                  <StaggerItem>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <h4 className="font-medium text-foreground">2. Optimized (Tax-Adjusted)</h4>
                      <p className="text-sm mt-2">
                        Apply the <strong className="text-foreground">Accessible Balance Method</strong>: deduct estimated 
                        taxes and early withdrawal penalties (if under 59½) to calculate the net accessible amount.
                      </p>
                      <div className="mt-3 p-3 bg-background rounded border border-border text-sm">
                        <ol className="list-decimal pl-4 space-y-1">
                          <li>Start with <strong>Vested Balance</strong> only</li>
                          <li>Subtract <strong>10% early withdrawal penalty</strong> (if under 59½)</li>
                          <li>Subtract <strong>estimated federal + state taxes</strong></li>
                          <li>Result = Net Zakatable Value</li>
                        </ol>
                      </div>
                      <p className="text-xs mt-2 text-muted-foreground">
                        Basis: AMJA position that it's unjust to pay Zakat on money that effectively belongs to the 
                        government (taxes/penalties).
                      </p>
                    </div>
                  </StaggerItem>
                  
                  <StaggerItem>
                    <div className="p-4 rounded-lg bg-tertiary/10 border border-tertiary/20">
                      <h4 className="font-medium text-foreground flex items-center gap-2">
                        3. Bradford Exclusion Rule
                        <span className="text-xs bg-tertiary/20 text-tertiary px-2 py-0.5 rounded-full">New</span>
                      </h4>
                      <p className="text-sm mt-2">
                        Traditional 401(k) and Traditional IRA accounts are <strong className="text-foreground">fully 
                        exempt</strong> from Zakat if you are under age 59½.
                      </p>
                      <p className="text-sm mt-2">
                        <strong className="text-foreground">Scholarly Basis:</strong> Sheikh Joe Bradford argues in 
                        "Zakat on Retirement Plans Revisited" that the combined effect of the 10% penalty + income taxes 
                        (often 30-40% total) creates a substantial barrier similar to <em>māl ḍimār</em> (inaccessible wealth).
                      </p>
                      <div className="mt-3 p-3 bg-background rounded border border-border text-sm">
                        <p className="font-medium text-foreground">Key Principles:</p>
                        <ul className="list-disc pl-4 mt-1 space-y-1">
                          <li>Lacks <strong>Milk Tām</strong>: You don't have complete ownership—substantial portion goes to government</li>
                          <li>Lacks <strong>Qudrah 'ala al-Tasarruf</strong>: The penalty creates a legal barrier to free disposition</li>
                          <li><strong>Roth IRA Contributions</strong> remain 100% Zakatable (accessible tax-free anytime)</li>
                          <li>Once you reach 59½, the penalty disappears and accounts become Zakatable (after-tax value)</li>
                        </ul>
                      </div>
                    </div>
                  </StaggerItem>
                </StaggerContainer>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Account-Specific Rules</h3>
                  
                  <h4 className="font-medium text-foreground mt-4">Roth IRA (Special Treatment)</h4>
                  <p className="text-sm">
                    Roth IRAs function differently because contributions are made with after-tax dollars:
                  </p>
                </ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-1 text-sm" staggerDelay={0.05}>
                  <StaggerItem><li><strong className="text-foreground">Contributions (Principal):</strong> Can be withdrawn tax-free and penalty-free at any time. <strong>Always 100% Zakatable</strong> under all modes.</li></StaggerItem>
                  <StaggerItem><li><strong className="text-foreground">Earnings:</strong> Subject to the 5-year rule and age 59½ requirement. Follow the same mode rules as 401(k).</li></StaggerItem>
                </StaggerContainer>

                <ScrollReveal>
                  <h4 className="font-medium text-foreground mt-4">HSA (Health Savings Account)</h4>
                  <p className="text-sm">
                    HSA funds are fully accessible for qualified medical expenses without penalty at any age. Therefore, 
                    the entire HSA balance is <strong className="text-foreground">fully Zakatable under all modes</strong>.
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
                number={7} 
                title="Cryptocurrency & Digital Assets" 
                icon={<CurrencyBtc className="w-5 h-5 text-primary" weight="duotone" />}
              />
              
              <div className="space-y-4 text-muted-foreground">
                <ScrollReveal>
                  <p>
                    Cryptocurrency occupies a unique position in Islamic jurisprudence, spanning the line between
                    <strong className="text-foreground"> currency (thaman)</strong> and <strong className="text-foreground">speculative 
                    trade goods (ʿurūḍ al-tijārah)</strong>. The PDF methodology treats cryptocurrency at 
                    <strong className="text-foreground"> full market value</strong>.
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
                  <h3 className="text-lg font-medium text-foreground mt-6">Category B: Staking & DeFi</h3>
                </ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-2 text-sm" staggerDelay={0.05}>
                  <StaggerItem><li><strong className="text-foreground">Staking Principal:</strong> You retain ownership; fully Zakatable</li></StaggerItem>
                  <StaggerItem><li><strong className="text-foreground">Staking Rewards (Vested):</strong> Only accessible rewards are Zakatable; locked rewards are exempt until possession</li></StaggerItem>
                  <StaggerItem><li><strong className="text-foreground">Liquidity Pools:</strong> Zakat on the current redeemable value (account for impermanent loss)</li></StaggerItem>
                </StaggerContainer>

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
                number={8} 
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
                      <h4 className="font-medium text-foreground mb-2">Hanafi View (Ahwat)</h4>
                      <p className="text-sm">
                        Gold and silver are inherently <strong className="text-foreground">"growing wealth" (Nāmī)</strong> by 
                        nature, regardless of form. Therefore, even worn jewelry is Zakatable on its melt value.
                      </p>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal>
                  <div className="p-4 rounded-lg bg-tertiary/10 border border-tertiary/20 mt-4">
                    <p className="text-sm font-medium text-foreground">Precautionary Stance (Bradford Recommendation)</p>
                    <p className="text-sm mt-1">
                      Given the strong Hanafi evidence and the principle of <em>ahwat</em> (precaution), paying Zakat on 
                      jewelry—especially large amounts kept in storage—is the safer approach. Daily-wear jewelry in 
                      modest amounts may reasonably follow the majority exemption.
                    </p>
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
                number={9} 
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
                number={10} 
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
                  <StaggerItem><li><strong className="text-foreground">Inventory:</strong> Goods held for sale</li></StaggerItem>
                  <StaggerItem><li><strong className="text-foreground">Raw materials:</strong> Materials intended for production and sale</li></StaggerItem>
                </StaggerContainer>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Inventory Valuation Method</h3>
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm">
                      <strong className="text-foreground">Use wholesale/replacement cost</strong>, not retail selling price. 
                      This follows the principle that Zakat is calculated on what you could reasonably liquidate the 
                      inventory for, not the maximum retail value.
                    </p>
                  </div>
                </ScrollReveal>

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

            {/* Debts Section - ENHANCED with Maliki middle path */}
            <section id="debts">
              <AnimatedSectionHeader 
                number={11} 
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
                  <p className="mb-4">
                    The classical schools differ on how debts reduce Zakatable wealth:
                  </p>
                </ScrollReveal>

                <ScrollReveal>
                  <div className="p-4 rounded-lg bg-tertiary/10 border border-tertiary/20">
                    <p className="text-sm font-medium text-foreground">The Maliki "Middle Path" (Adopted by AMJA)</p>
                    <div className="mt-3 grid md:grid-cols-3 gap-3 text-sm">
                      <div className="p-3 bg-background rounded border border-border">
                        <p className="font-medium text-foreground">Hanafi</p>
                        <p className="text-xs text-muted-foreground mt-1">Full debt deduction allowed—Zakat only on net worth</p>
                      </div>
                      <div className="p-3 bg-background rounded border border-tertiary/30">
                        <p className="font-medium text-tertiary">Maliki (Middle Path)</p>
                        <p className="text-xs text-muted-foreground mt-1">Only debts due within one year are deductible</p>
                      </div>
                      <div className="p-3 bg-background rounded border border-border">
                        <p className="font-medium text-foreground">Shafi'i/Hanbali</p>
                        <p className="text-xs text-muted-foreground mt-1">No debt deduction—Zakat on gross wealth</p>
                      </div>
                    </div>
                    <p className="text-sm mt-3">
                      ZakatFlow follows the <strong className="text-foreground">Maliki middle path</strong> as adopted by AMJA: 
                      only <strong className="text-foreground">immediate obligations</strong> (due within 12 months) reduce 
                      your Zakatable wealth.
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal>
                  <h4 className="font-medium text-foreground mt-6">Deductible Debts (Immediate Obligations)</h4>
                </ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-1 text-sm" staggerDelay={0.05}>
                  <StaggerItem><li>Credit card balances (due immediately)</li></StaggerItem>
                  <StaggerItem><li>Unpaid bills and invoices</li></StaggerItem>
                  <StaggerItem><li>Short-term personal loans</li></StaggerItem>
                  <StaggerItem><li>Business accounts payable due soon</li></StaggerItem>
                  <StaggerItem><li><strong className="text-foreground">12 months</strong> of mortgage payments</li></StaggerItem>
                  <StaggerItem><li><strong className="text-foreground">12 months</strong> of student loan payments</li></StaggerItem>
                  <StaggerItem><li><strong className="text-foreground">12 months</strong> of car loan payments</li></StaggerItem>
                </StaggerContainer>

                <ScrollReveal>
                  <h4 className="font-medium text-foreground mt-4">NOT Deductible</h4>
                </ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-1 text-sm" staggerDelay={0.05}>
                  <StaggerItem><li>Full mortgage principal (only 12 months of payments)</li></StaggerItem>
                  <StaggerItem><li>Full student loan balance (only 12 months of payments)</li></StaggerItem>
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
                number={12} 
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

            {/* NEW: Ahmed Family Example Section */}
            <section id="example">
              <AnimatedSectionHeader 
                number={13} 
                title="Example: The Ahmed Family" 
                icon={<ListNumbers className="w-5 h-5 text-primary" weight="duotone" />}
              />
              
              <div className="space-y-4 text-muted-foreground">
                <ScrollReveal>
                  <p>
                    To illustrate how different calculation modes affect Zakat, let's walk through a comprehensive 
                    example based on the methodology document.
                  </p>
                </ScrollReveal>

                <ScrollReveal>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <h4 className="font-medium text-foreground">Family Profile</h4>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• <strong>Ahmed (age 42)</strong> and <strong>Fatima (age 40)</strong></li>
                      <li>• Using <strong>Silver Standard</strong> niṣāb (~$500)</li>
                      <li>• Combined <strong>tax rate: 32%</strong> (federal + state)</li>
                      <li>• Paying Zakat on <strong>Lunar Calendar</strong> (2.5%)</li>
                    </ul>
                  </div>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Their Assets</h3>
                </ScrollReveal>

                <ScrollReveal>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-3 font-medium text-foreground">Asset Category</th>
                          <th className="text-right p-3 font-medium text-foreground">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-border">
                          <td className="p-3">Checking & Savings</td>
                          <td className="p-3 text-right font-mono">$45,000</td>
                        </tr>
                        <tr className="border-t border-border bg-muted/30">
                          <td className="p-3">401(k) Vested Balance (Ahmed)</td>
                          <td className="p-3 text-right font-mono">$320,000</td>
                        </tr>
                        <tr className="border-t border-border">
                          <td className="p-3">Roth IRA Contributions (Fatima)</td>
                          <td className="p-3 text-right font-mono">$60,000</td>
                        </tr>
                        <tr className="border-t border-border bg-muted/30">
                          <td className="p-3">Passive Index Funds</td>
                          <td className="p-3 text-right font-mono">$150,000</td>
                        </tr>
                        <tr className="border-t border-border">
                          <td className="p-3">Gold Jewelry (Fatima)</td>
                          <td className="p-3 text-right font-mono">$8,000</td>
                        </tr>
                        <tr className="border-t border-border bg-muted/30">
                          <td className="p-3">Rental Income in Bank</td>
                          <td className="p-3 text-right font-mono">$12,000</td>
                        </tr>
                        <tr className="border-t border-border font-medium">
                          <td className="p-3 text-foreground">Total Gross Assets</td>
                          <td className="p-3 text-right font-mono text-foreground">$595,000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Their Liabilities</h3>
                </ScrollReveal>

                <ScrollReveal>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-3 font-medium text-foreground">Liability</th>
                          <th className="text-right p-3 font-medium text-foreground">Deductible Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-border">
                          <td className="p-3">Mortgage (12 months @ $3,000/mo)</td>
                          <td className="p-3 text-right font-mono">$36,000</td>
                        </tr>
                        <tr className="border-t border-border bg-muted/30">
                          <td className="p-3">Credit Card Balance</td>
                          <td className="p-3 text-right font-mono">$5,000</td>
                        </tr>
                        <tr className="border-t border-border font-medium">
                          <td className="p-3 text-foreground">Total Deductible Liabilities</td>
                          <td className="p-3 text-right font-mono text-foreground">$41,000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Calculation by Mode</h3>
                </ScrollReveal>

                <StaggerContainer className="space-y-4" staggerDelay={0.08}>
                  <StaggerItem>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <h4 className="font-medium text-foreground">Mode 1: Conservative</h4>
                      <div className="mt-3 text-sm space-y-1">
                        <p>Cash + Rental Income: $45,000 + $12,000 = <strong>$57,000</strong></p>
                        <p>401(k) full value: <strong>$320,000</strong></p>
                        <p>Roth Contributions: <strong>$60,000</strong></p>
                        <p>Passive Stocks (100%): <strong>$150,000</strong></p>
                        <p>Gold Jewelry (Hanafi): <strong>$8,000</strong></p>
                        <p className="pt-2 border-t border-border">Total Assets: $595,000</p>
                        <p>Less Liabilities: -$41,000</p>
                        <p className="font-medium text-foreground">Net Zakatable: $554,000</p>
                        <p className="text-primary font-bold">Zakat Due: $554,000 × 2.5% = $13,850</p>
                      </div>
                    </div>
                  </StaggerItem>
                  
                  <StaggerItem>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <h4 className="font-medium text-foreground">Mode 2: Optimized</h4>
                      <div className="mt-3 text-sm space-y-1">
                        <p>Cash + Rental Income: <strong>$57,000</strong></p>
                        <p>401(k) after tax/penalty: $320,000 × (1 - 0.32 - 0.10) = <strong>$185,600</strong></p>
                        <p>Roth Contributions: <strong>$60,000</strong></p>
                        <p>Passive Stocks (30% rule): $150,000 × 30% = <strong>$45,000</strong></p>
                        <p>Gold Jewelry (Hanafi): <strong>$8,000</strong></p>
                        <p className="pt-2 border-t border-border">Total Assets: $355,600</p>
                        <p>Less Liabilities: -$41,000</p>
                        <p className="font-medium text-foreground">Net Zakatable: $314,600</p>
                        <p className="text-primary font-bold">Zakat Due: $314,600 × 2.5% = $7,865</p>
                      </div>
                    </div>
                  </StaggerItem>
                  
                  <StaggerItem>
                    <div className="p-4 rounded-lg bg-tertiary/10 border border-tertiary/20">
                      <h4 className="font-medium text-foreground">Mode 3: Bradford Exclusion Rule</h4>
                      <div className="mt-3 text-sm space-y-1">
                        <p>Cash + Rental Income: <strong>$57,000</strong></p>
                        <p>401(k) (EXEMPT under 59½): <strong className="text-tertiary">$0</strong></p>
                        <p>Roth Contributions (always zakatable): <strong>$60,000</strong></p>
                        <p>Passive Stocks (30% rule): <strong>$45,000</strong></p>
                        <p>Gold Jewelry (Hanafi): <strong>$8,000</strong></p>
                        <p className="pt-2 border-t border-border">Total Assets: $170,000</p>
                        <p>Less Liabilities: -$41,000</p>
                        <p className="font-medium text-foreground">Net Zakatable: $129,000</p>
                        <p className="text-tertiary font-bold">Zakat Due: $129,000 × 2.5% = $3,225</p>
                      </div>
                    </div>
                  </StaggerItem>
                </StaggerContainer>

                <ScrollReveal>
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mt-6">
                    <p className="text-sm font-medium text-foreground">Summary</p>
                    <p className="text-sm mt-2">
                      The Ahmed family's Zakat obligation ranges from <strong className="text-foreground">$3,225</strong> (Bradford) 
                      to <strong className="text-foreground">$13,850</strong> (Conservative) depending on which scholarly 
                      interpretation they follow. All three positions are valid—the choice depends on personal conviction 
                      and scholarly guidance.
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </section>

            <Separator />

            {/* NEW: Calculation Modes Compared Section */}
            <section id="modes">
              <AnimatedSectionHeader 
                number={14} 
                title="Calculation Modes Compared" 
                icon={<Table className="w-5 h-5 text-primary" weight="duotone" />}
              />
              
              <div className="space-y-4 text-muted-foreground">
                <ScrollReveal>
                  <p>
                    ZakatFlow offers three calculation modes to accommodate different scholarly interpretations. 
                    This table summarizes how each asset type is treated under each mode.
                  </p>
                </ScrollReveal>

                <ScrollReveal>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-3 font-medium text-foreground">Asset Type</th>
                          <th className="text-center p-3 font-medium text-foreground">Conservative</th>
                          <th className="text-center p-3 font-medium text-foreground">Optimized</th>
                          <th className="text-center p-3 font-medium text-tertiary">Bradford</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-border">
                          <td className="p-3 font-medium text-foreground">Cash & Liquid Assets</td>
                          <td className="p-3 text-center">100%</td>
                          <td className="p-3 text-center">100%</td>
                          <td className="p-3 text-center">100%</td>
                        </tr>
                        <tr className="border-t border-border bg-muted/30">
                          <td className="p-3 font-medium text-foreground">Active Stocks (Trading)</td>
                          <td className="p-3 text-center">100%</td>
                          <td className="p-3 text-center">100%</td>
                          <td className="p-3 text-center">100%</td>
                        </tr>
                        <tr className="border-t border-border">
                          <td className="p-3 font-medium text-foreground">Passive Stocks (Long-term)</td>
                          <td className="p-3 text-center">100%</td>
                          <td className="p-3 text-center text-primary font-medium">30% rule</td>
                          <td className="p-3 text-center text-primary font-medium">30% rule</td>
                        </tr>
                        <tr className="border-t border-border bg-muted/30">
                          <td className="p-3 font-medium text-foreground">401(k)/IRA (under 59½)</td>
                          <td className="p-3 text-center">100%</td>
                          <td className="p-3 text-center text-primary font-medium">After tax/penalty</td>
                          <td className="p-3 text-center text-tertiary font-bold">EXEMPT</td>
                        </tr>
                        <tr className="border-t border-border">
                          <td className="p-3 font-medium text-foreground">401(k)/IRA (59½+)</td>
                          <td className="p-3 text-center">100%</td>
                          <td className="p-3 text-center text-primary font-medium">After tax</td>
                          <td className="p-3 text-center text-primary font-medium">After tax</td>
                        </tr>
                        <tr className="border-t border-border bg-muted/30">
                          <td className="p-3 font-medium text-foreground">Roth IRA Contributions</td>
                          <td className="p-3 text-center">100%</td>
                          <td className="p-3 text-center">100%</td>
                          <td className="p-3 text-center">100%</td>
                        </tr>
                        <tr className="border-t border-border">
                          <td className="p-3 font-medium text-foreground">Roth IRA Earnings (under 59½)</td>
                          <td className="p-3 text-center">100%</td>
                          <td className="p-3 text-center text-primary font-medium">After penalty</td>
                          <td className="p-3 text-center text-tertiary font-bold">EXEMPT</td>
                        </tr>
                        <tr className="border-t border-border bg-muted/30">
                          <td className="p-3 font-medium text-foreground">HSA Balance</td>
                          <td className="p-3 text-center">100%</td>
                          <td className="p-3 text-center">100%</td>
                          <td className="p-3 text-center">100%</td>
                        </tr>
                        <tr className="border-t border-border">
                          <td className="p-3 font-medium text-foreground">Cryptocurrency</td>
                          <td className="p-3 text-center">100%</td>
                          <td className="p-3 text-center">100%</td>
                          <td className="p-3 text-center">100%</td>
                        </tr>
                        <tr className="border-t border-border bg-muted/30">
                          <td className="p-3 font-medium text-foreground">Gold & Silver</td>
                          <td className="p-3 text-center">100%</td>
                          <td className="p-3 text-center">100%</td>
                          <td className="p-3 text-center">100%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </ScrollReveal>

                <ScrollReveal>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border mt-6">
                    <p className="text-sm font-medium text-foreground">Choosing a Mode</p>
                    <p className="text-sm mt-2">
                      <strong className="text-foreground">Conservative</strong> is for those who prefer maximum certainty 
                      and precaution. <strong className="text-foreground">Optimized</strong> balances scholarly opinion with 
                      practical accessibility. <strong className="text-foreground">Bradford</strong> follows Sheikh Joe Bradford's 
                      specific ruling on retirement accounts. All three are valid scholarly positions.
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </section>

            <Separator />

            {/* References Section - EXPANDED */}
            <section id="references" className="pt-8">
              <AnimatedSectionHeader 
                number={15} 
                title="References & Works Cited" 
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
                        for American Muslims. Also: "Zakat on Retirement Plans Revisited" (article). Available at{" "}
                        <a href="https://joebradford.net" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">joebradford.net</a>
                      </p>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div>
                      <strong className="text-foreground">Assembly of Muslim Jurists of America (AMJA)</strong>
                      <p className="text-sm">
                        Fatwas on Zakat, retirement accounts, mortgage deduction, and contemporary financial instruments. 
                        Fatwa #77832 on Retirement Accounts. Available at{" "}
                        <a href="https://www.amjaonline.org" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">amjaonline.org</a>
                      </p>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div>
                      <strong className="text-foreground">AAOIFI Shariah Standard 35</strong>
                      <p className="text-sm">
                        "Zakah" — Technical standard from the Accounting and Auditing Organization for Islamic 
                        Financial Institutions. Source of the 30% rule for passive investments.
                      </p>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div>
                      <strong className="text-foreground">Islamic Finance Guru</strong>
                      <p className="text-sm">
                        Detailed guides on Zakat for cryptocurrency, investments, and modern assets. 
                        Available at{" "}
                        <a href="https://www.islamicfinanceguru.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">islamicfinanceguru.com</a>
                      </p>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div>
                      <strong className="text-foreground">National Zakat Foundation (NZF UK)</strong>
                      <p className="text-sm">
                        Practical Zakat calculation guidance and scholarly resources. Available at{" "}
                        <a href="https://nzf.org.uk" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">nzf.org.uk</a>
                      </p>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div>
                      <strong className="text-foreground">Zakat.fyi</strong>
                      <p className="text-sm">
                        Modern Zakat calculation resources and educational content.
                      </p>
                    </div>
                  </StaggerItem>
                </StaggerContainer>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mb-3 mt-6">Classical Fiqh Sources</h3>
                </ScrollReveal>
                <StaggerContainer className="space-y-2 text-sm text-muted-foreground" staggerDelay={0.05}>
                  <StaggerItem>
                    <li className="list-none">
                      <strong className="text-foreground">Al-Mughni</strong> — Ibn Qudamah (Hanbali compendium on comparative fiqh)
                    </li>
                  </StaggerItem>
                  <StaggerItem>
                    <li className="list-none">
                      <strong className="text-foreground">Al-Majmu' Sharh al-Muhadhdhab</strong> — Imam Nawawi (Shafi'i school)
                    </li>
                  </StaggerItem>
                  <StaggerItem>
                    <li className="list-none">
                      <strong className="text-foreground">Fiqh al-Zakah</strong> — Dr. Yusuf al-Qaradawi (comprehensive modern treatise)
                    </li>
                  </StaggerItem>
                  <StaggerItem>
                    <li className="list-none">
                      <strong className="text-foreground">Badai' al-Sanai'</strong> — Al-Kasani (Hanafi school)
                    </li>
                  </StaggerItem>
                </StaggerContainer>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mb-3 mt-6">Key Concepts Referenced</h3>
                </ScrollReveal>
                <StaggerContainer className="space-y-2 text-sm text-muted-foreground" staggerDelay={0.05}>
                  <StaggerItem><li className="list-none"><strong className="text-foreground">Milk Tām:</strong> Complete possession — the requirement that you have full ownership and access to wealth for Zakat to apply</li></StaggerItem>
                  <StaggerItem><li className="list-none"><strong className="text-foreground">Qudrah 'ala al-Tasarruf:</strong> Ability to dispose — practical capacity to access and use wealth freely</li></StaggerItem>
                  <StaggerItem><li className="list-none"><strong className="text-foreground">Māl Ḍimār:</strong> Inaccessible or at-risk wealth — exempt from Zakat until recovered/accessible</li></StaggerItem>
                  <StaggerItem><li className="list-none"><strong className="text-foreground">ʿUrūḍ al-Tijārah:</strong> Trade goods — merchandise held for sale, Zakatable at full market value</li></StaggerItem>
                  <StaggerItem><li className="list-none"><strong className="text-foreground">Qunya:</strong> Personal use property — items used personally that are exempt from Zakat</li></StaggerItem>
                  <StaggerItem><li className="list-none"><strong className="text-foreground">Nāmī:</strong> Growing/productive wealth — assets that have potential for growth</li></StaggerItem>
                  <StaggerItem><li className="list-none"><strong className="text-foreground">Ḥawl:</strong> The lunar year period wealth must be held above niṣāb for Zakat to become obligatory</li></StaggerItem>
                  <StaggerItem><li className="list-none"><strong className="text-foreground">Nawā:</strong> Intent — the purpose for which an asset is held, determining its Zakat classification</li></StaggerItem>
                  <StaggerItem><li className="list-none"><strong className="text-foreground">Ahwat:</strong> Precautionary principle — when in doubt, take the safer position</li></StaggerItem>
                  <StaggerItem><li className="list-none"><strong className="text-foreground">Anfa' li'l-fuqara:</strong> Most beneficial for the poor — principle favoring interpretations that increase Zakat flow</li></StaggerItem>
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
