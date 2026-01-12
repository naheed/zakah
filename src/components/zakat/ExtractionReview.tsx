import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Trash, Plus, Check, WarningCircle, Info, SpinnerGap } from '@phosphor-icons/react';
import { ExtractionLineItem } from '@/hooks/useDocumentParsingV2';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    ASSET_CATEGORIES,
    getCategoriesGrouped,
    getCategoryLabel,
    getCategoryColor,
    getCategoryById
} from '@/lib/assetCategories';

interface ExtractionReviewProps {
    initialData: {
        institutionName?: string;
        accountName?: string;
        lineItems: ExtractionLineItem[];
    };
    onConfirm: (data: { institutionName: string; accountName: string; lineItems: ExtractionLineItem[] }) => void;
    onCancel: () => void;
    isSaving?: boolean;
}

export function ExtractionReview({ initialData, onConfirm, onCancel, isSaving = false }: ExtractionReviewProps) {
    const [institutionName, setInstitutionName] = useState(initialData.institutionName || '');
    const [accountName, setAccountName] = useState(initialData.accountName || '');
    const [lineItems, setLineItems] = useState<ExtractionLineItem[]>(initialData.lineItems || []);

    const totalValue = useMemo(() => {
        return lineItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    }, [lineItems]);

    // Group categories for dropdown
    const groupedCategories = useMemo(() => getCategoriesGrouped(), []);

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
        if (!institutionName.trim()) {
            return;
        }
        onConfirm({
            institutionName,
            accountName,
            lineItems,
        });
    };

    return (
        <TooltipProvider>
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
                            <div className="flex items-center gap-1">
                                Category
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info className="w-3.5 h-3.5 text-muted-foreground/60 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="max-w-[200px]">
                                        <p className="text-xs">Select the type of asset. This helps calculate Zakat accurately.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <div className="text-right">Amount</div>
                            <div className="w-8"></div>
                        </div>

                        <ScrollArea className="h-[300px]">
                            <div className="divide-y">
                                {lineItems.map((item, index) => {
                                    const category = getCategoryById(item.inferredCategory);
                                    const isLowConfidence = (item.confidence || 1) < 0.7;

                                    return (
                                        <div
                                            key={index}
                                            className={cn(
                                                "grid grid-cols-[3fr,2fr,2fr,auto] gap-4 p-3 items-center hover:bg-muted/20 transition-colors",
                                                isLowConfidence && "bg-yellow-50/50 dark:bg-yellow-900/10"
                                            )}
                                        >
                                            {/* Description Input */}
                                            <div className="flex items-center gap-2">
                                                {isLowConfidence && (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <WarningCircle className="w-4 h-4 text-yellow-600 shrink-0" weight="fill" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p className="text-xs">Low AI confidence - please verify</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                )}
                                                <Input
                                                    value={item.description}
                                                    onChange={(e) => handleUpdateItem(index, { description: e.target.value })}
                                                    className="h-8 text-sm"
                                                />
                                            </div>

                                            {/* Category Select with Groups */}
                                            <Select
                                                value={item.inferredCategory}
                                                onValueChange={(val) => handleUpdateItem(index, { inferredCategory: val })}
                                            >
                                                <SelectTrigger className={cn("h-8 text-xs font-medium border-0", getCategoryColor(item.inferredCategory))}>
                                                    <SelectValue>{getCategoryLabel(item.inferredCategory)}</SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(groupedCategories).map(([groupLabel, categories]) => (
                                                        <SelectGroup key={groupLabel}>
                                                            <SelectLabel className="text-xs font-semibold text-muted-foreground px-2 py-1.5">
                                                                {groupLabel}
                                                            </SelectLabel>
                                                            {categories.map((cat) => (
                                                                <SelectItem key={cat.id} value={cat.id} className="pl-4">
                                                                    <div className="flex items-center justify-between w-full">
                                                                        <span>{cat.label}</span>
                                                                        {cat.description && (
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Info className="w-3 h-3 text-muted-foreground/50 ml-2" />
                                                                                </TooltipTrigger>
                                                                                <TooltipContent side="right" className="max-w-[180px]">
                                                                                    <p className="text-xs">{cat.description}</p>
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                        )}
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
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
                                    );
                                })}

                                {lineItems.length === 0 && (
                                    <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                                        <WarningCircle className="w-8 h-8 opacity-50" />
                                        <p>No line items found. Add manually or try another file.</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        <div className="p-2 border-t bg-muted/20">
                            <Button variant="ghost" size="sm" onClick={handleAddItem} className="text-primary hover:text-primary">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Line Item
                            </Button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
                            Back / Cancel
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={isSaving || !institutionName.trim()}
                            className="bg-green-600 hover:bg-green-700 text-white min-w-[140px]"
                        >
                            {isSaving ? (
                                <>
                                    <SpinnerGap className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Confirm & Save'
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </TooltipProvider>
    );
}

