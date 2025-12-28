import { ClipboardList, BarChart3, FileText } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Answer questions",
    description: "Tell us about your assets and debts",
  },
  {
    icon: BarChart3,
    title: "See breakdown",
    description: "Visual flow of your wealth to Zakat",
  },
  {
    icon: FileText,
    title: "Export report",
    description: "Download PDF for your records",
  },
];

export function HowItWorks() {
  return (
    <section className="py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-lg font-semibold text-foreground text-center mb-6">
          How It Works
        </h2>
        
        <div className="grid grid-cols-3 gap-4">
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center">
              {/* Connector line - hidden on mobile */}
              {index < steps.length - 1 && (
                <div className="hidden sm:block absolute top-5 left-[calc(50%+1.5rem)] w-[calc(100%-3rem)] h-px bg-border" />
              )}
              
              {/* Step number badge */}
              <div className="relative mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <step.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary text-primary-foreground text-[10px] sm:text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
              </div>
              
              <h3 className="font-medium text-foreground text-xs sm:text-sm mb-1">
                {step.title}
              </h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed hidden sm:block">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
