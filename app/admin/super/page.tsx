'use client';

import Link from 'next/link';
import { FileCode2, Code2, Settings, Globe } from 'lucide-react';

const pages = [
  { slug: 'home', label: 'Home Page' },
  { slug: 'about', label: 'About Page' },
  { slug: 'contact', label: 'Contact Page' },
  { slug: 'careers', label: 'Careers Page' },
  { slug: 'properties', label: 'Properties Page' },
  { slug: 'projects', label: 'Projects Page' },
  { slug: 'services', label: 'Services Page' },
];

export default function SuperAdminHub() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Super Admin Control Center</h1>
        <p className="text-gray-600 mt-1">
          Edit page content, CSS, JavaScript, and HTML online — changes go live without an IDE.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/admin/super/code" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition border-l-4 border-red-600">
          <Code2 className="text-red-600 mb-3" size={28} />
          <h2 className="font-bold text-lg">Global Code Studio</h2>
          <p className="text-sm text-gray-600 mt-1">Edit site-wide CSS, JavaScript, and configuration JSON.</p>
        </Link>
        <Link href="/admin/users" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition border-l-4 border-[#4169E1]">
          <Settings className="text-[#4169E1] mb-3" size={28} />
          <h2 className="font-bold text-lg">User Management</h2>
          <p className="text-sm text-gray-600 mt-1">Create admins and super admins with secure credentials.</p>
        </Link>
        <Link href="/" target="_blank" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition border-l-4 border-green-600">
          <Globe className="text-green-600 mb-3" size={28} />
          <h2 className="font-bold text-lg">View Live Site</h2>
          <p className="text-sm text-gray-600 mt-1">Open the public site in a new tab to preview changes.</p>
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FileCode2 size={22} /> Live Page Editor
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => (
            <Link
              key={page.slug}
              href={`/admin/super/pages/${page.slug}`}
              className="bg-white rounded-lg shadow p-5 hover:shadow-md transition hover:border-[#4169E1] border border-transparent"
            >
              <p className="font-semibold">{page.label}</p>
              <p className="text-xs text-gray-500 mt-1">/{page.slug === 'home' ? '' : page.slug}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
