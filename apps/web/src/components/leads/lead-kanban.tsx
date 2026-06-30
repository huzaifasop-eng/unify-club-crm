'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Phone, Mail } from 'lucide-react';
import { apiClient, getErrorMessage } from '@/lib/api-client';
import { useToast } from '@/components/ui/toast';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LEAD_STAGES, LEAD_STAGE_LABELS, Lead, LeadStage } from '@/lib/types';
import { cn, formatDate } from '@/lib/utils';

type KanbanBoard = Record<LeadStage, Lead[]>;

const PRIORITY_VARIANT: Record<string, 'default' | 'destructive' | 'warning' | 'secondary'> = {
  LOW: 'secondary',
  MEDIUM: 'default',
  HIGH: 'warning',
  URGENT: 'destructive',
};

function LeadCard({ lead, onClick }: { lead: Lead; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={cn(
        'cursor-grab active:cursor-grabbing rounded-lg border border-border bg-card p-3 shadow-sm hover:shadow-md transition-shadow',
        isDragging && 'opacity-50 z-50'
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <p className="text-sm font-semibold truncate">{lead.childName}</p>
        <Badge variant={PRIORITY_VARIANT[lead.priority]} className="shrink-0 text-[10px]">
          {lead.priority}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground truncate mb-2">{lead.parentName}</p>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1 truncate">
          <Phone className="h-3 w-3 shrink-0" /> {lead.parentPhone}
        </span>
      </div>
      {lead.assignedTo && (
        <p className="text-[11px] text-muted-foreground mt-2">
          Assigned: {lead.assignedTo.firstName} {lead.assignedTo.lastName}
        </p>
      )}
      <p className="text-[10px] text-muted-foreground mt-1">{formatDate(lead.createdAt)}</p>
    </div>
  );
}

function KanbanColumn({
  stage,
  leads,
  onCardClick,
}: {
  stage: LeadStage;
  leads: Lead[];
  onCardClick: (lead: Lead) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex w-72 shrink-0 flex-col rounded-lg border border-border bg-muted/30 transition-colors',
        isOver && 'bg-primary/5 ring-2 ring-primary/30'
      )}
    >
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
        <p className="text-sm font-semibold truncate">{LEAD_STAGE_LABELS[stage]}</p>
        <span className="text-xs text-muted-foreground bg-background rounded-full px-2 py-0.5">
          {leads.length}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[120px] max-h-[calc(100vh-260px)]">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} onClick={() => onCardClick(lead)} />
        ))}
        {leads.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-6">No leads</p>
        )}
      </div>
    </div>
  );
}

export function LeadKanban({ onCardClick }: { onCardClick: (lead: Lead) => void }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeLead, setActiveLead] = useState<Lead | null>(null);

  const { data: board, isLoading } = useQuery<KanbanBoard>({
    queryKey: ['leads', 'kanban'],
    queryFn: async () => {
      const { data } = await apiClient.get('/leads/kanban');
      return data;
    },
  });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragStart(event: DragStartEvent) {
    if (!board) return;
    for (const stage of LEAD_STAGES) {
      const found = board[stage]?.find((l) => l.id === event.active.id);
      if (found) {
        setActiveLead(found);
        return;
      }
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveLead(null);
    const { active, over } = event;
    if (!over || !board) return;
    const newStage = over.id as LeadStage;

    let currentStage: LeadStage | null = null;
    let lead: Lead | null = null;
    for (const stage of LEAD_STAGES) {
      const found = board[stage]?.find((l) => l.id === active.id);
      if (found) {
        currentStage = stage;
        lead = found;
        break;
      }
    }
    if (!lead || currentStage === newStage) return;

    queryClient.setQueryData<KanbanBoard>(['leads', 'kanban'], (prev) => {
      if (!prev) return prev;
      const next = { ...prev };
      next[currentStage!] = next[currentStage!].filter((l) => l.id !== lead!.id);
      next[newStage] = [{ ...lead!, stage: newStage }, ...next[newStage]];
      return next;
    });

    try {
      await apiClient.patch(`/leads/${lead.id}/stage`, { stage: newStage });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    } catch (err) {
      toast({ title: 'Failed to move lead', description: getErrorMessage(err), variant: 'destructive' });
      queryClient.invalidateQueries({ queryKey: ['leads', 'kanban'] });
    }
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading kanban board...</p>;
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-4">
        {LEAD_STAGES.map((stage) => (
          <KanbanColumn key={stage} stage={stage} leads={board?.[stage] ?? []} onCardClick={onCardClick} />
        ))}
      </div>
      <DragOverlay>
        {activeLead && (
          <Card className="w-72 p-3 shadow-lg">
            <p className="text-sm font-semibold">{activeLead.childName}</p>
            <p className="text-xs text-muted-foreground">{activeLead.parentName}</p>
          </Card>
        )}
      </DragOverlay>
    </DndContext>
  );
}
