import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Neon (and most managed Postgres) requires SSL. rejectUnauthorized:false
// is the common pattern for Neon's pooled connection strings in dev;
// tighten this for production if your provider gives you a CA bundle.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle Postgres client', err);
  process.exit(1);
});

export default pool;
