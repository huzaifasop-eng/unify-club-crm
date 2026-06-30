'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { apiClient, getErrorMessage } from '@/lib/api-client';
import { useApiQuery } from '@/lib/hooks/use-api-query';
import { Admission, Branch } from '@/lib/types';
import { useToast } from '@/components/ui/toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const schema = z.object({
  branchId: z.string().min(1, 'Branch is required'),
  childName: z.string().min(1, 'Child name is required'),
  childDob: z.string().min(1, 'DOB is required'),
  childGender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  guardianName: z.string().min(1, 'Guardian name is required'),
  guardianRelation: z.string().optional(),
  guardianPhone: z.string().min(1, 'Guardian phone is required'),
  guardianEmail: z.string().email().optional().or(z.literal('')),
  guardianCnic: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyRelation: z.string().optional(),
  medicalHistory: z.string().optional(),
  diagnosis: z.string().optional(),
  allergies: z.string().optional(),
  medications: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function AdmissionFormDialog({
  open,
  onOpenChange,
  admission,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admission?: Admission | null;
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
        admission
          ? {
              branchId: admission.branchId,
              childName: admission.childName,
              childDob: admission.childDob.slice(0, 10),
              childGender: admission.childGender,
              guardianName: admission.guardianName,
              guardianRelation: admission.guardianRelation ?? '',
              guardianPhone: admission.guardianPhone,
              guardianEmail: admission.guardianEmail ?? '',
              guardianCnic: admission.guardianCnic ?? '',
              emergencyContactName: admission.emergencyContactName ?? '',
              emergencyContactPhone: admission.emergencyContactPhone ?? '',
              emergencyRelation: admission.emergencyRelation ?? '',
              medicalHistory: admission.medicalHistory ?? '',
              diagnosis: admission.diagnosis ?? '',
              allergies: admission.allergies ?? '',
              medications: admission.medications ?? '',
            }
          : { childGender: 'MALE' }
      );
    }
  }, [open, admission, reset]);

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const payload = { ...values, guardianEmail: values.guardianEmail || undefined };
      if (admission) {
        await apiClient.patch(`/admissions/${admission.id}`, payload);
        toast({ title: 'Admission updated', variant: 'success' });
      } else {
        await apiClient.post('/admissions', payload);
        toast({ title: 'Admission created', variant: 'success' });
      }
      queryClient.invalidateQueries({ queryKey: ['admissions'] });
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
          <DialogTitle>{admission ? 'Edit Admission' : 'New Admission'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          <div className="grid grid-cols-2 gap-4">
            {!admission && (
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
            )}

            <div className="space-y-1.5">
              <Label>Child Name</Label>
              <Input {...register('childName')} />
              {errors.childName && <p className="text-xs text-destructive">{errors.childName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Date of Birth</Label>
              <Input type="date" {...register('childDob')} />
              {errors.childDob && <p className="text-xs text-destructive">{errors.childDob.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Gender</Label>
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
              <Label>Guardian Name</Label>
              <Input {...register('guardianName')} />
              {errors.guardianName && <p className="text-xs text-destructive">{errors.guardianName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Guardian Relation</Label>
              <Input {...register('guardianRelation')} />
            </div>
            <div className="space-y-1.5">
              <Label>Guardian Phone</Label>
              <Input {...register('guardianPhone')} />
              {errors.guardianPhone && <p className="text-xs text-destructive">{errors.guardianPhone.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Guardian Email</Label>
              <Input type="email" {...register('guardianEmail')} />
            </div>
            <div className="space-y-1.5">
              <Label>Guardian CNIC</Label>
              <Input {...register('guardianCnic')} />
            </div>

            <div className="space-y-1.5">
              <Label>Emergency Contact Name</Label>
              <Input {...register('emergencyContactName')} />
            </div>
            <div className="space-y-1.5">
              <Label>Emergency Contact Phone</Label>
              <Input {...register('emergencyContactPhone')} />
            </div>
            <div className="space-y-1.5">
              <Label>Emergency Relation</Label>
              <Input {...register('emergencyRelation')} />
            </div>

            <div className="space-y-1.5 col-span-2">
              <Label>Diagnosis</Label>
              <Input {...register('diagnosis')} />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Medical History</Label>
              <Textarea rows={2} {...register('medicalHistory')} />
            </div>
            <div className="space-y-1.5">
              <Label>Allergies</Label>
              <Input {...register('allergies')} />
            </div>
            <div className="space-y-1.5">
              <Label>Medications</Label>
              <Input {...register('medications')} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {admission ? 'Save Changes' : 'Create Admission'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
