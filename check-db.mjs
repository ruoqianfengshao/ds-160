#!/usr/bin/env node
import { sql } from '@vercel/postgres';

console.log('Checking database connection...');
console.log('POSTGRES_URL:', process.env.POSTGRES_URL?.replace(/:[^:]*@/, ':***@'));

try {
  const result = await sql`SELECT NOW() as time`;
  console.log('✅ Database connected:', result.rows[0]);
  
  // Check users table
  const users = await sql`SELECT COUNT(*) as count FROM users`;
  console.log('Users table count:', users.rows[0].count);
  
  // Check profiles table
  const profiles = await sql`SELECT COUNT(*) as count FROM profiles`;
  console.log('Profiles table count:', profiles.rows[0].count);
  
} catch (error) {
  console.error('❌ Database error:', error.message);
  process.exit(1);
}
