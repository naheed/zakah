import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash, Plus, Check, X, WarningCircle } from '@phosphor-icons/react';
import { ExtractionLineItem } from '@/hooks/useDocumentParsingV2';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ExtractionReviewProps {
    initialData: {
        institutionName?: string;
        accountName?: string;
        lineItems: ExtractionLineItem[];
    };
    onConfirm: (data: { institutionName: string; accountName: string; lineItems: ExtractionLineItem[] }) => void;
    onCancel: () => void;
}

// Map of categories to readable labels
const CATEGORY_OPTIONS = [
    { value: 'CASH_CHECKING', label: 'Cash / Checking' },
    { value: 'CASH_SAVINGS', label: 'Savings' },
    { value: 'INVESTMENT_EQUITY', label: 'Stocks / ETFs' },
    { value: 'INVESTMENT_MUTUAL_FUND', label: 'Mutual Funds' },
    { value: 'RETIREMENT_401K', label: '401(k)' },
    { value: 'RETIREMENT_ROTH', label: 'Roth IRA' },
    { value: 'RETIREMENT_IRA', label: 'Traditional IRA' },
    { value: 'CRYPTO', label: 'Crypto' },
    { value: 'COMMODITY_GOLD', label: 'Gold' },
    { value: 'COMMODITY_SILVER', label: 'Silver' },
    { value: 'LIABILITY_LOAN', label: 'Loan / Debt' },
    { value: 'LIABILITY_CREDIT_CARD', label: 'Credit Card' },
    { value: 'OTHER', label: 'Other/Uncategorized' },
];

const getCategoryColor = (category: string) => {
    if (category.includes('CASH')) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
    if (category.includes('INVESTMENT')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    if (category.includes('RETIREMENT')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    if (category.includes('LIABILITY')) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    return 'bg-secondary text-secondary-foreground';
};

export function ExtractionReview({ initialData, onConfirm, onCancel }: ExtractionReviewProps) {
    const [institutionName, setInstitutionName] = useState(initialData.institutionName || '');
    const [accountName, setAccountName] = useState(initialData.accountName || '');
    const [lineItems, setLineItems] = useState<ExtractionLineItem[]>(initialData.lineItems || []);

    const totalValue = useMemo(() => {
        return lineItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    }, [lineItems]);

    const handleUpdateItem = (index: number, updates: Partial<ExtractionLineItem>) => {
        const newItems = [...lineItems];
        newItems[index] = { ...newItems[index], ...updates };
        setLineItems(newItems);
    };

    const handleDeleteItem = (index: number) => {
        setLineItems(lineItems.filter((_, i) => i !== index));
    };

    const handleAddItem = () => {
        setLineItems([
            ...lineItems,
            {
                description: 'New Item',
                amount: 0,
                inferredCategory: 'OTHER',
                confidence: 1.0,
            },
        ]);
    };

    const handleConfirm = () => {
        // Validate
        if (!institutionName.trim()) {
            // Basic validation visual or toast could go here
            return;
        }

        onConfirm({
            institutionName,
            accountName,
            lineItems,
        });
    };

    return (
        <Card className="w-full border-2 border-primary/20 shadow-lg animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-600" weight="bold" />
                            Review Extracted Data
                        </CardTitle>
                        <CardDescription>
                            Please verify the details below match your statement.
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-base px-3 py-1 font-mono">
                        Total: ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
                {/* Metadata Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="institution">Institution Name</Label>
                        <Input
                            id="institution"
                            value={institutionName}
                            onChange={(e) => setInstitutionName(e.target.value)}
                            placeholder="e.g. Charles Schwab"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="accountName">Account Name (Optional)</Label>
                        <Input
                            id="accountName"
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                            placeholder="e.g. Brokerage Account"
                        />
                        <p className="text-xs text-muted-foreground">Used to identify this specific account (e.g. "Roth IRA")</p>
                    </div>
                </div>

                {/* Line Items Table */}
                <div className="rounded-md border bg-background">
                    <div className="grid grid-cols-[3fr,2fr,2fr,auto] gap-4 p-3 font-medium text-sm text-muted-foreground bg-muted/50 border-b">
                        <div>Description</div>
                        <div>Category</div>
                        <div className="text-right">Amount</div>
                        <div className="w-8"></div>
                    </div>

                    <ScrollArea className="h-[300px]">
                        <div className="divide-y">
                            {lineItems.map((item, index) => (
                                <div key={index} className="grid grid-cols-[3fr,2fr,2fr,auto] gap-4 p-3 items-center hover:bg-muted/20 transition-colors">
                                    {/* Description Input */}
                                    <Input
                                        value={item.description}
                                        onChange={(e) => handleUpdateItem(index, { description: e.target.value })}
                                        className="h-8 text-sm"
                                    />

                                    {/* Category Select */}
                                    <Select
                                        value={item.inferredCategory}
                                        onValueChange={(val) => handleUpdateItem(index, { inferredCategory: val })}
                                    >
                                        <SelectTrigger className={cn("h-8 text-xs font-medium border-0", getCategoryColor(item.inferredCategory))}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORY_OPTIONS.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {/* Amount Input */}
                                    <Input
                                        type="number"
                                        value={item.amount}
                                        onChange={(e) => handleUpdateItem(index, { amount: parseFloat(e.target.value) || 0 })}
                                        className="h-8 text-right font-mono text-sm"
                                    />

                                    {/* Delete Action */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() => handleDeleteItem(index)}
                                    >
                                        <Trash className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}

                            {lineItems.length === 0 && (
                                <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                                    <WarningCircle className="w-8 h-8 opacity-50" />
                                    <p>No line items found. Add manually or try another file.</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    <div className="p-2 border-t bg-muted/20">
                        <Button variant="ghost" size="sm" onClick={handleAddItem} className="text-primary hover:text-primary/80">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Line Item
                        </Button>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" onClick={onCancel}>
                        Back / Cancel
                    </Button>
                    <Button onClick={handleConfirm} className="bg-green-600 hover:bg-green-700 text-white min-w-[140px]">
                        Confirm & Save
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
