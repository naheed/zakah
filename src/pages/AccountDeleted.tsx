
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Envelope, CheckCircle, ArrowRight } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

const AccountDeleted = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg border-2">
                <CardHeader className="text-center space-y-4 pt-8">
                    <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-2">
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-500" weight="fill" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Account Deleted</CardTitle>
                    <CardDescription className="text-lg">
                        We're sorry to see you go.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pb-8">
                    <div className="text-center text-muted-foreground">
                        <p>Your account and all associated data have been permanently removed from our systems.</p>
                    </div>

                    <div className="bg-secondary/50 p-6 rounded-lg space-y-3">
                        <h3 className="font-semibold flex items-center gap-2 text-foreground">
                            <Envelope className="w-4 h-4" />
                            Before you leave...
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            We'd love to know why you decided to delete your account. Your feedback helps us build a better product for everyone.
                        </p>
                        <a
                            href="mailto:naheed@vora.dev?subject=Zakah Calculator Feedback - Account Deletion"
                            className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
                        >
                            Send feedback to naheed@vora.dev
                            <ArrowRight className="w-3 h-3" />
                        </a>
                    </div>

                    <Button
                        className="w-full"
                        size="lg"
                        onClick={() => navigate('/')}
                    >
                        Return to Home Page
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default AccountDeleted;
