'use client';

import { PortalSection } from '@/components/portal/PortalSection';
import { userInitials } from '@/lib/portal-auth';
import { usePortalSession } from '@/components/portal/usePortalSession';

export default function ParentProfilePage() {
  const { user, loading } = usePortalSession();

  if (loading || !user) return null;

  return (
    <div className="max-w-2xl">
      <div className="sms-card p-6 flex items-center gap-5 mb-6">
        <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xl font-bold">
          {userInitials(user)}
        </div>
        <div>
          <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">Parent / Guardian · {user.identifier}</p>
        </div>
      </div>
      <PortalSection title="Contact Information">
        <p className="text-sm"><strong>Email:</strong> {user.email}</p>
        <p className="text-sm mt-2"><strong>Children:</strong> {user.children?.map((c) => c.name).join(', ')}</p>
      </PortalSection>
    </div>
  );
}
