import { useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useZakatPersistence } from '@/hooks/useZakatPersistence';
import { ZAKAT_PRESETS } from '@zakatflow/core';
import { trackEvent, AnalyticsEvents } from '@/lib/analytics';
import { Madhab } from '@zakatflow/core';

/**
 * Validates if the provided string is a known ZMCS preset ID
 */
function isValidPreset(id: string | null): boolean {
    return !!(id && ZAKAT_PRESETS[id]);
}

/**
 * Hook to handle deep linking into the calculator
 * 
 * Supports:
 * - ?methodology=preset_id (e.g. tahir_anwar)
 * - ?step=step_id (e.g. liquid-assets)
 * - ?step=index (e.g. 2)
 */
export function useCalculatorDeepLink() {
    const [searchParams, setSearchParams] = useSearchParams();
    const {
        updateFormData,
        setStepIndex,
        isLoaded,
        // getting active steps helps map ID to index
        // but typically we can mapped via a static lookup or just trust the ID if consistent
    } = useZakatPersistence();

    // Use a ref to track if we've already applied deep link logic to prevent double-firing
    const processedRef = useRef(false);

    // Helper to find step index by ID
    const getStepIndexById = useCallback((id: string): number | null => {
        // Map of step IDs to their array index in allSteps
        // This must match the order in ZakatWizard.tsx 'allSteps' array
        const stepMap: Record<string, number> = {
            'welcome': 0,
            'setup': 1,
            'upload-first': 2,
            'categories': 3,
            'simple-mode': 4,
            'liquid-assets': 5,
            'investments': 6,
            'retirement': 7,
            'precious-metals': 8,
            'crypto': 9,
            'trusts': 10,
            'real-estate': 11,
            'business': 12,
            'illiquid-assets': 13,
            'debt-owed-to-you': 14,
            'liabilities': 15,
            'tax': 16,
            'results': 17,
        };
        return stepMap[id] ?? null;
    }, []);

    useEffect(() => {
        if (!isLoaded || processedRef.current) return;

        let paramsChanged = false;
        const methodology = searchParams.get('methodology');
        const stepParam = searchParams.get('step');

        // Track new params to be set if we modify them
        const newParams = new URLSearchParams(searchParams);

        // 1. Handle Methodology
        if (isValidPreset(methodology)) {
            console.log(`[DeepLink] Applying methodology: ${methodology}`);
            updateFormData({ madhab: methodology as Madhab });

            trackEvent('DeepLink', AnalyticsEvents.WIZARD.DEEP_LINK, methodology!);

            // SEO Update: Dynamically update document title for shareable links
            const presetName = ZAKAT_PRESETS[methodology!].meta.name;
            document.title = `Calculate Zakat (${presetName}) - ZakatFlow`;

            // Clean up param
            newParams.delete('methodology');
            paramsChanged = true;
        }

        // 2. Handle Step Navigation
        if (stepParam) {
            let stepIndex: number | null = null;

            // Try parsing as number first
            const parsedIndex = parseInt(stepParam, 10);
            if (!isNaN(parsedIndex)) {
                stepIndex = parsedIndex;
            } else {
                // Try mapping ID
                stepIndex = getStepIndexById(stepParam);
            }

            if (stepIndex !== null) {
                console.log(`[DeepLink] Jumping to step: ${stepParam} -> Index ${stepIndex}`);
                setStepIndex(stepIndex);

                newParams.delete('step');
                paramsChanged = true;

                trackEvent('DeepLink', AnalyticsEvents.WIZARD.JUMP_TO_STEP, stepParam!);
            } else {
                console.warn(`[DeepLink] Invalid step parameter: ${stepParam}`);
            }
        }

        // 3. Handle Full Data Hydration (Report View)
        const encodedData = searchParams.get('data');
        if (encodedData) {
            try {
                const jsonString = atob(encodedData);
                const loadedData = JSON.parse(jsonString);

                // TODO: Add Zod schema validation here for safety

                console.log(`[DeepLink] Hydrating full state from URL`);
                updateFormData(loadedData);

                // If data provided, assume they want to see results
                const resultsIndex = getStepIndexById('results');
                if (resultsIndex !== null) {
                    setStepIndex(resultsIndex);
                }

                trackEvent('DeepLink', AnalyticsEvents.WIZARD.HYDRATE, 'success');
                newParams.delete('data');
                paramsChanged = true;
            } catch (e) {
                console.error('[DeepLink] Failed to parse data param', e);
            }
        }

        // Mark as processed so we don't re-run on every render
        // This prevents sticky params if cleanup fails or during strict mode double-invocations
        if (paramsChanged) {
            processedRef.current = true;
            setSearchParams(newParams, { replace: true });
        }

    }, [isLoaded, searchParams, setSearchParams, updateFormData, setStepIndex, getStepIndexById]);

    return {};
}
