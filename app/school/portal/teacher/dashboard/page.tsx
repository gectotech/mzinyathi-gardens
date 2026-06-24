'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckSquare, MessageSquare, BookOpen, Calendar } from 'lucide-react';
import PortalStatCard from '@/components/portal/PortalStatCard';
import { PortalSection } from '@/components/portal/PortalSection';
import { usePortalSession } from '@/components/portal/usePortalSession';

type TeacherDash = {
  classCount: string;
  classCountSubtext: string;
  attendanceToday: string;
  attendanceSubtext: string;
  lessonsToday: string;
  lessonsSubtext: string;
  todayClasses: { grade: string; time: string; topic: string; present: string }[];
  pendingTasks: string[];
};

export default function TeacherDashboardPage() {
  const { user, loading } = usePortalSession();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [dash, setDash] = useState<TeacherDash | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch('/api/portal/messages?unreadOnly=true')
      .then((r) => r.json())
      .then((d) => setUnreadMessages(d.count ?? 0))
      .catch(() => {});
    fetch('/api/portal/teacher/academics')
      .then((r) => r.json())
      .then((d) => setDash(d))
      .catch(() => {});
  }, [user]);

  if (loading || !user) return null;

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="sms-card p-6 border-l-4 border-l-[var(--color-nav-primary)]">
        <p className="text-sm text-[var(--color-text-muted)]">Welcome back,</p>
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">{user.department}</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <PortalStatCard label="My Classes" value={dash?.classCount || '0'} subtext={dash?.classCountSubtext} icon={BookOpen} />
        <PortalStatCard label="Attendance" value={dash?.attendanceToday || '—'} subtext={dash?.attendanceSubtext} icon={CheckSquare} tone="green" />
        <PortalStatCard label="Parent Messages" value={String(unreadMessages)} subtext="Unread" icon={MessageSquare} tone="amber" />
        <PortalStatCard label="Lessons Today" value={dash?.lessonsToday || '0'} subtext={dash?.lessonsSubtext} icon={Calendar} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <PortalSection title="Today's Classes">
          {dash?.todayClasses?.length ? (
            <ul className="divide-y divide-[var(--color-border-default)]">
              {dash.todayClasses.map((c) => (
                <li key={c.grade + c.time} className="py-3 flex justify-between items-start gap-4">
                  <div>
                    <p className="font-semibold text-sm">{c.grade}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{c.time} · {c.topic}</p>
                  </div>
                  <span className="text-xs font-medium text-[var(--color-accent-success)] bg-green-50 px-2 py-1 rounded-full">
                    {c.present}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--color-text-muted)]">No lessons scheduled for today.</p>
          )}
          <Link href="/school/portal/teacher/attendance" className="inline-block mt-4 text-sm font-semibold text-[var(--color-nav-primary)]">
            Record attendance →
          </Link>
        </PortalSection>

        <PortalSection title="Pending Tasks">
          <ul className="space-y-2 text-sm">
            {(dash?.pendingTasks || []).map((task) => (
              <li key={task} className="flex items-start gap-2 p-2 rounded-lg bg-[var(--color-bg-secondary)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-action)] mt-2 shrink-0" />
                {task}
              </li>
            ))}
          </ul>
        </PortalSection>
      </div>
    </div>
  );
}
