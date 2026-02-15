import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ZakatFormData } from '@/lib/zakatTypes';
import { toast } from 'sonner';
import { mapLegacyData, aggregateResults } from '@/lib/documentParserLogic';

interface ParseResult {
    success: boolean;
    data: unknown;
    error?: string;
}

export const useDocumentParser = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const parseDocuments = async (files: File[]): Promise<Partial<ZakatFormData> | null> => {
        setIsUploading(true);
        setProgress(10); // Start

        try {
            const results: Partial<ZakatFormData>[] = [];

            // Process sequentially to update progress
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // 1. Convert to Base64
                const base64Data = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                        const result = reader.result as string;
                        // Remove data:application/pdf;base64, prefix
                        const base64 = result.split(',')[1];
                        resolve(base64);
                    };
                    reader.onerror = error => reject(error);
                });

                setProgress(((i + 0.5) / files.length) * 100);

                // 2. Call Edge Function
                const { data, error } = await supabase.functions.invoke('parse-financial-document', {
                    body: {
                        fileData: base64Data,
                        mimeType: file.type,
                        extractionType: 'financial_statement' // Default for now
                    }
                });

                if (error) {
                    console.error(`Error parsing ${file.name}:`, error);
                    toast.error(`Failed to parse ${file.name}`);
                    continue;
                }

                if (!data?.success) {
                    console.error(`API Error for ${file.name}:`, data?.error);
                    continue;
                }

                // 3. Map Legacy Data to New Structure
                const legacyData = data.data.extractedData;
                const cleanData = mapLegacyData(legacyData);

                results.push(cleanData);
                setProgress(((i + 1) / files.length) * 100);
            }

            // 4. Aggregate results
            const totalData = aggregateResults(results);

            setIsUploading(false);
            return totalData;

        } catch (e) {
            console.error("Upload error:", e);
            setIsUploading(false);
            toast.error("An error occurred during upload.");
            return null;
        }
    };

    return {
        parseDocuments,
        isUploading,
        progress
    };
};
