import { useState, useRef, useMemo } from 'react';
import { useDocumentParsingV2, ExtractionLineItem, DocumentExtractionResult } from '@/hooks/useDocumentParsingV2';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Display limits for large datasets
const INITIAL_DISPLAY_LIMIT = 20;
const LOAD_MORE_INCREMENT = 50;

// Category badge colors
const getCategoryColor = (category: string): string => {
    const cat = category.toUpperCase();
    if (cat.includes('CASH') || cat.includes('SAVINGS') || cat.includes('CHECKING')) return 'bg-green-100 text-green-800';
    if (cat.includes('EQUITY') || cat.includes('STOCK') || cat.includes('ETF')) return 'bg-blue-100 text-blue-800';
    if (cat.includes('RETIREMENT') || cat.includes('401K') || cat.includes('IRA')) return 'bg-purple-100 text-purple-800';
    if (cat.includes('CRYPTO')) return 'bg-orange-100 text-orange-800';
    if (cat.includes('FIXED_INCOME') || cat.includes('BOND')) return 'bg-cyan-100 text-cyan-800';
    if (cat.includes('EXPENSE') || cat.includes('LIABILITY')) return 'bg-red-100 text-red-800';
    if (cat.includes('INCOME')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
};

// Group line items by category for summary view
const groupByCategory = (items: ExtractionLineItem[]): Record<string, { count: number; total: number }> => {
    return items.reduce((acc, item) => {
        const cat = item.inferredCategory;
        if (!acc[cat]) {
            acc[cat] = { count: 0, total: 0 };
        }
        acc[cat].count += 1;
        acc[cat].total += item.amount;
        return acc;
    }, {} as Record<string, { count: number; total: number }>);
};

export default function ExtractionTestPage() {
    const { user } = useAuth();
    const { parseDocument, reset, status, result, error } = useDocumentParsingV2();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [displayLimit, setDisplayLimit] = useState(INITIAL_DISPLAY_LIMIT);

    // Compute category summary for large datasets
    const categorySummary = useMemo(() => {
        if (!result?.lineItems) return {};
        return groupByCategory(result.lineItems);
    }, [result?.lineItems]);

    // Paginated line items
    const displayedItems = useMemo(() => {
        if (!result?.lineItems) return [];
        return result.lineItems.slice(0, displayLimit);
    }, [result?.lineItems, displayLimit]);

    const hasMore = result?.lineItems && result.lineItems.length > displayLimit;
    const totalItems = result?.lineItems?.length || 0;
    const isLargeDataset = totalItems > INITIAL_DISPLAY_LIMIT;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleParse = async () => {
        if (!selectedFile) return;
        setDisplayLimit(INITIAL_DISPLAY_LIMIT); // Reset pagination on new parse
        await parseDocument(selectedFile);
    };

    const handleReset = () => {
        reset();
        setSelectedFile(null);
        setDisplayLimit(INITIAL_DISPLAY_LIMIT);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleLoadMore = () => {
        setDisplayLimit(prev => prev + LOAD_MORE_INCREMENT);
    };

    const handleShowAll = () => {
        setDisplayLimit(totalItems);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>V2 Extraction Test</CardTitle>
                    <CardDescription>
                        Test the new Line Item extraction pipeline. Upload a financial document to see granular line items.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* Auth Status */}
                    <div className="p-3 border rounded-md bg-slate-50 dark:bg-slate-900">
                        <div className="text-sm font-mono">
                            <span className="text-slate-500 mr-2">Auth:</span>
                            <span className={user ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>
                                {user ? `Logged in (${user.email})` : 'NOT LOGGED IN - Edge Function requires auth'}
                            </span>
                        </div>
                    </div>

                    {/* File Upload */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg,.webp"
                                onChange={handleFileSelect}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                            />
                        </div>

                        {selectedFile && (
                            <div className="text-sm text-muted-foreground">
                                Selected: <span className="font-medium">{selectedFile.name}</span> ({(selectedFile.size / 1024).toFixed(1)} KB)
                            </div>
                        )}

                        <div className="flex gap-3">
                            <Button
                                onClick={handleParse}
                                disabled={!user || !selectedFile || status === 'uploading' || status === 'processing'}
                            >
                                {status === 'uploading' ? 'Uploading...' : status === 'processing' ? 'Extracting with AI...' : 'Parse Document'}
                            </Button>
                            <Button variant="outline" onClick={handleReset}>
                                Reset
                            </Button>
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                            <strong>Error:</strong> {error}
                        </div>
                    )}

                    {/* Results */}
                    {result && result.success && (
                        <div className="space-y-6">
                            <Separator />

                            {/* Metadata */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Institution:</span>
                                    <p className="font-medium">{result.institutionName || 'N/A'}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Date:</span>
                                    <p className="font-medium">{result.documentDate || 'N/A'}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Line Items:</span>
                                    <p className="font-medium">{result.lineItems.length}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Summary:</span>
                                    <p className="font-medium line-clamp-2">{result.summary}</p>
                                </div>
                            </div>

                            {/* V2 Line Items Table */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-lg">V2 Line Items (Granular)</h3>
                                    {isLargeDataset && (
                                        <span className="text-sm text-muted-foreground">
                                            Showing {displayedItems.length} of {totalItems} items
                                        </span>
                                    )}
                                </div>

                                {/* Category Summary for Large Datasets */}
                                {isLargeDataset && (
                                    <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border">
                                        <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Category Summary</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(categorySummary).map(([cat, data]) => (
                                                <div key={cat} className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white dark:bg-slate-800">
                                                    <Badge variant="secondary" className={getCategoryColor(cat)}>
                                                        {cat}
                                                    </Badge>
                                                    <span className="text-xs font-mono">
                                                        {data.count} items • {formatCurrency(data.total)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="border rounded-lg overflow-hidden">
                                    <div className="max-h-[500px] overflow-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0">
                                                <tr>
                                                    <th className="text-left p-3">Description</th>
                                                    <th className="text-left p-3">Category</th>
                                                    <th className="text-right p-3">Amount</th>
                                                    <th className="text-right p-3">Confidence</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {displayedItems.map((item, idx) => (
                                                    <tr key={idx} className="border-t hover:bg-slate-50 dark:hover:bg-slate-900">
                                                        <td className="p-3 font-medium max-w-[300px] truncate" title={item.description}>
                                                            {item.description}
                                                        </td>
                                                        <td className="p-3">
                                                            <Badge variant="secondary" className={getCategoryColor(item.inferredCategory)}>
                                                                {item.inferredCategory}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-3 text-right font-mono">{formatCurrency(item.amount)}</td>
                                                        <td className="p-3 text-right text-muted-foreground">
                                                            {item.confidence ? `${(item.confidence * 100).toFixed(0)}%` : '-'}
                                                        </td>
                                                    </tr>
                                                ))}
                                                {displayedItems.length === 0 && (
                                                    <tr>
                                                        <td colSpan={4} className="p-6 text-center text-muted-foreground">
                                                            No line items extracted
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination Controls */}
                                    {hasMore && (
                                        <div className="p-3 border-t bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                {totalItems - displayLimit} more items not shown
                                            </span>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" onClick={handleLoadMore}>
                                                    Load {Math.min(LOAD_MORE_INCREMENT, totalItems - displayLimit)} More
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={handleShowAll}>
                                                    Show All ({totalItems})
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Legacy Aggregated Data */}
                            <div>
                                <h3 className="font-bold text-lg mb-3">Legacy Aggregated Data</h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    This is the backward-compatible format used by the existing UI.
                                </p>
                                <div className="p-4 bg-slate-950 text-green-400 rounded-md font-mono text-xs overflow-auto max-h-64">
                                    <pre>{JSON.stringify(result.extractedData, null, 2)}</pre>
                                </div>
                            </div>

                            {/* Notes */}
                            {result.notes && (
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Notes</h3>
                                    <p className="text-sm text-muted-foreground">{result.notes}</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Testing Instructions */}
            <Card>
                <CardHeader>
                    <CardTitle>End-to-End Testing Instructions</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                    <ol className="list-decimal list-inside space-y-2">
                        <li><strong>Deploy Edge Function:</strong> Run <code>npx supabase functions deploy parse-financial-document</code> from the project root.</li>
                        <li><strong>Login:</strong> Ensure you are logged in (the Edge Function requires authentication).</li>
                        <li><strong>Upload a document:</strong> Use a brokerage or bank statement PDF/image.</li>
                        <li><strong>Verify Line Items:</strong> Check that the V2 table shows individual holdings (e.g., "Apple Inc (AAPL)" with category "INVESTMENT_EQUITY").</li>
                        <li><strong>Verify Legacy Data:</strong> Confirm the legacy JSON contains aggregated fields like <code>passiveInvestmentsValue</code>.</li>
                    </ol>
                    <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <strong>Note:</strong> The Edge Function uses the Gemini API. Make sure <code>GEMINI_API_KEY</code> is set in your Supabase secrets.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
