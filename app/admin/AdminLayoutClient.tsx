'use client';

import { usePathname } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import { useEffect, useState } from 'react';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    if (pathname === '/admin/login') return;
    fetch('/api/auth')
      .then((r) => r.json())
      .then((d) => setUser(d.user || null))
      .catch(() => setUser(null));
  }, [pathname]);

  if (pathname === '/admin/login' || pathname.startsWith('/admin/super/preview/')) {
    return <>{children}</>;
  }

  return <AdminShell user={user}>{children}</AdminShell>;
}
