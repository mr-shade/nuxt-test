import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import 'dotenv/config';
import { resolve } from 'path';

async function runMigration() {
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
  const db = drizzle(client);

  // Run migrations
  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: resolve('./server/db/migrations') });
  console.log('Migrations completed successfully!');

  // Close the client
  await client.close();
}

runMigration().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
