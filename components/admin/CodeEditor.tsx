'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const Monaco = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center bg-[#1e1e1e] text-gray-400 text-sm min-h-[420px]">
      Loading editor…
    </div>
  ),
});

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  minHeight?: number;
};

export default function CodeEditor({
  value,
  onChange,
  language = 'javascript',
  minHeight = 420,
}: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(minHeight);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateHeight = () => {
      const next = el.getBoundingClientRect().height;
      if (next >= minHeight) setHeight(Math.floor(next));
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, [minHeight]);

  return (
    <div
      ref={containerRef}
      className="border rounded-lg overflow-hidden bg-[#1e1e1e] h-full w-full"
      style={{ minHeight }}
    >
      <Monaco
        height={height}
        language={language}
        theme="vs-dark"
        value={value}
        onChange={(v) => onChange(v || '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          padding: { top: 12 },
        }}
      />
    </div>
  );
}
