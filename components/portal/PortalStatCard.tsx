'use client';

import type { LucideIcon } from 'lucide-react';

type PortalStatCardProps = {
  label: string;
  value: string;
  subtext?: string;
  icon: LucideIcon;
  tone?: 'blue' | 'green' | 'amber' | 'red';
};

const tones = {
  blue: 'bg-blue-50 text-[var(--color-nav-primary)] border-blue-100',
  green: 'bg-green-50 text-green-700 border-green-100',
  amber: 'bg-amber-50 text-amber-700 border-amber-100',
  red: 'bg-red-50 text-[var(--color-accent-action)] border-red-100',
};

export default function PortalStatCard({
  label,
  value,
  subtext,
  icon: Icon,
  tone = 'blue',
}: PortalStatCardProps) {
  return (
    <div className="sms-card p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${tones[tone]}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">{label}</p>
        <p className="text-xl font-bold text-[var(--color-text-primary)] mt-0.5">{value}</p>
        {subtext && <p className="text-xs text-[var(--color-text-secondary)] mt-1">{subtext}</p>}
      </div>
    </div>
  );
}
