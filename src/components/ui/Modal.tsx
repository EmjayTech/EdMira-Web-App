'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * Accessible modal on the native <dialog> element (focus trap, Esc to close
 * and inert background come for free).
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  dismissible = true,
  closeLabel = 'Close',
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** False for modals the student must answer (e.g. session warning). */
  dismissible?: boolean;
  closeLabel?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={e => {
        e.preventDefault();
        if (dismissible) onClose();
      }}
      onClick={e => {
        if (dismissible && e.target === ref.current) onClose();
      }}
      className={cn(
        'm-auto w-[calc(100%-2rem)] rounded-3xl bg-surface p-0 text-text shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm',
        'open:animate-fade-up',
        { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }[size],
      )}>
      {open ? (
        <div className="flex max-h-[85vh] flex-col">
          {title || dismissible ? (
            <div className="flex items-start justify-between gap-4 px-6 pt-6">
              <div>
                {title ? <h2 className="text-xl font-bold tracking-tight">{title}</h2> : null}
                {description ? <div className="mt-1.5 text-sm leading-relaxed text-text-muted">{description}</div> : null}
              </div>
              {dismissible ? (
                <button
                  onClick={onClose}
                  aria-label={closeLabel}
                  className="-mr-2 -mt-1 grid size-9 shrink-0 place-items-center rounded-full text-text-muted hover:bg-surface-muted">
                  <X className="size-5" />
                </button>
              ) : null}
            </div>
          ) : null}
          <div className="overflow-y-auto px-6 py-5">{children}</div>
          {footer ? <div className="flex flex-wrap justify-end gap-3 border-t border-divider px-6 py-4">{footer}</div> : null}
        </div>
      ) : null}
    </dialog>
  );
}
