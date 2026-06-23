'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

export type VirtualColumn<T> = {
  key: string;
  header: string;
  width?: string;
  render: (row: T) => ReactNode;
};

type VirtualDataTableProps<T> = {
  rows: T[];
  columns: VirtualColumn<T>[];
  rowHeight?: number;
  maxHeight?: number;
  getRowKey: (row: T) => string;
  stickyHeader?: boolean;
  emptyMessage?: string;
};

const DEFAULT_ROW_HEIGHT = 48;

export default function VirtualDataTable<T>({
  rows,
  columns,
  rowHeight = DEFAULT_ROW_HEIGHT,
  maxHeight = 520,
  getRowKey,
  stickyHeader = true,
  emptyMessage = 'No records found',
}: VirtualDataTableProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(maxHeight);

  const onScroll = useCallback(() => {
    if (containerRef.current) setScrollTop(containerRef.current.scrollTop);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setViewportHeight(el.clientHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const overscan = 6;
  const totalHeight = rows.length * rowHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const visibleCount = Math.ceil(viewportHeight / rowHeight) + overscan * 2;
  const endIndex = Math.min(rows.length, startIndex + visibleCount);
  const visibleRows = rows.slice(startIndex, endIndex);
  const offsetY = startIndex * rowHeight;

  const gridTemplate = columns.map((c) => c.width || '1fr').join(' ');

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      className="overflow-auto rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-primary)]"
      style={{ maxHeight }}
    >
      <div
        className={`grid gap-0 border-b border-[var(--color-border-default)] bg-[var(--color-bg-secondary)] text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)] ${
          stickyHeader ? 'sticky top-0 z-10' : ''
        }`}
        style={{ gridTemplateColumns: gridTemplate }}
      >
        {columns.map((col) => (
          <div key={col.key} className="px-4 py-3">
            {col.header}
          </div>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="px-4 py-12 text-center text-sm text-[var(--color-text-muted)]">{emptyMessage}</p>
      ) : (
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            {visibleRows.map((row) => (
              <div
                key={getRowKey(row)}
                className="grid border-b border-[var(--color-border-default)] text-sm hover:bg-[var(--color-bg-secondary)] transition-colors"
                style={{ gridTemplateColumns: gridTemplate, height: rowHeight }}
              >
                {columns.map((col) => (
                  <div key={col.key} className="flex items-center px-4 truncate">
                    {col.render(row)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
