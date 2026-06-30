'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { LEAD_STAGE_LABELS, Lead, PaginatedResult } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { useDebounce } from '@/lib/hooks/use-debounce';

const COLUMNS: { key: string; label: string; sortable?: boolean }[] = [
  { key: 'childName', label: 'Child', sortable: true },
  { key: 'parentName', label: 'Parent', sortable: true },
  { key: 'parentPhone', label: 'Phone' },
  { key: 'stage', label: 'Stage' },
  { key: 'priority', label: 'Priority', sortable: true },
  { key: 'createdAt', label: 'Created', sortable: true },
];

export function LeadTable({ onRowClick }: { onRowClick: (lead: Lead) => void }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useQuery<PaginatedResult<Lead>>({
    queryKey: ['leads', 'table', page, debouncedSearch, sortBy, sortOrder],
    queryFn: async () => {
      const { data } = await apiClient.get('/leads', {
        params: { page, pageSize: 15, search: debouncedSearch || undefined, sortBy, sortOrder },
      });
      return data;
    },
  });

  function toggleSort(key: string) {
    if (sortBy === key) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
    setPage(1);
  }

  return (
    <div className="space-y-3">
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, phone, email..."
          className="pl-8"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {COLUMNS.map((col) => (
                <TableHead key={col.key}>
                  {col.sortable ? (
                    <button
                      onClick={() => toggleSort(col.key)}
                      className="flex items-center gap-1 hover:text-foreground"
                    >
                      {col.label}
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  ) : (
                    col.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((lead) => (
              <TableRow key={lead.id} onClick={() => onRowClick(lead)} className="cursor-pointer">
                <TableCell className="font-medium">{lead.childName}</TableCell>
                <TableCell>{lead.parentName}</TableCell>
                <TableCell>{lead.parentPhone}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{LEAD_STAGE_LABELS[lead.stage]}</Badge>
                </TableCell>
                <TableCell>{lead.priority}</TableCell>
                <TableCell>{formatDate(lead.createdAt)}</TableCell>
              </TableRow>
            ))}
            {!isLoading && data?.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={COLUMNS.length} className="text-center text-muted-foreground py-8">
                  No leads found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data?.meta && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Page {data.meta.page} of {data.meta.totalPages || 1} ({data.meta.total} total)
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= (data.meta.totalPages || 1)}
              onClick={() => setPage((p) => p + 1)}
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
