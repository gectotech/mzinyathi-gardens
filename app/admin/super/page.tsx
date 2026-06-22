'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileCode2,
  Code2,
  Settings,
  Globe,
  ScrollText,
  Home,
  Image,
  GraduationCap,
  Users,
  Mail,
  LayoutDashboard,
} from 'lucide-react';
import { hasPermission } from '@/lib/roles';

const pages = [
  { slug: 'home', label: 'Home Page' },
  { slug: 'about', label: 'About Page' },
  { slug: 'contact', label: 'Contact Page' },
  { slug: 'careers', label: 'Careers Page' },
  { slug: 'properties', label: 'Properties Page' },
  { slug: 'projects', label: 'Projects Page' },
  { slug: 'services', label: 'Services Page' },
  { slug: 'faq', label: 'FAQ Page' },
];

type PageStatus = {
  slug: string;
  status: string;
  version: number;
  updatedAt?: string;
};

type Stats = {
  contacts?: number;
  applications?: number;
  schoolApplications?: number;
  houses?: number;
};

export default function SuperAdminHub() {
  const [pageStatuses, setPageStatuses] = useState<Record<string, PageStatus>>({});
  const [stats, setStats] = useState<Stats>({});
  const [role, setRole] = useState('super_admin');

  useEffect(() => {
    fetch('/api/auth')
      .then((r) => r.json())
      .then((d) => setRole(d.user?.role || 'super_admin'));

    fetch('/api/super/pages')
      .then((r) => r.json())
      .then((d) => {
        const map: Record<string, PageStatus> = {};
        (d.pages || []).forEach((p: PageStatus) => {
          map[p.slug] = p;
        });
        setPageStatuses(map);
      });

    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => setStats(d.stats || d))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Super Admin Control Center</h1>
        <p className="text-gray-600 mt-1">
          Manage pages, properties, users, and site-wide settings from one place.
        </p>
      </div>

      {(stats.contacts !== undefined || stats.houses !== undefined) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.contacts !== undefined && (
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
              <p className="text-2xl font-bold">{stats.contacts}</p>
              <p className="text-xs text-gray-500">Contact inquiries</p>
            </div>
          )}
          {stats.applications !== undefined && (
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
              <p className="text-2xl font-bold">{stats.applications}</p>
              <p className="text-xs text-gray-500">Job applications</p>
            </div>
          )}
          {stats.schoolApplications !== undefined && (
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
              <p className="text-2xl font-bold">{stats.schoolApplications}</p>
              <p className="text-xs text-gray-500">School admissions</p>
            </div>
          )}
          {stats.houses !== undefined && (
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
              <p className="text-2xl font-bold">{stats.houses}</p>
              <p className="text-xs text-gray-500">Listed houses</p>
            </div>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {hasPermission(role, 'super_code') && (
          <Link href="/admin/super/code" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition border-l-4 border-red-600">
            <Code2 className="text-red-600 mb-3" size={28} />
            <h2 className="font-bold text-lg">Global Code Studio</h2>
            <p className="text-sm text-gray-600 mt-1">CSS, JavaScript, and config with live preview and draft/publish.</p>
          </Link>
        )}
        {hasPermission(role, 'super_audit') && (
          <Link href="/admin/super/audit" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition border-l-4 border-purple-600">
            <ScrollText className="text-purple-600 mb-3" size={28} />
            <h2 className="font-bold text-lg">Audit Log</h2>
            <p className="text-sm text-gray-600 mt-1">Track who published or saved drafts and when.</p>
          </Link>
        )}
        {hasPermission(role, 'users') && (
          <Link href="/admin/users" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition border-l-4 border-[#4169E1]">
            <Users className="text-[#4169E1] mb-3" size={28} />
            <h2 className="font-bold text-lg">User Management</h2>
            <p className="text-sm text-gray-600 mt-1">Create staff with property, school, content, or admin roles.</p>
          </Link>
        )}
        {hasPermission(role, 'properties') && (
          <Link href="/admin/properties" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition border-l-4 border-green-600">
            <Home className="text-green-600 mb-3" size={28} />
            <h2 className="font-bold text-lg">Properties & Prices</h2>
            <p className="text-sm text-gray-600 mt-1">Edit phases, house prices, images, and availability.</p>
          </Link>
        )}
        {hasPermission(role, 'media') && (
          <Link href="/admin/media" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition border-l-4 border-amber-500">
            <Image className="text-amber-600 mb-3" size={28} />
            <h2 className="font-bold text-lg">Media Library</h2>
            <p className="text-sm text-gray-600 mt-1">Upload and manage images for properties and school.</p>
          </Link>
        )}
        {hasPermission(role, 'school_content') && (
          <Link href="/admin/school-content" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition border-l-4 border-indigo-500">
            <GraduationCap className="text-indigo-600 mb-3" size={28} />
            <h2 className="font-bold text-lg">School Content</h2>
            <p className="text-sm text-gray-600 mt-1">News, activities, and gallery for the school portal.</p>
          </Link>
        )}
        {hasPermission(role, 'contacts') && (
          <Link href="/admin/contacts" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition border-l-4 border-cyan-500">
            <Mail className="text-cyan-600 mb-3" size={28} />
            <h2 className="font-bold text-lg">Contact Inbox</h2>
            <p className="text-sm text-gray-600 mt-1">Reply via email, WhatsApp, or phone.</p>
          </Link>
        )}
        {hasPermission(role, 'settings') && (
          <Link href="/admin/settings" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition border-l-4 border-gray-500">
            <Settings className="text-gray-600 mb-3" size={28} />
            <h2 className="font-bold text-lg">Site Settings</h2>
            <p className="text-sm text-gray-600 mt-1">Contact details, social links, and global config.</p>
          </Link>
        )}
        <Link href="/admin/dashboard" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition border-l-4 border-slate-500">
          <LayoutDashboard className="text-slate-600 mb-3" size={28} />
          <h2 className="font-bold text-lg">Dashboard</h2>
          <p className="text-sm text-gray-600 mt-1">Overview of recent activity and quick actions.</p>
        </Link>
        <Link href="/" target="_blank" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition border-l-4 border-green-600">
          <Globe className="text-green-600 mb-3" size={28} />
          <h2 className="font-bold text-lg">View Live Site</h2>
          <p className="text-sm text-gray-600 mt-1">Open the public site in a new tab.</p>
        </Link>
      </div>

      {hasPermission(role, 'super_pages') && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FileCode2 size={22} /> Live Page Editor
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map((page) => {
              const status = pageStatuses[page.slug];
              return (
                <Link
                  key={page.slug}
                  href={`/admin/super/pages/${page.slug}`}
                  className="bg-white rounded-lg shadow p-5 hover:shadow-md transition hover:border-[#4169E1] border border-transparent"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold">{page.label}</p>
                    {status && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                          status.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {status.status}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">/{page.slug === 'home' ? '' : page.slug}</p>
                  {status && (
                    <p className="text-xs text-gray-400 mt-2">
                      v{status.version} · {status.updatedAt ? new Date(status.updatedAt).toLocaleDateString() : 'never edited'}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
