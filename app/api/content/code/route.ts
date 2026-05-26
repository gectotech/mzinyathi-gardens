import { eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { jsonOk } from '@/lib/api-utils';

export async function GET() {
  try {
    const db = getDb();
    const assets = await db
      .select()
      .from(schema.codeAssets)
      .where(eq(schema.codeAssets.status, 'published'));

    const cssAsset = assets.find((a) => a.slug === 'global-css');
    const jsAsset = assets.find((a) => a.slug === 'global-js');

    return jsonOk({
      css: cssAsset?.content || '',
      js: jsAsset?.content || '',
      version: Math.max(cssAsset?.version || 0, jsAsset?.version || 0),
      updatedAt: [cssAsset?.updatedAt, jsAsset?.updatedAt]
        .filter(Boolean)
        .sort((a, b) => new Date(b!).getTime() - new Date(a!).getTime())[0]
        ?.toISOString(),
    });
  } catch {
    return jsonOk({ css: '', js: '', version: 0 });
  }
}
