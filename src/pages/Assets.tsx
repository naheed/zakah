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

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Plus, ArrowLeft, Wallet, Spinner, FileText, ShieldCheck, LockKey } from '@phosphor-icons/react';
import { useAuth } from '@/hooks/useAuth';
import { useAssetPersistence } from '@/hooks/useAssetPersistence';
import { useZakatPersistence } from '@/hooks/useZakatPersistence'; // Added for local docs
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AccountCard } from '@/components/assets/AccountCard';
import { Footer } from '@/components/zakat/Footer';
import { getPrimaryUrl } from '@/lib/domainConfig';
import { AssetAccount, AssetSnapshot } from '@/types/assets';
import { formatCurrency } from '@/lib/zakatCalculations';
import { UploadedDocument } from '@/lib/documentTypes';
import { Badge } from "@/components/ui/badge";

export default function Assets() {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { fetchAccounts, fetchSnapshots } = useAssetPersistence();
    const { uploadedDocuments } = useZakatPersistence(); // Get local docs

    const [accounts, setAccounts] = useState<AssetAccount[]>([]);
    const [accountSnapshots, setAccountSnapshots] = useState<Record<string, AssetSnapshot>>({});
    const [loading, setLoading] = useState(true);

    // Load accounts only if user is logged in
    useEffect(() => {
        async function loadAccounts() {
            if (!user) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const accountList = await fetchAccounts();
                setAccounts(accountList);

                // Fetch latest snapshot for each account
                const snapshots: Record<string, AssetSnapshot> = {};
                for (const account of accountList) {
                    const accountSnapshots = await fetchSnapshots(account.id);
                    if (accountSnapshots.length > 0) {
                        snapshots[account.id] = accountSnapshots[0]; // Most recent
                    }
                }
                setAccountSnapshots(snapshots);
            } catch (error) {
                console.error("Failed to load assets", error);
            } finally {
                setLoading(false);
            }
        }

        loadAccounts();
    }, [user, fetchAccounts, fetchSnapshots]);

    // Helper to calculate total value of a document
    const getDocumentValue = (doc: UploadedDocument) => {
        return Object.values(doc.extractedData).reduce<number>((sum, val) => {
            if (typeof val === 'number') return sum + val;
            return sum;
        }, 0);
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Spinner className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <Helmet>
                <title>My Assets | ZakatFlow</title>
                <link rel="canonical" href={getPrimaryUrl('/assets')} />
            </Helmet>

            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="container mx-auto px-4 h-16 max-w-4xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="rounded-full -ml-2">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">My Assets</h1>
                        </div>
                    </div>
                    {user && (
                        <Button onClick={() => navigate('/assets/add')} size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Account
                        </Button>
                    )}
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">

                {/* Section: Local Vault Documents */}
                {uploadedDocuments.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                Local Documents
                            </h2>
                            <span className="text-xs font-medium px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full dark:bg-indigo-950 dark:text-indigo-300">
                                Stored on device
                            </span>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {uploadedDocuments.map((doc) => {
                                const totalValue = getDocumentValue(doc);
                                const date = new Date(doc.uploadedAt);

                                return (
                                    <Card key={doc.id} className="hover:shadow-md transition-all">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                                <Badge variant="secondary" className="text-[10px]">
                                                    {doc.fileName ? 'PDF' : 'Upload'}
                                                </Badge>
                                            </div>

                                            <div className="space-y-1 mb-3">
                                                <h3 className="font-medium text-foreground truncate" title={doc.fileName || "Uploaded Document"}>
                                                    {doc.fileName || "Uploaded Document"}
                                                </h3>
                                                <p className="text-xs text-muted-foreground">
                                                    {date.toLocaleDateString()}
                                                </p>
                                            </div>

                                            <div className="pt-3 border-t border-border flex items-center justify-between">
                                                <span className="text-xs text-muted-foreground">Extracted Value</span>
                                                <span className="font-bold text-sm">
                                                    {formatCurrency(totalValue)}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Section: Connected Accounts */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Wallet className="w-5 h-5 text-emerald-500" />
                            Connected Accounts
                        </h2>
                        {user && (
                            <span className="text-xs font-medium px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full dark:bg-emerald-950 dark:text-emerald-300">
                                Synced to cloud
                            </span>
                        )}
                    </div>

                    {!user ? (
                        <Card className="bg-muted/50 border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-4 shadow-sm">
                                    <LockKey className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Connect Live Accounts</h3>
                                <p className="text-muted-foreground max-w-sm mb-6">
                                    Sign in to securely connect your bank accounts, brokerage, and crypto wallets for automatic Zakat tracking.
                                </p>
                                <Button onClick={() => navigate('/auth')}>
                                    Sign In to Connect
                                </Button>
                            </CardContent>
                        </Card>
                    ) : loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Spinner className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : accounts.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <Wallet className="w-12 h-12 mb-4 text-muted-foreground/50" />
                                <h3 className="text-lg font-semibold mb-2">No Accounts Connected</h3>
                                <p className="text-muted-foreground max-w-sm mb-6">
                                    Add your financial accounts to automatically track assets.
                                </p>
                                <Button onClick={() => navigate('/assets/add')}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add First Account
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {accounts.map((account) => {
                                const snapshot = accountSnapshots[account.id];
                                return (
                                    <AccountCard
                                        key={account.id}
                                        account={account}
                                        latestValue={snapshot?.total_value}
                                        lastUpdated={snapshot?.statement_date}
                                        onClick={() => navigate(`/assets/${account.id}`)}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}


