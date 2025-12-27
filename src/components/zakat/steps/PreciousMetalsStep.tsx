import { ZakatFormData } from "@/lib/zakatCalculations";
import { StepHeader } from "../StepHeader";
import { CurrencyInput } from "../CurrencyInput";
import { InfoCard } from "../InfoCard";

interface PreciousMetalsStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
}

export function PreciousMetalsStep({ data, updateData }: PreciousMetalsStepProps) {
  return (
    <div className="max-w-xl">
      <StepHeader
        emoji="💍"
        title="Precious Metals"
        subtitle="Gold, silver, and other precious metals"
      />
      
      <div className="space-y-8">
        <InfoCard variant="info">
          <p>
            For gold and silver jewelry that you <strong>regularly wear</strong>, the majority 
            of scholars consider it exempt. However, gold and silver kept as investment or 
            rarely worn should be included here using the <strong>melt value</strong> 
            (scrap value of the metal content only).
          </p>
        </InfoCard>
        
        <CurrencyInput
          label="🥇 Gold Value"
          description="Total melt value of gold items (not including gemstones or craftsmanship)"
          value={data.goldValue}
          onChange={(value) => updateData({ goldValue: value })}
        />
        
        <CurrencyInput
          label="🥈 Silver Value"
          description="Total melt value of silver items (not including gemstones or craftsmanship)"
          value={data.silverValue}
          onChange={(value) => updateData({ silverValue: value })}
        />
        
        <InfoCard variant="tip" title="Hanafi View">
          <p>
            The Hanafi school holds that all gold and silver is Zakatable regardless 
            of usage. If you follow this opinion, include all your gold and silver 
            jewelry here.
          </p>
        </InfoCard>
      </div>
    </div>
  );
}
