import { ZakatFormData } from "@/lib/zakatCalculations";
import { StepHeader } from "../StepHeader";
import { CurrencyInput } from "../CurrencyInput";
import { InfoCard } from "../InfoCard";

interface IlliquidAssetsStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
}

export function IlliquidAssetsStep({ data, updateData }: IlliquidAssetsStepProps) {
  return (
    <div className="max-w-xl">
      <StepHeader
        emoji="🖼️"
        title="Illiquid Assets & Livestock"
        subtitle="Collectibles, art, and animals held for sale"
      />
      
      <div className="space-y-8">
        <InfoCard variant="info">
          <p>
            Illiquid assets like art, antiques, and collectibles are only Zakatable 
            if purchased with the <strong>intention to resell for profit</strong>. 
            Personal items are exempt.
          </p>
        </InfoCard>
        
        <CurrencyInput
          label="🖼️ Illiquid Assets Value"
          description="Market value of art, antiques, collectibles, etc. held for sale"
          value={data.illiquidAssetsValue}
          onChange={(value) => updateData({ illiquidAssetsValue: value })}
        />
        
        <div className="space-y-4">
          <CurrencyInput
            label="🐄 Livestock Value"
            description="Value of livestock held for sale or breeding for sale"
            value={data.livestockValue}
            onChange={(value) => updateData({ livestockValue: value })}
          />
          
          <InfoCard variant="tip" title="Livestock Rules">
            <p>
              Traditional Zakat on livestock (camels, cattle, sheep) has specific niṣāb 
              thresholds and rates. If you have significant livestock holdings, consult 
              a scholar for detailed calculations.
            </p>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
