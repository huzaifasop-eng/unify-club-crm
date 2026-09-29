'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { ChevronRight, Menu, Search } from 'lucide-react';
import { NAVIGATION } from '@/config/navigation';
import { breadcrumbsFor } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';

export function Topbar({ onOpenMenu, onOpenSearch }: { onOpenMenu: () => void; onOpenSearch: () => void }) {
  const pathname = usePathname() ?? '';
  const crumbs = breadcrumbsFor(NAVIGATION, pathname);
  const [shortcut, setShortcut] = useState('Ctrl K');

  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.platform)) setShortcut('⌘K');
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background/90 px-4 backdrop-blur md:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onOpenMenu} aria-label="Open navigation">
        <Menu className="h-5 w-5" />
      </Button>

      <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
        <ol className="flex items-center gap-1.5 text-sm">
          {crumbs.map((crumb, i) => (
            <Fragment key={crumb.label}>
              {i > 0 && (
                // Only the current page is shown on phones, so its separator hides with the parents.
                <ChevronRight className="hidden h-3.5 w-3.5 shrink-0 text-muted-foreground sm:block" aria-hidden />
              )}
              <li className={i === crumbs.length - 1 ? 'truncate font-semibold' : 'hidden text-muted-foreground sm:block'}>
                {crumb.href && i === crumbs.length - 1 ? (
                  <Link href={crumb.href} aria-current="page">
                    {crumb.label}
                  </Link>
                ) : (
                  crumb.label
                )}
              </li>
            </Fragment>
          ))}
        </ol>
      </nav>

      <button
        type="button"
        onClick={onOpenSearch}
        className="flex h-9 items-center gap-2 rounded-md border border-input bg-card px-3 text-sm text-muted-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Search pages"
      >
        <Search className="h-4 w-4" aria-hidden />
        <span className="hidden md:inline">Search…</span>
        <kbd className="hidden rounded border border-border bg-muted px-1.5 font-mono text-[10px] md:inline">
          {shortcut}
        </kbd>
      </button>
      <ThemeToggle />
    </header>
  );
}
