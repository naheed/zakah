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
            Islamic jurisprudence distinguishes between <strong>"Good Debt" (Dayn Qawiyy)</strong> and 
            <strong> "Bad Debt" (Dayn Da'if)</strong>. Only good debt is treated as Zakatable 
            wealth annually.
          </p>
        </InfoCard>
        
        <div className="space-y-4">
          <CurrencyInput
            label="💰 Good Debt Owed to You"
            description="Money owed by borrowers who are willing and able to pay. You can collect this at will."
            value={data.goodDebtOwedToYou}
            onChange={(value) => updateData({ goodDebtOwedToYou: value })}
          />
          
          <InfoCard variant="tip" title="Good Debt (Dayn Qawiyy)">
            <p>
              This is like cash in your pocket. The borrower is reliable, and you could 
              request repayment at any time. Include personal loans you've given where 
              repayment is expected.
            </p>
          </InfoCard>
        </div>
        
        <div className="space-y-4">
          <CurrencyInput
            label="💸 Bad Debt Recovered This Year"
            description="Money from previously uncollectible debts that you actually recovered this year"
            value={data.badDebtRecovered}
            onChange={(value) => updateData({ badDebtRecovered: value })}
          />
          
          <InfoCard variant="warning" title="Bad Debt (Dayn Da'if)">
            <p>
              If the borrower is <strong>delinquent, bankrupt, or denying the debt</strong>, 
              do not include it in Good Debt. You only pay Zakat on bad debt once it's 
              actually recovered, and for <strong>one year only</strong> (even if the debt 
              was outstanding for ten years).
            </p>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
