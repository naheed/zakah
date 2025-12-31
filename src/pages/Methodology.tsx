
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Separator } from "@/components/ui/separator";
import { Footer } from "@/components/zakat/Footer";
import { getPrimaryUrl } from "@/lib/domainConfig";
import { ReadingProgress } from "@/components/ui/reading-progress";
import { FloatingToc } from "@/components/ui/floating-toc";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { AnimatedSectionHeader } from "@/components/ui/animated-section-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Warning } from "@phosphor-icons/react";
import { methodologyContent } from "@/lib/content/methodology";

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
  const content = methodologyContent;

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
                {content.header.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {content.header.intro}
              </p>
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Primary Influences:</strong> {content.header.primaryInfluences}
                </p>
              </div>
            </header>
          </ScrollReveal>

          {/* Sections */}
          <div className="space-y-16">

            {/* Principles */}
            <section id="principles">
              <AnimatedSectionHeader
                number={content.principles.number}
                title={content.principles.title}
                icon={<content.principles.icon className="w-5 h-5 text-primary" weight="duotone" />}
              />

              <div className="space-y-4 text-muted-foreground">
                <ScrollReveal>
                  <p>{content.principles.intro}</p>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">{content.principles.conditionsTitle}</h3>
                </ScrollReveal>

                <StaggerContainer className="space-y-4" staggerDelay={0.08}>
                  {content.principles.conditions.map((condition, idx) => (
                    <StaggerItem key={idx}>
                      <div className="p-4 rounded-lg bg-muted/50 border border-border">
                        <h4 className="font-medium text-foreground flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">{condition.number}</span>
                          {condition.title}
                        </h4>
                        <p className="text-sm mt-2">{condition.description}</p>
                        {condition.example && (
                          <p className="text-xs mt-2 text-primary/80 italic">{condition.example}</p>
                        )}
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-8">{content.principles.malDimar.title}</h3>
                  <div className="p-4 rounded-lg bg-tertiary/10 border border-tertiary/20 mt-3">
                    <p className="text-sm"><strong className="text-foreground">Māl Ḍimār</strong> {content.principles.malDimar.description.replace("Māl Ḍimār ", "")}</p>
                    <p className="text-sm mt-2">{content.principles.malDimar.modern}</p>
                  </div>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">{content.principles.intent.title}</h3>
                  <p>{content.principles.intent.description}</p>
                </ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-2" staggerDelay={0.05}>
                  {content.principles.intent.list.map((item, idx) => (
                    <StaggerItem key={idx}>
                      <li><strong className="text-foreground">{item.label}:</strong> {item.text}</li>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </section>

            <Separator />

            {/* Nisab */}
            <section id="nisab">
              <AnimatedSectionHeader
                number={content.nisab.number}
                title={content.nisab.title}
                icon={<content.nisab.icon className="w-5 h-5 text-primary" weight="duotone" />}
              />

              <div className="space-y-4 text-muted-foreground">
                <ScrollReveal>
                  <p>{content.nisab.intro}</p>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">{content.nisab.historical.title}</h3>
                  <p>{content.nisab.historical.intro}</p>
                </ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-2" staggerDelay={0.05}>
                  {content.nisab.historical.items.map((item, idx) => (
                    <StaggerItem key={idx}><li><strong className="text-foreground">{item.label}:</strong> {item.text}</li></StaggerItem>
                  ))}
                </StaggerContainer>
                <ScrollReveal>
                  <p>{content.nisab.historical.note}</p>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">{content.nisab.divergence.title}</h3>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <ul className="space-y-3">
                      {content.nisab.divergence.items.map((item, idx) => (
                        <li key={idx}>
                          <strong className="text-foreground">{item.label}:</strong> {item.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>

                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">{content.nisab.consensus.title}</h3>
                  <p>{content.nisab.consensus.text}</p>
                </ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-2" staggerDelay={0.05}>
                  {content.nisab.consensus.principles.map((item, idx) => (
                    <StaggerItem key={idx}><li><strong className="text-foreground">{item.label}:</strong> {item.text}</li></StaggerItem>
                  ))}
                </StaggerContainer>
                <ScrollReveal>
                  <p>{content.nisab.consensus.note}</p>
                </ScrollReveal>

                <ScrollReveal>
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mt-6">
                    <p className="text-sm">
                      <strong className="text-foreground">Practical Guidance:</strong> {content.nisab.guidance.replace("Practical Guidance: ", "")}
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </section>

            <Separator />

            {/* Hawl */}
            <section id="hawl">
              <AnimatedSectionHeader
                number={content.hawl.number}
                title={content.hawl.title}
                icon={<content.hawl.icon className="w-5 h-5 text-primary" weight="duotone" />}
              />
              <div className="space-y-4 text-muted-foreground">
                <ScrollReveal><p>{content.hawl.intro}</p></ScrollReveal>
                <ScrollReveal><h3 className="text-lg font-medium text-foreground mt-6">{content.hawl.lunarSolar.title}</h3></ScrollReveal>
                <ScrollReveal>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <h4 className="font-medium text-foreground mb-2">{content.hawl.lunarSolar.lunar.title}</h4>
                      <ul className="text-sm space-y-1">
                        {content.hawl.lunarSolar.lunar.points.map((p, i) => <li key={i}>• {p}</li>)}
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <h4 className="font-medium text-foreground mb-2">{content.hawl.lunarSolar.solar.title}</h4>
                      <ul className="text-sm space-y-1">
                        {content.hawl.lunarSolar.solar.points.map((p, i) => <li key={i}>• {p}</li>)}
                      </ul>
                    </div>
                  </div>
                </ScrollReveal>
                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">{content.hawl.rateAdjustment.title}</h3>
                  <p>{content.hawl.rateAdjustment.text}</p>
                  <p className="mt-2"><code className="px-2 py-1 rounded bg-muted text-foreground">{content.hawl.rateAdjustment.formula}</code></p>
                </ScrollReveal>
                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">{content.hawl.dateChoice.title}</h3>
                  <p>{content.hawl.dateChoice.intro}</p>
                </ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-1" staggerDelay={0.05}>
                  {content.hawl.dateChoice.options.map((opt, i) => <StaggerItem key={i}><li>{opt}</li></StaggerItem>)}
                </StaggerContainer>
                <ScrollReveal>
                  <p className="mt-2"><strong className="text-foreground">Consistency matters.</strong> {content.hawl.dateChoice.note}</p>
                </ScrollReveal>
              </div>
            </section>

            <Separator />

            {/* Liquid */}
            <section id="liquid">
              <AnimatedSectionHeader number={content.liquid.number} title={content.liquid.title} icon={<content.liquid.icon className="w-5 h-5 text-primary" weight="duotone" />} />
              <div className="space-y-4 text-muted-foreground">
                <ScrollReveal><p>{content.liquid.intro}</p></ScrollReveal>
                <ScrollReveal><h3 className="text-lg font-medium text-foreground mt-6">{content.liquid.assets.title}</h3></ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-2" staggerDelay={0.05}>
                  {content.liquid.assets.list.map((item, i) => (
                    <StaggerItem key={i}><li><strong className="text-foreground">{item.label}:</strong> {item.text}</li></StaggerItem>
                  ))}
                </StaggerContainer>
                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">{content.liquid.interest.title}</h3>
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm">{content.liquid.interest.text1}</p>
                    <p className="text-sm mt-2">{content.liquid.interest.text2}</p>
                  </div>
                </ScrollReveal>
              </div>
            </section>

            <Separator />

            {/* Stocks */}
            <section id="stocks">
              <AnimatedSectionHeader number={content.stocks.number} title={content.stocks.title} icon={<content.stocks.icon className="w-5 h-5 text-primary" weight="duotone" />} />
              <div className="space-y-4 text-muted-foreground">
                <ScrollReveal><p>{content.stocks.intro}</p></ScrollReveal>
                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">{content.stocks.mudir.title}</h3>
                  <p>{content.stocks.mudir.text}</p>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border mt-2">
                    <p className="font-medium text-foreground">Zakat Calculation:</p>
                    <p className="text-sm">{content.stocks.mudir.calculation}</p>
                  </div>
                </ScrollReveal>
                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">{content.stocks.muhtakir.title}</h3>
                  <p>{content.stocks.muhtakir.text}</p>
                </ScrollReveal>
                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">{content.stocks.rule30.title}</h3>
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm font-medium text-foreground">{content.stocks.rule30.standard}</p>
                    <p className="text-sm mt-2">{content.stocks.rule30.description}</p>
                    <div className="mt-3 p-3 bg-background rounded border border-border">
                      <p className="text-sm font-mono">
                        {content.stocks.rule30.formula}<br />
                        <span className="text-muted-foreground"><strong className="text-foreground">Effective rate:</strong> 0.75%</span>
                      </p>
                    </div>
                    <p className="text-xs mt-3 text-muted-foreground">{content.stocks.rule30.note}</p>
                  </div>
                </ScrollReveal>
                <ScrollReveal><h3 className="text-lg font-medium text-foreground mt-6">{content.stocks.exclusions.title}</h3></ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-2" staggerDelay={0.05}>
                  {content.stocks.exclusions.list.map((item, i) => <StaggerItem key={i}><li><strong className="text-foreground">{item.label}:</strong> {item.text}</li></StaggerItem>)}
                </StaggerContainer>
                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">{content.stocks.purification.title}</h3>
                  <p className="text-sm">{content.stocks.purification.text}</p>
                </ScrollReveal>
              </div>
            </section>

            <Separator />

            {/* Retirement */}
            <section id="retirement">
              <AnimatedSectionHeader number={content.retirement.number} title={content.retirement.title} icon={<content.retirement.icon className="w-5 h-5 text-primary" weight="duotone" />} />
              <div className="space-y-4 text-muted-foreground">
                <ScrollReveal><p>{content.retirement.intro}</p></ScrollReveal>
                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Three Scholarly Approaches</h3>
                  <p className="mb-4">{content.retirement.approachesIntro}</p>
                </ScrollReveal>
                <StaggerContainer className="space-y-4" staggerDelay={0.08}>
                  {content.retirement.approaches.map((app, i) => (
                    <StaggerItem key={i}>
                      <div className={`p-4 rounded-lg border ${i === 2 ? 'bg-tertiary/10 border-tertiary/20' : 'bg-muted/50 border-border'}`}>
                        <h4 className="font-medium text-foreground flex items-center gap-2">
                          {app.title}
                          {app.tag && <span className="text-xs bg-tertiary/20 text-tertiary px-2 py-0.5 rounded-full">{app.tag}</span>}
                        </h4>
                        <p className="text-sm mt-2">{app.description}</p>
                        {app.steps && (
                          <div className="mt-3 p-3 bg-background rounded border border-border text-sm">
                            <ol className="list-decimal pl-4 space-y-1">
                              {app.steps.map((s, k) => <li key={k}>{s}</li>)}
                            </ol>
                          </div>
                        )}
                        {app.principles && (
                          <div className="mt-3 p-3 bg-background rounded border border-border text-sm">
                            <p className="font-medium text-foreground">Key Principles:</p>
                            <ul className="list-disc pl-4 mt-1 space-y-1">
                              {app.principles.map((p, k) => <li key={k}>{p}</li>)}
                            </ul>
                          </div>
                        )}
                        <p className="text-xs mt-2 text-muted-foreground">{app.basis}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">Account-Specific Rules</h3>
                  <h4 className="font-medium text-foreground mt-4">{content.retirement.roth.title}</h4>
                  <p className="text-sm">{content.retirement.roth.intro}</p>
                </ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-1 text-sm" staggerDelay={0.05}>
                  {content.retirement.roth.points.map((p, i) => <StaggerItem key={i}><li><strong className="text-foreground">{p.label}:</strong> {p.text}</li></StaggerItem>)}
                </StaggerContainer>
                <ScrollReveal>
                  <h4 className="font-medium text-foreground mt-4">{content.retirement.hsa.title}</h4>
                  <p className="text-sm">{content.retirement.hsa.text}</p>
                </ScrollReveal>
                <ScrollReveal>
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mt-6">
                    <p className="text-sm font-medium text-foreground">{content.retirement.loans.title}</p>
                    <p className="text-sm mt-1">{content.retirement.loans.text}</p>
                  </div>
                </ScrollReveal>
              </div>
            </section>

            <Separator />

            {/* Crypto */}
            <section id="crypto">
              <AnimatedSectionHeader number={content.crypto.number} title={content.crypto.title} icon={<content.crypto.icon className="w-5 h-5 text-primary" weight="duotone" />} />
              <div className="space-y-4 text-muted-foreground">
                <ScrollReveal><p>{content.crypto.intro}</p></ScrollReveal>
                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">{content.crypto.principle.title}</h3>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-sm">{content.crypto.principle.text}</p>
                  </div>
                </ScrollReveal>
                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">{content.crypto.catA.title}</h3>
                  <p>{content.crypto.catA.intro}</p>
                </ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-1 text-sm" staggerDelay={0.05}>
                  {content.crypto.catA.list.map((item, i) => <StaggerItem key={i}><li><strong className="text-foreground">{item.label}:</strong> {item.text}</li></StaggerItem>)}
                </StaggerContainer>
                <ScrollReveal><h3 className="text-lg font-medium text-foreground mt-6">{content.crypto.catB.title}</h3></ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-2 text-sm" staggerDelay={0.05}>
                  {content.crypto.catB.list.map((item, i) => <StaggerItem key={i}><li><strong className="text-foreground">{item.label}:</strong> {item.text}</li></StaggerItem>)}
                </StaggerContainer>
                <ScrollReveal><h3 className="text-lg font-medium text-foreground mt-6">{content.crypto.nfts.title}</h3></ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-1 text-sm" staggerDelay={0.05}>
                  {content.crypto.nfts.list.map((item, i) => <StaggerItem key={i}><li><strong className="text-foreground">{item.label}:</strong> {item.text}</li></StaggerItem>)}
                </StaggerContainer>
              </div>
            </section>

            <Separator />

            {/* Metals */}
            <section id="metals">
              <AnimatedSectionHeader number={content.metals.number} title={content.metals.title} icon={<content.metals.icon className="w-5 h-5 text-primary" weight="duotone" />} />
              <div className="space-y-4 text-muted-foreground">
                <ScrollReveal><p>{content.metals.intro}</p></ScrollReveal>
                <ScrollReveal><h3 className="text-lg font-medium text-foreground mt-6">{content.metals.alwaysZakatable.title}</h3></ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-2" staggerDelay={0.05}>
                  {content.metals.alwaysZakatable.list.map((item, i) => <StaggerItem key={i}><li><strong className="text-foreground">{item.label}:</strong> {item.text}</li></StaggerItem>)}
                </StaggerContainer>
                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">{content.metals.jewelry.title}</h3>
                  <p>{content.metals.jewelry.intro}</p>
                </ScrollReveal>
                <ScrollReveal>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    {content.metals.jewelry.views.map((v, i) => (
                      <div key={i} className="p-4 rounded-lg bg-muted/50 border border-border">
                        <h4 className="font-medium text-foreground mb-2">{v.title}</h4>
                        <p className="text-sm">{v.text}</p>
                      </div>
                    ))}
                  </div>
                </ScrollReveal>
                <ScrollReveal>
                  <div className="p-4 rounded-lg bg-tertiary/10 border border-tertiary/20 mt-4">
                    <p className="text-sm font-medium text-foreground">{content.metals.jewelry.precaution.title}</p>
                    <p className="text-sm mt-1">{content.metals.jewelry.precaution.text}</p>
                  </div>
                </ScrollReveal>
                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">{content.metals.jewelry.valuation.title}</h3>
                  <p>{content.metals.jewelry.valuation.intro}</p>
                </ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-1 text-sm" staggerDelay={0.05}>
                  {content.metals.jewelry.valuation.points.map((p, i) => <StaggerItem key={i}><li>{p}</li></StaggerItem>)}
                </StaggerContainer>
              </div>
            </section>

            <Separator />

            {/* Real Estate */}
            <section id="realestate">
              <AnimatedSectionHeader number={content.realEstate.number} title={content.realEstate.title} icon={<content.realEstate.icon className="w-5 h-5 text-primary" weight="duotone" />} />
              <div className="space-y-4 text-muted-foreground">
                <ScrollReveal><p>{content.realEstate.intro}</p></ScrollReveal>
                {content.realEstate.types.map((type, i) => (
                  <ScrollReveal key={i}>
                    <h3 className="text-lg font-medium text-foreground mt-6">{type.title}</h3>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      {type.ruling && <p className="font-medium text-foreground">{type.ruling}</p>}
                      {type.text1 && <p className="font-medium text-foreground">{type.text1}</p>}
                      {type.desc1 && <p className="text-sm mt-1">{type.desc1}</p>}
                      {type.text && <p className="text-sm mt-1">{type.text}</p>}
                      {type.desc && <p className="text-sm mt-2">{type.desc}</p>}
                      {type.text2 && <p className="font-medium text-foreground mt-3">{type.text2}</p>}
                      {type.desc2 && <p className="text-sm mt-1">{type.desc2}</p>}
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </section>

            <Separator />

            {/* Business */}
            <section id="business">
              <AnimatedSectionHeader number={content.business.number} title={content.business.title} icon={<content.business.icon className="w-5 h-5 text-primary" weight="duotone" />} />
              <div className="space-y-4 text-muted-foreground">
                <ScrollReveal><p>{content.business.intro}</p></ScrollReveal>
                <ScrollReveal><h3 className="text-lg font-medium text-foreground mt-6">{content.business.zakatable.title}</h3></ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-2" staggerDelay={0.05}>
                  {content.business.zakatable.list.map((item, i) => <StaggerItem key={i}><li><strong className="text-foreground">{item.label}:</strong> {item.text}</li></StaggerItem>)}
                </StaggerContainer>
                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">{content.business.valuation.title}</h3>
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm">{content.business.valuation.text}</p>
                  </div>
                </ScrollReveal>
                <ScrollReveal><h3 className="text-lg font-medium text-foreground mt-6">{content.business.notZakatable.title}</h3></ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-2" staggerDelay={0.05}>
                  {content.business.notZakatable.list.map((item, i) => <StaggerItem key={i}><li><strong className="text-foreground">{item.label}:</strong> {item.text}</li></StaggerItem>)}
                </StaggerContainer>
              </div>
            </section>

            <Separator />

            {/* Debts */}
            <section id="debts">
              <AnimatedSectionHeader number={content.debts.number} title={content.debts.title} icon={<content.debts.icon className="w-5 h-5 text-primary" weight="duotone" />} />
              <div className="space-y-4 text-muted-foreground">
                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground">{content.debts.receivables.title}</h3>
                  <p>{content.debts.receivables.intro}</p>
                </ScrollReveal>
                <ScrollReveal>
                  <h4 className="font-medium text-foreground mt-4">{content.debts.receivables.good.title}</h4>
                  <p className="text-sm">{content.debts.receivables.good.text}</p>
                </ScrollReveal>
                <ScrollReveal>
                  <h4 className="font-medium text-foreground mt-4">{content.debts.receivables.bad.title}</h4>
                  <p className="text-sm">{content.debts.receivables.bad.text}</p>
                </ScrollReveal>
                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">{content.debts.liabilities.title}</h3>
                  <p className="mb-4">{content.debts.liabilities.intro}</p>
                </ScrollReveal>
                <ScrollReveal>
                  <div className="p-4 rounded-lg bg-tertiary/10 border border-tertiary/20">
                    <p className="text-sm font-medium text-foreground">The Maliki "Middle Path" (Adopted by AMJA)</p>
                    <div className="mt-3 grid md:grid-cols-3 gap-3 text-sm">
                      {content.debts.liabilities.views.map((v, i) => (
                        <div key={i} className={`p-3 bg-background rounded border ${v.title.includes('Maliki') ? 'border-tertiary/30' : 'border-border'}`}>
                          <p className={`font-medium ${v.title.includes('Maliki') ? 'text-tertiary' : 'text-foreground'}`}>{v.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{v.text}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm mt-3">{content.debts.liabilities.zakatFlowView}</p>
                  </div>
                </ScrollReveal>
                <ScrollReveal><h4 className="font-medium text-foreground mt-6">{content.debts.deductible.title}</h4></ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-1 text-sm" staggerDelay={0.05}>
                  {content.debts.deductible.list.map((item, i) => <StaggerItem key={i}><li>{item}</li></StaggerItem>)}
                </StaggerContainer>
                <ScrollReveal><h4 className="font-medium text-foreground mt-4">{content.debts.notDeductible.title}</h4></ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-1 text-sm" staggerDelay={0.05}>
                  {content.debts.notDeductible.list.map((item, i) => <StaggerItem key={i}><li>{item}</li></StaggerItem>)}
                </StaggerContainer>
                <ScrollReveal>
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mt-6">
                    <p className="text-sm font-medium text-foreground">{content.debts.guidance.title}</p>
                    <p className="text-sm mt-1">{content.debts.guidance.text}</p>
                  </div>
                </ScrollReveal>
              </div>
            </section>

            <Separator />

            {/* Trusts */}
            <section id="trusts">
              <AnimatedSectionHeader number={content.trusts.number} title={content.trusts.title} icon={<content.trusts.icon className="w-5 h-5 text-primary" weight="duotone" />} />
              <div className="space-y-4 text-muted-foreground">
                <ScrollReveal><p>{content.trusts.intro}</p></ScrollReveal>
                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">{content.trusts.revocable.title}</h3>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="font-medium text-foreground">{content.trusts.revocable.ruling}</p>
                    <p className="text-sm mt-1">{content.trusts.revocable.text}</p>
                  </div>
                </ScrollReveal>
                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">{content.trusts.irrevocable.title}</h3>
                  <p>{content.trusts.irrevocable.intro}</p>
                </ScrollReveal>
                <StaggerContainer className="list-disc pl-6 space-y-2 text-sm" staggerDelay={0.05}>
                  {content.trusts.irrevocable.list.map((item, i) => <StaggerItem key={i}><li><strong className="text-foreground">{item.label}:</strong> {item.text}</li></StaggerItem>)}
                </StaggerContainer>
                <ScrollReveal>
                  <h3 className="text-lg font-medium text-foreground mt-6">{content.trusts.custodial.title}</h3>
                  <p className="text-sm">{content.trusts.custodial.text}</p>
                </ScrollReveal>
              </div>
            </section>

            <Separator />

            {/* Example */}
            <section id="example">
              <AnimatedSectionHeader number={content.example.number} title={content.example.title} icon={<content.example.icon className="w-5 h-5 text-primary" weight="duotone" />} />
              <div className="space-y-4 text-muted-foreground">
                <ScrollReveal><p>{content.example.intro}</p></ScrollReveal>
                <ScrollReveal>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <h4 className="font-medium text-foreground">{content.example.profile.title}</h4>
                    <ul className="text-sm mt-2 space-y-1">
                      {content.example.profile.items.map((item, i) => <li key={i}>• {item}</li>)}
                    </ul>
                  </div>
                </ScrollReveal>
                <ScrollReveal><h3 className="text-lg font-medium text-foreground mt-6">{content.example.assets.title}</h3></ScrollReveal>
                <ScrollReveal>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                      <thead className="bg-muted/50"><tr><th className="text-left p-3 font-medium text-foreground">Asset Category</th><th className="text-right p-3 font-medium text-foreground">Value</th></tr></thead>
                      <tbody>
                        {content.example.assets.table.map((row, i) => (
                          <tr key={i} className={`border-t border-border ${row.isTotal ? 'font-medium' : i % 2 !== 0 ? 'bg-muted/30' : ''}`}>
                            <td className={`p-3 ${row.isTotal ? 'text-foreground' : ''}`}>{row.label}</td>
                            <td className={`p-3 text-right font-mono ${row.isTotal ? 'text-foreground' : ''}`}>{row.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ScrollReveal>
                <ScrollReveal><h3 className="text-lg font-medium text-foreground mt-6">{content.example.liabilities.title}</h3></ScrollReveal>
                <ScrollReveal>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                      <thead className="bg-muted/50"><tr><th className="text-left p-3 font-medium text-foreground">Liability</th><th className="text-right p-3 font-medium text-foreground">Deductible Amount</th></tr></thead>
                      <tbody>
                        {content.example.liabilities.table.map((row, i) => (
                          <tr key={i} className={`border-t border-border ${row.isTotal ? 'font-medium' : i % 2 !== 0 ? 'bg-muted/30' : ''}`}>
                            <td className={`p-3 ${row.isTotal ? 'text-foreground' : ''}`}>{row.label}</td>
                            <td className={`p-3 text-right font-mono ${row.isTotal ? 'text-foreground' : ''}`}>{row.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ScrollReveal>
                <ScrollReveal><h3 className="text-lg font-medium text-foreground mt-6">{content.example.calculation.title}</h3></ScrollReveal>
                <StaggerContainer className="space-y-4" staggerDelay={0.08}>
                  {content.example.calculation.modes.map((mode, i) => (
                    <StaggerItem key={i}>
                      <div className={`p-4 rounded-lg ${i === 2 ? 'bg-tertiary/10 border-tertiary/20' : 'bg-muted/50 border-border'}`}>
                        <h4 className="font-medium text-foreground">{mode.title}</h4>
                        <div className="mt-3 text-sm space-y-1">
                          {mode.details.map((d, k) => <p key={k}>{d}</p>)}
                          <p className={`font-bold ${i === 2 ? 'text-tertiary' : 'text-primary'}`}>{mode.result}</p>
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
                <ScrollReveal>
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mt-6">
                    <p className="text-sm font-medium text-foreground">{content.example.summary.title}</p>
                    <p className="text-sm mt-2">{content.example.summary.text}</p>
                  </div>
                </ScrollReveal>
              </div>
            </section>

            <Separator />

            {/* Modes */}
            <section id="modes">
              <AnimatedSectionHeader number={content.modes.number} title={content.modes.title} icon={<content.modes.icon className="w-5 h-5 text-primary" weight="duotone" />} />
              <div className="space-y-4 text-muted-foreground">
                <ScrollReveal><p>{content.modes.intro}</p></ScrollReveal>
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
                    <p className="text-sm font-medium text-foreground">{content.modes.notes.title}</p>
                    <p className="text-sm mt-2">{content.modes.notes.text}</p>
                  </div>
                </ScrollReveal>
              </div>
            </section>

            <Separator />

            {/* References */}
            <section id="references">
              <AnimatedSectionHeader number={content.references.number} title={content.references.title} icon={<content.references.icon className="w-5 h-5 text-primary" weight="duotone" />} />
              <div className="space-y-6">
                <ScrollReveal><h3 className="text-lg font-medium text-foreground mb-3">{content.references.primary.title}</h3></ScrollReveal>
                <StaggerContainer className="space-y-3 text-muted-foreground" staggerDelay={0.05}>
                  {content.references.primary.list.map((item, i) => (
                    <StaggerItem key={i}>
                      <div>
                        <strong className="text-foreground">{item.name}</strong>
                        <p className="text-sm">
                          {item.text}
                          {item.link && (
                            <>
                              {" "}Available at <a href={item.link.url} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">{item.link.display}</a>
                            </>
                          )}
                        </p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
                <ScrollReveal><h3 className="text-lg font-medium text-foreground mb-3 mt-6">{content.references.classical.title}</h3></ScrollReveal>
                <StaggerContainer className="space-y-2 text-sm text-muted-foreground" staggerDelay={0.05}>
                  {content.references.classical.list.map((item, i) => (
                    <StaggerItem key={i}>
                      <li className="list-none"><strong className="text-foreground">{item.name}</strong> — {item.text}</li>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
                <ScrollReveal><h3 className="text-lg font-medium text-foreground mb-3 mt-6">{content.references.concepts.title}</h3></ScrollReveal>
                <StaggerContainer className="space-y-2 text-sm text-muted-foreground" staggerDelay={0.05}>
                  {content.references.concepts.list.map((item, i) => (
                    <StaggerItem key={i}>
                      <li className="list-none"><strong className="text-foreground">{item.name}:</strong> {item.text}</li>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
                <ScrollReveal>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border mt-6">
                    <div className="flex items-start gap-3">
                      <Warning className="w-5 h-5 text-muted-foreground mt-0.5" weight="duotone" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{content.references.disclaimer.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{content.references.disclaimer.text}</p>
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
