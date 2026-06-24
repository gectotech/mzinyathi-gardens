'use client';

import { useEffect, useState } from 'react';
import PortalFeaturePage from '@/components/portal/PortalFeaturePage';

type ApplicationRow = {
  id: string;
  trackingId: string;
  learnerName: string;
  grade: string;
  statusLabel: string;
};

export default function ParentApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/portal/parent/applications')
      .then((r) => r.json())
      .then((d) => setApplications(d.applications || []))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-9 w-9 rounded-full border-2 border-[var(--color-nav-primary)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <PortalFeaturePage
      title="Applications"
      description="Track admission applications for your children."
      icon="file"
      items={applications.map((app) => ({
        label: `${app.learnerName} — ${app.grade}`,
        value: app.statusLabel,
        meta: `Tracking: ${app.trackingId}`,
      }))}
      emptyTitle="No active applications"
      emptyDescription="When you apply via the admissions form, applications appear here automatically."
    />
  );
}
