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

import { useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { Madhab } from "@/lib/zakatCalculations";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { content } from "@/content";
const { methodology: methodologyContent } = content;
import { ArticleLayout } from "@/components/layout/ArticleLayout";
import { Text, Heading } from "@/components/ui/typography";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MethodologyExplorer } from "@/components/zakat/MethodologyExplorer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Database } from "@phosphor-icons/react";
import { HistoricalNisabLookup } from "@/components/tools/HistoricalNisabLookup";

const tocItems = [
  { id: "explorer", number: 1, label: "Interactive Guide" },
  { id: "principles", number: 2, label: "Core Legal Principles" },
  { id: "nisab", number: 3, label: "The Niṣāb Threshold" },
  { id: "hawl", number: 4, label: "The Ḥawl (Zakat Year)" },
  { id: "liquid", number: 5, label: "Liquid Assets & Cash" },
  { id: "retirement", number: 6, label: "Retirement Accounts" },
  { id: "investments", number: 7, label: "Stocks & Investments" },
  { id: "crypto", number: 8, label: "Cryptocurrency" },
  { id: "realestate", number: 9, label: "Real Estate" },
  { id: "business", number: 10, label: "Business Assets" },
  { id: "debts", number: 11, label: "Debts & Liabilities" },
  { id: "trusts", number: 12, label: "Trusts" },
  { id: "references", number: 13, label: "References" },
];

import { ZAKAT_PRESETS } from "@/lib/config/presets";

const Methodology = () => {
  const [searchParams] = useSearchParams();
  const { hash } = useLocation();

  // Dynamic Content Generation
  const getContent = () => {
    const baseContent = { ...methodologyContent };
    const balancedConfig = ZAKAT_PRESETS['bradford'];

    // Update Debt Ruling "ZakatFlow Approach"
    const liabMethod = balancedConfig.liabilities.method;
    const periodText = (liabMethod === '12_month_rule' || liabMethod === 'full_deduction') ? '12-month' : 'current month';

    `ZakatFlow applies the Maliki/Bradford standard (${periodText} deduction) for the Sheikh Joe Bradford mode. The Shafi'i mode applies no deduction at all.`;

    // Update Liabilities Section "Owed By You"
    baseContent.debts.liabilities.intro = `Deduct immediate debts (due within ${periodText}).`;
    baseContent.debts.liabilities.zakatFlowView =
      `ZakatFlow follows the Maliki/Bradford view: only immediate obligations (due within ${periodText}) reduce your Zakatable wealth.`;

    const isAnnualPeriod = liabMethod === '12_month_rule' || liabMethod === 'full_deduction';
    if (isAnnualPeriod) {
      baseContent.debts.deductible.list = ["Unpaid bills", "Upcoming year's mortgage payments", "Credit card balances"];
    } else {
      baseContent.debts.deductible.list = ["Unpaid bills", "Current month's mortgage payment", "Credit card balances"];
    }

    return baseContent;
  };

  const content = getContent();

  const methodologyParam = searchParams.get('methodology');
  const validMadhabs = ['bradford', 'hanafi', 'shafii', 'maliki', 'hanbali'];
  const initialMode = (methodologyParam && validMadhabs.includes(methodologyParam))
    ? (methodologyParam as Madhab)
    : 'bradford';

  // Handle scroll to hash with a small delay to allow for rendering
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, [hash]);

  const headerContent = (
    <div>
      <Text variant="lead">{content.header.intro}</Text>

      <div className="flex gap-4 pt-4">
        <Link to="/methodology/zmcs">
          <Button variant="outline" className="gap-2">
            <Database className="w-4 h-4" />
            View ZMCS Specification
          </Button>
        </Link>
      </div>

      <Card className="bg-card border-border shadow-sm mt-4">
        <CardContent className="p-4 pt-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Primary Influences:</strong> {content.header.primaryInfluences}
          </p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ArticleLayout
      title={content.header.title}
      description="Comprehensive scholarly methodology and Islamic jurisprudence behind ZakatFlow's Zakat calculations."
      urlPath="/methodology"
      tocItems={tocItems}
      headerContent={headerContent}
    >
      {/* Interactive Explorer Section */}
      <section id="explorer" className="scroll-mt-24 mb-16">
        <div className="mb-8">
          <Heading level={2} className="mt-0">Explore by Methodology</Heading>
          <Text>
            Select a school of thought to see exactly how rules for Jewelry, Retirement, and Investments change.
            Watch the "Ahmed Family" demo on the right to see the financial impact.
          </Text>
        </div>
        <MethodologyExplorer initialMode={initialMode} key={initialMode} />
      </section>

      {/* Principles */}
      <section id="principles" className="scroll-mt-24">
        <ScrollReveal>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold z-10">
                  {content.principles.number}
                </div>
                <CardTitle>{content.principles.title}</CardTitle>
              </div>
              <CardDescription>
                <Text className="mt-0">{content.principles.intro}</Text>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <Heading level={3} className="mt-0">{content.principles.conditionsTitle}</Heading>
                <StaggerContainer className="grid gap-4 md:grid-cols-2" staggerDelay={0.08}>
                  {content.principles.conditions.map((condition, idx) => (
                    <StaggerItem key={idx}>
                      <div className="p-4 rounded-lg bg-muted/30 border border-border h-full">
                        <h4 className="font-medium text-foreground flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">{condition.number}</span>
                          {condition.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">{condition.description}</p>
                        {condition.example && (
                          <p className="text-xs mt-2 text-primary italic">{condition.example}</p>
                        )}
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>

              {/* Mal Dimar & Intent */}
              <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-border/50">
                <div>
                  <Heading level={4} className="mt-0">{content.principles.malDimar.title}</Heading>
                  <Text className="text-sm mb-2">{content.principles.malDimar.description}</Text>
                  <p className="text-xs text-muted-foreground bg-muted p-2 rounded">{content.principles.malDimar.modern}</p>
                </div>
                <div>
                  <Heading level={4} className="mt-0">{content.principles.intent.title}</Heading>
                  <Text className="text-sm mb-2">{content.principles.intent.description}</Text>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-muted-foreground">
                    {content.principles.intent.list.map((item, i) => (
                      <li key={i}><strong className="text-foreground">{item.label}:</strong> {item.text}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </section>

      {/* Nisab */}
      <section id="nisab" className="scroll-mt-24">
        <ScrollReveal>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <CardTitle>{content.nisab.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Text>{content.nisab.intro}</Text>

              <div className="my-6">
                <HistoricalNisabLookup />
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="history">
                  <AccordionTrigger>Historical Foundation & Prophetic Tradition</AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 bg-muted/20 rounded-lg">
                      <Text className="text-sm mb-3">{content.nisab.historical.intro}</Text>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground mb-3">
                        {content.nisab.historical.items.map((item, i) => (
                          <li key={i}><strong className="text-foreground">{item.label}:</strong> {item.text}</li>
                        ))}
                      </ul>
                      <p className="text-xs italic text-muted-foreground">{content.nisab.historical.note}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-muted/30 border border-border">
                  <Heading level={4} className="mt-0 mb-3">{content.nisab.divergence.title}</Heading>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {content.nisab.divergence.items.map((item, idx) => (
                      <li key={idx}>
                        <strong className="text-foreground block mb-1">{item.label}</strong> {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Heading level={4} className="mt-0 mb-3">{content.nisab.consensus.title}</Heading>
                  <Text className="text-sm mb-2">{content.nisab.consensus.text}</Text>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground mb-3">
                    {content.nisab.consensus.principles.map((item, idx) => (
                      <li key={idx}><strong className="text-foreground">{item.label}:</strong> {item.text}</li>
                    ))}
                  </ul>
                  <p className="text-xs font-medium text-primary mt-2">{content.nisab.consensus.note}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </section>

      {/* Hawl */}
      <section id="hawl" className="scroll-mt-24">
        <ScrollReveal>
          <Card>
            <CardHeader>
              <CardTitle>{content.hawl.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Text>{content.hawl.intro}</Text>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/20 rounded border border-border/50">
                  <p className="font-semibold mb-2">{content.hawl.lunarSolar.lunar.title}</p>
                  <ul className="list-disc pl-4 text-sm text-muted-foreground">
                    {content.hawl.lunarSolar.lunar.points.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
                <div className="p-4 bg-muted/20 rounded border border-border/50">
                  <p className="font-semibold mb-2">{content.hawl.lunarSolar.solar.title}</p>
                  <ul className="list-disc pl-4 text-sm text-muted-foreground">
                    {content.hawl.lunarSolar.solar.points.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <Heading level={4} className="mt-0 text-primary">{content.hawl.rateAdjustment.title}</Heading>
                <Text className="text-sm mb-2">{content.hawl.rateAdjustment.text}</Text>
                <code className="px-2 py-1 rounded bg-background border border-primary/20 text-foreground text-sm font-mono block w-fit">{content.hawl.rateAdjustment.formula}</code>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </section>

      {/* Liquid */}
      <section id="liquid" className="scroll-mt-24">
        <ScrollReveal>
          <Card>
            <CardHeader>
              <CardTitle>{content.liquid.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Text>{content.liquid.intro}</Text>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <Heading level={3} className="mt-0">{content.liquid.assets.title}</Heading>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    {content.liquid.assets.list.map((item, i) => (
                      <li key={i}><strong className="text-foreground">{item.label}:</strong> {item.text}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-5 rounded-xl bg-destructive/5 border border-destructive/20 h-fit">
                  <Heading level={4} className="mt-0 text-destructive mb-3">{content.liquid.interest.title}</Heading>
                  <p className="text-sm text-muted-foreground mb-3">{content.liquid.interest.text1}</p>
                  <p className="text-xs font-semibold text-destructive">{content.liquid.interest.text2}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </section>

      {/* Retirement */}
      <section id="retirement" className="scroll-mt-24">
        <ScrollReveal>
          <Card>
            <CardHeader>
              <CardTitle>{content.retirement.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Text>{content.retirement.intro}</Text>
              <Text className="text-sm text-muted-foreground">{content.retirement.approachesIntro}</Text>

              <div className="space-y-6">
                {content.retirement.approaches.map((approach, i) => (
                  <div key={i} className="p-5 rounded-xl bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <Heading level={4} className="mt-0">{approach.title}</Heading>
                      {approach.tag && <Badge variant="secondary" className="text-xs">{approach.tag}</Badge>}
                    </div>
                    <Text className="text-sm mb-3">{approach.description}</Text>
                    <p className="text-xs text-muted-foreground mb-3 italic">{approach.basis}</p>
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-xs font-semibold mb-2">Calculation Steps:</p>
                        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
                          {approach.steps.map((step, j) => <li key={j}>{step}</li>)}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold mb-2">Principles Applied:</p>
                        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
                          {approach.principles.map((p, j) => <li key={j}>{p}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-border/50">
                <div className="p-4 bg-muted/20 rounded border border-border/50">
                  <p className="font-semibold text-sm mb-1">{content.retirement.roth.title}</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {content.retirement.roth.points.map((p, i) => (
                      <li key={i}><strong className="text-foreground">{p.label}:</strong> {p.text}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-muted/20 rounded border border-border/50">
                  <p className="font-semibold text-sm mb-1">{content.retirement.hsa.title}</p>
                  <p className="text-xs text-muted-foreground">{content.retirement.hsa.text}</p>
                </div>
                <div className="p-4 bg-destructive/5 rounded border border-destructive/20">
                  <p className="font-semibold text-sm mb-1 text-destructive">{content.retirement.loans.title}</p>
                  <p className="text-xs text-muted-foreground">{content.retirement.loans.text}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </section>

      {/* Investments */}
      <section id="investments" className="scroll-mt-24">
        <ScrollReveal>
          <Card>
            <CardHeader>
              <CardTitle>{content.stocks.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Text>{content.stocks.intro}</Text>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-muted/30 border border-border">
                  <Heading level={4} className="mt-0">{content.stocks.mudir.title}</Heading>
                  <Text className="text-sm">{content.stocks.mudir.text}</Text>
                  <p className="text-xs font-medium text-primary mt-2">{content.stocks.mudir.calculation}</p>
                </div>
                <div className="p-5 rounded-xl bg-muted/30 border border-border">
                  <Heading level={4} className="mt-0">{content.stocks.muhtakir.title}</Heading>
                  <Text className="text-sm">{content.stocks.muhtakir.text}</Text>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <Heading level={4} className="mt-0 text-primary">{content.stocks.rule30.title}</Heading>
                <p className="text-sm text-muted-foreground mb-2">{content.stocks.rule30.description}</p>
                <code className="px-2 py-1 rounded bg-background border border-primary/20 text-foreground text-sm font-mono block w-fit mb-2">{content.stocks.rule30.formula}</code>
                <p className="text-xs font-semibold text-primary">{content.stocks.rule30.effectiveRate}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-border/50">
                <div className="p-4 bg-muted/20 rounded border border-border/50">
                  <p className="font-semibold text-sm mb-2">{content.stocks.exclusions.title}</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {content.stocks.exclusions.list.map((item, i) => (
                      <li key={i}><strong className="text-foreground">{item.label}:</strong> {item.text}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-muted/20 rounded border border-border/50">
                  <p className="font-semibold text-sm mb-1">{content.stocks.purification.title}</p>
                  <p className="text-xs text-muted-foreground">{content.stocks.purification.text}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </section>

      {/* Crypto */}
      <section id="crypto" className="scroll-mt-24">
        <ScrollReveal>
          <Card>
            <CardHeader>
              <CardTitle>{content.crypto.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Text>{content.crypto.intro}</Text>

              <div className="p-4 rounded-lg bg-muted/40 border border-border mb-6">
                <p className="text-sm font-medium text-foreground mb-1">{content.crypto.principle.title}</p>
                <p className="text-sm text-muted-foreground">{content.crypto.principle.text}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Heading level={4} className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-3">{content.crypto.classification.title}</Heading>
                  <ul className="space-y-2 text-sm">
                    {content.crypto.classification.types.map((item: { label: string; text: string }, i: number) => (
                      <li key={i} className="text-muted-foreground"><strong className="text-foreground">{item.label}:</strong> {item.text}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Heading level={4} className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-3">{content.crypto.staking.title}</Heading>
                  <ul className="space-y-2 text-sm">
                    {content.crypto.staking.types.map((item: { label: string; text: string }, i: number) => (
                      <li key={i} className="text-muted-foreground"><strong className="text-foreground">{item.label}:</strong> {item.text}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Heading level={4} className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-3">{content.crypto.nfts.title}</Heading>
                  <ul className="space-y-2 text-sm">
                    {content.crypto.nfts.types.map((item: { label: string; text: string }, i: number) => (
                      <li key={i} className="text-muted-foreground"><strong className="text-foreground">{item.label}:</strong> {item.text}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </section>

      {/* Real Estate */}
      <section id="realestate" className="scroll-mt-24">
        <ScrollReveal>
          <Card>
            <CardHeader>
              <CardTitle>{content.realEstate.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Text>{content.realEstate.intro}</Text>
              <div className="grid gap-4 md:grid-cols-3">
                {content.realEstate.types.map((type, i) => (
                  <div key={i} className="p-5 rounded-xl bg-muted/30 border border-border flex flex-col">
                    <Heading level={4} className="mt-0 text-base mb-2">{type.title}</Heading>
                    <p className="font-medium text-foreground text-sm">{type.ruling}</p>
                    <p className="text-sm text-muted-foreground mt-1">{type.text}</p>
                    {/* Removed invalid text2/desc2 properties */}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </section>

      {/* Business */}
      <section id="business" className="scroll-mt-24">
        <ScrollReveal>
          <Card>
            <CardHeader>
              <CardTitle>{content.business.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Text>{content.business.intro}</Text>
              <div className="grid md:grid-cols-2 gap-8 mt-6">
                <div>
                  <Heading level={4} className="mt-0 text-success mb-2">Include (Zakatable)</Heading>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {content.business.zakatable.list.map((item, i) => (
                      <li key={i}><strong className="text-foreground">{item.label}:</strong> {item.text}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Heading level={4} className="mt-0 text-muted-foreground mb-2">Exclude (Not Zakatable)</Heading>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {content.business.notZakatable.list.map((item, i) => (
                      <li key={i}><strong className="text-foreground">{item.label}:</strong> {item.text}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-6 p-4 bg-muted/30 rounded border border-border">
                <p className="text-sm"><strong>Valuation:</strong> {content.business.valuation.text}</p>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </section>

      {/* Debts */}
      <section id="debts" className="scroll-mt-24">
        <ScrollReveal>
          <Card>
            <CardHeader>
              <CardTitle>{content.debts.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <Heading level={4}>Receivables (Owed to You)</Heading>
                  <Text className="text-sm mb-3">{content.debts.receivables.intro}</Text>
                  <div className="space-y-3 mt-2">
                    <div className="p-3 border border-success/20 bg-success-container rounded">
                      <p className="text-sm font-medium text-on-success-container">{content.debts.receivables.good.title}</p>
                      <p className="text-xs text-muted-foreground">{content.debts.receivables.good.text}</p>
                    </div>
                    <div className="p-3 border border-border bg-muted/20 rounded">
                      <p className="text-sm font-medium">{content.debts.receivables.bad.title}</p>
                      <p className="text-xs text-muted-foreground">{content.debts.receivables.bad.text}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <Heading level={4}>Liabilities (Owed by You)</Heading>
                  <p className="text-sm text-muted-foreground mt-2">{content.debts.liabilities.intro}</p>

                  <div className="mt-4 p-3 bg-tertiary/5 rounded border border-tertiary/10 mb-4">
                    <p className="text-xs">
                      <strong className="text-primary">ZakatFlow Approach:</strong> {content.debts.liabilities.zakatFlowView}
                    </p>
                  </div>

                  <Accordion type="single" collapsible>
                    <AccordionItem value="structure">
                      <AccordionTrigger className="text-sm">View Deductible vs Non-Deductible</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <p className="text-xs font-bold text-success mb-1">Deductible</p>
                            <ul className="text-xs list-disc pl-4 text-muted-foreground">
                              {content.debts.deductible.list.map((l, i) => <li key={i}>{l}</li>)}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-destructive mb-1">Not Deductible</p>
                            <ul className="text-xs list-disc pl-4 text-muted-foreground">
                              {content.debts.notDeductible.list.map((l, i) => <li key={i}>{l}</li>)}
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </section>

      {/* Trusts */}
      <section id="trusts" className="scroll-mt-24">
        <ScrollReveal>
          <Card>
            <CardHeader>
              <CardTitle>{content.trusts.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Text>{content.trusts.intro}</Text>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 border border-border rounded">
                  <p className="font-bold text-sm mb-1">{content.trusts.revocable.title}</p>
                  <Badge variant="outline" className="mb-2 border-success text-success">{content.trusts.revocable.ruling}</Badge>
                  <p className="text-xs text-muted-foreground">{content.trusts.revocable.text}</p>
                </div>
                <div className="p-4 border border-border rounded">
                  <p className="font-bold text-sm mb-1">{content.trusts.irrevocable.title}</p>
                  <ul className="text-xs list-disc pl-4 text-muted-foreground mt-2 space-y-1">
                    {content.trusts.irrevocable.list.map((l, i) => (
                      <li key={i}><span className="font-medium text-foreground">{l.label}:</span> {l.text}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 border border-border rounded">
                  <p className="font-bold text-sm mb-1">{content.trusts.custodial.title}</p>
                  <p className="text-xs text-muted-foreground mt-2">{content.trusts.custodial.text}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </section>

      {/* References */}
      <section id="references" className="scroll-mt-24">
        <ScrollReveal>
          <Card>
            <CardHeader>
              <CardTitle>{content.references.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <Heading level={4} className="mt-0">{content.references.primary.title}</Heading>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {content.references.primary.list.map((item, i) => (
                      <li key={i}>
                        <strong className="text-foreground">{item.name}</strong>
                        <span className="mx-1">-</span>
                        {item.text}
                        {item.link && <a href={item.link.url} target="_blank" rel="noopener" className="ml-1 text-primary hover:underline font-medium">View</a>}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Heading level={4} className="mt-0">{content.references.classical.title}</Heading>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                    {content.references.classical.list.map((item, i) => (
                      <li key={i}><strong className="text-foreground">{item.name}</strong> - {item.text}</li>
                    ))}
                  </ul>

                  <Heading level={4} className="mt-0">{content.references.concepts.title}</Heading>
                  <div className="flex flex-wrap gap-2">
                    {content.references.concepts.list.map((c, i) => (
                      <Badge key={i} variant="secondary" className="text-xs font-normal" title={c.text}>{c.name}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-6 italic border-t pt-4">{content.references.disclaimer.text}</p>
            </CardContent>
          </Card>
        </ScrollReveal>
      </section>

    </ArticleLayout>
  );
};

export default Methodology;
