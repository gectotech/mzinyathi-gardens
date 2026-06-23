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
  type LucideIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { navItemsForRole, superNavForRole, hasPermission } from '@/lib/roles';

type AdminShellProps = {
  children: React.ReactNode;
  user?: { name: string; email: string; role: string } | null;
};

const NAV_ICONS: Record<string, LucideIcon> = {
  '/admin/dashboard': LayoutDashboard,
  '/admin/contacts': Mail,
  '/admin/applications': Users,
  '/admin/school-applications': GraduationCap,
  '/admin/students': Users,
  '/admin/school-content': Newspaper,
  '/admin/jobs': Briefcase,
  '/admin/properties': Home,
  '/admin/media': Image,
  '/admin/settings': Settings,
};

const SUPER_ICONS: Record<string, LucideIcon> = {
  '/admin/super': Shield,
  '/admin/super/code': Code2,
  '/admin/super/audit': ScrollText,
  '/admin/users': Users,
};

export default function AdminShell({ children, user }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const role = user?.role || 'viewer';
  const navItems = navItemsForRole(role);
  const superItems = superNavForRole(role);
  const canEditPages = hasPermission(role, 'super_pages');

  const logout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    toast.success('Logged out');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] flex">
      <aside className="w-64 bg-[var(--color-nav-primary)] text-[var(--color-text-on-nav)] flex flex-col shrink-0">
        <div className="p-5 border-b border-white/10">
          <h1 className="text-lg font-bold text-white">Mzinyathi Admin</h1>
          <p className="text-xs text-white/60 mt-1">{user?.name || 'Administrator'}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label }) => {
            const Icon = NAV_ICONS[href] || LayoutDashboard;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
                  pathname === href || pathname.startsWith(`${href}/`)
                    ? 'bg-white/20 text-white font-medium'
                    : 'text-white/75 hover:bg-white/10'
                }`}
              >
                <Icon size={18} /> {label}
              </Link>
            );
          })}
          {superItems.length > 0 && (
            <>
              <div className="pt-4 pb-2 px-3 text-xs uppercase tracking-wider text-gray-500">
                Super Admin
              </div>
              {superItems.map(({ href, label }) => {
                const Icon = SUPER_ICONS[href] || Shield;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
                      pathname === href || pathname.startsWith(`${href}/`)
                        ? 'bg-[var(--color-accent-action)] text-white'
                        : 'text-white/75 hover:bg-white/10'
                    }`}
                  >
                    <Icon size={18} /> {label}
                  </Link>
                );
              })}
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
          {canEditPages && (
            <Link
              href="/admin/super/pages/home"
              className="inline-flex items-center gap-2 text-sm sms-btn-primary"
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
