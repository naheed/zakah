import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Clock, Cloud, HardDrive, Calculator } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSavedCalculations, SavedCalculation } from "@/hooks/useSavedCalculations";

interface ContinueSessionDialogProps {
  open: boolean;
  lastUpdated: Date | null;
  onContinue: () => void;
  onStartFresh: () => void;
  onLoadServerCalculation?: (calculation: SavedCalculation) => void;
}

export function ContinueSessionDialog({
  open,
  lastUpdated,
  onContinue,
  onStartFresh,
  onLoadServerCalculation,
}: ContinueSessionDialogProps) {
  const { user } = useAuth();
  const { calculations, loading } = useSavedCalculations();
  const [mostRecentServerCalc, setMostRecentServerCalc] = useState<SavedCalculation | null>(null);

  const localTimeAgo = lastUpdated 
    ? formatDistanceToNow(lastUpdated, { addSuffix: true })
    : 'recently';

  // Find the most recent server-saved calculation
  useEffect(() => {
    if (calculations.length > 0 && !loading) {
      // calculations are already sorted by updated_at desc
      setMostRecentServerCalc(calculations[0]);
    }
  }, [calculations, loading]);

  const serverTimeAgo = mostRecentServerCalc
    ? formatDistanceToNow(new Date(mostRecentServerCalc.updated_at), { addSuffix: true })
    : null;

  // Determine which option is more recent
  const serverIsMoreRecent = mostRecentServerCalc && lastUpdated 
    ? new Date(mostRecentServerCalc.updated_at) > lastUpdated
    : false;

  const handleLoadServerCalc = () => {
    if (mostRecentServerCalc && onLoadServerCalculation) {
      onLoadServerCalculation(mostRecentServerCalc);
    }
  };

  // If user is logged in and has server calculations, show enhanced dialog
  const showServerOption = user && mostRecentServerCalc && onLoadServerCalculation;

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            Welcome back! 👋
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            {showServerOption 
              ? "You have calculations available. Which would you like to continue?"
              : `You have an unfinished calculation from ${localTimeAgo}. Would you like to continue where you left off?`
            }
          </AlertDialogDescription>
        </AlertDialogHeader>

        {showServerOption ? (
          <div className="space-y-3 py-2">
            {/* Local draft option */}
            <Button
              variant={serverIsMoreRecent ? "outline" : "default"}
              className="w-full justify-start gap-3 h-auto py-3"
              onClick={onContinue}
            >
              <div className="p-2 rounded-full bg-muted shrink-0">
                <HardDrive className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="font-medium">Continue local draft</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {localTimeAgo}
                </p>
              </div>
            </Button>

            {/* Server calculation option */}
            <Button
              variant={serverIsMoreRecent ? "default" : "outline"}
              className="w-full justify-start gap-3 h-auto py-3"
              onClick={handleLoadServerCalc}
            >
              <div className="p-2 rounded-full bg-muted shrink-0">
                <Cloud className="w-4 h-4" />
              </div>
              <div className="text-left min-w-0">
                <p className="font-medium truncate">{mostRecentServerCalc.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {serverTimeAgo} • Saved to cloud
                </p>
              </div>
            </Button>

            {/* Start fresh option */}
            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={onStartFresh}
            >
              Start fresh instead
            </Button>
          </div>
        ) : (
          <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
            <AlertDialogAction 
              onClick={onContinue}
              className="w-full"
            >
              Continue my calculation
            </AlertDialogAction>
            <AlertDialogCancel 
              onClick={onStartFresh}
              className="w-full"
            >
              Start fresh
            </AlertDialogCancel>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
