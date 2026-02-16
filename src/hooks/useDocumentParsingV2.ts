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

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/runtimeClient';
import { ZakatFormData } from '@/lib/zakatCalculations';

// V2 Line Item structure from Edge Function
export interface ExtractionLineItem {
    description: string;
    amount: number;
    inferredCategory: string;
    confidence?: number;
}

// Full response from the V2 Edge Function
export interface DocumentExtractionResult {
    success: boolean;
    // V2 granular data
    lineItems: ExtractionLineItem[];
    // Legacy aggregated data (for backward compatibility)
    extractedData: Partial<ZakatFormData>;
    // Metadata
    summary: string;
    documentDate?: string;
    institutionName?: string;
    accountName?: string;  // Account type/name
    accountId?: string;    // Last 4 digits
    accountType?: string;  // Detected account container type (RETIREMENT_401K, BROKERAGE, etc.)
    notes?: string;
    error?: string;
}

export type ExtractionStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

export function useDocumentParsingV2() {
    const [status, setStatus] = useState<ExtractionStatus>('idle');
    const [result, setResult] = useState<DocumentExtractionResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const parseDocument = useCallback(async (file: File): Promise<DocumentExtractionResult | null> => {
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            setError('File too large. Maximum size is 10MB.');
            setStatus('error');
            return null;
        }

        // Validate file type
        const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setError('Invalid file type. Please upload a PDF or image (PNG, JPG, WebP).');
            setStatus('error');
            return null;
        }

        setStatus('uploading');
        setResult(null);
        setError(null);

        try {
            // Convert file to base64
            const base64 = await fileToBase64(file);

            setStatus('processing');

            // Determine document type from filename
            const documentType = inferDocumentType(file.name);

            // Call edge function
            const { data, error: invokeError } = await supabase.functions.invoke('parse-financial-document', {
                body: {
                    documentBase64: base64,
                    documentType,
                    mimeType: file.type,
                },
            });

            if (invokeError) {
                // Try to extract error message from the response
                const errorMsg = invokeError.message || 'Edge function error';
                console.error('Edge function invoke error:', invokeError);
                throw new Error(errorMsg);
            }

            if (!data) {
                throw new Error('No response from document parser');
            }

            if (data.error) {
                throw new Error(data.error);
            }

            const extractionResult: DocumentExtractionResult = {
                success: true,
                lineItems: data.lineItems || [],
                extractedData: data.extractedData || {},
                summary: data.summary || 'Data extracted successfully',
                documentDate: data.documentDate,
                institutionName: data.institutionName,
                accountName: data.accountName,
                accountId: data.accountId,
                accountType: data.accountType,
                notes: data.notes,
            };

            setStatus('success');
            setResult(extractionResult);
            return extractionResult;

        } catch (err) {
            console.error('Document parsing error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to process document';
            setError(errorMessage);
            setStatus('error');
            setResult({
                success: false,
                lineItems: [],
                extractedData: {},
                summary: '',
                error: errorMessage,
            });
            return null;
        }
    }, []);

    const reset = useCallback(() => {
        setStatus('idle');
        setResult(null);
        setError(null);
    }, []);

    return {
        parseDocument,
        reset,
        status,
        result,
        error,
    };
}

// --- Helper Functions ---

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            // Remove the data URL prefix (e.g., "data:image/png;base64,")
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function inferDocumentType(filename: string): string {
    const lower = filename.toLowerCase();
    if (lower.includes('401k') || lower.includes('401(k)')) return '401(k) statement';
    if (lower.includes('ira')) return 'IRA statement';
    if (lower.includes('roth')) return 'Roth IRA statement';
    if (lower.includes('brokerage') || lower.includes('invest') || lower.includes('schwab') || lower.includes('fidelity') || lower.includes('vanguard')) return 'brokerage statement';
    if (lower.includes('bank') || lower.includes('checking') || lower.includes('savings') || lower.includes('chase') || lower.includes('bofa')) return 'bank statement';
    if (lower.includes('crypto') || lower.includes('coinbase') || lower.includes('binance')) return 'cryptocurrency statement';
    if (lower.includes('credit')) return 'credit card statement';
    return 'financial statement';
}
