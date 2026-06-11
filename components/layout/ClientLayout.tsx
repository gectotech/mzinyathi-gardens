// components/layout/ClientLayout.tsx

'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isSchoolPage = pathname.startsWith('/school');

  return (
    <>
      {!isSchoolPage && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {!isSchoolPage && <Footer />}
    </>
  );
}