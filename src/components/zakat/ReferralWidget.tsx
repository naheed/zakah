import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, MessageCircle, Twitter, Facebook, Copy, Check, Users, Heart, Sparkles, Share2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useReferral, getInviteUrl } from '@/hooks/useReferral';
import { formatCurrency } from '@/lib/zakatCalculations';
import { Skeleton } from '@/components/ui/skeleton';

interface ReferralWidgetProps {
  currency?: string;
  variant?: 'compact' | 'full';
}

export function ReferralWidget({ currency = 'USD', variant = 'compact' }: ReferralWidgetProps) {
  const { toast } = useToast();
  const { 
    referralCode, 
    stats, 
    isLoading, 
    isGenerating,
    generateReferralCode, 
    fetchStats,
  } = useReferral();
  const [copied, setCopied] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string>('');
  const [generationFailed, setGenerationFailed] = useState(false);
  const initRef = useRef(false);

  // Generate referral code and fetch stats on mount (once)
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    
    const init = async () => {
      const code = await generateReferralCode();
      if (code) {
        setInviteUrl(getInviteUrl(code));
        setGenerationFailed(false);
      } else {
        setGenerationFailed(true);
      }
      fetchStats();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetry = async () => {
    setGenerationFailed(false);
    const code = await generateReferralCode();
    if (code) {
      setInviteUrl(getInviteUrl(code));
    } else {
      setGenerationFailed(true);
    }
  };

  // Update invite URL when referral code changes
  useEffect(() => {
    if (referralCode) {
      setInviteUrl(getInviteUrl(referralCode));
    }
  }, [referralCode]);

  const handleCopy = async () => {
    if (!inviteUrl) return;
    
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      toast({
        title: 'Link Copied',
        description: 'Share this link with friends and family.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Copy Failed',
        description: 'Please copy the link manually.',
        variant: 'destructive',
      });
    }
  };

  const shareMessage = encodeURIComponent(
    `I just calculated my Zakat using this amazing tool. It follows authentic Islamic methodology and makes the process so easy. Try it out: ${inviteUrl}`
  );

  const shareLinks = {
    email: `mailto:?subject=${encodeURIComponent('Calculate Your Zakat')}&body=${shareMessage}`,
    whatsapp: `https://wa.me/?text=${shareMessage}`,
    twitter: `https://twitter.com/intent/tweet?text=${shareMessage}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteUrl)}&quote=${shareMessage}`,
  };

  if (variant === 'compact') {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Share & earn rewards</span>
          </div>
          
          {/* Stats summary */}
          {stats && stats.totalReferrals > 0 && (
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-semibold">{stats.totalReferrals}</span>
                <span className="text-muted-foreground">referrals</span>
              </div>
              {stats.thresholdMet && stats.totalZakatCalculated !== null && (
                <div className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="font-semibold">{formatCurrency(stats.totalZakatCalculated, currency)}</span>
                </div>
              )}
            </div>
          )}

          {isLoading && !stats && (
            <Skeleton className="h-5 w-24" />
          )}
          
          {/* Copy link button */}
          <div className="flex gap-2">
            {isGenerating ? (
              <Skeleton className="h-9 flex-1" />
            ) : generationFailed && !inviteUrl ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="flex-1 gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </Button>
            ) : (
              <Input
                readOnly
                value={inviteUrl}
                className="font-mono text-xs bg-muted/50 h-9"
                placeholder="Generating link..."
              />
            )}
            {!generationFailed && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!inviteUrl || isGenerating}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>

          {/* Quick share buttons */}
          <div className="flex gap-1.5">
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <a href={shareLinks.email} target="_blank" rel="noopener noreferrer">
                <Mail className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
                <Twitter className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
                <Facebook className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full variant (same as original ShareToolSection content)
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Share the Blessing</h3>
        </div>
        
        {/* Hadith Quote */}
        <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border/50">
          <p className="text-sm italic text-muted-foreground leading-relaxed text-center">
            "Whoever guides someone to goodness will have a reward like one who did it."
          </p>
          <p className="text-xs text-muted-foreground mt-2 font-medium text-center">
            — Prophet Muhammad ﷺ (Ṣaḥīḥ Muslim 1893)
          </p>
        </div>
        
        <p className="text-sm text-muted-foreground text-center">
          If this tool helped you, share it with friends & family.
        </p>

        {/* Share Buttons */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <a href={shareLinks.email} target="_blank" rel="noopener noreferrer">
              <Mail className="w-4 h-4" />
              Email
            </a>
          </Button>
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </Button>
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
              <Twitter className="w-4 h-4" />
              Twitter
            </a>
          </Button>
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
              <Facebook className="w-4 h-4" />
              Facebook
            </a>
          </Button>
        </div>

        {/* Personal Invite Link */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground text-center">Your personal invite link:</p>
          <div className="flex gap-2">
            {isGenerating ? (
              <Skeleton className="h-10 flex-1" />
            ) : generationFailed && !inviteUrl ? (
              <Button
                variant="outline"
                onClick={handleRetry}
                className="flex-1 gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Retry generating link
              </Button>
            ) : (
              <Input
                readOnly
                value={inviteUrl}
                className="font-mono text-sm bg-muted/50"
              />
            )}
            {!generationFailed && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                disabled={!inviteUrl || isGenerating}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Referral Stats */}
        {(stats && stats.totalReferrals > 0) && (
          <div className="bg-primary/10 rounded-lg p-4 text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="text-sm font-medium text-foreground">
                Through your shares
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 text-sm">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold">{stats.totalReferrals}</span>
                <span className="text-muted-foreground">
                  {stats.totalReferrals === 1 ? 'calculation' : 'calculations'}
                </span>
              </div>
              {stats.thresholdMet && stats.totalZakatCalculated !== null ? (
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold">{formatCurrency(stats.totalZakatCalculated, currency)}</span>
                  <span className="text-muted-foreground">Zakat calculated</span>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Refer {5 - stats.totalReferrals} more to see Zakat impact
                </p>
              )}
            </div>
          </div>
        )}

        {isLoading && !stats && (
          <div className="bg-primary/10 rounded-lg p-4">
            <Skeleton className="h-4 w-32 mx-auto mb-2" />
            <Skeleton className="h-6 w-48 mx-auto" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
