'use client';

import { User, Mail, Hash } from 'lucide-react';
import { PortalSection } from '@/components/portal/PortalSection';
import { userInitials } from '@/lib/portal-auth';
import { usePortalSession } from '@/components/portal/usePortalSession';

export default function TeacherProfilePage() {
  const { user, loading } = usePortalSession();

  if (loading || !user) return null;

  return (
    <div className="max-w-2xl">
      <div className="sms-card p-6 flex items-center gap-5 mb-6">
        <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
          {userInitials(user)}
        </div>
        <div>
          <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">{user.department}</p>
        </div>
      </div>
      <PortalSection title="Staff Details">
        <dl className="space-y-3 text-sm">
          <div className="flex gap-3"><Hash size={16} className="text-[var(--color-nav-primary)]" /><span>Staff ID: {user.identifier}</span></div>
          <div className="flex gap-3"><Mail size={16} className="text-[var(--color-nav-primary)]" /><span>{user.email}</span></div>
          <div className="flex gap-3"><User size={16} className="text-[var(--color-nav-primary)]" /><span>Role: Teacher</span></div>
        </dl>
      </PortalSection>
    </div>
  );
}
