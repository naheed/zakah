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
import { formatDistanceToNow } from "date-fns";

interface ContinueSessionDialogProps {
  open: boolean;
  lastUpdated: Date | null;
  onContinue: () => void;
  onStartFresh: () => void;
}

export function ContinueSessionDialog({
  open,
  lastUpdated,
  onContinue,
  onStartFresh,
}: ContinueSessionDialogProps) {
  const timeAgo = lastUpdated 
    ? formatDistanceToNow(lastUpdated, { addSuffix: true })
    : 'recently';

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            Welcome back! 👋
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            You have an unfinished calculation from {timeAgo}. 
            Would you like to continue where you left off?
          </AlertDialogDescription>
        </AlertDialogHeader>
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
      </AlertDialogContent>
    </AlertDialog>
  );
}
