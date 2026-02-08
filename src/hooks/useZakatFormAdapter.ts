import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/runtimeClient';
import { ZakatFormData, defaultFormData } from '@/lib/zakatCalculations';
import { AssetAccount, AssetSnapshot, AssetLineItem, ZakatCategory } from '@/types/assets';

// Helper to sum line items by category
const sumByCategory = (items: AssetLineItem[], category: ZakatCategory): number => {
    return items
        .filter(i => i.zakat_category === category)
        .reduce((sum, i) => sum + Number(i.amount), 0);
};

export function useZakatFormAdapter() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAssetsAsFormData = useCallback(async (userId: string): Promise<ZakatFormData | null> => {
        setLoading(true);
        setError(null);

        try {
            // 1. Fetch Portfolio
            const { data: portfolios, error: portError } = await supabase
                .from('portfolios')
                .select('id')
                .eq('user_id', userId)
                .limit(1) as any;

            if (portError) throw portError;
            if (!portfolios || portfolios.length === 0) {
                // No portfolio yet calculation, return default
                return defaultFormData;
            }
            const portfolioId = portfolios[0].id;

            // 2. Fetch Accounts
            const { data: accounts, error: accError } = await supabase
                .from('asset_accounts' as any)
                .select('*')
                .eq('portfolio_id', portfolioId) as any;

            if (accError) throw accError;

            // 3. Fetch Latest Confirmed Snapshot for each account
            // Note: In a real app we might want to let user select date. For now, get latest confirmed.
            // We do this by fetching all snapshots and filtering in JS for simplicity in this V1 adapter
            const accountIds = (accounts as AssetAccount[]).map((a: AssetAccount) => a.id);
            const { data: snapshots, error: snapError } = await supabase
                .from('asset_snapshots' as any)
                .select('*')
                .in('account_id', accountIds)
                .eq('status', 'CONFIRMED')
                .order('statement_date', { ascending: false }) as any;

            if (snapError) throw snapError;

            // Map accountId -> latest snapshot
            const latestSnapshots = new Map<string, AssetSnapshot>();
            (accounts as AssetAccount[]).forEach((acc: AssetAccount) => {
                const snap = (snapshots as AssetSnapshot[])?.find((s: AssetSnapshot) => s.account_id === acc.id);
                if (snap) latestSnapshots.set(acc.id, snap);
            });

            const snapshotIds = Array.from(latestSnapshots.values()).map(s => s.id);

            if (snapshotIds.length === 0) {
                return defaultFormData;
            }

            // 4. Fetch Line Items
            const { data: lineItems, error: itemError } = await supabase
                .from('asset_line_items' as any)
                .select('*')
                .in('snapshot_id', snapshotIds) as any;

            if (itemError) throw itemError;

            // 5. Aggregate into ZakatFormData
            const formData: ZakatFormData = { ...defaultFormData };

            // Helper to find items for a specific account type
            const getItemsForAccountType = (type: string): AssetLineItem[] => {
                const targetAccountIds = (accounts as AssetAccount[]).filter((a: AssetAccount) => a.type === type).map((a: AssetAccount) => a.id);
                const targetSnapshotIds = targetAccountIds.map((id: string) => latestSnapshots.get(id)?.id).filter(Boolean) as string[];
                return (lineItems as AssetLineItem[])?.filter((item: AssetLineItem) => targetSnapshotIds.includes(item.snapshot_id)) || [];
            };

            // --- Liquid Assets ---
            const checkingItems = getItemsForAccountType('CHECKING');
            formData.checkingAccounts = checkingItems.reduce((sum: number, i: AssetLineItem) => sum + Number(i.amount), 0);

            const savingsItems = getItemsForAccountType('SAVINGS');
            formData.savingsAccounts = savingsItems.reduce((sum: number, i: AssetLineItem) => sum + Number(i.amount), 0);

            // --- Brokerage (Split by Zakat Category) ---
            const brokerageItems = getItemsForAccountType('BROKERAGE');

            // Cash in Brokerage -> treated as Savings/Cash
            // We'll map it to savingsAccounts or checkingAccounts? Or create a pseudo field?
            // ZakatCalculations sums checking+savings+cash. So adding to 'cashOnHand' or 'savingsAccounts' is fine.
            // Let's add to savingsAccounts for now as it's liquid cash.
            formData.savingsAccounts += sumByCategory(brokerageItems, 'LIQUID');

            // Stocks (30% Proxy) -> passiveInvestmentsValue
            formData.passiveInvestmentsValue += sumByCategory(brokerageItems, 'PROXY_30');

            // Trading (100% Taxable) -> activeInvestments
            formData.activeInvestments += sumByCategory(brokerageItems, 'PROXY_100');

            // --- Retirement ---
            // 401k
            const k401Items = getItemsForAccountType('RETIREMENT_401K');
            formData.fourOhOneKVestedBalance += sumByCategory(k401Items, 'PROXY_100'); // Assuming normal treatment is full vest balance input
            formData.fourOhOneKVestedBalance += sumByCategory(k401Items, 'PROXY_30'); // Treat same for now, usually 401k is just balance
            // If we classified unvested as EXEMPT
            formData.fourOhOneKUnvestedMatch += sumByCategory(k401Items, 'EXEMPT');

            // IRA
            const iraItems = getItemsForAccountType('RETIREMENT_IRA');
            formData.traditionalIRABalance += sumByCategory(iraItems, 'PROXY_100');
            formData.traditionalIRABalance += sumByCategory(iraItems, 'PROXY_30');

            // Roth
            const rothItems = getItemsForAccountType('ROTH_IRA');
            // Distinction between contributions/earnings is hard if extraction didn't split them.
            // For V1 adapter, map to earnings (conservative) or split 50/50?
            // Ideally LineItem 'raw_category' would be 'CONTRIBUTION' vs 'EARNINGS'.
            // For now, map all to Earnings to be safe (calculated logic allows deductions).
            formData.rothIRAEarnings += rothItems.reduce((sum: number, i: AssetLineItem) => sum + Number(i.amount), 0);

            // --- Crypto ---
            const cryptoItems = getItemsForAccountType('CRYPTO_WALLET');
            formData.cryptoCurrency += cryptoItems.reduce((sum: number, i: AssetLineItem) => sum + Number(i.amount), 0);

            // --- Metals ---
            const metalItems = getItemsForAccountType('METALS');
            formData.goldInvestmentValue += metalItems.reduce((sum: number, i: AssetLineItem) => sum + Number(i.amount), 0);

            setLoading(false);
            return formData;

        } catch (err) {
            console.error("Error fetching zakat assets:", err);
            setError("Failed to load asset data.");
            setLoading(false);
            return null;
        }
    }, []);

    return {
        fetchAssetsAsFormData,
        loading,
        error
    };
}
