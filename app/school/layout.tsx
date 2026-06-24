// app/school/layout.tsx
'use client';

import { usePathname } from 'next/navigation';
import SchoolNavbar from '../../components/school/SchoolNavbar';
import SchoolFooter from '../../components/school/SchoolFooter';

export default function SchoolLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideChrome =
    pathname?.startsWith('/school/pathway') ||
    pathname?.startsWith('/school/portal') ||
    pathname?.startsWith('/school/student-portal');

  return (
    <div className="school-site">
      {!hideChrome && <SchoolNavbar />}
      {children}
      {!hideChrome && <SchoolFooter />}
    </div>
  );
}
