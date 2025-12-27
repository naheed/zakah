interface StepHeaderProps {
  questionNumber?: number;
  emoji?: string;
  title: string;
  subtitle?: string;
}

export function StepHeader({ questionNumber, emoji, title, subtitle }: StepHeaderProps) {
  return (
    <div className="space-y-2 mb-8">
      {questionNumber && (
        <span className="text-sm font-medium text-muted-foreground">
          Question {questionNumber}
        </span>
      )}
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">
        {emoji && <span className="mr-2">{emoji}</span>}
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
