/**
 * useExtractionFlow Hook
 * 
 * Centralizes the entire document extraction flow:
 * Upload → AI Parse → Review → Persist
 * 
 * This hook is used by both AddAccount.tsx and DocumentUpload.tsx
 * to eliminate code duplication.
 */

import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentParsingV2, ExtractionLineItem, DocumentExtractionResult } from '@/hooks/useDocumentParsingV2';
import { useAssetPersistence } from '@/hooks/useAssetPersistence';

export type ExtractionFlowStatus =
    | 'idle'
    | 'uploading'
    | 'processing'
    | 'reviewing'
    | 'saving'
    | 'success'
    | 'error';

export interface ReviewableData {
    institutionName: string;
    accountName: string;
    documentDate?: string;
    lineItems: ExtractionLineItem[];
    rawResult: DocumentExtractionResult;
}

export interface ConfirmedData {
    institutionName: string;
    accountName: string;
    lineItems: ExtractionLineItem[];
}

interface UseExtractionFlowOptions {
    /** Called after successful persistence */
    onSuccess?: (accountId: string) => void;
    /** Called on error */
    onError?: (error: string) => void;
    /** Optional step ID for wizard context */
    stepId?: string;
}

export function useExtractionFlow(options: UseExtractionFlowOptions = {}) {
    const { onSuccess, onError, stepId } = options;

    const { user } = useAuth();
    const { toast } = useToast();
    const { parseDocument, status: parseStatus, result: parseResult, error: parseError, reset: resetParse } = useDocumentParsingV2();
    const { persistExtraction } = useAssetPersistence();

    const [status, setStatus] = useState<ExtractionFlowStatus>('idle');
    const [reviewData, setReviewData] = useState<ReviewableData | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    /**
     * Start the extraction process with a file
     */
    const startUpload = useCallback(async (file: File) => {
        setSelectedFile(file);
        setError(null);
        setStatus('uploading');

        try {
            setStatus('processing');
            const result = await parseDocument(file);

            if (!result || !result.success) {
                throw new Error(parseError || 'Failed to extract data from document');
            }

            // Prepare reviewable data with fallbacks
            const reviewable: ReviewableData = {
                institutionName: result.institutionName || file.name.replace(/\.[^/.]+$/, ''),
                accountName: result.accountName || file.name.replace(/\.[^/.]+$/, ''),
                documentDate: result.documentDate,
                lineItems: result.lineItems || [],
                rawResult: result,
            };

            setReviewData(reviewable);
            setStatus('reviewing');

        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMsg);
            setStatus('error');
            onError?.(errorMsg);
            toast({
                title: 'Extraction failed',
                description: errorMsg,
                variant: 'destructive',
            });
        }
    }, [parseDocument, parseError, onError, toast]);

    /**
     * Confirm the reviewed data and persist to database
     */
    const confirmReview = useCallback(async (confirmed: ConfirmedData) => {
        if (!user) {
            toast({
                title: 'Not logged in',
                description: 'Please sign in to save your account.',
                variant: 'destructive',
            });
            return;
        }

        setStatus('saving');

        try {
            const result = await persistExtraction(
                confirmed.institutionName,
                reviewData?.documentDate,
                confirmed.lineItems,
                stepId,
                confirmed.accountName
            );

            if (!result.success) {
                throw new Error(result.error || 'Failed to save account');
            }

            setStatus('success');
            toast({
                title: 'Account saved',
                description: `${confirmed.institutionName} added successfully`,
            });

            onSuccess?.(result.accountId || '');

            // Auto-reset after short delay
            setTimeout(() => {
                reset();
            }, 1500);

        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMsg);
            setStatus('error');
            onError?.(errorMsg);
            toast({
                title: 'Save failed',
                description: errorMsg,
                variant: 'destructive',
            });
        }
    }, [user, persistExtraction, reviewData, stepId, onSuccess, onError, toast]);

    /**
     * Cancel and reset the flow
     */
    const reset = useCallback(() => {
        setStatus('idle');
        setReviewData(null);
        setSelectedFile(null);
        setError(null);
        resetParse();
    }, [resetParse]);

    /**
     * Go back to reviewing state (e.g., after error)
     */
    const backToReview = useCallback(() => {
        if (reviewData) {
            setStatus('reviewing');
            setError(null);
        }
    }, [reviewData]);

    return {
        // State
        status,
        reviewData,
        selectedFile,
        error,

        // Actions
        startUpload,
        confirmReview,
        reset,
        backToReview,

        // Derived states for convenience
        isIdle: status === 'idle',
        isLoading: status === 'uploading' || status === 'processing',
        isReviewing: status === 'reviewing',
        isSaving: status === 'saving',
        isSuccess: status === 'success',
        isError: status === 'error',
    };
}
