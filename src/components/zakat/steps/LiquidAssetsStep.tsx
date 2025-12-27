import { ZakatFormData } from "@/lib/zakatCalculations";
import { StepHeader } from "../StepHeader";
import { CurrencyInput } from "../CurrencyInput";
import { InfoCard } from "../InfoCard";
import { DocumentUpload } from "../DocumentUpload";

interface LiquidAssetsStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
}

export function LiquidAssetsStep({ data, updateData }: LiquidAssetsStepProps) {
  const handleDataExtracted = (extractedData: Partial<ZakatFormData>) => {
    // Merge extracted data with existing data (don't overwrite with 0s)
    const updates: Partial<ZakatFormData> = {};
    const fields = ['checkingAccounts', 'savingsAccounts', 'cashOnHand', 'digitalWallets', 'foreignCurrency', 'interestEarned'] as const;
    
    for (const field of fields) {
      if (extractedData[field] && extractedData[field]! > 0) {
        updates[field] = (data[field] || 0) + extractedData[field]!;
      }
    }
    
    if (Object.keys(updates).length > 0) {
      updateData(updates);
    }
  };

  return (
    <div className="max-w-xl">
      <StepHeader
        emoji="💰"
        title="Zakatable Assets"
        subtitle="Let's start with your liquid assets"
      />
      
      <div className="space-y-8">
        <DocumentUpload
          onDataExtracted={handleDataExtracted}
          label="Upload Bank Statement"
          description="Upload a bank statement to auto-fill your account balances"
        />
        <CurrencyInput
          label="💵 Checking Accounts"
          description="What is the total value of all of your checking account(s)?"
          value={data.checkingAccounts}
          onChange={(value) => updateData({ checkingAccounts: value })}
        />
        
        <CurrencyInput
          label="👛 Savings Accounts"
          description="What is the total value of all of your savings account(s)? (Exclude any interest earned)"
          value={data.savingsAccounts}
          onChange={(value) => updateData({ savingsAccounts: value })}
        />
        
        <CurrencyInput
          label="💸 Cash on Hand"
          description="What is the total value of your physical cash on hand/wallet?"
          value={data.cashOnHand}
          onChange={(value) => updateData({ cashOnHand: value })}
        />
        
        <CurrencyInput
          label="📱 Digital Wallets"
          description="PayPal, Venmo, CashApp, Zelle, and other digital payment balances"
          value={data.digitalWallets}
          onChange={(value) => updateData({ digitalWallets: value })}
        />
        
        <CurrencyInput
          label="🌍 Foreign Currency"
          description="Value of foreign currencies converted to your functional currency at today's spot rate"
          value={data.foreignCurrency}
          onChange={(value) => updateData({ foreignCurrency: value })}
        />
        
        <div className="space-y-4">
          <CurrencyInput
            label="⚠️ Interest Earned (For Purification)"
            description="Total interest earned this year. This is NOT Zakatable but must be purified (donated to charity without reward expectation)"
            value={data.interestEarned}
            onChange={(value) => updateData({ interestEarned: value })}
          />
          
          <InfoCard variant="warning" title="Interest (Riba) Purification">
            <p>
              According to Islamic law, interest is <strong>not considered owned wealth</strong>. 
              You cannot pay Zakat on interest, nor with interest. This amount will be shown 
              separately for you to donate to general charity.
            </p>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
