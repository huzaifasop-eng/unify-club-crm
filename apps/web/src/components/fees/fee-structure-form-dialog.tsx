'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { apiClient, getErrorMessage } from '@/lib/api-client';
import { useApiQuery } from '@/lib/hooks/use-api-query';
import { Branch, FeeStructure } from '@/lib/types';
import { useToast } from '@/components/ui/toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const schema = z.object({
  branchId: z.string().min(1, 'Branch is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  amount: z.coerce.number().min(0),
  frequency: z.string().min(1, 'Frequency is required'),
});

type FormValues = z.infer<typeof schema>;

export function FeeStructureFormDialog({
  open,
  onOpenChange,
  feeStructure,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feeStructure?: FeeStructure | null;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const { data: branches } = useApiQuery<Branch[]>(['branches'], '/branches');

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (open) {
      reset(
        feeStructure
          ? {
              branchId: feeStructure.branchId,
              name: feeStructure.name,
              description: feeStructure.description ?? '',
              amount: Number(feeStructure.amount),
              frequency: feeStructure.frequency,
            }
          : { amount: 0, frequency: 'MONTHLY' }
      );
    }
  }, [open, feeStructure, reset]);

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      if (feeStructure) {
        const { branchId, ...rest } = values;
        await apiClient.patch(`/fees/fee-structures/${feeStructure.id}`, rest);
        toast({ title: 'Fee structure updated', variant: 'success' });
      } else {
        await apiClient.post('/fees/fee-structures', values);
        toast({ title: 'Fee structure created', variant: 'success' });
      }
      queryClient.invalidateQueries({ queryKey: ['fee-structures'] });
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
          <DialogTitle>{feeStructure ? 'Edit Fee Structure' : 'New Fee Structure'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!feeStructure && (
            <div className="space-y-1.5">
              <Label>Branch</Label>
              <Controller
                control={control}
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
              {errors.branchId && <p className="text-xs text-destructive">{errors.branchId.message}</p>}
            </div>
          )}
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea rows={2} {...register('description')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Amount</Label>
              <Input type="number" step="0.01" {...register('amount')} />
              {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Frequency</Label>
              <Input {...register('frequency')} placeholder="MONTHLY, ANNUAL, ONE_TIME..." />
              {errors.frequency && <p className="text-xs text-destructive">{errors.frequency.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {feeStructure ? 'Save Changes' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
