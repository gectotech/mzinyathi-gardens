'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Mail, Users, GraduationCap, Briefcase, Home, Image, Eye, ArrowRight } from 'lucide-react';
import StatusBadge from '@/components/admin/StatusBadge';

type Stats = {
  contacts: number;
  applications: number;
  schoolApplications: number;
  jobs: number;
  phases: number;
  houses?: number;
  media: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentContacts, setRecentContacts] = useState<Array<Record<string, string>>>([]);
  const [recentApplications, setRecentApplications] = useState<Array<Record<string, string>>>([]);
  const [recentSchoolApplications, setRecentSchoolApplications] = useState<Array<Record<string, string>>>([]);
  const [dbReady, setDbReady] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/setup')
      .then((r) => r.json())
      .then((d) => setDbReady(d.initialized))
      .catch(() => setDbReady(false));

    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => {
        if (d.stats) {
          setStats(d.stats);
          setRecentContacts(d.recentContacts || []);
          setRecentApplications(d.recentApplications || []);
          setRecentSchoolApplications(d.recentSchoolApplications || []);
        }
      })
      .catch(() => {});
  }, []);

  const setupDb = async () => {
    const res = await fetch('/api/setup', { method: 'POST' });
    const data = await res.json();
    if (res.ok) {
      alert(data.message || 'Database initialized');
      window.location.reload();
    } else {
      alert(data.error || 'Setup failed. Check DATABASE_URL in .env.local');
    }
  };

  const cards = [
    { label: 'Contact Messages', value: stats?.contacts ?? 0, icon: Mail, href: '/admin/contacts', color: 'from-blue-600 to-blue-700' },
    { label: 'Job Applications', value: stats?.applications ?? 0, icon: Users, href: '/admin/applications', color: 'from-red-600 to-red-700' },
    { label: 'School Admissions', value: stats?.schoolApplications ?? 0, icon: GraduationCap, href: '/admin/school-applications', color: 'from-teal-600 to-teal-700' },
    { label: 'Open Jobs', value: stats?.jobs ?? 0, icon: Briefcase, href: '/admin/jobs', color: 'from-green-600 to-green-700' },
    { label: 'Property Phases', value: stats?.phases ?? 0, icon: Home, href: '/admin/properties', color: 'from-purple-600 to-purple-700' },
    { label: 'Media Files', value: stats?.media ?? 0, icon: Image, href: '/admin/media', color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of site activity — click View to open full details</p>
        </div>
        <Link
          href="/admin/super/pages/home"
          className="inline-flex items-center gap-2 text-sm bg-[#4169E1] text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Edit page content
        </Link>
      </div>

      {dbReady === false && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="font-medium text-amber-900">Database not initialized</p>
            <p className="text-sm text-amber-700">Set DATABASE_URL in .env.local then run setup to seed data.</p>
          </div>
          <button onClick={setupDb} className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-700">
            Initialize Database
          </button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="group bg-white rounded-xl shadow-sm border p-5 hover:shadow-md hover:border-[#4169E1]/30 transition"
          >
            <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${color} text-white mb-3 group-hover:scale-105 transition`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-600">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <RecentPanel
          title="Recent Contact Messages"
          href="/admin/contacts"
          empty="No messages yet"
          rows={recentContacts.map((c) => ({
            id: c.id,
            primary: c.name,
            secondary: c.email,
            meta: c.status,
            href: '/admin/contacts',
          }))}
        />
        <RecentPanel
          title="Recent Job Applications"
          href="/admin/applications"
          empty="No job applications yet"
          rows={recentApplications.map((a) => ({
            id: a.id,
            primary: a.fullName,
            secondary: a.jobTitle || '',
            meta: a.trackingId,
            href: '/admin/applications',
          }))}
        />
      </div>

      <RecentPanel
        title="Recent School Admissions"
        href="/admin/school-applications"
        empty="No school applications yet"
        rows={recentSchoolApplications.map((a) => ({
          id: a.id,
          primary: `${a.firstName} ${a.surname}`,
          secondary: a.gradeApplying,
          meta: a.trackingId,
          href: '/admin/school-applications',
        }))}
      />
    </div>
  );
}

function RecentPanel({
  title,
  href,
  empty,
  rows,
}: {
  title: string;
  href: string;
  empty: string;
  rows: { id: string; primary: string; secondary: string; meta: string; href: string }[];
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="px-5 py-4 border-b flex items-center justify-between bg-slate-50/80">
        <h2 className="font-semibold text-gray-900">{title}</h2>
        <Link href={href} className="text-xs text-[#4169E1] hover:underline inline-flex items-center gap-1">
          View all <ArrowRight size={12} />
        </Link>
      </div>
      {rows.length === 0 ? (
        <p className="px-5 py-10 text-center text-gray-500 text-sm">{empty}</p>
      ) : (
        <ul className="divide-y">
          {rows.map((row) => (
            <li key={row.id} className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition">
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{row.primary}</p>
                <p className="text-xs text-gray-500 truncate">{row.secondary}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {['new', 'submitted', 'under_review', 'read', 'replied', 'accepted'].includes(row.meta) ? (
                  <StatusBadge status={row.meta} />
                ) : (
                  <span className="text-xs font-mono text-gray-400">{row.meta}</span>
                )}
                <Link
                  href={row.href}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#4169E1] bg-blue-50 px-2.5 py-1.5 rounded-lg hover:bg-blue-100"
                >
                  <Eye size={12} /> View
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
