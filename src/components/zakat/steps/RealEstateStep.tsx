import { ZakatFormData } from "@/lib/zakatCalculations";
import { realEstateContent } from "@/lib/zakatContent";
import { QuestionLayout } from "../QuestionLayout";
import { CurrencyInput } from "../CurrencyInput";

interface RealEstateStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
}

export function RealEstateStep({ data, updateData }: RealEstateStepProps) {
  return (
    <QuestionLayout content={realEstateContent}>
      <CurrencyInput
        label="Real Estate for Sale"
        description="Market value of properties you intend to flip"
        value={data.realEstateForSale}
        onChange={(value) => updateData({ realEstateForSale: value })}
      />
      
      <CurrencyInput
        label="Accumulated Rental Income"
        description="Net rental income remaining in your accounts"
        value={data.rentalPropertyIncome}
        onChange={(value) => updateData({ rentalPropertyIncome: value })}
      />
    </QuestionLayout>
  );
}
