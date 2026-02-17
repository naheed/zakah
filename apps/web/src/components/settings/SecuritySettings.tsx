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
 */

import React, { useState } from 'react';
import { ShieldCheck, Key, Info, WarningOctagon, Copy, Check } from '@phosphor-icons/react';
import { SettingsSection, SettingsCard } from './SettingsContainers';
import { SettingsRow } from './SettingsRow';
import { usePrivacyVault } from '@/hooks/usePrivacyVault';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export function SecuritySettings() {
    const { persistenceMode, status, initializeVault } = usePrivacyVault();
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [phrase, setPhrase] = useState<string | null>(null);
    const [hasCopied, setHasCopied] = useState(false);

    const isSovereign = persistenceMode === 'sovereign';

    const handleUpgrade = async () => {
        try {
            const result = await initializeVault('sovereign');
            if (result.phrase) {
                setPhrase(result.phrase);
                toast.success('Privacy Vault upgraded to Sovereign Mode');
            }
        } catch (error) {
            console.error('Upgrade failed:', error);
            toast.error('Failed to upgrade security mode');
        }
    };

    const copyPhrase = () => {
        if (!phrase) return;
        navigator.clipboard.writeText(phrase);
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 2000);
        toast.success('Recovery phrase copied to clipboard');
    };

    return (
        <SettingsSection title="Security & Encryption">
            <SettingsCard>
                <SettingsRow
                    icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
                    label="Encryption Mode"
                    value={
                        <Badge variant={isSovereign ? "default" : "secondary"} className="font-mono">
                            {isSovereign ? "SOVEREIGN" : "MANAGED"}
                        </Badge>
                    }
                    description={
                        isSovereign
                            ? "Zero-knowledge: You hold the recovery phrase."
                            : "Seamless: Encryption key is managed by your login session."
                    }
                    hasChevron={false}
                />

                {!isSovereign && (
                    <div className="p-4 bg-muted/30 border-t border-border/50">
                        <div className="flex gap-3 items-start mb-4">
                            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-muted-foreground">
                                Managed mode is frictionless but custodial. Upgrade to Sovereign mode to ensure only you can ever access your data, even if our servers are compromised.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full justify-start gap-2"
                            onClick={() => setIsUpgrading(true)}
                        >
                            <Key className="w-4 h-4" />
                            Upgrade to Sovereign Mode
                        </Button>
                    </div>
                )}
            </SettingsCard>

            <Dialog open={isUpgrading} onOpenChange={setIsUpgrading}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <WarningOctagon className="w-6 h-6 text-amber-500" />
                            Sovereign Mode Upgrade
                        </DialogTitle>
                        <DialogDescription>
                            This will generate a 12-word recovery phrase. You must save this phrase to access your data on new devices. **If you lose this phrase, we cannot recover your data.**
                        </DialogDescription>
                    </DialogHeader>

                    {phrase ? (
                        <div className="space-y-4 py-4">
                            <div className="p-4 bg-secondary/50 rounded-lg font-mono text-sm leading-relaxed text-center break-words select-all">
                                {phrase}
                            </div>
                            <Button
                                variant="outline"
                                className="w-full gap-2"
                                onClick={copyPhrase}
                            >
                                {hasCopied ? <Check className="text-emerald-500" /> : <Copy />}
                                {hasCopied ? "Copied!" : "Copy Recovery Phrase"}
                            </Button>
                            <p className="text-xs text-center text-muted-foreground">
                                Make sure to store this somewhere safe (like a password manager).
                            </p>
                        </div>
                    ) : (
                        <div className="py-6 flex flex-col items-center justify-center gap-4">
                            <p className="text-sm text-center">
                                Are you sure you want to switch to Sovereign mode? This process is encryption-level and cannot be undone without resetting your vault.
                            </p>
                        </div>
                    )}

                    <DialogFooter>
                        {!phrase ? (
                            <>
                                <Button variant="ghost" onClick={() => setIsUpgrading(false)}>Cancel</Button>
                                <Button onClick={handleUpgrade} className="bg-emerald-600 hover:bg-emerald-700">
                                    I Understand, Generate Phrase
                                </Button>
                            </>
                        ) : (
                            <Button className="w-full" onClick={() => setIsUpgrading(false)}>
                                I've Saved the Phrase
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </SettingsSection>
    );
}
