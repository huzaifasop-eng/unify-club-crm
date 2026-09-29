import Link from 'next/link';
import { Layers } from 'lucide-react';
import { APP_NAME, APP_TAGLINE } from '@/config/app';

export function Brand({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href="/dashboard"
      onClick={onNavigate}
      className="flex h-16 shrink-0 items-center gap-2.5 border-b border-border px-5 outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Layers className="h-5 w-5" aria-hidden />
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-bold">{APP_NAME}</span>
        <span className="block text-[11px] text-muted-foreground">{APP_TAGLINE}</span>
      </span>
    </Link>
  );
}
