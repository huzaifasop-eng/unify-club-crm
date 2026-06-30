'use client';

import { useState } from 'react';
import { LayoutGrid, List, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LeadKanban } from '@/components/leads/lead-kanban';
import { LeadTable } from '@/components/leads/lead-table';
import { LeadFormDialog } from '@/components/leads/lead-form-dialog';
import { Lead } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function LeadsPage() {
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [formOpen, setFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  function openCreate() {
    setEditingLead(null);
    setFormOpen(true);
  }

  function openEdit(lead: Lead) {
    setEditingLead(lead);
    setFormOpen(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lead CRM</h1>
          <p className="text-sm text-muted-foreground">Track and convert prospective enrollments through the pipeline.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-border p-0.5">
            <button
              onClick={() => setView('kanban')}
              className={cn(
                'flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-medium',
                view === 'kanban' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              )}
            >
              <LayoutGrid className="h-4 w-4" /> Kanban
            </button>
            <button
              onClick={() => setView('table')}
              className={cn(
                'flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-medium',
                view === 'table' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              )}
            >
              <List className="h-4 w-4" /> Table
            </button>
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> New Lead
          </Button>
        </div>
      </div>

      {view === 'kanban' ? <LeadKanban onCardClick={openEdit} /> : <LeadTable onRowClick={openEdit} />}

      <LeadFormDialog open={formOpen} onOpenChange={setFormOpen} lead={editingLead} />
    </div>
  );
}
