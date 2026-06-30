'use client';

import type { ReactNode } from 'react';
import AmbientBackground from './AmbientBackground';
import PageTransition from './PageTransition';
import ScrollProgressBar from './ScrollProgressBar';
import ScrollRevealInit from './ScrollRevealInit';

type SiteEnhancementsProps = {
  children: ReactNode;
  enableAmbient?: boolean;
  enablePageTransition?: boolean;
};

export default function SiteEnhancements({
  children,
  enableAmbient = true,
  enablePageTransition = true,
}: SiteEnhancementsProps) {
  return (
    <>
      <ScrollProgressBar />
      {enableAmbient && <AmbientBackground />}
      <ScrollRevealInit />
      {enablePageTransition ? (
        <PageTransition>{children}</PageTransition>
      ) : (
        children
      )}
    </>
  );
}
