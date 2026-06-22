'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Mail,
  Users,
  Briefcase,
  GraduationCap,
  Home,
  Image,
  Newspaper,
  Settings,
  Code2,
  Shield,
  LogOut,
  FileCode2,
  ScrollText,
} from 'lucide-react';
import toast from 'react-hot-toast';

type AdminShellProps = {
  children: React.ReactNode;
  user?: { name: string; email: string; role: string } | null;
};

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/contacts', label: 'Contacts', icon: Mail },
  { href: '/admin/applications', label: 'Job Applications', icon: Users },
  { href: '/admin/school-applications', label: 'School Admissions', icon: GraduationCap },
  { href: '/admin/school-content', label: 'School Content', icon: Newspaper },
  { href: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/admin/properties', label: 'Properties', icon: Home },
  { href: '/admin/media', label: 'Media Library', icon: Image },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

const superNavItems = [
  { href: '/admin/super', label: 'Super Admin', icon: Shield },
  { href: '/admin/super/code', label: 'Code Studio', icon: Code2 },
  { href: '/admin/super/audit', label: 'Audit Log', icon: ScrollText },
  { href: '/admin/users', label: 'Users', icon: Users },
];

export default function AdminShell({ children, user }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isSuper = user?.role === 'super_admin';

  const logout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    toast.success('Logged out');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-[#1a1a2e] text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-white/10">
          <h1 className="text-lg font-bold text-[#4169E1]">Mzinyathi Admin</h1>
          <p className="text-xs text-gray-400 mt-1">{user?.name || 'Administrator'}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
                pathname === href || pathname.startsWith(`${href}/`)
                  ? 'bg-[#4169E1] text-white'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <Icon size={18} /> {label}
            </Link>
          ))}
          {isSuper && (
            <>
              <div className="pt-4 pb-2 px-3 text-xs uppercase tracking-wider text-gray-500">
                Super Admin
              </div>
              {superNavItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
                    pathname === href || pathname.startsWith(`${href}/`)
                      ? 'bg-red-600 text-white'
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Icon size={18} /> {label}
                </Link>
              ))}
            </>
          )}
        </nav>
        <button
          onClick={logout}
          className="m-3 flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-white/10"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Signed in as</p>
            <p className="font-medium text-gray-900">{user?.email}</p>
          </div>
          {isSuper && (
            <Link
              href="/admin/super/pages/home"
              className="inline-flex items-center gap-2 text-sm bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              <FileCode2 size={16} /> Live Page Editor
            </Link>
          )}
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
