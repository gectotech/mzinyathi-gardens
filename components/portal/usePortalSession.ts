'use client';

import { useEffect, useState } from 'react';
import { getPortalUser, setPortalUser, type PortalUser } from '@/lib/portal-auth';

export function usePortalSession() {
  const [user, setUser] = useState<PortalUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/portal/auth')
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setUser(d.user);
          setPortalUser(d.user);
        } else {
          const cached = getPortalUser();
          if (cached) setUser(cached);
        }
      })
      .catch(() => {
        const cached = getPortalUser();
        if (cached) setUser(cached);
      })
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}
