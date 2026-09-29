import { Badge } from '@/components/ui/badge';
import { PHASE_LABELS, type Phase } from '@/config/modules';

export function PhaseBadge({ phase }: { phase: Phase }) {
  return (
    <Badge variant="outline" className="whitespace-nowrap font-medium text-muted-foreground">
      Phase {phase} · {PHASE_LABELS[phase]}
    </Badge>
  );
}

export function phaseHint(phase: Phase) {
  return `Available in Phase ${phase} (${PHASE_LABELS[phase]})`;
}
