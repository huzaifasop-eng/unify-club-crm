import type { Phase } from './modules';

export interface SettingsEntry {
  id: string;
  title: string;
  description: string;
  phase: Phase;
  /** Settings managed on a module page rather than inside Settings. */
  href?: string;
}

export interface SettingsGroup {
  label: string;
  entries: SettingsEntry[];
}

export const SETTINGS: SettingsGroup[] = [
  {
    label: 'Organization',
    entries: [
      { id: 'organization', title: 'Company profile', description: 'Name, logo, base currency, time zone, fiscal year.', phase: 0 },
      { id: 'branches', title: 'Branches', description: 'Locations, managers, working hours and geofences.', phase: 0, href: '/operations/branches' },
      { id: 'departments', title: 'Departments & designations', description: 'Org structure used by HR, approvals and reports.', phase: 2 },
    ],
  },
  {
    label: 'Access & security',
    entries: [
      { id: 'users', title: 'Users & invitations', description: 'Invite people, suspend access, see active sessions.', phase: 0 },
      { id: 'roles', title: 'Roles & permissions', description: 'Permission × scope matrix (own, team, branch, org) per role.', phase: 0 },
      { id: 'security', title: 'Security policy', description: 'MFA requirements per role, session length, IP rules.', phase: 0 },
      { id: 'audit-log', title: 'Audit log', description: 'Who changed what, when and from where — immutable.', phase: 0 },
    ],
  },
  {
    label: 'Workflows',
    entries: [
      { id: 'approval-policies', title: 'Approval policies', description: 'Multi-step approval chains by amount, branch and type.', phase: 2 },
      { id: 'notifications', title: 'Notifications', description: 'Who is notified of what, on which channel; templates.', phase: 0 },
      { id: 'custom-fields', title: 'Custom fields', description: 'Extra fields on leads, customers, deals, employees, assets.', phase: 1 },
    ],
  },
  {
    label: 'Modules',
    entries: [
      { id: 'pipelines', title: 'Pipelines & stages', description: 'Sales stages, probabilities and rotting limits.', phase: 1 },
      { id: 'lead-sources', title: 'Lead sources & reasons', description: 'Picklists for sources, lost and unqualified reasons.', phase: 1 },
      { id: 'leave', title: 'Leave types & holidays', description: 'Quotas, accrual, carry-forward and holiday calendars.', phase: 2 },
      { id: 'shifts', title: 'Shifts', description: 'Working hours, grace periods and weekly offs.', phase: 2 },
      { id: 'expense-categories', title: 'Expense categories', description: 'Categories, limits and receipt thresholds.', phase: 3 },
      { id: 'payroll', title: 'Payroll components & tax', description: 'Earnings, deductions and statutory rules.', phase: 4 },
    ],
  },
  {
    label: 'Data',
    entries: [
      { id: 'import-export', title: 'Import & export', description: 'Bulk import from spreadsheets; full data export.', phase: 1 },
      { id: 'integrations', title: 'Integrations', description: 'Email, WhatsApp, web forms and API keys.', phase: 3 },
    ],
  },
];
