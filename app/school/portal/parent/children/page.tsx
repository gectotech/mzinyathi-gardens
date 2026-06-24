'use client';

import { Baby } from 'lucide-react';
import { PortalSection } from '@/components/portal/PortalSection';
import { usePortalSession } from '@/components/portal/usePortalSession';
import Link from 'next/link';

export default function ParentChildrenPage() {
  const { user, loading } = usePortalSession();

  if (loading || !user) return null;
  const children = user.children || [];

  return (
    <div className="max-w-3xl space-y-6">
      <PortalSection title="My Children" description="Learners linked to your parent account">
        <div className="space-y-4">
          {children.map((child) => (
            <div key={child.studentNumber} className="flex items-center gap-4 p-4 rounded-xl border border-[var(--color-border-default)]">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <Baby className="text-emerald-700" size={22} />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{child.name}</p>
                <p className="text-sm text-[var(--color-text-secondary)]">{child.grade} · {child.studentNumber}</p>
              </div>
              <Link href="/school/portal/parent/fees" className="text-xs font-semibold text-[var(--color-nav-primary)]">
                View fees →
              </Link>
            </div>
          ))}
        </div>
      </PortalSection>
    </div>
  );
}
