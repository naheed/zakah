/**
 * VaultGuard
 * 
 * Orchestrates the Privacy Vault flow:
 * 1. If vault needs setup → Show persistence choice → Show recovery phrase
 * 2. If vault needs phrase → Show recovery input
 * 3. If vault unlocked → Render children
 * 
 * Can be used to wrap protected routes/components.
 */

import { useState, useCallback, ReactNode } from 'react';
import { Spinner } from '@phosphor-icons/react';
import { usePrivacyVault } from '@/hooks/usePrivacyVault';
import { PersistenceChoiceModal } from './PersistenceChoiceModal';
import { RecoveryPhraseDisplayModal } from './RecoveryPhraseDisplayModal';
import { RecoveryPhraseInputModal } from './RecoveryPhraseInputModal';
import type { PersistenceMode } from '@/lib/CryptoService';

interface VaultGuardProps {
    children: ReactNode;
    /** 
     * Optional fallback to show while vault is loading.
     * If not provided, shows a centered spinner.
     */
    loadingFallback?: ReactNode;
    /**
     * If true, allows children to render without vault setup.
     * Useful for pages where vault is optional (calculator first experience).
     */
    optional?: boolean;
}

type SetupStep = 'idle' | 'choice' | 'phrase' | 'complete';

export function VaultGuard({
    children,
    loadingFallback,
    optional = false
}: VaultGuardProps) {
    const {
        status,
        initializeVault,
        unlockVault
    } = usePrivacyVault();

    // Setup flow state - tracks the multi-step setup independently from vault status
    const [setupStep, setSetupStep] = useState<SetupStep>('idle');
    const [generatedPhrase, setGeneratedPhrase] = useState<string>('');
    const [isInitializing, setIsInitializing] = useState(false);
    const [initError, setInitError] = useState<string | null>(null);
    const [setupDismissed, setSetupDismissed] = useState(false);

    // Determine if we should show the setup flow
    const needsSetup = status === 'needs_setup';
    const showSetupFlow = !setupDismissed && (needsSetup || (setupStep !== 'idle' && setupStep !== 'complete'));

    // Handle persistence mode selection
    const handlePersistenceChoice = useCallback(async (mode: PersistenceMode) => {
        setIsInitializing(true);
        setInitError(null);

        try {
            console.log('[VaultGuard] Initializing vault with mode:', mode);
            const { phrase } = await initializeVault(mode);
            console.log('[VaultGuard] Vault initialized, showing phrase');
            setGeneratedPhrase(phrase);
            setSetupStep('phrase');
        } catch (error) {
            console.error('[VaultGuard] Initialization failed:', error);
            setInitError(error instanceof Error ? error.message : 'Failed to initialize vault');
        } finally {
            setIsInitializing(false);
        }
    }, [initializeVault]);

    const handleDismissSetup = useCallback(() => {
        setSetupDismissed(true);
        setSetupStep('idle');
    }, []);

    // Handle phrase confirmation
    const handlePhraseConfirm = useCallback(() => {
        console.log('[VaultGuard] Phrase confirmed, completing setup');
        setGeneratedPhrase(''); // Clear from memory immediately
        setSetupStep('complete');
    }, []);

    // Handle recovery phrase submission
    const handleRecoverySubmit = useCallback(async (phrase: string) => {
        await unlockVault(phrase);
    }, [unlockVault]);

    // Loading state
    if (status === 'loading') {
        return loadingFallback || (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Spinner className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // Optional mode: allow children without vault if no setup has been started or if dismissed
    if (optional && needsSetup && (setupStep === 'idle' || setupDismissed)) {
        return <>{children}</>;
    }

    // Setup flow: Show modals on top of children
    if (showSetupFlow && setupStep !== 'complete') {
        // Start the setup flow if needed
        if (needsSetup && setupStep === 'idle') {
            // Auto-trigger setup flow
            setSetupStep('choice');
        }

        return (
            <>
                {children}

                {/* Step 1: Choose persistence mode */}
                <PersistenceChoiceModal
                    open={setupStep === 'choice'}
                    onSelect={handlePersistenceChoice}
                    onDismiss={handleDismissSetup}
                />

                {/* Step 2: Display and confirm recovery phrase */}
                <RecoveryPhraseDisplayModal
                    open={setupStep === 'phrase'}
                    phrase={generatedPhrase}
                    onConfirm={handlePhraseConfirm}
                />
            </>
        );
    }

    // Needs recovery phrase (existing user on new device)
    if (status === 'needs_phrase') {
        return (
            <>
                {children}
                <RecoveryPhraseInputModal
                    open={true}
                    onSubmit={handleRecoverySubmit}
                />
            </>
        );
    }

    // Unlocked or setup complete: render children normally
    return <>{children}</>;
}
