import type { ReactNode } from 'react';

type PageContainerProps = {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article';
  narrow?: boolean;
};

export default function PageContainer({
  children,
  className = '',
  as: Tag = 'div',
  narrow = false,
}: PageContainerProps) {
  const widthClass = narrow ? 'max-w-4xl' : 'max-w-7xl';

  return (
    <Tag
      className={`${widthClass} mx-auto w-full px-4 sm:px-6 lg:px-8 ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
