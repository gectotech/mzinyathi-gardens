'use client';

import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/lib/motion';

export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (reducedMotion) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-[3px] pointer-events-none"
      aria-hidden
    >
      <div
        className="h-full bg-gradient-to-r from-[#4169E1] via-[#6366f1] to-[#DD3210] transition-[width] duration-150 ease-out will-change-[width]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
