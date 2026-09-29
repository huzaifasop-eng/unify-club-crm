import {
  Banknote,
  BarChart3,
  Building,
  Building2,
  CalendarClock,
  CalendarX2,
  CheckCheck,
  Clock,
  Contact,
  CreditCard,
  FileText,
  Gauge,
  HandCoins,
  Landmark,
  LayoutDashboard,
  LineChart,
  ListChecks,
  MonitorSmartphone,
  Package,
  Receipt,
  Settings,
  Sparkles,
  SquareKanban,
  TrendingUp,
  Truck,
  UserPlus,
  Users,
  UsersRound,
  Wallet,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { Permission } from '@/lib/permissions';

export interface NavLink {
  /** Stable id, also used as React key and in tests. */
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  permission: Permission;
  /** Extra search terms for the command palette. */
  keywords?: string[];
  /**
   * Shortcut to a page that canonically lives in another section (e.g. Sales → Sales Reports
   * opens /reports/sales). Aliases are skipped in the command palette and breadcrumbs so each
   * page has exactly one home.
   */
  alias?: boolean;
}

interface NavSectionBase {
  id: string;
  label: string;
  icon: LucideIcon;
}

/** A top-level entry that is itself a page (Dashboard, AI Assistant, Settings). */
export interface NavLeafSection extends NavSectionBase {
  kind: 'link';
  href: string;
  permission: Permission;
  keywords?: string[];
}

/** A collapsible group of pages. */
export interface NavGroupSection extends NavSectionBase {
  kind: 'group';
  /** URL prefix owned by this group; /<basePath> redirects to its first visible item. */
  basePath: string;
  items: NavLink[];
}

export type NavSection = NavLeafSection | NavGroupSection;

export const NAVIGATION: NavSection[] = [
  {
    kind: 'link',
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    permission: 'dashboard.view',
    keywords: ['home', 'kpi', 'overview'],
  },
  {
    kind: 'group',
    id: 'sales',
    label: 'Sales & CRM',
    icon: HandCoins,
    basePath: '/sales',
    items: [
      { id: 'leads', label: 'Leads', href: '/sales/leads', icon: UserPlus, permission: 'leads.view', keywords: ['prospects', 'enquiries'] },
      { id: 'customers', label: 'Customers', href: '/sales/customers', icon: Contact, permission: 'customers.view', keywords: ['clients', 'accounts', 'contacts'] },
      { id: 'pipeline', label: 'Pipeline', href: '/sales/pipeline', icon: SquareKanban, permission: 'deals.view', keywords: ['deals', 'opportunities', 'kanban', 'forecast'] },
      { id: 'follow-ups', label: 'Follow-ups', href: '/sales/follow-ups', icon: CalendarClock, permission: 'follow_ups.view', keywords: ['reminders', 'calls', 'callbacks'] },
      { id: 'sales-reports', label: 'Sales Reports', href: '/reports/sales', icon: LineChart, permission: 'reports.sales', alias: true },
    ],
  },
  {
    kind: 'group',
    id: 'hr',
    label: 'HR',
    icon: Users,
    basePath: '/hr',
    items: [
      { id: 'employees', label: 'Employees', href: '/hr/employees', icon: UsersRound, permission: 'employees.view', keywords: ['staff', 'people', 'directory', 'org chart'] },
      { id: 'attendance', label: 'Attendance', href: '/hr/attendance', icon: Clock, permission: 'attendance.view', keywords: ['check-in', 'timesheet', 'late'] },
      { id: 'leave', label: 'Leave', href: '/hr/leave', icon: CalendarX2, permission: 'leave.view', keywords: ['vacation', 'time off', 'holidays'] },
      { id: 'documents', label: 'Documents', href: '/hr/documents', icon: FileText, permission: 'documents.view', keywords: ['files', 'contracts', 'policies'] },
      { id: 'payroll', label: 'Payroll', href: '/hr/payroll', icon: Banknote, permission: 'payroll.view', keywords: ['salary', 'payslips', 'wages'] },
    ],
  },
  {
    kind: 'group',
    id: 'operations',
    label: 'Operations',
    icon: Building2,
    basePath: '/operations',
    items: [
      { id: 'branches', label: 'Branches', href: '/operations/branches', icon: Building, permission: 'branches.view', keywords: ['locations', 'offices'] },
      { id: 'tasks', label: 'Tasks', href: '/operations/tasks', icon: ListChecks, permission: 'tasks.view', keywords: ['todo', 'projects', 'work'] },
      { id: 'assets', label: 'Assets', href: '/operations/assets', icon: MonitorSmartphone, permission: 'assets.view', keywords: ['equipment', 'laptops', 'vehicles'] },
      { id: 'inventory', label: 'Inventory', href: '/operations/inventory', icon: Package, permission: 'inventory.view', keywords: ['stock', 'items', 'warehouse'] },
      { id: 'maintenance', label: 'Maintenance', href: '/operations/maintenance', icon: Wrench, permission: 'maintenance.view', keywords: ['repairs', 'service'] },
    ],
  },
  {
    kind: 'group',
    id: 'finance',
    label: 'Finance',
    icon: CreditCard,
    basePath: '/finance',
    items: [
      { id: 'expenses', label: 'Expenses', href: '/finance/expenses', icon: Receipt, permission: 'expenses.view', keywords: ['claims', 'reimbursements', 'spend'] },
      { id: 'vendors', label: 'Vendors', href: '/finance/vendors', icon: Truck, permission: 'vendors.view', keywords: ['suppliers'] },
      { id: 'payments', label: 'Payments', href: '/finance/payments', icon: Wallet, permission: 'payments.view', keywords: ['payouts', 'receipts', 'transactions'] },
      { id: 'approvals', label: 'Approvals', href: '/finance/approvals', icon: CheckCheck, permission: 'approvals.view', keywords: ['pending', 'approve', 'inbox'] },
      { id: 'finance-reports', label: 'Reports', href: '/reports/finance', icon: BarChart3, permission: 'reports.finance', alias: true },
    ],
  },
  {
    kind: 'group',
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    basePath: '/reports',
    items: [
      { id: 'report-sales', label: 'Sales', href: '/reports/sales', icon: TrendingUp, permission: 'reports.sales', keywords: ['sales reports', 'funnel', 'conversion'] },
      { id: 'report-hr', label: 'HR', href: '/reports/hr', icon: Users, permission: 'reports.hr', keywords: ['headcount', 'attrition'] },
      { id: 'report-finance', label: 'Finance', href: '/reports/finance', icon: Landmark, permission: 'reports.finance', keywords: ['finance reports', 'spend', 'budget'] },
      { id: 'report-branch', label: 'Branch', href: '/reports/branch', icon: Building2, permission: 'reports.branch', keywords: ['branch comparison'] },
      { id: 'report-management', label: 'Management', href: '/reports/management', icon: Gauge, permission: 'reports.management', keywords: ['executive', 'board'] },
    ],
  },
  {
    kind: 'link',
    id: 'ai-assistant',
    label: 'AI Assistant',
    icon: Sparkles,
    href: '/ai-assistant',
    permission: 'ai.use',
    keywords: ['ask', 'chat', 'copilot'],
  },
  {
    kind: 'link',
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/settings',
    permission: 'settings.manage',
    keywords: ['admin', 'users', 'roles', 'permissions', 'audit log'],
  },
];

/** Bottom tab bar on phones: the few things people actually do on mobile. */
export const MOBILE_TABS: string[] = ['dashboard', 'leads', 'attendance', 'tasks'];
