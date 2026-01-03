import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Plus, Calendar, Loader2, ChevronRight, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAssetPersistence } from '@/hooks/useAssetPersistence';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Footer } from '@/components/zakat/Footer';
import { getPrimaryUrl } from '@/lib/domainConfig';
import { formatCurrency } from '@/lib/zakatCalculations';
import { AssetAccount, AssetSnapshot, AssetLineItem, AccountType } from '@/types/assets';
import { accountTypeLabels, accountTypeIcons } from '@/components/assets/AccountCard';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function AccountDetail() {
    const navigate = useNavigate();
    const { accountId } = useParams<{ accountId: string }>();
    const { user, loading: authLoading } = useAuth();
    const { fetchAccounts, fetchSnapshots, fetchLineItems, deleteAccount } = useAssetPersistence();

    const [account, setAccount] = useState<AssetAccount | null>(null);
    const [snapshots, setSnapshots] = useState<AssetSnapshot[]>([]);
    const [selectedSnapshotId, setSelectedSnapshotId] = useState<string | null>(null);
    const [lineItems, setLineItems] = useState<AssetLineItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingLineItems, setLoadingLineItems] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        if (!accountId) return;

        setIsDeleting(true);
        const success = await deleteAccount(accountId);
        setIsDeleting(false);

        if (success) {
            toast.success('Account deleted successfully');
            navigate('/assets');
        } else {
            toast.error('Failed to delete account');
        }
    };

    // Load account and snapshots
    useEffect(() => {
        async function loadData() {
            if (!user || !accountId) return;

            setLoading(true);
            const accounts = await fetchAccounts();
            const foundAccount = accounts.find(a => a.id === accountId);

            if (foundAccount) {
                setAccount(foundAccount);
                const snapshotList = await fetchSnapshots(accountId);
                setSnapshots(snapshotList);

                // Auto-select first snapshot
                if (snapshotList.length > 0) {
                    setSelectedSnapshotId(snapshotList[0].id);
                }
            }
            setLoading(false);
        }

        loadData();
    }, [user, accountId, fetchAccounts, fetchSnapshots]);

    // Load line items when snapshot changes
    useEffect(() => {
        async function loadLineItems() {
            if (!selectedSnapshotId) return;

            setLoadingLineItems(true);
            const items = await fetchLineItems(selectedSnapshotId);
            setLineItems(items);
            setLoadingLineItems(false);
        }

        loadLineItems();
    }, [selectedSnapshotId, fetchLineItems]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        navigate('/auth');
        return null;
    }

    if (!account) {
        return (
            <div className="min-h-screen bg-background p-4">
                <div className="max-w-2xl mx-auto pt-20 text-center">
                    <h1 className="text-2xl font-bold mb-4">Account Not Found</h1>
                    <Button onClick={() => navigate('/assets')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Assets
                    </Button>
                </div>
            </div>
        );
    }

    const selectedSnapshot = snapshots.find(s => s.id === selectedSnapshotId);

    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>{account.institution_name} - ZakatFlow</title>
                <link rel="canonical" href={getPrimaryUrl(`/assets/${accountId}`)} />
            </Helmet>

            {/* Header */}
            <header className="border-b border-border bg-card">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate('/assets')}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                {accountTypeIcons[account.type]}
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-foreground">{account.institution_name}</h1>
                                <p className="text-sm text-muted-foreground">{account.name}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" disabled={isDeleting}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete this account?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete {account.institution_name} ({account.name}),
                                        including all {snapshots.length} statement{snapshots.length !== 1 ? 's' : ''} and their line items.
                                        This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteAccount}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        {isDeleting ? 'Deleting...' : 'Delete Account'}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <Button variant="outline" onClick={() => navigate('/assets/add')}>
                            <Plus className="w-4 h-4 mr-2" />
                            Upload Statement
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Snapshots List */}
                    <div className="md:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Statement History</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {snapshots.length === 0 ? (
                                    <div className="p-4 text-center text-muted-foreground text-sm">
                                        No statements uploaded yet
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border">
                                        {snapshots.map(snapshot => (
                                            <button
                                                key={snapshot.id}
                                                className={cn(
                                                    "w-full p-3 text-left hover:bg-muted/50 transition-colors flex items-center justify-between",
                                                    selectedSnapshotId === snapshot.id && "bg-muted"
                                                )}
                                                onClick={() => setSelectedSnapshotId(snapshot.id)}
                                            >
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                                        <span className="text-sm font-medium">
                                                            {new Date(snapshot.statement_date).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-0.5">
                                                        {formatCurrency(snapshot.total_value, 'USD')}
                                                    </p>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Line Items */}
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-base">
                                        {selectedSnapshot
                                            ? `Statement from ${new Date(selectedSnapshot.statement_date).toLocaleDateString()}`
                                            : 'Line Items'
                                        }
                                    </CardTitle>
                                    {selectedSnapshot && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Total: {formatCurrency(selectedSnapshot.total_value, 'USD')}
                                        </p>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {loadingLineItems ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                    </div>
                                ) : lineItems.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        {selectedSnapshot ? 'No line items found' : 'Select a statement to view details'}
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="text-left py-2 font-medium">Description</th>
                                                    <th className="text-left py-2 font-medium">Category</th>
                                                    <th className="text-right py-2 font-medium">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {lineItems.map(item => (
                                                    <tr key={item.id} className="hover:bg-muted/30">
                                                        <td className="py-2 max-w-[200px] truncate" title={item.description}>
                                                            {item.description}
                                                        </td>
                                                        <td className="py-2">
                                                            <Badge variant="secondary" className="text-xs">
                                                                {item.zakat_category}
                                                            </Badge>
                                                        </td>
                                                        <td className="py-2 text-right font-medium">
                                                            {formatCurrency(item.amount, item.currency || 'USD')}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
