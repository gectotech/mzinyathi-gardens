'use client';

import { useSchoolPosts } from '@/lib/use-school-posts';

export default function LatestNews() {
  const { posts } = useSchoolPosts('news', 3);

  return (
    <section className="pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-12">Latest News</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow">
              <img src={item.imageUrl} className="h-64 w-full object-cover" alt={item.title} />
              <div className="p-6">
                <h3 className="font-bold text-xl">{item.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{item.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
