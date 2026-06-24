'use client';

import { useEffect, useState } from 'react';
import PortalFeaturePage from '@/components/portal/PortalFeaturePage';
import { PortalSection } from '@/components/portal/PortalSection';

export default function TeacherAttendancePage() {
  const [items, setItems] = useState<{ label: string; value: string; meta?: string }[]>([]);
  const [weeklyAverage, setWeeklyAverage] = useState('—');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/portal/teacher/academics?view=attendance')
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items || []);
        setWeeklyAverage(d.weeklyAverage || '—');
      })
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
    <div className="max-w-4xl space-y-6">
      <PortalFeaturePage
        title="Attendance"
        description="Daily registers and weekly attendance trends."
        icon="check"
        items={items}
        emptyTitle="No classes"
        emptyDescription="Attendance registers appear once classes are assigned."
      />
      <PortalSection title="Weekly average">
        <p className="text-2xl font-bold text-[var(--color-nav-primary)]">{weeklyAverage}</p>
        <p className="text-sm text-[var(--color-text-muted)]">Across all your classes (last 7 days)</p>
      </PortalSection>
    </div>
  );
}
