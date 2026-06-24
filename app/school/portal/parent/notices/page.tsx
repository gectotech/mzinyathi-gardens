'use client';

import { useSchoolPosts } from '@/lib/use-school-posts';
import PortalFeaturePage from '@/components/portal/PortalFeaturePage';

const CATEGORY_LABELS: Record<string, string> = {
  news: 'Notice',
  activity: 'Circular',
  event: 'Event',
};

function formatPostDate(iso?: string | null) {
  if (!iso) return undefined;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ParentNoticesPage() {
  const { posts, loading } = useSchoolPosts(undefined, 20);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-9 w-9 rounded-full border-2 border-[var(--color-nav-primary)] border-t-transparent animate-spin" />
      </div>
    );
  }

  const notices = posts.filter((p) => p.category === 'news' || p.category === 'activity');

  return (
    <PortalFeaturePage
      title="School Notices"
      description="Official announcements and circulars."
      icon="bell"
      items={notices.map((post) => ({
        label: post.title,
        value: CATEGORY_LABELS[post.category] || 'Notice',
        meta: formatPostDate(post.publishedAt) || post.excerpt,
      }))}
      emptyTitle="No notices yet"
      emptyDescription="School announcements will appear here when published."
    />
  );
}
