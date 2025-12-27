import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Image, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ZakatFormData } from "@/lib/zakatCalculations";

interface DocumentUploadProps {
  onDataExtracted: (data: Partial<ZakatFormData>) => void;
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
  acceptedTypes = ".pdf,.png,.jpg,.jpeg,.webp",
  label = "Upload Statement",
  description = "Upload a bank statement, brokerage statement, or retirement account statement",
}: DocumentUploadProps) {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [result, setResult] = useState<ExtractedResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
    setResult(null);

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
      setResult(data);

      // Extract numeric fields from the response
      const extractedFields: Partial<ZakatFormData> = {};
      const numericFields = [
        "checkingAccounts", "savingsAccounts", "cashOnHand", "digitalWallets",
        "foreignCurrency", "interestEarned", "activeInvestments", "passiveInvestmentsValue",
        "dividends", "rothIRAContributions", "rothIRAEarnings", "fourOhOneKVestedBalance",
        "traditionalIRABalance", "hsaBalance", "cryptoCurrency", "cryptoTrading",
        "goldValue", "silverValue"
      ];

      for (const field of numericFields) {
        if (data.extractedData[field] !== undefined && data.extractedData[field] !== null) {
          (extractedFields as any)[field] = Number(data.extractedData[field]);
        }
      }

      onDataExtracted(extractedFields);

      toast({
        title: "Document processed",
        description: data.summary || "Financial data extracted successfully",
      });

    } catch (error) {
      console.error("Document upload error:", error);
      setStatus("error");
      setResult({
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

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getStatusIcon = () => {
    switch (status) {
      case "uploading":
      case "processing":
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-chart-1" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Upload className="w-4 h-4" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "uploading":
        return "Uploading...";
      case "processing":
        return "Extracting data with AI...";
      case "success":
        return "Data extracted!";
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
      
      <div 
        onClick={handleClick}
        className={`
          border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
          ${status === "idle" ? "border-border hover:border-primary hover:bg-primary/5" : ""}
          ${status === "uploading" || status === "processing" ? "border-primary bg-primary/5" : ""}
          ${status === "success" ? "border-chart-1 bg-chart-1/5" : ""}
          ${status === "error" ? "border-destructive bg-destructive/5" : ""}
        `}
      >
        <div className="flex flex-col items-center gap-2">
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center
            ${status === "idle" ? "bg-muted" : ""}
            ${status === "uploading" || status === "processing" ? "bg-primary/20" : ""}
            ${status === "success" ? "bg-chart-1/20" : ""}
            ${status === "error" ? "bg-destructive/20" : ""}
          `}>
            {getStatusIcon()}
          </div>
          
          <div>
            <p className="font-medium text-foreground">{getStatusText()}</p>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
            <FileText className="w-3 h-3" />
            <span>PDF</span>
            <span className="text-border">•</span>
            <Image className="w-3 h-3" />
            <span>PNG, JPG, WebP</span>
          </div>
        </div>
      </div>

      {/* Result summary */}
      {result && result.success && (
        <div className="bg-chart-1/10 border border-chart-1/30 rounded-lg p-4 space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-chart-1 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {result.institutionName || "Document"} processed
              </p>
              <p className="text-sm text-muted-foreground">{result.summary}</p>
              {result.documentDate && (
                <p className="text-xs text-muted-foreground mt-1">
                  Statement date: {result.documentDate}
                </p>
              )}
              {result.notes && (
                <p className="text-xs text-muted-foreground mt-1 italic">
                  Note: {result.notes}
                </p>
              )}
            </div>
          </div>
          
          {/* Show extracted values */}
          <div className="pt-2 border-t border-chart-1/20">
            <p className="text-xs text-muted-foreground mb-1">Values added to your calculation:</p>
            <div className="flex flex-wrap gap-1">
              {Object.entries(result.extractedData).map(([key, value]) => {
                if (typeof value !== "number" || value === 0) return null;
                return (
                  <span key={key} className="text-xs bg-chart-1/20 text-chart-1 px-2 py-0.5 rounded">
                    {formatFieldName(key)}: ${value.toLocaleString()}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {result && !result.success && result.error && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
            <p className="text-sm text-destructive">{result.error}</p>
          </div>
        </div>
      )}
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

function formatFieldName(field: string): string {
  const names: Record<string, string> = {
    checkingAccounts: "Checking",
    savingsAccounts: "Savings",
    cashOnHand: "Cash",
    digitalWallets: "Digital Wallets",
    foreignCurrency: "Foreign Currency",
    interestEarned: "Interest",
    activeInvestments: "Active Investments",
    passiveInvestmentsValue: "Passive Investments",
    dividends: "Dividends",
    rothIRAContributions: "Roth IRA",
    rothIRAEarnings: "Roth Earnings",
    fourOhOneKVestedBalance: "401(k)",
    traditionalIRABalance: "Traditional IRA",
    hsaBalance: "HSA",
    cryptoCurrency: "Crypto",
    cryptoTrading: "Crypto Trading",
    goldValue: "Gold",
    silverValue: "Silver",
  };
  return names[field] || field;
}
