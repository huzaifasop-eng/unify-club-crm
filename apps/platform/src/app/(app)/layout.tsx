import type { ReactNode } from 'react';
import { AppShell } from '@/components/shell/app-shell';
import { PermissionsProvider } from '@/components/shell/permissions-provider';
import { getCurrentPermissions } from '@/server/session';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const permissions = await getCurrentPermissions();
  return (
    <PermissionsProvider permissions={permissions}>
      <AppShell>{children}</AppShell>
    </PermissionsProvider>
  );
}
