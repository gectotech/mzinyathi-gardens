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

const fallbackNews: SchoolPostItem[] = [
  {
    id: '1',
    title: 'School Development Progress',
    excerpt: 'Construction and development works continue as we prepare for our 2027 opening.',
    imageUrl: '/school/schooldev.jpg',
    category: 'news',
  },
  {
    id: '2',
    title: '2027 Enrolment Applications Open',
    excerpt: 'Applications are now being accepted for ECD to Grade 7 learners.',
    imageUrl: '/school/student.jpg',
    category: 'news',
  },
  {
    id: '3',
    title: 'Staff Recruitment For 2027',
    excerpt: 'We are recruiting teachers, principal, cooks, cleaners and boarding staff.',
    imageUrl: '/school/staff.jpg',
    category: 'activity',
  },
  {
    id: '4',
    title: 'Kensington Campus Development',
    excerpt: 'The new Mzinyathi Gardens Primary School campus continues to take shape.',
    imageUrl: '/school/school1.jpg',
    category: 'news',
  },
];

export function useSchoolPosts(category?: string, limit = 12) {
  const [posts, setPosts] = useState<SchoolPostItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams({ limit: String(limit) });
    if (category) params.set('category', category);
    fetch(`/api/school/posts?${params}`)
      .then((r) => r.json())
      .then((d) => {
        const items = d.posts?.length ? d.posts : fallbackNews.filter((p) => !category || p.category === category);
        setPosts(items.slice(0, limit));
      })
      .catch(() => {
        setPosts(
          fallbackNews
            .filter((p) => !category || p.category === category)
            .slice(0, limit)
        );
      })
      .finally(() => setLoading(false));
  }, [category, limit]);

  return { posts, loading };
}
