'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Brand } from './brand';
import { SidebarNav } from './sidebar-nav';

export function MobileDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const close = () => onOpenChange(false);
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 lg:hidden" />
        <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-sidebar shadow-xl outline-none data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:animate-in data-[state=open]:slide-in-from-left lg:hidden">
          <Dialog.Title className="sr-only">Navigation</Dialog.Title>
          <Dialog.Description className="sr-only">All modules you have access to</Dialog.Description>
          <div className="relative">
            <Brand onNavigate={close} />
            <Dialog.Close
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>
          <SidebarNav onNavigate={close} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
