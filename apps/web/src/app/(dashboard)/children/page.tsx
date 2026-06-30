'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { usePaginatedList, ListSearchBar, Pagination } from '@/components/shared/paginated-list';
import { ChildFormDialog } from '@/components/children/child-form-dialog';
import { Child } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function ChildrenPage() {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);

  const { data, isLoading, page, setPage, search, setSearch } = usePaginatedList<Child>('children', '/children');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Children</h1>
          <p className="text-sm text-muted-foreground">Enrolled children profiles, diagnosis, and progress notes.</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4" /> New Child
        </Button>
      </div>

      <ListSearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by name or guardian..." />

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>DOB</TableHead>
              <TableHead>Diagnosis</TableHead>
              <TableHead>Guardian</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((child) => (
              <TableRow
                key={child.id}
                onClick={() => router.push(`/children/${child.id}`)}
                className="cursor-pointer"
              >
                <TableCell className="font-medium flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs">
                      {child.firstName[0]}
                      {child.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  {child.firstName} {child.lastName}
                </TableCell>
                <TableCell>{formatDate(child.dob)}</TableCell>
                <TableCell>{child.diagnosis || '-'}</TableCell>
                <TableCell>{child.guardianName}</TableCell>
                <TableCell>{child.guardianPhone}</TableCell>
                <TableCell>{child.isActive ? 'Active' : 'Inactive'}</TableCell>
              </TableRow>
            ))}
            {!isLoading && data?.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No children found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data?.meta && (
        <Pagination page={page} totalPages={data.meta.totalPages} total={data.meta.total} onPageChange={setPage} />
      )}

      <ChildFormDialog open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}
