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

import { useState } from "react";
import { ArrowLeft, Trash, UserMinus, ShieldCheck, Calculator, CalendarBlank, FileText, House, Wallet, WarningCircle, Moon, Sun, Monitor } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useZakatPersistence } from "@/hooks/useZakatPersistence";
import {
  calculateNisab,
  formatCurrency,
  SILVER_PRICE_PER_OUNCE,
  GOLD_PRICE_PER_OUNCE,
  NisabStandard,
  CalendarType,
  Madhab,
  MADHAB_RULES,
} from "@zakatflow/core";
import { getMadhhabDisplayName, MadhhabRules } from "@zakatflow/core";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/runtimeClient";
import { toast } from "sonner";
import { usePrivacyVault } from "@/hooks/usePrivacyVault";
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
import { PrivacyShield } from "@/components/vault/PrivacyShield";
import { SettingsSection, SettingsCard } from "@/components/settings/SettingsContainers";
import { SettingsRow } from "@/components/settings/SettingsRow";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";

// Import dialog/sheet contents (we can keep HawlDatePicker inline or move it later)
import { HawlDatePicker } from "@/components/donations/HawlDatePicker";
import { CalendarType as HawlCalendarType } from "@/types/donations";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Settings() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isDeleting, setIsDeleting] = useState(false);

  // Hawl date state
  const [hawlDate, setHawlDate] = useState<string | undefined>();
  const [hawlCalendarType, setHawlCalendarType] = useState<HawlCalendarType>('gregorian');

  const {
    formData,
    updateFormData,
    uploadedDocuments,
    resetCalculator
  } = useZakatPersistence();

  const { resetVault } = usePrivacyVault();

  // --- Deletion Logic (Kept same as before) ---
  const deleteUserAssets = async (userId: string) => {
    try {
      const { data: portfolios } = await supabase.from('portfolios').select('id').eq('user_id', userId);
      const portfolioIds = portfolios?.map(p => p.id) || [];
      if (portfolioIds.length > 0) {
        const { data: accounts } = await supabase.from('asset_accounts').select('id').in('portfolio_id', portfolioIds);
        const accountIds = accounts?.map(a => a.id) || [];
        if (accountIds.length > 0) {
          const { data: snapshots } = await supabase.from('asset_snapshots').select('id').in('account_id', accountIds);
          const snapshotIds = snapshots?.map(s => s.id) || [];
          if (snapshotIds.length > 0) {
            await supabase.from('asset_line_items').delete().in('snapshot_id', snapshotIds);
            await supabase.from('asset_snapshots').delete().in('id', snapshotIds);
          }
          await supabase.from('asset_accounts').delete().in('id', accountIds);
        }
        await supabase.from('portfolios').delete().in('id', portfolioIds);
      }
    } catch (e) {
      console.error("Asset deletion check failed", e);
    }
  };

  const handleDeleteAllData = async () => {
    setIsDeleting(true);
    try {
      resetCalculator();
      localStorage.removeItem('zakat_private_key');
      localStorage.removeItem('zakat-guest-history');
      localStorage.removeItem('zakat-donations');
      await resetVault();

      if (user) {
        try {
          await deleteUserAssets(user.id);
          await supabase.from('zakat_calculation_shares').delete().eq('owner_id', user.id);
          await supabase.from('zakat_calculations').delete().eq('user_id', user.id);
          toast.success('Local and cloud data deleted');
        } catch (e) {
          console.error("Cloud delete failed", e);
          toast.error('Cloud cleanup failed, but local data cleared');
        }
      } else {
        toast.success('Local data cleared');
      }
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
      await deleteUserAssets(user.id);
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) throw new Error("Not authenticated");
      const { error: functionError } = await supabase.functions.invoke('delete-account', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (functionError) throw functionError;
      localStorage.removeItem('zakat_private_key');
      await signOut();
      toast.success('Your account has been permanently deleted');
      navigate('/account-deleted');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account. Please try again or contact support.');
    } finally {
      setIsDeleting(false);
    }
  };

  const silverNisab = calculateNisab(SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, 'silver');
  const goldNisab = calculateNisab(SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, 'gold');

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Helmet>
        <title>Settings | ZakatFlow</title>
        <meta name="description" content="Configure your Zakat calculation settings." />
        <link rel="canonical" href={getPrimaryUrl('/settings')} />
      </Helmet>

      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="container mx-auto px-4 h-16 max-w-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full -ml-2" aria-label="Go back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold tracking-tight">Settings</h1>
            </div>
            <PrivacyShield />
          </div>
        </div>

        <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">

          {/* Section: Appearance */}
          <SettingsSection title="Appearance">
            <SettingsCard>
              <div className="p-1">
                <ToggleGroup type="single" value={theme} onValueChange={(v) => v && setTheme(v)} className="justify-stretch w-full">
                  <ToggleGroupItem value="light" className="flex-1 data-[state=on]:bg-foreground data-[state=on]:text-background" aria-label="Light Mode">
                    <Sun className="h-4 w-4 mr-2" /> Light
                  </ToggleGroupItem>
                  <ToggleGroupItem value="dark" className="flex-1 data-[state=on]:bg-foreground data-[state=on]:text-background" aria-label="Dark Mode">
                    <Moon className="h-4 w-4 mr-2" /> Dark
                  </ToggleGroupItem>
                  <ToggleGroupItem value="system" className="flex-1 data-[state=on]:bg-foreground data-[state=on]:text-background" aria-label="System Mode">
                    <Monitor className="h-4 w-4 mr-2" /> Auto
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </SettingsCard>
          </SettingsSection>

          {/* Section: Calculation Engine */}
          <SettingsSection title="Calculation Engine">
            <SettingsCard>
              {/* Madhab */}
              <Sheet>
                <SheetTrigger asChild>
                  <SettingsRow
                    icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
                    label="School of Thought"
                    value={getMadhhabDisplayName(formData.madhab)}
                    description="Methodology for calculations"
                    onClick={() => { }}
                  />
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-3xl">
                  <SheetHeader className="mb-6 text-left">
                    <SheetTitle>Select School (Madhab)</SheetTitle>
                    <SheetDescription>
                      Different schools have varying rulings on certain assets.
                    </SheetDescription>
                  </SheetHeader>
                  <RadioGroup
                    value={formData.madhab}
                    onValueChange={(v) => {
                      const newMadhab = v as Madhab;
                      updateFormData({
                        madhab: newMadhab
                      });
                    }}
                    className="gap-4"
                  >
                    {(Object.values(MADHAB_RULES) as MadhhabRules[]).map((rule) => (
                      <div key={rule.name} className="flex items-center space-x-2">
                        <RadioGroupItem value={rule.name} id={rule.name} />
                        <label htmlFor={rule.name} className="flex-1 cursor-pointer font-medium p-2">
                          {rule.displayName}
                        </label>
                      </div>
                    ))}

                  </RadioGroup>
                </SheetContent>
              </Sheet>

              {/* Nisab */}
              <Sheet>
                <SheetTrigger asChild>
                  <SettingsRow
                    icon={<Wallet className="w-5 h-5 text-amber-500" />}
                    label="Niṣāb Threshold"
                    value={formData.nisabStandard === 'silver' ? `Silver (${formatCurrency(silverNisab)})` : `Gold (${formatCurrency(goldNisab)})`}
                    description="Minimum wealth to owe Zakat"
                    onClick={() => { }}
                  />
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-3xl">
                  <SheetHeader className="mb-6 text-left">
                    <SheetTitle>Nisab Standard</SheetTitle>
                    <SheetDescription>
                      The minimum amount of wealth a Muslim must possess before they became liable for Zakat.
                    </SheetDescription>
                  </SheetHeader>
                  <RadioGroup value={formData.nisabStandard} onValueChange={(v) => updateFormData({ nisabStandard: v as NisabStandard })} className="gap-4">
                    <div className="flex items-start space-x-3 p-4 rounded-xl border">
                      <RadioGroupItem value="silver" id="silver" className="mt-1" />
                      <label htmlFor="silver" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Silver Standard (Recommended)</div>
                        <div className="text-sm text-muted-foreground">Threshold: {formatCurrency(silverNisab)}</div>
                        <div className="text-xs text-muted-foreground mt-1">Historically the safer option to ensure Zakat is paid.</div>
                      </label>
                    </div>
                    <div className="flex items-start space-x-3 p-4 rounded-xl border">
                      <RadioGroupItem value="gold" id="gold" className="mt-1" />
                      <label htmlFor="gold" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Gold Standard</div>
                        <div className="text-sm text-muted-foreground">Threshold: {formatCurrency(goldNisab)}</div>
                      </label>
                    </div>
                  </RadioGroup>
                </SheetContent>
              </Sheet>

              {/* Hawl / Year */}
              <Sheet>
                <SheetTrigger asChild>
                  <SettingsRow
                    icon={<CalendarBlank className="w-5 h-5 text-blue-500" />}
                    label="Zakat Year (Hawl)"
                    value={hawlDate ? new Date(hawlDate).toLocaleDateString() : 'Not Set'}
                    onClick={() => { }}
                  />
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-3xl min-h-[500px]">
                  <SheetHeader className="mb-6 text-left">
                    <SheetTitle>Setting your Hawl Date</SheetTitle>
                  </SheetHeader>
                  <HawlDatePicker
                    value={hawlDate}
                    calendarType={hawlCalendarType}
                    onChange={(date, type) => {
                      setHawlDate(date);
                      setHawlCalendarType(type);
                    }}
                    showCountdown={true}
                  />
                </SheetContent>
              </Sheet>

              {/* Household Mode */}
              <SettingsRow
                icon={<House className="w-5 h-5 text-indigo-500" />}
                label="Household Mode"
                value={
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{formData.isHousehold ? "On" : "Off"}</span>
                    <Button
                      size="sm"
                      variant={formData.isHousehold ? "default" : "outline"}
                      className="h-7 text-xs"
                      onClick={() => updateFormData({ isHousehold: !formData.isHousehold })}
                    >
                      Toggle
                    </Button>
                  </div>
                }
                hasChevron={false}
              />
            </SettingsCard>
          </SettingsSection>

          {/* Section: Data & Privacy */}
          <SecuritySettings />

          <SettingsSection title="Data & Privacy">
            <SettingsCard>
              {/* Documents */}
              <SettingsRow
                icon={<FileText className="w-5 h-5 text-slate-500" />}
                label="Uploaded Documents"
                value={uploadedDocuments.length > 0 ? `${uploadedDocuments.length} files` : "None"}
                onClick={() => navigate('/assets')}
              />
            </SettingsCard>

            {/* Danger Zone */}
            <h3 className="px-4 pt-4 text-sm font-medium text-destructive uppercase tracking-wider flex items-center gap-2">
              <WarningCircle className="w-4 h-4" /> Danger Zone
            </h3>
            <SettingsCard className="border-destructive/20">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <SettingsRow
                    icon={<Trash className="w-5 h-5" />}
                    label="Clear Local Data"
                    description="Removes inputs from this device only"
                    destructive
                    onClick={() => { }}
                  />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear local data?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove all Zakat calculation data stored on this device.
                      {user && " Your saved cloud data will remain."}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAllData} className="bg-destructive hover:bg-destructive/90">
                      Clear Data
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {user ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <SettingsRow
                      icon={<UserMinus className="w-5 h-5" />}
                      label="Delete Account"
                      description="Permanently delete account and all data"
                      destructive
                      onClick={() => { }}
                    />
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
                      <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <div /> // Placeholder if no user, or just omit
              )}
            </SettingsCard>
          </SettingsSection>

          <Footer />
        </main>
      </div>
    </>
  );
}
