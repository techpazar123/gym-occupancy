const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL ortam değişkeni tanımlanmamış');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function query(text, params) {
  return pool.query(text, params);
}

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY,
      max_capacity INTEGER NOT NULL DEFAULT 100,
      current_count INTEGER NOT NULL DEFAULT 0,
      CONSTRAINT settings_single_row CHECK (id = 1)
    );

    CREATE TABLE IF NOT EXISTS access_logs (
      id SERIAL PRIMARY KEY,
      card_id TEXT NOT NULL,
      type TEXT NOT NULL,
      timestamp TEXT NOT NULL
    );

    INSERT INTO settings (id, max_capacity, current_count)
    VALUES (1, 100, 0)
    ON CONFLICT (id) DO NOTHING;
  `);
}

module.exports = { query, pool, initDb };
