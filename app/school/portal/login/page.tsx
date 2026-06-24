'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { GraduationCap, Users, Baby, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import {
  setPortalUser,
  DEMO_ACCOUNTS,
  roleLabel,
  type PortalRole,
} from '@/lib/portal-auth';
import { portalBasePath } from '@/lib/portal-navigation';

const ROLES: { role: PortalRole; icon: typeof GraduationCap; desc: string }[] = [
  { role: 'student', icon: GraduationCap, desc: 'Results, timetable, assignments & fees' },
  { role: 'teacher', icon: Users, desc: 'Classes, attendance, grades & messaging' },
  { role: 'parent', icon: Baby, desc: 'Children, applications, fees & notices' },
];

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get('role') as PortalRole) || 'student';
  const [role, setRole] = useState<PortalRole>(
    ['student', 'teacher', 'parent'].includes(initialRole) ? initialRole : 'student'
  );
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const demo = DEMO_ACCOUNTS[role];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/portal/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setPortalUser(data.user);
      setSuccess(true);
      setTimeout(() => router.push(`${portalBasePath(role)}/dashboard`), 700);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setIdentifier(demo.identifier);
    setPassword(demo.password);
    setError('');
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg-secondary)] flex flex-col">
      <div className="p-4">
        <Link
          href="/school/portal"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-nav-primary)]"
        >
          <ArrowLeft size={16} /> Back to portal home
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-nav-primary-muted)] mb-4">
              <Image src="/images/slo.png" alt="MGPS" width={40} height={40} />
            </div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Sign in to MGPS Portal</h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-2">Secure access for students, teachers & parents</p>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-6">
            {ROLES.map(({ role: r, icon: Icon, desc }) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRole(r);
                  setIdentifier('');
                  setPassword('');
                  setError('');
                }}
                className={`p-3 rounded-xl border text-center transition ${
                  role === r
                    ? 'border-[var(--color-nav-primary)] bg-white shadow-sm ring-2 ring-[var(--color-nav-primary)]/20'
                    : 'border-[var(--color-border-default)] bg-white hover:border-[var(--color-nav-primary)]/40'
                }`}
              >
                <Icon
                  size={22}
                  className={`mx-auto mb-1 ${role === r ? 'text-[var(--color-nav-primary)]' : 'text-[var(--color-text-muted)]'}`}
                />
                <span className="text-xs font-semibold text-[var(--color-text-primary)] capitalize">{r}</span>
              </button>
            ))}
          </div>

          <p className="text-xs text-center text-[var(--color-text-muted)] mb-4 -mt-2">
            {ROLES.find((r) => r.role === role)?.desc}
          </p>

          {success ? (
            <div className="sms-card p-8 text-center">
              <CheckCircle size={48} className="mx-auto text-[var(--color-accent-success)] mb-3" />
              <p className="font-semibold">Welcome back!</p>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">Redirecting to your dashboard…</p>
            </div>
          ) : (
            <form onSubmit={submit} className="sms-card p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">
                  {role === 'student' ? 'Student Number' : 'Email Address'}
                </label>
                <input
                  className="sms-input w-full"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={role === 'student' ? 'MGP260001A' : 'you@email.com'}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="sms-input w-full pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-[var(--color-accent-action)] bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button type="submit" disabled={loading} className="sms-btn-primary w-full disabled:opacity-60">
                {loading ? 'Signing in…' : `Sign in as ${roleLabel(role)}`}
              </button>

              <div className="pt-3 border-t border-[var(--color-border-default)]">
                <p className="text-xs text-[var(--color-text-muted)] mb-2">Demo credentials ({role}):</p>
                <button
                  type="button"
                  onClick={fillDemo}
                  className="w-full text-left text-xs bg-[var(--color-bg-secondary)] rounded-lg px-3 py-2 font-mono text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-muted)]"
                >
                  {demo.identifier} · {demo.password}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

export default function PortalLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-bg-secondary)]" />}>
      <LoginContent />
    </Suspense>
  );
}
