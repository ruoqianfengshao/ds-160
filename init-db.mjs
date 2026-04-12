import postgres from 'postgres';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

// Load .env.local
config({ path: '.env.local' });

if (!process.env.POSTGRES_URL) {
  console.error('❌ POSTGRES_URL not found in environment');
  process.exit(1);
}

const sql = postgres(process.env.POSTGRES_URL, {
  ssl: 'require',
  max: 1
});

const sqlScript = readFileSync('./vercel-postgres-schema.sql', 'utf-8');

try {
  console.log('🗄️  Initializing database schema...\n');
  await sql.unsafe(sqlScript);
  console.log('✅ Database schema created successfully!');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
} finally {
  await sql.end();
}
