import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Scale, Calendar, Coins, Building, TrendingUp, Shield, Landmark, Wallet, HandCoins, FileText, AlertCircle, Users, ChevronUp, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";

const Methodology = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    nisab: true,
    hawl: false,
    liquid: false,
    stocks: false,
    retirement: false,
    crypto: false,
    metals: false,
    realestate: false,
    business: false,
    debts: false,
    trusts: false,
    references: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <Helmet>
        <title>Zakat Methodology & References - Zakat Flow</title>
        <meta 
          name="description" 
          content="Comprehensive scholarly methodology and Islamic jurisprudence behind Zakat Flow's Zakat calculations. Based on AMJA guidance, Joe Bradford's works, and Islamic Finance Guru." 
        />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-8 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Calculator
          </Button>

          {/* Header */}
          <header className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
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

          {/* Table of Contents - Collapsible on mobile, always visible on desktop */}
          {isMobile ? (
            <nav className="mb-8 sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border -mx-4 px-4">
              <Collapsible open={tocOpen} onOpenChange={setTocOpen}>
                <CollapsibleTrigger className="w-full py-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Table of Contents</span>
                  {tocOpen ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3">
                  <ul className="space-y-1 text-sm">
                    <li><a href="#nisab" onClick={() => setTocOpen(false)} className="text-primary hover:underline block py-1.5">1. The Niṣāb Threshold</a></li>
                    <li><a href="#hawl" onClick={() => setTocOpen(false)} className="text-primary hover:underline block py-1.5">2. The Ḥawl (Zakat Year)</a></li>
                    <li><a href="#liquid" onClick={() => setTocOpen(false)} className="text-primary hover:underline block py-1.5">3. Liquid Assets & Cash</a></li>
                    <li><a href="#stocks" onClick={() => setTocOpen(false)} className="text-primary hover:underline block py-1.5">4. Stocks & Investments</a></li>
                    <li><a href="#retirement" onClick={() => setTocOpen(false)} className="text-primary hover:underline block py-1.5">5. Retirement Accounts</a></li>
                    <li><a href="#crypto" onClick={() => setTocOpen(false)} className="text-primary hover:underline block py-1.5">6. Cryptocurrency</a></li>
                    <li><a href="#metals" onClick={() => setTocOpen(false)} className="text-primary hover:underline block py-1.5">7. Gold, Silver & Jewelry</a></li>
                    <li><a href="#realestate" onClick={() => setTocOpen(false)} className="text-primary hover:underline block py-1.5">8. Real Estate</a></li>
                    <li><a href="#business" onClick={() => setTocOpen(false)} className="text-primary hover:underline block py-1.5">9. Business Assets</a></li>
                    <li><a href="#debts" onClick={() => setTocOpen(false)} className="text-primary hover:underline block py-1.5">10. Debts & Liabilities</a></li>
                    <li><a href="#trusts" onClick={() => setTocOpen(false)} className="text-primary hover:underline block py-1.5">11. Trusts</a></li>
                    <li><a href="#references" onClick={() => setTocOpen(false)} className="text-primary hover:underline block py-1.5">12. References</a></li>
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            </nav>
          ) : (
            <nav className="mb-12 p-6 rounded-lg bg-muted/30 border border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm columns-2">
                <li><a href="#nisab" className="text-primary hover:underline block py-1">1. The Niṣāb Threshold</a></li>
                <li><a href="#hawl" className="text-primary hover:underline block py-1">2. The Ḥawl (Zakat Year)</a></li>
                <li><a href="#liquid" className="text-primary hover:underline block py-1">3. Liquid Assets & Cash</a></li>
                <li><a href="#stocks" className="text-primary hover:underline block py-1">4. Stocks & Investments</a></li>
                <li><a href="#retirement" className="text-primary hover:underline block py-1">5. Retirement Accounts</a></li>
                <li><a href="#crypto" className="text-primary hover:underline block py-1">6. Cryptocurrency</a></li>
                <li><a href="#metals" className="text-primary hover:underline block py-1">7. Gold, Silver & Jewelry</a></li>
                <li><a href="#realestate" className="text-primary hover:underline block py-1">8. Real Estate</a></li>
                <li><a href="#business" className="text-primary hover:underline block py-1">9. Business Assets</a></li>
                <li><a href="#debts" className="text-primary hover:underline block py-1">10. Debts & Liabilities</a></li>
                <li><a href="#trusts" className="text-primary hover:underline block py-1">11. Trusts</a></li>
                <li><a href="#references" className="text-primary hover:underline block py-1">12. References</a></li>
              </ul>
            </nav>
          )}

          {/* Sections */}
          <div className="space-y-16">
            
            {/* Nisab Section */}
            <section id="nisab">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Scale className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">1. The Niṣāb Threshold</h2>
              </div>
              
              <div className="space-y-4 text-muted-foreground">
                <p>
                  The niṣāb is the minimum amount of wealth a Muslim must possess before Zakat becomes obligatory. 
                  It acts as the "poverty line in reverse"—wealth below this limit is exempt, while wealth at or 
                  above it triggers the Zakat obligation.
                </p>

                <h3 className="text-lg font-medium text-foreground mt-6">Historical Foundation</h3>
                <p>
                  The Prophet Muhammad (ﷺ) established two niṣāb measurements:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-foreground">Gold:</strong> 20 mithqals, equivalent to approximately 85 grams (≈3 ounces)</li>
                  <li><strong className="text-foreground">Silver:</strong> 200 dirhams, equivalent to approximately 595 grams (≈21 ounces)</li>
                </ul>
                <p>
                  In the Prophet's time, these two amounts were roughly equivalent in purchasing power. Today, 
                  due to the divergence between gold and silver prices, they represent vastly different thresholds.
                </p>

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

                <h3 className="text-lg font-medium text-foreground mt-6">Scholarly Consensus on Which to Use</h3>
                <p>
                  The majority of contemporary scholars, relief organizations, and Islamic finance researchers 
                  advocate for the <strong className="text-foreground">silver standard</strong> when calculating Zakat on cash, 
                  bank accounts, and mixed financial assets. This position is based on two key Islamic legal principles:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-foreground"><em>Anfa' li'l-fuqara</em> (Most beneficial for the poor):</strong> Using 
                    the lower threshold ensures more Zakat flows to those in need.
                  </li>
                  <li>
                    <strong className="text-foreground"><em>Ahwat</em> (The precautionary principle):</strong> When in doubt, 
                    it is safer to pay Zakat than to risk neglecting an obligation.
                  </li>
                </ul>
                <p>
                  The gold standard remains valid for those whose wealth is held exclusively in physical gold bullion, 
                  as this directly matches the original measurement established by the Prophet (ﷺ).
                </p>

                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mt-6">
                  <p className="text-sm">
                    <strong className="text-foreground">Practical Guidance:</strong> If you possess wealth exceeding the silver 
                    niṣāb, you are undoubtedly wealthy enough to contribute. This conservative approach ensures no 
                    eligible Zakat is missed and maximizes benefit to Zakat recipients.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Hawl Section */}
            <section id="hawl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">2. The Ḥawl (Zakat Year)</h2>
              </div>
              
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Zakat is an <strong className="text-foreground">annual obligation</strong>, not a transaction tax. 
                  For wealth to be Zakatable, it must be held above the niṣāb threshold for one complete lunar year (ḥawl). 
                  The ḥawl begins when your assets first reach the niṣāb, or from the date you last paid Zakat.
                </p>

                <h3 className="text-lg font-medium text-foreground mt-6">Lunar vs. Solar Year</h3>
                
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

                <h3 className="text-lg font-medium text-foreground mt-6">Why the Rate Adjustment?</h3>
                <p>
                  The solar year is approximately 11 days longer than the lunar year. Over a lifetime, this difference 
                  compounds significantly—33 solar years equal approximately 34 lunar years. Without adjustment, 
                  those using the solar calendar would pay less Zakat over their lifetime, shortchanging recipients.
                </p>
                <p>
                  The adjusted rate is calculated as: <code className="px-2 py-1 rounded bg-muted text-foreground">2.5% × (365.25 ÷ 354.37) ≈ 2.577%</code>
                </p>
                <p>
                  This ensures your charity is precise regardless of which calendar you choose to follow.
                </p>

                <h3 className="text-lg font-medium text-foreground mt-6">Choosing Your Zakat Date</h3>
                <p>
                  Select a date that is easy to remember and maintain consistently each year. Common choices include:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>The first of Ramadan (lunar calendar)</li>
                  <li>January 1st (convenient for financial planning)</li>
                  <li>The anniversary of when you first exceeded the niṣāb</li>
                  <li>Your birthday or another personally significant date</li>
                </ul>
                <p className="mt-2">
                  <strong className="text-foreground">Consistency matters more than the specific date.</strong> Once chosen, 
                  maintain the same Zakat date each year.
                </p>
              </div>
            </section>

            <Separator />

            {/* Liquid Assets Section */}
            <section id="liquid">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">3. Liquid Assets & Cash</h2>
              </div>
              
              <div className="space-y-4 text-muted-foreground">
                <p>
                  The consensus among contemporary scholars is that <strong className="text-foreground">fiat currency (USD, etc.) 
                  takes the ruling of gold and silver</strong> as a store of value and medium of exchange. Therefore, the 
                  entire closing balance of all liquid accounts on your Zakat date is liable for Zakat.
                </p>

                <h3 className="text-lg font-medium text-foreground mt-6">What Counts as Liquid Assets</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-foreground">Checking Accounts:</strong> Full balance is Zakatable
                  </li>
                  <li>
                    <strong className="text-foreground">Savings Accounts:</strong> Full balance is Zakatable (interest must be 
                    tracked separately—see below)
                  </li>
                  <li>
                    <strong className="text-foreground">Cash on Hand:</strong> Physical currency in your wallet, home safe, or 
                    anywhere else
                  </li>
                  <li>
                    <strong className="text-foreground">Digital Wallets:</strong> PayPal, Venmo, CashApp, Zelle, Apple Pay Cash, 
                    and similar balances
                  </li>
                  <li>
                    <strong className="text-foreground">Foreign Currency:</strong> Convert to USD at the current spot exchange 
                    rate on your Zakat date (not your original purchase price)
                  </li>
                  <li>
                    <strong className="text-foreground">Money Market Accounts:</strong> Treated the same as savings accounts
                  </li>
                  <li>
                    <strong className="text-foreground">Certificates of Deposit (CDs):</strong> Zakatable if accessible (even 
                    with penalty)
                  </li>
                </ul>

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
                    year-to-date interest separately and donate it to charitable causes (excluding mosques and Islamic 
                    educational institutions, according to some scholars).
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Stocks Section */}
            <section id="stocks">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">4. Stocks & Investments</h2>
              </div>
              
              <div className="space-y-4 text-muted-foreground">
                <p>
                  The treatment of stocks depends on your <strong className="text-foreground">intent</strong>. When you own 
                  shares, you own a percentage of the company entity—this creates two distinct categories with different 
                  Zakat implications.
                </p>

                <h3 className="text-lg font-medium text-foreground mt-6">Active Holdings (Trading)</h3>
                <p>
                  If you purchase stocks with the intention to sell in the short-term for capital gain (day trading, 
                  swing trading, momentum investing), the stocks are classified as <strong className="text-foreground">commercial 
                  merchandise (ʿurūḍ al-tijārah)</strong>.
                </p>
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="font-medium text-foreground">Zakat Calculation:</p>
                  <p className="text-sm">Pay 2.5% (or 2.577% for solar year) on <strong>100% of the market value</strong> on your Zakat date.</p>
                </div>

                <h3 className="text-lg font-medium text-foreground mt-6">Passive Holdings (Long-Term Investment)</h3>
                <p>
                  If shares are held for long-term appreciation and dividends (buy and hold strategy), the shareholder 
                  is considered a passive investor, not a trader. In this case, Zakat shifts from the full market value 
                  to the <strong className="text-foreground">company's Zakatable assets</strong> (its cash, receivables, and inventory).
                </p>

                <h3 className="text-lg font-medium text-foreground mt-6">The 30% Rule (AAOIFI Standard 35)</h3>
                <p>
                  Calculating the precise Net Zakatable Assets for each company in a diversified portfolio is impractical 
                  for individual investors. Research by the Accounting and Auditing Organization for Islamic Financial 
                  Institutions (AAOIFI) shows that the liquid/zakatable assets of Shariah-compliant companies 
                  average approximately <strong className="text-foreground">30% of market capitalization</strong>.
                </p>
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="font-medium text-foreground">Practical Calculation (30% Rule):</p>
                  <p className="text-sm">
                    Market Value × 30% × 2.5% = Zakat Due<br />
                    This gives an effective rate of approximately <strong className="text-foreground">0.75% of market value</strong>.
                  </p>
                </div>

                <h3 className="text-lg font-medium text-foreground mt-6">Important Exclusions</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-foreground">Unvested RSUs (Restricted Stock Units):</strong> Not Zakatable until vested—you don't own them yet
                  </li>
                  <li>
                    <strong className="text-foreground">ESPP (Employee Stock Purchase Plans):</strong> Not Zakatable until shares are purchased and transferred to you
                  </li>
                  <li>
                    <strong className="text-foreground">Stock Options:</strong> Not Zakatable until exercised and converted to actual shares
                  </li>
                </ul>

                <h3 className="text-lg font-medium text-foreground mt-6">Dividend Purification</h3>
                <p>
                  If a company derives a small percentage (typically less than 5%) of its revenue from impermissible 
                  sources (interest income, alcohol, gambling, etc.), that proportion of any dividends received must 
                  be donated to charity. This is separate from Zakat—it is purification of impure income.
                </p>

                <h3 className="text-lg font-medium text-foreground mt-6">Mutual Funds & ETFs</h3>
                <p>
                  Mutual funds and ETFs are treated the same as individual stocks. Look through to the underlying 
                  holdings and apply the same active/passive distinction based on your investment intent.
                </p>
              </div>
            </section>

            <Separator />

            {/* Retirement Section */}
            <section id="retirement">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">5. Retirement Accounts (401k, IRA, Roth)</h2>
              </div>
              
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Retirement accounts present the most complex Zakat challenge in contemporary Islamic finance due to 
                  access restrictions, early withdrawal penalties, and deferred taxation. The central question is 
                  whether these funds meet the criterion of <strong className="text-foreground">Milk Tām (complete possession)</strong>.
                </p>

                <h3 className="text-lg font-medium text-foreground mt-6">The Scholarly Debate</h3>
                <p>
                  Scholars have differed on when Zakat becomes due on retirement accounts. The positions range from:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>No Zakat until retirement age and penalty-free withdrawal</li>
                  <li>Zakat on the full account value annually</li>
                  <li>Zakat on the "accessible balance" after accounting for penalties and taxes</li>
                </ul>

                <h3 className="text-lg font-medium text-foreground mt-6">The AMJA/Bradford Position</h3>
                <p>
                  According to Sheikh Joe Bradford and AMJA guidance, retirement funds <strong className="text-foreground">ARE 
                  technically accessible</strong>—the 10% early withdrawal penalty is a deterrent, not a legal prohibition. 
                  You could liquidate your 401(k) tomorrow if you chose to.
                </p>
                <p>
                  However, it would be <strong className="text-foreground">unjust to pay Zakat on money that effectively 
                  belongs to the government</strong> (in the form of taxes and penalties) or would be lost upon withdrawal.
                </p>

                <h3 className="text-lg font-medium text-foreground mt-6">The Accessible Balance Method</h3>
                <p>
                  This practical approach calculates the Net Zakatable Value of retirement accounts:
                </p>
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <ol className="list-decimal pl-4 space-y-2 text-sm">
                    <li>Start with your <strong className="text-foreground">Vested Balance</strong> only (unvested employer match is exempt—you don't own it yet)</li>
                    <li>Subtract the <strong className="text-foreground">10% early withdrawal penalty</strong> (if you are under age 59½)</li>
                    <li>Subtract your <strong className="text-foreground">estimated federal income tax</strong> at your marginal rate</li>
                    <li>Subtract your <strong className="text-foreground">estimated state income tax</strong> if applicable</li>
                    <li>The result is your <strong className="text-foreground">Net Zakatable Value</strong></li>
                  </ol>
                </div>

                <h3 className="text-lg font-medium text-foreground mt-6">Account-Specific Rules</h3>
                
                <h4 className="font-medium text-foreground mt-4">Traditional 401(k) & Traditional IRA</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Contributions were made pre-tax</li>
                  <li>Withdrawals are taxed as ordinary income</li>
                  <li>Apply the Accessible Balance Method above</li>
                  <li>Once you reach 59½, the 10% penalty no longer applies—only deduct estimated taxes</li>
                </ul>

                <h4 className="font-medium text-foreground mt-4">Roth IRA (Special Treatment)</h4>
                <p className="text-sm">
                  Roth IRAs function differently because contributions are made with after-tax dollars:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li><strong className="text-foreground">Contributions (Principal):</strong> Can be withdrawn tax-free and penalty-free at any time. <strong>Fully Zakatable</strong> without any deductions.</li>
                  <li><strong className="text-foreground">Earnings:</strong> Subject to the 5-year rule and age 59½ requirement. Treat earnings like a Traditional IRA (apply the Accessible Balance Method).</li>
                </ul>
                <p className="text-sm mt-2">
                  <em>Simpler approach:</em> Some scholars recommend paying Zakat on the entire Roth value, treating any 
                  excess paid on restricted earnings as a pre-payment of future Zakat.
                </p>

                <h4 className="font-medium text-foreground mt-4">HSA (Health Savings Account)</h4>
                <p className="text-sm">
                  HSA funds are fully accessible for qualified medical expenses without penalty at any age. Therefore, 
                  the entire HSA balance is <strong className="text-foreground">fully Zakatable</strong>.
                </p>

                <h4 className="font-medium text-foreground mt-4">403(b), 457, TSP, and Similar Plans</h4>
                <p className="text-sm">
                  These employer-sponsored plans follow the same principles as 401(k) accounts. Apply the Accessible 
                  Balance Method based on your specific plan's vesting schedule and withdrawal rules.
                </p>

                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mt-6">
                  <p className="text-sm font-medium text-foreground">Important Note on 401(k) Loans</p>
                  <p className="text-sm mt-1">
                    If you've taken a loan from your 401(k), that money is now cash in your possession (Zakatable as 
                    a liquid asset). The outstanding loan is <strong>NOT a deductible liability</strong> for Zakat 
                    purposes—you owe this money to yourself, not to an external creditor.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Crypto Section */}
            <section id="crypto">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Coins className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">6. Cryptocurrency & Digital Assets</h2>
              </div>
              
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Cryptocurrency occupies a unique position in Islamic jurisprudence, spanning the line between 
                  <strong className="text-foreground"> currency (thaman)</strong> and <strong className="text-foreground">speculative 
                  trade goods (ʿurūḍ al-tijārah)</strong>. The classification—and therefore Zakat treatment—depends on 
                  both the nature of the specific crypto asset and your intention for holding it.
                </p>

                <h3 className="text-lg font-medium text-foreground mt-6">The Fundamental Principle</h3>
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="text-sm">
                    Any crypto-asset purchased with the <strong className="text-foreground">intent of short-term resale for 
                    profit</strong> (trading) is <strong className="text-foreground">100% Zakatable</strong> on its market value, 
                    regardless of the type of token or coin.
                  </p>
                </div>
                <p>
                  The distinction below only applies to assets held for the long term without immediate trading intent.
                </p>

                <h3 className="text-lg font-medium text-foreground mt-6">Category A: Cryptocurrencies (Payment Tokens)</h3>
                <p>
                  Major cryptocurrencies that function as mediums of exchange and stores of value are treated as 
                  <strong className="text-foreground"> currency</strong>. Zakat is due on <strong className="text-foreground">100% 
                  of market value</strong> regardless of your holding intent.
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li><strong className="text-foreground">Bitcoin (BTC):</strong> Widely accepted as payment, clearly a currency—fully Zakatable</li>
                  <li><strong className="text-foreground">Ethereum (ETH):</strong> Used extensively for transactions and gas fees—fully Zakatable</li>
                  <li><strong className="text-foreground">Stablecoins (USDC, USDT, DAI):</strong> Pegged to fiat currency—fully Zakatable</li>
                  <li><strong className="text-foreground">Other payment-focused cryptocurrencies:</strong> If actively used as money, fully Zakatable</li>
                </ul>

                <h3 className="text-lg font-medium text-foreground mt-6">Category B: Utility & Platform Tokens</h3>
                <p>
                  Tokens used within specific ecosystems (dApps, games, protocols) that are <strong className="text-foreground">not 
                  held for resale</strong> but for their utility may be exempt from Zakat:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li><strong className="text-foreground">Platform tokens:</strong> Used within decentralized applications—exempt if held for use, not sale</li>
                  <li><strong className="text-foreground">Governance tokens:</strong> Used for voting in DAOs—exempt if held for governance participation</li>
                  <li><strong className="text-foreground">Gaming tokens:</strong> Used within blockchain games—exempt if held for gameplay</li>
                </ul>
                <p className="text-sm mt-2">
                  <em>Caution:</em> If these tokens can be easily sold on exchanges and you would sell them if the price 
                  was right, the trading intent arguably applies.
                </p>

                <h3 className="text-lg font-medium text-foreground mt-6">Staking, DeFi & Yield Farming</h3>
                
                <h4 className="font-medium text-foreground mt-4">Staked Tokens</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li><strong className="text-foreground">Staking Principal:</strong> You retain ownership of staked tokens—fully Zakatable at market value</li>
                  <li><strong className="text-foreground">Staking Rewards (Accessible):</strong> Rewards that have vested and can be withdrawn are Zakatable</li>
                  <li><strong className="text-foreground">Staking Rewards (Locked):</strong> Rewards that are locked or unvested are exempt until you gain possession</li>
                </ul>

                <h4 className="font-medium text-foreground mt-4">Liquidity Pool Positions</h4>
                <p className="text-sm">
                  Pay Zakat on the <strong className="text-foreground">current redeemable value</strong> of your LP tokens. 
                  This is the value of the underlying assets you would receive if you withdrew from the pool today. 
                  Account for impermanent loss when calculating.
                </p>

                <h4 className="font-medium text-foreground mt-4">Lending Protocols</h4>
                <p className="text-sm">
                  The principal deposited in lending protocols remains Zakatable. Interest/yield earned may have 
                  separate Shariah considerations beyond Zakat.
                </p>

                <h3 className="text-lg font-medium text-foreground mt-6">NFTs (Non-Fungible Tokens)</h3>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li><strong className="text-foreground">NFTs held for resale:</strong> Commercial merchandise—fully Zakatable at estimated market value</li>
                  <li><strong className="text-foreground">NFTs kept for personal enjoyment:</strong> Like art on your walls—generally exempt as personal belongings (qunya)</li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* Precious Metals Section */}
            <section id="metals">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Coins className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">7. Gold, Silver & Jewelry</h2>
              </div>
              
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Gold and silver hold special significance in Zakat law as they were the original basis for the 
                  niṣāb measurement and the only commodities explicitly mentioned in the Prophetic traditions on Zakat.
                </p>

                <h3 className="text-lg font-medium text-foreground mt-6">What Is Always Zakatable</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-foreground">Gold and silver bullion:</strong> Bars, ingots, coins held as investment—fully Zakatable</li>
                  <li><strong className="text-foreground">Gold/silver in investment accounts:</strong> Paper gold, gold ETFs, allocated gold accounts—fully Zakatable</li>
                  <li><strong className="text-foreground">Gold/silver coins:</strong> Whether collectible or bullion—Zakatable on metal content value</li>
                </ul>

                <h3 className="text-lg font-medium text-foreground mt-6">The Jewelry Controversy</h3>
                <p>
                  The treatment of personal jewelry is one of the most debated topics in Zakat jurisprudence:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <h4 className="font-medium text-foreground mb-2">Majority View (Shafi'i, Maliki, Hanbali)</h4>
                    <p className="text-sm">
                      Jewelry that is <strong className="text-foreground">permissible and worn regularly</strong> is exempt 
                      from Zakat. It is treated like clothing and other personal items (qunya) that are not Zakatable.
                    </p>
                    <p className="text-sm mt-2">
                      This exemption applies to jewelry in regular rotation of use—not items stored away and never worn.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <h4 className="font-medium text-foreground mb-2">Hanafi View</h4>
                    <p className="text-sm">
                      Gold and silver are inherently <strong className="text-foreground">"growing wealth" (Nāmī)</strong> by 
                      nature, regardless of form. Therefore, even worn jewelry is Zakatable on its melt value.
                    </p>
                    <p className="text-sm mt-2">
                      This view treats all gold and silver as monetary metals subject to Zakat.
                    </p>
                  </div>
                </div>

                <h3 className="text-lg font-medium text-foreground mt-6">US Contextual Guidance</h3>
                <p>
                  Sheikh Joe Bradford's position for American Muslims:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>Daily-wear jewelry may be exempt under the majority view</li>
                  <li>However, "excessive" amounts (heavy gold sets kept in safety deposit boxes, never worn) should follow the Hanafi view to avoid hoarding (Kanz)</li>
                  <li>When in doubt, paying Zakat on jewelry is the safer and more praiseworthy approach</li>
                </ul>

                <h3 className="text-lg font-medium text-foreground mt-6">Valuation Method</h3>
                <p>
                  When paying Zakat on jewelry, calculate based on the <strong className="text-foreground">melt value 
                  (scrap value)</strong> of the metal content only:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Gemstones are not Zakatable (unless the jewelry is trade inventory)</li>
                  <li>Craftsmanship premium is not included</li>
                  <li>Designer/brand value is not included</li>
                  <li>Only the weight of gold/silver × current spot price</li>
                </ul>

                <h3 className="text-lg font-medium text-foreground mt-6">Other Precious Metals</h3>
                <p className="text-sm">
                  Platinum, palladium, and other precious metals are <strong className="text-foreground">not subject to the 
                  same rules as gold and silver</strong>. They are treated as commodities—Zakatable only if held for trading/resale.
                </p>
              </div>
            </section>

            <Separator />

            {/* Real Estate Section */}
            <section id="realestate">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Building className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">8. Real Estate</h2>
              </div>
              
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Real estate treatment in Zakat depends entirely on the owner's <strong className="text-foreground">intent</strong>. 
                  The same property can have vastly different Zakat implications based on how it is used or held.
                </p>

                <h3 className="text-lg font-medium text-foreground mt-6">Primary Residence</h3>
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="font-medium text-foreground">Ruling: Completely Exempt</p>
                  <p className="text-sm mt-1">
                    Your home used for personal shelter is <em>qunya</em> (personal use property) and is never subject 
                    to Zakat, regardless of its value. This includes second homes used personally for vacation.
                  </p>
                </div>

                <h3 className="text-lg font-medium text-foreground mt-6">Rental Property (Investment)</h3>
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="font-medium text-foreground">Property Value: Not Zakatable</p>
                  <p className="text-sm mt-1">
                    The property itself is a <strong className="text-foreground">productive asset</strong>, similar to 
                    business equipment or machinery. You do not pay Zakat on its market value.
                  </p>
                  <p className="font-medium text-foreground mt-3">Net Rental Income: Zakatable</p>
                  <p className="text-sm mt-1">
                    Rental income that remains in your bank account on your Zakat date IS Zakatable as part of your 
                    liquid assets. The property generates income; that income becomes cash; that cash is Zakatable.
                  </p>
                </div>

                <h3 className="text-lg font-medium text-foreground mt-6">Property Held for Flipping/Resale</h3>
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="font-medium text-foreground">Ruling: Fully Zakatable</p>
                  <p className="text-sm mt-1">
                    If property was purchased with the <strong className="text-foreground">express intent to sell for 
                    profit</strong> (fix-and-flip, land speculation, development for sale), it is classified as 
                    <em> ʿurūḍ al-tijārah</em> (trade goods).
                  </p>
                  <p className="text-sm mt-2">
                    Pay Zakat on the <strong className="text-foreground">full current market value</strong> annually. 
                    If cash is tight, you may liquidate other assets to pay, or record as a debt to yourself to be 
                    settled upon sale.
                  </p>
                </div>

                <h3 className="text-lg font-medium text-foreground mt-6">Vehicles</h3>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li><strong className="text-foreground">Personal vehicles:</strong> Exempt as personal use property</li>
                  <li><strong className="text-foreground">Uber/Lyft/delivery vehicles:</strong> Exempt as tools of trade—Zakat is due on the earnings (cash), not the vehicle</li>
                  <li><strong className="text-foreground">Vehicle dealership inventory:</strong> Commercial merchandise—fully Zakatable</li>
                </ul>

                <h3 className="text-lg font-medium text-foreground mt-6">Real Estate Investment Trusts (REITs)</h3>
                <p className="text-sm">
                  REITs are typically treated like stocks. For passive long-term holdings, apply the 30% rule on the 
                  REIT's liquid assets. For actively traded REIT positions, consider 100% of market value Zakatable.
                </p>
              </div>
            </section>

            <Separator />

            {/* Business Section */}
            <section id="business">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Landmark className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">9. Business Assets</h2>
              </div>
              
              <div className="space-y-4 text-muted-foreground">
                <p>
                  For business owners, Zakat is calculated on the <strong className="text-foreground">Zakatable portion 
                  of business assets</strong>, not the entire value of the business.
                </p>

                <h3 className="text-lg font-medium text-foreground mt-6">What IS Zakatable</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-foreground">Cash and bank balances:</strong> All business cash accounts</li>
                  <li><strong className="text-foreground">Accounts receivable:</strong> Money owed to you by customers (if collectible)</li>
                  <li><strong className="text-foreground">Inventory:</strong> Goods held for sale, valued at current selling price (not cost)</li>
                  <li><strong className="text-foreground">Raw materials:</strong> Materials intended for production and sale</li>
                  <li><strong className="text-foreground">Work in progress:</strong> Partially completed goods intended for sale</li>
                </ul>

                <h3 className="text-lg font-medium text-foreground mt-6">What Is NOT Zakatable</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-foreground">Fixed assets:</strong> Equipment, machinery, furniture used in business operations</li>
                  <li><strong className="text-foreground">Real estate:</strong> Buildings and land used for business (not held for resale)</li>
                  <li><strong className="text-foreground">Vehicles:</strong> Company cars, trucks, delivery vehicles used in operations</li>
                  <li><strong className="text-foreground">Goodwill:</strong> Brand value and intangible assets</li>
                  <li><strong className="text-foreground">Intellectual property:</strong> Patents, trademarks, copyrights (unless licensed for royalty income)</li>
                </ul>

                <h3 className="text-lg font-medium text-foreground mt-6">Inventory Valuation</h3>
                <p>
                  Value inventory at the <strong className="text-foreground">current selling price</strong>, not at your cost. 
                  This follows the classical fiqh treatment of trade goods (ʿurūḍ al-tijārah), which are valued at what 
                  they would sell for, not what you paid.
                </p>

                <h3 className="text-lg font-medium text-foreground mt-6">Service Businesses</h3>
                <p className="text-sm">
                  If your business provides services rather than goods (consulting, software, legal, medical), you 
                  typically have no inventory. Your Zakatable business assets are primarily cash, bank balances, and 
                  accounts receivable.
                </p>
              </div>
            </section>

            <Separator />

            {/* Debts Section */}
            <section id="debts">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <HandCoins className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">10. Debts & Liabilities</h2>
              </div>
              
              <div className="space-y-4 text-muted-foreground">
                <h3 className="text-lg font-medium text-foreground">Debts Owed TO You (Receivables)</h3>
                <p>
                  Money that others owe you is potentially Zakatable, depending on the likelihood of collection:
                </p>
                
                <h4 className="font-medium text-foreground mt-4">Good Debt (Dayn Qawiyy)</h4>
                <p className="text-sm">
                  If the borrower is <strong className="text-foreground">willing and able to pay</strong>, and you can 
                  collect at will, this debt is effectively <strong className="text-foreground">like cash in your pocket</strong>. 
                  Pay Zakat on the full amount annually.
                </p>

                <h4 className="font-medium text-foreground mt-4">Bad Debt (Dayn Da'if)</h4>
                <p className="text-sm">
                  If the borrower is <strong className="text-foreground">unable or unwilling to pay</strong>, or the 
                  debt is disputed, it is not Zakatable until actually collected. Some scholars recommend paying Zakat 
                  retroactively for all years when finally collected.
                </p>

                <h3 className="text-lg font-medium text-foreground mt-6">Debts Owed BY You (Liabilities)</h3>
                <p>
                  The treatment of your own debts for Zakat purposes is nuanced:
                </p>

                <h4 className="font-medium text-foreground mt-4">Deductible Debts</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Debts due within the coming year (current portion)</li>
                  <li>Credit card balances</li>
                  <li>Short-term personal loans</li>
                  <li>Business accounts payable due soon</li>
                </ul>

                <h4 className="font-medium text-foreground mt-4">Non-Deductible (or Limited Deduction)</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li><strong className="text-foreground">Long-term mortgage:</strong> Most scholars only allow deducting the portion due in the next 12 months, not the entire mortgage balance</li>
                  <li><strong className="text-foreground">Student loans:</strong> Only the upcoming year's payments are typically deductible</li>
                  <li><strong className="text-foreground">Car loans:</strong> Only the upcoming year's payments</li>
                  <li><strong className="text-foreground">401(k) loans:</strong> Not deductible—you owe this to yourself</li>
                </ul>

                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mt-6">
                  <p className="text-sm font-medium text-foreground">Practical Guidance</p>
                  <p className="text-sm mt-1">
                    The general principle: Deduct only what you are <strong className="text-foreground">actually obligated 
                    to pay within the coming year</strong>. A 30-year mortgage does not negate 29 years of Zakat obligation.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Trusts Section */}
            <section id="trusts">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">11. Trusts</h2>
              </div>
              
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Trusts require careful analysis of who holds <strong className="text-foreground">Milk (ownership)</strong>—
                  specifically <em>Raqabah</em> (legal title) and <em>Yad</em> (ability to access and control).
                </p>

                <h3 className="text-lg font-medium text-foreground mt-6">Revocable Living Trusts</h3>
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="font-medium text-foreground">Ruling: Fully Zakatable</p>
                  <p className="text-sm mt-1">
                    The Grantor retains full control and can revoke the trust at any time. The trust is merely a 
                    legal shell for estate planning purposes. Treat all assets in the trust as your personal property.
                  </p>
                </div>

                <h3 className="text-lg font-medium text-foreground mt-6">Irrevocable Trusts</h3>
                <p>
                  In an irrevocable trust, the Grantor theoretically gives up ownership to a Trustee:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>
                    <strong className="text-foreground">If you CANNOT access principal:</strong> Not Zakatable by you 
                    (lacks Milk Tām). The beneficiaries may have Zakat obligations when they receive distributions.
                  </li>
                  <li>
                    <strong className="text-foreground">If you CAN access principal:</strong> Zakatable as your property, 
                    despite the trust structure.
                  </li>
                </ul>
                <p className="text-sm mt-2">
                  <em>Important:</em> Being a "Grantor Trust" for tax purposes doesn't automatically mean you owe Zakat. 
                  Zakat follows actual ownership and access, not tax classification.
                </p>

                <h3 className="text-lg font-medium text-foreground mt-6">Charitable Lead Annuity Trusts (CLATs)</h3>
                <p className="text-sm">
                  These "split-interest" trusts pay charity an annuity for a set term, then transfer remaining assets 
                  to heirs:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li><strong className="text-foreground">During the term:</strong> No Zakat—charity owns the usufruct, heirs lack possession</li>
                  <li><strong className="text-foreground">After the term:</strong> Heirs begin paying Zakat when assets transfer to their control</li>
                </ul>

                <h3 className="text-lg font-medium text-foreground mt-6">Custodial Accounts (UTMA/UGMA)</h3>
                <p className="text-sm">
                  Assets in custodial accounts belong to the minor child, not the custodian parent. If the child's 
                  assets exceed the niṣāb, Zakat is due—typically paid by the parent on the child's behalf from the 
                  child's assets.
                </p>
              </div>
            </section>

            <Separator />

            {/* References Section */}
            <section id="references" className="pt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">12. References & Further Reading</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Primary Sources</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li>
                      <strong className="text-foreground">Sheikh Joe Bradford</strong>
                      <p className="text-sm">
                        "Simple Zakat Guide: Understand and Calculate Your Zakat" — A comprehensive book and methodology 
                        for American Muslims. Available at <a href="https://joebradford.net" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">joebradford.net</a>
                      </p>
                    </li>
                    <li>
                      <strong className="text-foreground">Assembly of Muslim Jurists of America (AMJA)</strong>
                      <p className="text-sm">
                        Fatwas on Zakat, retirement accounts, and contemporary financial instruments. 
                        Available at <a href="https://www.amjaonline.org" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">amjaonline.org</a>
                      </p>
                    </li>
                    <li>
                      <strong className="text-foreground">AAOIFI Shariah Standard 35</strong>
                      <p className="text-sm">
                        "Zakah" — Technical standard from the Accounting and Auditing Organization for Islamic 
                        Financial Institutions covering investment Zakat calculations.
                      </p>
                    </li>
                    <li>
                      <strong className="text-foreground">Islamic Finance Guru</strong>
                      <p className="text-sm">
                        Detailed guides on Zakat for cryptocurrency, investments, and modern assets. 
                        Available at <a href="https://www.islamicfinanceguru.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">islamicfinanceguru.com</a>
                      </p>
                    </li>
                    <li>
                      <strong className="text-foreground">Zakat.fyi</strong>
                      <p className="text-sm">
                        Educational resources and calculation tools for Zakat.
                      </p>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Key Concepts Referenced</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><strong className="text-foreground">Milk Tām:</strong> Complete possession — the requirement that you have full ownership and access to wealth for Zakat to apply</li>
                    <li><strong className="text-foreground">ʿUrūḍ al-Tijārah:</strong> Trade goods — merchandise held for sale, Zakatable at full market value</li>
                    <li><strong className="text-foreground">Qunya:</strong> Personal use property — items used personally that are exempt from Zakat</li>
                    <li><strong className="text-foreground">Nāmī:</strong> Growing/productive wealth — assets that have potential for growth</li>
                    <li><strong className="text-foreground">Ḥawl:</strong> The lunar year period wealth must be held above niṣāb for Zakat to become obligatory</li>
                    <li><strong className="text-foreground">Kanz:</strong> Hoarding — the prohibited practice of hoarding wealth without paying Zakat</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Disclaimer</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        This methodology guide is provided for educational and informational purposes only. It does not 
                        constitute religious advice. For specific rulings on your personal situation, please consult a 
                        qualified Islamic scholar or your local imam. Zakat is a religious obligation, and its proper 
                        fulfillment is a matter between you and Allah.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-border text-center space-y-4">
            <Button onClick={() => navigate("/")} className="gap-2">
              Start Calculating Your Zakat
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Button>
            <p className="text-xs text-muted-foreground">
              Built by Naheed Vora. This calculator is provided on an as-is basis.
            </p>
          </footer>
        </div>
        
        {/* Back to Top Button - Mobile */}
        {showBackToTop && (
          <Button
            variant="secondary"
            size="icon"
            className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg"
            onClick={scrollToTop}
          >
            <ChevronUp className="h-5 w-5" />
            <span className="sr-only">Back to top</span>
          </Button>
        )}
      </div>
    </>
  );
};

export default Methodology;
