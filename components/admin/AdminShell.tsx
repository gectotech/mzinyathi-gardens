'use client';

import { useState } from 'react';
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
  Menu,
  X,
  type LucideIcon,
} from 'lucide-react';

import toast from 'react-hot-toast';
import {
  navItemsForRole,
  superNavForRole,
  hasPermission,
} from '@/lib/roles';

type AdminShellProps = {
  children: React.ReactNode;
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
};

const NAV_ICONS: Record<string, LucideIcon> = {
  '/admin/dashboard': LayoutDashboard,
  '/admin/contacts': Mail,
  '/admin/applications': Users,
  '/admin/school-applications': GraduationCap,
  '/admin/students': Users,
  '/admin/school-academics': GraduationCap,
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

export default function AdminShell({
  children,
  user,
}: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = user?.role || 'viewer';

  const navItems = navItemsForRole(role);
  const superItems = superNavForRole(role);

  const canEditPages = hasPermission(
    role,
    'super_pages'
  );

  const logout = async () => {
    await fetch('/api/auth', {
      method: 'DELETE',
    });

    toast.success('Logged out');

    router.push('/admin/login');
  };

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">
            Mzinyathi Admin
          </h1>

          <p className="text-xs text-white/60 mt-1">
            {user?.name || 'Administrator'}
          </p>
        </div>

        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-white"
        >
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">

        {navItems.map(({ href, label }) => {
          const Icon =
            NAV_ICONS[href] || LayoutDashboard;

          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base transition-all duration-200 ${
                pathname === href ||
                pathname.startsWith(`${href}/`)
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <Icon size={20} />

              <span>{label}</span>
            </Link>
          );
        })}
                {superItems.length > 0 && (
          <>
            <div className="pt-6 pb-2 px-4 text-xs uppercase tracking-widest text-white/40">
              Super Admin
            </div>

            {superItems.map(({ href, label }) => {
              const Icon = SUPER_ICONS[href] || Shield;

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base transition-all duration-200 ${
                    pathname === href ||
                    pathname.startsWith(`${href}/`)
                      ? 'bg-[var(--color-accent-action)] text-white font-semibold'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <Icon size={20} />

                  <span>{label}</span>
                </Link>
              );
            })}
          </>
        )}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-base text-white transition hover:bg-red-500"
        >
          <LogOut size={20} />

          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[var(--color-bg-secondary)]">

      {/* Mobile Overlay */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-72 flex-col bg-[var(--color-nav-primary)] shadow-2xl transition-transform duration-300 lg:hidden ${
          sidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}

      <aside className="hidden w-72 shrink-0 flex-col bg-[var(--color-nav-primary)] lg:flex">
        <SidebarContent />
      </aside>

      {/* Main Content */}

      <div className="flex min-w-0 flex-1 flex-col">

        <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-white px-4 py-4 md:px-6">

          <div className="flex items-center gap-4">

            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
            >
              <Menu size={26} />
            </button>

            <div>
              <p className="text-sm text-gray-500">
                Signed in as
              </p>

              <p className="max-w-[180px] truncate font-medium text-gray-900 sm:max-w-sm">
                {user?.email}
              </p>
            </div>
          </div>

          {canEditPages && (
            <Link
              href="/admin/super/pages/home"
              className="hidden items-center gap-2 rounded-xl bg-[var(--color-accent-action)] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 md:inline-flex"
            >
              <FileCode2 size={18} />

              Live Page Editor
            </Link>
          )}
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">

        {children}
        </main>
      </div>
    </div>
  );
}