import { ZakatFormData } from "@/lib/zakatCalculations";
import { StepHeader } from "../StepHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InfoCard } from "../InfoCard";
import { Mail } from "lucide-react";

interface EmailStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
}

export function EmailStep({ data, updateData }: EmailStepProps) {
  return (
    <div className="max-w-xl">
      <StepHeader
        questionNumber={6}
        title="What's your email address?"
        subtitle="Optional: Save your calculation for future reference"
      />
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-base">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => updateData({ email: e.target.value })}
              placeholder="your@email.com"
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>
        
        <InfoCard variant="tip">
          <p>
            You can send a receipt of your calculation to yourself after this session, 
            so you can save this year's Zakat calculation date and your Zakat amount. 
            All of your data is kept private and secure.
          </p>
        </InfoCard>
        
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <p className="text-lg font-medium text-foreground mb-2">
            Ready to calculate! 💰
          </p>
          <p className="text-muted-foreground">
            Let's get started with the assets that you will be paying Zakat on first. 
            Later, we will cover debts and payments that may reduce your Zakatable amount.
          </p>
        </div>
      </div>
    </div>
  );
}
