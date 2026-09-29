/**
 * Permission keys that gate navigation. These mirror the `permissions.key` catalog in
 * docs/DATABASE.md. Hiding a link is UX only — the real enforcement is server-side checks
 * plus Postgres RLS (docs/ARCHITECTURE.md §4.4).
 */
export const PERMISSIONS = [
  'dashboard.view',
  'leads.view',
  'customers.view',
  'deals.view',
  'follow_ups.view',
  'employees.view',
  'attendance.view',
  'leave.view',
  'documents.view',
  'payroll.view',
  'branches.view',
  'tasks.view',
  'assets.view',
  'inventory.view',
  'maintenance.view',
  'expenses.view',
  'vendors.view',
  'payments.view',
  'approvals.view',
  'reports.sales',
  'reports.hr',
  'reports.finance',
  'reports.branch',
  'reports.management',
  'ai.use',
  'settings.manage',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export type Can = (permission: Permission) => boolean;

export function canFrom(granted: Iterable<Permission>): Can {
  const set = new Set(granted);
  return (permission) => set.has(permission);
}
