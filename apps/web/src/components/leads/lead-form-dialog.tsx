'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { apiClient, getErrorMessage } from '@/lib/api-client';
import { useApiQuery } from '@/lib/hooks/use-api-query';
import { Lead, Branch } from '@/lib/types';
import { useToast } from '@/components/ui/toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const leadSchema = z.object({
  branchId: z.string().min(1, 'Branch is required'),
  parentName: z.string().min(1, 'Parent name is required'),
  parentPhone: z.string().min(1, 'Parent phone is required'),
  parentEmail: z.string().email().optional().or(z.literal('')),
  parentAddress: z.string().optional(),
  childName: z.string().min(1, 'Child name is required'),
  childDob: z.string().optional(),
  childGender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  diagnosis: z.string().optional(),
  diagnosisNotes: z.string().optional(),
  source: z.enum(['WEBSITE', 'REFERRAL', 'WALK_IN', 'SOCIAL_MEDIA', 'PHONE_INQUIRY', 'EVENT', 'CAMPAIGN', 'OTHER']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  followUpDate: z.string().optional(),
  notes: z.string().optional(),
});

type LeadFormValues = z.infer<typeof leadSchema>;

export function LeadFormDialog({
  open,
  onOpenChange,
  lead,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead | null;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const { data: branches } = useApiQuery<Branch[]>(['branches'], '/branches');

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: { priority: 'MEDIUM', source: 'OTHER' },
  });

  useEffect(() => {
    if (open) {
      reset(
        lead
          ? {
              branchId: lead.branchId,
              parentName: lead.parentName,
              parentPhone: lead.parentPhone,
              parentEmail: lead.parentEmail ?? '',
              parentAddress: lead.parentAddress ?? '',
              childName: lead.childName,
              childDob: lead.childDob ? lead.childDob.slice(0, 10) : '',
              childGender: lead.childGender ?? undefined,
              diagnosis: lead.diagnosis ?? '',
              diagnosisNotes: lead.diagnosisNotes ?? '',
              source: lead.source,
              priority: lead.priority,
              followUpDate: lead.followUpDate ? lead.followUpDate.slice(0, 10) : '',
              notes: lead.notes ?? '',
            }
          : { priority: 'MEDIUM', source: 'OTHER' }
      );
    }
  }, [open, lead, reset]);

  async function onSubmit(values: LeadFormValues) {
    setSubmitting(true);
    try {
      const payload = { ...values, parentEmail: values.parentEmail || undefined };
      if (lead) {
        await apiClient.patch(`/leads/${lead.id}`, payload);
        toast({ title: 'Lead updated', variant: 'success' });
      } else {
        await apiClient.post('/leads', payload);
        toast({ title: 'Lead created', variant: 'success' });
      }
      queryClient.invalidateQueries({ queryKey: ['leads'] });
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
          <DialogTitle>{lead ? 'Edit Lead' : 'New Lead'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
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
                        <SelectItem key={b.id} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.branchId && <p className="text-xs text-destructive">{errors.branchId.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Parent Name</Label>
              <Input {...register('parentName')} />
              {errors.parentName && <p className="text-xs text-destructive">{errors.parentName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Parent Phone</Label>
              <Input {...register('parentPhone')} />
              {errors.parentPhone && <p className="text-xs text-destructive">{errors.parentPhone.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Parent Email</Label>
              <Input type="email" {...register('parentEmail')} />
            </div>
            <div className="space-y-1.5">
              <Label>Parent Address</Label>
              <Input {...register('parentAddress')} />
            </div>

            <div className="space-y-1.5">
              <Label>Child Name</Label>
              <Input {...register('childName')} />
              {errors.childName && <p className="text-xs text-destructive">{errors.childName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Child DOB</Label>
              <Input type="date" {...register('childDob')} />
            </div>
            <div className="space-y-1.5">
              <Label>Child Gender</Label>
              <Controller
                control={control}
                name="childGender"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Source</Label>
              <Controller
                control={control}
                name="source"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {['WEBSITE', 'REFERRAL', 'WALK_IN', 'SOCIAL_MEDIA', 'PHONE_INQUIRY', 'EVENT', 'CAMPAIGN', 'OTHER'].map(
                        (s) => (
                          <SelectItem key={s} value={s}>
                            {s.replace('_', ' ')}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Follow-up Date</Label>
              <Input type="date" {...register('followUpDate')} />
            </div>

            <div className="space-y-1.5 col-span-2">
              <Label>Diagnosis</Label>
              <Input {...register('diagnosis')} />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Diagnosis Notes</Label>
              <Textarea rows={2} {...register('diagnosisNotes')} />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Notes</Label>
              <Textarea rows={2} {...register('notes')} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {lead ? 'Save Changes' : 'Create Lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
