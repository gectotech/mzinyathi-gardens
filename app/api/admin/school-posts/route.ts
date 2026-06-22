import { NextRequest } from 'next/server';
import { and, desc, eq, gte, lte } from 'drizzle-orm';
import { z } from 'zod';
import { getDb, schema } from '@/lib/db';
import { requirePermission, logAudit } from '@/lib/auth';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';

const postSchema = z.object({
  title: z.string().min(2),
  excerpt: z.string().min(4),
  content: z.string().optional(),
  imageUrl: z.string().min(1),
  category: z.enum(['news', 'activity', 'event']),
  status: z.enum(['draft', 'published']).optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET() {
  try {
    await requirePermission('school_content');
    const db = getDb();
    const posts = await db
      .select()
      .from(schema.schoolPosts)
      .orderBy(desc(schema.schoolPosts.sortOrder), desc(schema.schoolPosts.createdAt));
    return jsonOk({ posts });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requirePermission('school_content', true);
    const body = postSchema.parse(await request.json());
    const db = getDb();
    const [post] = await db
      .insert(schema.schoolPosts)
      .values({
        title: body.title,
        excerpt: body.excerpt,
        content: body.content || '',
        imageUrl: body.imageUrl,
        category: body.category,
        status: body.status || 'draft',
        sortOrder: body.sortOrder ?? 0,
        publishedAt: body.status === 'published' ? new Date() : null,
        updatedBy: user.id,
      })
      .returning();
    await logAudit(user.id, 'create', 'school_post', post.id);
    return jsonOk({ post }, 201);
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requirePermission('school_content', true);
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) return jsonError('Missing id');

    const db = getDb();
    const patch: Record<string, unknown> = { updatedAt: new Date(), updatedBy: user.id };
    if (updates.title) patch.title = updates.title;
    if (updates.excerpt) patch.excerpt = updates.excerpt;
    if (updates.content != null) patch.content = updates.content;
    if (updates.imageUrl) patch.imageUrl = updates.imageUrl;
    if (updates.category) patch.category = updates.category;
    if (updates.sortOrder != null) patch.sortOrder = updates.sortOrder;
    if (updates.status) {
      patch.status = updates.status;
      if (updates.status === 'published') patch.publishedAt = new Date();
    }

    const [post] = await db
      .update(schema.schoolPosts)
      .set(patch)
      .where(eq(schema.schoolPosts.id, id))
      .returning();

    await logAudit(user.id, 'update', 'school_post', id);
    return jsonOk({ post });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requirePermission('school_content', true);
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return jsonError('Missing id');

    const db = getDb();
    await db.delete(schema.schoolPosts).where(eq(schema.schoolPosts.id, id));
    await logAudit(user.id, 'delete', 'school_post', id);
    return jsonOk({ success: true });
  } catch (error) {
    return handleAuthError(error);
  }
}
