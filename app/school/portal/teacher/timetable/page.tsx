'use client';

import { useEffect, useState } from 'react';
import PortalFeaturePage from '@/components/portal/PortalFeaturePage';

export default function TeacherTimetablePage() {
  const [items, setItems] = useState<{ label: string; value: string; meta?: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/portal/teacher/academics?view=timetable')
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
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
      title="Timetable"
      description="Your weekly teaching schedule across all classes."
      icon="calendar"
      items={items}
      emptyTitle="No timetable"
      emptyDescription="Lesson slots will appear once your schedule is set up."
    />
  );
}
