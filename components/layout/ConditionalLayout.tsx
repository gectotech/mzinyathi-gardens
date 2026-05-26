'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import GlobalSiteAssets from '../GlobalSiteAssets';
import DynamicPageAssets from '../DynamicPageAssets';

const slugMap: Record<string, string> = {
  '/': 'home',
  '/about': 'about',
  '/contact': 'contact',
  '/careers': 'careers',
  '/properties': 'properties',
  '/projects': 'projects',
  '/services': 'services',
};

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const pageSlug = slugMap[pathname];

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <GlobalSiteAssets />
      {pageSlug && <DynamicPageAssets slug={pageSlug} />}
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
