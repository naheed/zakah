import { ZakatFormData } from "@/lib/zakatCalculations";
import { illiquidAssetsContent } from "@/lib/zakatContent";
import { QuestionLayout } from "../QuestionLayout";
import { CurrencyInput } from "../CurrencyInput";

interface IlliquidAssetsStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
}

export function IlliquidAssetsStep({ data, updateData }: IlliquidAssetsStepProps) {
  return (
    <QuestionLayout content={illiquidAssetsContent}>
      <CurrencyInput
        label="Illiquid Assets Value"
        description="Art, antiques, collectibles held for sale"
        value={data.illiquidAssetsValue}
        onChange={(value) => updateData({ illiquidAssetsValue: value })}
      />
      
      <CurrencyInput
        label="Livestock Value"
        description="Animals raised for sale"
        value={data.livestockValue}
        onChange={(value) => updateData({ livestockValue: value })}
      />
    </QuestionLayout>
  );
}
