'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Legacy URL — redirects to the unified MGPS portal login. */
export default function StudentPortalRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/school/portal/login?role=student');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-secondary)]">
      <p className="text-sm text-[var(--color-text-muted)]">Redirecting to student portal…</p>
    </div>
  );
}
