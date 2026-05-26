'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import CodeEditor from '@/components/admin/CodeEditor';
import { Save } from 'lucide-react';

type Asset = {
  slug: string;
  name: string;
  assetType: string;
  content: string;
  status: string;
};

const ASSETS = [
  { slug: 'global-css', label: 'Global CSS', language: 'css' },
  { slug: 'global-js', label: 'Global JavaScript', language: 'javascript' },
  { slug: 'site-config', label: 'Site Config (JSON)', language: 'json' },
];

export default function SuperCodeStudio() {
  const [active, setActive] = useState(ASSETS[0].slug);
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/super/code?slug=${active}`)
      .then((r) => r.json())
      .then((d) => setContent(d.asset?.content || ''));
  }, [active]);

  const save = async () => {
    setSaving(true);
    const asset = ASSETS.find((a) => a.slug === active);
    const res = await fetch('/api/super/code', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: active,
        name: asset?.label,
        assetType: active.includes('css') ? 'css' : active.includes('js') ? 'js' : 'config',
        content,
        status: 'published',
      }),
    });
    setSaving(false);
    if (res.ok) toast.success('Code saved — live on site');
    else toast.error('Save failed');
  };

  const current = ASSETS.find((a) => a.slug === active)!;

  return (
    <div className="space-y-4 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Global Code Studio</h1>
          <p className="text-sm text-gray-600">Edit site-wide code online — deployed instantly to all pages</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          <Save size={16} /> {saving ? 'Saving...' : 'Save & Deploy'}
        </button>
      </div>

      <div className="flex gap-2">
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

      <div className="flex-1 min-h-0">
        <CodeEditor
          value={content}
          onChange={setContent}
          language={current.language}
          height="100%"
        />
      </div>
    </div>
  );
}
