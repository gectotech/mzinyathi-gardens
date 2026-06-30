import type { ReactNode } from 'react';

type DataTableShellProps = {
  children: ReactNode;
  className?: string;
};

export default function DataTableShell({ children, className = '' }: DataTableShellProps) {
  return (
    <div className={`table-scroll-shell ${className}`.trim()}>
      {children}
    </div>
  );
}
