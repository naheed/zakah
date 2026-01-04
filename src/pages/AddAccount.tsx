import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    ArrowLeft,
    UploadSimple,
    PencilSimple,
    Link,
    CaretRight,
    FileText,
    Spinner
} from '@phosphor-icons/react';
import { useAuth } from '@/hooks/useAuth';
import { useExtractionFlow } from '@/hooks/useExtractionFlow';
import { useAssetPersistence } from '@/hooks/useAssetPersistence';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Footer } from '@/components/zakat/Footer';
import { ExtractionReview } from '@/components/zakat/ExtractionReview';
import { getPrimaryUrl } from '@/lib/domainConfig';
import { AccountType } from '@/types/assets';
import { accountTypeLabels } from '@/components/assets/AccountCard';

type AddMethod = 'select' | 'upload' | 'manual' | 'api';

export default function AddAccount() {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const { persistExtraction } = useAssetPersistence();

    // Use the centralized extraction flow hook for uploads
    const extractionFlow = useExtractionFlow({
        onSuccess: () => navigate('/assets'),
    });

    const [method, setMethod] = useState<AddMethod>('select');
    const [saving, setSaving] = useState(false);

    // Manual entry state
    const [institutionName, setInstitutionName] = useState('');
    const [accountName, setAccountName] = useState('');
    const [accountType, setAccountType] = useState<AccountType>('CHECKING');
    const [balance, setBalance] = useState('');

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await extractionFlow.startUpload(file);
    };

    const handleSaveManual = async () => {
        if (!institutionName || !balance || !user) return;

        setSaving(true);
        try {
            const lineItems = [{
                description: accountName || 'Total Balance',
                amount: parseFloat(balance),
                inferredCategory: accountType,
                confidence: 1.0,
            }];

            const result = await persistExtraction(
                institutionName,
                new Date().toISOString().split('T')[0],
                lineItems,
                undefined,
                accountName
            );

            if (result.success) {
                toast({
                    title: 'Account added',
                    description: `${institutionName} saved successfully`,
                });
                navigate('/assets');
            } else {
                throw new Error(result.error);
            }
        } catch (err) {
            toast({
                title: 'Error saving',
                description: err instanceof Error ? err.message : 'Failed to save account',
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Spinner className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        navigate('/auth');
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>Add Account - ZakatFlow</title>
                <link rel="canonical" href={getPrimaryUrl('/assets/add')} />
            </Helmet>

            {/* Header */}
            <header className="border-b border-border bg-card">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/assets')}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">Add Account</h1>
                        <p className="text-sm text-muted-foreground">Connect a new financial account</p>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-2xl mx-auto px-4 py-8">
                {method === 'select' && (
                    <div className="space-y-4">
                        <MethodCard
                            icon={<UploadSimple className="w-6 h-6" />}
                            title="Upload Statement"
                            description="Import data from a PDF or image of your financial statement"
                            onClick={() => setMethod('upload')}
                        />
                        <MethodCard
                            icon={<PencilSimple className="w-6 h-6" />}
                            title="Manual Entry"
                            description="Add an account by entering the details yourself"
                            onClick={() => setMethod('manual')}
                        />
                        <MethodCard
                            icon={<Link className="w-6 h-6" />}
                            title="Connect Bank"
                            description="Automatically sync with your bank (coming soon)"
                            disabled
                            onClick={() => { }}
                        />
                    </div>
                )}

                {method === 'upload' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload Statement</CardTitle>
                            <CardDescription>
                                Upload a bank or brokerage statement to automatically extract account data
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Show different UI based on extraction flow status */}
                            {extractionFlow.isIdle && (
                                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                                    <input
                                        type="file"
                                        accept=".pdf,.png,.jpg,.jpeg,.webp"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                        <div className="space-y-2">
                                            <FileText className="w-8 h-8 mx-auto text-muted-foreground" />
                                            <p className="font-medium">Click to upload</p>
                                            <p className="text-sm text-muted-foreground">PDF, PNG, JPG, WebP up to 10MB</p>
                                        </div>
                                    </label>
                                </div>
                            )}

                            {extractionFlow.isLoading && (
                                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                                    <Spinner className="w-8 h-8 mx-auto animate-spin text-primary" />
                                    <p className="text-sm text-muted-foreground mt-2">Analyzing document...</p>
                                </div>
                            )}

                            {extractionFlow.isReviewing && extractionFlow.reviewData && (
                                <ExtractionReview
                                    initialData={{
                                        institutionName: extractionFlow.reviewData.institutionName,
                                        accountName: extractionFlow.reviewData.accountName,
                                        lineItems: extractionFlow.reviewData.lineItems
                                    }}
                                    onConfirm={extractionFlow.confirmReview}
                                    onCancel={extractionFlow.reset}
                                    isSaving={extractionFlow.isSaving}
                                />
                            )}

                            {extractionFlow.isSuccess && (
                                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
                                    <p className="font-medium text-green-800 dark:text-green-200">
                                        ✓ Account saved successfully!
                                    </p>
                                </div>
                            )}

                            {extractionFlow.isError && (
                                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                    <p className="font-medium text-red-800 dark:text-red-200">
                                        Error: {extractionFlow.error}
                                    </p>
                                    <Button variant="outline" size="sm" className="mt-2" onClick={extractionFlow.reset}>
                                        Try Again
                                    </Button>
                                </div>
                            )}

                            <Button variant="ghost" onClick={() => { setMethod('select'); extractionFlow.reset(); }} className="w-full">
                                ← Back to options
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {method === 'manual' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Manual Entry</CardTitle>
                            <CardDescription>
                                Enter your account details manually
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="institution">Institution Name</Label>
                                <Input
                                    id="institution"
                                    placeholder="e.g., Bank of America"
                                    value={institutionName}
                                    onChange={(e) => setInstitutionName(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="accountName">Account Name (optional)</Label>
                                <Input
                                    id="accountName"
                                    placeholder="e.g., Primary Checking"
                                    value={accountName}
                                    onChange={(e) => setAccountName(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Account Type</Label>
                                <Select value={accountType} onValueChange={(v) => setAccountType(v as AccountType)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(accountTypeLabels).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="balance">Current Balance</Label>
                                <Input
                                    id="balance"
                                    type="number"
                                    placeholder="0.00"
                                    value={balance}
                                    onChange={(e) => setBalance(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button variant="outline" onClick={() => setMethod('select')} className="flex-1">
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSaveManual}
                                    disabled={saving || !institutionName || !balance}
                                    className="flex-1"
                                >
                                    {saving ? <Spinner className="w-4 h-4 mr-2 animate-spin" /> : null}
                                    Save Account
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>

            <Footer />
        </div>
    );
}

interface MethodCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
    disabled?: boolean;
}

function MethodCard({ icon, title, description, onClick, disabled }: MethodCardProps) {
    return (
        <Card
            className={`cursor-pointer transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md hover:border-primary'}`}
            onClick={disabled ? undefined : onClick}
        >
            <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                <CaretRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
        </Card>
    );
}
