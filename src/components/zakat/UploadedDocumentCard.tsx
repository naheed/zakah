import { CheckCircle, FileText, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { UploadedDocument, fieldDisplayNames } from "@/lib/documentTypes";
import { Button } from "@/components/ui/button";

interface UploadedDocumentCardProps {
  document: UploadedDocument;
  onRemove?: (id: string) => void;
  showOnlyStepFields?: string; // If provided, only show fields for this step
  compact?: boolean;
}

export function UploadedDocumentCard({
  document,
  onRemove,
  showOnlyStepFields,
  compact = false,
}: UploadedDocumentCardProps) {
  const [isExpanded, setIsExpanded] = useState(!compact);

  // Filter extracted data to show only relevant fields
  const displayData = Object.entries(document.extractedData).filter(([key, value]) => {
    if (typeof value !== "number" || value === 0) return false;
    if (showOnlyStepFields) {
      const { fieldToStepMapping } = require("@/lib/documentTypes");
      return fieldToStepMapping[key] === showOnlyStepFields;
    }
    return true;
  });

  if (displayData.length === 0 && showOnlyStepFields) {
    return null; // Don't render if no relevant fields for this step
  }

  const totalValue = displayData.reduce((sum, [, value]) => sum + (value as number), 0);

  return (
    <div className="bg-chart-1/10 border border-chart-1/30 rounded-lg overflow-hidden">
      {/* Header - always visible */}
      <div
        className={`p-4 ${compact ? "cursor-pointer" : ""}`}
        onClick={() => compact && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1">
            <CheckCircle className="w-4 h-4 text-chart-1 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {document.institutionName || document.fileName}
              </p>
              {!compact && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {document.summary}
                </p>
              )}
              {document.documentDate && (
                <p className="text-xs text-muted-foreground mt-1">
                  Statement date: {document.documentDate}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            {compact && (
              <span className="text-sm font-medium text-chart-1">
                ${totalValue.toLocaleString()}
              </span>
            )}
            {compact && (
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            )}
            {onRemove && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(document.id);
                }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Notes */}
        {!compact && document.notes && (
          <p className="text-xs text-muted-foreground mt-2 italic">
            Note: {document.notes}
          </p>
        )}
      </div>

      {/* Extracted values - collapsible in compact mode */}
      {(isExpanded || !compact) && displayData.length > 0 && (
        <div className="px-4 pb-4 pt-0">
          <div className="pt-2 border-t border-chart-1/20">
            <p className="text-xs text-muted-foreground mb-2">
              Values from this document:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {displayData.map(([key, value]) => (
                <span
                  key={key}
                  className="text-xs bg-chart-1/20 text-chart-1 px-2 py-1 rounded"
                >
                  {fieldDisplayNames[key] || key}: ${(value as number).toLocaleString()}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
