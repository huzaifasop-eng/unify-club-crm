'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { Menu } from 'lucide-react';
import { MOBILE_TABS, NAVIGATION } from '@/config/navigation';
import { filterNavigation, findEntryById, isActivePath } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { useCan } from './permissions-provider';

const tabClass =
  'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium outline-none focus-visible:bg-accent';

export function MobileTabBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const pathname = usePathname() ?? '';
  const can = useCan();
  const tabs = useMemo(() => {
    const nav = filterNavigation(NAVIGATION, can);
    return MOBILE_TABS.flatMap((id) => findEntryById(nav, id) ?? []);
  }, [can]);

  return (
    <nav
      aria-label="Quick navigation"
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      {tabs.map((tab) => {
        const active = isActivePath(pathname, tab.href);
        const Icon = tab.icon;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            aria-current={active ? 'page' : undefined}
            className={cn(tabClass, active ? 'text-primary' : 'text-muted-foreground')}
          >
            <Icon className="h-5 w-5" aria-hidden />
            {tab.label}
          </Link>
        );
      })}
      <button type="button" onClick={onOpenMenu} className={cn(tabClass, 'text-muted-foreground')}>
        <Menu className="h-5 w-5" aria-hidden />
        Menu
      </button>
    </nav>
  );
}
