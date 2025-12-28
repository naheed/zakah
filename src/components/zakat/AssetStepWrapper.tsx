import { ReactNode } from "react";
import { ZakatFormData } from "@/lib/zakatCalculations";
import { StepContent } from "@/lib/zakatContent";
import { QuestionLayout } from "./QuestionLayout";
import { DocumentUpload } from "./DocumentUpload";
import { StepDocumentsDisplay } from "./DocumentsManager";
import { UploadedDocument } from "@/lib/documentTypes";
import { useDocumentExtraction } from "@/hooks/useDocumentExtraction";

interface AssetStepWrapperProps {
  content: StepContent;
  stepId: string;
  /** Dynamic question number from wizard */
  questionNumber?: number;
  data: ZakatFormData;
  updateData: (updates: Partial<ZakatFormData>) => void;
  uploadedDocuments: UploadedDocument[];
  onDocumentAdded: (doc: Omit<UploadedDocument, 'id' | 'uploadedAt'>) => void;
  onRemoveDocument: (id: string) => void;
  showUpload?: boolean;
  uploadLabel?: string;
  uploadDescription?: string;
  householdReminder?: string;
  children: ReactNode;
}

export function AssetStepWrapper({
  content,
  stepId,
  questionNumber,
  data,
  updateData,
  uploadedDocuments,
  onDocumentAdded,
  onRemoveDocument,
  showUpload = true,
  uploadLabel = "Upload Statement",
  uploadDescription = "Auto-fill from your financial statement",
  householdReminder,
  children,
}: AssetStepWrapperProps) {
  const { handleDataExtracted } = useDocumentExtraction(stepId, data, updateData);
  const isHousehold = data.isHousehold;

  return (
    <QuestionLayout content={content} questionNumber={questionNumber}>
      {/* Household mode reminder */}
      {isHousehold && householdReminder && (
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-foreground">
            <span className="font-medium">Household Mode:</span> {householdReminder}
          </p>
        </div>
      )}

      {/* Show previously uploaded documents with relevant data */}
      <StepDocumentsDisplay 
        documents={uploadedDocuments} 
        stepId={stepId}
        onRemoveDocument={onRemoveDocument}
      />

      {/* Document upload */}
      {showUpload && (
        <DocumentUpload
          onDataExtracted={handleDataExtracted}
          onDocumentAdded={onDocumentAdded}
          label={uploadLabel}
          description={uploadDescription}
        />
      )}
      
      {children}
    </QuestionLayout>
  );
}
