'use client';

import type { ReactNode } from 'react';

type PortalSectionProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function PortalSection({ title, description, action, children }: PortalSectionProps) {
  return (
    <section className="sms-card overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4 border-b border-[var(--color-border-default)] bg-[var(--color-bg-secondary)]">
        <div>
          <h2 className="font-semibold text-[var(--color-text-primary)]">{title}</h2>
          {description && <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">{description}</p>}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function PortalEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="text-center py-12 px-4">
      <p className="font-medium text-[var(--color-text-primary)]">{title}</p>
      <p className="text-sm text-[var(--color-text-muted)] mt-1 max-w-sm mx-auto">{description}</p>
    </div>
  );
}
