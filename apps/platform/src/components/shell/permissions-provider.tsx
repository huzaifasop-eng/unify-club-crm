'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { canFrom, type Can, type Permission } from '@/lib/permissions';

const PermissionsContext = createContext<Can>(() => false);

export function PermissionsProvider({
  permissions,
  children,
}: {
  permissions: Permission[];
  children: ReactNode;
}) {
  const can = useMemo(() => canFrom(permissions), [permissions]);
  return <PermissionsContext.Provider value={can}>{children}</PermissionsContext.Provider>;
}

/** UI gating only — never a substitute for server-side checks. */
export function useCan(): Can {
  return useContext(PermissionsContext);
}
