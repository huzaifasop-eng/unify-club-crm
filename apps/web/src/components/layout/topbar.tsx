'use client';

import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Moon, Sun, LogOut, User as UserIcon, Building2 } from 'lucide-react';
import { AuthUserProfile } from '@/lib/types';
import { authStore } from '@/lib/auth-store';
import { apiClient } from '@/lib/api-client';
import { initials } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Topbar({ user }: { user: AuthUserProfile | null }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  async function handleLogout() {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // ignore network errors on logout
    } finally {
      authStore.clear();
      router.push('/login');
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      <div className="flex items-center gap-2">
        {user?.branches && user.branches.length > 0 && (
          <div className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {user.isCrossBranch ? 'All Branches' : user.branches.map((b) => b.name).join(', ')}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full focus:outline-none">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {initials(user?.firstName, user?.lastName) || <UserIcon className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="font-medium">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-muted-foreground font-normal">{user?.email}</p>
              <p className="text-xs text-muted-foreground font-normal mt-0.5">{user?.roles?.join(', ')}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
