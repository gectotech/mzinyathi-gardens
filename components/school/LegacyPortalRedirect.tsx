'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

type LegacyPortalRedirectProps = {
  href: string;
  label?: string;
};

export default function LegacyPortalRedirect({ href, label = 'Redirecting…' }: LegacyPortalRedirectProps) {
  const router = useRouter();
  useEffect(() => {
    router.replace(href);
  }, [href, router]);

  return (
    <div className="min-h-[40vh] flex items-center justify-center bg-[var(--color-bg-secondary)]">
      <p className="text-sm text-[var(--color-text-muted)]">{label}</p>
    </div>
  );
}
