'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { apiClient, getErrorMessage } from '@/lib/api-client';
import { useApiQuery } from '@/lib/hooks/use-api-query';
import { Child, Branch } from '@/lib/types';
import { useToast } from '@/components/ui/toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const schema = z.object({
  branchId: z.string().min(1, 'Branch is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dob: z.string().min(1, 'DOB is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  diagnosis: z.string().optional(),
  diagnosisDate: z.string().optional(),
  strengths: z.string().optional(),
  goals: z.string().optional(),
  medicalConditions: z.string().optional(),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  guardianName: z.string().min(1, 'Guardian name is required'),
  guardianPhone: z.string().min(1, 'Guardian phone is required'),
  guardianEmail: z.string().email().optional().or(z.literal('')),
  guardianAddress: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ChildFormDialog({
  open,
  onOpenChange,
  child,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  child?: Child | null;
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
        child
          ? {
              branchId: child.branchId,
              firstName: child.firstName,
              lastName: child.lastName,
              dob: child.dob.slice(0, 10),
              gender: child.gender,
              diagnosis: child.diagnosis ?? '',
              diagnosisDate: child.diagnosisDate ? child.diagnosisDate.slice(0, 10) : '',
              strengths: child.strengths ?? '',
              goals: child.goals ?? '',
              medicalConditions: child.medicalConditions ?? '',
              allergies: child.allergies ?? '',
              medications: child.medications ?? '',
              guardianName: child.guardianName,
              guardianPhone: child.guardianPhone,
              guardianEmail: child.guardianEmail ?? '',
              guardianAddress: child.guardianAddress ?? '',
            }
          : { gender: 'MALE' }
      );
    }
  }, [open, child, reset]);

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        guardianEmail: values.guardianEmail || undefined,
        diagnosisDate: values.diagnosisDate || undefined,
      };
      if (child) {
        await apiClient.patch(`/children/${child.id}`, payload);
        toast({ title: 'Child profile updated', variant: 'success' });
      } else {
        await apiClient.post('/children', payload);
        toast({ title: 'Child profile created', variant: 'success' });
      }
      queryClient.invalidateQueries({ queryKey: ['children'] });
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
          <DialogTitle>{child ? 'Edit Child Profile' : 'New Child Profile'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          <div className="grid grid-cols-2 gap-4">
            {!child && (
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
              <Label>First Name</Label>
              <Input {...register('firstName')} />
              {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Last Name</Label>
              <Input {...register('lastName')} />
              {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Date of Birth</Label>
              <Input type="date" {...register('dob')} />
              {errors.dob && <p className="text-xs text-destructive">{errors.dob.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Gender</Label>
              <Controller
                control={control}
                name="gender"
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
              <Label>Guardian Phone</Label>
              <Input {...register('guardianPhone')} />
              {errors.guardianPhone && <p className="text-xs text-destructive">{errors.guardianPhone.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Guardian Email</Label>
              <Input type="email" {...register('guardianEmail')} />
            </div>
            <div className="space-y-1.5">
              <Label>Guardian Address</Label>
              <Input {...register('guardianAddress')} />
            </div>

            <div className="space-y-1.5">
              <Label>Diagnosis</Label>
              <Input {...register('diagnosis')} />
            </div>
            <div className="space-y-1.5">
              <Label>Diagnosis Date</Label>
              <Input type="date" {...register('diagnosisDate')} />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Strengths</Label>
              <Textarea rows={2} {...register('strengths')} />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Goals</Label>
              <Textarea rows={2} {...register('goals')} />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Medical Conditions</Label>
              <Textarea rows={2} {...register('medicalConditions')} />
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
              {child ? 'Save Changes' : 'Create Profile'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
