'use client';

import { ReactNode, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PaginatedResult } from '@/lib/types';
import { useDebounce } from '@/lib/hooks/use-debounce';

export function usePaginatedList<T>(
  queryKey: string,
  url: string,
  extraParams: Record<string, unknown> = {}
) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useQuery<PaginatedResult<T>>({
    queryKey: [queryKey, page, debouncedSearch, extraParams],
    queryFn: async () => {
      const { data } = await apiClient.get(url, {
        params: { page, pageSize: 15, search: debouncedSearch || undefined, ...extraParams },
      });
      return data;
    },
  });

  return { data, isLoading, page, setPage, search, setSearch };
}

export function ListSearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative max-w-sm flex-1 min-w-[220px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder={placeholder} className="pl-8" value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
      {children}
    </div>
  );
}

export function Pagination({
  page,
  totalPages,
  total,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-xs text-muted-foreground">
        Page {page} of {totalPages || 1} ({total} total)
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft className="h-4 w-4" /> Prev
        </Button>
        <Button variant="outline" size="sm" disabled={page >= (totalPages || 1)} onClick={() => onPageChange(page + 1)}>
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
