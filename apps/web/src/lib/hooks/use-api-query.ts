'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useApiQuery<T>(key: readonly unknown[], url: string, params?: Record<string, unknown>) {
  return useQuery<T>({
    queryKey: [...key, params],
    queryFn: async () => {
      const { data } = await apiClient.get<T>(url, { params });
      return data;
    },
  });
}
