'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronRight, CornerDownRight } from 'lucide-react';
import { NAVIGATION, type NavGroupSection } from '@/config/navigation';
import { filterNavigation, groupContainsPath, isActivePath } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { useCan } from './permissions-provider';

const linkBase =
  'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring';
const linkIdle = 'text-sidebar-foreground hover:bg-accent hover:text-accent-foreground';
const linkActive = 'bg-sidebar-active text-sidebar-active-foreground';

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname() ?? '';
  const can = useCan();
  const nav = useMemo(() => filterNavigation(NAVIGATION, can), [can]);

  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set(activeGroupIds(nav, pathname)),
  );

  // Navigating into a group (via palette, dashboard tile, link) expands it; nothing auto-collapses.
  useEffect(() => {
    const active = activeGroupIds(nav, pathname);
    if (active.length === 0) return;
    setOpenGroups((prev) => (active.every((id) => prev.has(id)) ? prev : new Set([...prev, ...active])));
  }, [nav, pathname]);

  const toggle = (id: string, open: boolean) =>
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (open) next.add(id);
      else next.delete(id);
      return next;
    });

  return (
    <nav aria-label="Main" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
      {nav.map((section) => {
        if (section.kind === 'link') {
          const active = isActivePath(pathname, section.href);
          const Icon = section.icon;
          return (
            <Link
              key={section.id}
              href={section.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(linkBase, active ? linkActive : linkIdle)}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              <span className="truncate">{section.label}</span>
            </Link>
          );
        }
        return (
          <NavGroup
            key={section.id}
            section={section}
            pathname={pathname}
            open={openGroups.has(section.id)}
            onOpenChange={(open) => toggle(section.id, open)}
            onNavigate={onNavigate}
          />
        );
      })}
    </nav>
  );
}

function NavGroup({
  section,
  pathname,
  open,
  onOpenChange,
  onNavigate,
}: {
  section: NavGroupSection;
  pathname: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate?: () => void;
}) {
  const Icon = section.icon;
  const containsActive = groupContainsPath(section, pathname);

  return (
    <Collapsible.Root open={open} onOpenChange={onOpenChange}>
      <Collapsible.Trigger
        className={cn(
          linkBase,
          'w-full',
          containsActive && !open ? linkActive : linkIdle,
          containsActive && 'text-foreground',
        )}
      >
        <Icon className="h-4 w-4 shrink-0" aria-hidden />
        <span className="flex-1 truncate text-left">{section.label}</span>
        <ChevronRight
          className={cn('h-4 w-4 shrink-0 transition-transform duration-200', open && 'rotate-90')}
          aria-hidden
        />
      </Collapsible.Trigger>
      <Collapsible.Content className="overflow-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
        <ul className="ml-[1.1rem] mt-0.5 space-y-0.5 border-l border-border pl-2.5">
          {section.items.map((item) => {
            const active = isActivePath(pathname, item.href);
            const ItemIcon = item.alias ? CornerDownRight : item.icon;
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  title={item.alias ? `Opens ${item.href}` : undefined}
                  className={cn(linkBase, 'py-1.5', active ? linkActive : linkIdle)}
                >
                  <ItemIcon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

function activeGroupIds(nav: ReturnType<typeof filterNavigation>, pathname: string): string[] {
  return nav
    .filter((s): s is NavGroupSection => s.kind === 'group' && groupContainsPath(s, pathname))
    .map((s) => s.id);
}
