import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { requirePermission, logAudit } from '@/lib/auth';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    await requirePermission('super_code');
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
    const user = await requirePermission('super_code', true);
    const body = await request.json();
    if (!body.slug || body.content === undefined) return jsonError('Missing slug or content');

    const publish = body.action === 'publish' || body.status === 'published';
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
          status: publish ? 'published' : 'draft',
          version: publish ? (existing.version || 1) + 1 : existing.version,
          updatedAt: new Date(),
          updatedBy: user.id,
        })
        .where(eq(schema.codeAssets.slug, body.slug))
        .returning();
      await logAudit(user.id, publish ? 'publish' : 'draft', 'code_asset', asset.id, {
        slug: body.slug,
      });
      return jsonOk({ asset });
    }

    const [asset] = await db
      .insert(schema.codeAssets)
      .values({
        slug: body.slug,
        name: body.name || body.slug,
        assetType: body.assetType || 'js',
        content: body.content,
        status: publish ? 'published' : 'draft',
        updatedBy: user.id,
      })
      .returning();

    await logAudit(user.id, publish ? 'publish' : 'create', 'code_asset', asset.id, {
      slug: body.slug,
    });
    return jsonOk({ asset }, 201);
  } catch (error) {
    return handleAuthError(error);
  }
}
