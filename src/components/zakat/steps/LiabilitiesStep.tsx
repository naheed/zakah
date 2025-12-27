import { ZakatFormData } from "@/lib/zakatCalculations";
import { StepHeader } from "../StepHeader";
import { CurrencyInput } from "../CurrencyInput";
import { InfoCard } from "../InfoCard";

interface LiabilitiesStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
}

export function LiabilitiesStep({ data, updateData }: LiabilitiesStepProps) {
  return (
    <div className="max-w-xl">
      <StepHeader
        emoji="🚑"
        title="Expenses & Liabilities"
        subtitle="Deductions that reduce your Zakatable amount"
      />
      
      <div className="space-y-8">
        <InfoCard variant="info">
          <p>
            When calculating your Zakat, you can reduce your assets by living expenses, 
            bills that are <strong>immediately due</strong>, and money you owe to others. 
            Only include upcoming payments, not total loan balances.
          </p>
        </InfoCard>
        
        <CurrencyInput
          label="🍔 This Month's Living Expenses"
          description="Rent/mortgage, medical expenses, utilities, groceries, transport, upkeep, etc."
          value={data.monthlyLivingExpenses}
          onChange={(value) => updateData({ monthlyLivingExpenses: value })}
        />
        
        <div className="space-y-4">
          <CurrencyInput
            label="🚗 Periodic Insurance Expenses"
            description="Home, auto, medical, or other insurance payments due"
            value={data.insuranceExpenses}
            onChange={(value) => updateData({ insuranceExpenses: value })}
          />
          
          <InfoCard variant="tip">
            <p>
              If you pay monthly, deduct the monthly payment. If you pay quarterly or 
              semi-annually, deduct that period's payment.
            </p>
          </InfoCard>
        </div>
        
        <div className="space-y-4">
          <CurrencyInput
            label="💳 Debts You Owe"
            description="Student debts, credit card debts, secondary mortgage payments due"
            value={data.debtsYouOwe}
            onChange={(value) => updateData({ debtsYouOwe: value })}
          />
          
          <InfoCard variant="warning" title="Important">
            <p>
              Only include the <strong>upcoming installment</strong> that is due, even if 
              you plan to pay more. <strong>Primary mortgage payments</strong> should be 
              in Monthly Expenses above, not here.
            </p>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
