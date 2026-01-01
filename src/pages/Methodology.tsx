
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { methodologyContent } from "@/lib/content/methodology";
import { ArticleLayout } from "@/components/layout/ArticleLayout";
import { Text, Heading } from "@/components/ui/typography";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Warning } from "@phosphor-icons/react";
import { ZakatModeComparisonChart } from "@/components/zakat/ZakatModeComparisonChart";

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
  const content = methodologyContent;

  const headerContent = (
    <div>
      <Text variant="lead">{content.header.intro}</Text>
      <Card className="bg-muted/50 border-border shadow-none">
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
                <content.principles.icon className="w-5 h-5 text-primary mb-2 hidden" weight="duotone" />
                <Text className="mt-0">{content.principles.intro}</Text>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                          <p className="text-xs mt-2 text-primary/80 italic">{condition.example}</p>
                        )}
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Heading level={3} className="mt-0">{content.principles.malDimar.title}</Heading>
                  <div className="p-4 rounded-lg bg-tertiary/5 border border-tertiary/20 mt-2">
                    <p className="text-sm"><strong className="text-foreground">Māl Ḍimār</strong> {content.principles.malDimar.description.replace("Māl Ḍimār ", "")}</p>
                    <p className="text-sm mt-2">{content.principles.malDimar.modern}</p>
                  </div>
                </div>
                <div>
                  <Heading level={3} className="mt-0">{content.principles.intent.title}</Heading>
                  <Text className="text-sm mb-2">{content.principles.intent.description}</Text>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {content.principles.intent.list.map((item, idx) => (
                      <li key={idx}><strong className="text-foreground">{item.label}:</strong> {item.text}</li>
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
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                  {content.nisab.number}
                </div>
                <CardTitle>{content.nisab.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Text>{content.nisab.intro}</Text>

              <div>
                <Heading level={3} className="mt-0">{content.nisab.historical.title}</Heading>
                <Text>{content.nisab.historical.intro}</Text>
                <ul className="list-disc pl-5 space-y-2 mt-2 text-muted-foreground">
                  {content.nisab.historical.items.map((item, idx) => (
                    <li key={idx}><strong className="text-foreground">{item.label}:</strong> {item.text}</li>
                  ))}
                </ul>
                <Text className="mt-2 text-sm italic">{content.nisab.historical.note}</Text>
              </div>

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
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Practical Guidance:</strong> {content.nisab.guidance.replace("Practical Guidance: ", "")}
                    </p>
                  </div>
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
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                  {content.hawl.number}
                </div>
                <CardTitle>{content.hawl.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Text>{content.hawl.intro}</Text>

              <div>
                <Heading level={3} className="mt-0">{content.hawl.lunarSolar.title}</Heading>
                <div className="grid md:grid-cols-2 gap-4 mt-3">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <h4 className="font-medium text-foreground mb-2">{content.hawl.lunarSolar.lunar.title}</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      {content.hawl.lunarSolar.lunar.points.map((p, i) => <li key={i}>• {p}</li>)}
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <h4 className="font-medium text-foreground mb-2">{content.hawl.lunarSolar.solar.title}</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      {content.hawl.lunarSolar.solar.points.map((p, i) => <li key={i}>• {p}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <Heading level={4} className="mt-0 text-primary">{content.hawl.rateAdjustment.title}</Heading>
                <Text className="text-sm mb-2">{content.hawl.rateAdjustment.text}</Text>
                <code className="px-2 py-1 rounded bg-background border border-primary/20 text-foreground text-sm font-mono block w-fit">{content.hawl.rateAdjustment.formula}</code>
              </div>

              <div>
                <Heading level={3} className="mt-0">{content.hawl.dateChoice.title}</Heading>
                <Text>{content.hawl.dateChoice.intro}</Text>
                <ul className="list-disc pl-5 space-y-1 mt-2 text-muted-foreground">
                  {content.hawl.dateChoice.options.map((opt, i) => <li key={i}>{opt}</li>)}
                </ul>
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
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                  {content.liquid.number}
                </div>
                <CardTitle>{content.liquid.title}</CardTitle>
              </div>
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
                  <p className="text-sm text-muted-foreground">{content.liquid.interest.text2}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </section>

      {/* Stocks */}
      <section id="stocks" className="scroll-mt-24">
        <ScrollReveal>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                  {content.stocks.number}
                </div>
                <CardTitle>{content.stocks.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Text>{content.stocks.intro}</Text>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-muted/30 border border-border">
                  <Heading level={4} className="mt-0">{content.stocks.mudir.title}</Heading>
                  <Text className="text-sm">{content.stocks.mudir.text}</Text>
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Calculation</p>
                    <p className="text-sm">{content.stocks.mudir.calculation}</p>
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-muted/30 border border-border">
                  <Heading level={4} className="mt-0">{content.stocks.muhtakir.title}</Heading>
                  <Text className="text-sm">{content.stocks.muhtakir.text}</Text>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/20">
                <Heading level={3} className="mt-0">{content.stocks.rule30.title}</Heading>
                <p className="text-sm font-medium text-foreground mb-2">{content.stocks.rule30.standard}</p>
                <p className="text-sm text-muted-foreground mb-3">{content.stocks.rule30.description}</p>
                <div className="p-3 bg-background/50 rounded border border-primary/10 backdrop-blur-sm">
                  <p className="text-sm font-mono text-foreground">
                    {content.stocks.rule30.formula}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">Note</span>
                  {content.stocks.rule30.note}
                </div>
              </div>

              <div>
                <Heading level={3} className="mt-0">{content.stocks.exclusions.title}</Heading>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  {content.stocks.exclusions.list.map((item, i) => <li key={i}><strong className="text-foreground">{item.label}:</strong> {item.text}</li>)}
                </ul>
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
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                  {content.retirement.number}
                </div>
                <CardTitle>{content.retirement.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <Text>{content.retirement.intro}</Text>
                <Heading level={3} className="mt-6">Three Scholarly Approaches</Heading>
                <Text className="text-sm mb-4">{content.retirement.approachesIntro}</Text>

                <div className="space-y-4">
                  {content.retirement.approaches.map((app, i) => (
                    <div key={i} className={`p-5 rounded-xl border ${i === 2 ? 'bg-tertiary/10 border-tertiary/30' : 'bg-muted/30 border-border'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-foreground">{app.title}</h4>
                        {app.tag && <span className="text-xs font-bold px-2 py-1 rounded bg-background border border-border shadow-sm">{app.tag}</span>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{app.description}</p>

                      {app.steps && (
                        <div className="pl-4 border-l-2 border-border mb-3">
                          <ol className="list-decimal pl-4 text-sm text-muted-foreground space-y-1">
                            {app.steps.map((s, k) => <li key={k}>{s}</li>)}
                          </ol>
                        </div>
                      )}

                      {app.principles && (
                        <div className="pl-4 border-l-2 border-border mb-3">
                          <p className="text-xs font-semibold text-foreground mb-1">Key Principles:</p>
                          <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                            {app.principles.map((p, k) => <li key={k}>{p}</li>)}
                          </ul>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground italic">Basis: {app.basis}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Heading level={3} className="mt-0">Account-Specific Rules</Heading>
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <Heading level={4} className="mt-0">{content.retirement.roth.title}</Heading>
                    <Text className="text-sm mb-2">{content.retirement.roth.intro}</Text>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                      {content.retirement.roth.points.map((p, i) => <li key={i}><strong className="text-foreground">{p.label}:</strong> {p.text}</li>)}
                    </ul>
                  </div>
                  <div>
                    <Heading level={4} className="mt-0">{content.retirement.hsa.title}</Heading>
                    <Text className="text-sm">{content.retirement.hsa.text}</Text>
                    <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-sm font-medium text-foreground">{content.retirement.loans.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{content.retirement.loans.text}</p>
                    </div>
                  </div>
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
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                  {content.crypto.number}
                </div>
                <CardTitle>{content.crypto.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Text>{content.crypto.intro}</Text>

              <div className="p-4 rounded-lg bg-muted/40 border border-border text-center">
                <p className="text-sm font-medium text-foreground">{content.crypto.principle.title}</p>
                <p className="text-sm text-muted-foreground">{content.crypto.principle.text}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <Heading level={3} className="mt-0 text-base">{content.crypto.catA.title}</Heading>
                  <Text className="text-sm mb-2">{content.crypto.catA.intro}</Text>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {content.crypto.catA.list.map((item, i) => <li key={i}><strong className="text-foreground">{item.label}:</strong> {item.text}</li>)}
                  </ul>
                </div>
                <div>
                  <Heading level={3} className="mt-0 text-base">{content.crypto.catB.title}</Heading>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {content.crypto.catB.list.map((item, i) => <li key={i}><strong className="text-foreground">{item.label}:</strong> {item.text}</li>)}
                  </ul>

                  <Heading level={3} className="mt-4 text-base">{content.crypto.nfts.title}</Heading>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {content.crypto.nfts.list.map((item, i) => <li key={i}><strong className="text-foreground">{item.label}:</strong> {item.text}</li>)}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </section>

      {/* Metals */}
      <section id="metals" className="scroll-mt-24">
        <ScrollReveal>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                  {content.metals.number}
                </div>
                <CardTitle>{content.metals.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Text>{content.metals.intro}</Text>

              <div>
                <Heading level={3} className="mt-0">{content.metals.alwaysZakatable.title}</Heading>
                <ul className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  {content.metals.alwaysZakatable.list.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/40 border border-border">
                      <strong className="text-foreground">{item.label}</strong> {item.text}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Heading level={3} className="mt-0">{content.metals.jewelry.title}</Heading>
                <Text className="text-sm mb-3">{content.metals.jewelry.intro}</Text>
                <div className="grid md:grid-cols-2 gap-4">
                  {content.metals.jewelry.views.map((v, i) => (
                    <div key={i} className="p-4 rounded-lg bg-muted/30 border border-border">
                      <h4 className="font-medium text-foreground mb-1">{v.title}</h4>
                      <p className="text-sm text-muted-foreground">{v.text}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 rounded-lg bg-tertiary/5 border border-tertiary/20">
                  <p className="text-sm font-medium text-foreground mb-1">{content.metals.jewelry.precaution.title}</p>
                  <p className="text-sm text-muted-foreground">{content.metals.jewelry.precaution.text}</p>
                </div>
              </div>

              <div>
                <Heading level={3} className="mt-0">{content.metals.jewelry.valuation.title}</Heading>
                <Text className="text-sm mb-2">{content.metals.jewelry.valuation.intro}</Text>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  {content.metals.jewelry.valuation.points.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
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
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                  {content.realEstate.number}
                </div>
                <CardTitle>{content.realEstate.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Text>{content.realEstate.intro}</Text>
              <div className="grid gap-4 md:grid-cols-2">
                {content.realEstate.types.map((type, i) => (
                  <div key={i} className="p-5 rounded-xl bg-muted/30 border border-border flex flex-col">
                    <Heading level={3} className="mt-0 text-base mb-2">{type.title}</Heading>

                    <div className="flex-1">
                      {type.ruling && <p className="font-medium text-foreground text-sm">{type.ruling}</p>}
                      {type.text1 && <p className="font-medium text-foreground text-sm">{type.text1}</p>}
                      {type.desc1 && <p className="text-sm text-muted-foreground mt-1">{type.desc1}</p>}

                      {type.text && <p className="text-sm text-muted-foreground mt-1">{type.text}</p>}
                      {type.desc && <p className="text-sm text-muted-foreground mt-2">{type.desc}</p>}

                      {type.text2 && <p className="font-medium text-foreground text-sm mt-3">{type.text2}</p>}
                      {type.desc2 && <p className="text-sm text-muted-foreground mt-1">{type.desc2}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </section>

      {/* Business & Business Assets */}
      <section id="business" className="scroll-mt-24">
        <ScrollReveal>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                  {content.business.number}
                </div>
                <CardTitle>{content.business.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Text>{content.business.intro}</Text>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <Heading level={3} className="mt-0 text-success">{content.business.zakatable.title}</Heading>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {content.business.zakatable.list.map((item, i) => <li key={i}><strong className="text-foreground">{item.label}:</strong> {item.text}</li>)}
                  </ul>
                </div>
                <div>
                  <Heading level={3} className="mt-0 text-muted-foreground">{content.business.notZakatable.title}</Heading>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {content.business.notZakatable.list.map((item, i) => <li key={i}><strong className="text-foreground">{item.label}:</strong> {item.text}</li>)}
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <Heading level={4} className="mt-0 text-primary">{content.business.valuation.title}</Heading>
                <p className="text-sm text-muted-foreground">{content.business.valuation.text}</p>
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
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                  {content.debts.number}
                </div>
                <CardTitle>{content.debts.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <Heading level={3} className="mt-0">{content.debts.receivables.title}</Heading>
                  <Text className="text-sm mb-3">{content.debts.receivables.intro}</Text>

                  <div className="space-y-3">
                    <div className="p-3 bg-muted/30 rounded border border-border">
                      <p className="font-medium text-foreground text-sm">{content.debts.receivables.good.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{content.debts.receivables.good.text}</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded border border-border">
                      <p className="font-medium text-foreground text-sm">{content.debts.receivables.bad.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{content.debts.receivables.bad.text}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Heading level={3} className="mt-0">{content.debts.liabilities.title}</Heading>
                  <Text className="text-sm mb-3">{content.debts.liabilities.intro}</Text>

                  <div className="p-3 rounded-lg bg-tertiary/5 border border-tertiary/20">
                    <p className="text-sm font-medium text-foreground mb-2">The Maliki "Middle Path"</p>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      {content.debts.liabilities.views.map((v, i) => (
                        <div key={i} className="flex gap-2">
                          <span className="font-bold text-foreground min-w-[30px]">{i + 1}.</span>
                          <span>{v.title}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs mt-2 pt-2 border-t border-tertiary/10 font-medium text-foreground">{content.debts.liabilities.zakatFlowView}</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-border">
                <div>
                  <Heading level={4} className="mt-0 text-success">{content.debts.deductible.title}</Heading>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {content.debts.deductible.list.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <Heading level={4} className="mt-0 text-destructive">{content.debts.notDeductible.title}</Heading>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {content.debts.notDeductible.list.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
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
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                  {content.trusts.number}
                </div>
                <CardTitle>{content.trusts.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Text>{content.trusts.intro}</Text>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <Heading level={4} className="mt-0 mb-2">{content.trusts.revocable.title}</Heading>
                  <p className="font-medium text-foreground text-sm">{content.trusts.revocable.ruling}</p>
                  <p className="text-xs text-muted-foreground mt-1">{content.trusts.revocable.text}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <Heading level={4} className="mt-0 mb-2">{content.trusts.irrevocable.title}</Heading>
                  <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-1">
                    {content.trusts.irrevocable.list.map((item, i) => <li key={i}>{item.label}</li>)}
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <Heading level={4} className="mt-0 mb-2">{content.trusts.custodial.title}</Heading>
                  <p className="text-xs text-muted-foreground">{content.trusts.custodial.text}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </section>

      {/* Example */}
      <section id="example" className="scroll-mt-24">
        <ScrollReveal>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                  {content.example.number}
                </div>
                <CardTitle>{content.example.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <h4 className="font-medium text-foreground mb-2">{content.example.profile.title}</h4>
                <ul className="text-sm space-y-1 text-muted-foreground grid md:grid-cols-2 gap-x-4">
                  {content.example.profile.items.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <Heading level={3} className="mt-0 text-base">{content.example.assets.title}</Heading>
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50"><tr><th className="text-left p-2 font-medium">Asset</th><th className="text-right p-2 font-medium">Value</th></tr></thead>
                      <tbody>
                        {content.example.assets.table.map((row, i) => (
                          <tr key={i} className={`border-t border-border ${row.isTotal ? 'font-bold bg-muted/20' : ''}`}>
                            <td className="p-2">{row.label}</td>
                            <td className="p-2 text-right font-mono text-xs">{row.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <Heading level={3} className="mt-0 text-base">{content.example.liabilities.title}</Heading>
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50"><tr><th className="text-left p-2 font-medium">Liability</th><th className="text-right p-2 font-medium">Amt</th></tr></thead>
                      <tbody>
                        {content.example.liabilities.table.map((row, i) => (
                          <tr key={i} className={`border-t border-border ${row.isTotal ? 'font-bold bg-muted/20' : ''}`}>
                            <td className="p-2">{row.label}</td>
                            <td className="p-2 text-right font-mono text-xs">{row.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div>
                <Heading level={3} className="mt-0 mb-4">{content.example.calculation.title}</Heading>
                <div className="grid md:grid-cols-3 gap-4">
                  {content.example.calculation.modes.map((mode, i) => (
                    <div key={i} className={`p-4 rounded-xl border flex flex-col justify-between ${i === 2 ? 'bg-tertiary/10 border-tertiary/30' : 'bg-muted/30 border-border'}`}>
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">{mode.title}</h4>
                        <div className="mt-2 text-xs space-y-1 text-muted-foreground">
                          {mode.details.map((d, k) => <p key={k}>{d}</p>)}
                        </div>
                      </div>
                      <p className={`font-bold text-lg mt-3 ${i === 2 ? 'text-tertiary' : 'text-primary'}`}>{mode.result}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <ZakatModeComparisonChart />
              </div>

              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-center">
                <p className="text-sm font-medium text-foreground">{content.example.summary.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{content.example.summary.text}</p>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </section>

      {/* Modes Table */}
      <section id="modes" className="scroll-mt-24">
        <ScrollReveal>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                  {content.modes.number}
                </div>
                <CardTitle>{content.modes.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Text>{content.modes.intro}</Text>
              <div className="overflow-x-auto mt-4 rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-medium text-foreground">Asset Type</th>
                      <th className="text-center p-3 font-medium text-foreground">Conservative</th>
                      <th className="text-center p-3 font-medium text-foreground">Optimized</th>
                      <th className="text-center p-3 font-medium text-tertiary">Bradford</th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.modes.comparisonTable.map((row, i) => (
                      <tr key={i} className={`border-t border-border ${i % 2 === 1 ? 'bg-muted/20' : ''} hover:bg-muted/40 transition-colors`}>
                        <td className="p-3 font-medium text-foreground text-sm">{row.asset}</td>
                        <td className="p-3 text-center text-sm text-muted-foreground">{row.conservative}</td>
                        <td className="p-3 text-center text-sm font-medium text-primary">{row.optimized}</td>
                        <td className={`p-3 text-center text-sm font-bold ${row.bradford === 'EXEMPT' ? 'text-tertiary' : 'text-primary'}`}>
                          {row.bradford}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 rounded bg-muted/30 text-xs text-muted-foreground">
                <strong className="text-foreground">{content.modes.notes.title}</strong>: {content.modes.notes.text}
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
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                  {content.references.number}
                </div>
                <CardTitle>{content.references.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Heading level={3} className="mt-0">{content.references.primary.title}</Heading>
                <ul className="space-y-2 text-sm text-muted-foreground">
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

              <div className="p-4 rounded-lg bg-muted/50 border border-border flex gap-3 text-muted-foreground">
                <Warning className="w-5 h-5 shrink-0" />
                <p className="text-xs">{content.references.disclaimer.text}</p>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </section>
    </ArticleLayout>
  );
};

export default Methodology;
