import { useState, useRef, useCallback } from "react";
import { UploadSimple, FileDoc, Image, SpinnerGap, CheckCircle, WarningCircle, Sparkle } from "@phosphor-icons/react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ZakatFormData } from "@/lib/zakatCalculations";
import { UploadedDocument, fieldDisplayNames } from "@/lib/documentTypes";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DocumentUploadProps {
  onDataExtracted: (data: Partial<ZakatFormData>) => void;
  onDocumentAdded?: (doc: Omit<UploadedDocument, 'id' | 'uploadedAt'>) => void;
  acceptedTypes?: string;
  label?: string;
  description?: string;
}

type UploadStatus = "idle" | "uploading" | "processing" | "success" | "error";

interface ExtractedResult {
  success: boolean;
  extractedData: Partial<ZakatFormData>;
  summary: string;
  documentDate?: string;
  institutionName?: string;
  notes?: string;
  error?: string;
}

export function DocumentUpload({
  onDataExtracted,
  onDocumentAdded,
  acceptedTypes = ".pdf,.png,.jpg,.jpeg,.webp",
  label = "Upload Statement",
  description = "Upload a bank statement, brokerage statement, or retirement account statement",
}: DocumentUploadProps) {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [lastResult, setLastResult] = useState<ExtractedResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
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
    setLastResult(null);
    setShowCelebration(false);

    try {
      // Convert file to base64
      const base64 = await fileToBase64(file);
      
      setStatus("processing");

      // Determine document type from filename
      const documentType = getDocumentType(file.name);

      // Call edge function
      const { data, error } = await supabase.functions.invoke("parse-financial-document", {
        body: {
          documentBase64: base64,
          documentType,
          mimeType: file.type,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setStatus("success");
      setLastResult(data);
      setShowCelebration(true);

      // Haptic feedback on mobile
      if (navigator.vibrate) {
        navigator.vibrate([10, 50, 10]);
      }

      // Extract numeric fields from the response
      const extractedFields: Partial<ZakatFormData> = {};
      const numericFields = [
        "checkingAccounts", "savingsAccounts", "cashOnHand", "digitalWallets",
        "foreignCurrency", "interestEarned", "activeInvestments", "passiveInvestmentsValue",
        "dividends", "rothIRAContributions", "rothIRAEarnings", "fourOhOneKVestedBalance",
        "traditionalIRABalance", "hsaBalance", "cryptoCurrency", "cryptoTrading",
        "goldValue", "silverValue", "stakedAssets", "stakedRewardsVested", "liquidityPoolValue"
      ];

      for (const field of numericFields) {
        if (data.extractedData[field] !== undefined && data.extractedData[field] !== null) {
          (extractedFields as any)[field] = Number(data.extractedData[field]);
        }
      }

      // Call the extraction callback (updates form values)
      onDataExtracted(extractedFields);

      // Store the document with all its data
      if (onDocumentAdded) {
        onDocumentAdded({
          fileName: file.name,
          institutionName: data.institutionName || file.name,
          documentDate: data.documentDate,
          summary: data.summary || "Financial data extracted",
          notes: data.notes,
          extractedData: extractedFields,
          mimeType: file.type,
        });
      }

      toast({
        title: "Document processed",
        description: `Data extracted from ${data.institutionName || file.name}`,
      });

      // Reset celebration after animation
      setTimeout(() => setShowCelebration(false), 2000);

    } catch (error) {
      console.error("Document upload error:", error);
      setStatus("error");
      setLastResult({
        success: false,
        extractedData: {},
        summary: "",
        error: error instanceof Error ? error.message : "Failed to process document",
      });
      
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "Failed to process document",
        variant: "destructive",
      });
    }

    // Reset file input for next upload
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

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
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileSelect}
        className="hidden"
      />
      
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
              {/* Glow effect */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 bg-tertiary/20 rounded-xl"
              />
              {/* Sparkle particles */}
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
          
          {/* AI Processing Notice */}
          <p className="text-xs text-muted-foreground/70 mt-3 max-w-xs mx-auto">
            Documents are processed by AI to extract values. Only numeric values are saved; 
            document names and summaries are cleared when you close your browser.
          </p>
        </div>
      </motion.div>

      {/* Show last upload result with animation */}
      <AnimatePresence mode="wait">
        {lastResult && lastResult.success && status === "success" && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-success/10 border border-success/30 rounded-lg p-3"
          >
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
              >
                <CheckCircle className="w-4 h-4 text-success shrink-0" weight="fill" />
              </motion.div>
              <p className="text-sm text-foreground">
                <span className="font-medium">{lastResult.institutionName}</span> added successfully
              </p>
            </div>
          </motion.div>
        )}

        {lastResult && !lastResult.success && lastResult.error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-destructive/10 border border-destructive/30 rounded-lg p-3"
          >
          <div className="flex items-start gap-2">
              <WarningCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" weight="fill" />
              <p className="text-sm text-destructive">{lastResult.error}</p>
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
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
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
