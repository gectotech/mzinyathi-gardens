import { NextRequest } from 'next/server';
import { count } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';
import { seedDatabase } from '@/lib/db/seed';

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const [result] = await db.select({ value: count() }).from(schema.users);
    const setupSecret = process.env.SETUP_SECRET;

    if ((result?.value ?? 0) > 0 && setupSecret) {
      const authHeader = request.headers.get('x-setup-secret');
      if (authHeader !== setupSecret) {
        return jsonError('Setup already completed', 403);
      }
    }

    const seedResult = await seedDatabase();
    return jsonOk(seedResult);
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function GET() {
  try {
    const db = getDb();
    const [result] = await db.select({ value: count() }).from(schema.users);
    return jsonOk({ initialized: (result?.value ?? 0) > 0 });
  } catch {
    return jsonOk({ initialized: false, error: 'Database not connected' });
  }
}
