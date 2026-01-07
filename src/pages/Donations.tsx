import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Plus, HandHeart, CalendarBlank, Spinner, CheckCircle, Warning, Clock, PencilSimple, SignIn } from '@phosphor-icons/react';
import { useAuth } from '@/hooks/useAuth';
import { useDonationPersistence } from '@/hooks/useDonationPersistence';
import { useZakatPersistence } from '@/hooks/useZakatPersistence';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Footer } from '@/components/zakat/Footer';
import { getPrimaryUrl } from '@/lib/domainConfig';
import { cn } from '@/lib/utils';
import { formatCurrency, calculateZakat } from '@/lib/zakatCalculations';
import { formatHijri } from '@/lib/dateUtils';
import { Donation, ZAKAT_RECIPIENT_CATEGORIES, CalendarType } from '@/types/donations';
import { AddDonationModal } from '@/components/donations/AddDonationModal';
import { HawlOnboardingModal } from '@/components/donations/HawlOnboardingModal';
import { UpdateGoalModal } from '@/components/donations/UpdateGoalModal';

/**
 * Donations Page - Track Zakat Donations
 * 
 * Material 3 Expressive design with:
 * - Hawl year summary with progress bar
 * - Donation history list
 * - Add donation CTA
 */
export default function Donations() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user, loading: authLoading, signInWithGoogle } = useAuth();

    // Donation persistence hook
    const {
        summary,
        hawlSettings,
        loading,
        addDonation,
        setHawlSettings: saveHawlSettings,
        setCalculatedAmount,
    } = useDonationPersistence();

    // Zakat calculator persistence hook (for reading calculated amount)
    const { formData } = useZakatPersistence();

    const [showAddModal, setShowAddModal] = useState(false);
    const [showHawlOnboarding, setShowHawlOnboarding] = useState(false);
    const [pendingUpdate, setPendingUpdate] = useState<{ amount: number } | null>(null);

    // Sync calculated amount from URL or local persistence
    useEffect(() => {
        const syncZakatAmount = async () => {
            let potentialAmount = 0;

            // 1. Check URL params first (highest priority, freshly calculated)
            const urlZakatDue = searchParams.get('zakatDue');
            if (urlZakatDue) {
                const amount = parseFloat(urlZakatDue);
                if (!isNaN(amount) && amount > 0) {
                    potentialAmount = amount;
                }
            }
            // 2. Fallback: Check local calculator persistence
            else {
                try {
                    const result = calculateZakat(formData);
                    if (result.zakatDue && result.zakatDue > 0) {
                        potentialAmount = result.zakatDue;
                    }
                } catch (e) {
                    console.error("Failed to calculate zakat fallback", e);
                }
            }

            // COMMIT LOGIC:
            if (potentialAmount > 0) {
                // Scenario A: No active goal (First time) -> Auto-commit
                if (!summary || summary.zakatYear.calculated_amount === 0) {
                    await setCalculatedAmount(potentialAmount);
                }
                // Scenario B: Active goal exists but differs (Returning user) -> Confirm
                else if (Math.abs(summary.zakatYear.calculated_amount - potentialAmount) > 1) {
                    // Only show if diff is > $1 to avoid float precision annoyance
                    setPendingUpdate({ amount: potentialAmount });
                }
            }
        };

        if (!loading) {
            syncZakatAmount();
        }
    }, [loading, searchParams, formData, summary, setCalculatedAmount]);

    // Format date for display
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // Handle adding a new donation
    const handleAddDonation = async (donation: Omit<Donation, 'id' | 'user_id' | 'zakat_year_id' | 'created_at' | 'updated_at'>) => {
        await addDonation(donation);
    };

    // Handle saving Hawl settings
    const handleSaveHawl = async (date: string, calendarType: CalendarType) => {
        await saveHawlSettings(date, calendarType);
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Spinner className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>Donations - ZakatFlow</title>
                <link rel="canonical" href={getPrimaryUrl('/donations')} />
            </Helmet>

            {/* Header */}
            <header className="border-b border-border bg-card">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold text-foreground">Zakat Donations</h1>
                            <p className="text-sm text-muted-foreground">Track your Zakat fulfillment</p>
                        </div>
                    </div>
                    <Button onClick={() => setShowAddModal(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Donation
                    </Button>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Spinner className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : !summary ? (
                    /* Empty State - No Zakat Calculation */
                    <Card className="text-center py-12">
                        <CardContent>
                            <HandHeart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                            <h2 className="text-xl font-semibold mb-2">No Zakat Calculated Yet</h2>
                            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                Calculate your Zakat first to start tracking donations.
                            </p>
                            <Button onClick={() => navigate('/')}>
                                Calculate Zakat
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Hawl Year Summary Card */}
                        <Card className="overflow-hidden">
                            <CardContent className="p-6">
                                {/* Hawl Period */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                                            <CalendarBlank className="w-4 h-4 text-primary" weight="duotone" />
                                            <span>
                                                Hawl: {hawlSettings?.calendarType === 'hijri'
                                                    ? `${formatHijri(summary.zakatYear.hawl_start)} → ${formatHijri(summary.zakatYear.hawl_end)}`
                                                    : `${formatDate(summary.zakatYear.hawl_start)} → ${formatDate(summary.zakatYear.hawl_end)}`
                                                }
                                            </span>
                                            <button
                                                onClick={() => setShowHawlOnboarding(true)}
                                                className="text-muted-foreground hover:text-primary transition-colors p-1"
                                                aria-label="Edit Hawl Date"
                                            >
                                                <PencilSimple className="w-3 h-3" />
                                            </button>
                                        </div>
                                        {/* Subtle hint of the other calendar */}
                                        <div className="text-[10px] text-muted-foreground pl-6">
                                            {hawlSettings?.calendarType === 'hijri'
                                                ? `(${formatDate(summary.zakatYear.hawl_start)} → ${formatDate(summary.zakatYear.hawl_end)})`
                                                : `(${formatHijri(summary.zakatYear.hawl_start)} → ${formatHijri(summary.zakatYear.hawl_end)})`
                                            }
                                        </div>
                                    </div>

                                    <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {summary.daysRemaining} days left
                                    </Badge>
                                </div>

                                {/* Progress Section */}
                                <div className="space-y-3">
                                    <div className="flex items-baseline justify-between">
                                        <span className="text-3xl font-bold text-foreground">
                                            {formatCurrency(summary.remaining)}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            remaining of {formatCurrency(summary.zakatYear.calculated_amount)}
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                "absolute left-0 top-0 h-full rounded-full transition-all duration-500",
                                                summary.percentComplete >= 100 ? "bg-primary" : "bg-primary/80"
                                            )}
                                            style={{ width: `${Math.min(summary.percentComplete, 100)}%` }}
                                        />
                                    </div>

                                    <p className="text-sm text-muted-foreground">
                                        {summary.percentComplete >= 100 ? (
                                            <span className="text-primary flex items-center gap-1">
                                                <CheckCircle weight="fill" className="w-4 h-4" />
                                                Zakat fully distributed!
                                            </span>
                                        ) : (
                                            `${summary.percentComplete}% of Zakat distributed`
                                        )}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Donation History */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-foreground">Donation History</h2>

                            {summary.donations.length === 0 ? (
                                <Card className="text-center py-8">
                                    <CardContent>
                                        <p className="text-muted-foreground mb-4">No donations recorded yet.</p>
                                        <Button variant="outline" onClick={() => setShowAddModal(true)}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Your First Donation
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-3">
                                    {summary.donations.map((donation) => (
                                        <DonationCard key={donation.id} donation={donation} />
                                    ))}
                                </div>
                            )}

                            {/* Add More Donations */}
                            <Button variant="outline" className="w-full" onClick={() => setShowAddModal(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Another Donation
                            </Button>

                            {/* Sign In Prompt for Guests */}
                            {!user && (
                                <Card className="mt-4 border-dashed border-2 bg-muted/30">
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <SignIn className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-foreground text-sm">Sign in to sync across devices</p>
                                            <p className="text-xs text-muted-foreground">Your data is stored locally. Sign in to backup and access from anywhere.</p>
                                        </div>
                                        <Button size="sm" onClick={() => signInWithGoogle()}>
                                            Sign In
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </>
                )}
            </main>

            <Footer />

            {/* Add Donation Modal */}
            <AddDonationModal
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSave={handleAddDonation}
                zakatYearId={summary?.zakatYear.id}
            />

            {/* Hawl Onboarding Modal */}
            <HawlOnboardingModal
                open={showHawlOnboarding}
                onClose={() => setShowHawlOnboarding(false)}
                onSave={async (date, type) => {
                    await handleSaveHawl(date, type);
                    setShowHawlOnboarding(false);
                }}
            />

            {/* Update Goal Confirmation (for returning users) */}
            {pendingUpdate && summary && (
                <UpdateGoalModal
                    open={!!pendingUpdate}
                    onClose={() => setPendingUpdate(null)}
                    onConfirm={async () => {
                        await setCalculatedAmount(pendingUpdate.amount);
                        setPendingUpdate(null);
                        navigate('/donations', { replace: true }); // Clear URL params
                    }}
                    currentAmount={summary.zakatYear.calculated_amount}
                    newAmount={pendingUpdate.amount}
                    currency={formData.currency}
                />
            )}
        </div>
    );
}

/**
 * Individual Donation Card
 */
function DonationCard({ donation }: { donation: Donation }) {
    const category = ZAKAT_RECIPIENT_CATEGORIES[donation.recipient_category];

    return (
        <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-foreground truncate">
                                {donation.recipient_name}
                            </h3>
                            <Badge variant="secondary" className="text-[10px] shrink-0">
                                {category?.english || donation.recipient_category}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {new Date(donation.donation_date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                            {donation.notes && ` • ${donation.notes}`}
                        </p>
                        {donation.receipt_url && (
                            <p className="text-xs text-primary mt-1">📎 Receipt attached</p>
                        )}
                    </div>
                    <div className="text-right shrink-0">
                        <p className="text-lg font-bold text-foreground">
                            {formatCurrency(donation.amount)}
                        </p>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                                Edit
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
