'use client';

import { useEffect, useState } from 'react';

export type SchoolPostItem = {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  imageUrl: string;
  category: string;
  publishedAt?: string | null;
};

export function useSchoolPosts(category?: string, limit = 12) {
  const [posts, setPosts] = useState<SchoolPostItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams({ limit: String(limit) });
    if (category) params.set('category', category);
    fetch(`/api/school/posts?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setPosts((d.posts || []).slice(0, limit));
      })
      .catch(() => {
        setPosts([]);
      })
      .finally(() => setLoading(false));
  }, [category, limit]);

  return { posts, loading };
}
