import { useState } from 'react';
import { useZakatFormAdapter } from '@/hooks/useZakatFormAdapter';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/runtimeClient';
import type { ZakatFormData } from '@/lib/zakatCalculations';

export default function ZakatAdapterTest() {
    const { user } = useAuth();
    const { fetchAssetsAsFormData, loading, error } = useZakatFormAdapter();
    const [result, setResult] = useState<ZakatFormData | null>(null);
    const [seedStatus, setSeedStatus] = useState<string>('');

    const handleFetch = async () => {
        if (!user) {
            setSeedStatus('Error: You must be logged in to use this.');
            alert("Please log in first to fetch data.");
            return;
        }
        const data = await fetchAssetsAsFormData(user.id);
        setResult(data);
    };

    const seedTestData = async () => {
        if (!user) {
            setSeedStatus('Error: You must be logged in to use this.');
            alert("Please log in first to seed data.");
            return;
        }
        setSeedStatus('Seeding...');
        try {
            // 1. Create Portfolio
            const { data: port, error: portError } = await supabase
                .from('portfolios')
                .insert({ user_id: user.id, currency: 'USD' })
                .select()
                .single();
            if (portError) throw portError;

            // 2. Create Brokerage Account
            const { data: acc, error: accError } = await supabase
                .from('asset_accounts')
                .insert({
                    portfolio_id: port.id,
                    name: 'Schwab Debug Brokerage',
                    institution_name: 'Charles Schwab',
                    type: 'BROKERAGE'
                })
                .select()
                .single();
            if (accError) throw accError;

            // 3. Create Snapshot
            const { data: snap, error: snapError } = await supabase
                .from('asset_snapshots')
                .insert({
                    account_id: acc.id,
                    statement_date: new Date().toISOString(),
                    total_value: 100000,
                    method: 'MANUAL',
                    status: 'CONFIRMED'
                })
                .select()
                .single();
            if (snapError) throw snapError;

            // 4. Create Line Items
            await supabase.from('asset_line_items').insert([
                {
                    snapshot_id: snap.id,
                    description: 'Cash Balance',
                    amount: 10000,
                    zakat_category: 'LIQUID', // Should map to savingsAccounts
                    raw_category: 'CASH'
                },
                {
                    snapshot_id: snap.id,
                    description: 'Apple Stock (AAPL)',
                    amount: 50000,
                    zakat_category: 'PROXY_30', // Should map to passiveInvestmentsValue
                    raw_category: 'EQUITY'
                },
                {
                    snapshot_id: snap.id,
                    description: 'Active Trading Crypto',
                    amount: 40000,
                    zakat_category: 'PROXY_100', // Should map to activeInvestments
                    raw_category: 'CRYPTO'
                }
            ]);

            setSeedStatus('Success! Created Portfolio -> Account -> Snapshot -> Items');
        } catch (e: unknown) {
            setSeedStatus('Error: ' + (e instanceof Error ? e.message : 'Unknown error'));
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>V2 Adapter Verification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">

                    <div className="p-4 border rounded-md bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <h3 className="text-sm font-semibold mb-1">Status</h3>
                        <div className="text-sm font-mono flex items-center gap-2">
                            <span className="text-slate-500">Auth:</span>
                            <span className={user ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                                {user ? `Logged in (${user.email})` : 'NOT LOGGED IN'}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button onClick={seedTestData} variant="outline" disabled={!user}>
                            Seed Test Data (V2 Tables)
                        </Button>
                        <Button onClick={handleFetch} disabled={!user}>
                            Fetch via Adapter Hook
                        </Button>
                    </div>

                    {seedStatus && (
                        <div className={`p-3 rounded text-sm font-medium ${seedStatus.startsWith('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {seedStatus}
                        </div>
                    )}

                    {loading && <div className="text-sm text-slate-500 animate-pulse">Loading data...</div>}
                    {error && <div className="p-3 bg-red-100 text-red-800 rounded text-sm">{error}</div>}

                    {result && (
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="space-y-2">
                                <h3 className="font-bold text-sm">Expected Output:</h3>
                                <ul className="list-disc pl-5 text-sm space-y-1 text-slate-600">
                                    <li>Cash ($10k) &rarr; <span className="font-mono text-xs">savingsAccounts</span></li>
                                    <li>AAPL ($50k) &rarr; <span className="font-mono text-xs">passiveInvestmentsValue</span></li>
                                    <li>Trading ($40k) &rarr; <span className="font-mono text-xs">activeInvestments</span></li>
                                </ul>
                            </div>
                            <div className="relative">
                                <h3 className="font-bold text-sm mb-2">Actual Result (JSON):</h3>
                                <div className="p-4 bg-slate-950 text-green-400 rounded-md font-mono text-xs overflow-auto h-96 border border-slate-800 shadow-inner">
                                    <pre>{JSON.stringify(result, null, 2)}</pre>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
