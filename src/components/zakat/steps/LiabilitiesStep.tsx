import { ZakatFormData } from "@/lib/zakatCalculations";
import { liabilitiesContent } from "@/lib/zakatContent";
import { AssetStepWrapper } from "../AssetStepWrapper";
import { CurrencyInput } from "../CurrencyInput";
import { UploadedDocument } from "@/lib/documentTypes";
import { AssetStepProps, getDocumentContributionsForField } from "@/hooks/useDocumentExtraction";

export function LiabilitiesStep({ data, updateData, uploadedDocuments, onDocumentAdded, onRemoveDocument }: AssetStepProps) {
  const isHousehold = data.isHousehold;

  return (
    <AssetStepWrapper
      content={liabilitiesContent}
      stepId="liabilities"
      data={data}
      updateData={updateData}
      uploadedDocuments={uploadedDocuments}
      onDocumentAdded={onDocumentAdded}
      onRemoveDocument={onRemoveDocument}
      showUpload={false}
      householdReminder="Include expenses and liabilities for your entire household."
    >
      <CurrencyInput
        label="Monthly Living Expenses"
        description="Rent, utilities, groceries, transport"
        householdDescription="Combined living expenses for all family members"
        isHousehold={isHousehold}
        value={data.monthlyLivingExpenses}
        onChange={(value) => updateData({ monthlyLivingExpenses: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'monthlyLivingExpenses')}
      />
      
      <CurrencyInput
        label="Monthly Mortgage Payment"
        description="12 months deductible per AMJA opinion"
        householdDescription="Combined mortgage for your household"
        isHousehold={isHousehold}
        value={data.monthlyMortgage}
        onChange={(value) => updateData({ monthlyMortgage: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'monthlyMortgage')}
      />
      
      <CurrencyInput
        label="Insurance Expenses"
        description="Home, auto, medical insurance due"
        householdDescription="Combined insurance for all family members"
        isHousehold={isHousehold}
        value={data.insuranceExpenses}
        onChange={(value) => updateData({ insuranceExpenses: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'insuranceExpenses')}
      />
      
      <CurrencyInput
        label="Credit Card Balance"
        description="Total balance due immediately"
        householdDescription="Combined credit card balances for all family members"
        isHousehold={isHousehold}
        value={data.creditCardBalance}
        onChange={(value) => updateData({ creditCardBalance: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'creditCardBalance')}
      />
      
      <CurrencyInput
        label="Unpaid Bills"
        description="Utility, medical, or other bills due"
        householdDescription="Combined unpaid bills for all family members"
        isHousehold={isHousehold}
        value={data.unpaidBills}
        onChange={(value) => updateData({ unpaidBills: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'unpaidBills')}
      />
      
      <CurrencyInput
        label="Student Loan Payments Due"
        description="Only current installment, not total balance"
        householdDescription="Combined student loan payments for all family members"
        isHousehold={isHousehold}
        value={data.studentLoansDue}
        onChange={(value) => updateData({ studentLoansDue: value })}
        documentContributions={getDocumentContributionsForField(uploadedDocuments, 'studentLoansDue')}
      />
    </AssetStepWrapper>
  );
}
