import type { ReactNode } from 'react';

export function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

export function DetailRow({ label, value, mono }: { label: string; value?: ReactNode; mono?: boolean }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="flex flex-col sm:flex-row sm:gap-3 text-sm">
      <dt className="text-gray-500 shrink-0 sm:w-36">{label}</dt>
      <dd className={`text-gray-900 font-medium break-words ${mono ? 'font-mono text-xs' : ''}`}>{value}</dd>
    </div>
  );
}

export function DetailMessage({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-blue-100 bg-white p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
      {children}
    </div>
  );
}
