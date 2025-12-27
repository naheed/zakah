import { useState } from "react";
import { Share2, Copy, Mail, Check, Users } from "lucide-react";
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
import { ZakatFormData, formatCurrency } from "@/lib/zakatCalculations";

interface ShareDrawerProps {
  formData: ZakatFormData;
  zakatDue?: number;
  children: React.ReactNode;
}

export function ShareDrawer({ formData, zakatDue, children }: ShareDrawerProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");

  const generateShareText = () => {
    if (zakatDue !== undefined && zakatDue > 0) {
      return `Assalamu Alaikum,\n\nI calculated our Zakat for this year using a comprehensive calculator based on Sheikh Joe Bradford's methodology.\n\nEstimated Zakat Due: ${formatCurrency(zakatDue, formData.currency)}\n\nWould you like to review the calculation together? You can use the same calculator here: ${window.location.origin}\n\nJazakAllah Khair`;
    }
    return `Assalamu Alaikum,\n\nI'm calculating our Zakat for this year using a comprehensive calculator based on Sheikh Joe Bradford's methodology.\n\nWould you like to help me complete it? You can use the same calculator here: ${window.location.origin}\n\nJazakAllah Khair`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent("Let's Calculate Our Zakat Together");
    const body = encodeURIComponent(generateShareText());
    const mailto = `mailto:${email}?subject=${subject}&body=${body}`;
    window.open(mailto, '_blank');
    setOpen(false);
    toast.success("Opening email client...");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Zakat Calculator",
          text: generateShareText(),
          url: window.location.origin,
        });
      } catch (e) {
        // User cancelled share
      }
    }
  };

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
            Invite your partner to review or help complete your Zakat calculation
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-8 space-y-4">
          {/* Native share (mobile) */}
          {typeof navigator !== 'undefined' && navigator.share && (
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12"
              onClick={handleNativeShare}
            >
              <Share2 className="w-5 h-5" />
              Share via...
            </Button>
          )}

          {/* Copy link */}
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-12"
            onClick={handleCopyLink}
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
            {copied ? "Copied!" : "Copy calculator link"}
          </Button>

          {/* Email share */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Or send via email:</p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="spouse@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleEmailShare}
                disabled={!email || !email.includes('@')}
              >
                <Mail className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2">
            Your data stays on your device and is never shared
          </p>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
