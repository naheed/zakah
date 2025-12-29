import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, FileText, Building2, Calendar, ChevronRight, Trash2 } from "lucide-react";
import { Footer } from "@/components/zakat/Footer";
import { getPrimaryUrl } from "@/lib/domainConfig";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useZakatPersistence } from "@/hooks/useZakatPersistence";
import { fieldDisplayNames, fieldToStepMapping } from "@/lib/documentTypes";
import { formatCurrency, ZakatFormData } from "@/lib/zakatCalculations";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Step display names for grouping
const stepDisplayNames: Record<string, string> = {
  "liquid-assets": "Liquid Assets",
  "investments": "Investments",
  "retirement": "Retirement",
  "precious-metals": "Precious Metals",
  "crypto": "Cryptocurrency",
  "trusts": "Trusts",
  "real-estate": "Real Estate",
  "business": "Business",
  "illiquid-assets": "Illiquid Assets",
  "debt-owed": "Debt Owed to You",
  "liabilities": "Liabilities",
};

// Group extracted data by step
function groupExtractedDataByStep(extractedData: Partial<ZakatFormData>): Record<string, Array<{ field: string; value: number }>> {
  const grouped: Record<string, Array<{ field: string; value: number }>> = {};
  
  for (const [field, value] of Object.entries(extractedData)) {
    if (typeof value === 'number' && value > 0) {
      const stepId = fieldToStepMapping[field as keyof ZakatFormData];
      if (!grouped[stepId]) {
        grouped[stepId] = [];
      }
      grouped[stepId].push({ field, value });
    }
  }
  
  return grouped;
}

export default function Documents() {
  const { uploadedDocuments, removeDocument, formData } = useZakatPersistence();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTotalExtracted = (extractedData: Partial<ZakatFormData>): number => {
    let total = 0;
    for (const val of Object.values(extractedData)) {
      if (typeof val === 'number' && val > 0) {
        total += val;
      }
    }
    return total;
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Uploaded Documents | ZakatFlow</title>
        <meta name="description" content="View and manage your uploaded financial documents for Zakat calculation." />
        <link rel="canonical" href={getPrimaryUrl('/documents')} />
        <meta property="og:url" content={getPrimaryUrl('/documents')} />
      </Helmet>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon" className="-ml-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Uploaded Documents</h1>
              <p className="text-sm text-muted-foreground">
                {uploadedDocuments.length} document{uploadedDocuments.length !== 1 ? 's' : ''} uploaded
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {uploadedDocuments.length === 0 ? (
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No documents yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Upload bank statements, brokerage reports, or retirement account statements to auto-fill your Zakat calculation.
              </p>
              <Link to="/">
                <Button>
                  Return to Calculator
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {uploadedDocuments.map((doc) => {
              const groupedData = groupExtractedDataByStep(doc.extractedData);
              const totalExtracted = getTotalExtracted(doc.extractedData);
              const stepCount = Object.keys(groupedData).length;

              return (
                <Card key={doc.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-foreground truncate">
                            {doc.institutionName}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {doc.fileName}
                          </p>
                        </div>
                      </div>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove document?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove "{doc.institutionName}" and its extracted data from your calculation.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => removeDocument(doc.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Uploaded {formatDate(doc.uploadedAt)}</span>
                      </div>
                      {doc.documentDate && (
                        <>
                          <span className="text-border">•</span>
                          <span>Statement: {doc.documentDate}</span>
                        </>
                      )}
                    </div>

                    {/* Summary badges */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="secondary" className="font-normal">
                        {formatCurrency(totalExtracted, formData.currency)} extracted
                      </Badge>
                      <Badge variant="outline" className="font-normal">
                        {stepCount} categor{stepCount !== 1 ? 'ies' : 'y'}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Grouped extracted values */}
                    <div className="space-y-4">
                      {Object.entries(groupedData).map(([stepId, fields]) => (
                        <div key={stepId} className="bg-muted/30 rounded-lg p-3">
                          <h4 className="text-sm font-medium text-foreground mb-2">
                            {stepDisplayNames[stepId] || stepId}
                          </h4>
                          <div className="grid gap-2">
                            {fields.map(({ field, value }) => (
                              <div
                                key={field}
                                className="flex items-center justify-between text-sm"
                              >
                                <span className="text-muted-foreground">
                                  {fieldDisplayNames[field] || field}
                                </span>
                                <span className="font-medium text-foreground">
                                  {formatCurrency(value, formData.currency)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Notes */}
                    {doc.notes && (
                      <div className="mt-4 p-3 bg-accent/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">Note: </span>
                          {doc.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
