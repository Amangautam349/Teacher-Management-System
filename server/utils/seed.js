// One-time setup script: creates the first Super Admin account.
// Run with: npm run seed  (from inside /server, after `npm install`
// and after you've applied database/schema.sql)
//
// Reads SEED_ADMIN_* values from .env so the real password is
// never hardcoded or committed to Git.

import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import pool from '../config/db.js';

dotenv.config();

async function seed() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const fullName = process.env.SEED_ADMIN_NAME || 'System Admin';

  if (!email || !password) {
    console.error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    console.log(`Admin "${email}" already exists — nothing to do.`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO users (full_name, email, password_hash, role) VALUES ($1, $2, $3, 'super_admin')`,
    [fullName, email.toLowerCase().trim(), passwordHash]
  );

  console.log(`Super Admin created: ${email}`);
  console.log('Log in with this email and the SEED_ADMIN_PASSWORD from your .env, then change it.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
