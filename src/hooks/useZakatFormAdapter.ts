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
                .limit(1);

            if (portError) throw portError;
            if (!portfolios || portfolios.length === 0) {
                // No portfolio yet calculation, return default
                return defaultFormData;
            }
            const portfolioId = (portfolios[0] as { id: string }).id;

            // 2. Fetch Accounts
            const { data: accounts, error: accError } = await supabase
                .from('asset_accounts')
                .select('*')
                .eq('portfolio_id', portfolioId);

            if (accError) throw accError;
            if (!accounts) return defaultFormData;

            const typedAccounts = accounts as AssetAccount[];

            // 3. Fetch Latest Confirmed Snapshot for each account
            const accountIds = typedAccounts.map(a => a.id);
            if (accountIds.length === 0) return defaultFormData;

            const { data: snapshots, error: snapError } = await supabase
                .from('asset_snapshots')
                .select('*')
                .in('account_id', accountIds)
                .eq('status', 'CONFIRMED')
                .order('statement_date', { ascending: false });

            if (snapError) throw snapError;

            const typedSnapshots = (snapshots || []) as AssetSnapshot[];

            // Map accountId -> latest snapshot
            const latestSnapshots = new Map<string, AssetSnapshot>();
            typedAccounts.forEach(acc => {
                const snap = typedSnapshots.find(s => s.account_id === acc.id);
                if (snap) latestSnapshots.set(acc.id, snap);
            });

            const snapshotIds = Array.from(latestSnapshots.values()).map(s => s.id);

            if (snapshotIds.length === 0) {
                return defaultFormData;
            }

            // 4. Fetch Line Items
            const { data: lineItems, error: itemError } = await supabase
                .from('asset_line_items')
                .select('*')
                .in('snapshot_id', snapshotIds);

            if (itemError) throw itemError;

            const typedLineItems = (lineItems || []) as AssetLineItem[];

            // 5. Aggregate into ZakatFormData
            const formData: ZakatFormData = { ...defaultFormData };

            // Helper to find items for a specific account type
            const getItemsForAccountType = (type: string) => {
                const targetAccountIds = typedAccounts.filter(a => a.type === type).map(a => a.id);
                const targetSnapshotIds = targetAccountIds.map(id => latestSnapshots.get(id)?.id).filter(Boolean) as string[];
                return typedLineItems.filter(item => targetSnapshotIds.includes(item.snapshot_id));
            };

            // --- Liquid Assets ---
            const checkingItems = getItemsForAccountType('CHECKING');
            formData.checkingAccounts = checkingItems.reduce((sum, i) => sum + Number(i.amount), 0);

            const savingsItems = getItemsForAccountType('SAVINGS');
            formData.savingsAccounts = savingsItems.reduce((sum, i) => sum + Number(i.amount), 0);

            // --- Brokerage (Split by Zakat Category) ---
            const brokerageItems = getItemsForAccountType('BROKERAGE');

            // Cash in Brokerage -> treated as Savings/Cash
            formData.savingsAccounts += sumByCategory(brokerageItems, 'LIQUID');

            // Stocks (30% Proxy) -> passiveInvestmentsValue
            formData.passiveInvestmentsValue += sumByCategory(brokerageItems, 'PROXY_30');

            // Trading (100% Taxable) -> activeInvestments
            formData.activeInvestments += sumByCategory(brokerageItems, 'PROXY_100');

            // --- Retirement ---
            // 401k
            const k401Items = getItemsForAccountType('RETIREMENT_401K');
            formData.fourOhOneKVestedBalance += sumByCategory(k401Items, 'PROXY_100');
            formData.fourOhOneKVestedBalance += sumByCategory(k401Items, 'PROXY_30');
            formData.fourOhOneKUnvestedMatch += sumByCategory(k401Items, 'EXEMPT');

            // IRA
            const iraItems = getItemsForAccountType('RETIREMENT_IRA');
            formData.traditionalIRABalance += sumByCategory(iraItems, 'PROXY_100');
            formData.traditionalIRABalance += sumByCategory(iraItems, 'PROXY_30');

            // Roth
            const rothItems = getItemsForAccountType('ROTH_IRA');
            formData.rothIRAEarnings += rothItems.reduce((sum, i) => sum + Number(i.amount), 0);

            // --- Crypto ---
            const cryptoItems = getItemsForAccountType('CRYPTO_WALLET');
            formData.cryptoCurrency += cryptoItems.reduce((sum, i) => sum + Number(i.amount), 0);

            // --- Metals ---
            const metalItems = getItemsForAccountType('METALS');
            formData.goldInvestmentValue += metalItems.reduce((sum, i) => sum + Number(i.amount), 0);

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
