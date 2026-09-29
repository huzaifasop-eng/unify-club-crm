'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Command } from 'cmdk';
import { Search } from 'lucide-react';
import { NAVIGATION } from '@/config/navigation';
import { canonicalEntries, filterNavigation, type FlatNavEntry } from '@/lib/navigation';
import { useCan } from './permissions-provider';

export function CommandMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const can = useCan();

  const groups = useMemo(() => {
    const byGroup = new Map<string, FlatNavEntry[]>();
    for (const entry of canonicalEntries(filterNavigation(NAVIGATION, can))) {
      const key = entry.section?.label ?? 'Go to';
      byGroup.set(key, [...(byGroup.get(key) ?? []), entry]);
    }
    return [...byGroup.entries()];
  }, [can]);

  const go = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Search pages"
      overlayClassName="fixed inset-0 z-50 bg-black/40"
      contentClassName="fixed left-1/2 top-[12vh] z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl"
    >
      <div className="flex items-center gap-2 border-b border-border px-4">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        <Command.Input
          autoFocus
          placeholder="Jump to a page…"
          className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      <Command.List className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
        <Command.Empty className="px-3 py-8 text-center text-sm text-muted-foreground">
          No matching page.
        </Command.Empty>
        {groups.map(([label, entries]) => (
          <Command.Group
            key={label}
            heading={label}
            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground"
          >
            {entries.map((entry) => {
              const Icon = entry.icon;
              return (
                <Command.Item
                  key={entry.id}
                  value={`${entry.section?.label ?? ''} ${entry.label}`}
                  keywords={entry.keywords}
                  onSelect={() => go(entry.href)}
                  className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
                  <span className="flex-1">{entry.label}</span>
                  {entry.section && (
                    <span className="text-xs text-muted-foreground">{entry.section.label}</span>
                  )}
                </Command.Item>
              );
            })}
          </Command.Group>
        ))}
      </Command.List>
    </Command.Dialog>
  );
}
