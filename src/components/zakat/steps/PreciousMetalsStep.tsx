import { ZakatFormData } from "@/lib/zakatCalculations";
import { preciousMetalsContent } from "@/lib/zakatContent";
import { QuestionLayout } from "../QuestionLayout";
import { CurrencyInput } from "../CurrencyInput";

interface PreciousMetalsStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
}

export function PreciousMetalsStep({ data, updateData }: PreciousMetalsStepProps) {
  return (
    <QuestionLayout content={preciousMetalsContent}>
      <CurrencyInput
        label="Gold Value"
        description="Melt value of gold items (not gemstones or craftsmanship)"
        value={data.goldValue}
        onChange={(value) => updateData({ goldValue: value })}
      />
      
      <CurrencyInput
        label="Silver Value"
        description="Melt value of silver items"
        value={data.silverValue}
        onChange={(value) => updateData({ silverValue: value })}
      />
    </QuestionLayout>
  );
}
