// app/school/layout.tsx
'use client';

import { usePathname } from 'next/navigation';
import SchoolNavbar from '../../components/school/SchoolNavbar';
import SchoolFooter from '../../components/school/SchoolFooter';
import SiteEnhancements from '../../components/motion/SiteEnhancements';

export default function SchoolLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideChrome =
    pathname?.startsWith('/school/pathway') ||
    pathname?.startsWith('/school/portal') ||
    pathname?.startsWith('/school/student-portal');

  if (hideChrome) {
    return (
      <SiteEnhancements enableAmbient={false}>
        <div className="school-site min-h-screen overflow-x-hidden">{children}</div>
      </SiteEnhancements>
    );
  }

  return (
    <SiteEnhancements>
      <div className="school-site min-h-screen overflow-x-hidden">
        <SchoolNavbar />
        <main className="relative z-[1] min-h-[inherit] overflow-x-hidden">{children}</main>
        <SchoolFooter />
      </div>
    </SiteEnhancements>
  );
}
