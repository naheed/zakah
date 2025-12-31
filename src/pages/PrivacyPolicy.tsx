import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Lock, Warning } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/zakat/Footer";
import { getPrimaryUrl } from "@/lib/domainConfig";
import { ReadingProgress } from "@/components/ui/reading-progress";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { AnimatedSectionHeader } from "@/components/ui/animated-section-header";
import { privacyHighlights, privacySections, SectionContent } from "@/lib/content/privacy";

function HighlightSection() {
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-primary" weight="duotone" />
        Key Privacy Highlights
      </h2>
      <StaggerContainer className="space-y-2" staggerDelay={0.05}>
        {privacyHighlights.map((item, i) => (
          <StaggerItem key={i}>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <item.icon className="w-4 h-4 text-primary mt-0.5 shrink-0" weight="duotone" />
              <span>{item.text}</span>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}

function SectionRenderer({ section, index }: { section: SectionContent; index: number }) {
  return (
    <section id={section.id}>
      <AnimatedSectionHeader number={index + 1} title={section.title} />

      {section.content && (
        <ScrollReveal>
          <p className="text-muted-foreground mb-4 whitespace-pre-wrap">{section.content}</p>
        </ScrollReveal>
      )}

      {section.listItems && (
        <StaggerContainer className="ml-4 mb-4" staggerDelay={0.05}>
          {section.listItems.map((item, i) => (
            <StaggerItem key={i}>
              <li className="text-muted-foreground list-disc list-inside">{item}</li>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {section.subsections?.map((sub, i) => (
        <div key={i} className="mb-6">
          {sub.title && (
            <ScrollReveal>
              <h3 className="text-lg font-medium text-foreground mt-6 mb-2">{sub.title}</h3>
            </ScrollReveal>
          )}

          {sub.content && (
            <ScrollReveal>
              <p className="text-muted-foreground mb-2 whitespace-pre-wrap">{sub.content}</p>
            </ScrollReveal>
          )}

          {sub.listItems && (
            <StaggerContainer className="ml-4" staggerDelay={0.05}>
              {sub.listItems.map((item, j) => {
                // Formatting for bold text in list items (simple detection of "Bold:" pattern)
                const parts = item.split(" — ");
                const hasDash = parts.length > 1;

                return (
                  <StaggerItem key={j}>
                    <li className="text-muted-foreground list-disc list-inside">
                      {hasDash ? (
                        <>
                          <strong className="text-foreground">{parts[0]}</strong> — {parts.slice(1).join(" — ")}
                        </>
                      ) : (
                        item
                      )}
                    </li>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          )}

          {sub.note && (
            <ScrollReveal>
              <div className="bg-muted/50 rounded-lg p-4 border border-border mt-3">
                <p className="text-muted-foreground text-sm">
                  {sub.note}
                </p>
              </div>
            </ScrollReveal>
          )}
        </div>
      ))}

      {section.warning && (
        <ScrollReveal>
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mt-4">
            <p className="text-sm text-foreground font-medium flex items-center gap-2">
              <Warning className="w-4 h-4 text-destructive" weight="duotone" />
              Warning
            </p>
            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
              {section.warning}
            </p>
          </div>
        </ScrollReveal>
      )}

      {section.recommendation && (
        <ScrollReveal>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-4">
            <p className="text-sm text-foreground font-medium flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" weight="duotone" />
              Recommendation
            </p>
            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
              {section.recommendation}
            </p>
          </div>
        </ScrollReveal>
      )}
    </section>
  );
}

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | ZakatFlow</title>
        <meta name="description" content="Privacy Policy for ZakatFlow - Learn how we protect your financial data with end-to-end encryption." />
        <link rel="canonical" href={getPrimaryUrl('/privacy')} />
        <meta property="og:url" content={getPrimaryUrl('/privacy')} />
      </Helmet>

      <ReadingProgress />

      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <ScrollReveal>
            <Link to="/">
              <Button variant="ghost" size="sm" className="mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Calculator
              </Button>
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <header className="mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 font-serif">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground">Last updated: December 28, 2025</p>
            </header>
          </ScrollReveal>

          <div className="space-y-10">
            <ScrollReveal delay={0.15}>
              <HighlightSection />
            </ScrollReveal>

            {privacySections.map((section, index) => (
              <SectionRenderer key={section.id} section={section} index={index} />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
