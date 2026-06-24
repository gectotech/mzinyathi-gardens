'use client';

import Link from 'next/link';
import Image from 'next/image';
import { GraduationCap, Users, Baby, Briefcase, Search, ArrowRight, FileText } from 'lucide-react';
import AdmissionsLandingHub from '@/components/school/AdmissionsLandingHub';

const PORTALS = [
  {
    role: 'student',
    title: 'Student Portal',
    desc: 'View results, timetables, assignments, and pay school fees online.',
    href: '/school/portal/login?role=student',
    icon: GraduationCap,
    color: 'border-blue-200 bg-blue-50/50 hover:border-[var(--color-nav-primary)]',
    iconColor: 'text-[var(--color-nav-primary)] bg-blue-100',
  },
  {
    role: 'teacher',
    title: 'Teacher Portal',
    desc: 'Manage classes, record attendance, enter grades, and message parents.',
    href: '/school/portal/login?role=teacher',
    icon: Users,
    color: 'border-indigo-200 bg-indigo-50/50 hover:border-indigo-600',
    iconColor: 'text-indigo-700 bg-indigo-100',
  },
  {
    role: 'parent',
    title: 'Parent Portal',
    desc: 'Track your children, applications, fee balances, and school notices.',
    href: '/school/portal/login?role=parent',
    icon: Baby,
    color: 'border-emerald-200 bg-emerald-50/50 hover:border-emerald-600',
    iconColor: 'text-emerald-700 bg-emerald-100',
  },
];

export default function PortalHubPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-secondary)]">
      {/* Hero */}
      <section className="bg-[var(--color-nav-primary)] text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
            <div className="max-w-xl">
              <Link href="/school" className="text-sm text-white/70 hover:text-white mb-6 inline-block">
                ← Back to school website
              </Link>
              <div className="flex items-center gap-3 mb-6">
                <Image src="/images/slo.png" alt="MGPS" width={48} height={48} className="rounded-xl" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/60">Mzinyathi Gardens</p>
                  <h1 className="text-3xl lg:text-4xl font-bold">School Portal</h1>
                </div>
              </div>
              <p className="text-lg text-white/85 leading-relaxed">
                One professional hub for students, teachers, and parents — built for clarity, security, and everyday school life.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:w-80">
              {[
                { label: 'Students enrolled', value: '1,000+' },
                { label: 'Portal uptime', value: '99.9%' },
                { label: 'Academic year', value: '2026' },
                { label: 'Support', value: '24/7' },
              ].map((s) => (
                <div key={s.label} className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-white/60 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Role portals */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 pb-12">
        <div className="grid md:grid-cols-3 gap-6">
          {PORTALS.map((p) => {
            const Icon = p.icon;
            return (
              <Link
                key={p.role}
                href={p.href}
                className={`sms-card p-6 block transition shadow-md hover:shadow-lg ${p.color}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${p.iconColor}`}>
                  <Icon size={24} />
                </div>
                <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">{p.title}</h2>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">{p.desc}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-nav-primary)]">
                  Sign in <ArrowRight size={16} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Applicants */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">New applicants</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6">
          Not enrolled yet? Apply for admission or careers, or track an existing application.
        </p>
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <Link href="/school/admissions" className="sms-card p-5 hover:shadow-md transition group">
            <FileText className="text-[var(--color-nav-primary)] mb-3" size={24} />
            <h3 className="font-semibold group-hover:text-[var(--color-nav-primary)]">Apply for Admission</h3>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">2027 intake · ECD to Grade 7</p>
          </Link>
          <Link href="/school/careers" className="sms-card p-5 hover:shadow-md transition group">
            <Briefcase className="text-[var(--color-nav-primary)] mb-3" size={24} />
            <h3 className="font-semibold group-hover:text-[var(--color-nav-primary)]">Careers Application</h3>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Join our teaching & staff team</p>
          </Link>
          <Link href="/school/track-application" className="sms-card p-5 hover:shadow-md transition group">
            <Search className="text-[var(--color-nav-primary)] mb-3" size={24} />
            <h3 className="font-semibold group-hover:text-[var(--color-nav-primary)]">Track Application</h3>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Check status with your tracking ID</p>
          </Link>
        </div>

        <div className="rounded-2xl overflow-hidden border border-[var(--color-border-default)] shadow-sm">
          <AdmissionsLandingHub />
        </div>
      </section>

      <footer className="border-t border-[var(--color-border-default)] bg-white py-8 text-center text-xs text-[var(--color-text-muted)]">
        MGPS · Mzinyathi Gardens Preparatory School · Zimbabwe
      </footer>
    </main>
  );
}
