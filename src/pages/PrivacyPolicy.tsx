
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { content as c, HighlightItem, SectionContent } from "@/content";
import { ArticleLayout } from "@/components/layout/ArticleLayout";
import { Text, Heading, List, ListItem } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck } from "@phosphor-icons/react";

const HighlightSection: React.FC<{ highlights: HighlightItem[] }> = ({ highlights }) => (
  <StaggerContainer className="grid gap-4 mt-8" staggerDelay={0.1}>
    {highlights.map((item, index) => (
      <StaggerItem key={index}>
        <div className="flex items-start gap-3 text-muted-foreground p-3 rounded-lg bg-primary/5 border border-primary/10">
          <item.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" weight="duotone" />
          <span className="text-sm">{item.text}</span>
        </div>
      </StaggerItem>
    ))}
  </StaggerContainer>
);

const SectionRenderer: React.FC<{ section: SectionContent; index: number }> = ({ section, index }) => (
  <section id={section.id} className="scroll-mt-24">
    <ScrollReveal>
      <div className="flex items-center gap-3 mb-4">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
          {index + 1}
        </span>
        <Heading level={2} className="mt-0 mb-0">{section.title}</Heading>
      </div>
    </ScrollReveal>

    <div className="pl-11 space-y-4">
      {section.content && <Text>{section.content}</Text>}

      {section.listItems && (
        <StaggerContainer>
          <List>
            {section.listItems.map((item, idx) => (
              <StaggerItem key={idx} as="li" className="pl-2">
                {item}
              </StaggerItem>
            ))}
          </List>
        </StaggerContainer>
      )}

      {section.subsections && (
        <div className="space-y-6 mt-6">
          {section.subsections.map((sub, idx) => (
            <div key={idx}>
              {sub.title && <Heading level={3}>{sub.title}</Heading>}
              {sub.content && <Text>{sub.content}</Text>}

              {sub.listItems && (
                <StaggerContainer>
                  <List>
                    {sub.listItems.map((li, k) => (
                      <StaggerItem key={k} as="li" className="pl-2">{li}</StaggerItem>
                    ))}
                  </List>
                </StaggerContainer>
              )}
              {sub.note && (
                <div className="mt-2 p-3 bg-muted/30 rounded border border-border text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Note:</span> {sub.note}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {section.note && (
        <div className="mt-4 p-3 bg-muted/30 rounded border border-border text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Note:</span> {section.note}
        </div>
      )}

      {section.warning && (
        <ScrollReveal>
          <div className="mt-4 p-4 rounded-lg bg-tertiary/10 border border-tertiary/20 text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="text-tertiary text-lg">⚠️</span>
              <p className="text-sm">{section.warning}</p>
            </div>
          </div>
        </ScrollReveal>
      )}
    </div>
    <Separator className="mt-8" />
  </section>
);

const PrivacyPolicy = () => {
  const { privacyHighlights, privacySections } = c.privacy;

  const header = {
    title: "Privacy Policy",
    lastUpdated: c.common.legal.lastUpdated,
    icon: ShieldCheck
  };

  const headerContent = (
    <div>
      <Text className="text-sm">Last updated: {header.lastUpdated}</Text>
      <ScrollReveal delay={0.2}>
        <div className="mt-8 p-6 rounded-2xl bg-muted/30 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <header.icon className="w-5 h-5 text-primary" weight="duotone" />
            <h2 className="font-semibold text-foreground">Key Privacy Highlights</h2>
          </div>
          <HighlightSection highlights={privacyHighlights} />
        </div>
      </ScrollReveal>
    </div>
  );
  // Generate ToC items from sections
  const tocItems = privacySections.map((section, index) => ({
    id: section.id,
    label: section.title,
    number: index + 1
  }));

  return (
    <ArticleLayout
      title={header.title}
      description="Privacy Policy for ZakatFlow - We collect minimal data and use zero-knowledge encryption."
      urlPath="/privacy"
      headerContent={headerContent}
      tocItems={tocItems}
    >
      {privacySections.map((section, index) => (
        <SectionRenderer key={section.id} section={section} index={index} />
      ))}
    </ArticleLayout>
  );
};

export default PrivacyPolicy;
