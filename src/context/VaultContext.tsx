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
