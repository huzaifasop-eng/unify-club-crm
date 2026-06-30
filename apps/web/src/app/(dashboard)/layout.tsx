'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { authStore } from '@/lib/auth-store';
import { AuthUserProfile } from '@/lib/types';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUserProfile | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    function syncUser() {
      if (!authStore.isAuthenticated()) {
        router.replace('/login');
        return;
      }
      setUser(authStore.getUser());
      setChecked(true);
    }
    syncUser();
    window.addEventListener('unify-auth-changed', syncUser);
    return () => window.removeEventListener('unify-auth-changed', syncUser);
  }, [router]);

  if (!checked) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar user={user} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar user={user} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
