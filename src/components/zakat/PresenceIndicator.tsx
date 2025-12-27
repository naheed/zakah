import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PresenceUser } from '@/hooks/usePresence';
import { cn } from '@/lib/utils';

interface PresenceIndicatorProps {
  users: PresenceUser[];
  maxVisible?: number;
}

export function PresenceIndicator({ users, maxVisible = 3 }: PresenceIndicatorProps) {
  if (users.length === 0) return null;

  const visibleUsers = users.slice(0, maxVisible);
  const remainingCount = users.length - maxVisible;

  const getInitials = (user: PresenceUser) => {
    if (user.fullName) {
      return user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email?.slice(0, 2).toUpperCase() || 'U';
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        {/* Editing indicator */}
        <div className="flex items-center gap-1.5 mr-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {users.length === 1 ? '1 person' : `${users.length} people`} editing
          </span>
        </div>

        {/* User avatars */}
        <div className="flex -space-x-2">
          {visibleUsers.map((user, index) => (
            <Tooltip key={user.id}>
              <TooltipTrigger asChild>
                <div 
                  className={cn(
                    "relative ring-2 ring-background rounded-full transition-transform hover:scale-110 hover:z-10"
                  )}
                  style={{ zIndex: visibleUsers.length - index }}
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user.avatarUrl} alt={user.fullName || user.email} />
                    <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">
                      {getInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  {/* Online indicator */}
                  <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-1 ring-background" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                <p className="font-medium">{user.fullName || user.email}</p>
                {user.currentStep && (
                  <p className="text-muted-foreground">On: {user.currentStep}</p>
                )}
              </TooltipContent>
            </Tooltip>
          ))}

          {remainingCount > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative ring-2 ring-background rounded-full">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
                      +{remainingCount}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                <p>{remainingCount} more {remainingCount === 1 ? 'person' : 'people'}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
