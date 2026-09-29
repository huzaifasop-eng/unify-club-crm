import type { LucideIcon } from 'lucide-react';
import type { NavGroupSection, NavLink, NavSection } from '@/config/navigation';
import type { Can, Permission } from '@/lib/permissions';

/** A navigable page, flattened out of the section tree. */
export interface FlatNavEntry {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  permission: Permission;
  keywords: string[];
  /** Section the page belongs to; `null` for top-level pages (Dashboard, Settings…). */
  section: { id: string; label: string } | null;
  alias: boolean;
}

/** Removes links the user can't open and groups left with nothing in them. */
export function filterNavigation(nav: NavSection[], can: Can): NavSection[] {
  return nav.flatMap((section): NavSection[] => {
    if (section.kind === 'link') return can(section.permission) ? [section] : [];
    const items = section.items.filter((item) => can(item.permission));
    return items.length > 0 ? [{ ...section, items }] : [];
  });
}

export function flattenNavigation(nav: NavSection[]): FlatNavEntry[] {
  return nav.flatMap((section): FlatNavEntry[] => {
    if (section.kind === 'link') {
      return [
        {
          id: section.id,
          label: section.label,
          href: section.href,
          icon: section.icon,
          permission: section.permission,
          keywords: section.keywords ?? [],
          section: null,
          alias: false,
        },
      ];
    }
    return section.items.map((item: NavLink) => ({
      id: item.id,
      label: item.label,
      href: item.href,
      icon: item.icon,
      permission: item.permission,
      keywords: item.keywords ?? [],
      section: { id: section.id, label: section.label },
      alias: item.alias ?? false,
    }));
  });
}

/** Each page once, at its canonical home — what the command palette and breadcrumbs use. */
export function canonicalEntries(nav: NavSection[]): FlatNavEntry[] {
  return flattenNavigation(nav).filter((entry) => !entry.alias);
}

export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** The canonical page for a URL, preferring the longest matching href (deepest route). */
export function findActiveEntry(nav: NavSection[], pathname: string): FlatNavEntry | undefined {
  return canonicalEntries(nav)
    .filter((entry) => isActivePath(pathname, entry.href))
    .sort((a, b) => b.href.length - a.href.length)[0];
}

/** Whether a group should be expanded for this URL — true for aliases too, so shortcuts light up. */
export function groupContainsPath(section: NavGroupSection, pathname: string): boolean {
  return section.items.some((item) => isActivePath(pathname, item.href));
}

export function findEntryById(nav: NavSection[], id: string): FlatNavEntry | undefined {
  return flattenNavigation(nav).find((entry) => entry.id === id);
}

export function findGroup(nav: NavSection[], groupId: string): NavGroupSection | undefined {
  return nav.find((s): s is NavGroupSection => s.kind === 'group' && s.id === groupId);
}

export interface Breadcrumb {
  label: string;
  href?: string;
}

export function breadcrumbsFor(nav: NavSection[], pathname: string): Breadcrumb[] {
  const entry = findActiveEntry(nav, pathname);
  if (!entry) return [];
  const crumbs: Breadcrumb[] = [];
  if (entry.section) crumbs.push({ label: entry.section.label });
  crumbs.push({ label: entry.label, href: entry.href });
  return crumbs;
}
