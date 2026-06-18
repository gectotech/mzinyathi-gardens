// app/school/layout.tsx
'use client';

import { usePathname } from 'next/navigation';
import SchoolNavbar from '../../components/school/SchoolNavbar';
import SchoolFooter from '../../components/school/SchoolFooter';

export default function SchoolLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide school navbar and footer on portal pages
  const isPortalPage = pathname?.startsWith('/school/pathway');

  return (
    <div className="school-site">
      {!isPortalPage && <SchoolNavbar />}
      {children}
      {!isPortalPage && <SchoolFooter />}
    </div>
  );
}