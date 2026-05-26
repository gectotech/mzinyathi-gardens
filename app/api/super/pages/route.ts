import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { requireAuth, logAudit } from '@/lib/auth';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(['super_admin']);
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    const db = getDb();
    if (slug) {
      const [page] = await db
        .select()
        .from(schema.sitePages)
        .where(eq(schema.sitePages.slug, slug))
        .limit(1);
      return jsonOk({ page: page || null });
    }

    const pages = await db.select().from(schema.sitePages);
    return jsonOk({ pages });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(['super_admin']);
    const body = await request.json();
    if (!body.slug) return jsonError('Missing slug');

    const db = getDb();
    const [existing] = await db
      .select()
      .from(schema.sitePages)
      .where(eq(schema.sitePages.slug, body.slug))
      .limit(1);

    if (existing) {
      const [page] = await db
        .update(schema.sitePages)
        .set({
          title: body.title ?? existing.title,
          metaDescription: body.metaDescription ?? existing.metaDescription,
          sections: body.sections ?? existing.sections,
          customCss: body.customCss ?? existing.customCss,
          customJs: body.customJs ?? existing.customJs,
          htmlContent: body.htmlContent ?? existing.htmlContent,
          status: body.status ?? existing.status,
          version: (existing.version || 1) + 1,
          updatedAt: new Date(),
          updatedBy: user.id,
        })
        .where(eq(schema.sitePages.slug, body.slug))
        .returning();
      await logAudit(user.id, 'update', 'site_page', page.id);
      return jsonOk({ page });
    }

    const [page] = await db
      .insert(schema.sitePages)
      .values({
        slug: body.slug,
        title: body.title || body.slug,
        metaDescription: body.metaDescription,
        sections: body.sections || {},
        customCss: body.customCss || '',
        customJs: body.customJs || '',
        htmlContent: body.htmlContent || '',
        status: body.status || 'draft',
        updatedBy: user.id,
      })
      .returning();

    await logAudit(user.id, 'create', 'site_page', page.id);
    return jsonOk({ page }, 201);
  } catch (error) {
    return handleAuthError(error);
  }
}
