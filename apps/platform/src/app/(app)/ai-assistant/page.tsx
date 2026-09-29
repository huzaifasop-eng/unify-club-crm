import type { Metadata } from 'next';
import { Lock, SendHorizontal, ShieldCheck, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/module/page-header';
import { PhaseBadge, phaseHint } from '@/components/module/phase-badge';
import { PendingButton } from '@/components/module/pending-button';

export const metadata: Metadata = { title: 'AI Assistant' };

const SUGGESTIONS = [
  'How many leads did each branch convert last month?',
  'Which deals over 500,000 have had no activity for two weeks?',
  'Who is on leave tomorrow in my team?',
  'Summarise this quarter’s expenses by category.',
  'Draft a follow-up WhatsApp message for my overdue leads.',
  'Which items will run out of stock in the next 7 days?',
];

const GUARDRAILS = [
  'Sees only what you can see — it queries through your own permissions.',
  'Never changes data on its own: every create, update or assignment needs your confirmation.',
  'Salary, ID and bank details are excluded unless you hold those permissions.',
  'Every question and action is logged in the audit trail.',
];

export default function AiAssistantPage() {
  const hint = phaseHint(5);
  return (
    <div className="space-y-6">
      <PageHeader
        icon={Sparkles}
        title="AI Assistant"
        description="Ask questions about your business data, draft messages, and take actions with confirmation."
        badge={<PhaseBadge phase={5} />}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="flex min-h-[420px] flex-col">
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="h-6 w-6" aria-hidden />
            </span>
            <p className="mt-4 font-semibold">What would you like to know?</p>
            <p className="mt-1 text-sm text-muted-foreground">Examples of what the assistant will answer:</p>
            <ul className="mt-5 grid w-full max-w-2xl gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <li key={s} className="rounded-lg border border-border bg-background px-3 py-2.5 text-left text-sm text-muted-foreground">
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-border p-3">
            <div className="flex items-end gap-2">
              <label className="flex-1">
                <span className="sr-only">Message</span>
                <textarea
                  rows={1}
                  disabled
                  placeholder={`${hint}…`}
                  className="min-h-10 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60"
                />
              </label>
              <PendingButton hint={hint} size="icon">
                <SendHorizontal className="h-4 w-4" aria-hidden />
              </PendingButton>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-4 w-4 text-primary" aria-hidden /> Guardrails
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {GUARDRAILS.map((g) => (
                <li key={g} className="flex gap-2">
                  <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
