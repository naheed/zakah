import { StepContent } from "@/content/steps";
import { LearnMoreMarkdown } from "./LearnMore";
import { BalancedTips } from "./BalancedTip";
import { QuestionIntroBar } from "./QuestionIntroBar";
import { Madhab } from "@/lib/zakatTypes";

interface QuestionLayoutProps {
  content: StepContent;
  /** Dynamic question number from wizard - takes precedence over content.questionNumber */
  questionNumber?: number;
  /** User's selected methodology for methodology-aware content */
  madhab?: Madhab;
  children: React.ReactNode;
}

/**
 * Consistent layout wrapper for all question steps.
 * Implements 3-tier content model:
 * - Tier 1: QuestionIntroBar (methodology-specific, always visible)
 * - Tier 2: BalancedTips (contextual, expandable)
 * - Tier 3: LearnMore (deep dive, collapsible)
 */
export function QuestionLayout({ content, questionNumber, madhab = 'bradford', children }: QuestionLayoutProps) {
  // Use dynamic question number if provided, otherwise fall back to content
  const displayQuestionNumber = questionNumber ?? content.questionNumber;

  // Transform tips to BalancedTips format (handle legacy content field)
  const balancedTips = content.tips?.map(tip => ({
    summary: tip.summary || tip.content || '',
    details: tip.details,
    source: tip.source,
    variant: tip.variant,
  })).filter(t => t.summary);

  return (
    <div className="max-w-xl">
      {/* Question Header */}
      <div className="mb-4">
        {displayQuestionNumber && (
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
              Question {displayQuestionNumber}
            </span>
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-2 tracking-tight">
          {content.title}
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          {content.subtitle}
        </p>
      </div>

      {/* TIER 1: Methodology Intro Bar */}
      {content.introByMethodology && (
        <QuestionIntroBar content={content} madhab={madhab} className="mb-6" />
      )}

      {/* TIER 2: Contextual Tips */}
      {balancedTips && balancedTips.length > 0 && (
        <div className="mb-6">
          <BalancedTips tips={balancedTips} />
        </div>
      )}

      {/* Main Content (Form Inputs) */}
      <div className="space-y-6">
        {children}
      </div>

      {/* TIER 3: Deep Dive */}
      {content.learnMore && (
        <div className="mt-6">
          <LearnMoreMarkdown
            title={content.learnMore.title}
            content={content.learnMore.content}
          />
        </div>
      )}
    </div>
  );
}
