import { ZakatFormData, CalendarType } from "@/lib/zakatCalculations";
import { StepHeader } from "../StepHeader";
import { InfoCard } from "../InfoCard";
import { Calendar } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface HawlStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
}

export function HawlStep({ data, updateData }: HawlStepProps) {
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
              <h3 className="font-semibold text-foreground mb-2">Choose Your Calendar</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Select which calendar you use to track your Zakat year. The rate adjusts accordingly.
              </p>
              
              <RadioGroup
                value={data.calendarType}
                onValueChange={(value) => updateData({ calendarType: value as CalendarType })}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors">
                  <RadioGroupItem value="lunar" id="lunar" />
                  <Label htmlFor="lunar" className="flex-1 cursor-pointer">
                    <span className="font-medium">Lunar Year (Islamic Calendar)</span>
                    <p className="text-sm text-muted-foreground">354 days • 2.5% rate • Traditional</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors">
                  <RadioGroupItem value="solar" id="solar" />
                  <Label htmlFor="solar" className="flex-1 cursor-pointer">
                    <span className="font-medium">Solar Year (Gregorian Calendar)</span>
                    <p className="text-sm text-muted-foreground">365 days • 2.577% rate • Adjusted</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className={`rounded-lg p-4 border-2 transition-colors ${data.calendarType === 'lunar' ? 'bg-primary/10 border-primary' : 'bg-accent border-transparent'}`}>
            <h4 className="font-medium text-foreground mb-1">Lunar Year</h4>
            <p className="text-sm text-muted-foreground">
              354 days • Traditional Islamic calendar
            </p>
            <p className="text-lg font-semibold text-primary mt-2">2.5% Rate</p>
          </div>
          <div className={`rounded-lg p-4 border-2 transition-colors ${data.calendarType === 'solar' ? 'bg-primary/10 border-primary' : 'bg-accent border-transparent'}`}>
            <h4 className="font-medium text-foreground mb-1">Solar Year</h4>
            <p className="text-sm text-muted-foreground">
              365 days • Gregorian calendar
            </p>
            <p className="text-lg font-semibold text-primary mt-2">2.577% Rate</p>
          </div>
        </div>
        
        <InfoCard variant="tip" title="Why the Rate Difference?">
          <p>
            The solar year is 11 days longer than the lunar year. To ensure Zakat recipients 
            aren't shortchanged over a lifetime (33 solar years ≈ 34 lunar years), the rate 
            is adjusted: <strong>2.5% × (365.25/354.37) ≈ 2.577%</strong>
          </p>
        </InfoCard>
        
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
