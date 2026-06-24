'use client';

import PortalShell from '@/components/portal/PortalShell';

export default function TeacherPortalLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell role="teacher">{children}</PortalShell>;
}
