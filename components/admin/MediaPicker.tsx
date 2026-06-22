'use client';

import { useEffect, useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';

type MediaItem = {
  id: string;
  secureUrl: string;
  originalName: string;
  resourceType: string;
  caption: string | null;
};

type MediaPickerProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  imagesOnly?: boolean;
};

export default function MediaPicker({ open, onClose, onSelect, imagesOnly = true }: MediaPickerProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);

  useEffect(() => {
    if (!open) return;
    fetch('/api/admin/media')
      .then((r) => r.json())
      .then((d) => setMedia(d.media || []));
  }, [open]);

  if (!open) return null;

  const items = imagesOnly ? media.filter((m) => m.resourceType === 'image') : media;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/50" onClick={onClose} aria-label="Close" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="font-semibold flex items-center gap-2">
            <ImageIcon size={18} className="text-[#4169E1]" /> Pick from Media Library
          </h3>
          <button type="button" onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 py-8">No images yet. Upload in Media Library first.</p>
          ) : (
            items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelect(item.secureUrl);
                  onClose();
                }}
                className="group rounded-xl overflow-hidden border-2 border-transparent hover:border-[#4169E1] transition text-left"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.secureUrl} alt="" className="w-full h-28 object-cover group-hover:scale-105 transition" />
                <p className="text-xs p-2 truncate text-gray-600">{item.originalName}</p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
