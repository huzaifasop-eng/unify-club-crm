import { Filter, Inbox, Plus, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NAVIGATION } from '@/config/navigation';
import { getModule, type ModuleHref } from '@/config/modules';
import { canonicalEntries } from '@/lib/navigation';
import { PageHeader } from './page-header';
import { PendingButton } from './pending-button';
import { PhaseBadge, phaseHint } from './phase-badge';
import { ViewTabs } from './view-tabs';

export function ModulePage({ href }: { href: ModuleHref }) {
  const mod = getModule(href);
  const entry = canonicalEntries(NAVIGATION).find((e) => e.href === href);
  const hint = phaseHint(mod.phase);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={entry?.icon}
        title={mod.title}
        description={mod.description}
        badge={<PhaseBadge phase={mod.phase} />}
        actions={
          <>
            {mod.secondaryActions?.map((action) => (
              <PendingButton key={action} hint={hint} variant="outline" size="sm">
                {action}
              </PendingButton>
            ))}
            {mod.primaryAction && (
              <PendingButton hint={hint} size="sm">
                <Plus className="h-4 w-4" aria-hidden />
                {mod.primaryAction}
              </PendingButton>
            )}
          </>
        }
      />

      <ViewTabs views={mod.views} />

      <Card>
        <div className="flex flex-col gap-2 border-b border-border p-3 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search {mod.title.toLowerCase()}</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              type="search"
              disabled
              placeholder={`Search ${mod.title.toLowerCase()}…`}
              className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>
          <PendingButton hint={hint} variant="outline" size="sm">
            <Filter className="h-4 w-4" aria-hidden />
            Filters
          </PendingButton>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left">
                {mod.columns.map((col) => (
                  <th key={col} scope="col" className="whitespace-nowrap px-4 py-2.5 font-medium text-muted-foreground">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={mod.columns.length}>
                  <EmptyState title={mod.empty.title} body={mod.empty.body} hint={hint} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="md:hidden">
          <EmptyState title={mod.empty.title} body={mod.empty.body} hint={hint} />
        </div>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">How {mod.title.toLowerCase()} works</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground marker:text-primary">
            {mod.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyState({ title, body, hint }: { title: string; body: string; hint: string }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Inbox className="h-6 w-6 text-muted-foreground" aria-hidden />
      </span>
      <p className="mt-4 font-semibold">{title}</p>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{body}</p>
      <p className="mt-3 text-xs text-muted-foreground">{hint}.</p>
    </div>
  );
}
