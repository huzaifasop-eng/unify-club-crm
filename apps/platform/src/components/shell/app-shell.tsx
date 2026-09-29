'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { Brand } from './brand';
import { CommandMenu } from './command-menu';
import { MobileDrawer } from './mobile-drawer';
import { MobileTabBar } from './mobile-tab-bar';
import { SidebarNav } from './sidebar-nav';
import { Topbar } from './topbar';

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Close the drawer on any navigation, including browser back/forward.
  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = !!target?.closest('input, textarea, select, [contenteditable="true"]');
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="flex min-h-dvh">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Skip to content
      </a>

      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-sidebar lg:flex">
        <Brand />
        <SidebarNav />
      </aside>
      <MobileDrawer open={menuOpen} onOpenChange={setMenuOpen} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMenu={() => setMenuOpen(true)} onOpenSearch={() => setSearchOpen(true)} />
        <main id="main" className="flex-1 px-4 pb-24 pt-6 md:px-6 md:pb-10 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>

      <MobileTabBar onOpenMenu={() => setMenuOpen(true)} />
      <CommandMenu open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
