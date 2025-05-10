import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';
import 'dotenv/config';

// Get environment variables
const tursoDbUrl = process.env.TURSO_DB_URL;
const tursoDbToken = process.env.TURSO_DB_TOKEN;

if (!tursoDbUrl || !tursoDbToken) {
  throw new Error('TURSO_DB_URL and TURSO_DB_TOKEN must be defined in environment variables');
}

// Create Turso client
const client = createClient({
  url: tursoDbUrl,
  authToken: tursoDbToken,
});

// Create Drizzle ORM instance
export const db = drizzle(client, { schema });
