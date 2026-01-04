import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Plus, ArrowLeft, Wallet, Spinner } from '@phosphor-icons/react';
import { useAuth } from '@/hooks/useAuth';
import { useAssetPersistence } from '@/hooks/useAssetPersistence';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AccountCard } from '@/components/assets/AccountCard';
import { Footer } from '@/components/zakat/Footer';
import { getPrimaryUrl } from '@/lib/domainConfig';
import { AssetAccount, AssetSnapshot } from '@/types/assets';

export default function Assets() {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { fetchAccounts, fetchSnapshots } = useAssetPersistence();

    const [accounts, setAccounts] = useState<AssetAccount[]>([]);
    const [accountSnapshots, setAccountSnapshots] = useState<Record<string, AssetSnapshot>>({});
    const [loading, setLoading] = useState(true);

    // Load accounts on mount
    useEffect(() => {
        async function loadAccounts() {
            if (!user) return;

            setLoading(true);
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
            setLoading(false);
        }

        loadAccounts();
    }, [user, fetchAccounts, fetchSnapshots]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Spinner className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-background p-4">
                <Helmet>
                    <title>My Assets - ZakatFlow</title>
                    <link rel="canonical" href={getPrimaryUrl('/assets')} />
                </Helmet>
                <div className="max-w-2xl mx-auto pt-20 text-center">
                    <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
                    <p className="text-muted-foreground mb-6">
                        Please sign in to view and manage your connected accounts.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button variant="outline" onClick={() => navigate('/')}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Calculator
                        </Button>
                        <Button onClick={() => navigate('/auth')}>
                            Sign In
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>My Assets - ZakatFlow</title>
                <link rel="canonical" href={getPrimaryUrl('/assets')} />
            </Helmet>

            {/* Header */}
            <header className="border-b border-border bg-card">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold text-foreground">My Assets</h1>
                            <p className="text-sm text-muted-foreground">Manage your connected accounts</p>
                        </div>
                    </div>
                    <Button onClick={() => navigate('/assets/add')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Account
                    </Button>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Spinner className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : accounts.length === 0 ? (
                    /* Empty State */
                    <Card className="text-center py-12">
                        <CardContent>
                            <Wallet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                            <h2 className="text-xl font-semibold mb-2">No Accounts Yet</h2>
                            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                Add your bank, brokerage, and other financial accounts to track your assets for Zakat calculation.
                            </p>
                            <Button onClick={() => navigate('/assets/add')}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Your First Account
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    /* Account Grid */
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
            </main>

            <Footer />
        </div>
    );
}
