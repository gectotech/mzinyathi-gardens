'use client';

import { User, Mail, Hash, GraduationCap } from 'lucide-react';
import { PortalSection } from '@/components/portal/PortalSection';
import { userInitials } from '@/lib/portal-auth';
import { usePortalSession } from '@/components/portal/usePortalSession';

export default function StudentProfilePage() {
  const { user, loading } = usePortalSession();

  if (loading || !user) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="sms-card p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-[var(--color-nav-primary)] text-white flex items-center justify-center text-xl font-bold">
          {userInitials(user)}
        </div>
        <div>
          <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">{user.grade}</p>
        </div>
      </div>
      <PortalSection title="Account Details">
        <dl className="grid sm:grid-cols-2 gap-4 text-sm">
          {[
            { icon: Hash, label: 'Student Number', value: user.identifier },
            { icon: GraduationCap, label: 'Grade', value: user.grade || '—' },
            { icon: Mail, label: 'School Email', value: user.email },
            { icon: User, label: 'Role', value: 'Student' },
          ].map((row) => (
            <div key={row.label} className="flex gap-3 p-3 rounded-lg bg-[var(--color-bg-secondary)]">
              <row.icon size={18} className="text-[var(--color-nav-primary)] shrink-0 mt-0.5" />
              <div>
                <dt className="text-xs text-[var(--color-text-muted)]">{row.label}</dt>
                <dd className="font-medium mt-0.5">{row.value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </PortalSection>
    </div>
  );
}
