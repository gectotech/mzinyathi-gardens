'use client';

import type { AnnouncementSection } from '@/lib/page-sections';

type AnnouncementFormProps = {
  value: AnnouncementSection;
  onChange: (value: AnnouncementSection) => void;
};

export default function AnnouncementForm({ value, onChange }: AnnouncementFormProps) {
  return (
    <div className="rounded-xl border bg-white p-5 space-y-4 overflow-y-auto h-full">
      <div>
        <h3 className="font-semibold text-gray-900">Site announcement banner</h3>
        <p className="text-xs text-gray-500 mt-1">Sticky banner at the top of this page when published.</p>
      </div>
      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={!!value.enabled}
          onChange={(e) => onChange({ ...value, enabled: e.target.checked })}
        />
        Show announcement on this page
      </label>
      <input
        className="w-full border rounded-lg px-3 py-2 text-sm"
        placeholder="Announcement text"
        value={value.text || ''}
        onChange={(e) => onChange({ ...value, text: e.target.value })}
      />
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          className="border rounded-lg px-3 py-2 text-sm"
          placeholder="Link URL (optional)"
          value={value.link || ''}
          onChange={(e) => onChange({ ...value, link: e.target.value })}
        />
        <input
          className="border rounded-lg px-3 py-2 text-sm"
          placeholder="Link label"
          value={value.linkLabel || ''}
          onChange={(e) => onChange({ ...value, linkLabel: e.target.value })}
        />
      </div>
      <select
        className="w-full border rounded-lg px-3 py-2 text-sm"
        value={value.style || 'info'}
        onChange={(e) => onChange({ ...value, style: e.target.value as AnnouncementSection['style'] })}
      >
        <option value="info">Blue (info)</option>
        <option value="success">Green (success)</option>
        <option value="warning">Amber (warning)</option>
      </select>
      {value.enabled && value.text && (
        <div
          className={`rounded-lg px-4 py-2 text-sm text-center text-white ${
            value.style === 'success' ? 'bg-green-600' : value.style === 'warning' ? 'bg-amber-500' : 'bg-[#4169E1]'
          }`}
        >
          {value.text}
          {value.link && <span className="underline ml-2">{value.linkLabel || 'Learn more'}</span>}
        </div>
      )}
    </div>
  );
}
