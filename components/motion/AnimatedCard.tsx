'use client';

import type { ReactNode } from 'react';

type AnimatedCardProps = {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'li';
  hoverLift?: boolean;
  imageZoom?: boolean;
};

export default function AnimatedCard({
  children,
  className = '',
  as: Tag = 'div',
  hoverLift = true,
  imageZoom = true,
}: AnimatedCardProps) {
  const classes = [
    hoverLift ? 'interactive-card' : '',
    imageZoom ? 'interactive-card-image' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <Tag className={classes}>{children}</Tag>;
}
