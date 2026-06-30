'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { apiClient, getErrorMessage } from '@/lib/api-client';
import { Branch } from '@/lib/types';
import { useToast } from '@/components/ui/toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  address: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

export function BranchFormDialog({
  open,
  onOpenChange,
  branch,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch?: Branch | null;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (open) {
      reset(
        branch
          ? {
              name: branch.name,
              code: branch.code,
              address: branch.address ?? '',
              city: branch.city ?? '',
              phone: branch.phone ?? '',
              email: branch.email ?? '',
            }
          : {}
      );
    }
  }, [open, branch, reset]);

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const payload = { ...values, email: values.email || undefined };
      if (branch) {
        await apiClient.patch(`/branches/${branch.id}`, payload);
        toast({ title: 'Branch updated', variant: 'success' });
      } else {
        await apiClient.post('/branches', payload);
        toast({ title: 'Branch created', variant: 'success' });
      }
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      onOpenChange(false);
    } catch (err) {
      toast({ title: 'Something went wrong', description: getErrorMessage(err), variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{branch ? 'Edit Branch' : 'New Branch'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Code</Label>
              <Input {...register('code')} />
              {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Address</Label>
              <Input {...register('address')} />
            </div>
            <div className="space-y-1.5">
              <Label>City</Label>
              <Input {...register('city')} />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input {...register('phone')} />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Email</Label>
              <Input type="email" {...register('email')} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {branch ? 'Save Changes' : 'Create Branch'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
