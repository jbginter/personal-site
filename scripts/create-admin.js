#!/usr/bin/env node
/**
 * Create or update an admin user.
 * Usage: node scripts/create-admin.js <username> <password>
 *
 * Run inside Docker:
 *   docker compose -f docker-compose.dev.yml exec app \
 *     node scripts/create-admin.js admin yourpassword
 */
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const [, , username, password] = process.argv;

if (!username || !password) {
  console.error('Usage: node scripts/create-admin.js <username> <password>');
  process.exit(1);
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const hash = await bcrypt.hash(password, 10);
  const { rows } = await pool.query(
    `INSERT INTO users (username, password_hash, role)
     VALUES ($1, $2, 'admin')
     ON CONFLICT (username) DO UPDATE SET password_hash = $2, role = 'admin'
     RETURNING id, username, role`,
    [username, hash]
  );
  console.log('✓ Admin user ready:', rows[0]);
  await pool.end();
}

main().catch((err) => { console.error(err); process.exit(1); });
