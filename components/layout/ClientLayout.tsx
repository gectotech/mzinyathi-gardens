// components/layout/ClientLayout.tsx
'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't show navbar and footer on school pages and portal pages
  const isSchoolPage = pathname?.startsWith('/school');
  const isPortalPage = pathname?.startsWith('/school/pathway');

  // Hide navbar and footer for both school and portal pages
  const hideNavFooter = isSchoolPage || isPortalPage;

  return (
    <>
      {!hideNavFooter && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {!hideNavFooter && <Footer />}
    </>
  );
}