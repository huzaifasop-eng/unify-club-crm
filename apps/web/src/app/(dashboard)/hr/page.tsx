'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { apiClient, getErrorMessage } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { usePaginatedList, ListSearchBar, Pagination } from '@/components/shared/paginated-list';
import { useToast } from '@/components/ui/toast';
import { StaffFormDialog } from '@/components/hr/staff-form-dialog';
import { LeaveRequestFormDialog } from '@/components/hr/leave-request-form-dialog';
import { LeaveRequest, LeaveStatus, Staff } from '@/lib/types';
import { formatDate } from '@/lib/utils';

const EMPLOYMENT_VARIANT: Record<string, BadgeProps['variant']> = {
  ACTIVE: 'success',
  ON_LEAVE: 'warning',
  SUSPENDED: 'destructive',
  TERMINATED: 'destructive',
  RESIGNED: 'outline',
};

const LEAVE_VARIANT: Record<LeaveStatus, BadgeProps['variant']> = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'destructive',
  CANCELLED: 'outline',
};

function StaffTab() {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);
  const { data, isLoading, page, setPage, search, setSearch } = usePaginatedList<Staff>('staff', '/hr/staff');

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(staff: Staff) {
    setEditing(staff);
    setFormOpen(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ListSearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search staff..." />
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> New Staff
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((s) => (
              <TableRow key={s.id} onClick={() => openEdit(s)} className="cursor-pointer">
                <TableCell className="font-medium">{s.employeeCode}</TableCell>
                <TableCell>{s.user ? `${s.user.firstName} ${s.user.lastName}` : '-'}</TableCell>
                <TableCell>{s.designation || '-'}</TableCell>
                <TableCell>{s.department || '-'}</TableCell>
                <TableCell>{s.branch?.name || '-'}</TableCell>
                <TableCell>
                  <Badge variant={EMPLOYMENT_VARIANT[s.status]}>{s.status.replace('_', ' ')}</Badge>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && data?.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No staff found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data?.meta && (
        <Pagination page={page} totalPages={data.meta.totalPages} total={data.meta.total} onPageChange={setPage} />
      )}

      <StaffFormDialog open={formOpen} onOpenChange={setFormOpen} staff={editing} />
    </div>
  );
}

function LeaveRequestsTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const { data, isLoading, page, setPage, search, setSearch } = usePaginatedList<LeaveRequest>(
    'leave-requests',
    '/hr/leave-requests'
  );

  async function updateStatus(leave: LeaveRequest, status: LeaveStatus) {
    try {
      await apiClient.patch(`/hr/leave-requests/${leave.id}/status`, { status });
      toast({ title: `Leave ${status.toLowerCase()}`, variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
    } catch (err) {
      toast({ title: 'Could not update leave request', description: getErrorMessage(err), variant: 'destructive' });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ListSearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search leave requests..." />
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4" /> New Leave Request
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((leave) => (
              <TableRow key={leave.id}>
                <TableCell className="font-medium">
                  {leave.staff?.user ? `${leave.staff.user.firstName} ${leave.staff.user.lastName}` : leave.staffId}
                </TableCell>
                <TableCell>{leave.type}</TableCell>
                <TableCell>{formatDate(leave.startDate)}</TableCell>
                <TableCell>{formatDate(leave.endDate)}</TableCell>
                <TableCell>
                  <Badge variant={LEAVE_VARIANT[leave.status]}>{leave.status}</Badge>
                </TableCell>
                <TableCell>
                  {leave.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => updateStatus(leave, 'APPROVED')}>
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(leave, 'REJECTED')}>
                        Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && data?.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No leave requests found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data?.meta && (
        <Pagination page={page} totalPages={data.meta.totalPages} total={data.meta.total} onPageChange={setPage} />
      )}

      <LeaveRequestFormDialog open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}

export default function HrPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Human Resources</h1>
        <p className="text-sm text-muted-foreground">Manage staff records and leave requests.</p>
      </div>

      <Tabs defaultValue="staff">
        <TabsList>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="leave">Leave Requests</TabsTrigger>
        </TabsList>
        <TabsContent value="staff">
          <StaffTab />
        </TabsContent>
        <TabsContent value="leave">
          <LeaveRequestsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
