'use client';

import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

type ViewDrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  headerIcon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  width?: 'md' | 'lg' | 'xl';
};

export default function ViewDrawer({
  open,
  onClose,
  title,
  subtitle,
  badge,
  headerIcon,
  children,
  footer,
  width = 'lg',
}: ViewDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const widthClass = { md: 'max-w-md', lg: 'max-w-2xl', xl: 'max-w-4xl' }[width];

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close"
      />
      <div
        className={`relative h-full w-full ${widthClass} bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-200`}
      >
        <div className="shrink-0 border-b bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4a] text-white px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 min-w-0">
              {headerIcon && (
                <div className="shrink-0 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  {headerIcon}
                </div>
              )}
              <div className="min-w-0">
                <h2 className="text-xl font-bold truncate">{title}</h2>
                {subtitle && <p className="text-sm text-white/70 mt-0.5 truncate">{subtitle}</p>}
                {badge && <div className="mt-2">{badge}</div>}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 p-2 rounded-lg hover:bg-white/10 transition"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/50">{children}</div>

        {footer && <div className="shrink-0 border-t bg-white px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}
