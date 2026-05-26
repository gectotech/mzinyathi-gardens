'use client';

import dynamic from 'next/dynamic';

const Monaco = dynamic(() => import('@monaco-editor/react'), { ssr: false });

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
};

export default function CodeEditor({
  value,
  onChange,
  language = 'javascript',
  height = '400px',
}: CodeEditorProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
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
        }}
      />
    </div>
  );
}
