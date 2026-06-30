'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeartHandshake } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_GROUPS } from '@/lib/nav-config';
import { AuthUserProfile } from '@/lib/types';
import { authStore } from '@/lib/auth-store';

export function Sidebar({ user }: { user: AuthUserProfile | null }) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex h-screen w-64 shrink-0 flex-col border-r border-border bg-card">
      <div className="flex items-center gap-2 px-5 h-16 border-b border-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <HeartHandshake className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold leading-tight">Unify Club</p>
          <p className="text-[10px] text-muted-foreground leading-tight">ERP &amp; CRM</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {NAV_GROUPS.map((group) => {
          const items = group.items.filter(
            (item) => !item.permission || authStore.hasPermission(user, item.permission)
          );
          if (items.length === 0) return null;
          return (
            <div key={group.label}>
              <p className="px-2 mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const active = pathname === item.href || pathname?.startsWith(item.href + '/');
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors',
                        active
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-border text-[10px] text-muted-foreground">
        Leading the Empowerment of Every Ability
      </div>
    </aside>
  );
}
