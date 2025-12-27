import { ZakatFormData } from "@/lib/zakatCalculations";
import { taxContent } from "@/lib/zakatContent";
import { QuestionLayout } from "../QuestionLayout";
import { CurrencyInput } from "../CurrencyInput";

interface TaxStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
}

export function TaxStep({ data, updateData }: TaxStepProps) {
  return (
    <QuestionLayout content={taxContent}>
      <CurrencyInput
        label="Property Tax Due"
        description="Property taxes currently due"
        value={data.propertyTax}
        onChange={(value) => updateData({ propertyTax: value })}
      />
      
      <CurrencyInput
        label="Late Tax Payments or Fines"
        description="Overdue taxes, penalties, or fines"
        value={data.lateTaxPayments}
        onChange={(value) => updateData({ lateTaxPayments: value })}
      />
    </QuestionLayout>
  );
}
