import type { Permission } from '@/lib/permissions';

/**
 * Dashboard KPI definitions (docs/ARCHITECTURE.md §8). The definition text is shown on each
 * tile: a number nobody can explain is worse than no number.
 */
export interface KpiDefinition {
  id: string;
  label: string;
  definition: string;
  /** The page the tile drills down into. */
  href: string;
  permission: Permission;
}

export interface KpiGroup {
  id: string;
  label: string;
  kpis: KpiDefinition[];
}

export const DASHBOARD_KPIS: KpiGroup[] = [
  {
    id: 'sales',
    label: 'Sales',
    kpis: [
      { id: 'won-revenue', label: 'Won revenue', definition: 'Sum of deal amounts marked won in the period.', href: '/reports/sales', permission: 'reports.sales' },
      { id: 'open-pipeline', label: 'Open pipeline', definition: 'Open deal value, and value weighted by stage probability.', href: '/sales/pipeline', permission: 'deals.view' },
      { id: 'win-rate', label: 'Win rate', definition: 'Won ÷ (won + lost) for deals closed in the period.', href: '/reports/sales', permission: 'reports.sales' },
      { id: 'new-leads', label: 'New leads', definition: 'Leads created in the period, and the share converted.', href: '/sales/leads', permission: 'leads.view' },
      { id: 'overdue-follow-ups', label: 'Overdue follow-ups', definition: 'Pending follow-ups past their due time, right now.', href: '/sales/follow-ups', permission: 'follow_ups.view' },
    ],
  },
  {
    id: 'people',
    label: 'People',
    kpis: [
      { id: 'headcount', label: 'Headcount', definition: 'Active employees at period end; joiners and leavers.', href: '/hr/employees', permission: 'employees.view' },
      { id: 'attendance-today', label: 'Attendance today', definition: 'Present ÷ expected, excluding leave, holidays and weekly offs.', href: '/hr/attendance', permission: 'attendance.view' },
      { id: 'on-leave', label: 'On leave today', definition: 'Employees with approved leave covering today.', href: '/hr/leave', permission: 'leave.view' },
      { id: 'payroll-cost', label: 'Payroll cost', definition: 'Employer cost of the last locked payroll run vs the previous run.', href: '/hr/payroll', permission: 'payroll.view' },
    ],
  },
  {
    id: 'finance',
    label: 'Finance',
    kpis: [
      { id: 'expenses', label: 'Expenses', definition: 'Approved expenses in the period, vs budget where set.', href: '/finance/expenses', permission: 'expenses.view' },
      { id: 'pending-approvals', label: 'Pending approvals', definition: 'Requests awaiting a decision, and the oldest one’s age.', href: '/finance/approvals', permission: 'approvals.view' },
      { id: 'payments-due', label: 'Payments due', definition: 'Approved claims and bills not yet paid.', href: '/finance/payments', permission: 'payments.view' },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    kpis: [
      { id: 'overdue-tasks', label: 'Overdue tasks', definition: 'Open tasks past their due date.', href: '/operations/tasks', permission: 'tasks.view' },
      { id: 'low-stock', label: 'Low stock items', definition: 'Items at or below their reorder level in any location.', href: '/operations/inventory', permission: 'inventory.view' },
      { id: 'maintenance-due', label: 'Maintenance due', definition: 'Maintenance scheduled in the next 7 days or overdue.', href: '/operations/maintenance', permission: 'maintenance.view' },
    ],
  },
];
