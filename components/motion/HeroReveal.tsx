'use client';

import type { ReactNode } from 'react';
import { Children } from 'react';
import { motion } from 'framer-motion';
import {
  heroItemVariants,
  heroStaggerVariants,
  usePrefersReducedMotion,
} from '@/lib/motion';

type HeroRevealProps = {
  children: ReactNode;
  className?: string;
};

export default function HeroReveal({ children, className = '' }: HeroRevealProps) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const items = Children.toArray(children);

  return (
    <motion.div
      className={className}
      variants={heroStaggerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((child, i) => (
        <motion.div key={i} variants={heroItemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

export function HeroRevealItem({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const }}
    >
      {children}
    </motion.div>
  );
}
