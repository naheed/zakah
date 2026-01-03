import { useState } from "react";
import { ArrowLeft, FileText, Trash2, UserX, ChevronDown, User, Users, Check, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useZakatPersistence } from "@/hooks/useZakatPersistence";
import {
  calculateNisab,
  formatCurrency,
  SILVER_PRICE_PER_OUNCE,
  GOLD_PRICE_PER_OUNCE,
  NisabStandard,
  CalendarType,
  Madhab,
} from "@/lib/zakatCalculations";
import { MADHAB_RULES, getMadhahDisplayName } from "@/lib/madhahRules";
import { Badge } from "@/components/ui/badge";
import { LearnMore } from "@/components/zakat/LearnMore";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/runtimeClient";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/zakat/Footer";
import { getPrimaryUrl } from "@/lib/domainConfig";

export default function Settings() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isDeleting, setIsDeleting] = useState(false);
  const [appearanceOpen, setAppearanceOpen] = useState(true);
  const [calculationOpen, setCalculationOpen] = useState(false);
  const [documentsOpen, setDocumentsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const {
    formData,
    updateFormData,
    uploadedDocuments,
  } = useZakatPersistence();

  const handleDeleteAllData = async () => {
    if (!user) return;
    setIsDeleting(true);
    try {
      await supabase
        .from('zakat_calculation_shares')
        .delete()
        .eq('owner_id', user.id);

      await supabase
        .from('zakat_calculations')
        .delete()
        .eq('user_id', user.id);

      localStorage.removeItem('zakat_private_key');

      toast.success('All your data has been deleted');
      navigate('/');
    } catch (error) {
      console.error('Error deleting data:', error);
      toast.error('Failed to delete data');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setIsDeleting(true);
    try {
      // 1. Delete data (legacy cleanup, kept for safety)
      await supabase.from('zakat_calculation_shares').delete().eq('owner_id', user.id);
      await supabase.from('zakat_calculations').delete().eq('user_id', user.id);
      await supabase.from('profiles').delete().eq('user_id', user.id);

      // 2. Call backend function to delete the actual Auth User
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      const accessToken = sessionData.session?.access_token;
      if (!accessToken) throw new Error("Not authenticated");

      const { error: functionError } = await supabase.functions.invoke('delete-account', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (functionError) throw functionError;

      // 2. Clear local keys
      localStorage.removeItem('zakat_private_key');

      // 3. Client-side sign out to clear session/local storage
      await signOut(); // Uses the robust signOut from useAuth

      // Navigation is handled by signOut usually, but safety net:
      // toast is shown by signOut? No, usually not.
      toast.success('Your account has been permanently deleted');
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  const silverNisab = calculateNisab(SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, 'silver');
  const goldNisab = calculateNisab(SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, 'gold');
  const currentNisab = formData.nisabStandard === 'gold' ? goldNisab : silverNisab;

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Helmet>
        <title>Settings | ZakatFlow</title>
        <meta name="description" content="Configure your Zakat calculation settings including Nisab standard, calendar type, and household mode." />
        <link rel="canonical" href={getPrimaryUrl('/settings')} />
        <meta property="og:url" content={getPrimaryUrl('/settings')} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Go back</span>
              </Button>
              <h1 className="text-lg font-semibold text-foreground">Settings</h1>
            </div>
          </div>
        </div>

        <main className="max-w-2xl mx-auto px-4 py-4 space-y-3">
          {/* Appearance Group */}
          <Collapsible open={appearanceOpen} onOpenChange={setAppearanceOpen}>
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:bg-accent/50 transition-colors">
                <span className="font-medium text-foreground">Appearance</span>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", appearanceOpen && "rotate-180")} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 p-4 bg-card rounded-lg border border-border space-y-2">
                <h3 className="text-sm font-medium text-foreground mb-3">Theme</h3>
                <div className="space-y-2">
                  <label className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                    theme === 'light'
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                    onClick={() => setTheme('light')}
                  >
                    <Sun className={cn("h-4 w-4", theme === 'light' ? "text-primary" : "text-muted-foreground")} />
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Light</span>
                      {theme === 'light' && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </label>

                  <label className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                    theme === 'dark'
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                    onClick={() => setTheme('dark')}
                  >
                    <Moon className={cn("h-4 w-4", theme === 'dark' ? "text-primary" : "text-muted-foreground")} />
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Dark</span>
                      {theme === 'dark' && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </label>

                  <label className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                    theme === 'system'
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                    onClick={() => setTheme('system')}
                  >
                    <Monitor className={cn("h-4 w-4", theme === 'system' ? "text-primary" : "text-muted-foreground")} />
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-foreground">System</span>
                        <p className="text-xs text-muted-foreground">Auto-detect from device</p>
                      </div>
                      {theme === 'system' && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Calculation Settings Group */}
          <Collapsible open={calculationOpen} onOpenChange={setCalculationOpen}>
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:bg-accent/50 transition-colors">
                <span className="font-medium text-foreground">Calculation Settings</span>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", calculationOpen && "rotate-180")} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 p-4 bg-card rounded-lg border border-border space-y-5">
                {/* Preferred Madhab */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-foreground">Preferred School (Madhab)</h3>
                  <RadioGroup
                    value={formData.madhab}
                    onValueChange={(value) => updateFormData({ madhab: value as Madhab })}
                    className="space-y-2"
                  >
                    {(['balanced', 'hanafi', 'shafii', 'maliki', 'hanbali'] as Madhab[]).map((m) => (
                      <label
                        key={m}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                          formData.madhab === m
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <RadioGroupItem value={m} className="h-4 w-4" />
                        <div className="flex-1 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">{getMadhahDisplayName(m)}</span>
                            {m === 'balanced' && (
                              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">Recommended</span>
                            )}
                          </div>
                          {formData.madhab === m && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      </label>
                    ))}
                  </RadioGroup>

                  <LearnMore title="What is a Madhab?">
                    <p>A <strong>madhab</strong> is a school of Islamic jurisprudence. The four Sunni schools (Hanafi, Maliki, Shafi'i, Hanbali) have different rulings on some Zakat matters.</p>
                    <p className="mt-2"><strong>Balanced (AMJA)</strong> uses widely-accepted scholarly opinions while allowing for optimization. If unsure, this is recommended.</p>
                  </LearnMore>
                </div>

                {/* Nisab Standard */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-foreground">Niṣāb Standard</h3>
                  <RadioGroup
                    value={formData.nisabStandard}
                    onValueChange={(value) => updateFormData({ nisabStandard: value as NisabStandard })}
                    className="space-y-2"
                  >
                    <label className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                      formData.nisabStandard === 'silver'
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}>
                      <RadioGroupItem value="silver" className="h-4 w-4" />
                      <div className="flex-1 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">Silver</span>
                          <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">Recommended</span>
                        </div>
                        {formData.nisabStandard === 'silver' && (
                          <span className="text-xs text-primary flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            {formatCurrency(silverNisab, formData.currency)}
                          </span>
                        )}
                      </div>
                    </label>

                    <label className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                      formData.nisabStandard === 'gold'
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}>
                      <RadioGroupItem value="gold" className="h-4 w-4" />
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">Gold</span>
                        {formData.nisabStandard === 'gold' && (
                          <span className="text-xs text-primary flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            {formatCurrency(goldNisab, formData.currency)}
                          </span>
                        )}
                      </div>
                    </label>
                  </RadioGroup>

                  <LearnMore title="Why Silver vs Gold?">
                    <p>The <strong>silver standard</strong> (595g) results in a lower threshold, meaning more people qualify to pay Zakat. This is the more cautious opinion, recommended by most scholars including Sheikh Joe Bradford.</p>
                    <p className="mt-2">The <strong>gold standard</strong> (85g) results in a higher threshold. Some scholars permit this, especially in regions where gold is the primary measure of wealth.</p>
                  </LearnMore>
                </div>

                {/* Calendar Type */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-foreground">Calendar Type</h3>
                  <RadioGroup
                    value={formData.calendarType}
                    onValueChange={(value) => updateFormData({ calendarType: value as CalendarType })}
                    className="space-y-2"
                  >
                    <label className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                      formData.calendarType === 'lunar'
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}>
                      <RadioGroupItem value="lunar" className="h-4 w-4" />
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">Lunar (Islamic)</span>
                        {formData.calendarType === 'lunar' && (
                          <span className="text-xs text-primary flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            2.5% rate
                          </span>
                        )}
                      </div>
                    </label>

                    <label className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                      formData.calendarType === 'solar'
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}>
                      <RadioGroupItem value="solar" className="h-4 w-4" />
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">Solar (Gregorian)</span>
                        {formData.calendarType === 'solar' && (
                          <span className="text-xs text-primary flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            2.577% rate
                          </span>
                        )}
                      </div>
                    </label>
                  </RadioGroup>

                  <LearnMore title="Lunar vs Solar calendar">
                    <p>The <strong>lunar year</strong> (354 days) is the traditional Islamic calendar used for Zakat. The standard 2.5% rate applies.</p>
                    <p className="mt-2">If you track your finances by <strong>solar year</strong> (365 days), the rate is adjusted to 2.577% to account for the extra 11 days.</p>
                  </LearnMore>
                </div>

                {/* Household Mode */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-foreground">Who are you calculating for?</h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => updateFormData({ isHousehold: false })}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all",
                        !formData.isHousehold
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <User className={cn("w-4 h-4", !formData.isHousehold ? "text-primary" : "text-muted-foreground")} />
                      <span className={cn("text-sm font-medium", !formData.isHousehold ? "text-primary" : "text-foreground")}>Just me</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => updateFormData({ isHousehold: true })}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all",
                        formData.isHousehold
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <Users className={cn("w-4 h-4", formData.isHousehold ? "text-primary" : "text-muted-foreground")} />
                      <span className={cn("text-sm font-medium", formData.isHousehold ? "text-primary" : "text-foreground")}>Household</span>
                    </button>
                  </div>

                  {formData.isHousehold && (
                    <p className="text-xs text-muted-foreground bg-primary/5 p-2 rounded">
                      Include combined assets of spouse and children in your calculation.
                    </p>
                  )}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Documents Group */}
          <Collapsible open={documentsOpen} onOpenChange={setDocumentsOpen}>
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">Documents</span>
                  {uploadedDocuments.length > 0 && (
                    <Badge variant="secondary" className="text-xs">{uploadedDocuments.length}</Badge>
                  )}
                </div>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", documentsOpen && "rotate-180")} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 p-4 bg-card rounded-lg border border-border">
                {uploadedDocuments.length > 0 ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{uploadedDocuments.length} document{uploadedDocuments.length !== 1 ? 's' : ''} uploaded</span>
                    </div>
                    <Link to="/assets">
                      <Button variant="ghost" size="sm" className="text-xs">
                        View assets →
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">No documents uploaded. Upload during calculation to auto-fill values.</span>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Account Group - Only for signed-in users */}
          {user && (
            <Collapsible open={accountOpen} onOpenChange={setAccountOpen}>
              <CollapsibleTrigger asChild>
                <button className="w-full flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:bg-accent/50 transition-colors">
                  <span className="font-medium text-foreground">Account</span>
                  <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", accountOpen && "rotate-180")} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 p-4 bg-card rounded-lg border border-destructive/30 space-y-3">
                  <p className="text-xs text-muted-foreground">These actions are irreversible.</p>

                  {/* Delete All Data */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Delete all data</p>
                        <p className="text-xs text-muted-foreground">Calculations & shares</p>
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-xs border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground" disabled={isDeleting}>
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete all your data?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete all your saved Zakat calculations and shared access.
                            Your account will remain active but all financial data will be removed.
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAllData}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete All Data
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  {/* Delete Account */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <UserX className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Delete account</p>
                        <p className="text-xs text-muted-foreground">Account & all data</p>
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="text-xs" disabled={isDeleting}>
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete your account, profile, all saved calculations,
                            and shared access. You will be signed out immediately.
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete My Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
