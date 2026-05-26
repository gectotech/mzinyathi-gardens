'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import CodeEditor from '@/components/admin/CodeEditor';
import LivePreviewPanel from '@/components/admin/LivePreviewPanel';
import { notifyCmsUpdated } from '@/lib/cms-events';
import { Save, Upload, RotateCcw, Clock } from 'lucide-react';

type AssetMeta = {
  status: string;
  version: number;
  updatedAt?: string;
};

const ASSETS = [
  { slug: 'global-css', label: 'Global CSS', language: 'css', previewType: 'css' as const, assetType: 'css' },
  { slug: 'global-js', label: 'Global JavaScript', language: 'javascript', previewType: 'javascript' as const, assetType: 'js' },
  { slug: 'site-config', label: 'Site Config (JSON)', language: 'json', previewType: 'json' as const, assetType: 'config' },
];

export default function SuperCodeStudio() {
  const [active, setActive] = useState(ASSETS[0].slug);
  const [content, setContent] = useState('');
  const [savedContent, setSavedContent] = useState('');
  const [meta, setMeta] = useState<AssetMeta>({ status: 'draft', version: 1 });
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const load = useCallback(() => {
    fetch(`/api/super/code?slug=${active}`)
      .then((r) => r.json())
      .then((d) => {
        const text = d.asset?.content || '';
        setContent(text);
        setSavedContent(text);
        setMeta({
          status: d.asset?.status || 'draft',
          version: d.asset?.version || 1,
          updatedAt: d.asset?.updatedAt,
        });
      });
  }, [active]);

  useEffect(() => {
    load();
  }, [load]);

  const current = ASSETS.find((a) => a.slug === active)!;
  const isDirty = content !== savedContent;

  const saveDraft = async () => {
    setSaving(true);
    const res = await fetch('/api/super/code', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: active,
        name: current.label,
        assetType: current.assetType,
        content,
        action: 'draft',
      }),
    });
    setSaving(false);
    if (res.ok) {
      const d = await res.json();
      setSavedContent(content);
      setMeta({ status: d.asset.status, version: d.asset.version, updatedAt: d.asset.updatedAt });
      toast.success('Draft saved');
    } else {
      toast.error('Draft save failed');
    }
  };

  const publish = async () => {
    if (current.previewType === 'json') {
      try {
        JSON.parse(content || '{}');
      } catch {
        toast.error('Fix invalid JSON before publishing');
        return;
      }
    }

    setPublishing(true);
    const res = await fetch('/api/super/code', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: active,
        name: current.label,
        assetType: current.assetType,
        content,
        action: 'publish',
      }),
    });
    setPublishing(false);
    if (res.ok) {
      const d = await res.json();
      setSavedContent(content);
      setMeta({ status: d.asset.status, version: d.asset.version, updatedAt: d.asset.updatedAt });
      notifyCmsUpdated({ type: 'code' });
      toast.success('Published — live on site now');
    } else {
      toast.error('Publish failed');
    }
  };

  return (
    <div className="space-y-4 h-[calc(100vh-8rem)] flex flex-col overflow-hidden">
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold">Global Code Studio</h1>
          <p className="text-sm text-gray-600">Edit site-wide CSS, JavaScript, and config with live preview</p>
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
        <div className="flex gap-2">
          <button
            onClick={() => setContent(savedContent)}
            disabled={!isDirty}
            className="inline-flex items-center gap-2 border px-4 py-2 rounded-md text-sm disabled:opacity-40"
          >
            <RotateCcw size={16} /> Revert
          </button>
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

      <div className="flex gap-2 flex-wrap">
        {ASSETS.map((a) => (
          <button
            key={a.slug}
            onClick={() => setActive(a.slug)}
            className={`px-4 py-2 rounded-md text-sm ${active === a.slug ? 'bg-red-600 text-white' : 'bg-white border'}`}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-[480px] grid lg:grid-cols-2 gap-4 overflow-hidden">
        <div className="h-full min-h-[480px] overflow-hidden">
          <CodeEditor value={content} onChange={setContent} language={current.language} />
        </div>
        <div className="h-full min-h-[480px] overflow-hidden">
          <LivePreviewPanel type={current.previewType} content={content} title={`${current.label} Preview`} />
        </div>
      </div>
    </div>
  );
}
