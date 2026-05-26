import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

function createDb() {
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }
  const sql = neon(connectionString);
  return drizzle(sql, { schema });
}

export type Db = ReturnType<typeof createDb>;

let dbInstance: Db | null = null;

export function getDb(): Db {
  if (!dbInstance) {
    dbInstance = createDb();
  }
  return dbInstance;
}

export { schema };
