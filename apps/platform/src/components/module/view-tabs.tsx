'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

/** Saved-view switcher. Views become URL-backed filters once the list has a data source. */
export function ViewTabs({ views }: { views: string[] }) {
  const [active, setActive] = useState(0);
  return (
    <div role="tablist" aria-label="Views" className="-mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      {views.map((view, i) => (
        <button
          key={view}
          type="button"
          role="tab"
          aria-selected={i === active}
          onClick={() => setActive(i)}
          className={cn(
            'whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            i === active
              ? 'bg-card text-foreground shadow-sm ring-1 ring-border'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          )}
        >
          {view}
        </button>
      ))}
    </div>
  );
}
