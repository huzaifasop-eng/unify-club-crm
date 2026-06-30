'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { apiClient, getErrorMessage } from '@/lib/api-client';
import { useApiQuery } from '@/lib/hooks/use-api-query';
import { Branch, Staff } from '@/lib/types';
import { useToast } from '@/components/ui/toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const createSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Min 6 characters'),
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  phone: z.string().optional(),
  branchId: z.string().min(1, 'Branch is required'),
  employeeCode: z.string().min(1, 'Required'),
  designation: z.string().optional(),
  department: z.string().optional(),
  joinDate: z.string().optional(),
  salary: z.coerce.number().optional(),
  cnic: z.string().optional(),
  address: z.string().optional(),
});

const updateSchema = z.object({
  designation: z.string().optional(),
  department: z.string().optional(),
  status: z.enum(['ACTIVE', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED', 'RESIGNED']),
  salary: z.coerce.number().optional(),
  address: z.string().optional(),
  joinDate: z.string().optional(),
});

type CreateValues = z.infer<typeof createSchema>;
type UpdateValues = z.infer<typeof updateSchema>;

export function StaffFormDialog({
  open,
  onOpenChange,
  staff,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff?: Staff | null;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const { data: branches } = useApiQuery<Branch[]>(['branches'], '/branches');

  const createForm = useForm<CreateValues>({ resolver: zodResolver(createSchema) });
  const updateForm = useForm<UpdateValues>({ resolver: zodResolver(updateSchema) });

  useEffect(() => {
    if (open) {
      if (staff) {
        updateForm.reset({
          designation: staff.designation ?? '',
          department: staff.department ?? '',
          status: staff.status,
          salary: staff.salary ? Number(staff.salary) : undefined,
          address: staff.address ?? '',
          joinDate: staff.joinDate ? staff.joinDate.slice(0, 10) : '',
        });
      } else {
        createForm.reset({});
      }
    }
  }, [open, staff]);

  async function onCreate(values: CreateValues) {
    setSubmitting(true);
    try {
      await apiClient.post('/hr/staff', values);
      toast({ title: 'Staff member created', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      onOpenChange(false);
    } catch (err) {
      toast({ title: 'Something went wrong', description: getErrorMessage(err), variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  }

  async function onUpdate(values: UpdateValues) {
    if (!staff) return;
    setSubmitting(true);
    try {
      await apiClient.patch(`/hr/staff/${staff.id}`, { ...values, joinDate: values.joinDate || undefined });
      toast({ title: 'Staff member updated', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      onOpenChange(false);
    } catch (err) {
      toast({ title: 'Something went wrong', description: getErrorMessage(err), variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  }

  if (staff) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Staff — {staff.employeeCode}</DialogTitle>
          </DialogHeader>
          <form onSubmit={updateForm.handleSubmit(onUpdate)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Designation</Label>
                <Input {...updateForm.register('designation')} />
              </div>
              <div className="space-y-1.5">
                <Label>Department</Label>
                <Input {...updateForm.register('department')} />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Controller
                  control={updateForm.control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="ON_LEAVE">On Leave</SelectItem>
                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
                        <SelectItem value="TERMINATED">Terminated</SelectItem>
                        <SelectItem value="RESIGNED">Resigned</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Salary</Label>
                <Input type="number" step="0.01" {...updateForm.register('salary')} />
              </div>
              <div className="space-y-1.5">
                <Label>Join Date</Label>
                <Input type="date" {...updateForm.register('joinDate')} />
              </div>
              <div className="space-y-1.5">
                <Label>Address</Label>
                <Input {...updateForm.register('address')} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Staff Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={createForm.handleSubmit(onCreate)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>First Name</Label>
              <Input {...createForm.register('firstName')} />
              {createForm.formState.errors.firstName && (
                <p className="text-xs text-destructive">{createForm.formState.errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Last Name</Label>
              <Input {...createForm.register('lastName')} />
              {createForm.formState.errors.lastName && (
                <p className="text-xs text-destructive">{createForm.formState.errors.lastName.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" {...createForm.register('email')} />
              {createForm.formState.errors.email && (
                <p className="text-xs text-destructive">{createForm.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Password</Label>
              <Input type="password" {...createForm.register('password')} />
              {createForm.formState.errors.password && (
                <p className="text-xs text-destructive">{createForm.formState.errors.password.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input {...createForm.register('phone')} />
            </div>
            <div className="space-y-1.5">
              <Label>Branch</Label>
              <Controller
                control={createForm.control}
                name="branchId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches?.map((b) => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {createForm.formState.errors.branchId && (
                <p className="text-xs text-destructive">{createForm.formState.errors.branchId.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Employee Code</Label>
              <Input {...createForm.register('employeeCode')} />
              {createForm.formState.errors.employeeCode && (
                <p className="text-xs text-destructive">{createForm.formState.errors.employeeCode.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Designation</Label>
              <Input {...createForm.register('designation')} />
            </div>
            <div className="space-y-1.5">
              <Label>Department</Label>
              <Input {...createForm.register('department')} />
            </div>
            <div className="space-y-1.5">
              <Label>Join Date</Label>
              <Input type="date" {...createForm.register('joinDate')} />
            </div>
            <div className="space-y-1.5">
              <Label>Salary</Label>
              <Input type="number" step="0.01" {...createForm.register('salary')} />
            </div>
            <div className="space-y-1.5">
              <Label>CNIC</Label>
              <Input {...createForm.register('cnic')} />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Address</Label>
              <Input {...createForm.register('address')} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Staff
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
