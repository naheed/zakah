import { StepContent } from "@/lib/zakatContent";
import { LearnMoreMarkdown } from "./LearnMore";

interface QuestionLayoutProps {
  content: StepContent;
  /** Dynamic question number from wizard - takes precedence over content.questionNumber */
  questionNumber?: number;
  children: React.ReactNode;
}

/**
 * Consistent layout wrapper for all question steps.
 * Provides: question number badge, title, subtitle, optional learn more, and children content.
 */
export function QuestionLayout({ content, questionNumber, children }: QuestionLayoutProps) {
  // Use dynamic question number if provided, otherwise fall back to content
  const displayQuestionNumber = questionNumber ?? content.questionNumber;

  return (
    <div className="max-w-xl">
      {/* Question Header */}
      <div className="mb-6">
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

      {/* Main Content */}
      <div className="space-y-6">
        {children}
      </div>

      {/* Learn More Section */}
      {content.learnMore && (
        <div className="mt-6">
          <LearnMoreMarkdown
            title={content.learnMore.title}
            content={content.learnMore.content}
          />
        </div>
      )}

      {/* Tips Section */}
      {content.tips && content.tips.length > 0 && (
        <div className="mt-4 space-y-3">
          {content.tips.map((tip, index) => (
            <LearnMoreMarkdown
              key={index}
              title={tip.title || "Tip"}
              content={tip.content}
              variant="tip"
            />
          ))}
        </div>
      )}
    </div>
  );
}
