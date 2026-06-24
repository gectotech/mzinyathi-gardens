'use client';

import { useEffect, useState } from 'react';
import PortalFeaturePage from '@/components/portal/PortalFeaturePage';

export default function TeacherGradesPage() {
  const [items, setItems] = useState<{ label: string; value: string; meta?: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/portal/teacher/academics?view=grades')
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
      title="Grade Book"
      description="Enter and review mid-term and end-of-term marks."
      icon="graduation"
      items={items}
      emptyTitle="No grade entries"
      emptyDescription="Mark entry progress will show per class once learners are enrolled."
    />
  );
}
