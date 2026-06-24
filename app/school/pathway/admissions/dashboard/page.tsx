'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Legacy MIRA dashboard — redirects to the new student portal. */
export default function LegacyDashboardRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/school/portal/student/dashboard');
  }, [router]);
  return null;
}
