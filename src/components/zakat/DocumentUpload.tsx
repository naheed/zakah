import { useState, useRef, useCallback } from "react";
import { UploadSimple, FileDoc, Image, SpinnerGap, CheckCircle, WarningCircle, Sparkle, FolderOpen } from "@phosphor-icons/react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/runtimeClient";
import { ZakatFormData } from "@/lib/zakatCalculations";
import { UploadedDocument, fieldDisplayNames } from "@/lib/documentTypes";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ExtractionReview } from "./ExtractionReview";
import { ExtractionLineItem } from "@/hooks/useDocumentParsingV2";
import { AccountChip } from "./AccountChip";
import { AssetAccount, AssetLineItem } from "@/types/assets";
import { getAffectedQuestionLabels } from "@/lib/accountImportMapper";
import { Button } from "@/components/ui/button";

/** Account with line items for selection */
export interface AccountWithLineItems extends AssetAccount {
  lineItems?: AssetLineItem[];
}

interface DocumentUploadProps {
  onDataExtracted: (data: Partial<ZakatFormData>) => void;
  onDocumentAdded?: (doc: Omit<UploadedDocument, 'id' | 'uploadedAt'>) => void;
  /** Existing accounts to show for selection (filtered by context) */
  existingAccounts?: AccountWithLineItems[];
  /** All accounts (unfiltered) for "Show all" option */
  allAccounts?: AccountWithLineItems[];
  /** Called when user selects an existing account */
  onAccountSelected?: (account: AccountWithLineItems) => void;
  acceptedTypes?: string;
  label?: string;
  description?: string;
}

type UploadStatus = "idle" | "uploading" | "processing" | "reviewing" | "success" | "error";

interface ExtractedResult {
  success: boolean;
  extractedData: Partial<ZakatFormData>;
  summary: string;
  documentDate?: string;
  institutionName?: string;
  accountName?: string;
  accountId?: string;
  notes?: string;
  error?: string;
  lineItems?: ExtractionLineItem[];
}

interface ReviewData {
  result: ExtractedResult;
  lineItems: ExtractionLineItem[];
  file: File;
}

export function DocumentUpload({
  onDataExtracted,
  onDocumentAdded,
  existingAccounts = [],
  allAccounts = [],
  onAccountSelected,
  acceptedTypes = ".pdf,.png,.jpg,.jpeg,.webp",
  label = "Upload Statement",
  description = "AI extracts line items from your statement",
}: DocumentUploadProps) {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [showAllAccounts, setShowAllAccounts] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const processFile = async (file: File) => {
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    const validTypes = ["application/pdf", "image/png", "image/jpeg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or image file (PNG, JPG, WebP)",
        variant: "destructive",
      });
      return;
    }

    setStatus("uploading");
    setReviewData(null);
    setLastError(null);
    setShowCelebration(false);

    try {
      const base64 = await fileToBase64(file);
      setStatus("processing");

      const documentType = getDocumentType(file.name);

      const { data, error } = await supabase.functions.invoke("parse-financial-document", {
        body: {
          documentBase64: base64,
          documentType,
          mimeType: file.type,
        },
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      console.log("[DocumentUpload] Edge Function Response:", data);

      // Prepare review data
      const lineItems = data.lineItems || [];

      setReviewData({
        result: data,
        lineItems: lineItems,
        file: file
      });
      setStatus("reviewing");

    } catch (error) {
      console.error("Document upload error:", error);
      setStatus("error");
      setLastError(error instanceof Error ? error.message : "Failed to process document");

      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "Failed to process document",
        variant: "destructive",
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleConfirmReview = (confirmed: { institutionName: string; accountName: string; lineItems: ExtractionLineItem[] }) => {
    if (!reviewData) return;

    const { result, file } = reviewData;

    // Build legacy extractedData from confirmed line items for form compatibility
    const extractedFields: Partial<ZakatFormData> = {};
    confirmed.lineItems.forEach(item => {
      // Map categories to legacy form fields
      const mapping: Record<string, keyof ZakatFormData> = {
        'CASH_CHECKING': 'checkingAccounts',
        'CASH_SAVINGS': 'savingsAccounts',
        'CASH_ON_HAND': 'cashOnHand',
        'INVESTMENT_EQUITY': 'passiveInvestmentsValue',
        'INVESTMENT_MUTUAL_FUND': 'passiveInvestmentsValue',
        'INVESTMENT_BOND': 'passiveInvestmentsValue',
        'INCOME_DIVIDEND': 'dividends',
        'RETIREMENT_401K': 'fourOhOneKVestedBalance',
        'RETIREMENT_ROTH': 'rothIRAContributions',
        'RETIREMENT_IRA': 'traditionalIRABalance',
        'RETIREMENT_HSA': 'hsaBalance',
        'CRYPTO': 'cryptoCurrency',
        'CRYPTO_STAKED': 'stakedAssets',
        'COMMODITY_GOLD': 'goldValue',
        'COMMODITY_SILVER': 'silverValue',
      };

      const field = mapping[item.inferredCategory];
      if (field) {
        const current = (extractedFields as any)[field] || 0;
        (extractedFields as any)[field] = current + item.amount;
      }
    });

    // Update wizard form values
    onDataExtracted(extractedFields);

    // Notify parent for persistence (includes lineItems for V2 storage)
    if (onDocumentAdded) {
      onDocumentAdded({
        fileName: file.name,
        institutionName: confirmed.institutionName,
        accountName: confirmed.accountName,
        accountId: result.accountId,
        documentDate: result.documentDate,
        summary: result.summary || "Financial data extracted",
        notes: result.notes,
        extractedData: extractedFields,
        lineItems: confirmed.lineItems, // Pass confirmed line items for V2 persistence
        mimeType: file.type,
      });
    }

    // Show success state
    setStatus("success");
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);

    toast({
      title: "Document processed",
      description: `Data extracted from ${confirmed.institutionName}`,
    });
  };

  const handleCancelReview = () => {
    setStatus("idle");
    setReviewData(null);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Show review UI when we have data to review
  if (status === "reviewing" && reviewData) {
    return (
      <div className="space-y-3">
        <ExtractionReview
          initialData={{
            institutionName: reviewData.result.institutionName || reviewData.file.name.replace(/\.[^/.]+$/, ''),
            accountName: reviewData.result.accountName || reviewData.file.name.replace(/\.[^/.]+$/, ''),
            lineItems: reviewData.lineItems,
          }}
          onConfirm={handleConfirmReview}
          onCancel={handleCancelReview}
        />
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (status) {
      case "uploading":
      case "processing":
        return <SpinnerGap className="w-5 h-5 animate-spin" weight="bold" />;
      case "success":
        return (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <CheckCircle className="w-5 h-5 text-success" weight="fill" />
          </motion.div>
        );
      case "error":
        return <WarningCircle className="w-5 h-5 text-destructive" weight="fill" />;
      default:
        return <UploadSimple className="w-5 h-5" weight="bold" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "uploading":
        return "Uploading...";
      case "processing":
        return "Extracting data with AI...";
      case "success":
        return "Upload another document";
      case "error":
        return "Try again";
      default:
        return label;
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Existing Accounts Selection */}
      {(existingAccounts.length > 0 || allAccounts.length > 0) && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Use an existing account:</p>
            {allAccounts.length > existingAccounts.length && (
              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAllAccounts}
                  onChange={(e) => setShowAllAccounts(e.target.checked)}
                  className="rounded border-border"
                />
                Show all ({allAccounts.length})
              </label>
            )}
          </div>

          {(() => {
            const visibleAccounts = showAllAccounts ? allAccounts : existingAccounts;
            return visibleAccounts.length > 0 ? (
              <>
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                  {visibleAccounts.map(account => (
                    <AccountChip
                      key={account.id}
                      name={account.name || 'Unnamed Account'}
                      institutionName={account.institution_name}
                      balance={account.balance || 0}
                      updatedAt={account.updated_at || account.created_at}
                      selected={selectedAccountId === account.id}
                      onClick={() => {
                        setSelectedAccountId(selectedAccountId === account.id ? null : account.id);
                      }}
                    />
                  ))}
                </div>

                {/* Use Selected Button */}
                {selectedAccountId && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Button
                      onClick={() => {
                        const account = visibleAccounts.find(a => a.id === selectedAccountId);
                        if (account && onAccountSelected) {
                          onAccountSelected(account);
                          toast({
                            title: 'Account imported',
                            description: `Values from ${account.name} added to calculation`,
                          });
                          setSelectedAccountId(null);
                          setStatus('success');
                          setShowCelebration(true);
                          setTimeout(() => setShowCelebration(false), 2000);
                        }
                      }}
                      className="w-full"
                    >
                      <FolderOpen className="w-4 h-4 mr-2" />
                      Use {visibleAccounts.find(a => a.id === selectedAccountId)?.name}
                    </Button>
                  </motion.div>
                )}
              </>
            ) : (
              <p className="text-xs text-muted-foreground italic">No matching accounts found. Try "Show all" or upload a new document.</p>
            );
          })()}

          {/* Divider */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex-1 border-t border-dashed border-border" />
            <span>or upload new</span>
            <div className="flex-1 border-t border-dashed border-border" />
          </div>
        </div>
      )}

      <motion.div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors relative overflow-hidden",
          status === "idle" || status === "success"
            ? "border-border hover:border-primary hover:bg-primary/5"
            : "",
          status === "uploading" || status === "processing"
            ? "border-primary bg-primary/5 pointer-events-none"
            : "",
          status === "error"
            ? "border-destructive bg-destructive/5"
            : "",
          isDragging
            ? "border-primary bg-primary/10 border-solid"
            : ""
        )}
        initial={false}
        animate={{
          scale: isDragging ? 1.02 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Success Celebration Overlay */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 bg-tertiary/20 rounded-xl"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5, times: [0, 0.6, 1] }}
                >
                  <Sparkle className="w-8 h-8 text-tertiary" weight="fill" />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col items-center gap-2 relative z-10">
          <motion.div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
              status === "idle" || status === "success" ? "bg-muted" : "",
              status === "uploading" || status === "processing" ? "bg-primary/20" : "",
              status === "error" ? "bg-destructive/20" : "",
              isDragging ? "bg-primary/20" : ""
            )}
            animate={{
              scale: isDragging ? 1.1 : 1,
              y: isDragging ? -4 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {getStatusIcon()}
          </motion.div>

          <div>
            <motion.p
              className="font-medium text-foreground"
              animate={{ y: isDragging ? -2 : 0 }}
            >
              {isDragging ? "Drop to upload" : getStatusText()}
            </motion.p>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
            <FileDoc className="w-3 h-3" weight="fill" />
            <span>PDF</span>
            <span className="text-border">•</span>
            <Image className="w-3 h-3" weight="fill" />
            <span>PNG, JPG, WebP</span>
          </div>

          <p className="text-xs text-muted-foreground mt-3 max-w-xs mx-auto">
            You'll review extracted values before adding to your calculation.
          </p>
        </div>
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {status === "error" && lastError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-destructive/10 border border-destructive/30 rounded-lg p-3"
          >
            <div className="flex items-start gap-2">
              <WarningCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" weight="fill" />
              <p className="text-sm text-destructive">{lastError}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper functions
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getDocumentType(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.includes("401k") || lower.includes("401(k)")) return "401(k) statement";
  if (lower.includes("ira")) return "IRA statement";
  if (lower.includes("roth")) return "Roth IRA statement";
  if (lower.includes("brokerage") || lower.includes("invest")) return "brokerage statement";
  if (lower.includes("bank") || lower.includes("checking") || lower.includes("savings")) return "bank statement";
  if (lower.includes("crypto")) return "cryptocurrency statement";
  return "financial statement";
}
