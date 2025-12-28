import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReferral } from '@/hooks/useReferral';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Calculator, Heart, Shield, Users } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import zakatLogo from '@/assets/zakahflow-logo.png';

export default function Invite() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { storeReferralCode } = useReferral();

  // Store the referral code in sessionStorage when user arrives
  useEffect(() => {
    if (code) {
      storeReferralCode(code);
    }
  }, [code, storeReferralCode]);

  const handleStartCalculation = () => {
    navigate('/');
  };

  return (
    <>
      <Helmet>
        <title>You're Invited to Calculate Your Zakat | ZakahFlow</title>
        <meta name="description" content="A friend invited you to calculate your Zakat using ZakahFlow - a free, privacy-focused tool based on authentic Islamic methodology." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
        {/* Header */}
        <header className="p-4 flex justify-center">
          <img 
            src={zakatLogo} 
            alt="ZakahFlow" 
            className="h-10 object-contain"
          />
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 pb-12">
          <div className="max-w-lg w-full space-y-6">
            {/* Hadith Card */}
            <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <Heart className="w-10 h-10 text-primary mx-auto" />
                  <blockquote className="text-lg italic text-foreground/90 leading-relaxed">
                    "Whoever guides someone to goodness will have a reward like one who did it."
                  </blockquote>
                  <p className="text-sm text-muted-foreground font-medium">
                    — Prophet Muhammad ﷺ (Ṣaḥīḥ Muslim 1893)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Invitation Card */}
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">You've Been Invited!</CardTitle>
                <CardDescription className="text-base">
                  A friend thinks you might benefit from calculating your Zakat with ZakahFlow
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Calculator className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Authentic Methodology</p>
                      <p className="text-xs text-muted-foreground">
                        Based on Sheikh Joe Bradford's comprehensive approach
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Shield className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Privacy Focused</p>
                      <p className="text-xs text-muted-foreground">
                        Your financial data stays private with end-to-end encryption
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Trusted by Many</p>
                      <p className="text-xs text-muted-foreground">
                        Join thousands who've used this tool to fulfill their obligation
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <Button 
                  onClick={handleStartCalculation}
                  className="w-full gap-2"
                  size="lg"
                >
                  Calculate My Zakat
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Free to use • No account required • Takes about 10 minutes
                </p>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-4 text-center">
          <p className="text-xs text-muted-foreground">
            May Allah accept your Zakat and bless you with more
          </p>
        </footer>
      </div>
    </>
  );
}
