'use client';

import { useEffect, useMemo, useRef } from 'react';

type PreviewType = 'css' | 'javascript' | 'html' | 'json';

type LivePreviewPanelProps = {
  type: PreviewType;
  content: string;
  title?: string;
};

const SAMPLE_HTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;padding:24px;background:#f8fafc;color:#111}h1{color:#4169E1}.card{background:#fff;border-radius:12px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,.08)}</style></head>
<body><h1>Mzinyathi Gardens</h1><div class="card"><p>Preview sample content — your styles and scripts apply here.</p><button id="demo-btn">Demo Button</button></div></body></html>`;

export default function LivePreviewPanel({ type, content, title = 'Live Preview' }: LivePreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const parsedJson = useMemo(() => {
    if (type !== 'json') return null;
    try {
      return JSON.stringify(JSON.parse(content || '{}'), null, 2);
    } catch {
      return null;
    }
  }, [type, content]);

  useEffect(() => {
    if (type === 'html' || type === 'json') return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    if (type === 'css') {
      doc.open();
      doc.write(SAMPLE_HTML.replace('</head>', `<style id="cms-preview">${content}</style></head>`));
      doc.close();
    }

    if (type === 'javascript') {
      doc.open();
      doc.write(SAMPLE_HTML);
      doc.close();
      const script = doc.createElement('script');
      script.textContent = content;
      doc.body.appendChild(script);
    }
  }, [type, content]);

  return (
    <div className="flex flex-col h-full min-h-[420px] border rounded-lg overflow-hidden bg-white">
      <div className="px-4 py-2 border-b bg-gray-50 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">{title}</span>
        <span className="text-xs text-gray-400 uppercase tracking-wide">{type}</span>
      </div>
      <div className="flex-1 overflow-auto bg-gray-100 p-3">
        {type === 'html' && (
          <div
            className="bg-white rounded-lg p-4 min-h-[360px] shadow-sm prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: content || '<p class="text-gray-400">HTML preview will appear here…</p>' }}
          />
        )}
        {type === 'json' && (
          <pre className="bg-gray-900 text-green-400 text-xs p-4 rounded-lg overflow-auto min-h-[360px]">
            {parsedJson ?? (content || '{}')}
            {!parsedJson && content && (
              <span className="block text-red-400 mt-4">⚠ Invalid JSON — fix before publishing</span>
            )}
          </pre>
        )}
        {(type === 'css' || type === 'javascript') && (
          <iframe
            ref={iframeRef}
            title="CSS/JS preview"
            className="w-full h-[400px] bg-white rounded-lg border-0 shadow-sm"
            sandbox="allow-scripts"
          />
        )}
      </div>
    </div>
  );
}
