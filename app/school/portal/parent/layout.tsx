'use client';

import PortalShell from '@/components/portal/PortalShell';

export default function ParentPortalLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell role="parent">{children}</PortalShell>;
}
