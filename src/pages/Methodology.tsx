import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Scale, Calendar, Coins, Building, TrendingUp, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Methodology = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Zakat Methodology & References - ZakatFlow</title>
        <meta 
          name="description" 
          content="Learn about the scholarly methodology and Islamic jurisprudence behind ZakatFlow's Zakat calculations, based on Sheikh Joe Bradford's comprehensive treatise." 
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
            <p className="text-lg text-muted-foreground">
              This calculator is based on "The Jurisprudence of Wealth: A Comprehensive Treatise on 
              Zakat Calculation for the Contemporary American Muslim" by Sheikh Joe Bradford and 
              guidance from the Assembly of Muslim Jurists of America (AMJA).
            </p>
          </header>

          {/* Sections */}
          <div className="space-y-12">
            {/* Nisab Section */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Scale className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">The Niṣāb Threshold</h2>
              </div>
              <div className="prose prose-muted-foreground max-w-none">
                <p className="text-muted-foreground mb-4">
                  The niṣāb acts as the "poverty line in reverse"—it is the threshold of sufficiency. 
                  Wealth below this limit is exempt, while wealth above it triggers the Zakat obligation.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong className="text-foreground">Historical Basis:</strong> The Prophet Muhammad (ﷺ) set the niṣāb 
                  for gold at 20 mithqals (≈85 grams) and for silver at 200 dirhams (≈595 grams).
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong className="text-foreground">The Modern Divergence:</strong>
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                  <li><strong className="text-foreground">Gold Standard</strong> (85g) ≈ $6,500–$7,000 USD — exempts more people</li>
                  <li><strong className="text-foreground">Silver Standard</strong> (595g) ≈ $450–$550 USD — captures more Muslims in the obligation</li>
                </ul>
                <p className="text-muted-foreground">
                  The majority of scholars, relief organizations, and researchers advocate for the silver standard 
                  for cash and mixed assets, based on <em>anfa' li'l-fuqara</em> (most beneficial for the poor) 
                  and <em>ahwat</em> (the precautionary principle).
                </p>
              </div>
            </section>

            {/* Hawl Section */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">The Ḥawl (Zakat Year)</h2>
              </div>
              <div className="prose prose-muted-foreground max-w-none">
                <p className="text-muted-foreground mb-4">
                  Zakat is an annual obligation, not a transaction tax. The asset must be held for one full year (ḥawl).
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong className="text-foreground">Lunar Year (Islamic Calendar):</strong> 354 days long, traditional 2.5% rate.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong className="text-foreground">Solar Year (Gregorian Calendar):</strong> 365 days long, adjusted rate of 2.577%.
                </p>
                <p className="text-muted-foreground">
                  The solar year is 11 days longer. To prevent shortchanging Zakat recipients over a lifetime 
                  (33 solar years ≈ 34 lunar years), the rate is adjusted: <strong className="text-foreground">2.5% × (365.25 ÷ 354.37) ≈ 2.577%</strong>
                </p>
              </div>
            </section>

            {/* Stocks Section */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">Stocks & Investments</h2>
              </div>
              <div className="prose prose-muted-foreground max-w-none">
                <p className="text-muted-foreground mb-4">
                  The treatment of stocks depends on your intent:
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong className="text-foreground">Active Holdings (Trading):</strong> If you buy stocks to sell short-term 
                  for capital gain, the stock is commercial merchandise. Zakat is due on 100% of market value.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong className="text-foreground">Passive Holdings (Long-Term):</strong> If shares are held for appreciation 
                  and dividends, Zakat shifts to the company's Zakatable assets (cash, receivables, inventory).
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">The 30% Rule (AAOIFI Standard 35):</strong> Research shows the liquid/zakatable 
                  assets of Shariah-compliant companies average ~30% of market cap. This proxy gives an effective rate 
                  of 0.75% of market value.
                </p>
              </div>
            </section>

            {/* Retirement Accounts Section */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">Retirement Accounts (401k, IRA)</h2>
              </div>
              <div className="prose prose-muted-foreground max-w-none">
                <p className="text-muted-foreground mb-4">
                  Retirement accounts present the most complex Zakat challenge due to access restrictions and deferred taxes. 
                  The debate centers on <em>Milk Tam</em>—complete possession.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong className="text-foreground">The AMJA/Bradford Position:</strong> The funds ARE accessible—the penalty 
                  is a deterrent, not a prohibition. However, it's unjust to pay Zakat on money that belongs to the 
                  government (taxes) or will be lost to penalties.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong className="text-foreground">The Accessible Balance Method:</strong>
                </p>
                <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
                  <li>Start with Vested Balance (unvested employer match is exempt)</li>
                  <li>Subtract 10% early withdrawal penalty (if under 59½)</li>
                  <li>Subtract estimated federal + state taxes</li>
                  <li>Result = Net Zakatable Value</li>
                </ol>
              </div>
            </section>

            {/* Crypto Section */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Coins className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">Cryptocurrency</h2>
              </div>
              <div className="prose prose-muted-foreground max-w-none">
                <p className="text-muted-foreground mb-4">
                  Cryptocurrency spans the line between currency (<em>thaman</em>) and speculative trade goods 
                  (<em>urud al-tijarah</em>). The distinction is driven by usage and intent.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong className="text-foreground">Crypto as Currency:</strong> Major cryptocurrencies (BTC, ETH) 
                  accepted as mediums of exchange are treated as currency. Zakat due on 100% of market value at 2.5%.
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Staking & DeFi:</strong> Staking principal is fully Zakatable. 
                  Only vested/accessible rewards are Zakatable; locked rewards are exempt until possession.
                </p>
              </div>
            </section>

            {/* Real Estate Section */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Building className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">Real Estate</h2>
              </div>
              <div className="prose prose-muted-foreground max-w-none">
                <p className="text-muted-foreground mb-4">
                  Real estate treatment depends entirely on intent:
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong className="text-foreground">Primary Residence:</strong> Completely exempt. A home used for 
                  shelter is <em>qunya</em> (personal use).
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong className="text-foreground">Investment Property (Rental):</strong> The property value itself 
                  is NOT Zakatable (it's a productive asset). Net rental income remaining in your bank at year-end IS Zakatable.
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Investment Property (Flipping):</strong> If purchased with express 
                  intent to sell for profit, the full market value is Zakatable annually.
                </p>
              </div>
            </section>

            {/* References Section */}
            <section className="border-t border-border pt-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">Primary References</h2>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Sheikh Joe Bradford</strong> — "The Jurisprudence of Wealth: 
                  A Comprehensive Treatise on Zakat Calculation for the Contemporary American Muslim"
                </li>
                <li>
                  <strong className="text-foreground">AMJA</strong> — Assembly of Muslim Jurists of America Resolutions
                </li>
                <li>
                  <strong className="text-foreground">AAOIFI</strong> — Accounting and Auditing Organization for 
                  Islamic Financial Institutions, Standard 35
                </li>
              </ul>
            </section>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-border text-center">
            <Button onClick={() => navigate("/")} className="gap-2">
              Start Calculating
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Button>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Methodology;
