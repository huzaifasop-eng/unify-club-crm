'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Save } from 'lucide-react';
import { apiClient, getErrorMessage } from '@/lib/api-client';
import { authStore } from '@/lib/auth-store';
import { useApiQuery } from '@/lib/hooks/use-api-query';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { ATTENDANCE_STATUSES, Attendance, AttendanceStatus, AttendeeType, Branch, Child, Staff } from '@/lib/types';
import { cn } from '@/lib/utils';

const STATUS_LABELS: Record<AttendanceStatus, string> = {
  PRESENT: 'Present',
  ABSENT: 'Absent',
  LATE: 'Late',
  HALF_DAY: 'Half Day',
  EXCUSED: 'Excused',
  HOLIDAY: 'Holiday',
};

const STATUS_COLORS: Record<AttendanceStatus, string> = {
  PRESENT: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  ABSENT: 'bg-destructive/15 text-destructive',
  LATE: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  HALF_DAY: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  EXCUSED: 'bg-secondary text-secondary-foreground',
  HOLIDAY: 'bg-secondary text-secondary-foreground',
};

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function AttendancePage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const user = authStore.getUser();
  const [branchId, setBranchId] = useState<string>('');
  const [date, setDate] = useState(todayStr());
  const [attendeeType, setAttendeeType] = useState<AttendeeType>('CHILD');
  const [draft, setDraft] = useState<Record<string, AttendanceStatus>>({});
  const [saving, setSaving] = useState(false);

  const { data: branches } = useApiQuery<Branch[]>(['branches'], '/branches');

  useEffect(() => {
    if (!branchId) {
      if (user?.branches?.[0]?.id) setBranchId(user.branches[0].id);
      else if (branches?.[0]?.id) setBranchId(branches[0].id);
    }
  }, [branches, user, branchId]);

  const { data: children } = useApiQuery<{ data: Child[] }>(
    ['children', 'attendance-roster', branchId],
    '/children',
    { branchId, pageSize: 500 }
  );
  const { data: staff } = useApiQuery<{ data: Staff[] }>(
    ['staff', 'attendance-roster', branchId],
    '/hr/staff',
    { branchId, pageSize: 500 }
  );

  const { data: existing, isLoading } = useQuery<Attendance[]>({
    queryKey: ['attendance', 'by-date', branchId, date, attendeeType],
    queryFn: async () => {
      const { data } = await apiClient.get('/attendance/by-date', {
        params: { branchId, date, attendeeType },
      });
      return data;
    },
    enabled: !!branchId,
  });

  useEffect(() => {
    if (existing) {
      const map: Record<string, AttendanceStatus> = {};
      for (const rec of existing) {
        const key = attendeeType === 'CHILD' ? rec.childId : rec.staffId;
        if (key) map[key] = rec.status;
      }
      setDraft(map);
    } else {
      setDraft({});
    }
  }, [existing, attendeeType]);

  const roster = useMemo(() => {
    if (attendeeType === 'CHILD') {
      return (children?.data ?? []).map((c) => ({ id: c.id, name: `${c.firstName} ${c.lastName}` }));
    }
    return (staff?.data ?? []).map((s) => ({ id: s.id, name: s.user ? `${s.user.firstName} ${s.user.lastName}` : s.employeeCode }));
  }, [attendeeType, children, staff]);

  function setStatus(id: string, status: AttendanceStatus) {
    setDraft((prev) => ({ ...prev, [id]: status }));
  }

  async function saveAll() {
    if (!branchId) return;
    setSaving(true);
    try {
      const records = roster
        .filter((r) => draft[r.id])
        .map((r) => ({
          [attendeeType === 'CHILD' ? 'childId' : 'staffId']: r.id,
          status: draft[r.id],
        }));
      if (records.length === 0) {
        toast({ title: 'Nothing to save', description: 'Mark at least one attendee first.' });
        return;
      }
      await apiClient.post('/attendance/bulk', { branchId, date, attendeeType, records });
      toast({ title: 'Attendance saved', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    } catch (err) {
      toast({ title: 'Could not save attendance', description: getErrorMessage(err), variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
          <p className="text-sm text-muted-foreground">Mark daily attendance for children and staff.</p>
        </div>
        <Button onClick={saveAll} disabled={saving || !branchId}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Attendance
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select value={branchId} onValueChange={setBranchId}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Select branch" />
          </SelectTrigger>
          <SelectContent>
            {branches?.map((b) => (
              <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input type="date" className="w-44" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <Tabs value={attendeeType} onValueChange={(v) => setAttendeeType(v as AttendeeType)}>
        <TabsList>
          <TabsTrigger value="CHILD">Children</TabsTrigger>
          <TabsTrigger value="STAFF">Staff</TabsTrigger>
        </TabsList>
        <TabsContent value={attendeeType}>
          <div className="rounded-lg border border-border overflow-hidden mt-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roster.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {ATTENDANCE_STATUSES.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setStatus(r.id, s)}
                            className={cn(
                              'rounded-full px-2.5 py-1 text-xs font-medium border transition-colors',
                              draft[r.id] === s
                                ? `${STATUS_COLORS[s]} border-transparent`
                                : 'border-border text-muted-foreground hover:bg-accent'
                            )}
                          >
                            {STATUS_LABELS[s]}
                          </button>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!isLoading && roster.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                      No {attendeeType === 'CHILD' ? 'children' : 'staff'} found for this branch
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
