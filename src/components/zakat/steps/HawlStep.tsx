import { StepHeader } from "../StepHeader";
import { InfoCard } from "../InfoCard";
import { Calendar } from "lucide-react";

export function HawlStep() {
  return (
    <div className="max-w-2xl">
      <StepHeader
        questionNumber={3}
        title="Understand the Ḥawl"
        subtitle="The Zakat year and when to pay"
      />
      
      <div className="space-y-6">
        <InfoCard variant="info">
          <p>
            The <strong>ḥawl</strong> is the Zakat Year, like a fiscal year, but used to 
            calculate your Zakat. The ḥawl starts when your assets first reached the 
            minimum niṣāb, or when you last paid Zakat.
          </p>
        </InfoCard>
        
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">When is Zakat Due?</h3>
              <p className="text-muted-foreground">
                Once <strong>1 lunar year</strong> (approximately 354 days) has passed, 
                and your assets have been consistently above the niṣāb, you pay Zakat 
                on your assets at that point.
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-accent rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-1">Lunar Year</h4>
            <p className="text-sm text-muted-foreground">
              354 days • Traditional Islamic calendar
            </p>
            <p className="text-lg font-semibold text-primary mt-2">2.5% Rate</p>
          </div>
          <div className="bg-accent rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-1">Solar Year</h4>
            <p className="text-sm text-muted-foreground">
              365 days • Gregorian calendar
            </p>
            <p className="text-lg font-semibold text-primary mt-2">2.577% Rate</p>
          </div>
        </div>
        
        <InfoCard variant="tip" title="Choosing Your Zakat Date">
          <p>
            Many Muslims choose to pay Zakat during Ramadan for the extra blessings, 
            or on the anniversary of when they first exceeded the niṣāb. Pick a date 
            that's easy to remember and stick with it.
          </p>
        </InfoCard>
      </div>
    </div>
  );
}
