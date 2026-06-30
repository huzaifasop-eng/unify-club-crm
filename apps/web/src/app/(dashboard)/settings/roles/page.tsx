'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { apiClient, getErrorMessage } from '@/lib/api-client';
import { useApiQuery } from '@/lib/hooks/use-api-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useToast } from '@/components/ui/toast';
import { RoleFormDialog } from '@/components/settings/role-form-dialog';
import { Role } from '@/lib/types';

export default function RolesSettingsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);
  const { data: roles, isLoading } = useApiQuery<Role[]>(['roles'], '/roles');

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(role: Role) {
    setEditing(role);
    setFormOpen(true);
  }

  async function deleteRole(role: Role) {
    if (!window.confirm(`Delete role "${role.name}"?`)) return;
    try {
      await apiClient.delete(`/roles/${role.id}`);
      toast({ title: 'Role deleted', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    } catch (err) {
      toast({ title: 'Could not delete role', description: getErrorMessage(err), variant: 'destructive' });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Roles & Permissions</h1>
          <p className="text-sm text-muted-foreground">Define roles and assign granular permissions.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> New Role
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles?.map((role) => (
              <TableRow key={role.id} onClick={() => openEdit(role)} className="cursor-pointer">
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>{role.description || '-'}</TableCell>
                <TableCell>{role.permissions.length}</TableCell>
                <TableCell>{role._count?.users ?? 0}</TableCell>
                <TableCell>
                  <Badge variant={role.isSystem ? 'secondary' : 'outline'}>{role.isSystem ? 'System' : 'Custom'}</Badge>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  {!role.isSystem && (
                    <Button variant="ghost" size="icon" onClick={() => deleteRole(role)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && roles?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No roles found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <RoleFormDialog open={formOpen} onOpenChange={setFormOpen} role={editing} />
    </div>
  );
}
