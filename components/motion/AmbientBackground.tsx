'use client';

import { usePrefersReducedMotion } from '@/lib/motion';

export default function AmbientBackground() {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) return null;

  return (
    <div
      className="ambient-bg pointer-events-none fixed inset-0 z-0 overflow-hidden hidden md:block"
      aria-hidden
    >
      <span className="ambient-shape ambient-shape-1" />
      <span className="ambient-shape ambient-shape-2" />
      <span className="ambient-shape ambient-shape-3" />
    </div>
  );
}
