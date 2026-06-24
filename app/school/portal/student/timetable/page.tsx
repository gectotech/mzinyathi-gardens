'use client';

import { useEffect, useState } from 'react';
import PortalFeaturePage from '@/components/portal/PortalFeaturePage';
import { PortalSection } from '@/components/portal/PortalSection';

export default function StudentTimetablePage() {
  const [lessons, setLessons] = useState<{ label: string; value: string; meta?: string }[]>([]);
  const [exams, setExams] = useState<{ label: string; value: string; meta?: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/portal/student/academics?view=timetable')
      .then((r) => r.json())
      .then((d) => {
        setLessons(d.lessons || []);
        setExams(d.exams || []);
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
        title="Exam Timetable"
        description="Mid-year and end-of-term examination schedule."
        icon="calendar"
        items={exams}
        emptyTitle="No exams scheduled"
        emptyDescription="Exam dates will appear here when published."
      />
      {lessons.length > 0 && (
        <PortalSection title="Weekly lesson timetable">
          <div className="divide-y divide-[var(--color-border-default)]">
            {lessons.map((item) => (
              <div key={item.label + item.value} className="flex justify-between py-3 gap-4 text-sm">
                <span className="font-medium">{item.label}</span>
                <span className="text-[var(--color-nav-primary)]">{item.value}</span>
                <span className="text-[var(--color-text-muted)]">{item.meta}</span>
              </div>
            ))}
          </div>
        </PortalSection>
      )}
    </div>
  );
}
