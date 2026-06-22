'use client';

import { useEffect, useState } from 'react';

type GalleryItem = {
  id: string;
  secureUrl: string;
  resourceType: string;
  caption: string | null;
  originalName: string;
};

export default function SchoolGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    fetch('/api/gallery')
      .then((r) => r.json())
      .then((d) => setItems(d.items || []));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#001F6B]">School Gallery</h1>
          <p className="text-gray-600 mt-3">Photos and videos from Mzinyathi Gardens Primary School</p>
        </div>

        {items.length === 0 ? (
          <p className="text-center text-gray-500">Gallery items will appear here once added by administrators.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-lg">
                <div className="aspect-video bg-gray-100">
                  {item.resourceType === 'video' ? (
                    <video src={item.secureUrl} controls className="w-full h-full object-cover" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.secureUrl} alt={item.caption || item.originalName} className="w-full h-full object-cover" />
                  )}
                </div>
                {(item.caption || item.originalName) && (
                  <p className="p-4 text-sm text-gray-700">{item.caption || item.originalName}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
