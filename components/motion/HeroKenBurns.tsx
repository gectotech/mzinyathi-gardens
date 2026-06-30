'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePrefersReducedMotion } from '@/lib/motion';

type HeroKenBurnsProps = {
  images: string[];
  altPrefix?: string;
  intervalMs?: number;
};

export default function HeroKenBurns({
  images,
  altPrefix = 'Hero',
  intervalMs = 5000,
}: HeroKenBurnsProps) {
  const [current, setCurrent] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (images.length <= 1 || reducedMotion) return;
    const timer = setInterval(
      () => setCurrent((prev) => (prev + 1) % images.length),
      intervalMs
    );
    return () => clearInterval(timer);
  }, [images.length, intervalMs, reducedMotion]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {images.map((img, idx) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className={`absolute inset-0 ${reducedMotion ? '' : 'hero-ken-burns'}`}
          >
            <Image
              src={img}
              alt={`${altPrefix} ${idx + 1}`}
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      ))}
    </div>
  );
}
