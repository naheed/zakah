import { ZakatFormData } from "@/lib/zakatCalculations";
import { StepHeader } from "../StepHeader";
import { CurrencyInput } from "../CurrencyInput";

interface LiquidAssetsStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
}

export function LiquidAssetsStep({ data, updateData }: LiquidAssetsStepProps) {
  return (
    <div className="max-w-xl">
      <StepHeader
        emoji="💰"
        title="Zakatable Assets"
        subtitle="Let's start with your liquid assets"
      />
      
      <div className="space-y-8">
        <CurrencyInput
          label="💵 Checking Accounts"
          description="What is the total value of all of your checking account(s)?"
          value={data.checkingAccounts}
          onChange={(value) => updateData({ checkingAccounts: value })}
        />
        
        <CurrencyInput
          label="👛 Savings Accounts"
          description="What is the total value of all of your savings account(s)?"
          value={data.savingsAccounts}
          onChange={(value) => updateData({ savingsAccounts: value })}
        />
        
        <CurrencyInput
          label="💸 Cash on Hand"
          description="What is the total value of your physical cash on hand/wallet?"
          value={data.cashOnHand}
          onChange={(value) => updateData({ cashOnHand: value })}
        />
      </div>
    </div>
  );
}
