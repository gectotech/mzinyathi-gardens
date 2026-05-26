'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import CodeEditor from '@/components/admin/CodeEditor';
import LivePreviewPanel from '@/components/admin/LivePreviewPanel';
import { notifyCmsUpdated } from '@/lib/cms-events';
import { Save, Upload, Globe, ExternalLink, Clock } from 'lucide-react';

type Tab = 'sections' | 'css' | 'js' | 'html';

type PageMeta = {
  status: string;
  version: number;
  updatedAt?: string;
};

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
  const [meta, setMeta] = useState<PageMeta>({ status: 'draft', version: 1 });
  const [savedSnapshot, setSavedSnapshot] = useState('');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const snapshot = () =>
    JSON.stringify({ title, metaDescription, sections, customCss, customJs, htmlContent });

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
          setMeta({
            status: page.status || 'draft',
            version: page.version || 1,
            updatedAt: page.updatedAt,
          });
        } else {
          setTitle(slug.charAt(0).toUpperCase() + slug.slice(1));
        }
        setTimeout(() => setSavedSnapshot(snapshot()), 0);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const isDirty = snapshot() !== savedSnapshot;

  const buildPayload = (action: 'draft' | 'publish') => {
    let parsedSections = {};
    try {
      parsedSections = JSON.parse(sections);
    } catch {
      throw new Error('Invalid JSON in sections');
    }
    return {
      slug,
      title,
      metaDescription,
      sections: parsedSections,
      customCss,
      customJs,
      htmlContent,
      action,
    };
  };

  const saveDraft = async () => {
    setSaving(true);
    try {
      const payload = buildPayload('draft');
      const res = await fetch('/api/super/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const d = await res.json();
        setMeta({ status: d.page.status, version: d.page.version, updatedAt: d.page.updatedAt });
        setSavedSnapshot(snapshot());
        toast.success('Draft saved');
      } else {
        const d = await res.json();
        toast.error(d.error || 'Save failed');
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const publish = async () => {
    setPublishing(true);
    try {
      const payload = buildPayload('publish');
      const res = await fetch('/api/super/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const d = await res.json();
        setMeta({ status: d.page.status, version: d.page.version, updatedAt: d.page.updatedAt });
        setSavedSnapshot(snapshot());
        notifyCmsUpdated({ slug, type: 'page' });
        toast.success('Published — live on site now');
      } else {
        const d = await res.json();
        toast.error(d.error || 'Publish failed');
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Publish failed');
    } finally {
      setPublishing(false);
    }
  };

  const tabs: { id: Tab; label: string; previewType: 'json' | 'css' | 'javascript' | 'html' }[] = [
    { id: 'sections', label: 'Content JSON', previewType: 'json' },
    { id: 'css', label: 'Custom CSS', previewType: 'css' },
    { id: 'js', label: 'Custom JS', previewType: 'javascript' },
    { id: 'html', label: 'HTML Blocks', previewType: 'html' },
  ];

  const previewContent = {
    sections,
    css: customCss,
    js: customJs,
    html: htmlContent,
  }[tab === 'js' ? 'js' : tab];

  const publicUrl = slug === 'home' ? '/' : `/${slug}`;

  return (
    <div className="space-y-4 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Edit: {title || slug}</h1>
          <p className="text-sm text-gray-600">Draft, preview, and publish page content online</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <span className={`px-2 py-0.5 rounded-full ${meta.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              {meta.status}
            </span>
            <span>v{meta.version}</span>
            {meta.updatedAt && (
              <span className="flex items-center gap-1">
                <Clock size={12} /> {new Date(meta.updatedAt).toLocaleString()}
              </span>
            )}
            {isDirty && <span className="text-amber-600 font-medium">Unsaved changes</span>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/super/preview/${slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 border px-4 py-2 rounded-md text-sm hover:bg-gray-50"
          >
            <Globe size={16} /> Full Preview
          </Link>
          <Link
            href={publicUrl}
            target="_blank"
            className="inline-flex items-center gap-2 border px-4 py-2 rounded-md text-sm hover:bg-gray-50"
          >
            <ExternalLink size={16} /> Live Site
          </Link>
          <button
            onClick={saveDraft}
            disabled={saving || !isDirty}
            className="inline-flex items-center gap-2 border px-4 py-2 rounded-md text-sm disabled:opacity-40"
          >
            <Save size={16} /> {saving ? 'Saving…' : 'Save Draft'}
          </button>
          <button
            onClick={publish}
            disabled={publishing}
            className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
          >
            <Upload size={16} /> {publishing ? 'Publishing…' : 'Publish Live'}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <input className="border rounded px-3 py-2" placeholder="Page title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="border rounded px-3 py-2 md:col-span-3" placeholder="Meta description" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
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
        <div className="min-h-[420px]">
          {tab === 'sections' && <CodeEditor value={sections} onChange={setSections} language="json" height="100%" />}
          {tab === 'css' && <CodeEditor value={customCss} onChange={setCustomCss} language="css" height="100%" />}
          {tab === 'js' && <CodeEditor value={customJs} onChange={setCustomJs} language="javascript" height="100%" />}
          {tab === 'html' && <CodeEditor value={htmlContent} onChange={setHtmlContent} language="html" height="100%" />}
        </div>
        <LivePreviewPanel
          type={tabs.find((t) => t.id === tab)!.previewType}
          content={previewContent}
          title={`${tabs.find((t) => t.id === tab)!.label} Preview`}
        />
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-900">
        <strong>Content JSON example</strong> — paste into Content JSON tab to show an announcement banner:
        <pre className="mt-2 text-xs bg-white p-3 rounded overflow-auto">{`{
  "announcement": {
    "enabled": true,
    "text": "Phase XI now available — enquire today!",
    "link": "/properties",
    "linkLabel": "View properties",
    "style": "info"
  }
}`}</pre>
      </div>
    </div>
  );
}
