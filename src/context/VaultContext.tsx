/**
 * VaultProvider
 * 
 * Provides Privacy Vault context to the entire app.
 * Exports the vault hook for use in data persistence layers.
 */

import { createContext, useContext, ReactNode } from 'react';
import { usePrivacyVault, type UsePrivacyVaultReturn } from '@/hooks/usePrivacyVault';

const VaultContext = createContext<UsePrivacyVaultReturn | null>(null);

interface VaultProviderProps {
    children: ReactNode;
}

export function VaultProvider({ children }: VaultProviderProps) {
    const vault = usePrivacyVault();

    return (
        <VaultContext.Provider value={vault}>
            {children}
        </VaultContext.Provider>
    );
}

/**
 * Hook to access the vault from any component
 */
export function useVault(): UsePrivacyVaultReturn {
    const context = useContext(VaultContext);
    if (!context) {
        throw new Error('useVault must be used within a VaultProvider');
    }
    return context;
}

/**
 * Optional vault hook that returns null if not in provider
 * Useful for gradual migration
 */
export function useOptionalVault(): UsePrivacyVaultReturn | null {
    return useContext(VaultContext);
}
