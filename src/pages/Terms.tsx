import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Warning } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/zakat/Footer";
import { getPrimaryUrl } from "@/lib/domainConfig";
import { ReadingProgress } from "@/components/ui/reading-progress";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { AnimatedSectionHeader } from "@/components/ui/animated-section-header";
import { termsSections } from "@/lib/content/terms";

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | ZakatFlow</title>
        <meta name="description" content="Terms of Service for the ZakatFlow application." />
        <link rel="canonical" href={getPrimaryUrl('/terms')} />
        <meta property="og:url" content={getPrimaryUrl('/terms')} />
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
                Terms of Service
              </h1>
              <p className="text-muted-foreground">Last updated: December 27, 2025</p>
            </header>
          </ScrollReveal>

          <div className="space-y-10">

            {/* Important Notice */}
            <ScrollReveal delay={0.15}>
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Warning className="w-5 h-5 text-destructive" weight="duotone" />
                  Important Disclaimer
                </h2>
                <p className="text-sm text-muted-foreground">
                  This calculator provides estimates for educational purposes only. It is <strong className="text-foreground">not a
                    substitute for consultation with qualified Islamic scholars</strong> regarding your
                  specific Zakat obligations. The calculations are based on general interpretations and
                  may not reflect the specific rulings applicable to your situation.
                </p>
              </div>
            </ScrollReveal>

            {termsSections.map((section, index) => (
              <section key={section.id} id={section.id}>
                <AnimatedSectionHeader number={section.number} title={section.title} />

                {section.content && (
                  <ScrollReveal>
                    <p className="text-muted-foreground mb-4">
                      {section.disclaimer ? (
                        <>
                          <strong className="text-foreground">{section.disclaimer.strong}</strong>
                          {section.content.replace(section.disclaimer.strong, "")}
                        </>
                      ) : (
                        section.content
                      )}
                    </p>
                  </ScrollReveal>
                )}

                {section.listItems && (
                  <StaggerContainer className="ml-4" staggerDelay={0.05}>
                    {section.listItems.map((item, i) => {
                      // Formatting for bold text in list items (simple detection of "Title: description" pattern)
                      const parts = item.split(": ");
                      const hasTitle = parts.length > 1 && !item.startsWith("Email"); // Avoid bolding email

                      return (
                        <StaggerItem key={i}>
                          <li className="text-muted-foreground list-disc list-inside">
                            {hasTitle ? (
                              <>
                                <strong className="text-foreground">{parts[0]}:</strong> {parts.slice(1).join(": ")}
                              </>
                            ) : (
                              // Special check for Email to make it a link
                              item.startsWith("Email:") ? (
                                <>
                                  <strong className="text-foreground">Email:</strong>{" "}
                                  <a href="mailto:naheed@vora.dev" className="text-primary hover:underline">
                                    {item.replace("Email: ", "")}
                                  </a>
                                </>
                              ) : (
                                item
                              )
                            )}
                          </li>
                        </StaggerItem>
                      );
                    })}
                  </StaggerContainer>
                )}
              </section>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
