import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { UploadedDocument, getDocumentsForStep } from "@/lib/documentTypes";
import { UploadedDocumentCard } from "./UploadedDocumentCard";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface DocumentsManagerProps {
  documents: UploadedDocument[];
  onRemoveDocument: (id: string) => void;
}

export function DocumentsManager({
  documents,
  onRemoveDocument,
}: DocumentsManagerProps) {
  if (documents.length === 0) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FileText className="w-4 h-4" />
          <span>{documents.length} Document{documents.length !== 1 ? "s" : ""}</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Uploaded Documents</SheetTitle>
          <SheetDescription>
            All financial documents you've uploaded. Data is extracted and applied to relevant sections.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {documents.map((doc) => (
            <UploadedDocumentCard
              key={doc.id}
              document={doc}
              onRemove={onRemoveDocument}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Inline display of documents relevant to current step
interface StepDocumentsDisplayProps {
  documents: UploadedDocument[];
  stepId: string;
  onRemoveDocument?: (id: string) => void;
}

export function StepDocumentsDisplay({
  documents,
  stepId,
  onRemoveDocument,
}: StepDocumentsDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const relevantDocs = getDocumentsForStep(documents, stepId);

  if (relevantDocs.length === 0) return null;

  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-chart-1" />
          <span className="text-sm font-medium text-foreground">
            {relevantDocs.length} uploaded document{relevantDocs.length !== 1 ? "s" : ""} with relevant data
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-2">
          {relevantDocs.map((doc) => (
            <UploadedDocumentCard
              key={doc.id}
              document={doc}
              showOnlyStepFields={stepId}
              onRemove={onRemoveDocument}
              compact
            />
          ))}
        </div>
      )}
    </div>
  );
}
