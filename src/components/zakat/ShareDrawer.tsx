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
import { Users, Envelope, Trash, SignIn, CheckCircle, Clock, WarningCircle, Spinner, Shield, Lock } from "@phosphor-icons/react";
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
      // Pass formData so it can be encrypted for recipient if they have a public key
      await createShare(calculationId, email, formData);
        toast.success(
        "Invitation sent!",
        { description: `${email} can view this calculation after signing in with Google. Only they can decrypt it.` }
      );
      setEmail("");
    } catch (err: unknown) {
      console.error('Share error:', err);
      toast.error(err instanceof Error ? err.message : "Failed to share calculation");
    } finally {
      setIsSharing(false);
    }
  };

  const handleRemoveShare = async (shareId: string, email: string) => {
    try {
      await removeShare(shareId);
      toast.success(`Removed access for ${email}`);
    } catch (err: unknown) {
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
                <WarningCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Account Required</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sharing is end-to-end encrypted: both you and your spouse sign in with Google. Only they can decrypt the shared calculation.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">How secure sharing works:</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <Lock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Your data is encrypted with your unique keys</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Shared data is re-encrypted for your spouse's keys</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Only they can decrypt and view the shared calculation</span>
                </li>
              </ul>
            </div>

            <Button onClick={handleSignIn} className="w-full gap-2">
              <SignIn className="w-4 h-4" />
              Sign In with Google to Share
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
              <WarningCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
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
            Invite your partner to view this calculation. Only they can decrypt it.
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
                          {share.accepted_at
                            ? share.encrypted_form_data
                              ? "Encrypted access granted"
                              : "Access granted (pending encryption)"
                            : "Pending sign-in"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveShare(share.id, share.shared_with_email)}
                    >
                      <Trash className="w-4 h-4 text-destructive" />
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
                  <Spinner className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Envelope className="w-4 h-4 mr-2" />
                    Invite
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="bg-muted/30 border border-border rounded-lg p-3 space-y-2">
            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                <strong>End-to-end encrypted:</strong> Your data is encrypted in your browser
                and re-encrypted for your spouse. Only they can decrypt it.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              <strong>How it works:</strong> Your spouse signs in with Google using the email
              you specify. Their unique encryption keys will be used to secure the shared data.
            </p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
