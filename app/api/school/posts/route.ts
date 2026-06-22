import { NextRequest } from 'next/server';
import { and, desc, eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { jsonOk, handleAuthError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = Math.min(Number(searchParams.get('limit') || 12), 50);

    const db = getDb();
    const conditions = [eq(schema.schoolPosts.status, 'published')];
    if (category && ['news', 'activity', 'event'].includes(category)) {
      conditions.push(eq(schema.schoolPosts.category, category as 'news' | 'activity' | 'event'));
    }

    const posts = await db
      .select({
        id: schema.schoolPosts.id,
        title: schema.schoolPosts.title,
        excerpt: schema.schoolPosts.excerpt,
        content: schema.schoolPosts.content,
        imageUrl: schema.schoolPosts.imageUrl,
        category: schema.schoolPosts.category,
        publishedAt: schema.schoolPosts.publishedAt,
      })
      .from(schema.schoolPosts)
      .where(and(...conditions))
      .orderBy(desc(schema.schoolPosts.sortOrder), desc(schema.schoolPosts.publishedAt))
      .limit(limit);

    return jsonOk({ posts });
  } catch (error) {
    return handleAuthError(error);
  }
}
