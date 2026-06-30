'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authStore } from '@/lib/auth-store';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(authStore.isAuthenticated() ? '/dashboard' : '/login');
  }, [router]);

  return null;
}
