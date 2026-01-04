import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, SignOut, ClockCounterClockwise, SignIn, House, GearSix, Sun, Moon } from '@phosphor-icons/react';
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";

interface UserMenuProps {
  onHome?: () => void;
}

export function UserMenu({ onHome }: UserMenuProps) {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  // Handle theme toggle
  const toggleTheme = (e: React.MouseEvent) => {
    e.preventDefault();
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (loading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <User className="h-5 w-5 animate-pulse" />
      </Button>
    );
  }

  // GUEST MENU (Unified Command Center)
  if (!user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2 px-2">
            <User className="h-5 w-5" />
            <span className="font-medium">Menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 p-2">
          {/* Theme Toggle Row */}
          <div className="flex items-center justify-between px-2 py-2 mb-2 bg-muted/30 rounded-lg">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              Appearance
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full"
                onClick={() => setTheme('light')}
                disabled={theme === 'light'}
              >
                <Sun className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full"
                onClick={() => setTheme('dark')}
                disabled={theme === 'dark'}
              >
                <Moon className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              if (onHome) {
                onHome();
              } else {
                navigate('/');
              }
            }}
            className="cursor-pointer"
          >
            <House className="mr-3 h-4 w-4 text-muted-foreground" />
            Home
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
            <GearSix className="mr-3 h-4 w-4 text-muted-foreground" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => navigate('/auth')} className="cursor-pointer text-primary focus:text-primary font-medium">
            <SignIn className="mr-3 h-4 w-4" />
            Sign In
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // SIGNED IN USER MENU (Unified Command Center)
  const initials = user.user_metadata?.full_name
    ? user.user_metadata.full_name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    : user.email?.slice(0, 2).toUpperCase() || 'U';

  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 border border-border">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl} alt={user.email || 'User'} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2">
        <DropdownMenuLabel className="font-normal px-2 py-3">
          <div className="flex flex-col space-y-1">
            {user.user_metadata?.full_name && (
              <p className="text-sm font-medium leading-none">
                {user.user_metadata.full_name}
              </p>
            )}
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        {/* Theme Toggle Row */}
        <div className="flex items-center justify-between px-2 py-2 mb-2 bg-muted/30 rounded-lg mx-1">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            Appearance
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant={theme === 'light' ? 'default' : 'ghost'}
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={(e) => { e.preventDefault(); setTheme('light'); }}
            >
              <Sun className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'ghost'}
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={(e) => { e.preventDefault(); setTheme('dark'); }}
            >
              <Moon className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            if (onHome) {
              onHome();
            } else {
              navigate('/');
            }
          }}
          className="cursor-pointer py-2.5"
        >
          <House className="mr-3 h-4 w-4 text-muted-foreground" />
          Home Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/calculations')} className="cursor-pointer py-2.5">
          <ClockCounterClockwise className="mr-3 h-4 w-4 text-muted-foreground" />
          Saved Calculations
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer py-2.5">
          <GearSix className="mr-3 h-4 w-4 text-muted-foreground" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={async () => {
            await signOut();
            navigate('/logout');
          }}
          className="cursor-pointer py-2.5 text-destructive focus:text-destructive"
        >
          <SignOut className="mr-3 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
