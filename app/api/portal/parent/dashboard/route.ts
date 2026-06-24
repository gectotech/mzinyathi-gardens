import { desc, eq } from 'drizzle-orm';
import { jsonOk, handleAuthError } from '@/lib/api-utils';
import { getDb, schema } from '@/lib/db';
import { requirePortalRole } from '@/lib/portal-api-helpers';
import { getParentChildProgress, formatShortDate } from '@/lib/portal-academics';
import { loadParentChildren } from '@/lib/portal-service';

export async function GET() {
  try {
    const { error, session } = await requirePortalRole('parent');
    if (error) return error;

    const children = await loadParentChildren(session!.email);
    const db = getDb();

    const events = await db
      .select({
        title: schema.schoolPosts.title,
        excerpt: schema.schoolPosts.excerpt,
        publishedAt: schema.schoolPosts.publishedAt,
      })
      .from(schema.schoolPosts)
      .where(eq(schema.schoolPosts.category, 'event'))
      .orderBy(desc(schema.schoolPosts.publishedAt))
      .limit(6);

    const upcomingEvents = events.map((e) => ({
      date: e.publishedAt ? formatShortDate(e.publishedAt) : 'TBC',
      event: e.title,
      meta: e.excerpt,
    }));

    const firstChild = children[0];
    const childProgress = firstChild
      ? await getParentChildProgress(
          firstChild.studentId,
          firstChild.grade,
          firstChild.name.split(' ')[0]
        )
      : { title: 'Term Progress', steps: [] };

    return jsonOk({ upcomingEvents, childProgress, children });
  } catch (err) {
    return handleAuthError(err);
  }
}
