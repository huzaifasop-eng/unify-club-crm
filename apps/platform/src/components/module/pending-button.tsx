import type { ReactNode } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';

/**
 * An action whose server command isn't built yet. Rendered disabled (never a no-op that looks
 * clickable) with the reason available on hover and to screen readers.
 */
export function PendingButton({
  hint,
  children,
  variant,
  size,
}: {
  hint: string;
  children: ReactNode;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
}) {
  return (
    <span title={hint} className="inline-flex">
      <Button variant={variant} size={size} disabled aria-disabled>
        {children}
        <span className="sr-only"> — {hint}</span>
      </Button>
    </span>
  );
}
