'use client';

import { useEffect, useState } from 'react';
import { PortalSection, PortalEmptyState } from '@/components/portal/PortalSection';

type Assignment = {
  id: string;
  label: string;
  value: string;
  meta: string;
  status: string;
};

export default function StudentAssignmentsPage() {
  const [items, setItems] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = () => {
    fetch('/api/portal/student/academics?view=assignments')
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (assignmentId: string, status: 'draft' | 'submitted') => {
    setUpdating(assignmentId);
    await fetch('/api/portal/student/assignments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignmentId, status }),
    });
    load();
    setUpdating(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-9 w-9 rounded-full border-2 border-[var(--color-nav-primary)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-bold">Assignments</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Homework and projects assigned by your teachers.
        </p>
      </div>

      {items.length === 0 ? (
        <PortalEmptyState
          title="No assignments"
          description="Assignments from your teachers will appear here."
        />
      ) : (
        <PortalSection title="Your assignments">
          <ul className="divide-y divide-[var(--color-border-default)]">
            {items.map((item) => (
              <li key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">{item.meta}</p>
                  <p className="text-sm text-[var(--color-nav-primary)] mt-1">{item.value}</p>
                </div>
                {(item.status === 'pending' || item.status === 'draft') && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={updating === item.id}
                      onClick={() => updateStatus(item.id, 'draft')}
                      className="text-xs px-3 py-1.5 rounded-lg border border-[var(--color-border-default)]"
                    >
                      Save draft
                    </button>
                    <button
                      type="button"
                      disabled={updating === item.id}
                      onClick={() => updateStatus(item.id, 'submitted')}
                      className="text-xs px-3 py-1.5 rounded-lg bg-[var(--color-nav-primary)] text-white"
                    >
                      Submit
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </PortalSection>
      )}
    </div>
  );
}
