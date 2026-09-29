/**
 * Per-page module definitions. Each list page renders its real structure (views, columns,
 * actions, business rules) from here while its data layer is built phase by phase — see the
 * roadmap in docs/ARCHITECTURE.md §13. No page shows invented numbers or sample rows.
 */

export type Phase = 0 | 1 | 2 | 3 | 4 | 5;

export const PHASE_LABELS: Record<Phase, string> = {
  0: 'Foundations',
  1: 'CRM',
  2: 'People core',
  3: 'Finance & operations',
  4: 'Payroll & reporting',
  5: 'AI assistant',
};

export interface ModuleDefinition {
  title: string;
  description: string;
  phase: Phase;
  primaryAction?: string;
  secondaryActions?: string[];
  /** Saved-view tabs shown above the list. */
  views: string[];
  /** Table columns of the primary list view. */
  columns: string[];
  empty: { title: string; body: string };
  /** Business rules the module enforces — shown so reviewers can check the design. */
  rules: string[];
}

export const MODULES = {
  // ── Sales & CRM ──────────────────────────────────────────────────────────
  '/sales/leads': {
    title: 'Leads',
    description: 'Capture, qualify and convert prospects into customers and deals.',
    phase: 1,
    primaryAction: 'New lead',
    secondaryActions: ['Import CSV'],
    views: ['All leads', 'My leads', 'Unassigned', 'Kanban'],
    columns: ['Name', 'Company', 'Phone', 'Source', 'Status', 'Owner', 'Next follow-up', 'Created'],
    empty: {
      title: 'No leads yet',
      body: 'Add a lead, import a spreadsheet, or connect a web form. Duplicates are detected by phone and email.',
    },
    rules: [
      'Status flow: new → contacted → qualified → converted, or unqualified/junk with a reason.',
      'Converting creates the customer, contact and (optionally) a deal in one transaction.',
      'Round-robin or rule-based assignment per branch and source.',
    ],
  },
  '/sales/customers': {
    title: 'Customers',
    description: 'Every account with its contacts, deals, activities and lifetime value.',
    phase: 1,
    primaryAction: 'New customer',
    secondaryActions: ['Import CSV'],
    views: ['All customers', 'My customers', 'Companies', 'Individuals'],
    columns: ['Name', 'Type', 'Primary contact', 'Phone', 'Branch', 'Owner', 'Lifetime value', 'Status'],
    empty: {
      title: 'No customers yet',
      body: 'Customers are created when a lead converts, or directly here.',
    },
    rules: [
      '360° view: contacts, deals, activity timeline, projects, documents.',
      'Merging duplicates re-points every related record and is audited.',
    ],
  },
  '/sales/pipeline': {
    title: 'Pipeline',
    description: 'Deals by stage, with weighted value and forecast by close month.',
    phase: 1,
    primaryAction: 'New deal',
    views: ['Board', 'Table', 'Forecast'],
    columns: ['Deal', 'Customer', 'Stage', 'Amount', 'Probability', 'Expected close', 'Owner', 'Days in stage'],
    empty: {
      title: 'No deals in this pipeline',
      body: 'Create a deal or convert a qualified lead. Stages and probabilities are configured in Settings.',
    },
    rules: [
      'Won requires amount and close date; Lost requires a reason.',
      'Every stage move is recorded for velocity and conversion reporting.',
      'Deals idle longer than the stage limit are flagged as rotting.',
    ],
  },
  '/sales/follow-ups': {
    title: 'Follow-ups',
    description: 'Scheduled next actions on leads, customers and deals.',
    phase: 1,
    primaryAction: 'Schedule follow-up',
    views: ['Overdue', 'Today', 'Upcoming', 'Calendar', 'Team'],
    columns: ['Due', 'Type', 'Related to', 'Assignee', 'Priority', 'Status'],
    empty: {
      title: 'Nothing scheduled',
      body: 'Follow-ups appear here when you schedule one or log an activity with a next step.',
    },
    rules: [
      'Reminder 15 minutes before due; missed follow-ups notify the manager.',
      'Logging an activity can complete a follow-up and prompt for the next one.',
    ],
  },

  // ── HR ───────────────────────────────────────────────────────────────────
  '/hr/employees': {
    title: 'Employees',
    description: 'Employee directory, org chart and lifecycle: onboarding, transfers and exits.',
    phase: 2,
    primaryAction: 'Add employee',
    secondaryActions: ['Import CSV'],
    views: ['Directory', 'Org chart', 'Onboarding', 'Exited'],
    columns: ['Code', 'Name', 'Designation', 'Department', 'Branch', 'Manager', 'Joined', 'Status'],
    empty: {
      title: 'No employees yet',
      body: 'Add employees individually or import them. Logins are optional per employee.',
    },
    rules: [
      'Personal, bank and salary data are stored separately and need dedicated permissions.',
      'Line managers do not see subordinates’ salaries by default.',
      'Transfers are effective-dated; exits revoke access and recover assets.',
    ],
  },
  '/hr/attendance': {
    title: 'Attendance',
    description: 'Check-in/out from web or phone, daily board and monthly timesheets.',
    phase: 2,
    primaryAction: 'Check in',
    secondaryActions: ['Import device log'],
    views: ['Today', 'Timesheets', 'Regularizations'],
    columns: ['Employee', 'Branch', 'Shift', 'Check in', 'Check out', 'Worked', 'Status', 'Source'],
    empty: {
      title: 'No attendance recorded today',
      body: 'Check-ins appear here in real time. Shifts and branch geofences are set in Settings.',
    },
    rules: [
      'Late / half-day computed from shift and grace period in the branch time zone.',
      'Geofence and IP are recorded as signals, not blind penalties.',
      'Records lock once payroll for the period is approved.',
    ],
  },
  '/hr/leave': {
    title: 'Leave',
    description: 'Leave requests, balances and the team absence calendar.',
    phase: 2,
    primaryAction: 'Apply for leave',
    views: ['My requests', 'Team calendar', 'Balances', 'Pending approval'],
    columns: ['Employee', 'Type', 'From', 'To', 'Days', 'Status', 'Approver'],
    empty: {
      title: 'No leave requests',
      body: 'Requests route through the approval policy for the employee’s branch and leave type.',
    },
    rules: [
      'Day count excludes weekly offs and holidays; half-days supported.',
      'Balances are a ledger — every accrual, usage and adjustment is traceable.',
      'Overlapping requests are rejected by the database.',
    ],
  },
  '/hr/documents': {
    title: 'Documents',
    description: 'Contracts, ID proofs, policies and certificates with versions and expiry alerts.',
    phase: 3,
    primaryAction: 'Upload',
    secondaryActions: ['New folder'],
    views: ['All files', 'Employee files', 'Policies', 'Expiring soon'],
    columns: ['Name', 'Category', 'Linked to', 'Version', 'Owner', 'Expires', 'Updated'],
    empty: {
      title: 'No documents yet',
      body: 'Files are stored privately and opened through short-lived signed links.',
    },
    rules: [
      'Uploads are virus-scanned before they can be downloaded.',
      'Confidential documents need an extra permission.',
    ],
  },
  '/hr/payroll': {
    title: 'Payroll',
    description: 'Monthly payroll runs, payslips and bank transfer files.',
    phase: 4,
    primaryAction: 'New payroll run',
    views: ['Runs', 'Payslips', 'Components'],
    columns: ['Period', 'Branch', 'Employees', 'Gross', 'Deductions', 'Net pay', 'Status'],
    empty: {
      title: 'No payroll runs',
      body: 'A run moves draft → calculated → approved → paid → locked.',
    },
    rules: [
      'Whoever prepares a run cannot approve it.',
      'Locked runs are immutable; corrections go into the next period.',
      'Each payslip stores the inputs it was calculated from.',
    ],
  },

  // ── Operations ───────────────────────────────────────────────────────────
  '/operations/branches': {
    title: 'Branches',
    description: 'Locations with their manager, working hours, geofence and branch KPIs.',
    phase: 0,
    primaryAction: 'Add branch',
    views: ['Active', 'Inactive'],
    columns: ['Code', 'Name', 'City', 'Manager', 'Employees', 'Time zone', 'Status'],
    empty: {
      title: 'No branches yet',
      body: 'Create your first branch — every lead, employee, expense and asset belongs to one.',
    },
    rules: [
      'Branches are deactivated, never deleted, so history stays intact.',
      'The branch filter in the top bar scopes every list and dashboard.',
    ],
  },
  '/operations/tasks': {
    title: 'Tasks',
    description: 'Assigned work with checklists, comments, due dates and recurrence.',
    phase: 1,
    primaryAction: 'New task',
    views: ['My tasks', 'Board', 'All tasks', 'Calendar'],
    columns: ['Task', 'Assignee', 'Related to', 'Priority', 'Due', 'Status'],
    empty: {
      title: 'No tasks',
      body: 'Tasks can be linked to a lead, customer, deal, asset or project.',
    },
    rules: [
      'Recurring tasks create the next instance when completed.',
      '@mentions and watchers receive notifications.',
    ],
  },
  '/operations/assets': {
    title: 'Assets',
    description: 'Asset register with QR tags, assignments to employees and depreciation.',
    phase: 3,
    primaryAction: 'Add asset',
    secondaryActions: ['Print QR tags'],
    views: ['Register', 'Assigned', 'In stock', 'Retired'],
    columns: ['Tag', 'Name', 'Category', 'Branch', 'Assigned to', 'Purchase cost', 'Warranty', 'Status'],
    empty: {
      title: 'No assets registered',
      body: 'Register laptops, vehicles, machinery and furniture to track who has what.',
    },
    rules: [
      'One open assignment per asset; employees acknowledge receipt.',
      'Exit settlement is blocked until assigned assets are returned.',
    ],
  },
  '/operations/inventory': {
    title: 'Inventory',
    description: 'Items, stock by location, transfers and stock counts.',
    phase: 3,
    primaryAction: 'Add item',
    secondaryActions: ['Receive stock', 'Transfer'],
    views: ['Stock levels', 'Items', 'Movements', 'Transfers', 'Low stock'],
    columns: ['SKU', 'Item', 'Location', 'On hand', 'Reserved', 'Reorder level', 'Stock value'],
    empty: {
      title: 'No items yet',
      body: 'Add items, then receive opening stock into a location.',
    },
    rules: [
      'Every change is a stock movement; levels are derived and always reconcile.',
      'Adjustments need a reason and a dedicated permission.',
      'Low-stock alerts fire from each item’s reorder level.',
    ],
  },
  '/operations/maintenance': {
    title: 'Maintenance',
    description: 'Preventive and corrective maintenance for assets, with cost tracking.',
    phase: 3,
    primaryAction: 'Schedule maintenance',
    views: ['Upcoming', 'Overdue', 'Completed'],
    columns: ['Asset', 'Type', 'Scheduled for', 'Vendor', 'Cost', 'Status'],
    empty: {
      title: 'No maintenance scheduled',
      body: 'Schedule one-off repairs or recurring preventive maintenance for any asset.',
    },
    rules: [
      'Assets under maintenance show as unavailable.',
      'Maintenance cost can be raised as an expense for approval.',
    ],
  },

  // ── Finance ──────────────────────────────────────────────────────────────
  '/finance/expenses': {
    title: 'Expenses',
    description: 'Expense claims and company-paid spend with receipts.',
    phase: 3,
    primaryAction: 'New expense',
    views: ['My claims', 'All expenses', 'Awaiting payment'],
    columns: ['Code', 'Date', 'Employee', 'Category', 'Branch', 'Amount', 'Status'],
    empty: {
      title: 'No expenses',
      body: 'Snap a receipt from your phone and submit — it routes to the right approver automatically.',
    },
    rules: [
      'Category limits and receipt thresholds apply at submit.',
      'Approved expenses are immutable; duplicate receipts are flagged.',
      'You can never approve or pay your own claim.',
    ],
  },
  '/finance/vendors': {
    title: 'Vendors',
    description: 'Suppliers with contacts, payment terms and spend to date.',
    phase: 3,
    primaryAction: 'Add vendor',
    views: ['Active', 'Pending verification', 'Blocked'],
    columns: ['Code', 'Name', 'Category', 'Contact', 'Payment terms', 'Spend (YTD)', 'Status'],
    empty: {
      title: 'No vendors yet',
      body: 'New vendors start as pending verification.',
    },
    rules: [
      'Bank-detail changes require re-verification and notify finance.',
    ],
  },
  '/finance/payments': {
    title: 'Payments',
    description: 'Money paid out — expense reimbursements, vendor payments, payroll — and customer receipts.',
    phase: 3,
    primaryAction: 'Record payment',
    views: ['Outgoing', 'Incoming', 'Batches'],
    columns: ['Date', 'Reference', 'Direction', 'Party', 'Method', 'Amount', 'Status'],
    empty: {
      title: 'No payments recorded',
      body: 'Payments are recorded when approved expenses, vendor bills or payroll runs are paid.',
    },
    rules: [
      'Whoever records a payment cannot be the one who requested it.',
      'Scope of incoming customer payments depends on whether invoicing is in v1 (open question).',
    ],
  },
  '/finance/approvals': {
    title: 'Approvals',
    description: 'One inbox for everything waiting on you: leave, expenses, payroll, advances.',
    phase: 2,
    views: ['Waiting on me', 'Submitted by me', 'All pending', 'History'],
    columns: ['Type', 'Requested by', 'Summary', 'Amount', 'Step', 'Waiting since', 'Due'],
    empty: {
      title: 'Nothing waiting on you',
      body: 'Requests routed to you by approval policies appear here.',
    },
    rules: [
      'One approval engine for every module: multi-step, thresholds, SLA reminders, delegation.',
      'Policies are frozen at submission — later edits don’t change in-flight requests.',
    ],
  },

  // ── Reports ──────────────────────────────────────────────────────────────
  '/reports/sales': {
    title: 'Sales reports',
    description: 'Funnel, pipeline, win/loss, lead sources and follow-up compliance.',
    phase: 4,
    secondaryActions: ['Export', 'Schedule'],
    views: ['Lead funnel', 'Pipeline by stage', 'Win / loss', 'Leaderboard', 'Lead source ROI', 'Follow-up compliance'],
    columns: ['Metric', 'This period', 'Previous period', 'Change'],
    empty: {
      title: 'Reports need data',
      body: 'Sales reports populate as leads and deals are recorded.',
    },
    rules: ['Win rate = won ÷ (won + lost) closed in the period — not ÷ all deals created.'],
  },
  '/reports/hr': {
    title: 'HR reports',
    description: 'Headcount, attrition, attendance, lateness and leave utilisation.',
    phase: 4,
    secondaryActions: ['Export', 'Schedule'],
    views: ['Headcount', 'Attrition', 'Attendance', 'Leave utilisation', 'Payroll register'],
    columns: ['Metric', 'This period', 'Previous period', 'Change'],
    empty: {
      title: 'Reports need data',
      body: 'HR reports populate as employees, attendance and leave are recorded.',
    },
    rules: ['Salary figures require the payroll permission, even inside reports.'],
  },
  '/reports/finance': {
    title: 'Finance reports',
    description: 'Spend by category, branch and employee, budget variance and vendor spend.',
    phase: 4,
    secondaryActions: ['Export', 'Schedule'],
    views: ['Spend by category', 'Spend by branch', 'Budget vs actual', 'Vendor spend', 'Payroll cost'],
    columns: ['Metric', 'This period', 'Previous period', 'Change'],
    empty: {
      title: 'Reports need data',
      body: 'Finance reports populate as expenses and payments are recorded.',
    },
    rules: ['Budget variance needs budgets to be set (open question in the plan).'],
  },
  '/reports/branch': {
    title: 'Branch reports',
    description: 'Side-by-side comparison of every branch across sales, people, spend and operations.',
    phase: 4,
    secondaryActions: ['Export'],
    views: ['Comparison', 'Branch scorecard'],
    columns: ['Branch', 'Won revenue', 'Pipeline', 'Headcount', 'Attendance %', 'Expenses', 'Overdue tasks'],
    empty: {
      title: 'Reports need data',
      body: 'Add branches and start recording activity to compare them.',
    },
    rules: ['Only branches you have access to are included.'],
  },
  '/reports/management': {
    title: 'Management reports',
    description: 'Executive summary across the whole company, with trends from daily snapshots.',
    phase: 4,
    secondaryActions: ['Export PDF', 'Schedule'],
    views: ['Executive summary', 'Trends', 'Approvals aging'],
    columns: ['KPI', 'Current', 'Target', 'Trend'],
    empty: {
      title: 'Reports need data',
      body: 'Trend lines start from the day daily KPI snapshots begin.',
    },
    rules: ['Historical values (e.g. pipeline on a past date) come from daily snapshots, not recalculation.'],
  },
} satisfies Record<string, ModuleDefinition>;

export type ModuleHref = keyof typeof MODULES;

export function getModule(href: ModuleHref): ModuleDefinition {
  return MODULES[href];
}
