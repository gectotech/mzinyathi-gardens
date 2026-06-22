'use client';

import { Plus, Trash2 } from 'lucide-react';
import type { PageTextContent } from '@/lib/page-sections';

type PageTextFormProps = {
  value: PageTextContent;
  onChange: (value: PageTextContent) => void;
};

export default function PageTextForm({ value, onChange }: PageTextFormProps) {
  const blocks = value.blocks || [];
  const cta = value.cta || {};

  const updateBlock = (index: number, patch: Partial<{ title: string; body: string }>) => {
    const next = [...blocks];
    next[index] = { ...next[index], ...patch };
    onChange({ ...value, blocks: next });
  };

  return (
    <div className="space-y-6 overflow-y-auto h-full pr-2">
      <div className="rounded-xl border bg-white p-5 space-y-4">
        <h3 className="font-semibold text-gray-900">Hero section</h3>
        <p className="text-xs text-gray-500">Main heading and subtitle shown at the top of your page content block.</p>
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Hero title (e.g. Welcome to Mzinyathi Gardens)"
          value={value.heroTitle || ''}
          onChange={(e) => onChange({ ...value, heroTitle: e.target.value })}
        />
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Hero subtitle"
          value={value.heroSubtitle || ''}
          onChange={(e) => onChange({ ...value, heroSubtitle: e.target.value })}
        />
      </div>

      <div className="rounded-xl border bg-white p-5 space-y-3">
        <h3 className="font-semibold text-gray-900">Introduction</h3>
        <textarea
          className="w-full border rounded-lg px-3 py-2 text-sm min-h-[100px]"
          placeholder="Opening paragraph for this page..."
          value={value.intro || ''}
          onChange={(e) => onChange({ ...value, intro: e.target.value })}
        />
      </div>

      <div className="rounded-xl border bg-white p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Content blocks</h3>
          <button
            type="button"
            onClick={() => onChange({ ...value, blocks: [...blocks, { title: '', body: '' }] })}
            className="inline-flex items-center gap-1 text-sm text-[#4169E1] hover:underline"
          >
            <Plus size={14} /> Add block
          </button>
        </div>
        {blocks.length === 0 && <p className="text-sm text-gray-500">Add sections with a title and body text.</p>}
        {blocks.map((block, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-2 bg-gray-50">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-500">Block {i + 1}</span>
              <button
                type="button"
                onClick={() => onChange({ ...value, blocks: blocks.filter((_, idx) => idx !== i) })}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <input
              className="w-full border rounded px-3 py-2 text-sm bg-white"
              placeholder="Section title"
              value={block.title}
              onChange={(e) => updateBlock(i, { title: e.target.value })}
            />
            <textarea
              className="w-full border rounded px-3 py-2 text-sm bg-white min-h-[80px]"
              placeholder="Section body text"
              value={block.body}
              onChange={(e) => updateBlock(i, { body: e.target.value })}
            />
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-white p-5 space-y-3">
        <h3 className="font-semibold text-gray-900">Call to action</h3>
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="CTA heading"
          value={cta.heading || ''}
          onChange={(e) => onChange({ ...value, cta: { ...cta, heading: e.target.value } })}
        />
        <textarea
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="CTA description"
          rows={2}
          value={cta.text || ''}
          onChange={(e) => onChange({ ...value, cta: { ...cta, text: e.target.value } })}
        />
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            className="border rounded-lg px-3 py-2 text-sm"
            placeholder="Button label"
            value={cta.buttonLabel || ''}
            onChange={(e) => onChange({ ...value, cta: { ...cta, buttonLabel: e.target.value } })}
          />
          <input
            className="border rounded-lg px-3 py-2 text-sm"
            placeholder="Button link (e.g. /contact)"
            value={cta.buttonLink || ''}
            onChange={(e) => onChange({ ...value, cta: { ...cta, buttonLink: e.target.value } })}
          />
        </div>
      </div>
    </div>
  );
}
