'use client';

import { useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SuperPagePreview() {
  const params = useParams();
  const slug = params.slug as string;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const publicUrl = slug === 'home' ? '/' : `/${slug}`;

  useEffect(() => {
    fetch(`/api/super/pages?slug=${slug}`)
      .then((r) => r.json())
      .then((d) => {
        const page = d.page;
        const iframe = iframeRef.current;
        if (!iframe || !page) return;

        const inject = () => {
          const doc = iframe.contentDocument;
          if (!doc) return;

          doc.querySelectorAll('[data-cms-preview]').forEach((el) => el.remove());

          if (page.customCss) {
            const style = doc.createElement('style');
            style.setAttribute('data-cms-preview', 'css');
            style.textContent = page.customCss;
            doc.head.appendChild(style);
          }

          if (page.customJs) {
            const script = doc.createElement('script');
            script.setAttribute('data-cms-preview', 'js');
            script.textContent = page.customJs;
            doc.body.appendChild(script);
          }

          const announcement = (page.sections as { announcement?: { enabled?: boolean; text?: string } })?.announcement;
          if (announcement?.enabled && announcement.text) {
            const bar = doc.createElement('div');
            bar.setAttribute('data-cms-preview', 'banner');
            bar.style.cssText = 'background:#4169E1;color:#fff;text-align:center;padding:10px 16px;font-size:14px;position:sticky;top:0;z-index:9999';
            bar.textContent = `[PREVIEW] ${announcement.text}`;
            doc.body.prepend(bar);
          }

          if (page.htmlContent) {
            const block = doc.createElement('div');
            block.setAttribute('data-cms-preview', 'html');
            block.className = 'container mx-auto px-4 py-8';
            block.innerHTML = page.htmlContent;
            doc.body.appendChild(block);
          }
        };

        iframe.addEventListener('load', inject);
        iframe.src = publicUrl;

        return () => iframe.removeEventListener('load', inject);
      });
  }, [slug, publicUrl]);

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col z-50">
      <div className="bg-[#1a1a2e] text-white px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link href={`/admin/super/pages/${slug}`} className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white">
            <ArrowLeft size={16} /> Back to editor
          </Link>
          <span className="text-sm font-medium">Draft preview — {slug}</span>
          <span className="text-xs bg-amber-500 text-black px-2 py-0.5 rounded">Unpublished changes shown</span>
        </div>
        <Link href={publicUrl} target="_blank" className="text-sm text-[#4169E1] hover:underline">
          Open live page →
        </Link>
      </div>
      <iframe ref={iframeRef} title="Page preview" className="flex-1 w-full border-0 bg-white" />
    </div>
  );
}
