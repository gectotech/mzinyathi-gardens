'use client';

import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

export type ProgressStep = {
  step: string;
  status: 'completed' | 'in_progress' | 'pending';
};

type ApplicationProgressTrackerProps = {
  steps: ProgressStep[];
  title?: string;
  compact?: boolean;
};

const statusIcon = (status: ProgressStep['status']) => {
  if (status === 'completed') return <CheckCircle size={18} className="text-[var(--color-accent-success)]" />;
  if (status === 'in_progress') return <Clock size={18} className="text-[var(--color-accent-warning)]" />;
  return <AlertCircle size={18} className="text-[var(--color-text-muted)]" />;
};

export default function ApplicationProgressTracker({
  steps,
  title = 'Application Progress',
  compact = false,
}: ApplicationProgressTrackerProps) {
  return (
    <div className={`sms-card ${compact ? 'p-4' : 'p-6'}`}>
      <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">{title}</h3>
      <div className="flex flex-col gap-0">
        {steps.map((step, index) => (
          <div key={`${step.step}-${index}`} className="flex items-start gap-3 pb-4 relative">
            {index < steps.length - 1 && (
              <div
                className="absolute left-[11px] top-7 bottom-0 w-0.5 bg-[var(--color-border-default)]"
                aria-hidden
              />
            )}
            <div
              className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                step.status === 'completed'
                  ? 'border-[var(--color-accent-success)] bg-green-50'
                  : step.status === 'in_progress'
                  ? 'border-[var(--color-accent-warning)] bg-amber-50'
                  : 'border-[var(--color-border-default)] bg-[var(--color-bg-secondary)]'
              }`}
            >
              {statusIcon(step.status)}
            </div>
            <div className="pt-0.5">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">{step.step}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
