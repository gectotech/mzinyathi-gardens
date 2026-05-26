'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileCode2, Code2, Settings, Globe, ScrollText } from 'lucide-react';

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

export default function SuperAdminHub() {
  const [pageStatuses, setPageStatuses] = useState<Record<string, PageStatus>>({});

  useEffect(() => {
    fetch('/api/super/pages')
      .then((r) => r.json())
      .then((d) => {
        const map: Record<string, PageStatus> = {};
        (d.pages || []).forEach((p: PageStatus) => {
          map[p.slug] = p;
        });
        setPageStatuses(map);
      });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Super Admin Control Center</h1>
        <p className="text-gray-600 mt-1">
          Draft, preview, and publish page content and global code — changes go live instantly when published.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/super/code" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition border-l-4 border-red-600">
          <Code2 className="text-red-600 mb-3" size={28} />
          <h2 className="font-bold text-lg">Global Code Studio</h2>
          <p className="text-sm text-gray-600 mt-1">CSS, JavaScript, and config with live preview and draft/publish.</p>
        </Link>
        <Link href="/admin/super/audit" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition border-l-4 border-purple-600">
          <ScrollText className="text-purple-600 mb-3" size={28} />
          <h2 className="font-bold text-lg">Audit Log</h2>
          <p className="text-sm text-gray-600 mt-1">Track who published or saved drafts and when.</p>
        </Link>
        <Link href="/admin/users" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition border-l-4 border-[#4169E1]">
          <Settings className="text-[#4169E1] mb-3" size={28} />
          <h2 className="font-bold text-lg">User Management</h2>
          <p className="text-sm text-gray-600 mt-1">Create admins and super admins with secure credentials.</p>
        </Link>
        <Link href="/" target="_blank" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition border-l-4 border-green-600">
          <Globe className="text-green-600 mb-3" size={28} />
          <h2 className="font-bold text-lg">View Live Site</h2>
          <p className="text-sm text-gray-600 mt-1">Open the public site in a new tab.</p>
        </Link>
      </div>

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
                  <p className="text-xs text-gray-400 mt-2">v{status.version} · {status.updatedAt ? new Date(status.updatedAt).toLocaleDateString() : 'never edited'}</p>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
