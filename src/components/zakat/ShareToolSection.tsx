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

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EnvelopeSimple, ChatCircle, TwitterLogo, FacebookLogo, Copy, Check, Users, Heart, Sparkle, LinkedinLogo } from '@phosphor-icons/react';
import { useToast } from '@/hooks/use-toast';
import { useReferral, getInviteUrl } from '@/hooks/useReferral';
import { formatCurrency } from '@/lib/zakatCalculations';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareToolSectionProps {
  currency: string;
}

// Platform-specific share messages (aligned with docs/COPY_FRAMING.md)
function getShareMessages(inviteUrl: string) {
  return {
    whatsapp: encodeURIComponent(
      `Assalamu Alaikum! I used this to calculate my Zakat—handles 401(k)s, crypto, and real estate, all in one place. Free, private, and you can save your calculation with encrypted storage for next year. Give it a try: ${inviteUrl}`
    ),
    twitter: encodeURIComponent(
      `Found an easy Zakat calculator that handles 401(k)s, crypto & real estate. Free and private—your data stays encrypted: ${inviteUrl}`
    ),
    facebook: encodeURIComponent(
      `Just used this free Zakat calculator. It handles complex assets like 401(k)s and crypto automatically. You can download a PDF or save your calculation with encrypted storage—only you can decrypt it. Sharing in case it helps.`
    ),
    linkedin: encodeURIComponent(
      `For those calculating Zakat this year: I found a comprehensive calculator that handles 401(k)s, RSUs, crypto, and real estate. You can download a PDF report or save calculations with encrypted storage. Free to use: ${inviteUrl}`
    ),
    emailSubject: encodeURIComponent('Easy Zakat Calculator I Found'),
    emailBody: encodeURIComponent(
      `Assalamu Alaikum,\n\nI wanted to share this Zakat calculator that I found really helpful. It handles 401(k)s, crypto, real estate, and RSUs automatically. You can save your calculation with encrypted storage (only you can decrypt it) or download a PDF report.\n\nIt's free and takes about 5 minutes: ${inviteUrl}\n\nHope it helps!`
    ),
  };
}

export function ShareToolSection({ currency }: ShareToolSectionProps) {
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
  const initRef = useRef(false);

  // Generate referral code and fetch stats on mount (once)
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    
    const init = async () => {
      const code = await generateReferralCode();
      if (code) {
        setInviteUrl(getInviteUrl(code));
      }
      fetchStats();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const messages = getShareMessages(inviteUrl);

  const shareLinks = {
    email: `mailto:?subject=${messages.emailSubject}&body=${messages.emailBody}`,
    whatsapp: `https://wa.me/?text=${messages.whatsapp}`,
    twitter: `https://twitter.com/intent/tweet?text=${messages.twitter}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteUrl)}&quote=${messages.facebook}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(inviteUrl)}`,
  };

  const shouldAnimate = stats && stats.totalReferrals > 2;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-primary" weight="fill" />
          <CardTitle className="text-xl">Share & Earn Hasanat</CardTitle>
        </div>
        
        {/* Hadith Quote with Arabic */}
        <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border/50 mt-4 space-y-3">
          <p className="text-sm italic text-muted-foreground leading-relaxed">
            "Whoever calls to guidance will have a reward similar to those who follow him, without detracting from their rewards at all."
          </p>
          <p className="text-sm text-muted-foreground/80 leading-relaxed font-arabic" dir="rtl">
            مَنْ دَعَا إِلَى هُدًى كَانَ لَهُ مِنَ الأَجْرِ مِثْلُ أُجُورِ مَنْ تَبِعَهُ لاَ يَنْقُصُ ذَلِكَ مِنْ أُجُورِهِمْ شَيْئًا
          </p>
          <p className="text-xs text-muted-foreground font-medium">
            — Prophet Muhammad ﷺ (Ṣaḥīḥ Muslim 2674)
          </p>
        </div>
        
        <CardDescription className="mt-4">
          If this tool helped you, share it with friends & family.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Share Buttons */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            asChild
          >
            <a href={shareLinks.email} target="_blank" rel="noopener noreferrer">
              <EnvelopeSimple className="w-4 h-4" />
              Email
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            asChild
          >
            <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer">
              <ChatCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            asChild
          >
            <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
              <TwitterLogo className="w-4 h-4" />
              Twitter
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            asChild
          >
            <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
              <FacebookLogo className="w-4 h-4" />
              Facebook
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            asChild
          >
            <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer">
              <LinkedinLogo className="w-4 h-4" />
              LinkedIn
            </a>
          </Button>
        </div>

        {/* Personal Invite Link */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground text-center">Your personal invite link:</p>
          <div className="flex gap-2">
            {isGenerating ? (
              <Skeleton className="h-10 flex-1" />
            ) : (
              <Input
                readOnly
                value={inviteUrl}
                className="font-mono text-sm bg-muted/50"
              />
            )}
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
          </div>
        </div>

        {/* Referral Stats with Animation */}
        <AnimatePresence mode="wait">
          {(stats && stats.totalReferrals > 0) && (
            <motion.div 
              className="bg-primary/10 rounded-lg p-4 text-center space-y-2"
              initial={shouldAnimate ? { opacity: 0, y: 10 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <motion.div 
                className="flex items-center justify-center gap-2"
                animate={shouldAnimate ? {
                  scale: [1, 1.05, 1],
                } : undefined}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Sparkle className="w-4 h-4 text-primary" />
                <p className="text-sm font-medium text-foreground">
                  Through your shares
                </p>
              </motion.div>
              <div className="flex flex-col items-center gap-2 text-sm">
                <motion.div 
                  className="flex items-center gap-1.5"
                  initial={shouldAnimate ? { scale: 0.9 } : false}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <motion.span 
                    className="font-semibold"
                    key={stats.totalReferrals}
                    initial={shouldAnimate ? { opacity: 0, y: -10 } : false}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {stats.totalReferrals}
                  </motion.span>
                  <span className="text-muted-foreground">
                    {stats.totalReferrals === 1 ? 'calculation' : 'calculations'}
                  </span>
                </motion.div>
                {/* Only show financial stats if privacy threshold is met */}
                {stats.thresholdMet && stats.totalZakatCalculated !== null ? (
                  <motion.div 
                    className="flex items-center gap-1.5"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <Heart className="w-4 h-4 text-muted-foreground" weight="fill" />
                    <span className="font-semibold">{formatCurrency(stats.totalZakatCalculated, currency)}</span>
                    <span className="text-muted-foreground">Zakat calculated</span>
                  </motion.div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Refer {5 - stats.totalReferrals} more to see Zakat impact
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
