import { ZakatFormData } from "@/lib/zakatCalculations";
import { StepHeader } from "../StepHeader";
import { CurrencyInput } from "../CurrencyInput";
import { InfoCard } from "../InfoCard";

interface RealEstateStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
}

export function RealEstateStep({ data, updateData }: RealEstateStepProps) {
  return (
    <div className="max-w-xl">
      <StepHeader
        emoji="🏘️"
        title="Real Estate for Business"
        subtitle="Investment properties and real estate for sale"
      />
      
      <div className="space-y-8">
        <InfoCard variant="info">
          <p>
            Your <strong>primary residence is exempt</strong> from Zakat. Only include 
            properties purchased with the intention to sell for profit, or rental income 
            you've accumulated.
          </p>
        </InfoCard>
        
        <CurrencyInput
          label="🏠 Real Estate for Sale"
          description="Market value of properties you intend to sell (flipping)"
          value={data.realEstateForSale}
          onChange={(value) => updateData({ realEstateForSale: value })}
        />
        
        <div className="space-y-4">
          <CurrencyInput
            label="🔑 Rental Property Income"
            description="Accumulated rental income remaining in your accounts"
            value={data.rentalPropertyIncome}
            onChange={(value) => updateData({ rentalPropertyIncome: value })}
          />
          
          <InfoCard variant="tip">
            <p>
              For rental properties you keep long-term, Zakat is only due on the 
              <strong> accumulated rental income</strong> remaining after expenses — 
              not on the property value itself.
            </p>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
