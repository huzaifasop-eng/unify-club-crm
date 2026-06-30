'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { apiClient, getErrorMessage } from '@/lib/api-client';
import { useApiQuery } from '@/lib/hooks/use-api-query';
import { Permission, Role } from '@/lib/types';
import { useToast } from '@/components/ui/toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function RoleFormDialog({
  open,
  onOpenChange,
  role,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role | null;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { data: permissions } = useApiQuery<Permission[]>(['permissions'], '/roles/permissions');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (open) {
      reset(role ? { name: role.name, description: role.description ?? '' } : {});
      setSelectedIds(new Set(role?.permissions.map((p) => p.permission.id) ?? []));
    }
  }, [open, role, reset]);

  const grouped = useMemo(() => {
    const map = new Map<string, Permission[]>();
    for (const p of permissions ?? []) {
      const list = map.get(p.resource) ?? [];
      list.push(p);
      map.set(p.resource, list);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [permissions]);

  function togglePermission(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleResourceAll(resourcePerms: Permission[], checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const p of resourcePerms) {
        if (checked) next.add(p.id);
        else next.delete(p.id);
      }
      return next;
    });
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const payload = { ...values, permissionIds: Array.from(selectedIds) };
      if (role) {
        await apiClient.patch(`/roles/${role.id}`, payload);
        toast({ title: 'Role updated', variant: 'success' });
      } else {
        await apiClient.post('/roles', payload);
        toast({ title: 'Role created', variant: 'success' });
      }
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      onOpenChange(false);
    } catch (err) {
      toast({ title: 'Something went wrong', description: getErrorMessage(err), variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  }

  const isSystemRole = !!role?.isSystem;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{role ? `Edit Role — ${role.name}` : 'New Role'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input {...register('name')} disabled={isSystemRole} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea rows={1} {...register('description')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Permissions ({selectedIds.size} selected)</Label>
            <ScrollArea className="h-72 rounded-md border border-border p-3">
              <div className="space-y-4">
                {grouped.map(([resource, perms]) => {
                  const allChecked = perms.every((p) => selectedIds.has(p.id));
                  return (
                    <div key={resource}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Checkbox
                          checked={allChecked}
                          onCheckedChange={(checked) => toggleResourceAll(perms, !!checked)}
                        />
                        <span className="text-sm font-semibold capitalize">{resource}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 pl-6">
                        {perms.map((p) => (
                          <label key={p.id} className="flex items-center gap-2 text-sm">
                            <Checkbox checked={selectedIds.has(p.id)} onCheckedChange={() => togglePermission(p.id)} />
                            {p.action}
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {grouped.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">No permissions found</p>
                )}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {role ? 'Save Changes' : 'Create Role'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
