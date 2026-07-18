// Store d'articles : PostgreSQL en production, mémoire pour les tests.
import pg from "pg";

export function createMemoryStore() {
  const articles = [];
  let id = 0;
  return {
    async insert({ title, url, source, publishedAt }) {
      if (articles.some((a) => a.url === url)) return null; // déduplication
      const article = { id: ++id, title, url, source,
                        published_at: publishedAt ?? new Date().toISOString() };
      articles.unshift(article);
      return article;
    },
    async list({ source, limit = 50 } = {}) {
      return articles
        .filter((a) => !source || a.source === source)
        .slice(0, limit);
    },
    async sources() {
      return [...new Set(articles.map((a) => a.source))];
    },
  };
}

export async function createPgStore(connectionString) {
  const pool = new pg.Pool({ connectionString });
  await pool.query(`CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    source TEXT NOT NULL,
    published_at TIMESTAMPTZ DEFAULT now())`);
  return {
    async insert({ title, url, source, publishedAt }) {
      const { rows } = await pool.query(
        `INSERT INTO articles (title, url, source, published_at)
         VALUES ($1, $2, $3, COALESCE($4, now()))
         ON CONFLICT (url) DO NOTHING RETURNING *`,
        [title, url, source, publishedAt ?? null]);
      return rows[0] ?? null;
    },
    async list({ source, limit = 50 } = {}) {
      const { rows } = await pool.query(
        `SELECT * FROM articles
         WHERE ($1::text IS NULL OR source = $1)
         ORDER BY published_at DESC LIMIT $2`, [source ?? null, limit]);
      return rows;
    },
    async sources() {
      const { rows } = await pool.query("SELECT DISTINCT source FROM articles");
      return rows.map((r) => r.source);
    },
  };
}
