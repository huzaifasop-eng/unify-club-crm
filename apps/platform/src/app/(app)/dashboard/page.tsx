import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowUpRight, LayoutDashboard } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/module/page-header';
import { DASHBOARD_KPIS } from '@/config/kpis';
import { canFrom } from '@/lib/permissions';
import { getCurrentPermissions } from '@/server/session';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const can = canFrom(await getCurrentPermissions());
  const groups = DASHBOARD_KPIS.map((g) => ({ ...g, kpis: g.kpis.filter((k) => can(k.permission)) })).filter(
    (g) => g.kpis.length > 0,
  );

  return (
    <div className="space-y-8">
      <PageHeader
        icon={LayoutDashboard}
        title="Dashboard"
        description="Company-wide KPIs. Each tile says exactly how it is calculated and opens the list behind it."
      />

      <div className="rounded-lg border border-dashed border-border bg-card px-4 py-3 text-sm text-muted-foreground">
        No data is connected yet, so tiles show “—” rather than sample numbers. Values appear as each module ships.
      </div>

      {groups.map((group) => (
        <section key={group.id} aria-labelledby={`kpi-${group.id}`}>
          <h2 id={`kpi-${group.id}`} className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {group.label}
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(12.5rem,1fr))] gap-3">
            {group.kpis.map((kpi) => (
              <Card key={kpi.id} className="group relative flex flex-col p-4 transition-colors hover:border-primary/40">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{kpi.label}</p>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden />
                </div>
                <p className="mt-2 text-3xl font-bold tabular-nums text-muted-foreground/60" aria-label="No data yet">
                  —
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{kpi.definition}</p>
                <Link href={kpi.href} className="absolute inset-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <span className="sr-only">Open {kpi.label}</span>
                </Link>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
