'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import MediaUploader from '@/components/admin/MediaUploader';
import { Copy, Trash2 } from 'lucide-react';

type Media = {
  id: string;
  secureUrl: string;
  originalName: string;
  resourceType: string;
  format: string | null;
  caption: string | null;
  showInGallery: boolean;
  createdAt: string;
};

export default function AdminMediaPage() {
  const [media, setMedia] = useState<Media[]>([]);

  const load = () => {
    fetch('/api/admin/media')
      .then((r) => r.json())
      .then((d) => setMedia(d.media || []));
  };

  useEffect(load, []);

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied');
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this file from Cloudinary?')) return;
    await fetch(`/api/admin/media?id=${id}`, { method: 'DELETE' });
    toast.success('Deleted');
    load();
  };

  const updateMedia = async (id: string, patch: { caption?: string; showInGallery?: boolean }) => {
    const res = await fetch('/api/admin/media', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...patch }),
    });
    if (res.ok) {
      toast.success('Updated');
      load();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Media Library</h1>
          <p className="text-gray-600 text-sm">Upload images and videos — toggle &quot;Show in gallery&quot; for the public school gallery page.</p>
        </div>
        <MediaUploader onUploaded={() => load()} />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {media.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              {item.resourceType === 'image' || item.resourceType === 'pdf' ? (
                item.resourceType === 'pdf' ? (
                  <div className="text-center p-4">
                    <p className="text-4xl">📄</p>
                    <p className="text-xs mt-2">PDF</p>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.secureUrl} alt={item.originalName} className="w-full h-full object-cover" />
                )
              ) : item.resourceType === 'video' ? (
                <video src={item.secureUrl} className="w-full h-full object-cover" controls />
              ) : (
                <div className="text-center p-4">
                  <p className="text-4xl">📁</p>
                  <p className="text-xs mt-2">{item.format || 'file'}</p>
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="text-sm font-medium truncate">{item.originalName}</p>
              <p className="text-xs text-gray-500">{item.resourceType} · {new Date(item.createdAt).toLocaleDateString()}</p>
              <input
                className="w-full border rounded px-2 py-1 text-xs mt-2"
                placeholder="Caption (optional)"
                defaultValue={item.caption || ''}
                onBlur={(e) => {
                  if (e.target.value !== (item.caption || '')) {
                    updateMedia(item.id, { caption: e.target.value });
                  }
                }}
              />
              <label className="flex items-center gap-2 mt-2 text-xs">
                <input
                  type="checkbox"
                  checked={item.showInGallery}
                  onChange={(e) => updateMedia(item.id, { showInGallery: e.target.checked })}
                />
                Show in public gallery
              </label>
              <div className="flex gap-2 mt-2">
                <button onClick={() => copyUrl(item.secureUrl)} className="text-[#4169E1] text-xs flex items-center gap-1">
                  <Copy size={14} /> Copy URL
                </button>
                <button onClick={() => remove(item.id)} className="text-red-600 text-xs flex items-center gap-1">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
