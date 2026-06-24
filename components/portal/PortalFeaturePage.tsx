'use client';

import {
  Award,
  Calendar,
  ClipboardList,
  Wallet,
  MessageSquare,
  BookOpen,
  CheckSquare,
  GraduationCap,
  FileText,
  Bell,
  Baby,
  type LucideIcon,
} from 'lucide-react';
import { PortalSection, PortalEmptyState } from './PortalSection';

const ICONS = {
  award: Award,
  calendar: Calendar,
  clipboard: ClipboardList,
  wallet: Wallet,
  message: MessageSquare,
  book: BookOpen,
  check: CheckSquare,
  graduation: GraduationCap,
  file: FileText,
  bell: Bell,
  baby: Baby,
} as const;

export type PortalFeatureIcon = keyof typeof ICONS;

type PortalFeaturePageProps = {
  title: string;
  description: string;
  icon: PortalFeatureIcon;
  items?: { label: string; value: string; meta?: string }[];
  emptyTitle?: string;
  emptyDescription?: string;
};

export default function PortalFeaturePage({
  title,
  description,
  icon,
  items = [],
  emptyTitle,
  emptyDescription,
}: PortalFeaturePageProps) {
  const Icon = ICONS[icon] as LucideIcon;
  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-[var(--color-nav-primary-muted)] flex items-center justify-center shrink-0">
          <Icon size={24} className="text-[var(--color-nav-primary)]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">{title}</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">{description}</p>
        </div>
      </div>

      {items.length > 0 ? (
        <PortalSection title="Overview">
          <div className="divide-y divide-[var(--color-border-default)]">
            {items.map((item) => (
              <div key={item.label} className="flex justify-between items-center py-3 gap-4">
                <div>
                  <p className="font-medium text-sm">{item.label}</p>
                  {item.meta && <p className="text-xs text-[var(--color-text-muted)]">{item.meta}</p>}
                </div>
                <span className="text-sm font-semibold text-[var(--color-nav-primary)]">{item.value}</span>
              </div>
            ))}
          </div>
        </PortalSection>
      ) : (
        <PortalEmptyState
          title={emptyTitle || 'Coming soon'}
          description={emptyDescription || 'This module will connect to live school data in the next release.'}
        />
      )}
    </div>
  );
}
