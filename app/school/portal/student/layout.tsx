'use client';

import PortalShell from '@/components/portal/PortalShell';

export default function StudentPortalLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell role="student">{children}</PortalShell>;
}
