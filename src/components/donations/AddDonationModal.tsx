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

import { useState, useRef, useCallback } from 'react';
import { X, UploadSimple, Receipt, SpinnerGap, Check, CalendarBlank } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ZakatRecipientCategory,
    ZAKAT_RECIPIENT_CATEGORIES,
    Donation
} from '@/types/donations';
import { supabase } from '@/integrations/supabase/runtimeClient';

interface AddDonationModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (donation: Omit<Donation, 'id' | 'user_id' | 'zakat_year_id' | 'created_at' | 'updated_at'>) => void;
    zakatYearId?: string;
}

/**
 * Add Donation Modal
 * 
 * Material 3 Expressive design with:
 * - AI receipt scanning as hero flow
 * - Manual form fallback
 * - 8 Quranic categories dropdown
 */
export function AddDonationModal({ open, onClose, onSave, zakatYearId }: AddDonationModalProps) {
    // Form state
    const [amount, setAmount] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [category, setCategory] = useState<ZakatRecipientCategory>('AL_FUQARAA');
    const [donationDate, setDonationDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');
    const [receiptUrl, setReceiptUrl] = useState('');

    // AI extraction state
    const [isExtracting, setIsExtracting] = useState(false);
    const [extractedViaAI, setExtractedViaAI] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle receipt upload and AI extraction
    const handleReceiptUpload = useCallback(async (file: File) => {
        setIsExtracting(true);

        try {
            // 1. Convert file to Base64
            const base64Data = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    const result = reader.result as string;
                    // Remove data url prefix (e.g. "data:image/jpeg;base64,")
                    const base64 = result.split(',')[1];
                    resolve(base64);
                };
                reader.onerror = error => reject(error);
            });

            // 2. Call Supabase Edge Function
            const { data, error } = await supabase.functions.invoke('parse-financial-document', {
                body: {
                    documentBase64: base64Data,
                    documentType: 'Donation Receipt',
                    mimeType: file.type,
                    extractionType: 'donation_receipt'
                }
            });

            if (error) throw error;

            if (data?.success && data?.data) {
                const extracted = data.data as {
                    donationAmount?: number | string;
                    organizationName?: string;
                    donationDate?: string;
                    taxId?: string;
                    address?: string;
                    campaign?: string;
                };

                if (extracted.donationAmount) setAmount(extracted.donationAmount.toString());
                if (extracted.organizationName) setRecipientName(extracted.organizationName);
                if (extracted.donationDate) setDonationDate(extracted.donationDate);

                // Smart Category Inference (Simple keyword matching)
                const nameLower = (extracted.organizationName || '').toLowerCase();
                let inferredCat: ZakatRecipientCategory = 'AL_FUQARAA'; // Default

                if (nameLower.includes('relief') || nameLower.includes('aid')) inferredCat = 'AL_FUQARAA';
                else if (nameLower.includes('school') || nameLower.includes('academy') || nameLower.includes('university')) inferredCat = 'FI_SABILILLAH';
                else if (nameLower.includes('mosque') || nameLower.includes('masjid')) inferredCat = 'FI_SABILILLAH';
                else if (nameLower.includes('refugee')) inferredCat = 'IBN_AL_SABIL';

                setCategory(inferredCat);

                // Add note with extra details
                const extraDetails: string[] = [];
                if (extracted.taxId) extraDetails.push(`Tax ID: ${extracted.taxId}`);
                if (extracted.address) extraDetails.push(`Address: ${extracted.address}`);
                if (extracted.campaign) extraDetails.push(`Campaign: ${extracted.campaign}`);

                if (extraDetails.length > 0) {
                    setNotes(prev => prev ? `${prev}\n${extraDetails.join(', ')}` : extraDetails.join('\n'));
                }

                setExtractedViaAI(true);
            }

        } catch (error) {
            console.error("Receipt scanning failed:", error);
            // Fallback (or show error toast) - for now just stop spinner
        } finally {
            setIsExtracting(false);
        }
    }, []);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleReceiptUpload(file);
        }
    };

    const handleSubmit = () => {
        if (!amount || !recipientName) return;

        onSave({
            amount: parseFloat(amount),
            recipient_name: recipientName,
            recipient_category: category,
            donation_date: donationDate,
            notes: notes || undefined,
            receipt_url: receiptUrl || undefined,
            extracted_via_ai: extractedViaAI,
        });

        // Reset form
        setAmount('');
        setRecipientName('');
        setCategory('AL_FUQARAA');
        setDonationDate(new Date().toISOString().split('T')[0]);
        setNotes('');
        setReceiptUrl('');
        setExtractedViaAI(false);
        onClose();
    };

    if (!open) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-card rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <h2 className="text-lg font-semibold text-foreground">Add Donation</h2>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="p-4 space-y-6">
                        {/* Hero: Receipt Upload */}
                        <div className="space-y-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg,.webp"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isExtracting}
                                className={cn(
                                    "w-full border-2 border-dashed rounded-xl p-6 text-center transition-all",
                                    "hover:border-primary hover:bg-primary/5",
                                    isExtracting && "pointer-events-none bg-primary/5 border-primary",
                                    extractedViaAI && "border-primary bg-primary/5"
                                )}
                            >
                                {isExtracting ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <SpinnerGap className="w-8 h-8 animate-spin text-primary" />
                                        <p className="text-sm text-muted-foreground">Extracting from receipt...</p>
                                    </div>
                                ) : extractedViaAI ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <Check className="w-8 h-8 text-primary" weight="bold" />
                                        <p className="text-sm text-primary font-medium">Receipt scanned successfully</p>
                                        <p className="text-xs text-muted-foreground">Review the details below</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Receipt className="w-6 h-6 text-primary" weight="duotone" />
                                        </div>
                                        <p className="font-medium text-foreground">Upload Receipt</p>
                                        <p className="text-xs text-muted-foreground">AI extracts amount, recipient & date</p>
                                    </div>
                                )}
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex-1 border-t border-dashed border-border" />
                            <span>or fill manually</span>
                            <div className="flex-1 border-t border-dashed border-border" />
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-4">
                            {/* Amount */}
                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount *</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                    <Input
                                        id="amount"
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="pl-7"
                                    />
                                </div>
                            </div>

                            {/* Recipient */}
                            <div className="space-y-2">
                                <Label htmlFor="recipient">Recipient *</Label>
                                <Input
                                    id="recipient"
                                    value={recipientName}
                                    onChange={(e) => setRecipientName(e.target.value)}
                                    placeholder="e.g., Islamic Relief USA"
                                />
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <Select value={category} onValueChange={(v) => setCategory(v as ZakatRecipientCategory)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(ZAKAT_RECIPIENT_CATEGORIES).map(([key, value]) => (
                                            <SelectItem key={key} value={key}>
                                                <span className="flex items-center gap-2">
                                                    <span className="text-muted-foreground text-xs">{value.arabic}</span>
                                                    <span>{value.english}</span>
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Date */}
                            <div className="space-y-2">
                                <Label htmlFor="date">Donation Date *</Label>
                                <div className="relative">
                                    <CalendarBlank className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="date"
                                        type="date"
                                        value={donationDate}
                                        onChange={(e) => setDonationDate(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes (optional)</Label>
                                <Textarea
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="e.g., Ramadan campaign"
                                    rows={2}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 p-4 border-t border-border">
                        <Button variant="outline" className="flex-1" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={handleSubmit}
                            disabled={!amount || !recipientName}
                        >
                            Save Donation
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
