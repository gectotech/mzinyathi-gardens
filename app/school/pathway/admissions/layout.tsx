'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Home, User, Edit, CheckCircle, CreditCard,
  Mail, LogOut, Menu, ChevronRight, Sparkles
} from 'lucide-react';

const menuItems = [
  { id: 'profile', label: 'Student Profile', icon: User, href: '/school/portal/admissions/dashboard' },
  { id: 'edit', label: 'Edit Profile', icon: Edit, href: '/school/portal/admissions/dashboard' },
  { id: 'generic-quotation', label: 'Generic Quotation', icon: CheckCircle, href: '/school/portal/admissions/dashboard' },
  { id: 'invoice-quotation', label: 'Invoice/Quotation', icon: CreditCard, href: '/school/portal/admissions/dashboard' },
  { id: 'payments', label: 'Online Payments', icon: CreditCard, href: '/school/portal/admissions/dashboard' },
  { id: 'financial-statement', label: 'Financial Statement', icon: CreditCard, href: '/school/portal/admissions/dashboard' },
  { id: 'registration-history', label: 'Registration History', icon: CheckCircle, href: '/school/portal/admissions/dashboard' },
  { id: 'registration', label: 'Registration', icon: CheckCircle, href: '/school/portal/admissions/dashboard' },
  { id: 'results', label: 'Results', icon: CheckCircle, href: '/school/portal/admissions/dashboard' },
  { id: 'exam-timetable', label: 'Exam Timetable', icon: CheckCircle, href: '/school/portal/admissions/dashboard' },
  { id: 'assessment', label: 'Assessment', icon: CheckCircle, href: '/school/portal/admissions/dashboard' },
  { id: 'change-password', label: 'Change Password', icon: Edit, href: '/school/portal/admissions/dashboard' },
];

export default function AdmissionsLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [user, setUser]             = useState<any>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed]   = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('portalUser');
    if (!stored) { router.push('/school/portal'); return; }
    const parsed = JSON.parse(stored);
    if (parsed.portalType !== 'admissions') { router.push('/school/portal'); return; }
    setUser(parsed);
  }, [router]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (mobileOpen && sidebarRef.current && !sidebarRef.current.contains(e.target as Node))
        setMobileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [mobileOpen]);

  const handleLogout = () => {
    localStorage.removeItem('portalUser');
    router.push('/school/portal');
  };

  if (!user) return (
    <div className="loading-screen">
      <div className="ring" />
      <style jsx>{`.loading-screen{display:flex;align-items:center;justify-content:center;height:100vh;background:#f8f9fc}.ring{width:36px;height:36px;border:3px solid #e0e7f0;border-top-color:#0b2d6b;border-radius:50%;animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-black to-green-900">
      {children}
    </div>
  );
}