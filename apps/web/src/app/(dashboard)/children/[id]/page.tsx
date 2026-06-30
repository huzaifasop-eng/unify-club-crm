'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Loader2, Plus } from 'lucide-react';
import { apiClient, getErrorMessage } from '@/lib/api-client';
import { useApiQuery } from '@/lib/hooks/use-api-query';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { ChildFormDialog } from '@/components/children/child-form-dialog';
import { Child, ProgressNote } from '@/lib/types';
import { formatDate } from '@/lib/utils';

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm">{value || '-'}</p>
    </div>
  );
}

export default function ChildDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [note, setNote] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

  const { data: child, isLoading } = useApiQuery<Child>(['children', params.id], `/children/${params.id}`);
  const { data: notes } = useApiQuery<ProgressNote[]>(['children', params.id, 'progress-notes'], `/children/${params.id}/progress-notes`);

  async function addNote() {
    if (!note.trim()) return;
    setSubmittingNote(true);
    try {
      await apiClient.post(`/children/${params.id}/progress-notes`, { note });
      setNote('');
      queryClient.invalidateQueries({ queryKey: ['children', params.id, 'progress-notes'] });
      toast({ title: 'Progress note added', variant: 'success' });
    } catch (err) {
      toast({ title: 'Could not add note', description: getErrorMessage(err), variant: 'destructive' });
    } finally {
      setSubmittingNote(false);
    }
  }

  if (isLoading || !child) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push('/children')}>
          <ArrowLeft className="h-4 w-4" /> Back to Children
        </Button>
        <Button onClick={() => setEditOpen(true)}>Edit Profile</Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="text-lg">
              {child.firstName[0]}
              {child.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{child.firstName} {child.lastName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              DOB {formatDate(child.dob)} • {child.gender} • {child.isActive ? 'Active' : 'Inactive'}
            </p>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Guardian Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <InfoRow label="Guardian Name" value={child.guardianName} />
            <InfoRow label="Guardian Phone" value={child.guardianPhone} />
            <InfoRow label="Guardian Email" value={child.guardianEmail} />
            <InfoRow label="Guardian Address" value={child.guardianAddress} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Diagnosis & Medical</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <InfoRow label="Diagnosis" value={child.diagnosis} />
            <InfoRow label="Diagnosis Date" value={child.diagnosisDate ? formatDate(child.diagnosisDate) : null} />
            <InfoRow label="Medical Conditions" value={child.medicalConditions} />
            <InfoRow label="Allergies" value={child.allergies} />
            <InfoRow label="Medications" value={child.medications} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{child.strengths || 'No strengths recorded yet.'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{child.goals || 'No goals recorded yet.'}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Progress Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Textarea
              rows={2}
              placeholder="Add a progress note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addNote} disabled={submittingNote || !note.trim()}>
              {submittingNote ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Add
            </Button>
          </div>
          <div className="space-y-3">
            {notes?.map((n) => (
              <div key={n.id} className="rounded-md border border-border p-3">
                <p className="text-sm whitespace-pre-wrap">{n.note}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {n.category ? `${n.category} • ` : ''}
                  {formatDate(n.createdAt)}
                </p>
              </div>
            ))}
            {notes?.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">No progress notes yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <ChildFormDialog open={editOpen} onOpenChange={setEditOpen} child={child} />
    </div>
  );
}
