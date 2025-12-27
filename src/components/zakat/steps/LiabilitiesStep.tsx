import { ZakatFormData } from "@/lib/zakatCalculations";
import { liabilitiesContent } from "@/lib/zakatContent";
import { QuestionLayout } from "../QuestionLayout";
import { CurrencyInput } from "../CurrencyInput";
import { StepDocumentsDisplay } from "../DocumentsManager";
import { UploadedDocument } from "@/lib/documentTypes";

interface LiabilitiesStepProps {
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
  uploadedDocuments: UploadedDocument[];
  onDocumentAdded: (doc: Omit<UploadedDocument, 'id' | 'uploadedAt'>) => void;
  onRemoveDocument: (id: string) => void;
}

export function LiabilitiesStep({ data, updateData, uploadedDocuments, onRemoveDocument }: LiabilitiesStepProps) {
  return (
    <QuestionLayout content={liabilitiesContent}>
      <StepDocumentsDisplay documents={uploadedDocuments} stepId="liabilities" onRemoveDocument={onRemoveDocument} />
      
      <CurrencyInput
        label="Monthly Living Expenses"
        description="Rent, utilities, groceries, transport"
        value={data.monthlyLivingExpenses}
        onChange={(value) => updateData({ monthlyLivingExpenses: value })}
      />
      
      <CurrencyInput
        label="Monthly Mortgage Payment"
        description="12 months deductible per AMJA opinion"
        value={data.monthlyMortgage}
        onChange={(value) => updateData({ monthlyMortgage: value })}
      />
      
      <CurrencyInput
        label="Insurance Expenses"
        description="Home, auto, medical insurance due"
        value={data.insuranceExpenses}
        onChange={(value) => updateData({ insuranceExpenses: value })}
      />
      
      <CurrencyInput
        label="Credit Card Balance"
        description="Total balance due immediately"
        value={data.creditCardBalance}
        onChange={(value) => updateData({ creditCardBalance: value })}
      />
      
      <CurrencyInput
        label="Unpaid Bills"
        description="Utility, medical, or other bills due"
        value={data.unpaidBills}
        onChange={(value) => updateData({ unpaidBills: value })}
      />
      
      <CurrencyInput
        label="Student Loan Payments Due"
        description="Only current installment, not total balance"
        value={data.studentLoansDue}
        onChange={(value) => updateData({ studentLoansDue: value })}
      />
    </QuestionLayout>
  );
}
