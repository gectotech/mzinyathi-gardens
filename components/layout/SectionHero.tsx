'use client';

import type { ReactNode } from 'react';
import HeroKenBurns from '@/components/motion/HeroKenBurns';
import HeroReveal from '@/components/motion/HeroReveal';

type SectionHeroProps = {
  images: string[];
  altPrefix?: string;
  children: ReactNode;
  className?: string;
  overlayClassName?: string;
  minHeight?: 'default' | 'compact' | 'tall';
};

const heightMap = {
  compact: 'min-h-[50svh] sm:min-h-[55svh] lg:min-h-[60svh]',
  default: 'min-h-[55svh] sm:min-h-[65svh] lg:min-h-[75svh] max-h-[900px]',
  tall: 'min-h-[60svh] sm:min-h-[70svh] lg:min-h-[80svh] max-h-[960px]',
};

export default function SectionHero({
  images,
  altPrefix = 'Hero',
  children,
  className = '',
  overlayClassName = 'bg-gradient-to-r from-blue-900/70 to-red-900/60',
  minHeight = 'default',
}: SectionHeroProps) {
  return (
    <section
      className={`relative w-full overflow-hidden ${heightMap[minHeight]} ${className}`.trim()}
    >
      <HeroKenBurns images={images} altPrefix={altPrefix} />
      <div className={`absolute inset-0 z-10 ${overlayClassName}`} aria-hidden />
      <div className="relative z-20 h-full min-h-[inherit] flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <HeroReveal>{children}</HeroReveal>
        </div>
      </div>
    </section>
  );
}
