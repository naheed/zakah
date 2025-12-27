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
            <strong>Only IMMEDIATE debts</strong> due within the Zakat period are deductible. 
            This is based on the AMJA/Bradford fatwa. Long-term debts (like a 30-year mortgage 
            balance) are NOT fully deductible.
          </p>
        </InfoCard>
        
        <CurrencyInput
          label="🍔 This Month's Living Expenses"
          description="Rent/mortgage, medical expenses, utilities, groceries, transport, upkeep, etc."
          value={data.monthlyLivingExpenses}
          onChange={(value) => updateData({ monthlyLivingExpenses: value })}
        />
        
        <CurrencyInput
          label="🏠 Monthly Mortgage/Rent Payment"
          description="Your monthly housing payment. We'll deduct 12 months per the AMJA opinion."
          value={data.monthlyMortgage}
          onChange={(value) => updateData({ monthlyMortgage: value })}
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
            label="💳 Credit Card Balance"
            description="Total credit card balance due immediately"
            value={data.creditCardBalance}
            onChange={(value) => updateData({ creditCardBalance: value })}
          />
        </div>
        
        <CurrencyInput
          label="📋 Unpaid Bills"
          description="Utility, medical, or other bills currently due"
          value={data.unpaidBills}
          onChange={(value) => updateData({ unpaidBills: value })}
        />
        
        <div className="space-y-4">
          <CurrencyInput
            label="🎓 Student Loan Payments Due"
            description="Only the upcoming installment that is due, not total loan balance"
            value={data.studentLoansDue}
            onChange={(value) => updateData({ studentLoansDue: value })}
          />
          
          <InfoCard variant="warning" title="Important: Non-Deductible Debts">
            <ul className="list-disc pl-4 space-y-1 text-sm">
              <li>Remaining mortgage principal (only 12 months deductible)</li>
              <li>Student loans not currently due (deferred)</li>
              <li>401(k) loans (you owe this to yourself)</li>
            </ul>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
