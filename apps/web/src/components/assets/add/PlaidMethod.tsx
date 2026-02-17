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

import { useNavigate } from 'react-router-dom';
import { Link, Spinner } from '@phosphor-icons/react';
import { usePlaidLink } from '@/hooks/usePlaidLink';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PlaidMethodProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export function PlaidMethod({ onSuccess, onCancel }: PlaidMethodProps) {
    const navigate = useNavigate();
    const plaidLink = usePlaidLink();

    const handleConnect = async () => {
        const result = await plaidLink.openPlaidLink();
        if (result.success) {
            onSuccess();
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Connect Bank</CardTitle>
                <CardDescription>
                    Securely link your bank or brokerage to automatically import account data
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                        <Link className="w-8 h-8" />
                    </div>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                        ZakatFlow uses Plaid to securely connect to your financial institution.
                        Your login credentials are never stored on our servers.
                    </p>
                    <Button
                        size="lg"
                        onClick={handleConnect}
                        disabled={plaidLink.isLoading}
                    >
                        {plaidLink.isLoading ? (
                            <Spinner className="w-4 h-4 mr-2 animate-spin" />
                        ) : null}
                        {plaidLink.status === 'loading_token' && 'Preparing...'}
                        {plaidLink.status === 'exchanging' && 'Connecting...'}
                        {(plaidLink.status === 'idle' || plaidLink.status === 'ready') && 'Connect Your Bank'}
                    </Button>
                </div>

                {plaidLink.error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-800 dark:text-red-200">
                            {plaidLink.error}
                        </p>
                    </div>
                )}

                <Button variant="ghost" onClick={onCancel} className="w-full">
                    ← Back to options
                </Button>
            </CardContent>
        </Card>
    );
}
