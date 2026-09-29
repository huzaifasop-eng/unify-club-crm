import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowUpRight, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/module/page-header';
import { PhaseBadge } from '@/components/module/phase-badge';
import { SETTINGS } from '@/config/settings';

export const metadata: Metadata = { title: 'Settings' };

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        icon={Settings}
        title="Settings"
        description="Organization setup, access control, workflows and module configuration."
      />
      {SETTINGS.map((group) => (
        <section key={group.label} aria-labelledby={`settings-${group.label}`}>
          <h2 id={`settings-${group.label}`} className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {group.label}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {group.entries.map((entry) => (
              <Card key={entry.id} className="relative flex flex-col gap-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">{entry.title}</p>
                  {entry.href && <ArrowUpRight className="h-4 w-4 text-muted-foreground" aria-hidden />}
                </div>
                <p className="flex-1 text-sm text-muted-foreground">{entry.description}</p>
                <div>
                  <PhaseBadge phase={entry.phase} />
                </div>
                {entry.href && (
                  <Link href={entry.href} className="absolute inset-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <span className="sr-only">Open {entry.title}</span>
                  </Link>
                )}
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
