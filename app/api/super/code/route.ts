import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { requireAuth, logAudit } from '@/lib/auth';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    await requireAuth(['super_admin']);
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    const db = getDb();
    if (slug) {
      const [asset] = await db
        .select()
        .from(schema.codeAssets)
        .where(eq(schema.codeAssets.slug, slug))
        .limit(1);
      return jsonOk({ asset: asset || null });
    }

    const assets = await db.select().from(schema.codeAssets);
    return jsonOk({ assets });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(['super_admin']);
    const body = await request.json();
    if (!body.slug || !body.content) return jsonError('Missing slug or content');

    const db = getDb();
    const [existing] = await db
      .select()
      .from(schema.codeAssets)
      .where(eq(schema.codeAssets.slug, body.slug))
      .limit(1);

    if (existing) {
      const [asset] = await db
        .update(schema.codeAssets)
        .set({
          name: body.name ?? existing.name,
          content: body.content,
          assetType: body.assetType ?? existing.assetType,
          status: body.status ?? existing.status,
          version: (existing.version || 1) + 1,
          updatedAt: new Date(),
          updatedBy: user.id,
        })
        .where(eq(schema.codeAssets.slug, body.slug))
        .returning();
      await logAudit(user.id, 'update', 'code_asset', asset.id);
      return jsonOk({ asset });
    }

    const [asset] = await db
      .insert(schema.codeAssets)
      .values({
        slug: body.slug,
        name: body.name || body.slug,
        assetType: body.assetType || 'js',
        content: body.content,
        status: body.status || 'draft',
        updatedBy: user.id,
      })
      .returning();

    await logAudit(user.id, 'create', 'code_asset', asset.id);
    return jsonOk({ asset }, 201);
  } catch (error) {
    return handleAuthError(error);
  }
}
