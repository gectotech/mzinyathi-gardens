'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Baby, Wallet, MessageSquare, FileText } from 'lucide-react';
import PortalStatCard from '@/components/portal/PortalStatCard';
import { PortalSection } from '@/components/portal/PortalSection';
import ApplicationProgressTracker from '@/components/ui/ApplicationProgressTracker';
import { usePortalSession } from '@/components/portal/usePortalSession';

export default function ParentDashboardPage() {
  const { user, loading } = usePortalSession();
  const [openApplications, setOpenApplications] = useState(0);
  const [feesDue, setFeesDue] = useState('—');
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [childProgress, setChildProgress] = useState<{ title: string; steps: { step: string; status: 'completed' | 'in_progress' | 'pending' }[] }>({ title: 'Term Progress', steps: [] });
  const [upcomingEvents, setUpcomingEvents] = useState<{ date: string; event: string; meta?: string }[]>([]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/portal/parent/applications')
      .then((r) => r.json())
      .then((d) => {
        if (d.applications) {
          const open = d.applications.filter(
            (a: { status: string }) => !['accepted', 'rejected'].includes(a.status)
          ).length;
          setOpenApplications(open);
        }
      })
      .catch(() => {});

    fetch('/api/portal/parent/fees')
      .then((r) => r.json())
      .then((d) => {
        if (d.summary?.totalOutstanding) setFeesDue(d.summary.totalOutstanding);
        else setFeesDue('USD 0');
      })
      .catch(() => {});
    fetch('/api/portal/messages?unreadOnly=true')
      .then((r) => r.json())
      .then((d) => setUnreadMessages(d.count ?? 0))
      .catch(() => {});
    fetch('/api/portal/parent/dashboard')
      .then((r) => r.json())
      .then((d) => {
        if (d.childProgress) setChildProgress(d.childProgress);
        if (d.upcomingEvents) setUpcomingEvents(d.upcomingEvents);
      })
      .catch(() => {});
  }, [user]);

  if (loading || !user) return null;

  const children = user.children || [];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="sms-card p-6">
        <p className="text-sm text-[var(--color-text-muted)]">Parent / Guardian</p>
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Managing {children.length} learner{children.length !== 1 ? 's' : ''} · ID {user.identifier}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <PortalStatCard label="Children" value={String(children.length)} icon={Baby} />
        <PortalStatCard label="Total Fees Due" value={feesDue} subtext="Across linked learners" icon={Wallet} tone="amber" />
        <PortalStatCard label="Unread Messages" value={String(unreadMessages)} icon={MessageSquare} tone="red" />
        <PortalStatCard label="Open Applications" value={String(openApplications)} icon={FileText} tone="green" />
      </div>

      <PortalSection title="My Children" description="Quick overview of each learner">
        <div className="grid sm:grid-cols-2 gap-4">
          {children.map((child) => (
            <div key={child.studentNumber} className="p-4 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-secondary)]">
              <p className="font-semibold">{child.name}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">{child.grade}</p>
              <p className="text-xs font-mono text-[var(--color-text-muted)] mt-1">{child.studentNumber}</p>
              <div className="flex gap-2 mt-3">
                <Link
                  href="/school/portal/parent/fees"
                  className="text-xs font-semibold text-[var(--color-nav-primary)] hover:underline"
                >
                  Fees
                </Link>
                <Link
                  href="/school/portal/parent/messages"
                  className="text-xs font-semibold text-[var(--color-nav-primary)] hover:underline"
                >
                  Messages
                </Link>
              </div>
            </div>
          ))}
        </div>
      </PortalSection>

      <div className="grid lg:grid-cols-2 gap-6">
        <ApplicationProgressTracker
          title={childProgress.title}
          steps={childProgress.steps.length ? childProgress.steps : [{ step: 'No milestones yet', status: 'pending' }]}
        />

        <PortalSection title="Upcoming Events">
          {upcomingEvents.length ? (
            <ul className="space-y-3 text-sm">
              {upcomingEvents.map((e) => (
                <li key={e.event} className="flex gap-3 items-start">
                  <span className="text-xs font-bold text-[var(--color-nav-primary)] w-16 shrink-0">{e.date}</span>
                  <div>
                    <span className="font-medium">{e.event}</span>
                    {e.meta && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{e.meta}</p>}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--color-text-muted)]">No upcoming events published.</p>
          )}
          <Link href="/school/portal/parent/calendar" className="inline-block mt-4 text-sm font-semibold text-[var(--color-nav-primary)]">
            Full calendar →
          </Link>
        </PortalSection>
      </div>
    </div>
  );
}
