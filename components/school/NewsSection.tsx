'use client';

import Link from 'next/link';
import { useSchoolPosts } from '@/lib/use-school-posts';

export default function NewsSection() {
  const { posts } = useSchoolPosts(undefined, 4);

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-5xl font-bold text-[#001F6B]">News & Updates</h2>
          <p className="text-gray-600 mt-4">Follow our journey towards opening in 2027.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {posts.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-lg">
              <img src={item.imageUrl} alt={item.title} className="h-56 w-full object-cover" />
              <div className="p-6">
                <h3 className="font-bold text-xl text-[#001F6B]">{item.title}</h3>
                <p className="text-gray-600 mt-3">{item.excerpt}</p>
                <Link href="/school/news" className="inline-block mt-4 text-[#001F6B] font-bold">
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/school/news"
            className="bg-[#001F6B] text-white px-8 py-4 rounded-xl font-bold inline-block"
          >
            View All News & Updates
          </Link>
        </div>
      </div>
    </section>
  );
}
