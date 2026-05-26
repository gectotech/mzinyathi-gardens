'use client';

import { useEffect, useState } from 'react';
import { Mail, Users, Briefcase, Home, Image } from 'lucide-react';
import Link from 'next/link';

type Stats = {
  contacts: number;
  applications: number;
  jobs: number;
  phases: number;
  media: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentContacts, setRecentContacts] = useState<Array<Record<string, string>>>([]);
  const [recentApplications, setRecentApplications] = useState<Array<Record<string, string>>>([]);
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
    { label: 'Contact Messages', value: stats?.contacts ?? 0, icon: Mail, href: '/admin/contacts', color: 'bg-blue-600' },
    { label: 'Job Applications', value: stats?.applications ?? 0, icon: Users, href: '/admin/applications', color: 'bg-red-600' },
    { label: 'Open Jobs', value: stats?.jobs ?? 0, icon: Briefcase, href: '/admin/jobs', color: 'bg-green-600' },
    { label: 'Property Phases', value: stats?.phases ?? 0, icon: Home, href: '/admin/properties', color: 'bg-purple-600' },
    { label: 'Media Files', value: stats?.media ?? 0, icon: Image, href: '/admin/media', color: 'bg-orange-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of site activity and content</p>
      </div>

      {dbReady === false && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="font-medium text-yellow-900">Database not initialized</p>
            <p className="text-sm text-yellow-700">Set DATABASE_URL in .env.local then run setup to seed data.</p>
          </div>
          <button onClick={setupDb} className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-700">
            Initialize Database
          </button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href} className="bg-white rounded-lg shadow p-5 hover:shadow-md transition">
            <div className={`inline-flex p-2 rounded-md text-white ${color} mb-3`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-600">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b font-semibold">Recent Contact Messages</div>
          <table className="min-w-full text-sm">
            <tbody>
              {recentContacts.length === 0 ? (
                <tr><td className="px-6 py-8 text-gray-500">No messages yet</td></tr>
              ) : (
                recentContacts.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="px-6 py-3">{c.name}</td>
                    <td className="px-6 py-3 text-gray-500">{c.email}</td>
                    <td className="px-6 py-3"><span className="text-xs bg-gray-100 px-2 py-1 rounded">{c.status}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b font-semibold">Recent Applications</div>
          <table className="min-w-full text-sm">
            <tbody>
              {recentApplications.length === 0 ? (
                <tr><td className="px-6 py-8 text-gray-500">No applications yet</td></tr>
              ) : (
                recentApplications.map((a) => (
                  <tr key={a.id} className="border-t">
                    <td className="px-6 py-3">{a.fullName}</td>
                    <td className="px-6 py-3 text-gray-500">{a.jobTitle}</td>
                    <td className="px-6 py-3 font-mono text-xs">{a.trackingId}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
