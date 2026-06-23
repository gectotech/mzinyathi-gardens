'use client';

import type { ReactNode } from 'react';

export type FloatingAction = {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger' | 'primary';
  disabled?: boolean;
};

type FloatingActionBarProps = {
  selectedCount: number;
  itemLabel?: string;
  actions: FloatingAction[];
  onClearSelection?: () => void;
};

export default function FloatingActionBar({
  selectedCount,
  itemLabel = 'item',
  actions,
  onClearSelection,
}: FloatingActionBarProps) {
  if (selectedCount <= 0) return null;

  const label = `${selectedCount} ${itemLabel}${selectedCount === 1 ? '' : 's'} selected`;

  return (
    <div
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 w-[min(100%-2rem,56rem)] animate-in fade-in slide-in-from-bottom-4"
      role="toolbar"
      aria-label="Bulk actions"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-nav-primary)] px-4 py-3 text-white shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">{label}</span>
          {onClearSelection && (
            <button
              type="button"
              onClick={onClearSelection}
              className="text-xs text-white/70 hover:text-white underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              disabled={action.disabled}
              onClick={action.onClick}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                action.variant === 'danger'
                  ? 'bg-[var(--color-accent-action)] hover:bg-[var(--color-accent-action-hover)]'
                  : action.variant === 'primary'
                  ? 'bg-white text-[var(--color-nav-primary)] hover:bg-slate-100'
                  : 'bg-white/15 hover:bg-white/25'
              }`}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
