'use client';

import { useEffect, useState } from 'react';
import PortalFeaturePage from '@/components/portal/PortalFeaturePage';

export default function TeacherClassesPage() {
  const [items, setItems] = useState<{ label: string; value: string; meta?: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/portal/teacher/academics?view=classes')
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
      title="My Classes"
      description="Classes assigned to you this academic year."
      icon="book"
      items={items}
      emptyTitle="No classes assigned"
      emptyDescription="Your class list will appear once configured by the school."
    />
  );
}
