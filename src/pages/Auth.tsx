import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Spinner, Shield, Lock, Eye } from '@phosphor-icons/react';
import { Logo } from '@/components/zakat/Logo';
import { getPrimaryUrl } from '@/lib/domainConfig';

export default function Auth() {
  const navigate = useNavigate();
  const { user, loading, signInWithGoogle } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'Could not sign in with Google.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Helmet>
        <title>Sign In | ZakatFlow</title>
        <meta name="description" content="Sign in securely to save and access your encrypted Zakat calculations." />
        <link rel="canonical" href={getPrimaryUrl('/auth')} />
        <meta property="og:url" content={getPrimaryUrl('/auth')} />
      </Helmet>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <p className="text-sm text-muted-foreground">
            Sign in securely to save and access your Zakat calculations
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Security features */}
          <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm text-foreground">End-to-End Encrypted</p>
                <p className="text-xs text-muted-foreground">
                  Your financial data is encrypted in your browser before storage
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm text-foreground">Privacy First</p>
                <p className="text-xs text-muted-foreground">
                  Only you can access your saved calculations - not even our team
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm text-foreground">Secure Sharing</p>
                <p className="text-xs text-muted-foreground">
                  Share with your spouse using encrypted key exchange
                </p>
              </div>
            </div>
          </div>

          {/* Google Login */}
          <Button
            variant="default"
            className="w-full gap-2 h-12 text-base"
            onClick={handleGoogleLogin}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            <a href="/" className="hover:text-primary underline">
              Continue without signing in
            </a>
          </p>

          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our privacy-first approach.
            Your data remains encrypted and under your control.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
