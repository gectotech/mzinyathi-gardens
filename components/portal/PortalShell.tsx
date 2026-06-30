'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Menu, X, ChevronLeft, Home } from 'lucide-react';
import {
  getPortalUser,
  setPortalUser,
  clearPortalUser,
  userInitials,
  roleLabel,
  type PortalRole,
  type PortalUser,
} from '@/lib/portal-auth';
import { navForRole } from '@/lib/portal-navigation';

type PortalShellProps = {
  role: PortalRole;
  children: ReactNode;
  title?: string;
};

export default function PortalShell({ role, children, title }: PortalShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<PortalUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    fetch('/api/portal/auth')
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          if (d.user.role !== role) {
            router.replace(`/school/portal/login?role=${role}`);
            return;
          }
          setUser(d.user);
          setPortalUser(d.user);
        } else {
          const cached = getPortalUser();
          if (cached?.role === role) setUser(cached);
          else router.replace(`/school/portal/login?role=${role}`);
        }
      })
      .catch(() => router.replace(`/school/portal/login?role=${role}`));
  }, [role, router]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/portal/messages?unreadOnly=true')
      .then((r) => r.json())
      .then((d) => setUnreadMessages(d.count ?? 0))
      .catch(() => {});
  }, [user]);

  const logout = async () => {
    await fetch('/api/portal/auth', { method: 'DELETE' });
    clearPortalUser();
    router.push('/school/portal');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-secondary)]">
        <div className="h-9 w-9 rounded-full border-2 border-[var(--color-nav-primary)] border-t-transparent animate-spin" />
      </div>
    );
  }

  const nav = navForRole(role).map((item) =>
    item.id === 'messages' && unreadMessages > 0
      ? { ...item, badge: String(unreadMessages) }
      : item.id === 'messages'
      ? { ...item, badge: undefined }
      : item
  );
  const initials = userInitials(user);

  return (
    <div className="min-h-screen flex bg-[var(--color-bg-secondary)]">
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 z-50 h-screen flex flex-col bg-[var(--color-nav-primary)] text-white transition-all duration-300 ${
          collapsed ? 'w-[72px]' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0 overflow-hidden">
            <Image src="/images/slo.png" alt="MGPS" width={28} height={28} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-bold text-sm leading-tight">MGPS Portal</p>
              <p className="text-[10px] text-white/60 uppercase tracking-wider">{roleLabel(role)}</p>
            </div>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="ml-auto hidden lg:flex p-1.5 rounded-lg hover:bg-white/10"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft size={16} className={`transition ${collapsed ? 'rotate-180' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="ml-auto lg:hidden p-1.5 rounded-lg hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-3">
          <div className={`flex items-center gap-3 p-2 rounded-xl bg-white/10 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-9 h-9 rounded-full bg-[var(--color-accent-action)] flex items-center justify-center text-xs font-bold shrink-0">
              {initials}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-[11px] text-white/60 truncate">{user.identifier}</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  active ? 'bg-white text-[var(--color-nav-primary)] font-semibold' : 'text-white/80 hover:bg-white/10'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-bold bg-[var(--color-accent-action)] text-white px-1.5 py-0.5 rounded-full pulse-attention">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-1">
          <Link
            href="/school"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/10 ${collapsed ? 'justify-center' : ''}`}
          >
            <Home size={16} />
            {!collapsed && <span>School Website</span>}
          </Link>
          <button
            type="button"
            onClick={logout}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/10 ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={16} />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-[var(--color-bg-primary)] border-b border-[var(--color-border-default)] px-4 lg:px-8 py-4 flex items-center gap-4">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden touch-target p-2 rounded-lg border border-[var(--color-border-default)]"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-[var(--color-text-primary)] truncate">
              {title || nav.find((n) => pathname.startsWith(n.href))?.label || 'Dashboard'}
            </h1>
            <p className="text-xs text-[var(--color-text-muted)] hidden sm:block">
              Mzinyathi Gardens Preparatory School · {roleLabel(role)} Portal
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] px-3 py-1.5 rounded-full border border-[var(--color-border-default)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent-success)]" />
            Academic Year 2026
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden overflow-y-auto portal-main-content">{children}</main>
      </div>
    </div>
  );
}
