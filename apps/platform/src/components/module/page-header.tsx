import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export function PageHeader({
  icon: Icon,
  title,
  description,
  badge,
  actions,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
  badge?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 gap-3">
        {Icon && (
          <span className="mt-0.5 hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:flex">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
        )}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {badge}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
