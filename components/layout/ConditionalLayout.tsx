'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import GlobalSiteAssets from '../GlobalSiteAssets';
import DynamicPageAssets from '../DynamicPageAssets';
import PageSectionsBanner from '../PageSectionsBanner';
import SiteEnhancements from '../motion/SiteEnhancements';

const slugMap: Record<string, string> = {
  '/': 'home',
  '/about': 'about',
  '/contact': 'contact',
  '/careers': 'careers',
  '/properties': 'properties',
  '/projects': 'projects',
  '/services': 'services',
  '/faq': 'faq',
};

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const isSchool = pathname.startsWith('/school');
  const pageSlug = slugMap[pathname];

  if (isAdmin || isSchool) {
    return <>{children}</>;
  }

  return (
    <SiteEnhancements>
      <GlobalSiteAssets />
      {pageSlug && <DynamicPageAssets slug={pageSlug} />}
      <Navbar />
      {pageSlug && <PageSectionsBanner slug={pageSlug} />}
      <main className="min-h-screen relative z-[1] overflow-x-hidden">{children}</main>
      <Footer />
    </SiteEnhancements>
  );
}
