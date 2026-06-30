'use client';

import {
  Users,
  TrendingUp,
  GraduationCap,
  Wallet,
  Banknote,
  CalendarCheck,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useApiQuery } from '@/lib/hooks/use-api-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { LEAD_STAGE_LABELS, LeadStage } from '@/lib/types';

interface Kpis {
  admissionsToday: number;
  totalLeads: number;
  newLeadsThisMonth: number;
  enrolledThisMonth: number;
  childrenActive: number;
  feesPending: number;
  revenueThisMonth: number;
  attendanceTodayPercent: number;
  attendanceTodayMarked: number;
  pendingLeaveRequests: number;
}

interface LeadTrendPoint {
  date: string;
  count: number;
}

interface RevenueTrendPoint {
  month: string;
  revenue: number;
}

interface RecentActivity {
  recentLeads: { id: string; parentName: string; childName: string; stage: LeadStage; createdAt: string }[];
  recentAdmissions: { id: string; admissionNumber: string; childName: string; status: string; createdAt: string }[];
  recentPayments: { id: string; amount: number; method: string; createdAt: string; invoice: { invoiceNumber: string } }[];
}

export default function DashboardPage() {
  const { data: kpis } = useApiQuery<Kpis>(['dashboard', 'kpis'], '/dashboard/kpis');
  const { data: leadTrend } = useApiQuery<LeadTrendPoint[]>(['dashboard', 'lead-trend'], '/dashboard/lead-trend');
  const { data: revenueTrend } = useApiQuery<RevenueTrendPoint[]>(
    ['dashboard', 'revenue-trend'],
    '/dashboard/revenue-trend'
  );
  const { data: activity } = useApiQuery<RecentActivity>(['dashboard', 'recent-activity'], '/dashboard/recent-activity');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of today&apos;s activity across the organization.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard title="Admissions Today" value={kpis?.admissionsToday ?? '-'} icon={GraduationCap} />
        <KpiCard title="Total Leads" value={kpis?.totalLeads ?? '-'} icon={Users} />
        <KpiCard title="Enrolled This Month" value={kpis?.enrolledThisMonth ?? '-'} icon={TrendingUp} />
        <KpiCard
          title="Fees Pending"
          value={kpis ? formatCurrency(kpis.feesPending) : '-'}
          icon={Wallet}
        />
        <KpiCard
          title="Revenue This Month"
          value={kpis ? formatCurrency(kpis.revenueThisMonth) : '-'}
          icon={Banknote}
        />
        <KpiCard
          title="Attendance Today"
          value={kpis ? `${kpis.attendanceTodayPercent}%` : '-'}
          icon={CalendarCheck}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lead Trend (30 days)</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={leadTrend ?? []}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="hsl(262 83% 58%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue Trend (6 months)</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrend ?? []}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="revenue" fill="hsl(262 83% 58%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Recent Leads</p>
            <ul className="space-y-2">
              {activity?.recentLeads.map((l) => (
                <li key={l.id} className="text-sm flex items-center justify-between gap-2">
                  <span className="truncate">{l.childName} ({l.parentName})</span>
                  <span className="text-xs text-muted-foreground shrink-0">{LEAD_STAGE_LABELS[l.stage]}</span>
                </li>
              ))}
              {!activity?.recentLeads.length && <li className="text-sm text-muted-foreground">No recent leads</li>}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Recent Admissions</p>
            <ul className="space-y-2">
              {activity?.recentAdmissions.map((a) => (
                <li key={a.id} className="text-sm flex items-center justify-between gap-2">
                  <span className="truncate">{a.childName}</span>
                  <span className="text-xs text-muted-foreground shrink-0">{a.status}</span>
                </li>
              ))}
              {!activity?.recentAdmissions.length && <li className="text-sm text-muted-foreground">No recent admissions</li>}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Recent Payments</p>
            <ul className="space-y-2">
              {activity?.recentPayments.map((p) => (
                <li key={p.id} className="text-sm flex items-center justify-between gap-2">
                  <span className="truncate">{p.invoice.invoiceNumber}</span>
                  <span className="text-xs text-muted-foreground shrink-0">{formatCurrency(p.amount)}</span>
                </li>
              ))}
              {!activity?.recentPayments.length && <li className="text-sm text-muted-foreground">No recent payments</li>}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
