import { ZakatFormData } from "@/lib/zakatCalculations";
import { StepHeader } from "../StepHeader";
import { CurrencyInput } from "../CurrencyInput";
import { InfoCard } from "../InfoCard";

interface TaxStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
}

export function TaxStep({ data, updateData }: TaxStepProps) {
  return (
    <div className="max-w-xl">
      <StepHeader
        emoji="📋"
        title="Taxes & Fines"
        subtitle="Property taxes, late payments, and penalties"
      />
      
      <div className="space-y-8">
        <InfoCard variant="info">
          <p>
            Taxes and fines that are <strong>currently due</strong> can be deducted 
            from your Zakatable wealth.
          </p>
        </InfoCard>
        
        <CurrencyInput
          label="🏠 Property Tax Due"
          description="Property tax payments that are currently due"
          value={data.propertyTax}
          onChange={(value) => updateData({ propertyTax: value })}
        />
        
        <CurrencyInput
          label="⚠️ Late Tax Payments or Fines"
          description="Any overdue taxes, penalties, or fines you owe"
          value={data.lateTaxPayments}
          onChange={(value) => updateData({ lateTaxPayments: value })}
        />
      </div>
    </div>
  );
}
