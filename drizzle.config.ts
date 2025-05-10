import type { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
  schema: './server/db/schema.ts',
  out: './server/db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.TURSO_DB_URL as string,
  },
} satisfies Config;
