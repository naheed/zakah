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

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/hooks/useAuth';
import { useSavedCalculations, generateYearName, SavedCalculation } from '@/hooks/useSavedCalculations';
import { useSharedCalculations } from '@/hooks/useCalculationShares';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@zakatflow/core';
import { ArrowLeft, Plus, Trash, Calendar, CheckCircle, XCircle, Spinner, Users, Calculator } from '@phosphor-icons/react';
import { Footer } from '@/components/zakat/Footer';
import { useZakatPersistence } from '@/hooks/useZakatPersistence';
import { getPrimaryUrl } from '@/lib/domainConfig';
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
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SavedCalculations() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { calculations, loading, deleteCalculation } = useSavedCalculations();
  const { calculations: sharedCalculations, loading: sharedLoading } = useSharedCalculations();
  const { startFresh } = useZakatPersistence();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteCalculation(id);
    setDeletingId(null);
  };

  const handleLoadCalculation = (calc: SavedCalculation) => {
    // Store the calculation to load in localStorage and navigate home
    localStorage.setItem('zakat-load-calculation', JSON.stringify(calc));
    navigate('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Saved Calculations - ZakatFlow</title>
        <link rel="canonical" href={getPrimaryUrl('/saved')} />
        <meta property="og:url" content={getPrimaryUrl('/saved')} />
      </Helmet>

      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Saved Calculations</h1>
              <p className="text-sm text-muted-foreground">View and manage your Zakat records</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Tabs defaultValue="my-calculations" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="my-calculations">My Calculations</TabsTrigger>
            <TabsTrigger value="shared-with-me" className="gap-2">
              <Users className="w-4 h-4" />
              Shared with Me
              {sharedCalculations.length > 0 && (
                <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-full px-2">
                  {sharedCalculations.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-calculations">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Spinner className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : calculations.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-xl font-semibold mb-2">No Saved Calculations</h2>
                  <p className="text-muted-foreground mb-6">
                    {user
                      ? "Start a new Zakat calculation and save it to view it here."
                      : "Completed guest calculations will appear here. Sign in to save them to the cloud."}
                  </p>
                  <div className="flex flex-col gap-3 items-center">
                    <Button
                      variant="outline"
                      onClick={() => { startFresh(); navigate('/?step=1'); }}
                      className="gap-2"
                    >
                      <Calculator className="w-4 h-4" weight="duotone" />
                      Start New Calculation
                    </Button>
                    {!user && (
                      <Button variant="link" onClick={() => navigate('/auth')}>
                        Sign In to Sync
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {calculations.map((calc) => (
                  <CalculationCard
                    key={calc.id}
                    calc={calc}
                    onLoad={handleLoadCalculation}
                    onDelete={handleDelete}
                    deletingId={deletingId}
                    isOwner={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="shared-with-me">
            {!user ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
                  <p className="text-muted-foreground mb-6">
                    Please sign in to view calculations shared with you.
                  </p>
                  <Button onClick={() => navigate('/auth')}>
                    Sign In
                  </Button>
                </CardContent>
              </Card>
            ) : sharedLoading ? (
              <div className="flex items-center justify-center py-20">
                <Spinner className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : sharedCalculations.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-xl font-semibold mb-2">No Shared Calculations</h2>
                  <p className="text-muted-foreground">
                    When someone shares a Zakat calculation with you, it will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {sharedCalculations.map((calc) => (
                  <CalculationCard
                    key={calc.id}
                    calc={calc}
                    onLoad={handleLoadCalculation}
                    onDelete={() => { }}
                    deletingId={null}
                    isOwner={false}
                    isShared={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div >
  );
}

interface CalculationCardProps {
  calc: SavedCalculation;
  onLoad: (calc: SavedCalculation) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
  isOwner: boolean;
  isShared?: boolean;
}

function CalculationCard({ calc, onLoad, onDelete, deletingId, isOwner, isShared }: CalculationCardProps) {
  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onLoad(calc)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {calc.name}
              {isShared && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  Shared
                </span>
              )}
              {calc.is_above_nisab ? (
                <CheckCircle className="w-4 h-4 text-chart-1" />
              ) : (
                <XCircle className="w-4 h-4 text-muted-foreground" />
              )}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Calendar className="w-3 h-3" />
              {generateYearName(calc.year_type, calc.year_value)}
              <span className="text-xs">•</span>
              <span className="text-xs">
                Updated {new Date(calc.updated_at).toLocaleDateString()}
              </span>
            </CardDescription>
          </div>
          {isOwner && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={(e) => e.stopPropagation()}
                >
                  {deletingId === calc.id ? (
                    <Spinner className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash className="w-4 h-4" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Calculation?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete "{calc.name}". This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(calc.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {calc.is_above_nisab ? 'Zakat Due' : 'Below Nisab'}
          </div>
          <div className={`text-xl font-bold ${calc.is_above_nisab ? 'text-primary' : 'text-muted-foreground'}`}>
            {calc.is_above_nisab
              ? formatCurrency(calc.zakat_due, calc.form_data.currency)
              : 'No Zakat Due'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
