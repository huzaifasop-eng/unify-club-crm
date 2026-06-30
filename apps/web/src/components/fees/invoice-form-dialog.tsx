'use client';

import { useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { apiClient, getErrorMessage } from '@/lib/api-client';
import { useApiQuery } from '@/lib/hooks/use-api-query';
import { Branch, Child } from '@/lib/types';
import { useToast } from '@/components/ui/toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useState } from 'react';

const itemSchema = z.object({
  description: z.string().min(1, 'Description required'),
  amount: z.coerce.number().min(0),
  feeStructureId: z.string().optional(),
});

const schema = z.object({
  branchId: z.string().min(1, 'Branch is required'),
  childId: z.string().min(1, 'Child is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  discount: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
  items: z.array(itemSchema).min(1, 'At least one item required'),
});

type FormValues = z.infer<typeof schema>;

export function InvoiceFormDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const { data: branches } = useApiQuery<Branch[]>(['branches'], '/branches');
  const { data: children } = useApiQuery<{ data: Child[] }>(['children', 'all'], '/children', { pageSize: 200 });

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { items: [{ description: '', amount: 0 }], discount: 0 },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  useEffect(() => {
    if (open) {
      reset({ items: [{ description: '', amount: 0 }], discount: 0 });
    }
  }, [open, reset]);

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      await apiClient.post('/fees/invoices', values);
      toast({ title: 'Invoice created', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      onOpenChange(false);
    } catch (err) {
      toast({ title: 'Something went wrong', description: getErrorMessage(err), variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Invoice</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          <div className="grid grid-cols-2 gap-4">
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
            <div className="space-y-1.5">
              <Label>Child</Label>
              <Controller
                control={control}
                name="childId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select child" />
                    </SelectTrigger>
                    <SelectContent>
                      {children?.data.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.firstName} {c.lastName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.childId && <p className="text-xs text-destructive">{errors.childId.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Due Date</Label>
              <Input type="date" {...register('dueDate')} />
              {errors.dueDate && <p className="text-xs text-destructive">{errors.dueDate.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Discount</Label>
              <Input type="number" step="0.01" {...register('discount')} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Invoice Items</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => append({ description: '', amount: 0 })}>
                <Plus className="h-3.5 w-3.5" /> Add Item
              </Button>
            </div>
            {fields.map((field, idx) => (
              <div key={field.id} className="flex items-end gap-2">
                <div className="flex-1 space-y-1.5">
                  {idx === 0 && <Label className="text-xs">Description</Label>}
                  <Input {...register(`items.${idx}.description`)} placeholder="Description" />
                </div>
                <div className="w-32 space-y-1.5">
                  {idx === 0 && <Label className="text-xs">Amount</Label>}
                  <Input type="number" step="0.01" {...register(`items.${idx}.amount`)} placeholder="Amount" />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={fields.length === 1}
                  onClick={() => remove(idx)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {errors.items && <p className="text-xs text-destructive">{errors.items.message as string}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea rows={2} {...register('notes')} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Invoice
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
