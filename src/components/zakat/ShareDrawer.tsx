import { useState } from "react";
import { Users, Mail, Trash2, LogIn, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ZakatFormData } from "@/lib/zakatCalculations";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useCalculationShares } from "@/hooks/useCalculationShares";
import { z } from "zod";

interface ShareDrawerProps {
  formData: ZakatFormData;
  zakatDue?: number;
  calculationId?: string;
  children: React.ReactNode;
}

const emailSchema = z.string().email("Please enter a valid email address");

export function ShareDrawer({ formData, zakatDue, calculationId, children }: ShareDrawerProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { shares, loading: sharesLoading, createShare, removeShare } = useCalculationShares(calculationId);

  const handleSignIn = () => {
    setOpen(false);
    navigate('/auth');
  };

  const validateEmail = (value: string) => {
    try {
      emailSchema.parse(value);
      setEmailError(null);
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setEmailError(err.errors[0].message);
      }
      return false;
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value) {
      validateEmail(value);
    } else {
      setEmailError(null);
    }
  };

  const handleShare = async () => {
    if (!calculationId) {
      toast.error("Please save your calculation first before sharing");
      return;
    }

    if (!validateEmail(email)) {
      return;
    }

    setIsSharing(true);
    try {
      await createShare(calculationId, email);
      toast.success(
        "Invitation sent!",
        { description: `${email} will be able to view this calculation once they create an account with this email.` }
      );
      setEmail("");
    } catch (err: any) {
      console.error('Share error:', err);
      toast.error(err.message || "Failed to share calculation");
    } finally {
      setIsSharing(false);
    }
  };

  const handleRemoveShare = async (shareId: string, email: string) => {
    try {
      await removeShare(shareId);
      toast.success(`Removed access for ${email}`);
    } catch (err: any) {
      toast.error("Failed to remove share");
    }
  };

  // If not logged in, show login prompt
  if (!user) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          {children}
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Share with Spouse
            </DrawerTitle>
            <DrawerDescription>
              Sign in to securely share your Zakat calculation
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-8 space-y-6">
            <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Account Required</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    To protect your financial data, sharing requires both you and your spouse to have verified accounts.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">How secure sharing works:</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>You sign in and save your calculation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Enter your spouse's email to invite them</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>They create an account with that email (must verify)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>They can view the shared calculation securely</span>
                </li>
              </ul>
            </div>
            
            <Button onClick={handleSignIn} className="w-full gap-2">
              <LogIn className="w-4 h-4" />
              Sign In to Share
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // If no calculation saved yet
  if (!calculationId) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          {children}
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Share with Spouse
            </DrawerTitle>
            <DrawerDescription>
              Save your calculation first to enable sharing
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-8">
            <div className="bg-muted/50 border border-border rounded-xl p-4 text-center">
              <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                You need to save your calculation before you can share it with your spouse. 
                Complete the calculation and use the "Save" button on the results page.
              </p>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Share with Spouse
          </DrawerTitle>
          <DrawerDescription>
            Invite your partner to view this Zakat calculation securely
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-8 space-y-4">
          {/* Existing shares */}
          {shares.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Shared with:</p>
              <div className="space-y-2">
                {shares.map((share) => (
                  <div 
                    key={share.id} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      {share.accepted_at ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{share.shared_with_email}</p>
                        <p className="text-xs text-muted-foreground">
                          {share.accepted_at ? "Joined" : "Pending verification"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveShare(share.id, share.shared_with_email)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add new share */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              {shares.length > 0 ? "Invite another person:" : "Enter spouse's email:"}
            </p>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="spouse@email.com"
                  value={email}
                  onChange={handleEmailChange}
                  className={emailError ? "border-destructive" : ""}
                />
                {emailError && (
                  <p className="text-xs text-destructive mt-1">{emailError}</p>
                )}
              </div>
              <Button
                onClick={handleShare}
                disabled={!email || !!emailError || isSharing}
              >
                {isSharing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Invite
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="bg-muted/30 border border-border rounded-lg p-3 space-y-2">
            <p className="text-xs text-muted-foreground">
              <strong>How it works:</strong> Your spouse will need to create an account 
              using the email address you specify. Once they verify their email, 
              they'll automatically have access to view this calculation.
            </p>
            <p className="text-xs text-muted-foreground">
              <strong>Security:</strong> No financial data is exposed in any links or emails. 
              Only verified account holders with matching emails can view shared calculations.
            </p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
