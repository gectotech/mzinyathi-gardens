'use client';

import { useSchoolPosts } from '@/lib/use-school-posts';
import PortalFeaturePage from '@/components/portal/PortalFeaturePage';

function formatEventDate(iso?: string | null) {
  if (!iso) return 'Date TBC';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function ParentCalendarPage() {
  const { posts, loading } = useSchoolPosts('event', 20);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-9 w-9 rounded-full border-2 border-[var(--color-nav-primary)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <PortalFeaturePage
      title="School Calendar"
      description="Term dates, events, and public holidays."
      icon="calendar"
      items={posts.map((post) => ({
        label: formatEventDate(post.publishedAt),
        value: post.title,
        meta: post.excerpt,
      }))}
      emptyTitle="No upcoming events"
      emptyDescription="School events will appear here when published."
    />
  );
}
