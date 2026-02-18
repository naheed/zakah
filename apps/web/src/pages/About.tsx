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

import { Link } from "react-router-dom";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { ArticleLayout } from "@/components/layout/ArticleLayout";

export default function About() {
  const headerContent = (
    <StaggerContainer className="text-center" staggerDelay={0.15}>
      {/* Opening Quote Mark */}
      <StaggerItem variant="fade">
        <span className="text-6xl md:text-7xl font-serif text-tertiary/40 leading-none select-none" aria-hidden="true">"</span>
      </StaggerItem>

      {/* Main Quote - First Part */}
      <StaggerItem variant="slide-up">
        <p className="text-2xl md:text-3xl lg:text-4xl font-serif text-foreground leading-relaxed -mt-8">
          Islam is beautiful,
          <br />
          and our worship deserves perfection.
        </p>
      </StaggerItem>

      {/* Quote - Second Part */}
      <StaggerItem variant="slide-up">
        <p className="text-xl md:text-2xl lg:text-3xl font-serif text-muted-foreground mt-8 leading-relaxed">
          Built with precision for your Akhirah and mine.
        </p>
      </StaggerItem>

      {/* Decorative Divider */}
      <StaggerItem variant="fade">
        <div className="flex items-center justify-center gap-3 my-10">
          <div className="h-px w-12 bg-border" />
          <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
          <div className="h-px w-12 bg-border" />
        </div>
      </StaggerItem>

      {/* Attribution */}
      <StaggerItem variant="fade">
        <footer className="space-y-1">
          <p className="text-lg text-muted-foreground">Crafted with care in California,</p>
          <p className="text-lg">
            by{" "}
            <a
              href="https://www.vora.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline decoration-primary/50 hover:decoration-primary transition-colors font-medium"
            >
              Naheed
            </a>
          </p>
        </footer>
      </StaggerItem>

      {/* Closing Quote Mark */}
      <StaggerItem variant="fade">
        <span className="text-6xl md:text-7xl font-serif text-tertiary/40 leading-none select-none mt-4 inline-block" aria-hidden="true">
          "
        </span>
      </StaggerItem>
    </StaggerContainer>
  );

  return (
    <ArticleLayout
      title="About"
      description="Islam is beautiful, and our worship deserves perfection. Learn about ZakatFlow's mission and values."
      urlPath="/about"
      headerContent={headerContent}
      showBackButton={true}
    >
      {/* FAQ Section */}
      <StaggerContainer className="w-full" staggerDelay={0.1}>
        <StaggerItem variant="fade">
          <h2 className="text-2xl font-serif font-medium mb-8 text-center">Frequently Asked Questions</h2>
        </StaggerItem>

        <StaggerItem variant="slide-up">
          <div className="bg-card border rounded-xl overflow-hidden divide-y">
            {/* Q1 — Cost / Trust */}
            <details className="group p-6 cursor-pointer">
              <summary className="flex items-center justify-between font-medium text-lg list-none outline-none focus-visible:ring-2 ring-primary/20 rounded">
                Is ZakatFlow free?
                <span className="transition-transform group-open:rotate-180 text-muted-foreground" aria-hidden="true">↓</span>
              </summary>
              <div className="mt-4 text-muted-foreground leading-relaxed space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <p>
                  Yes — completely free, with no ads, no premium tier, and no data monetization. It always will be.
                </p>
                <p>
                  The entire codebase is open-sourced under the{" "}
                  <a href="https://www.gnu.org/licenses/agpl-3.0" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">AGPL-3.0</a>{" "}
                  license. You can audit every line of code at{" "}
                  <a href="https://www.github.com/naheed/zakah" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">github.com/naheed/zakah</a>.
                  Naheed's sole intention is to spread good.
                </p>
              </div>
            </details>

            {/* Q2 — Accuracy / Trust */}
            <details className="group p-6 cursor-pointer">
              <summary className="flex items-center justify-between font-medium text-lg list-none outline-none focus-visible:ring-2 ring-primary/20 rounded">
                How do I know the calculations are accurate?
                <span className="transition-transform group-open:rotate-180 text-muted-foreground" aria-hidden="true">↓</span>
              </summary>
              <div className="mt-4 text-muted-foreground leading-relaxed space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <p>
                  Every calculation rule is documented, sourced, and transparent. ZakatFlow supports eight scholarly methodologies — Hanafi, Shafi'i, Maliki, Hanbali, Bradford, AMJA, Tahir Anwar, and Al-Qaradawi — so you can choose the one that aligns with your conviction.
                </p>
                <p>
                  We maintain a comprehensive{" "}
                  <Link to="/methodology" className="text-primary hover:underline font-medium">Methodology Page</Link>{" "}
                  that documents the scholarly sources behind every rule, including modern financial instruments like 401(k)s, crypto, stocks, and REITs.
                </p>
                <p>
                  The calculation engine itself is open source and built on the{" "}
                  <a href="https://www.github.com/naheed/zakah" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">ZMCS standard</a>{" "}
                  — a schema-driven specification that anyone can audit and verify.
                </p>
              </div>
            </details>

            {/* Q3 — Privacy */}
            <details className="group p-6 cursor-pointer">
              <summary className="flex items-center justify-between font-medium text-lg list-none outline-none focus-visible:ring-2 ring-primary/20 rounded">
                Is my financial data safe?
                <span className="transition-transform group-open:rotate-180 text-muted-foreground" aria-hidden="true">↓</span>
              </summary>
              <div className="mt-4 text-muted-foreground leading-relaxed space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <p>
                  Your financial privacy is a trust we take seriously. ZakatFlow uses a local-first architecture — calculations happen in your browser, and sensitive data is encrypted before it ever leaves your device.
                </p>
                <p>
                  If you connect a bank via Plaid, only balances are accessed — never your login credentials. Plaid connections use a user-controlled encryption key, meaning even ZakatFlow's servers cannot read your data without your passphrase.
                </p>
                <p>
                  Because the code is open source, you do not have to take our word for it. You can verify every claim yourself.
                </p>
              </div>
            </details>

            {/* Q4 — Origin */}
            <details className="group p-6 cursor-pointer">
              <summary className="flex items-center justify-between font-medium text-lg list-none outline-none focus-visible:ring-2 ring-primary/20 rounded">
                Who built this, and why?
                <span className="transition-transform group-open:rotate-180 text-muted-foreground" aria-hidden="true">↓</span>
              </summary>
              <div className="mt-4 text-muted-foreground leading-relaxed space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <p>
                  ZakatFlow was created by <span className="font-medium text-foreground">Naheed</span>, who serves on the Board of Trustees at West Valley Muslim Association in Los Gatos, California, where he previously served as Treasurer for four years. Outside of community work, Naheed is a Product Lead at Google.
                </p>
                <p>
                  He built it because his own portfolio had become too complex for basic spreadsheets — 401(k)s, RSUs, crypto, and rental income all demanded different scholarly treatments. After consulting published jurisprudence and sharing an early version with friends, their response was clear: this problem is not unique.
                </p>
                <p>
                  Many Muslims with modern portfolios struggle to calculate Zakat with confidence. So here it is — built with precision, for the community, for free.
                </p>
              </div>
            </details>

            {/* Q5 — Contribute */}
            <details className="group p-6 cursor-pointer">
              <summary className="flex items-center justify-between font-medium text-lg list-none outline-none focus-visible:ring-2 ring-primary/20 rounded">
                How can I help?
                <span className="transition-transform group-open:rotate-180 text-muted-foreground" aria-hidden="true">↓</span>
              </summary>
              <div className="mt-4 text-muted-foreground leading-relaxed space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <p>
                  Honestly? The simplest way is to <span className="font-medium text-foreground">use it and share it</span>. Tell a friend, mention it at your masjid, or forward it to someone who struggles with Zakat calculations every year. That alone makes a difference.
                </p>
                <p>
                  If you find something that could be better — a confusing label, a missing asset type, a calculation that does not feel right — please{" "}
                  <a href="https://github.com/naheed/zakah/issues" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">open an issue on GitHub</a>.
                  No coding required. A clear description is enough.
                </p>
                <p>
                  If you are a developer, there are three tracks to contribute:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                  <li><span className="font-medium text-foreground">Web UI</span> — improve the interface, accessibility, or performance</li>
                  <li><span className="font-medium text-foreground">AI Agents (MCP)</span> — build tools that let ChatGPT or Claude talk to the Zakat engine</li>
                  <li><span className="font-medium text-foreground">Methodology Presets (ZMCS)</span> — define scholarly rulesets as auditable, schema-driven configurations</li>
                </ul>
                <p>
                  And if you are a <span className="font-medium text-foreground">scholar or student of knowledge</span>, we especially need your help verifying and auditing the methodology presets. Your expertise ensures that what we build actually serves the Ummah with integrity.
                </p>
                <p>
                  Start with the{" "}
                  <a href="https://github.com/naheed/zakah/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Contributing Guide</a>,
                  or reach out directly to{" "}
                  <a href="mailto:naheed@vora.dev" className="text-primary hover:underline font-medium">naheed@vora.dev</a>.
                </p>
              </div>
            </details>
          </div>
        </StaggerItem>
      </StaggerContainer>

      {/* What's New Section */}
      <StaggerContainer className="w-full" staggerDelay={0.1}>
        <StaggerItem variant="fade">
          <h2 className="text-2xl font-serif font-medium mb-8 text-center">What's New</h2>
        </StaggerItem>

        <StaggerItem variant="slide-up">
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border before:to-transparent text-left">

            {/* Item - Open Source Community v0.32.0 */}
            <div className="relative flex items-start group">
              <div className="absolute left-0 ml-5 -translate-x-1/2 mt-1.5 w-3 h-3 bg-primary rounded-full border-2 border-background ring-4 ring-background" />
              <div className="ml-12">
                <span className="text-xs font-mono text-primary uppercase tracking-wider mb-1 block">Feb 2026</span>
                <h3 className="text-lg font-medium">Open Source Community Launch</h3>
                <p className="text-muted-foreground mt-1 text-sm">Repository is now public with comprehensive contributor guides. Three ways to contribute: Web UI, AI Agents (MCP), and scholarly methodology presets (ZMCS). Actively seeking scholars to audit and verify presets.</p>
              </div>
            </div>

            {/* Item - AI Companion v0.31.0 */}
            <div className="relative flex items-start group">
              <div className="absolute left-0 ml-5 -translate-x-1/2 mt-1.5 w-3 h-3 bg-primary rounded-full border-2 border-background ring-4 ring-background" />
              <div className="ml-12">
                <span className="text-xs font-mono text-primary uppercase tracking-wider mb-1 block">Feb 2026</span>
                <h3 className="text-lg font-medium">AI Companion (MCP)</h3>
                <p className="text-muted-foreground mt-1 text-sm">Connect ZakatFlow to ChatGPT or Claude. Ask your AI about Zakat rulings and it calls the real calculation engine for accurate, methodology-aware answers.</p>
              </div>
            </div>

            {/* Item -2 - Real-Time Engine v0.30.0 */}
            <div className="relative flex items-start group">
              <div className="absolute left-0 ml-5 -translate-x-1/2 mt-1.5 w-3 h-3 bg-primary rounded-full border-2 border-background ring-4 ring-background" />
              <div className="ml-12">
                <span className="text-xs font-mono text-primary uppercase tracking-wider mb-1 block">Feb 2026</span>
                <h3 className="text-lg font-medium">Real-Time Methodology Engine</h3>
                <p className="text-muted-foreground mt-1 text-sm">Interactive "Theory vs Practice" comparisons. See exactly how different rules impact the same portfolio with real-time calculations.</p>
              </div>
            </div>

            {/* Item -1 - Visual Polish v0.29.0 */}
            <div className="relative flex items-start group">
              <div className="absolute left-0 ml-5 -translate-x-1/2 mt-1.5 w-3 h-3 bg-primary rounded-full border-2 border-background ring-4 ring-background" />
              <div className="ml-12">
                <span className="text-xs font-mono text-primary uppercase tracking-wider mb-1 block">Feb 2026</span>
                <h3 className="text-lg font-medium">Visual & UX Polish</h3>
                <p className="text-muted-foreground mt-1 text-sm">A redesigned "Financial Statement" hero card, consistent scroll cues, and a unified icon system (Phosphor) for a cleaner, professional experience.</p>
              </div>
            </div>

            {/* Item 0 - Security & Classification v0.28.0 */}
            <div className="relative flex items-start group">
              <div className="absolute left-0 ml-5 -translate-x-1/2 mt-1.5 w-3 h-3 bg-muted rounded-full border-2 border-background" />
              <div className="ml-12">
                <span className="text-xs font-mono text-primary uppercase tracking-wider mb-1 block">Feb 2026</span>
                <h3 className="text-lg font-medium">Security & Classification Overhaul</h3>
                <p className="text-muted-foreground mt-1 text-sm">Two-tier encryption, Plaid user-key encryption, improved upload and bank account classification, and AGPL-3.0 open source licensing.</p>
              </div>
            </div>

            {/* Item 0.5 - ZMCS */}
            <div className="relative flex items-start group">
              <div className="absolute left-0 ml-5 -translate-x-1/2 mt-1.5 w-3 h-3 bg-primary rounded-full border-2 border-background ring-4 ring-background" />
              <div className="ml-12">
                <span className="text-xs font-mono text-primary uppercase tracking-wider mb-1 block">Feb 2026</span>
                <h3 className="text-lg font-medium">Methodology Engine (ZMCS)</h3>
                <p className="text-muted-foreground mt-1 text-sm">A new open standard for Zakat calculation. Live Nisab fetching, schema-driven rules, and total transparency.</p>
              </div>
            </div>

            {/* Item 1 */}
            <div className="relative flex items-start group">
              <div className="absolute left-0 ml-5 -translate-x-1/2 mt-1.5 w-3 h-3 bg-muted rounded-full border-2 border-background" />
              <div className="ml-12">
                <span className="text-xs font-mono text-primary uppercase tracking-wider mb-1 block">Feb 2026</span>
                <h3 className="text-lg font-medium">Extended Asset Support</h3>
                <p className="text-muted-foreground mt-1 text-sm">Service businesses, land banking, and REITs now included with guidance specific to each asset type.</p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="relative flex items-start group">
              <div className="absolute left-0 ml-5 -translate-x-1/2 mt-1.5 w-3 h-3 bg-muted rounded-full border-2 border-background" />
              <div className="ml-12">
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Jan 2026</span>
                <h3 className="text-lg font-medium">Interactive Demo & Bank Sync</h3>
                <p className="text-muted-foreground mt-1 text-sm">See how ZakatFlow handles complex portfolios. Connect banks securely via Plaid.</p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="relative flex items-start group">
              <div className="absolute left-0 ml-5 -translate-x-1/2 mt-1.5 w-3 h-3 bg-muted rounded-full border-2 border-background" />
              <div className="ml-12">
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Jan 2026</span>
                <h3 className="text-lg font-medium">8 Methodologies</h3>
                <p className="text-muted-foreground mt-1 text-sm">Choose from Hanafi, Shafi'i, Maliki, Hanbali, Bradford, AMJA, Tahir Anwar, or Al-Qaradawi.</p>
              </div>
            </div>

            {/* Item 4 */}
            <div className="relative flex items-start group">
              <div className="absolute left-0 ml-5 -translate-x-1/2 mt-1.5 w-3 h-3 bg-muted rounded-full border-2 border-background" />
              <div className="ml-12">
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Jan 2026</span>
                <h3 className="text-lg font-medium">Donation Tracking</h3>
                <p className="text-muted-foreground mt-1 text-sm">Scan receipts and track charitable giving throughout the year.</p>
              </div>
            </div>

            {/* Item 5 */}
            <div className="relative flex items-start group">
              <div className="absolute left-0 ml-5 -translate-x-1/2 mt-1.5 w-3 h-3 bg-muted rounded-full border-2 border-background" />
              <div className="ml-12">
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Dec 2025</span>
                <h3 className="text-lg font-medium">AI Document Extraction</h3>
                <p className="text-muted-foreground mt-1 text-sm">Upload statements. We extract the numbers automatically.</p>
              </div>
            </div>

          </div>
        </StaggerItem>

        <StaggerItem variant="fade">
          <div className="mt-12 text-center">
            <Link to="/changelog" className="text-sm text-muted-foreground hover:text-foreground transition-colors border-b border-border hover:border-foreground pb-0.5">
              View full developer changelog →
            </Link>
          </div>
        </StaggerItem>
      </StaggerContainer>
    </ArticleLayout>
  );
}
