'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { usePrefersReducedMotion } from '@/lib/motion';

export default function ScrollRevealInit() {
  const pathname = usePathname();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const selectors = [
      'main section:not([data-no-reveal])',
      'main .reveal-on-scroll',
      '[data-reveal]',
    ].join(',');

    const elements = Array.from(document.querySelectorAll<HTMLElement>(selectors));

    elements.forEach((el, sectionIndex) => {
      if (el.dataset.revealInit === 'true') return;
      el.dataset.revealInit = 'true';
      el.classList.add('scroll-reveal');

      const gridItems = el.querySelectorAll<HTMLElement>(
        ':scope > div > .grid > *, :scope > .grid > *, :scope [data-stagger-item]'
      );

      if (gridItems.length > 0) {
        gridItems.forEach((item, i) => {
          item.classList.add('scroll-reveal-stagger');
          item.style.setProperty('--reveal-delay', `${i * 100}ms`);
        });
      } else {
        el.style.setProperty('--reveal-delay', `${Math.min(sectionIndex * 50, 300)}ms`);
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const targets = document.querySelectorAll<HTMLElement>(
      '.scroll-reveal, .scroll-reveal-stagger'
    );
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [pathname, reducedMotion]);

  return null;
}
