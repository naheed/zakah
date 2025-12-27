import { ZakatFormData } from "@/lib/zakatCalculations";
import { StepHeader } from "../StepHeader";
import { CurrencyInput } from "../CurrencyInput";
import { InfoCard } from "../InfoCard";

interface DebtOwedToYouStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
}

export function DebtOwedToYouStep({ data, updateData }: DebtOwedToYouStepProps) {
  return (
    <div className="max-w-xl">
      <StepHeader
        emoji="🤝"
        title="Debt Owed to You"
        subtitle="Money others owe you"
      />
      
      <div className="space-y-8">
        <InfoCard variant="info">
          <p>
            Include money that is owed to you that you <strong>expect to collect</strong>. 
            This is called "good debt" (dayn qawiyy) — the borrower is willing and able to pay.
          </p>
        </InfoCard>
        
        <CurrencyInput
          label="💰 Debt Owed to You"
          description="Total amount of collectible debts owed to you by others"
          value={data.debtOwedToYou}
          onChange={(value) => updateData({ debtOwedToYou: value })}
        />
        
        <InfoCard variant="warning" title="Bad Debts">
          <p>
            If the borrower is delinquent, bankrupt, or denying the debt, <strong>do not 
            include it</strong>. You only pay Zakat on bad debt once it's actually recovered, 
            for one year only.
          </p>
        </InfoCard>
      </div>
    </div>
  );
}
