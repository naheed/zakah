import { StepHeader } from "../StepHeader";
import { InfoCard } from "../InfoCard";
import { Users } from "lucide-react";

export function FamilyStep() {
  return (
    <div className="max-w-2xl">
      <StepHeader
        questionNumber={4}
        title="You, Your Spouse, & Children"
        subtitle="Who needs to pay Zakat?"
      />
      
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Individual Obligation</h3>
              <p className="text-muted-foreground">
                Zakat is due by <strong>any person who owns the wealth</strong>, whether 
                man, woman, or child, if they possess above the niṣāb.
              </p>
            </div>
          </div>
        </div>
        
        <InfoCard variant="info" title="Paying on Behalf of Family">
          <p>
            If you choose, you can pay Zakat on behalf of your family. In this case, 
            make sure to <strong>sum the total for each individual</strong> in the 
            following questions.
          </p>
        </InfoCard>
        
        <div className="bg-accent rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2">Example</h4>
          <p className="text-sm text-muted-foreground">
            If your spouse has $5,000 in savings and you have $10,000, and you're 
            calculating together, you would enter $15,000 for savings accounts.
          </p>
        </div>
        
        <InfoCard variant="tip">
          <p>
            Children's assets (like custodial accounts or trusts in their name) are 
            also subject to Zakat if above the niṣāb. A parent or guardian typically 
            pays on their behalf.
          </p>
        </InfoCard>
      </div>
    </div>
  );
}
