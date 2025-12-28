import { useState } from "react";
import { ArrowLeft, FileText, Trash2, UserX, AlertTriangle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useZakatPersistence } from "@/hooks/useZakatPersistence";
import { 
  ZakatFormData, 
  calculateNisab, 
  formatCurrency, 
  SILVER_PRICE_PER_OUNCE, 
  GOLD_PRICE_PER_OUNCE,
  NisabStandard,
  CalendarType,
} from "@/lib/zakatCalculations";
import { UploadedDocumentCard } from "@/components/zakat/UploadedDocumentCard";
import { User, Users, CheckCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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

export default function Settings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const { 
    formData, 
    updateFormData, 
    uploadedDocuments, 
    removeDocument 
  } = useZakatPersistence();

  const handleDeleteAllData = async () => {
    if (!user) return;
    setIsDeleting(true);
    try {
      // Delete all shares first (due to foreign key)
      await supabase
        .from('zakat_calculation_shares')
        .delete()
        .eq('owner_id', user.id);

      // Delete all calculations
      await supabase
        .from('zakat_calculations')
        .delete()
        .eq('user_id', user.id);

      // Clear local encryption keys
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
      // Delete all shares first
      await supabase
        .from('zakat_calculation_shares')
        .delete()
        .eq('owner_id', user.id);

      // Delete all calculations
      await supabase
        .from('zakat_calculations')
        .delete()
        .eq('user_id', user.id);

      // Delete profile
      await supabase
        .from('profiles')
        .delete()
        .eq('user_id', user.id);

      // Clear local data
      localStorage.removeItem('zakat_private_key');

      // Sign out and redirect
      await supabase.auth.signOut();
      toast.success('Your account and all data have been deleted');
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
        <title>Settings | Zakat Flow</title>
        <meta name="description" content="Configure your Zakat calculation settings including Nisab standard, calendar type, and household mode." />
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

        <main className="max-w-2xl mx-auto px-4 py-6 space-y-8">
          {/* Nisab Standard Section */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Niṣāb Standard</h2>
              <p className="text-sm text-muted-foreground">
                The minimum threshold of wealth that makes Zakat obligatory
              </p>
            </div>
            
            <RadioGroup
              value={formData.nisabStandard}
              onValueChange={(value) => updateFormData({ nisabStandard: value as NisabStandard })}
              className="space-y-3"
            >
              <label 
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  formData.nisabStandard === 'silver' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value="silver" id="silver" />
                <div className="flex-1">
                  <span className="font-medium text-foreground">Silver Standard</span>
                  <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Recommended</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    595 grams of silver ≈ {formatCurrency(silverNisab, formData.currency)}
                  </p>
                </div>
              </label>
              
              <label 
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  formData.nisabStandard === 'gold' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value="gold" id="gold" />
                <div className="flex-1">
                  <span className="font-medium text-foreground">Gold Standard</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    85 grams of gold ≈ {formatCurrency(goldNisab, formData.currency)}
                  </p>
                </div>
              </label>
            </RadioGroup>
            
            {/* Current Nisab Display */}
            <div className="text-center p-6 bg-card border border-border rounded-xl">
              <p className="text-sm text-muted-foreground mb-1">Your Niṣāb Threshold</p>
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(currentNisab, formData.currency)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Based on current {formData.nisabStandard} prices
              </p>
            </div>
          </section>

          {/* Divider */}
          <hr className="border-border" />

          {/* Calendar Type Section */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Calendar Type</h2>
              <p className="text-sm text-muted-foreground">
                Choose which calendar year to use for your Zakat calculation
              </p>
            </div>
            
            <RadioGroup
              value={formData.calendarType}
              onValueChange={(value) => updateFormData({ calendarType: value as CalendarType })}
              className="space-y-3"
            >
              <label 
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  formData.calendarType === 'lunar' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value="lunar" id="lunar" />
                <div className="flex-1">
                  <span className="font-medium text-foreground">Lunar Year (Islamic)</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    354 days • 2.5% Zakat rate
                  </p>
                </div>
              </label>
              
              <label 
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  formData.calendarType === 'solar' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value="solar" id="solar" />
                <div className="flex-1">
                  <span className="font-medium text-foreground">Solar Year (Gregorian)</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    365 days • 2.577% Zakat rate (adjusted)
                  </p>
                </div>
              </label>
            </RadioGroup>
            
            {/* Selected Rate Display */}
            <div className="text-center p-6 bg-card border border-border rounded-xl">
              <p className="text-sm text-muted-foreground mb-1">Your Zakat Rate</p>
              <p className="text-3xl font-bold text-primary">
                {formData.calendarType === 'lunar' ? '2.5%' : '2.577%'}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {formData.calendarType === 'lunar' ? 'Traditional Islamic calendar' : 'Adjusted for longer year'}
              </p>
            </div>
          </section>

          {/* Divider */}
          <hr className="border-border" />

          {/* Household Mode Section */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Household Mode</h2>
              <p className="text-sm text-muted-foreground">
                Are you calculating Zakat for yourself alone or your entire household?
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => updateFormData({ isHousehold: false })}
                className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left ${
                  !formData.isHousehold 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  !formData.isHousehold ? "bg-primary/10" : "bg-accent"
                }`}>
                  <User className={`w-5 h-5 ${!formData.isHousehold ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Just myself</p>
                  <p className="text-sm text-muted-foreground">Calculate Zakat on my assets only</p>
                </div>
                {!formData.isHousehold && (
                  <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                )}
              </button>
              
              <button
                type="button"
                onClick={() => updateFormData({ isHousehold: true })}
                className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left ${
                  formData.isHousehold 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  formData.isHousehold ? "bg-primary/10" : "bg-accent"
                }`}>
                  <Users className={`w-5 h-5 ${formData.isHousehold ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">My household</p>
                  <p className="text-sm text-muted-foreground">Include spouse and/or children's assets</p>
                </div>
                {formData.isHousehold && (
                  <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                )}
              </button>
            </div>

            {formData.isHousehold && (
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm text-foreground font-medium mb-1">Household Mode Active</p>
                <p className="text-sm text-muted-foreground">
                  In asset questions, include the combined assets of your spouse and children.
                </p>
              </div>
            )}
          </section>

          {/* Divider */}
          <hr className="border-border" />

          {/* Documents Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Uploaded Documents</h2>
                <p className="text-sm text-muted-foreground">
                  Financial documents with extracted data
                </p>
              </div>
              {uploadedDocuments.length > 0 && (
                <Link to="/documents">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="w-4 h-4" />
                    View All
                  </Button>
                </Link>
              )}
            </div>
            
            {uploadedDocuments.length > 0 ? (
              <div className="space-y-3">
                {uploadedDocuments.map((doc) => (
                  <UploadedDocumentCard
                    key={doc.id}
                    document={doc}
                    onRemove={removeDocument}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-accent/50 rounded-xl border border-border">
                <FileText className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  No documents uploaded yet. You can upload financial statements during the calculation process to auto-fill asset values.
                </p>
              </div>
            )}
          </section>

          {/* Danger Zone - Only for signed-in users */}
          {user && (
            <>
              <hr className="border-border" />
              
              <section className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-destructive flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Danger Zone
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Irreversible actions that affect your data
                  </p>
                </div>
                
                <div className="space-y-3 p-4 border border-destructive/30 rounded-lg bg-destructive/5">
                  {/* Delete All Data */}
                  <div className="flex items-center justify-between gap-4 p-4 bg-background rounded-lg border border-border">
                    <div className="flex-1">
                      <p className="font-medium text-foreground flex items-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Delete All Data
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Remove all saved calculations and shares. Your account will remain active.
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground" disabled={isDeleting}>
                          Delete Data
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
                  <div className="flex items-center justify-between gap-4 p-4 bg-background rounded-lg border border-border">
                    <div className="flex-1">
                      <p className="font-medium text-foreground flex items-center gap-2">
                        <UserX className="w-4 h-4" />
                        Delete Account
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data.
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={isDeleting}>
                          Delete Account
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
              </section>
            </>
          )}
        </main>
      </div>
    </>
  );
}
