'use client';

import { useState } from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import { apiClient, getErrorMessage } from '@/lib/api-client';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/toast';
import { usePaginatedList, ListSearchBar, Pagination } from '@/components/shared/paginated-list';
import { AdmissionFormDialog } from '@/components/admissions/admission-form-dialog';
import { ADMISSION_STATUSES, Admission, AdmissionStatus } from '@/lib/types';
import { formatDate } from '@/lib/utils';

const STATUS_VARIANT: Record<AdmissionStatus, BadgeProps['variant']> = {
  DRAFT: 'outline',
  SUBMITTED: 'secondary',
  UNDER_REVIEW: 'warning',
  APPROVED: 'success',
  REJECTED: 'destructive',
  ENROLLED: 'success',
  WITHDRAWN: 'destructive',
};

const STATUS_LABELS: Record<AdmissionStatus, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  ENROLLED: 'Enrolled',
  WITHDRAWN: 'Withdrawn',
};

// Allowed forward transitions per current status.
const NEXT_STATUSES: Record<AdmissionStatus, AdmissionStatus[]> = {
  DRAFT: ['SUBMITTED'],
  SUBMITTED: ['UNDER_REVIEW', 'REJECTED'],
  UNDER_REVIEW: ['APPROVED', 'REJECTED'],
  APPROVED: ['ENROLLED', 'WITHDRAWN'],
  REJECTED: [],
  ENROLLED: ['WITHDRAWN'],
  WITHDRAWN: [],
};

export default function AdmissionsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Admission | null>(null);
  const [statusFilter, setStatusFilter] = useState<AdmissionStatus | 'ALL'>('ALL');

  const { data, isLoading, page, setPage, search, setSearch } = usePaginatedList<Admission>(
    'admissions',
    '/admissions',
    statusFilter === 'ALL' ? {} : { status: statusFilter }
  );

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(admission: Admission) {
    setEditing(admission);
    setFormOpen(true);
  }

  async function changeStatus(admission: Admission, status: AdmissionStatus) {
    try {
      const payload: { status: AdmissionStatus; rejectedReason?: string } = { status };
      if (status === 'REJECTED') {
        const reason = window.prompt('Reason for rejection (optional):') ?? undefined;
        if (reason) payload.rejectedReason = reason;
      }
      await apiClient.patch(`/admissions/${admission.id}/status`, payload);
      toast({ title: `Marked as ${STATUS_LABELS[status]}`, variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['admissions'] });
    } catch (err) {
      toast({ title: 'Could not update status', description: getErrorMessage(err), variant: 'destructive' });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admissions</h1>
          <p className="text-sm text-muted-foreground">Manage admission applications from draft to enrollment.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> New Admission
        </Button>
      </div>

      <ListSearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by child or guardian name...">
        <select
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as AdmissionStatus | 'ALL'); setPage(1); }}
        >
          <option value="ALL">All Statuses</option>
          {ADMISSION_STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </ListSearchBar>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Admission #</TableHead>
              <TableHead>Child</TableHead>
              <TableHead>Guardian</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((admission) => (
              <TableRow key={admission.id} onClick={() => openEdit(admission)} className="cursor-pointer">
                <TableCell className="font-medium">{admission.admissionNumber}</TableCell>
                <TableCell>{admission.childName}</TableCell>
                <TableCell>{admission.guardianName}</TableCell>
                <TableCell>{admission.guardianPhone}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[admission.status]}>{STATUS_LABELS[admission.status]}</Badge>
                </TableCell>
                <TableCell>{formatDate(admission.createdAt)}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  {NEXT_STATUSES[admission.status].length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {NEXT_STATUSES[admission.status].map((next) => (
                          <DropdownMenuItem key={next} onClick={() => changeStatus(admission, next)}>
                            Mark as {STATUS_LABELS[next]}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && data?.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No admissions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data?.meta && (
        <Pagination page={page} totalPages={data.meta.totalPages} total={data.meta.total} onPageChange={setPage} />
      )}

      <AdmissionFormDialog open={formOpen} onOpenChange={setFormOpen} admission={editing} />
    </div>
  );
}
