'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { apiClient, getErrorMessage } from '@/lib/api-client';
import { useApiQuery } from '@/lib/hooks/use-api-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useToast } from '@/components/ui/toast';
import { BranchFormDialog } from '@/components/settings/branch-form-dialog';
import { Branch } from '@/lib/types';

export default function BranchesSettingsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Branch | null>(null);
  const { data: branches, isLoading } = useApiQuery<Branch[]>(['branches'], '/branches');

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(branch: Branch) {
    setEditing(branch);
    setFormOpen(true);
  }

  async function toggleActive(branch: Branch, isActive: boolean) {
    try {
      await apiClient.patch(`/branches/${branch.id}`, { isActive });
      toast({ title: `Branch ${isActive ? 'activated' : 'deactivated'}`, variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    } catch (err) {
      toast({ title: 'Could not update branch', description: getErrorMessage(err), variant: 'destructive' });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Branches</h1>
          <p className="text-sm text-muted-foreground">Manage organization branches/locations.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> New Branch
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches?.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium cursor-pointer" onClick={() => openEdit(b)}>{b.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{b.code}</Badge>
                </TableCell>
                <TableCell>{b.city || '-'}</TableCell>
                <TableCell>{b.phone || '-'}</TableCell>
                <TableCell>{b.email || '-'}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Switch checked={b.isActive} onCheckedChange={(checked) => toggleActive(b, checked)} />
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && branches?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No branches found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <BranchFormDialog open={formOpen} onOpenChange={setFormOpen} branch={editing} />
    </div>
  );
}
