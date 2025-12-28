import { ClipboardList, BarChart3, FileText } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Answer a few questions",
    description: "Tell us about your assets, investments, and debts",
  },
  {
    icon: BarChart3,
    title: "See your breakdown",
    description: "Visual flow of how your wealth maps to Zakat",
  },
  {
    icon: FileText,
    title: "Export your report",
    description: "Download a PDF for your records or advisor",
  },
];

export function HowItWorks() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-foreground text-center mb-8">
          How It Works
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center">
              {/* Connector line - hidden on mobile */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-border" />
              )}
              
              {/* Step number badge */}
              <div className="relative mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
              </div>
              
              <h3 className="font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
