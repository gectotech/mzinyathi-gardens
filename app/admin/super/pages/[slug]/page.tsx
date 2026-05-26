'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import CodeEditor from '@/components/admin/CodeEditor';
import { Save, Eye, Globe } from 'lucide-react';
import Link from 'next/link';

type Tab = 'sections' | 'css' | 'js' | 'html';

export default function SuperPageEditor() {
  const params = useParams();
  const slug = params.slug as string;
  const [tab, setTab] = useState<Tab>('sections');
  const [title, setTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [sections, setSections] = useState('{}');
  const [customCss, setCustomCss] = useState('');
  const [customJs, setCustomJs] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/super/pages?slug=${slug}`)
      .then((r) => r.json())
      .then((d) => {
        const page = d.page;
        if (page) {
          setTitle(page.title || slug);
          setMetaDescription(page.metaDescription || '');
          setSections(JSON.stringify(page.sections || {}, null, 2));
          setCustomCss(page.customCss || '');
          setCustomJs(page.customJs || '');
          setHtmlContent(page.htmlContent || '');
          setStatus(page.status || 'published');
        } else {
          setTitle(slug.charAt(0).toUpperCase() + slug.slice(1));
        }
      });
  }, [slug]);

  const save = async () => {
    setSaving(true);
    try {
      let parsedSections = {};
      try {
        parsedSections = JSON.parse(sections);
      } catch {
        toast.error('Invalid JSON in sections');
        setSaving(false);
        return;
      }

      const res = await fetch('/api/super/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          title,
          metaDescription,
          sections: parsedSections,
          customCss,
          customJs,
          htmlContent,
          status,
        }),
      });

      if (res.ok) {
        toast.success('Page saved and published online');
      } else {
        const d = await res.json();
        toast.error(d.error || 'Save failed');
      }
    } finally {
      setSaving(false);
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'sections', label: 'Content JSON' },
    { id: 'css', label: 'Custom CSS' },
    { id: 'js', label: 'Custom JS' },
    { id: 'html', label: 'HTML Blocks' },
  ];

  const previewUrl = slug === 'home' ? '/' : `/${slug}`;

  return (
    <div className="space-y-4 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Edit: {title || slug}</h1>
          <p className="text-sm text-gray-600">Online page editor — no IDE required</p>
        </div>
        <div className="flex gap-2">
          <Link href={previewUrl} target="_blank" className="inline-flex items-center gap-2 border px-4 py-2 rounded-md text-sm hover:bg-gray-50">
            <Globe size={16} /> Live Preview
          </Link>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 disabled:opacity-50"
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save & Publish'}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <input className="border rounded px-3 py-2" placeholder="Page title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="border rounded px-3 py-2 md:col-span-2" placeholder="Meta description" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
        <select className="border rounded px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="flex gap-2 border-b">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm border-b-2 -mb-px ${tab === t.id ? 'border-red-600 text-red-600 font-medium' : 'border-transparent text-gray-600'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 grid lg:grid-cols-2 gap-4">
        <div className="flex flex-col min-h-0">
          {tab === 'sections' && (
            <CodeEditor value={sections} onChange={setSections} language="json" height="100%" />
          )}
          {tab === 'css' && (
            <CodeEditor value={customCss} onChange={setCustomCss} language="css" height="100%" />
          )}
          {tab === 'js' && (
            <CodeEditor value={customJs} onChange={setCustomJs} language="javascript" height="100%" />
          )}
          {tab === 'html' && (
            <CodeEditor value={htmlContent} onChange={setHtmlContent} language="html" height="100%" />
          )}
        </div>
        <div className="bg-white border rounded-lg p-4 overflow-auto">
          <h3 className="font-semibold flex items-center gap-2 mb-3"><Eye size={16} /> Preview Notes</h3>
          <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
            <li><strong>Content JSON</strong> — structured data injected into pages (headlines, CTAs, hero text).</li>
            <li><strong>Custom CSS</strong> — styles applied live on the public page without redeploying.</li>
            <li><strong>Custom JS</strong> — scripts run on page load for interactions and analytics.</li>
            <li><strong>HTML Blocks</strong> — extra HTML rendered at the bottom of the page content area.</li>
          </ul>
          {htmlContent && (
            <div className="mt-4 border-t pt-4">
              <p className="text-xs font-medium text-gray-500 mb-2">HTML block preview:</p>
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
