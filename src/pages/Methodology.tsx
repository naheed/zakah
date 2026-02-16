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

import { useRef, ReactNode, ElementType } from "react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { Madhab } from "@/lib/zakatCalculations";
import { ZAKAT_PRESETS } from "@/lib/config/presets";
import { GLOSSARY } from "@/content/glossary";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { content } from "@/content";
const { methodology: methodologyContent } = content;
import { ArticleLayout } from "@/components/layout/ArticleLayout";
import { Text, Heading } from "@/components/ui/typography";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MethodologyExplorer } from "@/components/zakat/MethodologyExplorer";
import { CaseStudy } from "@/components/zakat/CaseStudy";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AnimatedSectionHeader } from "@/components/ui/animated-section-header";
import {
  Database,
  BookOpen,
  Check,
  ArrowsLeftRight,
  Coins,
  CurrencyCircleDollar,
  Scales,
  WarningCircle,
  Warning
} from "@phosphor-icons/react";
import { HistoricalNisabLookup } from "@/components/tools/HistoricalNisabLookup";

const SectionHeader = ({ icon: Icon, number, title, intro }: any) => (
  <div className="mb-8">
    <AnimatedSectionHeader
      number={number}
      title={title}
      icon={Icon && <Icon size={24} weight="duotone" className="text-primary" />}
    />
    {intro && (
      <Text className="mt-2 text-muted-foreground leading-relaxed max-w-3xl">
        {intro}
      </Text>
    )}
  </div>
);

const Methodology = () => {
  const [searchParams] = useSearchParams();
  const { hash } = useLocation();

  const methodologyParam = searchParams.get('methodology');
  const validMadhabs = Object.keys(ZAKAT_PRESETS);
  const initialMode = (methodologyParam && validMadhabs.includes(methodologyParam))
    ? (methodologyParam as Madhab)
    : 'bradford';

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 500);
    }
  }, [hash]);

  const {
    header,
    principles,
    nisab,
    hawl,
    liquid,
    retirement,
    stocks,
    crypto,
    realEstate,
    metals,
    business,
    debts,
    trusts,
    example
  } = methodologyContent;

  const tocItems = [
    { id: principles.id, label: principles.title },
    { id: nisab.id, label: nisab.title },
    { id: hawl.id, label: hawl.title },
    { id: liquid.id, label: liquid.title },
    { id: metals.id, label: metals.title },
    { id: stocks.id, label: stocks.title },
    { id: retirement.id, label: retirement.title },
    { id: crypto.id, label: crypto.title },
    { id: realEstate.id, label: realEstate.title },
    { id: business.id, label: business.title },
    { id: debts.id, label: debts.title },
    { id: trusts.id, label: trusts.title },
    { id: "explorer", label: "Comparison Tool" },
    { id: "case-study", label: "Example: Ahmed Family" },
    { id: "glossary", label: "Glossary" },
    { id: "references", label: "References" }
  ];

  const headerContent = (
    <div>
      <Text variant="lead">{header.intro}</Text>

      <div className="flex flex-wrap gap-4 pt-4">
        <Button variant="outline" className="gap-2" asChild>
          <Link to="/methodology/zmcs">
            <Database className="w-4 h-4" />
            View ZMCS Specification
          </Link>
        </Button>
        <Badge variant="secondary" className="px-3 py-1 flex items-center gap-2">
          <Check size={14} className="text-primary" />
          Scholarly Based
        </Badge>
        <Badge variant="secondary" className="px-3 py-1 flex items-center gap-2">
          <ArrowsLeftRight size={14} className="text-primary" />
          Multi-Madhab support
        </Badge>
      </div>

      <Card className="bg-card border-border shadow-sm mt-4">
        <CardContent className="p-4 pt-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Primary Influences:</strong> {header.primaryInfluences}
          </p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ArticleLayout
      title={header.title}
      description="Comprehensive scholarly methodology and Islamic jurisprudence behind ZakatFlow's Zakat calculations."
      urlPath="/methodology"
      tocItems={tocItems}
      headerContent={headerContent}
    >
      {/* 1. Core Principles (Theory) */}
      <section id={principles.id}>
        <SectionHeader
          icon={principles.icon}
          number={principles.number}
          title={principles.title}
          intro={principles.intro}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {principles.conditions.map((condition: any, idx: number) => (
            <Card key={idx} className="border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
                    {condition.number}
                  </span>
                  {condition.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground leading-relaxed">
                  {condition.description}
                </p>
                {condition.example && (
                  <p className="mt-3 text-xs italic text-primary/80">
                    {condition.example}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 2. Nisab (Fundamentals) */}
      <section id={nisab.id} className="pt-20">
        <SectionHeader
          icon={nisab.icon}
          number={nisab.number}
          title={nisab.title}
          intro={nisab.intro}
        />
        <div className="space-y-8 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {nisab.historical.items.map((item: any, idx: number) => (
              <Card key={idx} className={cn(
                "overflow-hidden border-border/50",
                idx === 0 ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900" : "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800"
              )}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn(
                      "p-2 rounded-lg",
                      idx === 0 ? "bg-amber-500/20 text-amber-600" : "bg-slate-500/20 text-slate-600"
                    )}>
                      {idx === 0 ? <Coins size={24} weight="duotone" /> : <CurrencyCircleDollar size={24} weight="duotone" />}
                    </div>
                    <CardTitle className="text-xl">{item.label}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed">{item.text}</p>
                  <div className="p-4 rounded-lg bg-background border border-border text-center">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Modern Standard</p>
                    <p className={cn(
                      "text-2xl font-black",
                      idx === 0 ? "text-amber-600" : "text-slate-700 dark:text-slate-300"
                    )}>{idx === 0 ? "85 grams Gold" : "595 grams Silver"}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="p-6 rounded-xl bg-primary/5 border border-primary/10">
            <h4 className="font-bold flex items-center gap-2 mb-2">
              <Scales className="text-primary" />
              Guidelines for Selection
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {nisab.consensus.text}
            </p>
          </div>

          <div className="mt-8">
            <Heading level={4} className="mb-4">Historical Niṣāb Tracking</Heading>
            <HistoricalNisabLookup />
          </div>
        </div>
      </section>

      {/* 3. Hawl (Timing) */}
      <section id={hawl.id} className="pt-20">
        <SectionHeader
          icon={hawl.icon}
          number={hawl.number}
          title={hawl.title}
          intro={hawl.intro}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="space-y-4">
            <Heading level={4} className="text-lg">Calendar Differences</Heading>
            <div className="grid gap-4">
              <Card className="border-border/50">
                <CardHeader className="pb-2"><CardTitle className="text-base">{hawl.lunarSolar.lunar.title}</CardTitle></CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1 list-disc pl-4 text-muted-foreground">
                    {hawl.lunarSolar.lunar.points.map((p: string, i: number) => <li key={i}>{p}</li>)}
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardHeader className="pb-2"><CardTitle className="text-base">{hawl.lunarSolar.solar.title}</CardTitle></CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1 list-disc pl-4 text-muted-foreground">
                    {hawl.lunarSolar.solar.points.map((p: string, i: number) => <li key={i}>{p}</li>)}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
          <Card className="bg-primary/5 border-primary/10">
            <CardHeader>
              <CardTitle className="text-lg">{hawl.rateAdjustment.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Text className="text-sm">{hawl.rateAdjustment.text}</Text>
              <div className="p-4 rounded bg-background border border-border text-center">
                <code className="text-primary font-mono text-sm">{hawl.rateAdjustment.formula}</code>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 4. Liquid Assets */}
      <section id={liquid.id} className="pt-20">
        <SectionHeader icon={liquid.icon} number={liquid.number} title={liquid.title} intro={liquid.intro} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Heading level={4} className="text-base text-muted-foreground uppercase tracking-wider">Common Assets</Heading>
            <div className="grid gap-3">
              {liquid.assets.list.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-3 border rounded-lg bg-card text-sm">
                  <Check size={16} className="text-primary" />
                  <span className="font-medium">{item.label}:</span>
                  <span className="text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Heading level={4} className="text-base text-muted-foreground uppercase tracking-wider">Integrity of Wealth</Heading>
            <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/10 text-sm">
              <p className="font-bold text-destructive mb-1">{liquid.interest.title}</p>
              <p className="text-muted-foreground italic mb-2">"{liquid.interest.text1}"</p>
              <p className="text-xs font-semibold">{liquid.interest.text2}</p>
            </div>
            <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/10">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <WarningCircle size={18} className="text-amber-600" />
                  Special Case: Mal Dimar
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {principles.malDimar.description} {principles.malDimar.modern}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 5. Precious Metals (Gold & Silver) */}
      <section id={metals.id} className="pt-20">
        <SectionHeader icon={metals.icon} number={metals.number} title={metals.title} intro={metals.intro} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-amber-200 bg-amber-50/30">
            <CardHeader><CardTitle className="text-base text-amber-800">{metals.alwaysZakatable.title}</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {metals.alwaysZakatable.list.map((m: any, i: number) => (
                  <li key={i} className="text-sm"><span className="font-bold">{m.label}:</span> <span className="text-muted-foreground">{m.text}</span></li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">{metals.jewelry.title}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{metals.jewelry.intro}</p>
              <div className="grid gap-2">
                {metals.jewelry.views.map((v: any, i: number) => (
                  <div key={i} className="p-3 rounded border text-sm">
                    <span className="font-bold block text-primary mb-1">{v.title}</span>
                    <span className="text-muted-foreground italic">"{v.text}"</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 6. Stocks & Investments */}
      <section id={stocks.id} className="pt-20">
        <SectionHeader icon={stocks.icon} number={stocks.number} title={stocks.title} intro={stocks.intro} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{stocks.mudir.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {stocks.mudir.text}
              <div className="mt-4 p-2 bg-primary/5 border-l-2 border-primary text-foreground font-medium">
                {stocks.mudir.calculation}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{stocks.muhtakir.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {stocks.muhtakir.text}
            </CardContent>
          </Card>
          <Card className="md:col-span-2 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-base text-primary">{stocks.rule30.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">{stocks.rule30.description}</p>
              <div className="flex items-center gap-4">
                <code className="bg-background px-3 py-1 rounded border text-sm">{stocks.rule30.formula}</code>
                <span className="text-xs font-bold text-primary">{stocks.rule30.effectiveRate}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 7. Retirement */}
      <section id={retirement.id} className="pt-20">
        <SectionHeader icon={retirement.icon} number={retirement.number} title={retirement.title} intro={retirement.intro} />
        <div className="space-y-6">
          {retirement.approaches.map((approach: any, i: number) => (
            <Card key={i} className="border-border/50 bg-muted/5">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{approach.title}</CardTitle>
                  {approach.tag && <Badge>{approach.tag}</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p>{approach.description}</p>
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="font-bold mb-2 text-xs uppercase text-muted-foreground">Process</p>
                    <ul className="space-y-1 list-disc pl-4 text-muted-foreground">
                      {approach.steps.map((s: string, j: number) => <li key={j}>{s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="font-bold mb-2 text-xs uppercase text-muted-foreground">Jurisprudence</p>
                    <p className="italic text-muted-foreground">{approach.basis}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 8. Crypto */}
      <section id={crypto.id} className="pt-20">
        <SectionHeader icon={crypto.icon} number={crypto.number} title={crypto.title} intro={crypto.intro} />
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-black text-xs uppercase tracking-widest text-muted-foreground mb-4">{crypto.classification.title}</h4>
                <ul className="space-y-3">
                  {crypto.classification.types.map((t: any, i: number) => (
                    <li key={i} className="text-sm"><span className="font-bold">{t.label}:</span> <span className="text-muted-foreground">{t.text}</span></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-black text-xs uppercase tracking-widest text-muted-foreground mb-4">{crypto.staking.title}</h4>
                <ul className="space-y-3">
                  {crypto.staking.types.map((t: any, i: number) => (
                    <li key={i} className="text-sm"><span className="font-bold">{t.label}:</span> <span className="text-muted-foreground">{t.text}</span></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-black text-xs uppercase tracking-widest text-muted-foreground mb-4">{crypto.nfts.title}</h4>
                <ul className="space-y-3">
                  {crypto.nfts.types.map((t: any, i: number) => (
                    <li key={i} className="text-sm"><span className="font-bold">{t.label}:</span> <span className="text-muted-foreground">{t.text}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 9. Real Estate */}
      <section id={realEstate.id} className="pt-20">
        <SectionHeader icon={realEstate.icon} number={realEstate.number} title={realEstate.title} intro={realEstate.intro} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {realEstate.types.map((type: any, i: number) => (
            <Card key={i} className="h-full border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{type.title}</CardTitle>
                <Badge variant="secondary" className="w-fit">{type.ruling}</Badge>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                {type.text}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 10. Business Assets */}
      <section id={business.id} className="pt-20">
        <SectionHeader icon={business.icon} number={business.number} title={business.title} intro={business.intro} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-emerald-100 bg-emerald-50/20">
            <CardHeader><CardTitle className="text-base text-emerald-700">Include (Zakatable)</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {business.zakatable.list.map((item: any, i: number) => (
                  <li key={i} className="text-sm flex gap-2">
                    <Check size={14} className="text-emerald-500 mt-1 shrink-0" />
                    <span className="text-muted-foreground"><strong className="text-foreground">{item.label}:</strong> {item.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardHeader><CardTitle className="text-base text-slate-500">Exclude (Exempt)</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {business.notZakatable.list.map((item: any, i: number) => (
                  <li key={i} className="text-sm flex gap-2">
                    <ArrowsLeftRight size={14} className="text-slate-400 mt-1 shrink-0" rotate={90} />
                    <span className="text-muted-foreground"><strong className="text-foreground">{item.label}:</strong> {item.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 11. Debts & Liabilities */}
      <section id={debts.id} className="pt-20">
        <SectionHeader icon={debts.icon} number={debts.number} title={debts.title} intro={debts.intro} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Heading level={4} className="text-base">Receivables (Owed to You)</Heading>
            <div className="p-5 rounded-xl border border-emerald-100 bg-emerald-50/50 space-y-2">
              <p className="font-bold text-sm text-emerald-800">{debts.receivables.good.title}</p>
              <p className="text-xs text-muted-foreground">{debts.receivables.good.text}</p>
            </div>
            <div className="p-5 rounded-xl border bg-muted/50 space-y-2">
              <p className="font-bold text-sm text-slate-700">{debts.receivables.bad.title}</p>
              <p className="text-xs text-muted-foreground">{debts.receivables.bad.text}</p>
            </div>
          </div>
          <div className="space-y-6">
            <Heading level={4} className="text-base">Liabilities (Owed by You)</Heading>
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-4 text-sm leading-relaxed">
                <strong className="text-primary block mb-1">Standard Deduction Approach</strong>
                {debts.liabilities.zakatFlowView}
              </CardContent>
            </Card>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="deductions">
                <AccordionTrigger className="text-sm font-bold">List of Common Deductions</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-[10px] font-black uppercase text-emerald-600 mb-2 tracking-widest">Deductible</p>
                      <ul className="text-xs space-y-1 text-muted-foreground list-disc pl-4">
                        {debts.deductible.list.map((l: string, i: number) => <li key={i}>{l}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-rose-600 mb-2 tracking-widest">Non-Deductible</p>
                      <ul className="text-xs space-y-1 text-muted-foreground list-disc pl-4">
                        {debts.notDeductible.list.map((l: string, i: number) => <li key={i}>{l}</li>)}
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* 12. Trusts */}
      <section id={trusts.id} className="pt-20">
        <SectionHeader icon={trusts.icon} number={trusts.number} title={trusts.title} intro={trusts.intro} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-emerald-100">
            <CardHeader><CardTitle className="text-base">{trusts.revocable.title}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Badge className="bg-emerald-500 hover:bg-emerald-600">{trusts.revocable.ruling}</Badge>
              <p className="text-xs text-muted-foreground leading-relaxed">{trusts.revocable.text}</p>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader><CardTitle className="text-base">{trusts.irrevocable.title}</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              {trusts.irrevocable.list.map((item: any, i: number) => (
                <div key={i} className="p-3 rounded border border-border/50 text-xs">
                  <p className="font-bold mb-1 text-primary">{item.label}</p>
                  <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-20" />

      {/* 13. Methodology Explorer (Comparison Tool) */}
      <section id="explorer">
        <ScrollReveal>
          <div className="text-center mb-12">
            <Badge className="mb-4">Live Tool</Badge>
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Methodology Comparison Tool</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select two methodologies below to compare their rulings on key assets side-by-side.
            </p>
          </div>
          <MethodologyExplorer initialMode={initialMode} />
        </ScrollReveal>
      </section>

      {/* 14. Ahmed Family Case Study (Application) */}
      <ScrollReveal>
        <CaseStudy />
      </ScrollReveal>

      <Separator className="my-20" />

      {/* 15. Glossary */}
      <section id="glossary">
        <ScrollReveal>
          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary text-primary-foreground rounded-lg shadow-sm">
                  <BookOpen size={24} weight="duotone" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black">Unified Glossary</CardTitle>
                  <CardDescription>Essential terminology derived from Zakat jurisprudence.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-10">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(GLOSSARY)
                  .filter(([key]) => !['nisab', 'hawl', 'mal_dimar'].includes(key))
                  .sort(([, a], [, b]) => a.term.localeCompare(b.term))
                  .map(([, term]) => (
                    <div key={term.term} className="p-5 rounded-2xl bg-muted/20 border border-border/50 hover:border-primary/30 transition-all group flex flex-col h-full">
                      <div className="flex items-baseline justify-between mb-3">
                        <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{term.term}</h4>
                        {term.phonetic && <span className="text-xs font-mono text-muted-foreground opacity-70 italic">{term.phonetic}</span>}
                      </div>
                      <p className="text-sm text-balance leading-relaxed text-muted-foreground mb-4 flex-grow">{term.definition}</p>
                      {term.scholarly_note && (
                        <div className="mt-auto pt-3 border-t border-border/30">
                          <p className="text-[10px] leading-tight italic text-primary/70">{term.scholarly_note}</p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </section>

      {/* 16. References */}
      <section id="references" className="pt-20 pb-20">
        <ScrollReveal>
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Sources & Citations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-12 pt-4">
                <div className="space-y-6">
                  <h4 className="font-bold text-primary flex items-center gap-2">
                    <Check /> Contemporary Sources
                  </h4>
                  <ul className="space-y-4">
                    <li className="flex gap-4">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-foreground leading-none">Joe Bradford</p>
                        <p className="text-xs text-muted-foreground italic">"Simple Zakat Guide" - Modern synthesis of classical fiqh for Western financial assets.</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-foreground leading-none">Dr. Yusuf al-Qaradawi</p>
                        <p className="text-xs text-muted-foreground italic">"Fiqh al-Zakah" - The definitive contemporary work on Zakat jurisprudence.</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="space-y-6">
                  <h4 className="font-bold text-primary flex items-center gap-2">
                    <BookOpen /> Classical Foundations
                  </h4>
                  <Text className="text-xs text-muted-foreground leading-relaxed">
                    ZakatFlow cross-references rules against major classical texts including Al-Mughni (Hanbali), Minhaj al-Talibin (Shafi'i), Fath al-Qadir (Hanafi), and Bidayat al-Mujtahid (Maliki).
                  </Text>
                  <div className="mt-8 p-6 rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
                      <Warning size={64} />
                    </div>
                    <h5 className="font-bold text-amber-400 mb-2 flex items-center gap-2">
                      <WarningCircle size={20} />
                      Jurisprudential Disclaimer
                    </h5>
                    <p className="text-xs leading-relaxed text-slate-300">
                      Zakat is a religious obligation. While ZakatFlow aims for scholarly accuracy, users are encouraged to consult with their local Imam or scholar for specific complex cases.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </section>
    </ArticleLayout>
  );
};

export default Methodology;
