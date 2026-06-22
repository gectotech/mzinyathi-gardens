'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ImagePlus, Trash2 } from 'lucide-react';
import MediaPicker from './MediaPicker';
import type { GalleryImage } from '@/lib/page-sections';

type GalleryEditorProps = {
  enabled: boolean;
  heading: string;
  images: GalleryImage[];
  onChange: (patch: { enabled?: boolean; heading?: string; images?: GalleryImage[] }) => void;
};

type MediaItem = {
  id: string;
  secureUrl: string;
  originalName: string;
  resourceType: string;
  showInGallery: boolean;
  caption: string | null;
};

export default function GalleryEditor({ enabled, heading, images, onChange }: GalleryEditorProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const loadMedia = () => {
    fetch('/api/admin/media')
      .then((r) => r.json())
      .then((d) => setMedia(d.media || []));
  };

  useEffect(loadMedia, []);

  const togglePublicGallery = async (id: string, showInGallery: boolean) => {
    const res = await fetch('/api/admin/media', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, showInGallery }),
    });
    if (res.ok) {
      toast.success(showInGallery ? 'Added to school gallery' : 'Removed from school gallery');
      loadMedia();
    }
  };

  const addImage = (url: string) => {
    if (images.some((img) => img.url === url)) return;
    onChange({ images: [...images, { url, caption: '' }] });
  };

  const galleryMedia = media.filter((m) => m.showInGallery && m.resourceType === 'image');

  return (
    <div className="space-y-6 overflow-y-auto h-full pr-2">
      <div className="rounded-xl border bg-white p-5 space-y-4">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={enabled} onChange={(e) => onChange({ enabled: e.target.checked })} />
          Show gallery on this page
        </label>
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Gallery heading"
          value={heading}
          onChange={(e) => onChange({ heading: e.target.value })}
        />
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="inline-flex items-center gap-2 bg-[#4169E1] text-white px-4 py-2 rounded-lg text-sm"
        >
          <ImagePlus size={16} /> Add image to page gallery
        </button>
      </div>

      {images.length > 0 && (
        <div className="rounded-xl border bg-white p-5">
          <h3 className="font-semibold mb-4">Page gallery ({images.length})</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {images.map((img, i) => (
              <div key={img.url} className="border rounded-xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="w-full h-32 object-cover" />
                <div className="p-3 space-y-2">
                  <input
                    className="w-full border rounded px-2 py-1 text-xs"
                    placeholder="Caption"
                    value={img.caption || ''}
                    onChange={(e) => {
                      const next = [...images];
                      next[i] = { ...img, caption: e.target.value };
                      onChange({ images: next });
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => onChange({ images: images.filter((_, idx) => idx !== i) })}
                    className="text-red-600 text-xs flex items-center gap-1"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border bg-white p-5">
        <h3 className="font-semibold mb-1">School public gallery</h3>
        <p className="text-xs text-gray-500 mb-4">
          Images shown on <strong>/school/gallery</strong>. Toggle from your media library.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
          {media
            .filter((m) => m.resourceType === 'image')
            .map((item) => (
              <div key={item.id} className="border rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.secureUrl} alt="" className="w-full h-20 object-cover" />
                <label className="flex items-center gap-2 p-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.showInGallery}
                    onChange={(e) => togglePublicGallery(item.id, e.target.checked)}
                  />
                  School gallery
                </label>
              </div>
            ))}
        </div>
        {galleryMedia.length > 0 && (
          <p className="text-xs text-green-700 mt-3">{galleryMedia.length} image(s) live on school gallery</p>
        )}
      </div>

      <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={addImage} />
    </div>
  );
}
