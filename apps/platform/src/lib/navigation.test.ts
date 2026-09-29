import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { DASHBOARD_KPIS } from '@/config/kpis';
import { MODULES } from '@/config/modules';
import { MOBILE_TABS, NAVIGATION, type NavGroupSection } from '@/config/navigation';
import { SETTINGS } from '@/config/settings';
import {
  breadcrumbsFor,
  canonicalEntries,
  filterNavigation,
  findActiveEntry,
  findEntryById,
  flattenNavigation,
  isActivePath,
} from '@/lib/navigation';
import { PERMISSIONS, canFrom, type Permission } from '@/lib/permissions';

const APP_DIR = path.resolve(__dirname, '../app/(app)');
const pageExists = (href: string) => existsSync(path.join(APP_DIR, href, 'page.tsx'));
const groups = NAVIGATION.filter((s): s is NavGroupSection => s.kind === 'group');

describe('navigation structure', () => {
  it('matches the agreed information architecture', () => {
    const tree = NAVIGATION.map((s) => (s.kind === 'link' ? s.label : [s.label, s.items.map((i) => i.label)]));
    expect(tree).toEqual([
      'Dashboard',
      ['Sales & CRM', ['Leads', 'Customers', 'Pipeline', 'Follow-ups', 'Sales Reports']],
      ['HR', ['Employees', 'Attendance', 'Leave', 'Documents', 'Payroll']],
      ['Operations', ['Branches', 'Tasks', 'Assets', 'Inventory', 'Maintenance']],
      ['Finance', ['Expenses', 'Vendors', 'Payments', 'Approvals', 'Reports']],
      ['Reports', ['Sales', 'HR', 'Finance', 'Branch', 'Management']],
      'AI Assistant',
      'Settings',
    ]);
  });

  it('has unique ids and one canonical page per URL', () => {
    const ids = flattenNavigation(NAVIGATION).map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    const hrefs = canonicalEntries(NAVIGATION).map((e) => e.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it('keeps canonical group pages under their group path', () => {
    for (const group of groups) {
      for (const item of group.items.filter((i) => !i.alias)) {
        expect(item.href.startsWith(`${group.basePath}/`), item.href).toBe(true);
      }
    }
  });

  it('points every alias at a canonical page with the same permission', () => {
    const canonical = new Map(canonicalEntries(NAVIGATION).map((e) => [e.href, e]));
    for (const alias of flattenNavigation(NAVIGATION).filter((e) => e.alias)) {
      expect(canonical.get(alias.href)?.permission, alias.id).toBe(alias.permission);
    }
  });

  it('only uses known permissions', () => {
    const known = new Set<string>(PERMISSIONS);
    for (const entry of flattenNavigation(NAVIGATION)) expect(known.has(entry.permission), entry.id).toBe(true);
  });
});

describe('no dead links', () => {
  it('has a page for every navigation entry and group index', () => {
    for (const entry of flattenNavigation(NAVIGATION)) expect(pageExists(entry.href), entry.href).toBe(true);
    for (const group of groups) expect(pageExists(group.basePath), group.basePath).toBe(true);
  });

  it('has a page for every dashboard tile and settings shortcut', () => {
    const hrefs = [
      ...DASHBOARD_KPIS.flatMap((g) => g.kpis.map((k) => k.href)),
      ...SETTINGS.flatMap((g) => g.entries.flatMap((e) => (e.href ? [e.href] : []))),
    ];
    for (const href of hrefs) expect(pageExists(href), href).toBe(true);
  });

  it('defines a module for every group page, and no orphan modules', () => {
    const groupHrefs = groups.flatMap((g) => g.items.filter((i) => !i.alias).map((i) => i.href)).sort();
    expect(Object.keys(MODULES).sort()).toEqual(groupHrefs);
  });

  it('builds mobile tabs from real entries', () => {
    for (const id of MOBILE_TABS) expect(findEntryById(NAVIGATION, id), id).toBeDefined();
  });
});

describe('permission filtering', () => {
  const only = (...perms: Permission[]) => filterNavigation(NAVIGATION, canFrom(perms));

  it('shows everything when every permission is granted', () => {
    expect(filterNavigation(NAVIGATION, canFrom(PERMISSIONS))).toEqual(NAVIGATION);
  });

  it('shows nothing when nothing is granted', () => {
    expect(only()).toEqual([]);
  });

  it('keeps only permitted items and drops empty groups', () => {
    const nav = only('dashboard.view', 'leads.view', 'attendance.view');
    expect(nav.map((s) => s.id)).toEqual(['dashboard', 'sales', 'hr']);
    const sales = nav.find((s) => s.id === 'sales') as NavGroupSection;
    expect(sales.items.map((i) => i.id)).toEqual(['leads']);
  });

  it('hides a report shortcut together with the report itself', () => {
    const nav = only('leads.view', 'reports.sales');
    const sales = nav.find((s) => s.id === 'sales') as NavGroupSection;
    expect(sales.items.map((i) => i.id)).toEqual(['leads', 'sales-reports']);
    const withoutReports = only('leads.view').find((s) => s.id === 'sales') as NavGroupSection;
    expect(withoutReports.items.map((i) => i.id)).toEqual(['leads']);
  });
});

describe('active route matching', () => {
  it('matches exact paths and sub-paths only', () => {
    expect(isActivePath('/sales/leads', '/sales/leads')).toBe(true);
    expect(isActivePath('/sales/leads/123', '/sales/leads')).toBe(true);
    expect(isActivePath('/sales/leads-archive', '/sales/leads')).toBe(false);
  });

  it('resolves shared report URLs to their canonical home', () => {
    expect(findActiveEntry(NAVIGATION, '/reports/sales')?.id).toBe('report-sales');
    expect(breadcrumbsFor(NAVIGATION, '/reports/finance')).toEqual([
      { label: 'Reports' },
      { label: 'Finance', href: '/reports/finance' },
    ]);
  });

  it('builds breadcrumbs for detail pages and top-level pages', () => {
    expect(breadcrumbsFor(NAVIGATION, '/hr/employees/42').map((c) => c.label)).toEqual(['HR', 'Employees']);
    expect(breadcrumbsFor(NAVIGATION, '/dashboard')).toEqual([{ label: 'Dashboard', href: '/dashboard' }]);
    expect(breadcrumbsFor(NAVIGATION, '/nowhere')).toEqual([]);
  });
});
