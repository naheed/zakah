import { ZakatFormData } from "@/lib/zakatCalculations";
import { StepHeader } from "../StepHeader";
import { CurrencyInput } from "../CurrencyInput";
import { InfoCard } from "../InfoCard";

interface BusinessStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
}

export function BusinessStep({ data, updateData }: BusinessStepProps) {
  return (
    <div className="max-w-xl">
      <StepHeader
        emoji="🏪"
        title="Business Ownership"
        subtitle="Business assets and inventory"
      />
      
      <div className="space-y-8">
        <InfoCard variant="info">
          <p>
            For businesses, Zakat is due on <strong>liquid assets and inventory</strong> — 
            not on fixed assets like buildings, equipment, or furniture.
          </p>
        </InfoCard>
        
        <CurrencyInput
          label="💵 Cash & Receivables"
          description="Business cash on hand plus accounts receivable you expect to collect"
          value={data.businessCashAndReceivables}
          onChange={(value) => updateData({ businessCashAndReceivables: value })}
        />
        
        <div className="space-y-4">
          <CurrencyInput
            label="📦 Inventory"
            description="Value of inventory/merchandise held for sale"
            value={data.businessInventory}
            onChange={(value) => updateData({ businessInventory: value })}
          />
          
          <InfoCard variant="tip" title="Manufacturing Businesses">
            <p>
              Include finished goods and raw materials. Work-in-progress can be 
              included at cost or market value, whichever is lower.
            </p>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
