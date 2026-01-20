
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { content as c, TermSection } from "@/content";
import { ArticleLayout } from "@/components/layout/ArticleLayout";
import { Heading, Text, List, ListItem } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";

const TermRenderer = ({ section }: { section: TermSection }) => {
  // Helper to bold specific keys in list items
  const renderListItem = (text: string) => {
    const parts = text.split(':');
    if (parts.length > 1) {
      return (
        <span>
          <strong className="text-foreground">{parts[0]}:</strong>
          {parts.slice(1).join(':')}
        </span>
      );
    }
    // Handle email links
    if (text.includes('Email:')) {
      const [label, email] = text.split(': ');
      return (
        <span>
          {label}: <a href={`mailto:${email}`} className="text-foreground hover:text-primary underline decoration-primary/50 hover:decoration-primary transition-colors">{email}</a>
        </span>
      );
    }
    return text;
  };

  return (
    <section id={section.id} className="scroll-mt-24">
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground font-bold text-sm">
            {section.number}
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
                  {renderListItem(item)}
                </StaggerItem>
              ))}
            </List>
          </StaggerContainer>
        )}

        {section.disclaimer && (
          <ScrollReveal>
            <div className="mt-4 p-4 rounded-lg bg-tertiary-container border border-tertiary-container/20 text-tertiary-on-container">
              <div className="flex items-start gap-2">
                <section.icon className="w-5 h-5 text-tertiary shrink-0 mt-0.5" weight="duotone" />
                <p className="text-sm">
                  <strong className="text-foreground block mb-1">{section.disclaimer.strong}</strong>
                  {section.disclaimer.text.replace(section.disclaimer.strong, "")}
                </p>
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
      <Separator className="mt-8" />
    </section>
  );
};

const Terms = () => {
  const { termsSections } = c.terms;
  const headerContent = (
    <Text className="text-sm">Last updated: December 28, 2025</Text>
  );

  // Generate ToC items from sections
  const tocItems = termsSections.map((section) => ({
    id: section.id,
    label: section.title,
    number: section.number
  }));

  return (
    <ArticleLayout
      title="Terms of Service"
      description="Terms of Service for ZakatFlow - Guidelines for usage, responsibilities, and disclaimers."
      urlPath="/terms"
      headerContent={headerContent}
      tocItems={tocItems}
    >
      {termsSections.map((section) => (
        <TermRenderer key={section.id} section={section} />
      ))}
    </ArticleLayout>
  );
};

export default Terms;
