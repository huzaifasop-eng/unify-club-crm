import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Baby,
  Wallet,
  CalendarCheck,
  Briefcase,
  BarChart3,
  Settings,
  Phone,
  PlayCircle,
  Dumbbell,
  HeartPulse,
  Banknote,
  Landmark,
  Receipt,
  Package,
  Megaphone,
  PartyPopper,
  FileText,
  CalendarDays,
  Bell,
  UserCircle,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  permission?: string; // resource:action — checked against user.permissions
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'CRM & Admissions',
    items: [
      { label: 'Leads', href: '/leads', icon: ClipboardList, permission: 'leads:read' },
      { label: 'Admissions', href: '/admissions', icon: Users, permission: 'admissions:read' },
      { label: 'Children', href: '/children', icon: Baby, permission: 'children:read' },
      { label: 'Calls', href: '/calls', icon: Phone, permission: 'calls:read' },
      { label: 'Trials', href: '/trials', icon: PlayCircle, permission: 'trials:read' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Fees', href: '/fees', icon: Wallet, permission: 'fees:read' },
      { label: 'Attendance', href: '/attendance', icon: CalendarCheck, permission: 'attendance:read' },
      { label: 'HR', href: '/hr', icon: Briefcase, permission: 'hr:read' },
      { label: 'Reports', href: '/reports', icon: BarChart3, permission: 'reports:read' },
    ],
  },
  {
    label: 'Programs',
    items: [
      { label: 'Sports', href: '/sports', icon: Dumbbell, permission: 'sports:read' },
      { label: 'Therapy', href: '/therapy', icon: HeartPulse, permission: 'therapy:read' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { label: 'Payroll', href: '/payroll', icon: Banknote, permission: 'payroll:read' },
      { label: 'Finance', href: '/finance', icon: Landmark, permission: 'finance:read' },
      { label: 'Expenses', href: '/expenses', icon: Receipt, permission: 'expenses:read' },
    ],
  },
  {
    label: 'Other',
    items: [
      { label: 'Inventory', href: '/inventory', icon: Package, permission: 'inventory:read' },
      { label: 'Marketing', href: '/marketing', icon: Megaphone, permission: 'marketing:read' },
      { label: 'Events', href: '/events', icon: PartyPopper, permission: 'events:read' },
      { label: 'Documents', href: '/documents', icon: FileText, permission: 'documents:read' },
      { label: 'Calendar', href: '/calendar', icon: CalendarDays, permission: 'calendar:read' },
      { label: 'Notifications', href: '/notifications', icon: Bell },
      { label: 'Parent Portal', href: '/parent-portal', icon: UserCircle },
    ],
  },
  {
    label: 'Administration',
    items: [
      { label: 'Branches', href: '/settings/branches', icon: Landmark, permission: 'branches:read' },
      { label: 'Roles & Permissions', href: '/settings/roles', icon: Settings, permission: 'roles:read' },
    ],
  },
];

export const COMING_SOON_MODULES: Record<string, { title: string; description: string; icon: LucideIcon }> = {
  calls: { title: 'Call Management', description: 'Log and track inbound/outbound calls with leads.', icon: Phone },
  trials: { title: 'Trial Management', description: 'Schedule and track trial sessions for prospective enrollments.', icon: PlayCircle },
  sports: { title: 'Sports Management', description: 'Manage sports programs and coaching assignments.', icon: Dumbbell },
  therapy: { title: 'Therapy Management', description: 'Manage therapy programs and therapist assignments.', icon: HeartPulse },
  payroll: { title: 'Payroll', description: 'Run monthly payroll for staff across branches.', icon: Banknote },
  finance: { title: 'Finance', description: 'General ledger and financial reporting.', icon: Landmark },
  expenses: { title: 'Expense Tracker', description: 'Track and approve branch expenses.', icon: Receipt },
  inventory: { title: 'Inventory', description: 'Track inventory items and stock movements.', icon: Package },
  marketing: { title: 'Marketing CRM', description: 'Plan and track marketing campaigns.', icon: Megaphone },
  events: { title: 'Events', description: 'Plan and manage branch events.', icon: PartyPopper },
  documents: { title: 'Documents', description: 'Manage uploaded documents for children and admissions.', icon: FileText },
  calendar: { title: 'Calendar', description: 'A unified calendar of scheduled activities.', icon: CalendarDays },
  notifications: { title: 'Notifications Center', description: 'Manage outbound notifications across channels.', icon: Bell },
  'parent-portal': { title: 'Parent Portal', description: 'A dedicated portal for parents to track their child\'s progress.', icon: UserCircle },
};
