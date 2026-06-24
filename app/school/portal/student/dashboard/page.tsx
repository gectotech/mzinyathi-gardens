'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Award, Calendar, ClipboardList, Wallet, Clock, TrendingUp } from 'lucide-react';
import PortalStatCard from '@/components/portal/PortalStatCard';
import { PortalSection } from '@/components/portal/PortalSection';
import ApplicationProgressTracker from '@/components/ui/ApplicationProgressTracker';
import { usePortalSession } from '@/components/portal/usePortalSession';

type DashboardData = {
  termAverage: string;
  termAverageSubtext: string;
  assignmentsDue: string;
  assignmentsDueSubtext: string;
  nextExam: string;
  nextExamSubtext: string;
  todayLabel: string;
  todayTimetable: { time: string; subject: string; room: string }[];
  termProgress: { step: string; status: 'completed' | 'in_progress' | 'pending' }[];
};

export default function StudentDashboardPage() {
  const { user, loading } = usePortalSession();
  const [feeBalance, setFeeBalance] = useState('—');
  const [dash, setDash] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch('/api/portal/student/fees')
      .then((r) => r.json())
      .then((d) => {
        if (d.summary?.totalOutstandingCents > 0) setFeeBalance(d.summary.totalOutstanding);
        else setFeeBalance('Paid up');
      })
      .catch(() => {});
    fetch('/api/portal/student/academics')
      .then((r) => r.json())
      .then((d) => setDash(d))
      .catch(() => {});
  }, [user]);

  if (loading || !user) return null;

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="sms-card p-6 bg-gradient-to-r from-[var(--color-nav-primary)] to-[#1e40af] text-white">
        <p className="text-sm text-white/70">Good morning,</p>
        <h2 className="text-2xl font-bold mt-1">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-sm text-white/80 mt-1">
          {user.grade} · Student #{user.identifier}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <PortalStatCard label="Term Average" value={dash?.termAverage || '—'} subtext={dash?.termAverageSubtext} icon={TrendingUp} tone="green" />
        <PortalStatCard label="Assignments Due" value={dash?.assignmentsDue || '0'} subtext={dash?.assignmentsDueSubtext} icon={ClipboardList} tone="amber" />
        <PortalStatCard label="Fee Balance" value={feeBalance} subtext="Outstanding balance" icon={Wallet} tone="red" />
        <PortalStatCard label="Next Exam" value={dash?.nextExam || '—'} subtext={dash?.nextExamSubtext} icon={Calendar} tone="blue" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <PortalSection title="Today's Timetable" description={dash?.todayLabel}>
          {dash?.todayTimetable?.length ? (
            <ul className="space-y-3">
              {dash.todayTimetable.map((slot) => (
                <li key={slot.time + slot.subject} className="flex items-center gap-4 p-3 rounded-lg bg-[var(--color-bg-secondary)]">
                  <span className="text-xs font-mono font-semibold text-[var(--color-nav-primary)] w-12">{slot.time}</span>
                  <div>
                    <p className="font-medium text-sm">{slot.subject}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{slot.room}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--color-text-muted)]">No lessons scheduled for today.</p>
          )}
        </PortalSection>

        <ApplicationProgressTracker
          title="Term Progress"
          steps={dash?.termProgress?.length ? dash.termProgress : [{ step: 'No milestones yet', status: 'pending' }]}
        />
      </div>

      <PortalSection title="Quick Actions">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { href: '/school/portal/student/results', label: 'View Results', icon: Award },
            { href: '/school/portal/student/assignments', label: 'Assignments', icon: ClipboardList },
            { href: '/school/portal/student/fees', label: 'Pay Fees', icon: Wallet },
            { href: '/school/portal/student/timetable', label: 'Full Timetable', icon: Clock },
          ].map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.href}
                href={a.href}
                className="flex items-center gap-3 p-4 rounded-xl border border-[var(--color-border-default)] hover:border-[var(--color-nav-primary)] hover:bg-[var(--color-bg-secondary)] transition"
              >
                <Icon size={20} className="text-[var(--color-nav-primary)]" />
                <span className="text-sm font-medium">{a.label}</span>
              </Link>
            );
          })}
        </div>
      </PortalSection>
    </div>
  );
}
