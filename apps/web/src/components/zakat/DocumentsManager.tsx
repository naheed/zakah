/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { FileText, CaretDown, CaretUp, ArrowSquareOut } from "@phosphor-icons/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { UploadedDocument, getDocumentsForStep } from "@zakatflow/core";
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
          <span>{documents.length}</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Uploaded Documents</SheetTitle>
          <SheetDescription>
            Financial documents with extracted data.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <Link to="/documents">
            <Button variant="outline" size="sm" className="w-full gap-2">
              <ArrowSquareOut className="w-4 h-4 ml-1" />
              View All Documents
            </Button>
          </Link>
        </div>
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
          <CaretUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <CaretDown className="w-4 h-4 text-muted-foreground" />
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
